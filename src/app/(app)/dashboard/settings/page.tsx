import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, CreditCard, User, Building, Clock } from 'lucide-react';
import Link from 'next/link';
import { SubscribeButton } from './subscribe-button';
import { OfficeSettingsForm } from '@/components/settings/office-settings-form';

export default async function SettingsPage() {
    const session = await auth();
    const officeId = session?.user?.office_id;

    if (!officeId) return <div>Acesso negado.</div>;

    // Auto-sync subscription on page load
    // In a high-traffic app we wouldn't await this directly or cache it
    const { checkSubscriptionStatusAction } = await import('@/app/actions/check-subscription');
    await checkSubscriptionStatusAction();

    // Re-fetch office after update
    const updatedOffice = await prisma.office.findUnique({
        where: { id: officeId },
        include: {
            users: true,
            subscriptions: {
                orderBy: { created_at: 'desc' },
                take: 1
            }
        }
    });

    if (!updatedOffice) return <div>Oficina não encontrada.</div>;

    const officeData = updatedOffice;

    const currentUser = officeData.users.find((u: any) => u.email === session?.user?.email) || officeData.users[0];


    // Trial / Valid until Logic
    const now = new Date();
    const trialEnd = officeData.trial_ends_at ? new Date(officeData.trial_ends_at) : null;
    let daysRemaining = 0;
    let isTrialActive = false;

    // Check main subscription validity
    const currentSub = officeData.subscriptions[0];
    const isSubscriptionActive = officeData.subscription_status === 'ACTIVE';
    let validUntil = null;

    if (isSubscriptionActive && currentSub?.next_billing_date) {
        validUntil = new Date(currentSub.next_billing_date);
    } else if (trialEnd && trialEnd > now) {
        isTrialActive = true;
        validUntil = trialEnd;
    }

    if (validUntil && validUntil > now) {
        const diffTime = Math.abs(validUntil.getTime() - now.getTime());
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center">
                    <Settings className="mr-3 h-8 w-8 text-gray-700" />
                    Configurações da Conta
                </h1>
                <p className="text-gray-500 mt-2">Gerencie seus dados e assinatura.</p>
            </header>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Profile Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <User className="mr-2 h-5 w-5 text-blue-600" />
                            Dados do Usuário
                        </CardTitle>
                        <CardDescription>Informações do usuário logado.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-2">
                            <label className="text-sm font-medium text-gray-500">Nome</label>
                            <div className="p-2 bg-gray-100 rounded-md">{currentUser.name}</div>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <label className="text-sm font-medium text-gray-500">Email</label>
                            <div className="p-2 bg-gray-100 rounded-md">{currentUser.email}</div>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <label className="text-sm font-medium text-gray-500">Função</label>
                            <div className="p-2 bg-gray-100 rounded-md">
                                <Badge variant="outline">{currentUser.role === 'admin_oficina' ? 'Administrador' : 'Colaborador'}</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Office Section (Editable) */}
                <OfficeSettingsForm office={{
                    id: officeData.id,
                    name: officeData.name,
                    cnpj: officeData.cnpj,
                    cpf: officeData.cpf,
                    phone: officeData.phone
                }} />

                {/* Subscription Section */}
                <Card className={`md:col-span-2 border-2 ${isSubscriptionActive ? 'border-green-200 bg-green-50' : (isTrialActive ? 'border-blue-200 bg-blue-50' : 'border-red-200 bg-red-50')}`}>
                    <CardHeader>
                        <CardTitle className="flex items-center text-xl">
                            <CreditCard className="mr-2 h-6 w-6" />
                            Assinatura e Plano
                        </CardTitle>
                        <CardDescription>Status atual da sua assinatura.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Status Atual</h3>
                                <div className="flex items-center gap-3">
                                    {isSubscriptionActive ? (
                                        <Badge className="bg-green-600 hover:bg-green-700 text-base px-4 py-1">Ativo - Plano Pro</Badge>
                                    ) : isTrialActive ? (
                                        <Badge className="bg-blue-600 hover:bg-blue-700 text-base px-4 py-1">Período Gratuito (Trial)</Badge>
                                    ) : (
                                        <Badge className="bg-red-600 hover:bg-red-700 text-base px-4 py-1">Expirado / Inativo</Badge>
                                    )}
                                </div>
                            </div>

                            {(isTrialActive || isSubscriptionActive) && (
                                <div className={`flex items-center gap-2 p-4 rounded-lg shadow-sm border ${isTrialActive ? 'bg-white border-blue-100' : 'bg-green-50 border-green-200'}`}>
                                    <Clock className={`h-5 w-5 ${isTrialActive ? 'text-blue-600' : 'text-green-600'}`} />
                                    <div>
                                        <p className="text-sm text-gray-500">{isTrialActive ? 'Teste Grátis Restante' : 'Renovação em'}</p>
                                        <p className={`text-2xl font-bold ${isTrialActive ? 'text-blue-700' : 'text-green-700'}`}>{daysRemaining} dias</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {!isSubscriptionActive && (
                            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900">Garanta o acesso contínuo</h3>
                                <p className="text-gray-600 mt-2 mb-4">
                                    Assine agora o <strong>Plano Pro</strong> por apenas <strong>R$ 97,00/mês</strong>.
                                    <br />
                                    Tenha acesso ilimitado a ordens de serviço, clientes e veículos.
                                    <br />
                                    <span className="text-sm text-gray-500">*Pagamento automático mensal via Boleto ou Cartão (configurado no checkout).</span>
                                </p>
                                <SubscribeButton />
                            </div>
                        )}

                        {isSubscriptionActive && (
                            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                <p className="text-green-700 font-medium">Sua assinatura está ativa e o pagamento automático está habilitado.</p>
                                <p className="text-sm text-gray-500 mt-1">Próxima cobrança estimada para o próximo mês.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
