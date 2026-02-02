'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getAsaasSubscription, getSubscriptionPayments } from "@/lib/asaas";
import { revalidatePath } from "next/cache";

export async function checkSubscriptionStatusAction() {
    const session = await auth();
    const officeId = session?.user?.office_id;

    if (!officeId) {
        return { success: false, error: "Oficina não encontrada." };
    }

    try {
        const office = await prisma.office.findUnique({
            where: { id: officeId },
            include: { subscriptions: { orderBy: { created_at: 'desc' }, take: 1 } }
        });

        if (!office || office.subscriptions.length === 0) {
            return { success: false, message: "Nenhuma assinatura encontrada." };
        }

        const currentSub = office.subscriptions[0];

        if (!currentSub.asaas_subscription_id) {
            return { success: false, message: "ID da assinatura Asaas não encontrado." };
        }

        // 1. Fetch Subscription Status from Asaas
        const asaasSub = await getAsaasSubscription(currentSub.asaas_subscription_id);

        // 2. Map Asaas Status to DB Status
        // Asaas statuses: ACTIVE, EXPIRED, OVERDUE, RECEIVED, PENDING

        let newStatus = 'PENDING';
        if (asaasSub.status === 'ACTIVE') newStatus = 'ACTIVE';
        if (asaasSub.status === 'OVERDUE') newStatus = 'OVERDUE';
        if (asaasSub.status === 'EXPIRED') newStatus = 'INACTIVE'; // or EXPIRED

        // 3. Update DB
        const updatedSub = await prisma.subscription.update({
            where: { id: currentSub.id },
            data: {
                status: newStatus,
                next_billing_date: asaasSub.nextDueDate ? new Date(asaasSub.nextDueDate) : null
            }
        });

        // 4. Also update Office status
        await prisma.office.update({
            where: { id: officeId },
            data: {
                subscription_status: newStatus === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE' // Using the enum
            }
        });

        revalidatePath('/dashboard/settings');
        return { success: true, status: newStatus, nextDueDate: asaasSub.nextDueDate };

    } catch (error: any) {
        console.error("Check Subscription Error:", error);
        return { success: false, error: "Erro ao verificar assinatura: " + error.message };
    }
}
