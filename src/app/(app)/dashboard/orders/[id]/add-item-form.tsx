'use client';

import { useActionState, useState } from 'react';
import { addItemToOrder } from '@/app/actions/service-orders';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function AddItemForm({ orderId, products, services }: { orderId: string, products: any[], services: any[] }) {
    // Bind orderId to the action
    const addItemWithid = addItemToOrder.bind(null, orderId);
    const [state, dispatch, isPending] = useActionState(addItemWithid, null);

    const [type, setType] = useState<'PRODUCT' | 'SERVICE'>('PRODUCT');

    return (
        <form action={dispatch} className="space-y-4">
            <input type="hidden" name="type" value={type} />

            <div className="flex rounded-md shadow-sm" role="group">
                <button
                    type="button"
                    onClick={() => setType('PRODUCT')}
                    className={`flex-1 px-4 py-2 text-sm font-medium border rounded-l-lg ${type === 'PRODUCT'
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    Peça / Produto
                </button>
                <button
                    type="button"
                    onClick={() => setType('SERVICE')}
                    className={`flex-1 px-4 py-2 text-sm font-medium border rounded-r-lg ${type === 'SERVICE'
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    Serviço / Mão de Obra
                </button>
            </div>

            <div>
                <Label htmlFor="itemId">{type === 'PRODUCT' ? 'Selecione o Produto' : 'Selecione o Serviço'}</Label>
                <select
                    id="itemId"
                    name="itemId"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 border py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="">Selecione...</option>
                    {type === 'PRODUCT' ? (
                        products.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.name} - R$ {Number(p.price).toFixed(2)} (Estoque: {p.stock_quantity})
                            </option>
                        ))
                    ) : (
                        services.map(s => (
                            <option key={s.id} value={s.id}>
                                {s.name} - R$ {Number(s.price).toFixed(2)}
                            </option>
                        ))
                    )}
                </select>
            </div>

            <div>
                <Label htmlFor="quantity">Quantidade</Label>
                <Input type="number" id="quantity" name="quantity" min="1" defaultValue="1" required />
            </div>

            {state?.error && (
                <div className="text-red-500 text-sm">
                    {state.error}
                </div>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Adicionando...' : 'Adicionar Item'}
            </Button>
        </form>
    );
}
