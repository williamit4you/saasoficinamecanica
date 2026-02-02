import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function VehiclesPage() {
    const session = await auth();
    const officeId = session?.user?.office_id;

    const vehicles = await prisma.vehicle.findMany({
        where: { office_id: officeId },
        orderBy: { created_at: 'desc' },
        include: {
            client: true
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Veículos</h1>
                    <p className="text-sm text-gray-500">Frota cadastrada na oficina</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/vehicles/import">
                        <Button variant="outline">
                            Importar
                        </Button>
                    </Link>
                    <Link href="/dashboard/vehicles/new">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Veículo
                        </Button>
                    </Link>
                </div>
            </header>

            <div className="overflow-hidden rounded-lg bg-white shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Modelo / Marca</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Placa</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Cliente (Dono)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ano / Cor</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {vehicles.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                    Nenhum veículo cadastrado.
                                </td>
                            </tr>
                        ) : vehicles.map((vehicle) => (
                            <tr key={vehicle.id}>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                    {vehicle.model} <span className="text-gray-500 font-normal">({vehicle.brand})</span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 font-mono bg-gray-50 rounded px-2 w-min border border-gray-200">
                                    {vehicle.plate}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-blue-600 hover:underline">
                                    <Link href={`/dashboard/clients?search=${vehicle.client.name}`}>
                                        {vehicle.client.name}
                                    </Link>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                    {vehicle.year} / {vehicle.color}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <Link href={`/dashboard/vehicles/${vehicle.id}`} className="text-indigo-600 hover:text-indigo-900 cursor-pointer">
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
