'use client';

import { useActionState } from 'react';
import { updateClient } from '@/app/actions/clients';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function EditClientForm({ client }: { client: any }) {
    const updateWithId = updateClient.bind(null, client.id);
    const [state, dispatch, isPending] = useActionState(updateWithId, null);

    return (
        <form action={dispatch} className="space-y-6">
            <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                    id="name"
                    name="name"
                    placeholder="Ex: João da Silva"
                    defaultValue={client.name}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="phone">Telefone / WhatsApp</Label>
                    <Input
                        id="phone"
                        name="phone"
                        placeholder="(11) 99999-9999"
                        defaultValue={client.phone || ''}
                    />
                </div>
                <div>
                    <Label htmlFor="email">Email (Opcional)</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="cliente@email.com"
                        defaultValue={client.email || ''}
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="cpfCnpj">CPF / CNPJ</Label>
                <Input
                    id="cpfCnpj"
                    name="cpfCnpj"
                    placeholder="000.000.000-00"
                    defaultValue={client.cpf_cnpj || ''}
                />
            </div>

            <div>
                <Label htmlFor="address">Endereço Completo</Label>
                <Input
                    id="address"
                    name="address"
                    placeholder="Rua, Número, Bairro, Cidade - UF"
                    defaultValue={client.address || ''}
                />
            </div>

            {state?.error && (
                <div className="text-red-500 text-sm">
                    {state.error}
                </div>
            )}

            <div className="flex justify-end gap-3">
                <Link href="/dashboard/clients">
                    <Button variant="outline" type="button">Cancelar</Button>
                </Link>
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
            </div>
        </form>
    );
}
