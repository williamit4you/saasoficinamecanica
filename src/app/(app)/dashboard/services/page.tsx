import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function ServicesPage() {
    const session = await auth();
    const officeId = session?.user?.office_id;

    if (!officeId) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Acesso Restrito</h1>
                    <p className="mt-2 text-gray-500">Você precisa estar associado a uma oficina para acessar esta página.</p>
                </div>
            </div>
        )
    }

    const services = await prisma.service.findMany({
        where: { office_id: officeId },
        orderBy: { created_at: 'desc' }
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Serviços</h1>
                    <p className="text-sm text-gray-500">Mão de obra e tipos de serviço</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/services/import">
                        <Button variant="outline">
                            Importar
                        </Button>
                    </Link>
                    <Link href="/dashboard/services/new">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Serviço
                        </Button>
                    </Link>
                </div>
            </header>

            <div className="overflow-hidden rounded-lg bg-white shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Preço Base</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tempo Estimado</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {services.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                    Nenhum serviço cadastrado.
                                </td>
                            </tr>
                        ) : services.map((service) => (
                            <tr key={service.id}>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{service.name}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(service.price))}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{service.estimated_time || '-'}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <Link href={`/dashboard/services/${service.id}`} className="text-indigo-600 hover:text-indigo-900 cursor-pointer">
                                        Editar
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
