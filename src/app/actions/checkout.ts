'use server';

import { prisma } from '@/lib/prisma'; // Need to create this helper or use client directly? I will create lib/prisma.ts first
import { createAsaasCustomer, createAsaasSubscription, getSubscriptionPayments } from '@/lib/asaas';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

// cleaned imports

export async function processCheckout(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const cpfCnpj = formData.get('cpfCnpj') as string;
    const phone = formData.get('phone') as string;
    const password = formData.get('password') as string;
    const officeName = formData.get('officeName') as string;

    if (!name || !email || !cpfCnpj || !password || !officeName) {
        return { error: "Todos os campos são obrigatórios" };
    }

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        return { error: "Este email já está cadastrado." };
    }

    try {
        // 1. Create Office
        const office = await prisma.office.create({
            data: {
                name: officeName,
                email,
                phone,
                cnpj: cpfCnpj.length > 11 ? cpfCnpj : undefined,
                subscription_status: 'INACTIVE'
            }
        });

        // 2. Create User
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                name,
                email,
                password_hash: hashedPassword,
                role: 'admin_oficina',
                office_id: office.id,
                active: true
            }
        });

        // 3. Create Asaas Customer
        const customer = await createAsaasCustomer({
            name: officeName,
            email,
            cpfCnpj,
            phone
        });

        // 4. Create Subscription
        // Plan Pro = 97.00
        const subscription = await createAsaasSubscription({
            customer: customer.id,
            value: 97.00,
            nextDueDate: new Date().toISOString().split('T')[0], // Today
            cycle: 'MONTHLY',
            description: 'Assinatura OficinaPRO - Plano Pro'
        });

        // 5. Get Payment Link
        const payments = await getSubscriptionPayments(subscription.id);
        const firstPayment = payments.data[0];

        // 6. Save Subscription Record locally
        await prisma.subscription.create({
            data: {
                office_id: office.id,
                asaas_customer_id: customer.id,
                asaas_subscription_id: subscription.id,
                plan_name: 'Pro',
                value: 97.00,
                status: 'PENDING',
                next_billing_date: new Date()
            }
        });

        if (firstPayment && firstPayment.invoiceUrl) {
            return { redirectUrl: firstPayment.invoiceUrl };
        }

        return { error: "Erro ao gerar link de pagamento" };

    } catch (e: any) {
        console.error(e);
        return { error: "Erro ao processar cadastro: " + e.message };
    }
}
