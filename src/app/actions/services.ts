'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createService(prevState: any, formData: FormData) {
    const session = await auth();
    const officeId = session?.user?.office_id;

    if (!officeId) {
        return { error: "Sem permissão." };
    }

    const name = formData.get('name') as string;
    const price = formData.get('price') as string;
    const time = formData.get('time') as string;

    if (!name || !price) {
        return { error: "Nome e Preço são obrigatórios." };
    }

    try {
        await prisma.service.create({
            data: {
                office_id: officeId,
                name,
                price: parseFloat(price.replace(',', '.')),
                estimated_time: time,
                active: true
            }
        });
    } catch (e: any) {
        return { error: "Erro ao criar serviço: " + e.message };
    }

    revalidatePath('/dashboard/services');
    redirect('/dashboard/services');
}

export async function updateService(id: string, prevState: any, formData: FormData) {
    const session = await auth();
    const officeId = session?.user?.office_id;

    if (!officeId) {
        return { error: "Sem permissão." };
    }

    const name = formData.get('name') as string;
    const price = formData.get('price') as string;
    const time = formData.get('time') as string;

    if (!name || !price) {
        return { error: "Nome e Preço são obrigatórios." };
    }

    try {
        await prisma.service.update({
            where: { id },
            data: {
                name,
                price: parseFloat(price.replace(',', '.')),
                estimated_time: time
            }
        });
    } catch (e: any) {
        return { error: "Erro ao atualizar serviço: " + e.message };
    }

    revalidatePath('/dashboard/services');
    redirect('/dashboard/services');
}
