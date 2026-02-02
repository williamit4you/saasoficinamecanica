'use client';

import { useActionState, useEffect } from 'react';
import { processCheckout } from '@/app/actions/checkout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
    const [state, dispatch, isPending] = useActionState(processCheckout, null);

    useEffect(() => {
        if (state?.redirectUrl) {
            window.location.href = state.redirectUrl;
        }
    }, [state]);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-8">
                    <Link
                        href="/"
                        className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para o início
                    </Link>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Cadastre sua Oficina
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Comece a usar o OficinaPRO hoje mesmo.
                    </p>

                    <form action={dispatch} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="officeName">Nome da Oficina</Label>
                                <Input id="officeName" name="officeName" required placeholder="Ex: Oficina do João" />
                            </div>

                            <div>
                                <Label htmlFor="name">Seu Nome</Label>
                                <Input id="name" name="name" required placeholder="Seu nome completo" />
                            </div>

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" required placeholder="seu@email.com" />
                            </div>

                            <div>
                                <Label htmlFor="cpfCnpj">CPF ou CNPJ</Label>
                                <Input id="cpfCnpj" name="cpfCnpj" required placeholder="000.000.000-00" />
                            </div>

                            <div>
                                <Label htmlFor="phone">Telefone</Label>
                                <Input id="phone" name="phone" required placeholder="(11) 99999-9999" />
                            </div>

                            <div>
                                <Label htmlFor="password">Senha de Acesso</Label>
                                <Input id="password" name="password" type="password" required minLength={6} />
                            </div>
                        </div>

                        {state?.error && (
                            <div className="text-red-500 text-sm text-center">
                                {state.error}
                            </div>
                        )}

                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-500" disabled={isPending}>
                            {isPending ? 'Processando...' : 'Ir para Pagamento (R$ 97,00)'}
                        </Button>

                        <div className="mt-4 text-center">
                            <Link href="/register/trial" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                                Quer testar antes? Experimente grátis por 7 dias
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
