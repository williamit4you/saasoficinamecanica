'use client';

import { updateOrderStatus } from '@/app/actions/service-orders';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function OrderStatusActions({ order }: { order: any }) {

    const handleStatusChange = async (status: 'OPEN' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELED') => {
        await updateOrderStatus(order.id, status);
    };

    if (order.status === 'FINISHED' || order.status === 'CANCELED') {
        return <div className="text-sm font-medium text-gray-500">Status final: {order.status}</div>;
    }

    return (
        <div className="flex gap-2 justify-end mt-2">
            {order.status === 'OPEN' && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Iniciar Serviço
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Iniciar Serviço?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tem certeza que deseja alterar o status para <strong>EM ANDAMENTO</strong>? Isso indicará que o serviço começou.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleStatusChange('IN_PROGRESS')}>
                                Confirmar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

            {order.status === 'IN_PROGRESS' && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            Finalizar OS
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Finalizar Ordem de Serviço?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tem certeza que deseja alterar o status para <strong>FINALIZADO</strong>? Certifique-se de que todos os itens foram conferidos.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleStatusChange('FINISHED')}>
                                Finalizar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                        Cancelar
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancelar Ordem de Serviço?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja <strong>CANCELAR</strong> esta ordem de serviço? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Voltar</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleStatusChange('CANCELED')}>
                            Sim, Cancelar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
