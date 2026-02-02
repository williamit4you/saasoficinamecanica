'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { importServices } from '@/app/actions/import-actions';
import { ArrowLeft, Download, Upload } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ServiceImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleDownloadTemplate = () => {
        const csvContent = "Nome,Preco,Tempo\n" +
            "Troca de Oleo,50.00,30 min\n" +
            "Alinhamento,80.00,1 hora\n" +
            "Balanceamento,60.00,45 min\n" +
            "Revisao Geral,350.00,4 horas\n" +
            "Troca de Pastilha,90.00,1 hora";

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'exemplo_servicos.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            toast.error("Selecione um arquivo CSV.");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const result = await importServices(formData);
            if (result.success) {
                toast.success(`${result.count} serviços importados com sucesso!`);
                setFile(null);
            } else {
                toast.error(result.error || "Erro ao importar serviços.");
            }
        } catch (error) {
            toast.error("Erro inesperado ao processar o arquivo.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="mb-8">
                <Link href="/dashboard/services" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Serviços
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Importar Serviços</h1>
                <p className="text-gray-500 mt-2">
                    Faça o upload de uma planilha CSV para cadastrar múltiplos serviços de uma vez.
                </p>
            </header>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                        <Download className="mr-2 h-5 w-5 text-blue-600" />
                        1. Baixar Modelo
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                        O preço deve usar ponto ou vírgula como separador decimal.
                    </p>
                    <Button onClick={handleDownloadTemplate} variant="outline" className="w-full">
                        Baixar Planilha Modelo (.csv)
                    </Button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                        <Upload className="mr-2 h-5 w-5 text-green-600" />
                        2. Fazer Upload
                    </h2>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="file">Arquivo CSV</Label>
                            <Input
                                id="file"
                                type="file"
                                accept=".csv"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                        </div>
                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isUploading || !file}>
                            {isUploading ? 'Processando...' : 'Importar Serviços'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
