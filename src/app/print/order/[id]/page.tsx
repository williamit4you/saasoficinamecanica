import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PrintButton from './print-button';
import Link from 'next/link';

export default async function PrintOrderPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    const officeId = session?.user?.office_id;
    const { id } = await params;

    const order = await prisma.serviceOrder.findUnique({
        where: { id },
        include: {
            client: true,
            vehicle: true,
            office: true,
            items: {
                include: { product: true, service: true },
                orderBy: { type: 'asc' }
            }
        }
    });

    if (!order || order.office_id !== officeId) {
        notFound();
    }

    return (
        <div className="bg-white min-h-screen text-black p-8 max-w-4xl mx-auto">
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .no-print { display: none !important; }
                    body { -webkit-print-color-adjust: exact; }
                }
            `}} />

            <div className="flex justify-between items-start mb-8 no-print">
                <Link href={`/dashboard/orders/${order.id}`} className="text-blue-600 hover:underline">
                    &larr; Voltar para Detalhes
                </Link>
                <PrintButton />
            </div>

            {/* Header */}
            <div className="border-b-2 border-gray-800 pb-6 mb-6 flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-wide">{order.office.name}</h1>
                    <div className="text-sm mt-2 text-gray-600">
                        <p>{order.office.address || 'Endereço não cadastrado'}</p>
                        <p>{order.office.city || ''} - {order.office.state || ''}</p>
                        <p>Tel: {order.office.phone || '-'}</p>
                        <p>Email: {order.office.email || '-'}</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-bold text-gray-200">ORÇAMENTO</h2>
                    <p className="text-lg font-mono font-bold mt-2">OS #{order.id.substring(0, 8)}</p>
                    <p className="text-sm text-gray-500">Data: {new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
            </div>

            {/* Client & Vehicle */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 className="text-xs font-bold uppercase text-gray-400 mb-1">Cliente</h3>
                    <div className="text-sm font-medium">
                        <p className="text-lg">{order.client.name}</p>
                        <p>{order.client.cpf_cnpj ? `CPF/CNPJ: ${order.client.cpf_cnpj}` : ''}</p>
                        <p>{order.client.address}</p>
                        <p>{order.client.phone}</p>
                    </div>
                </div>
                <div>
                    <h3 className="text-xs font-bold uppercase text-gray-400 mb-1">Veículo</h3>
                    <div className="text-sm font-medium">
                        <p className="text-lg">{order.vehicle.model} - {order.vehicle.brand}</p>
                        <p>Placa: <span className="font-mono bg-gray-100 px-1 border rounded">{order.vehicle.plate}</span></p>
                        <p>Cor: {order.vehicle.color} / Ano: {order.vehicle.year}</p>
                    </div>
                </div>
            </div>

            {/* Items */}
            <div className="mb-8">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-300">
                            <th className="py-2 font-bold text-sm uppercase text-gray-600">Descrição</th>
                            <th className="py-2 font-bold text-sm uppercase text-gray-600 text-right">Qtd</th>
                            <th className="py-2 font-bold text-sm uppercase text-gray-600 text-right">Unitário</th>
                            <th className="py-2 font-bold text-sm uppercase text-gray-600 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map(item => (
                            <tr key={item.id} className="border-b border-gray-100">
                                <td className="py-3 text-sm">
                                    <span className="font-medium text-gray-900">
                                        {item.type === 'PRODUCT' ? item.product?.name : item.service?.name}
                                    </span>
                                    <span className="ml-2 text-xs text-gray-400 px-1.5 py-0.5 rounded border">
                                        {item.type === 'PRODUCT' ? 'PEÇA' : 'SERV'}
                                    </span>
                                </td>
                                <td className="py-3 text-sm text-right">{item.quantity}</td>
                                <td className="py-3 text-sm text-right">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.unit_price))}
                                </td>
                                <td className="py-3 text-sm text-right font-medium">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.total_price))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={3} className="pt-4 text-right font-bold text-lg">TOTAL</td>
                            <td className="pt-4 text-right font-bold text-lg">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(order.total_value))}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Notes */}
            {order.notes && (
                <div className="mb-8 border border-gray-200 rounded p-4 bg-gray-50">
                    <h3 className="text-xs font-bold uppercase text-gray-400 mb-2">Observações</h3>
                    <p className="text-sm whitespace-pre-wrap">{order.notes}</p>
                </div>
            )}

            {/* Signature */}
            <div className="mt-16 grid grid-cols-2 gap-12 text-center text-xs text-gray-500">
                <div className="pt-8 border-t border-gray-400">
                    Assinatura da Oficina
                </div>
                <div className="pt-8 border-t border-gray-400">
                    Assinatura do Cliente
                </div>
            </div>

            <div className="mt-12 text-center text-xs text-gray-400 no-print">
                Gerado por OficinaPRO - Sistema de Gestão
            </div>
        </div>
    );
}
