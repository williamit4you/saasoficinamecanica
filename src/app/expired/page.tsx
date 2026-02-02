import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ExpiredPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-lg border bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    Período de Teste Expirado
                </h1>

                <p className="text-gray-600">
                    Seu período de teste de 7 dias chegou ao fim. Para continuar utilizando o OficinaPRO, você precisa ativar uma assinatura.
                </p>

                <div className="mt-8 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <p className="font-semibold text-gray-900">Plano Pro</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">R$ 97,00<span className="text-sm font-normal text-gray-500">/mês</span></p>
                    </div>

                    <Link href="/checkout" className="block w-full">
                        <Button className="w-full bg-green-600 hover:bg-green-500">
                            Assinar Agora
                        </Button>
                    </Link>

                    <form action={async () => {
                        'use server';
                        const { signOut } = await import('@/auth');
                        await signOut({ redirectTo: '/login' });
                    }}>
                        <Button variant="outline" className="w-full">
                            Sair da conta
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
