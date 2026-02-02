import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import NewOrderForm from './form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function NewOrderPage() {
    const session = await auth();
    const officeId = session?.user?.office_id;

    // Fetch clients and vehicles
    // Optimization: In a real app, fetch vehicles via API when client is selected.
    // Here we will fetch all active data for simplicity as per requirements.
    const clients = await prisma.client.findMany({
        where: { office_id: officeId },
        orderBy: { name: 'asc' },
        select: { id: true, name: true, cpf_cnpj: true }
    });

    const vehicles = await prisma.vehicle.findMany({
        where: { office_id: officeId },
        select: { id: true, client_id: true, model: true, plate: true, brand: true }
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="mb-8">
                <Link href="/dashboard/orders" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Ordens
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Nova Ordem de Serviço</h1>
            </header>

            <div className="max-w-2xl bg-white rounded-lg shadow p-6">
                <NewOrderForm clients={clients} vehicles={vehicles} />
            </div>
        </div>
    );
}
