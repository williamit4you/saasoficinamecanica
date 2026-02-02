'use client';

import { useActionState, useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { authenticate } from '@/app/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

function LoginForm() {
    const [errorMessage, dispatch, isPending] = useActionState(
        authenticate,
        undefined,
    );
    const searchParams = useSearchParams();
    const isTrial = searchParams.get('trial') === 'true';

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-sm space-y-8 rounded-lg border bg-white p-8 shadow-sm">
                <Link
                    href="/"
                    className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para o início
                </Link>
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Acessar Sistema
                    </h1>
                    {isTrial && (
                        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md text-sm font-medium">
                            Conta criada! Faça login para iniciar seu teste grátis.
                        </div>
                    )}
                    <p className="mt-2 text-sm text-gray-600">
                        Entre com suas credenciais de administrador
                    </p>
                </div>

                <form action={dispatch} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="seu@email.com"
                                required
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="mt-1"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                Esqueceu a senha?
                            </a>
                        </div>
                    </div>

                    {errorMessage && (
                        <div
                            className="flex h-8 items-end space-x-1"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            <p className="text-sm text-red-500">{errorMessage}</p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending ? 'Entrando...' : 'Entrar'}
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <LoginForm />
        </Suspense>
    );
}
