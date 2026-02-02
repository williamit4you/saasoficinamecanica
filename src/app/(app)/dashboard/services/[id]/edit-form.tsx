'use client';

import { useActionState } from 'react';
import { updateService } from '@/app/actions/services';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function EditServiceForm({ service }: { service: any }) {
    const updateWithId = updateService.bind(null, service.id);
    const [state, dispatch, isPending] = useActionState(updateWithId, null);

    return (
        <form action={dispatch} className="space-y-6">
            <div>
                <Label htmlFor="name">Nome do Serviço</Label>
                <Input
                    id="name"
                    name="name"
                    placeholder="Ex: Reforma Geral"
                    defaultValue={service.name}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="price">Valor Estimado (R$)</Label>
                    <Input
                        id="price"
                        name="price"
                        placeholder="0,00"
                        defaultValue={service.price.toString().replace('.', ',')}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="time">Tempo Estimado</Label>
                    <Input
                        id="time"
                        name="time"
                        placeholder="Ex: 2 horas"
                        defaultValue={service.estimated_time || ''}
                    />
                </div>
            </div>

            {state?.error && (
                <div className="text-red-500 text-sm">
                    {state.error}
                </div>
            )}

            <div className="flex justify-end gap-3">
                <Link href="/dashboard/services">
                    <Button variant="outline" type="button">Cancelar</Button>
                </Link>
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
            </div>
        </form>
    );
}
