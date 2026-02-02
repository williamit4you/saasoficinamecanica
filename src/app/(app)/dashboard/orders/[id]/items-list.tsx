'use client';

import { removeItemFromOrder } from '@/app/actions/service-orders';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export default function OrderItemsList({ order }: { order: any }) {

    // Fallback UI if no items
    if (!order.items || order.items.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">
                Nenhum item adicionado ainda.
            </div>
        );
    }

    const handleDelete = async (itemId: string) => {
        if (confirm('Remover este item?')) {
            await removeItemFromOrder(order.id, itemId);
        }
    };

    const isEditable = order.status === 'OPEN' || order.status === 'IN_PROGRESS';

    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Tipo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Qtd.
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Preço Unit.
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Total
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Ações</span>
                    </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
                {order.items.map((item: any) => {
                    const itemName = item.type === 'PRODUCT' ? item.product?.name : item.service?.name;
                    return (
                        <tr key={item.id}>
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                {itemName || 'Item deletado'}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                {item.type === 'PRODUCT' ? 'Peça' : 'Serviço'}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                {item.quantity}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.unit_price))}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.total_price))}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                {isEditable && (
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
