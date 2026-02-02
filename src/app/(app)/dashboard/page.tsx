import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { handleSignOut } from '@/app/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Car, Package, Wrench, FileText, CheckCircle, Clock } from "lucide-react";
import Link from 'next/link';
import { MonthFilter } from './month-filter';

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
    const session = await auth();
    const officeId = session?.user?.office_id;
    const { month } = await searchParams;

    if (!officeId) {
        return <div>Erro: Oficina não identificada.</div>;
    }

    // Date Filtering Logic
    const today = new Date();
    const currentMonth = month || today.toISOString().slice(0, 7); // YYYY-MM
    const [year, monthIndex] = currentMonth.split('-').map(Number);

    // Start of month
    const startDate = new Date(year, monthIndex - 1, 1);
    // End of month (start of next month)
    const endDate = new Date(year, monthIndex, 1);

    // Filter Condition
    const dateFilter = {
        created_at: {
            gte: startDate,
            lt: endDate
        }
    };

    // Parallel data fetching
    const [
        clientsCount,
        vehiclesCount,
        productsCount,
        servicesCount,
        totalOsMonth,
        inProgressOsMonth,
        finishedOsMonth
    ] = await Promise.all([
        prisma.client.count({ where: { office_id: officeId } }),
        prisma.vehicle.count({ where: { office_id: officeId } }),
        prisma.product.count({ where: { office_id: officeId } }),
        prisma.service.count({ where: { office_id: officeId } }),
        // Month Statistics
        prisma.serviceOrder.count({ where: { office_id: officeId, ...dateFilter } }),
        prisma.serviceOrder.count({ where: { office_id: officeId, status: 'IN_PROGRESS', ...dateFilter } }),
        prisma.serviceOrder.count({ where: { office_id: officeId, status: 'FINISHED', ...dateFilter } })
    ]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Visão Geral</h1>
                    <p className="text-sm text-gray-500">Bem-vindo de volta, {session?.user?.name}</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Filtrar mês:</span>
                    <MonthFilter />
                </div>
            </header>

            {/* Monthly OS Stats */}
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Monitoramento Mensal ({startDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })})</h2>
            <div className="grid gap-4 md:grid-cols-3 mb-8">
                <Card className="bg-blue-50 border-blue-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-700">Total O.S. (Mês)</CardTitle>
                        <FileText className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-900">{totalOsMonth}</div>
                    </CardContent>
                </Card>

                <Card className="bg-yellow-50 border-yellow-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-yellow-700">O.S. Em Andamento</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-900">{inProgressOsMonth}</div>
                    </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-700">O.S. Concluídas</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-900">{finishedOsMonth}</div>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-4">Cadastros Gerais</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{clientsCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Veículos</CardTitle>
                        <Car className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vehiclesCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Peças em Estoque</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{productsCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Serviços</CardTitle>
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{servicesCount}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h2>
                <div className="flex gap-4 flex-wrap">
                    <Link href="/dashboard/orders/new" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                        <FileText className="mr-2 h-4 w-4" />
                        Nova Ordem de Serviço
                    </Link>
                    <Link href="/dashboard/clients/new" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        <Users className="mr-2 h-4 w-4" />
                        Cadastrar Cliente
                    </Link>
                </div>
            </div>

        </div>
    );
}
