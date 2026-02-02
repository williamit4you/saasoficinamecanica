'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function MonthFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentMonth = searchParams.get('month') || new Date().toISOString().slice(0, 7); // YYYY-MM

    // Generate last 12 months options
    const options = [];
    const date = new Date();
    date.setDate(1); // Set to 1st to avoid issues with switching months 31st -> 30th

    for (let i = 0; i < 12; i++) {
        const value = date.toISOString().slice(0, 7);
        const label = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        options.push({ value, label });
        date.setMonth(date.getMonth() - 1);
    }

    const handleChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('month', value);
        router.push(`/dashboard?${params.toString()}`);
    };

    return (
        <div className="w-[200px]">
            <Select value={currentMonth} onValueChange={handleChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label.charAt(0).toUpperCase() + option.label.slice(1)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
