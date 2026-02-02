import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function OfficesPage() {
    const session = await auth();

    const offices = await prisma.office.findMany({
        include: {
            users: {
                where: { role: 'admin_oficina' },
                take: 1
            },
            subscriptions: {
                take: 1,
                orderBy: { created_at: 'desc' }
            }
        },
        orderBy: { created_at: 'desc' }
    });

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-7xl">
                <header className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Oficinas</h1>
                        <p className="text-gray-600">Lista completa de oficinas cadastradas</p>
                    </div>
                    <div>
                        <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800">
                            &larr; Voltar ao Painel
                        </Link>
                    </div>
                </header>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Oficina / Admin
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Status Assinatura
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Plano
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Data de Cadastro
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Ações</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {offices.map((office) => {
                                const admin = office.users[0];
                                const sub = office.subscriptions[0];

                                return (
                                    <tr key={office.id}>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{office.name}</div>
                                            <div className="text-sm text-gray-500">{admin?.email}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${office.subscription_status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                                    office.subscription_status === 'TRIAL' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {office.subscription_status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {sub?.plan_name || 'N/A'}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {new Date(office.created_at).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                            {/* Actions will go here */}
                                            <a href="#" className="text-indigo-600 hover:text-indigo-900">Editar</a>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
