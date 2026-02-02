'use client';

import { useActionState, useState, useMemo } from 'react';
import { createServiceOrder } from '@/app/actions/service-orders';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Assuming standard Shadcn Textarea
import Link from 'next/link';



export default function NewOrderForm({ clients, vehicles }: { clients: any[], vehicles: any[] }) {
    const [state, dispatch, isPending] = useActionState(createServiceOrder, null);
    const [selectedClientId, setSelectedClientId] = useState('');

    const filteredVehicles = useMemo(() => {
        if (!selectedClientId) return [];
        return vehicles.filter(v => v.client_id === selectedClientId);
    }, [selectedClientId, vehicles]);

    return (
        <form action={dispatch} className="space-y-6">
            <div>
                <Label htmlFor="clientId">Cliente</Label>
                <select
                    id="clientId"
                    name="clientId"
                    required
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="">Selecione um cliente...</option>
                    {clients.map(client => (
                        <option key={client.id} value={client.id}>
                            {client.name} {client.cpf_cnpj ? `(${client.cpf_cnpj})` : ''}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <Label htmlFor="vehicleId">Veículo</Label>
                <select
                    id="vehicleId"
                    name="vehicleId"
                    required
                    disabled={!selectedClientId}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-400"
                >
                    <option value="">
                        {!selectedClientId ? 'Selecione um cliente primeiro...' : 'Selecione um veículo...'}
                    </option>
                    {filteredVehicles.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>
                            {vehicle.model} - {vehicle.plate}
                        </option>
                    ))}
                </select>

            </div>

            {selectedClientId && filteredVehicles.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm text-yellow-800">
                    <p>
                        Este cliente não possui veículos cadastrados.
                        <Link href="/dashboard/vehicles/new" className="underline ml-1 font-medium">Cadastrar agora</Link>
                    </p>
                </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
                <p>
                    <strong>Nota:</strong> Produtos e Serviços poderão ser adicionados na próxima etapa, após a criação da ordem.
                </p>
            </div>

            <div>
                <Label htmlFor="notes">Observações Iniciais</Label>
                <Textarea id="notes" name="notes" placeholder="Descreva o problema relatado..." />
            </div>

            {
                state?.error && (
                    <div className="text-red-500 text-sm">
                        {state.error}
                    </div>
                )
            }

            <div className="flex justify-end gap-3">
                <Link href="/dashboard/orders">
                    <Button variant="outline" type="button">Cancelar</Button>
                </Link>
                <Button type="submit" disabled={isPending || (!!selectedClientId && filteredVehicles.length === 0)}>
                    {isPending ? 'Criando OS...' : 'Criar Ordem de Serviço'}
                </Button>
            </div>
        </form >
    );
}
