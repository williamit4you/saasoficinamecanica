'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Basic validation regex
const cnpjRegex = /^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const cpfRegex = /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

const updateOfficeSchema = z.object({
    name: z.string().min(2, "Nome da oficina deve ter pelo menos 2 caracteres"),
    cnpj: z.string().optional().or(z.literal('')),
    cpf: z.string().optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
}).refine(data => {
    // Check if at least one is present and valid
    const hasCnpj = data.cnpj && data.cnpj.replace(/\D/g, '').length === 14;
    const hasCpf = data.cpf && data.cpf.replace(/\D/g, '').length === 11;
    return hasCnpj || hasCpf;
}, {
    message: "É necessário informar um CNPJ ou CPF válido para emitir notas e assinaturas.",
    path: ["cnpj"], // Point error to CNPJ field generally
});

export async function updateOfficeAction(data: z.infer<typeof updateOfficeSchema>) {
    const session = await auth();
    const officeId = session?.user?.office_id;

    if (!officeId) {
        return { success: false, error: "Usuário não autenticado ou sem oficina." };
    }

    const parsed = updateOfficeSchema.safeParse(data);

    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    try {
        await prisma.office.update({
            where: { id: officeId },
            data: {
                name: parsed.data.name,
                cnpj: parsed.data.cnpj ? parsed.data.cnpj.replace(/\D/g, '') : null,
                cpf: parsed.data.cpf ? parsed.data.cpf.replace(/\D/g, '') : null,
                phone: parsed.data.phone || null,
            }
        });

        revalidatePath('/dashboard/settings');
        return { success: true };
    } catch (error: any) {
        console.error("Error updating office:", error);
        return { success: false, error: "Erro ao atualizar dados da oficina." };
    }
}
