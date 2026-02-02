import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function ProductsPage() {
    const session = await auth();
    const officeId = session?.user?.office_id;

    const products = await prisma.product.findMany({
        where: { office_id: officeId },
        orderBy: { created_at: 'desc' }
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Produtos</h1>
                    <p className="text-sm text-gray-500">Gerencie seu estoque e preços</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/products/import">
                        <Button variant="outline">
                            Importar
                        </Button>
                    </Link>
                    <Link href="/dashboard/products/new">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Produto
                        </Button>
                    </Link>
                </div>
            </header>

            <div className="overflow-hidden rounded-lg bg-white shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Preço</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Estoque</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                    Nenhum produto cadastrado.
                                </td>
                            </tr>
                        ) : products.map((product) => (
                            <tr key={product.id}>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(product.price))}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{product.stock_quantity}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <Link href={`/dashboard/products/${product.id}`} className="text-indigo-600 hover:text-indigo-900 cursor-pointer">
                                        Editar
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
