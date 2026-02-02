'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createClient(prevState: any, formData: FormData) {
    const session = await auth();
    const officeId = session?.user?.office_id;

    if (!officeId) {
        return { error: "Sem permissão." };
    }

    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const cpfCnpj = formData.get('cpfCnpj') as string;
    const address = formData.get('address') as string;

    if (!name) {
        return { error: "Nome é obrigatório." };
    }

    try {
        await prisma.client.create({
            data: {
                office_id: officeId,
                name,
                phone,
                email,
                cpf_cnpj: cpfCnpj,
                address
            }
        });
    } catch (e: any) {
        return { error: "Erro ao criar cliente: " + e.message };
    }

    revalidatePath('/dashboard/clients');
    redirect('/dashboard/clients');
}

export async function updateClient(id: string, prevState: any, formData: FormData) {
    const session = await auth();
    const officeId = session?.user?.office_id;

    if (!officeId) {
        return { error: "Sem permissão." };
    }

    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const cpfCnpj = formData.get('cpfCnpj') as string;
    const address = formData.get('address') as string;

    if (!name) {
        return { error: "Nome é obrigatório." };
    }

    try {
        await prisma.client.update({
            where: { id },
            data: {
                name,
                phone,
                email,
                cpf_cnpj: cpfCnpj,
                address
            }
        });
    } catch (e: any) {
        return { error: "Erro ao atualizar cliente: " + e.message };
    }

    revalidatePath('/dashboard/clients');
    redirect('/dashboard/clients');
}
