'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Save, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { updateOfficeAction } from '@/app/actions/office-actions';
import { useRouter } from 'next/navigation';

interface OfficeSettingsFormProps {
    office: {
        id: string;
        name: string;
        cnpj: string | null;
        cpf: string | null;
        phone: string | null;
    }
}

export function OfficeSettingsForm({ office }: OfficeSettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: office.name || '',
        cnpj: office.cnpj || '',
        cpf: office.cpf || '',
        phone: office.phone || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simple client-side check just to give immediate feedback
        const cleanCnpj = formData.cnpj.replace(/\D/g, '');
        const cleanCpf = formData.cpf.replace(/\D/g, '');

        if (!cleanCnpj && !cleanCpf) {
            toast.error("Informe CPF ou CNPJ.");
            setIsLoading(false);
            return;
        }

        try {
            const result = await updateOfficeAction(formData);
            if (result.success) {
                toast.success("Dados da oficina atualizados com sucesso!");
                router.refresh();
            } else {
                toast.error(result.error || "Erro ao atualizar.");
            }
        } catch (error) {
            toast.error("Ocorreu um erro inesperado.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Building className="mr-2 h-5 w-5 text-gray-600" />
                    Dados da Oficina (Faturamento)
                </CardTitle>
                <CardDescription>Estes dados serão usados para gerar sua assinatura.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="name">Nome da Oficina</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nome fantasia"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="cnpj">CNPJ (Apenas números)</Label>
                            <Input
                                id="cnpj"
                                name="cnpj"
                                value={formData.cnpj}
                                onChange={handleChange}
                                placeholder="00000000000000"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cpf">CPF (Caso pessoa física)</Label>
                            <Input
                                id="cpf"
                                name="cpf"
                                value={formData.cpf}
                                onChange={handleChange}
                                placeholder="00000000000"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="(00) 00000-0000"
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Salvar Alterações
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
