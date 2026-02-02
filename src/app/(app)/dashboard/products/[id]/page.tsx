import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import EditProductForm from './edit-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    const officeId = session?.user?.office_id;
    const { id } = await params;

    const product = await prisma.product.findUnique({
        where: { id }
    });

    if (!product || product.office_id !== officeId) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="mb-8">
                <Link href="/dashboard/products" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Produtos
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Editar Produto</h1>
            </header>

            <div className="max-w-2xl bg-white rounded-lg shadow p-6">
                <EditProductForm product={product} />
            </div>
        </div>
    );
}
