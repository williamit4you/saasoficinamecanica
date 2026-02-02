'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProduct(prevState: any, formData: FormData) {
    const session = await auth();
    const officeId = session?.user?.office_id;

    if (!officeId) {
        return { error: "Sem permissão." };
    }

    const name = formData.get('name') as string;
    const price = formData.get('price') as string;
    const stock = formData.get('stock') as string;

    if (!name || !price) {
        return { error: "Nome e Preço são obrigatórios." };
    }

    try {
        await prisma.product.create({
            data: {
                office_id: officeId,
                name,
                price: parseFloat(price.replace(',', '.')), // Handle PT-BR format simple
                stock_quantity: parseInt(stock || '0'),
                active: true
            }
        });
    } catch (e: any) {
        return { error: "Erro ao criar produto: " + e.message };
    }

    revalidatePath('/dashboard/products');
    redirect('/dashboard/products');
}

export async function updateProduct(id: string, prevState: any, formData: FormData) {
    const session = await auth();
    const officeId = session?.user?.office_id;

    if (!officeId) {
        return { error: "Sem permissão." };
    }

    // Validate ownership
    const product = await prisma.product.findUnique({
        where: { id }
    });

    if (!product || product.office_id !== officeId) {
        return { error: "Produto não encontrado." };
    }

    const name = formData.get('name') as string;
    const price = formData.get('price') as string;
    const stock = formData.get('stock') as string;

    try {
        await prisma.product.update({
            where: { id },
            data: {
                name,
                price: parseFloat(price.replace(',', '.')),
                stock_quantity: parseInt(stock || '0'),
            }
        });
    } catch (e: any) {
        return { error: "Erro ao atualizar produto: " + e.message };
    }

    revalidatePath('/dashboard/products');
    redirect('/dashboard/products');
}
