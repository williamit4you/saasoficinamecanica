import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import NewVehicleForm from './form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function NewVehiclePage() {
    const session = await auth();
    const officeId = session?.user?.office_id;

    // Fetch clients for dropdown
    const clients = await prisma.client.findMany({
        where: { office_id: officeId },
        orderBy: { name: 'asc' },
        select: { id: true, name: true, cpf_cnpj: true }
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="mb-8">
                <Link href="/dashboard/vehicles" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Veículos
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Novo Veículo</h1>
            </header>

            <div className="max-w-2xl bg-white rounded-lg shadow p-6">
                <NewVehicleForm clients={clients} />
            </div>
        </div>
    );
}
