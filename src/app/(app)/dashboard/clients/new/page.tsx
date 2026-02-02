'use client';

import { useActionState } from 'react';
import { createClient } from '@/app/actions/clients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewClientPage() {
    const [state, dispatch, isPending] = useActionState(createClient, null);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="mb-8">
                <Link href="/dashboard/clients" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Clientes
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Novo Cliente</h1>
            </header>

            <div className="max-w-2xl bg-white rounded-lg shadow p-6">
                <form action={dispatch} className="space-y-6">
                    <div>
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input id="name" name="name" required placeholder="Ex: Maria Silva" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="phone">Telefone / WhatsApp</Label>
                            <Input id="phone" name="phone" placeholder="(00) 00000-0000" />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="cliente@email.com" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="cpfCnpj">CPF / CNPJ</Label>
                            <Input id="cpfCnpj" name="cpfCnpj" placeholder="000.000.000-00" />
                        </div>
                        <div>
                            <Label htmlFor="address">Endereço</Label>
                            <Input id="address" name="address" placeholder="Rua, Número, Bairro" />
                        </div>
                    </div>

                    {state?.error && (
                        <div className="text-red-500 text-sm">
                            {state.error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <Link href="/dashboard/clients">
                            <Button variant="outline" type="button">Cancelar</Button>
                        </Link>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Salvando...' : 'Salvar Cliente'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
