'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Verifica se o usuário já tem uma sessão ativa salva
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/projects')
      }
    })
  }, [router])

  const handleAuth = async (e: React.FormEvent, isLogin: boolean) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    // Faz a chamada OFICIAL na API de Auth do Supabase
    const { error: sessionError } = isLogin 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    if (sessionError) {
      setError(sessionError.message.includes('Invalid login') 
        ? 'E-mail ou senha incorretos.' 
        : sessionError.message)
      setLoading(false)
    } else {
      // Se sucesso, a API atira pro Dashboard Escudado!
      router.push('/projects')
    }
  }


  return (
    <div className="flex h-screen w-full items-center justify-center bg-background relative overflow-hidden">
      
      {/* Background Decorativo pra Tela de Login ficar Absurda */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm rounded-[24px] border border-border/50 bg-card/60 backdrop-blur-xl p-8 shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col space-y-2 mb-10 text-center">
          <div className="mx-auto w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-2 border border-primary/30">
            <span className="text-2xl font-black text-primary">M</span>
          </div>
          <h3 className="font-bold tracking-tight text-3xl text-foreground">Marketing OS</h3>
          <p className="text-sm text-muted-foreground">Login no painel central da equipe.</p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center animate-in shake">
            {error}
          </div>
        )}

        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1" htmlFor="email">E-mail Corporativo</label>
            <input 
              className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
              id="email" 
              placeholder="seu.nome@empresa.com" 
              required 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1" htmlFor="password">Senha de Acesso</label>
            <input 
              className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
              id="password" 
              required 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-4">
            <button 
              disabled={loading}
              onClick={(e) => handleAuth(e, true)}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold shadow bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-4 py-2 w-full disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]" 
              type="button"
            >
              {loading ? "..." : "Entrar"}
            </button>
            <button 
              disabled={loading}
              onClick={(e) => handleAuth(e, false)}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold shadow-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border h-11 px-4 py-2 w-full disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]" 
              type="button"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
