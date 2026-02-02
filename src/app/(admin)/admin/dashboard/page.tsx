import { auth } from '@/auth';
import { handleSignOut } from '@/app/lib/actions';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminDashboard() {
    const session = await auth();

    // 1. Fetch Stats
    const totalOffices = await prisma.office.count();
    const activeOffices = await prisma.office.count({
        where: { subscription_status: 'ACTIVE' }
    });

    // Calculate MRR (Monthly Recurring Revenue)
    // Sum of value of all ACTIVE subscriptions
    const activeSubscriptions = await prisma.subscription.findMany({
        where: { status: 'ACTIVE' },
        select: { value: true }
    });

    const mrr = activeSubscriptions.reduce((acc, sub) => {
        return acc + (Number(sub.value) || 0);
    }, 0);

    const pendingSubscriptions = await prisma.subscription.count({
        where: { status: 'PENDING' }
    });


    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-7xl">
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Painel do Administrador</h1>
                        <p className="text-gray-600">Bem-vindo, {session?.user?.name}</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/admin/offices">
                            <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500">
                                Gerenciar Oficinas
                            </button>
                        </Link>
                        <form action={handleSignOut}>
                            <button className="rounded-md bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-gray-50">
                                Sair
                            </button>
                        </form>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h3 className="text-lg font-medium text-gray-900">Total de Oficinas</h3>
                        <p className="mt-2 text-3xl font-bold text-gray-900">{totalOffices}</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h3 className="text-lg font-medium text-gray-900">Oficinas Ativas</h3>
                        <p className="mt-2 text-3xl font-bold text-blue-600">{activeOffices}</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h3 className="text-lg font-medium text-gray-900">MRR Mensal</h3>
                        <p className="mt-2 text-3xl font-bold text-green-600">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mrr)}
                        </p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h3 className="text-lg font-medium text-gray-900">Assinaturas Pendentes</h3>
                        <p className="mt-2 text-3xl font-bold text-orange-600">{pendingSubscriptions}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
