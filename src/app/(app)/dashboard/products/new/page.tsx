'use client';

import { useActionState } from 'react';
import { createProduct } from '@/app/actions/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewProductPage() {
    const [state, dispatch, isPending] = useActionState(createProduct, null);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="mb-8">
                <Link href="/dashboard/products" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Produtos
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Novo Produto</h1>
            </header>

            <div className="max-w-2xl bg-white rounded-lg shadow p-6">
                <form action={dispatch} className="space-y-6">
                    <div>
                        <Label htmlFor="name">Nome do Produto</Label>
                        <Input id="name" name="name" required placeholder="Ex: Óleo 5W30" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="price">Preço de Venda (R$)</Label>
                            <Input id="price" name="price" required placeholder="0,00" step="0.01" />
                        </div>
                        <div>
                            <Label htmlFor="stock">Estoque Inicial</Label>
                            <Input id="stock" name="stock" type="number" placeholder="0" />
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
                            {isPending ? 'Salvando...' : 'Salvar Produto'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
