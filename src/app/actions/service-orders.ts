'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function updateOrderTotal(orderId: string) {
    const items = await prisma.serviceOrderItem.findMany({
        where: { service_order_id: orderId }
    });

    const total = items.reduce((acc, item) => acc + Number(item.total_price), 0);

    await prisma.serviceOrder.update({
        where: { id: orderId },
        data: { total_value: total }
    });
}

export async function createServiceOrder(prevState: any, formData: FormData) {
    const session = await auth();
    const officeId = session?.user?.office_id;

    if (!officeId) {
        return { error: "Sem permissão." };
    }

    const clientId = formData.get('clientId') as string;
    const vehicleId = formData.get('vehicleId') as string;
    const notes = formData.get('notes') as string;

    if (!clientId || !vehicleId) {
        return { error: "Cliente e Veículo são obrigatórios." };
    }

    let orderId;
    try {
        const order = await prisma.serviceOrder.create({
            data: {
                office_id: officeId,
                client_id: clientId,
                vehicle_id: vehicleId,
                status: 'OPEN',
                notes,
                total_value: 0
            }
        });
        orderId = order.id;
    } catch (e: any) {
        return { error: "Erro ao criar OS: " + e.message };
    }

    redirect(`/dashboard/orders/${orderId}`);
}

export async function addItemToOrder(orderId: string, prevState: any, formData: FormData) {
    const session = await auth();
    const officeId = session?.user?.office_id;

    if (!officeId) return { error: "Sem permissão" };

    const type = formData.get('type') as 'PRODUCT' | 'SERVICE';
    const itemId = formData.get('itemId') as string;
    const quantity = parseInt(formData.get('quantity') as string || '1');

    if (!itemId) return { error: "Selecione um item." };

    try {
        let name = '';
        let unitPrice = 0;

        if (type === 'PRODUCT') {
            const product = await prisma.product.findUnique({ where: { id: itemId } });
            if (!product) return { error: "Produto não encontrado" };
            unitPrice = Number(product.price);
            name = product.name; // Not stored in item but good for debugging
        } else {
            const service = await prisma.service.findUnique({ where: { id: itemId } });
            if (!service) return { error: "Serviço não encontrado" };
            unitPrice = Number(service.price);
        }

        await prisma.serviceOrderItem.create({
            data: {
                service_order_id: orderId,
                type,
                product_id: type === 'PRODUCT' ? itemId : null,
                service_id: type === 'SERVICE' ? itemId : null,
                quantity,
                unit_price: unitPrice,
                total_price: unitPrice * quantity
            }
        });

        await updateOrderTotal(orderId);

    } catch (e: any) {
        return { error: "Erro ao adicionar item: " + e.message };
    }

    revalidatePath(`/dashboard/orders/${orderId}`);
    return { success: true };
}

export async function removeItemFromOrder(orderId: string, itemId: string) {
    // Ideally should be a server action form handling or bound args
    try {
        await prisma.serviceOrderItem.delete({
            where: { id: itemId }
        });
        await updateOrderTotal(orderId);
        revalidatePath(`/dashboard/orders/${orderId}`);
    } catch (e) {
        console.error(e);
    }
}

export async function updateOrderStatus(orderId: string, status: 'OPEN' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELED') {
    try {
        await prisma.serviceOrder.update({
            where: { id: orderId },
            data: { status }
        });
        revalidatePath(`/dashboard/orders/${orderId}`);
        revalidatePath(`/dashboard/orders`);
    } catch (e) {
        console.error(e);
    }
}
