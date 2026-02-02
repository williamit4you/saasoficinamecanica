'use client';

import { useActionState } from 'react';
import { processTrialSignup } from '@/app/actions/trial';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function TrialPage() {
    const [state, dispatch, isPending] = useActionState(processTrialSignup, null);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6 text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            Teste Grátis por 7 Dias
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Acesso completo. Sem compromisso. Não precisa de cartão de crédito.
                        </p>
                    </div>

                    <form action={dispatch} className="space-y-6">
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

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500" disabled={isPending}>
                            {isPending ? 'Criando conta...' : 'Começar Agora'}
                        </Button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Ou prefere assinar já?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-3">
                            <Link href="/checkout" className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-50 border-blue-200">
                                Ir para Planos Pagos
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
