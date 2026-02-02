"use server"
export async function createAsaasCustomer(data: {
    name: string;
    cpfCnpj: string;
    email: string;
    phone?: string;
}) {
    const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';
    const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

    console.log("DEBUG ENV:", { KEY_EXISTS: !!ASAAS_API_KEY, URL: ASAAS_API_URL });

    if (!ASAAS_API_KEY) {
        throw new Error('ASAAS_API_KEY is not defined in environment variables');
    }

    const response = await fetch(`${ASAAS_API_URL}/customers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            access_token: ASAAS_API_KEY,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error('Error creating customer:', errorBody);
        throw new Error(`Failed to create Asaas customer: ${errorBody}`);
    }

    return response.json();
}

export async function createAsaasSubscription(data: {
    customer: string;
    value: number;
    nextDueDate: string;
    cycle: 'MONTHLY' | 'YEARLY';
    description?: string;
}) {
    const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';
    const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

    console.log("ASAAS_API_KEY", ASAAS_API_KEY)

    if (!ASAAS_API_KEY) {
        throw new Error('ASAAS_API_KEY is not defined in environment variables');
    }

    const response = await fetch(`${ASAAS_API_URL}/subscriptions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            access_token: ASAAS_API_KEY,
        },
        body: JSON.stringify({
            billingType: 'UNDEFINED',
            ...data
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error('Error creating subscription:', errorBody);
        throw new Error(`Failed to create Asaas subscription: ${errorBody}`);
    }

    return response.json();
}

export async function getSubscriptionPayments(subscriptionId: string) {
    const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';
    const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

    if (!ASAAS_API_KEY) {
        throw new Error('ASAAS_API_KEY is not defined in environment variables');
    }

    const response = await fetch(`${ASAAS_API_URL}/subscriptions/${subscriptionId}/payments`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            access_token: ASAAS_API_KEY,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch subscription payments');
    }

    return response.json();
}

export async function getAsaasSubscription(subscriptionId: string) {
    const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';
    const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

    if (!ASAAS_API_KEY) {
        throw new Error('ASAAS_API_KEY is not defined in environment variables');
    }

    const response = await fetch(`${ASAAS_API_URL}/subscriptions/${subscriptionId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            access_token: ASAAS_API_KEY,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch subscription');
    }

    return response.json();
}
