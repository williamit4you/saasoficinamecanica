import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function ClientsPage() {
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

    const clients = await prisma.client.findMany({
        where: { office_id: officeId },
        orderBy: { created_at: 'desc' },
        include: {
            _count: {
                select: { vehicles: true }
            }
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Clientes</h1>
                    <p className="text-sm text-gray-500">Base de clientes e proprietários</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/clients/import">
                        <Button variant="outline">
                            Importar
                        </Button>
                    </Link>
                    <Link href="/dashboard/clients/new">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Cliente
                        </Button>
                    </Link>
                </div>
            </header>

            <div className="overflow-hidden rounded-lg bg-white shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Contato</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Veículos</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Cadastrado em</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {clients.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                    Nenhum cliente cadastrado.
                                </td>
                            </tr>
                        ) : clients.map((client) => (
                            <tr key={client.id}>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{client.name}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    <div>{client.phone || '-'}</div>
                                    <div className="text-xs text-gray-400">{client.email}</div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{client._count.vehicles}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {new Date(client.created_at).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <Link href={`/dashboard/clients/${client.id}`} className="text-indigo-600 hover:text-indigo-900 cursor-pointer">
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
