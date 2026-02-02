import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import EditClientForm from './edit-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    const officeId = session?.user?.office_id;
    const { id } = await params;

    const client = await prisma.client.findUnique({
        where: { id }
    });

    if (!client || client.office_id !== officeId) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="mb-8">
                <Link href="/dashboard/clients" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Clientes
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Editar Cliente</h1>
            </header>

            <div className="max-w-2xl bg-white rounded-lg shadow p-6">
                <EditClientForm client={client} />
            </div>
        </div>
    );
}
