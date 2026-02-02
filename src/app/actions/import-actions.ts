'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Papa from 'papaparse';
import { revalidatePath } from 'next/cache';

export async function importClients(formData: FormData) {
    const session = await auth();
    const officeId = session?.user?.office_id;

    if (!officeId) {
        return { success: false, error: "Sem permissão." };
    }

    const file = formData.get('file') as File;
    if (!file) {
        return { success: false, error: "Nenhum arquivo enviado." };
    }

    const text = await file.text();

    return new Promise<{ success: boolean; count?: number; error?: string }>((resolve) => {
        Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const rows = results.data as any[];
                let count = 0;

                try {
                    // Using a transaction usually helps, but for simplicity we loop.
                    // Actually, createMany is better for performance.
                    const dataToInsert = rows.map((row) => ({
                        office_id: officeId,
                        name: row.Nome || row.nome,
                        phone: row.Telefone || row.telefone,
                        email: row.Email || row.email,
                        cpf_cnpj: row.CPF_CNPJ || row.cpf_cnpj,
                        address: row.Endereco || row.endereco,
                        // Default values
                        created_at: new Date(),
                        updated_at: new Date()
                    })).filter(client => client.name); // basic validation

                    if (dataToInsert.length === 0) {
                        resolve({ success: false, error: "Nenhum dado válido encontrado no CSV." });
                        return;
                    }

                    const result = await prisma.client.createMany({
                        data: dataToInsert
                    });

                    revalidatePath('/dashboard/clients');
                    resolve({ success: true, count: result.count });
                } catch (e: any) {
                    console.error("Import error:", e);
                    resolve({ success: false, error: "Erro ao salvar no banco de dados. Verifique os dados." });
                }
            },
            error: (error: any) => {
                resolve({ success: false, error: "Erro ao ler o arquivo CSV: " + error.message });
            }
        });
    });
}

export async function importVehicles(formData: FormData) {
    const session = await auth();
    const officeId = session?.user?.office_id;

    if (!officeId) { return { success: false, error: "Sem permissão." }; }

    const file = formData.get('file') as File;
    if (!file) { return { success: false, error: "Nenhum arquivo enviado." }; }

    const text = await file.text();

    return new Promise<{ success: boolean; count?: number; error?: string }>((resolve) => {
        Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const rows = results.data as any[];
                let count = 0;

                try {
                    for (const row of rows) {
                        const plate = row.Placa || row.placa;
                        const model = row.Modelo || row.modelo;
                        const clientName = row.Nome_Cliente || row.nome_cliente;

                        if (!plate || !model || !clientName) continue;

                        // Try to find client
                        const client = await prisma.client.findFirst({
                            where: {
                                office_id: officeId,
                                name: { contains: clientName.trim(), mode: 'insensitive' }
                            }
                        });

                        if (!client) {
                            console.log(`Cliente não encontrado para o veículo ${plate}: ${clientName}`);
                            continue;
                        }

                        await prisma.vehicle.create({
                            data: {
                                office_id: officeId,
                                client_id: client.id,
                                plate: plate.toUpperCase(),
                                brand: row.Marca || row.marca,
                                model: model,
                                year: parseInt(row.Ano || row.ano || '0'),
                                color: row.Cor || row.cor
                            }
                        });
                        count++;
                    }

                    revalidatePath('/dashboard/vehicles');

                    if (count === 0 && rows.length > 0) {
                        resolve({ success: false, error: "Nenhum veículo importado. Verifique se os nomes dos clientes no arquivo correspondem aos cadastrados." });
                    } else {
                        resolve({ success: true, count });
                    }
                } catch (e: any) {
                    console.error("Import error:", e);
                    resolve({ success: false, error: "Erro ao importar veículos. " + e.message });
                }
            }
        });
    });
}

export async function importProducts(formData: FormData) {
    const session = await auth();
    const officeId = session?.user?.office_id;

    if (!officeId) { return { success: false, error: "Sem permissão." }; }

    const file = formData.get('file') as File;
    if (!file) { return { success: false, error: "Nenhum arquivo enviado." }; }

    const text = await file.text();

    return new Promise<{ success: boolean; count?: number; error?: string }>((resolve) => {
        Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const rows = results.data as any[];

                try {
                    const dataToInsert = rows.map((row) => ({
                        office_id: officeId,
                        name: row.Nome || row.nome,
                        price: parseFloat((row.Preco || row.preco || '0').replace(',', '.')),
                        stock_quantity: parseInt(row.Estoque || row.estoque || '0'),
                        active: true
                    })).filter(p => p.name);

                    if (dataToInsert.length > 0) {
                        const result = await prisma.product.createMany({ data: dataToInsert });
                        revalidatePath('/dashboard/products');
                        resolve({ success: true, count: result.count });
                    } else {
                        resolve({ success: false, error: "Nenhum dado válido." });
                    }
                } catch (e: any) {
                    resolve({ success: false, error: "Erro ao importar produtos." });
                }
            }
        });
    });
}

export async function importServices(formData: FormData) {
    const session = await auth();
    const officeId = session?.user?.office_id;

    if (!officeId) { return { success: false, error: "Sem permissão." }; }

    const file = formData.get('file') as File;
    if (!file) { return { success: false, error: "Nenhum arquivo enviado." }; }

    const text = await file.text();

    return new Promise<{ success: boolean; count?: number; error?: string }>((resolve) => {
        Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const rows = results.data as any[];

                try {
                    const dataToInsert = rows.map((row) => ({
                        office_id: officeId,
                        name: row.Nome || row.nome,
                        price: parseFloat((row.Preco || row.preco || '0').replace(',', '.')),
                        estimated_time: row.Tempo || row.tempo,
                        active: true
                    })).filter(s => s.name);

                    if (dataToInsert.length > 0) {
                        const result = await prisma.service.createMany({ data: dataToInsert });
                        revalidatePath('/dashboard/services');
                        resolve({ success: true, count: result.count });
                    } else {
                        resolve({ success: false, error: "Nenhum dado válido." });
                    }
                } catch (e: any) {
                    resolve({ success: false, error: "Erro ao importar serviços." });
                }
            }
        });
    });
}
