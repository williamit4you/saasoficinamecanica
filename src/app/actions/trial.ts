'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { addDays } from 'date-fns';

export async function processTrialSignup(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const password = formData.get('password') as string;
    const officeName = formData.get('officeName') as string;

    if (!name || !email || !password || !officeName) {
        return { error: "Todos os campos obrigatórios devem ser preenchidos." };
    }

    // Check existing
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });
    if (existingUser) {
        return { error: "Este email já está cadastrado." };
    }

    try {
        // 1. Create Office with TRIAL status
        const trialEndDate = addDays(new Date(), 7);

        const office = await prisma.office.create({
            data: {
                name: officeName,
                email,
                phone,
                subscription_status: 'TRIAL',
                trial_ends_at: trialEndDate
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

        // 3. Create Subscription Record (Optional for Trial? Yes, good to track)
        // We create a mocked subscription to track the trial period formally if we want,
        // or just rely on office.subscription_status.
        // Let's rely on Office status for simplicity as per schema change.

    } catch (e: any) {
        console.error(e);
        return { error: "Erro ao criar conta de teste: " + e.message };
    }

    redirect('/login?trial=true');
}
