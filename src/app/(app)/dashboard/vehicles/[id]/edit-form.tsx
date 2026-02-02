'use client';

import { useActionState } from 'react';
import { updateVehicle } from '@/app/actions/vehicles';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function EditVehicleForm({ vehicle }: { vehicle: any }) {
    const updateWithId = updateVehicle.bind(null, vehicle.id);
    const [state, dispatch, isPending] = useActionState(updateWithId, null);

    return (
        <form action={dispatch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="plate">Placa</Label>
                    <Input
                        id="plate"
                        name="plate"
                        placeholder="ABC-1234"
                        defaultValue={vehicle.plate || ''}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="brand">Marca</Label>
                    <Input
                        id="brand"
                        name="brand"
                        placeholder="Ex: Fiat"
                        defaultValue={vehicle.brand || ''}
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="model">Modelo</Label>
                <Input
                    id="model"
                    name="model"
                    placeholder="Ex: Uno Vivace 1.0"
                    defaultValue={vehicle.model || ''}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="year">Ano Modelo</Label>
                    <Input
                        type="number"
                        id="year"
                        name="year"
                        placeholder="Ex: 2015"
                        defaultValue={vehicle.year || ''}
                    />
                </div>
                <div>
                    <Label htmlFor="color">Cor</Label>
                    <Input
                        id="color"
                        name="color"
                        placeholder="Ex: Prata"
                        defaultValue={vehicle.color || ''}
                    />
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
                    {isPending ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
            </div>
        </form>
    );
}
