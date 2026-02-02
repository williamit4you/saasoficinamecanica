import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const event = await request.json();

        // Asaas sends many events, we care about PAYMENT_CONFIRMED, PAYMENT_RECEIVED
        // event.event is the type
        // event.payment is the payment object

        const { event: eventType, payment } = event;

        if (eventType === 'PAYMENT_CONFIRMED' || eventType === 'PAYMENT_RECEIVED') {
            // Find subscription or payment linked to this
            // We stored asaas_subscription_id in Subscription table
            // But payment object has subscription field if it belongs to one.

            const asaasSubscriptionId = payment.subscription;

            if (asaasSubscriptionId) {
                // Update Office status to ACTIVE
                // Find subscription
                const subscription = await prisma.subscription.findFirst({
                    where: { asaas_subscription_id: asaasSubscriptionId }
                });

                if (subscription) {
                    await prisma.$transaction([
                        // Update Subscription Status
                        prisma.subscription.update({
                            where: { id: subscription.id },
                            data: {
                                status: 'ACTIVE',
                                next_billing_date: new Date(payment.dueDate) // Adjust as needed
                            }
                        }),
                        // Update Office Status
                        prisma.office.update({
                            where: { id: subscription.office_id },
                            data: { subscription_status: 'ACTIVE' }
                        }),
                        // Create Payment Record
                        prisma.payment.create({
                            data: {
                                office_id: subscription.office_id,
                                asaas_payment_id: payment.id,
                                value: payment.value,
                                status: 'CONFIRMED',
                                payment_date: new Date(payment.paymentDate || new Date()),
                                billing_type: payment.billingType
                            }
                        })
                    ]);
                    console.log(`Office ${subscription.office_id} activated via webhook`);
                }
            }
        } else if (eventType === 'PAYMENT_OVERDUE') {
            const asaasSubscriptionId = payment.subscription;
            if (asaasSubscriptionId) {
                const subscription = await prisma.subscription.findFirst({
                    where: { asaas_subscription_id: asaasSubscriptionId }
                });
                if (subscription) {
                    await prisma.office.update({
                        where: { id: subscription.office_id },
                        data: { subscription_status: 'OVERDUE' } // Or inactive
                    });
                }
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}
