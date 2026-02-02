'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { importProducts } from '@/app/actions/import-actions';
import { ArrowLeft, Download, Upload } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ProductImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleDownloadTemplate = () => {
        const csvContent = "Nome,Preco,Estoque\n" +
            "Oleo Motor 5W30,45.90,100\n" +
            "Filtro de Oleo,25.00,50\n" +
            "Pastilha de Freio,120.00,20\n" +
            "Lampada H4,15.50,30\n" +
            "Aditivo Radiador,35.00,40";

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'exemplo_produtos.csv');
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
            const result = await importProducts(formData);
            if (result.success) {
                toast.success(`${result.count} produtos importados com sucesso!`);
                setFile(null);
            } else {
                toast.error(result.error || "Erro ao importar produtos.");
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
                <Link href="/dashboard/products" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Produtos
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Importar Produtos</h1>
                <p className="text-gray-500 mt-2">
                    Faça o upload de uma planilha CSV para cadastrar múltiplos produtos de uma vez.
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
                            {isUploading ? 'Processando...' : 'Importar Produtos'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
