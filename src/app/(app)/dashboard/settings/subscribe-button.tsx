'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createSubscriptionAction } from '@/app/actions/subscription-actions';
import { ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function SubscribeButton() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async () => {
        setIsLoading(true);
        try {
            const result = await createSubscriptionAction();
            if (result.success && result.paymentUrl) {
                toast.success("Assinatura criada! Redirecionando para pagamento...");
                // Open in new tab or redirect
                window.location.href = result.paymentUrl;
            } else {
                toast.error(result.error || "Erro ao criar assinatura.");
            }
        } catch (error) {
            toast.error("Erro inesperado.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button onClick={handleSubscribe} disabled={isLoading} className="bg-green-600 hover:bg-green-700 w-full md:w-auto text-lg py-6">
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processando...
                </>
            ) : (
                <>
                    Assinar Plano Pro
                    <ArrowRight className="ml-2 h-5 w-5" />
                </>
            )}
        </Button>
    );
}
