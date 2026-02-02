import { AppSidebar } from "@/components/app-sidebar";

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className="fixed inset-y-0 z-50 flex w-64 flex-col">
                <AppSidebar />
            </div>
            <main className="flex-1 pl-64 transition-all duration-300">
                {/* We remove the padding here because pages already have it or we can add it here globally */}
                {children}
            </main>
        </div>
    );
}
