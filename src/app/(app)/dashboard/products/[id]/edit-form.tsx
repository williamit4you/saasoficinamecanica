'use client';

import { useActionState } from 'react';
import { updateProduct } from '@/app/actions/products';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function EditProductForm({ product }: { product: any }) {
    const updateWithId = updateProduct.bind(null, product.id);
    const [state, dispatch, isPending] = useActionState(updateWithId, null);

    return (
        <form action={dispatch} className="space-y-6">
            <div>
                <Label htmlFor="name">Nome do Produto</Label>
                <Input
                    id="name"
                    name="name"
                    placeholder="Ex: Óleo 10w40"
                    defaultValue={product.name}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="price">Preço de Venda (R$)</Label>
                    <Input
                        id="price"
                        name="price"
                        placeholder="0,00"
                        defaultValue={product.price.toString().replace('.', ',')}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="stock">Estoque Atual</Label>
                    <Input
                        type="number"
                        id="stock"
                        name="stock"
                        placeholder="0"
                        defaultValue={product.stock_quantity}
                    />
                </div>
            </div>

            {state?.error && (
                <div className="text-red-500 text-sm">
                    {state.error}
                </div>
            )}

            <div className="flex justify-end gap-3">
                <Link href="/dashboard/products">
                    <Button variant="outline" type="button">Cancelar</Button>
                </Link>
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
            </div>
        </form>
    );
}
