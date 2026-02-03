import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <span className="font-bold text-xl">OficinaPRO</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Funcionalidades
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            Planos
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Área do Cliente
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Gestão Completa para sua Oficina Mecânica
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                  Controle ordens de serviço, estoque, financeiro e clientes em um único lugar.
                  Simples, rápido e eficiente.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white" size="lg">
                  <Link href="#pricing">Começar Agora</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white hover:text-black">
                  <Link href="#features">Saiba Mais</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Tudo que você precisa
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg bg-white shadow-sm">
                <div className="p-2 bg-black rounded-full text-white">
                  <svg
                    className=" h-6 w-6"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Ordens de Serviço</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Crie e gerencie OS com facilidade. Adicione peças, serviços e controle o status.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg bg-white shadow-sm">
                <div className="p-2 bg-black rounded-full text-white">
                  <svg
                    className=" h-6 w-6"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Cadastro de Clientes</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Mantenha o histórico completo dos seus clientes e seus veículos.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg bg-white shadow-sm">
                <div className="p-2 bg-black rounded-full text-white">
                  <svg
                    className=" h-6 w-6"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect height="16" rx="2" width="20" x="2" y="4" />
                    <line x1="12" x2="12" y1="2" y2="22" />
                    <path d="M7 12h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Financeiro Integrado</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Controle suas receitas e despesas. Integração com Asaas para pagamentos.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Planos Simples
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">

              {/* Trial Plan */}
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm w-full border-gray-200 relative overflow-hidden flex flex-col">
                <div className="bg-gray-100 text-gray-800 text-center text-sm font-bold py-1">PARA TESTAR</div>
                <div className="flex flex-col p-6 space-y-1">
                  <h3 className="font-semibold tracking-tight text-2xl">7 Dias Grátis</h3>
                  <p className="text-sm text-muted-foreground">Experimente todas as funcionalidades.</p>
                </div>
                <div className="p-6 pt-0 flex-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">R$ 0</span>
                    <span className="text-muted-foreground font-medium">/7 dias</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center">
                      <svg className="mr-2 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Acesso completo
                    </li>
                    <li className="flex items-center">
                      <svg className="mr-2 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Sem compromisso
                    </li>
                    <li className="flex items-center">
                      <svg className="mr-2 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Cadastro simples
                    </li>
                  </ul>
                </div>
                <div className="p-6 pt-0 mt-auto">
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/register/trial">Testar Grátis</Link>
                  </Button>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm w-full border-blue-600 relative overflow-hidden flex flex-col">
                <div className="bg-blue-600 text-white text-center text-sm font-bold py-1">MAIS POPULAR</div>
                <div className="flex flex-col p-6 space-y-1">
                  <h3 className="font-semibold tracking-tight text-2xl">Plano Pro</h3>
                  <p className="text-sm text-muted-foreground">Tudo que sua oficina precisa.</p>
                </div>
                <div className="p-6 pt-0 flex-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">R$ 97</span>
                    <span className="text-muted-foreground font-medium">/mês</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center">
                      <svg className="mr-2 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Usuários ilimitados
                    </li>
                    <li className="flex items-center">
                      <svg className="mr-2 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Ordens de Serviço ilimitadas
                    </li>
                    <li className="flex items-center">
                      <svg className="mr-2 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Suporte via WhatsApp
                    </li>
                  </ul>
                </div>
                <div className="p-6 pt-0 mt-auto">
                  <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white" asChild>
                    <Link href="/checkout">Assinar Agora</Link>
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2026 OficinaPRO. Todos os direitos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Termos de Uso
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacidade
          </Link>
        </nav>
      </footer>
    </div>
  )
}
