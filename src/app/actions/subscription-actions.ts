'use server';

import { createAsaasCustomer, createAsaasSubscription, getSubscriptionPayments } from "@/lib/asaas";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function createSubscriptionAction() {

    const session = await auth();
    const officeId = session?.user?.office_id;

    if (!officeId) {
        return { success: false, error: "Oficina não encontrada." };
    }

    try {
        const office = await prisma.office.findUnique({
            where: { id: officeId },
            include: { users: true } // Need user email/name for customer creation
        });

        if (!office) return { success: false, error: "Oficina não encontrada." };

        const adminUser = office.users[0]; // Assuming first user is admin/contact
        if (!adminUser) return { success: false, error: "Usuário admin não encontrado." };

        // 1. Check if Subscription already exists locally
        // For simplicity, we create a new one if none is active. 
        // In production you would check for duplicates more rigorously.

        // 2. Create Asaas Customer if not exists (we normally store this on office, let's assume we need to create/update or check if we stored it)
        // Schema has `subscriptions` with `asaas_customer_id`, but it should probably be on Office. 
        // Let's check if we have a subscription with a customer_id, or just create a new customer.

        // Optimize: Check if we have an existing subscription with customer_id
        let customerId = '';
        const existingSub = await prisma.subscription.findFirst({
            where: { office_id: officeId },
            orderBy: { created_at: 'desc' }
        });

        if (existingSub?.asaas_customer_id) {
            customerId = existingSub.asaas_customer_id;
        } else {
            // Create new customer
            const cnpj = office.cnpj ? office.cnpj.replace(/\D/g, '') : '';
            // @ts-ignore - cpf might not be in the generated type yet
            const cpf = office.cpf ? office.cpf.replace(/\D/g, '') : '';
            const document = cnpj || cpf;

            if (!document) {
                return { success: false, error: "CPF ou CNPJ não cadastrado. Vá em configurações e atualize os dados da oficina." };
            }

            const asaasCustomer = await createAsaasCustomer({
                name: office.name,
                email: office.email || adminUser.email,
                cpfCnpj: document,
                phone: office.phone || undefined
            });
            customerId = asaasCustomer.id;
        }

        // 3. Create Asaas Subscription
        // Monthly Plan - R$ 97.00 (Example)
        const subscriptionData = {
            customer: customerId,
            value: 97.00,
            nextDueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
            cycle: 'MONTHLY' as const,
            description: 'Assinatura Plano Pro - SaaS Oficina'
        };

        const asaasSub = await createAsaasSubscription(subscriptionData);

        // 4. Save to Database
        await prisma.subscription.create({
            data: {
                office_id: officeId,
                asaas_customer_id: customerId,
                asaas_subscription_id: asaasSub.id,
                plan_name: 'Plano Pro',
                value: 97.00,
                status: 'PENDING',
                next_billing_date: new Date(subscriptionData.nextDueDate)
            }
        });

        // 5. Get Payment Link (The invoice for the first payment)
        // Subscription create response might not include the payment link for the *first* charge directly, 
        // usually we need to get the "payments" of this subscription.
        const payments = await getSubscriptionPayments(asaasSub.id);
        const firstPayment = payments.data[0];

        if (firstPayment) {
            return { success: true, paymentUrl: firstPayment.invoiceUrl || firstPayment.bankSlipUrl };
        } else {
            return { success: false, error: "Assinatura criada, mas boleto não gerado imediatamente. Verifique seu email." };
        }

    } catch (error: any) {
        console.error("Subscription Error:", error);
        return { success: false, error: "Erro ao criar assinatura: " + error.message };
    }
}
