import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function ServiceOrdersPage() {
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

    const orders = await prisma.serviceOrder.findMany({
        where: { office_id: officeId },
        orderBy: { created_at: 'desc' },
        include: {
            client: true,
            vehicle: true
        }
    });

    const statusMap: Record<string, string> = {
        'OPEN': 'Aberta',
        'IN_PROGRESS': 'Em Andamento',
        'FINISHED': 'Finalizada',
        'CANCELED': 'Cancelada'
    };

    const statusColor: Record<string, string> = {
        'OPEN': 'bg-blue-100 text-blue-800',
        'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
        'FINISHED': 'bg-green-100 text-green-800',
        'CANCELED': 'bg-gray-100 text-gray-800'
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Ordens de Serviço</h1>
                    <p className="text-sm text-gray-500">Gerencie os serviços da sua oficina</p>
                </div>
                <Link href="/dashboard/orders/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Nova OS
                    </Button>
                </Link>
            </header>

            <div className="overflow-hidden rounded-lg bg-white shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"># ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Cliente / Veículo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Valor Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Data</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                    Nenhuma OS encontrada.
                                </td>
                            </tr>
                        ) : orders.map((order) => (
                            <tr key={order.id}>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-gray-500">
                                    {order.id.substring(0, 8)}...
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{order.client.name}</div>
                                    <div className="text-sm text-gray-500">{order.vehicle.model} ({order.vehicle.plate})</div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusColor[order.status]}`}>
                                        {statusMap[order.status]}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 font-medium">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(order.total_value))}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {new Date(order.created_at).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <Link href={`/dashboard/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-900">
                                        Abrir
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
