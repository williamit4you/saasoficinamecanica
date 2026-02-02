'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createVehicle(prevState: any, formData: FormData) {
    const session = await auth();
    const officeId = session?.user?.office_id;

    if (!officeId) {
        return { error: "Sem permissão." };
    }

    const clientId = formData.get('clientId') as string;
    const plate = formData.get('plate') as string;
    const brand = formData.get('brand') as string;
    const model = formData.get('model') as string;
    const year = formData.get('year') as string;
    const color = formData.get('color') as string;

    if (!clientId || !plate || !model) {
        return { error: "Cliente, Placa e Modelo são obrigatórios." };
    }

    try {
        await prisma.vehicle.create({
            data: {
                office_id: officeId,
                client_id: clientId,
                plate: plate.toUpperCase(),
                brand,
                model,
                year: year ? parseInt(year) : undefined,
                color
            }
        });
    } catch (e: any) {
        return { error: "Erro ao criar veículo: " + e.message };
    }

    revalidatePath('/dashboard/vehicles');
    redirect('/dashboard/vehicles');
}

export async function updateVehicle(id: string, prevState: any, formData: FormData) {
    const session = await auth();
    const officeId = session?.user?.office_id;

    if (!officeId) {
        return { error: "Sem permissão." };
    }

    const plate = formData.get('plate') as string;
    const brand = formData.get('brand') as string;
    const model = formData.get('model') as string;
    const year = formData.get('year') as string;
    const color = formData.get('color') as string;

    if (!plate || !model) {
        return { error: "Placa e Modelo são obrigatórios." };
    }

    try {
        await prisma.vehicle.update({
            where: { id },
            data: {
                plate: plate.toUpperCase(),
                brand,
                model,
                year: year ? parseInt(year) : undefined,
                color
            }
        });
    } catch (e: any) {
        return { error: "Erro ao atualizar veículo: " + e.message };
    }

    revalidatePath('/dashboard/vehicles');
    redirect('/dashboard/vehicles');
}
