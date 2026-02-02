import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import AddItemForm from './add-item-form';
import OrderStatusActions from './status-actions';
import OrderItemsList from './items-list';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    const officeId = session?.user?.office_id;
    const { id } = await params;

    const order = await prisma.serviceOrder.findUnique({
        where: { id },
        include: {
            client: true,
            vehicle: true,
            items: {
                include: { product: true, service: true },
                orderBy: { type: 'asc' } // Products first, then Services? Or just insertion order?
            }
        }
    });

    if (!order || order.office_id !== officeId) {
        notFound();
    }

    // Fetch active products and services for the dropdowns
    const products = await prisma.product.findMany({
        where: { office_id: officeId, active: true },
        orderBy: { name: 'asc' }
    });

    const services = await prisma.service.findMany({
        where: { office_id: officeId, active: true },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="mb-6">
                <Link href="/dashboard/orders" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Ordens
                </Link>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            OS #{order.id.substring(0, 8)}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            {order.client.name} • {order.vehicle.model} ({order.vehicle.plate})
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500">Valor Total</div>
                        <div className="text-3xl font-bold text-gray-900">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(order.total_value))}
                        </div>
                        <div className="mt-2 flex gap-2 justify-end">
                            <Link href={`/print/order/${order.id}`} target="_blank">
                                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                                    Imprimir OS
                                </button>
                            </Link>
                            <OrderStatusActions order={order} />
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Items List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Itens do Pedido</h3>
                        </div>
                        <OrderItemsList order={order} />
                    </div>
                </div>

                {/* Right Column: Add Items & Info */}
                <div className="space-y-6">
                    {order.status === 'OPEN' || order.status === 'IN_PROGRESS' ? (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Adicionar Item</h3>
                            <AddItemForm orderId={order.id} products={products} services={services} />
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                            Esta ordem está <strong>{order.status === 'FINISHED' ? 'Finalizada' : 'Cancelada'}</strong> e não pode ser editada.
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Observações</h3>
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">
                            {order.notes || "Nenhuma observação registrada."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
