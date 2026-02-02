'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    Car,
    Package,
    Wrench,
    FileText,
    PlusCircle,
    LogOut,
    Settings
} from 'lucide-react';
import { handleSignOut } from '@/app/lib/actions';

const menuItems = [
    {
        title: 'Visão Geral',
        items: [
            { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        ]
    },
    {
        title: 'Cadastros',
        items: [
            { label: 'Clientes', href: '/dashboard/clients', icon: Users },
            { label: 'Veículos', href: '/dashboard/vehicles', icon: Car },
            { label: 'Produtos', href: '/dashboard/products', icon: Package },
            { label: 'Serviços', href: '/dashboard/services', icon: Wrench },
        ]
    },
    {
        title: 'Operacional',
        items: [
            { label: 'Ordens de Serviço', href: '/dashboard/orders', icon: FileText },
            { label: 'Nova O.S.', href: '/dashboard/orders/new', icon: PlusCircle },
        ]
    },
    {
        title: 'Sistema',
        items: [
            { label: 'Configurações', href: '/dashboard/settings', icon: Settings },
        ]
    }
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col border-r bg-white">
            <div className="flex h-16 items-center px-6 border-b">
                <span className="text-xl font-bold text-blue-600">OficinaPRO</span>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-6 px-4">
                    {menuItems.map((section, i) => (
                        <div key={i}>
                            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                {section.title}
                            </h3>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center rounded-lg px-2 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900",
                                                isActive ? "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800" : "text-gray-600"
                                            )}
                                        >
                                            <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-blue-600" : "text-gray-400")} />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>

            <div className="border-t p-4">
                <form action={handleSignOut}>
                    <button className="flex w-full items-center rounded-lg px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                        <LogOut className="mr-3 h-5 w-5" />
                        Sair do Sistema
                    </button>
                </form>
            </div>
        </div>
    );
}
