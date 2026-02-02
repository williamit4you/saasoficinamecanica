import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import EditVehicleForm from './edit-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    const officeId = session?.user?.office_id;
    const { id } = await params;

    const vehicle = await prisma.vehicle.findUnique({
        where: { id },
        include: { client: true }
    });

    if (!vehicle || vehicle.office_id !== officeId) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="mb-8">
                <Link href="/dashboard/vehicles" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Veículos
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Editar Veículo</h1>
            </header>

            <div className="max-w-2xl bg-white rounded-lg shadow p-6">
                <div className="mb-6 bg-gray-50 p-4 rounded-md">
                    <h3 className="text-sm font-medium text-gray-700">Proprietário</h3>
                    <p className="text-lg font-bold text-gray-900">{vehicle.client.name}</p>
                </div>
                <EditVehicleForm vehicle={vehicle} />
            </div>
        </div>
    );
}
