'use client';

import { useActionState } from 'react';
import { createVehicle } from '@/app/actions/vehicles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function NewVehicleForm({ clients }: { clients: any[] }) {
    const [state, dispatch, isPending] = useActionState(createVehicle, null);

    return (
        <form action={dispatch} className="space-y-6">
            <div>
                <Label htmlFor="clientId">Proprietário (Cliente)</Label>
                <select
                    id="clientId"
                    name="clientId"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
                >
                    <option value="">Selecione um cliente...</option>
                    {clients.map(client => (
                        <option key={client.id} value={client.id}>
                            {client.name} {client.cpf_cnpj ? `(${client.cpf_cnpj})` : ''}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="brand">Marca</Label>
                    <Input id="brand" name="brand" placeholder="Ex: Chevrolet" />
                </div>
                <div>
                    <Label htmlFor="model">Modelo</Label>
                    <Input id="model" name="model" required placeholder="Ex: Onix 1.0" />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <Label htmlFor="plate">Placa</Label>
                    <Input id="plate" name="plate" required placeholder="ABC-1234" maxLength={8} className="uppercase" />
                </div>
                <div>
                    <Label htmlFor="year">Ano</Label>
                    <Input id="year" name="year" type="number" placeholder="2020" />
                </div>
                <div>
                    <Label htmlFor="color">Cor</Label>
                    <Input id="color" name="color" placeholder="Prata" />
                </div>
            </div>

            {state?.error && (
                <div className="text-red-500 text-sm">
                    {state.error}
                </div>
            )}

            <div className="flex justify-end gap-3">
                <Link href="/dashboard/vehicles">
                    <Button variant="outline" type="button">Cancelar</Button>
                </Link>
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Salvando...' : 'Salvar Veículo'}
                </Button>
            </div>
        </form>
    );
}
