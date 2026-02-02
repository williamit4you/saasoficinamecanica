'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { importVehicles } from '@/app/actions/import-actions';
import { ArrowLeft, Download, Upload } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function VehicleImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleDownloadTemplate = () => {
        const csvContent = "Placa,Modelo,Marca,Ano,Cor,Nome_Cliente\n" +
            "ABC-1234,Uno Vivace,Fiat,2015,Prata,Joao da Silva\n" +
            "XYZ-9876,Gol G5,Volkswagen,2012,Preto,Maria Oliveira\n" +
            "DEF-5678,Corolla,Toyota,2020,Branco,Joao da Silva\n" +
            "GHI-1010,Civic,Honda,2018,Cinza,Pedro Santos\n" +
            "JKL-2020,HB20,Hyundai,2021,Vermelho,Ana Costa";

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'exemplo_veiculos.csv');
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
            const result = await importVehicles(formData);
            if (result.success) {
                toast.success(`${result.count} veículos importados com sucesso!`);
                setFile(null);
            } else {
                toast.error(result.error || "Erro ao importar veículos.");
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
                <Link href="/dashboard/vehicles" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Veículos
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Importar Veículos</h1>
                <p className="text-gray-500 mt-2">
                    Faça o upload de uma planilha CSV para cadastrar múltiplos veículos.
                    <br />
                    <span className="text-yellow-600 font-medium">Atenção:</span> Certifique-se de que os clientes (nomes) já estejam cadastrados no sistema.
                </p>
            </header>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                        <Download className="mr-2 h-5 w-5 text-blue-600" />
                        1. Baixar Modelo
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                        A coluna <strong>Nome_Cliente</strong> deve corresponder exatamente ao nome do cliente já cadastrado.
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
                            {isUploading ? 'Processando...' : 'Importar Veículos'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
