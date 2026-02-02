'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { importClients } from '@/app/actions/import-actions';
import { ArrowLeft, Download, Upload } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ClientImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleDownloadTemplate = () => {
        const csvContent = "Nome,Telefone,Email,CPF_CNPJ,Endereco\n" +
            "Joao da Silva,11999999999,joao@email.com,123.456.789-00,Rua A, 123\n" +
            "Maria Oliveira,11988888888,maria@email.com,111.222.333-44,Rua B, 456\n" +
            "Empresa X LTDA,1133333333,contato@empresax.com,12.345.678/0001-90,Av Paulista, 1000\n" +
            "Pedro Santos,21977777777,pedro@email.com,,Rua C, 789\n" +
            "Ana Costa,31966666666,ana@email.com,555.666.777-88,Rua D, 101";

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'exemplo_clientes.csv');
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
            const result = await importClients(formData);
            if (result.success) {
                toast.success(`${result.count} clientes importados com sucesso!`);
                setFile(null);
            } else {
                toast.error(result.error || "Erro ao importar clientes.");
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
                <Link href="/dashboard/clients" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Clientes
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Importar Clientes</h1>
                <p className="text-gray-500 mt-2">
                    Faça o upload de uma planilha CSV para cadastrar múltiplos clientes de uma vez.
                </p>
            </header>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                        <Download className="mr-2 h-5 w-5 text-blue-600" />
                        1. Baixar Modelo
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Utilize nossa planilha modelo para garantir que seus dados estejam no formato correto.
                        O arquivo contém 5 exemplos de preenchimento.
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
                            {isUploading ? 'Processando...' : 'Importar Clientes'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
