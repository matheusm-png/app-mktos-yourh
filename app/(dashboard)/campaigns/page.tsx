'use client'

import { useState, useEffect } from 'react'
import { Link as LinkIcon, Target, AlertCircle, Save, Check } from 'lucide-react'

export default function CampaignsPage() {
  const [urlBase, setUrlBase] = useState('https://seusite.com/oferta')
  const [platform, setPlatform] = useState('meta')
  const [campaign, setCampaign] = useState('black_friday_26')
  const [adId, setAdId] = useState('')
  const [revenue, setRevenue] = useState('1000')
  const [spend, setSpend] = useState('250')
  const [roas, setRoas] = useState(0)
  const [utmUrl, setUtmUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const rev = parseFloat(revenue) || 0
    const spd = parseFloat(spend) || 0
    if (spd > 0) setRoas(rev / spd)
    else setRoas(0)

    try {
      const url = new URL(urlBase || 'https://example.com')
      if (platform) url.searchParams.set('utm_source', platform)
      url.searchParams.set('utm_medium', 'cpc')
      if (campaign) url.searchParams.set('utm_campaign', campaign)
      if (adId) url.searchParams.set('utm_content', adId)
      setUtmUrl(url.toString())
    } catch {
      setUtmUrl('URL Base inválida')
    }
  }, [urlBase, platform, campaign, adId, revenue, spend])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(utmUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto py-6">
      {/* HEADER / SUMMARY */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Central de Tráfego 🚦</h2>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Tráfego Inteligente cruzando IDs da Plataforma com Ativos do Drive.</p>
        </div>
        
        <div className="flex items-center space-x-6 bg-accent/40 px-8 py-3 rounded-2xl border border-border shadow-inner">
           <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Campanhas Ativas</span>
              <span className="text-xl font-black text-foreground">12</span>
           </div>
           <div className="w-px h-8 bg-border" />
           <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Budget Diário Total</span>
              <span className="text-xl font-black text-emerald-500">R$ 1.450,00</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Módulo Especialista UTM + Meta */}
        <div className="lg:col-span-2 border border-border bg-card rounded-[24px] p-6 shadow-lg flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
            <Target className="w-32 h-32" />
          </div>

          <div className="relative z-10">
             <h3 className="text-lg font-bold mb-6 text-primary flex items-center">
                <Target className="w-5 h-5 mr-2" /> Gerador UTM Profissional
             </h3>
             <div className="space-y-5">
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Link da Landing Page</label>
                 <input value={urlBase} onChange={e=>setUrlBase(e.target.value)} type="text" className="w-full bg-background/50 border border-input rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all" />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Plataforma</label>
                   <select value={platform} onChange={e=>setPlatform(e.target.value)} className="w-full bg-background/50 border border-input rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none cursor-pointer transition-all">
                     <option value="meta" className="text-foreground">Meta Ads (FB/IG)</option>
                     <option value="google" className="text-foreground">Google Ads</option>
                     <option value="tiktok" className="text-foreground">TikTok Ads</option>
                   </select>
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Campanha</label>
                   <input value={campaign} onChange={e=>setCampaign(e.target.value)} type="text" className="w-full bg-background/50 border border-input rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all text-foreground" />
                 </div>
               </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-amber-500 tracking-widest">Ad ID Oficial (API Sync)</label>
                  <input value={adId} onChange={e=>setAdId(e.target.value)} placeholder="Ex: 23851948301" type="text" className="w-full bg-background/50 border border-amber-500/30 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500/50 outline-none placeholder:text-amber-500/20 transition-all font-mono text-foreground" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Faturamento (R$)</label>
                    <input value={revenue} onChange={e=>setRevenue(e.target.value)} type="number" className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all font-black text-foreground" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Investimento (R$)</label>
                    <input value={spend} onChange={e=>setSpend(e.target.value)} type="number" className="w-full bg-rose-500/5 border border-rose-500/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-rose-500/50 outline-none transition-all font-black text-foreground" />
                  </div>
                </div>

                <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-primary uppercase leading-tight">ROAS Estimado</span>
                      <span className="text-2xl font-black text-foreground">{roas.toFixed(2)}x</span>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-primary uppercase leading-tight">ROI Bruto</span>
                      <span className="text-sm font-bold text-emerald-500">+{((roas * 100 - 100) || 0).toFixed(0)}%</span>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="mt-8 p-5 bg-accent/30 rounded-2xl border border-border/50 break-all relative group hover:bg-accent/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] text-primary font-black uppercase tracking-widest flex items-center"><LinkIcon className="w-3 h-3 mr-1" /> Link Final Cruzado</p>
              <button 
                onClick={copyToClipboard}
                className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-lg transition-all flex items-center shadow-md ${copied ? 'bg-emerald-500 text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
              >
                 {copied ? <><Check className="w-3 h-3 mr-1"/> Copiado!</> : 'Copiar Link'}
              </button>
            </div>
            <code className="text-xs font-mono text-foreground font-medium group-hover:text-primary transition-colors leading-relaxed block overflow-hidden">{utmUrl}</code>
          </div>
        </div>

        {/* Tabela de Tráfego / Nodes (Visual Color Coding) */}
        <div className="lg:col-span-3 border border-border bg-card rounded-[24px] p-6 shadow-lg overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-foreground flex items-center">
               🚦 Campanhas Ativas (Nodes)
            </h3>
            <button 
               onClick={() => alert("💾 Salvando Configuração de Nó... (Dê o nome ao ID para cruzamento de dados)")}
               className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl font-bold text-xs shadow-xl flex items-center shadow-primary/20 transition-all active:scale-95"
            >
               <Save className="w-4 h-4 mr-2" /> Salvar Nó
            </button>
          </div>

          <div className="flex-1 overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-[10px] font-black text-muted-foreground uppercase border-b border-border/60 tracking-widest">
                <tr>
                  <th className="py-4 pr-4">Campanha / ID</th>
                  <th className="py-4 px-4">Canal / Status</th>
                  <th className="py-4 px-4 text-right">Budget / Dia</th>
                  <th className="py-4 pl-4 text-right">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                <tr className="hover:bg-primary/5 transition-colors group cursor-pointer">
                  <td className="py-5 pr-4">
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors text-base">black_friday_26</p>
                    <p className="text-[10px] font-mono text-muted-foreground mt-1 opacity-50 tracking-tighter">#23851948301</p>
                  </td>
                  <td className="py-5 px-4 space-y-2">
                     <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black rounded-md px-2 py-0.5 text-[9px] shadow-md block w-max uppercase tracking-tighter"> Meta Ads </span>
                     <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black text-emerald-500 uppercase">Ativo</span>
                     </div>
                  </td>
                  <td className="py-5 px-4 text-right font-black text-foreground">R$ 250,00</td>
                  <td className="py-5 pl-4 text-right">
                      <button 
                        onClick={() => alert("📽️ Abrindo Player de Vídeo: Simulando preview do criativo da Black Friday...")}
                        className="bg-accent/50 text-muted-foreground px-3 py-1.5 rounded-lg text-[10px] font-black uppercase group-hover:bg-primary group-hover:text-primary-foreground transition-all border border-border/50"
                      >
                        Ver Vídeo
                      </button>
                  </td>
                </tr>
                <tr className="hover:bg-primary/5 transition-colors group cursor-pointer">
                  <td className="py-5 pr-4">
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors text-base">remarketing_30d</p>
                    <p className="text-[10px] font-mono text-muted-foreground mt-1 opacity-50 tracking-tighter">#68210344912</p>
                  </td>
                  <td className="py-5 px-4 space-y-2">
                     <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-cyan-500 text-white font-black rounded-md px-2 py-0.5 text-[9px] shadow-md block w-max uppercase tracking-tighter"> TikTok Ads </span>
                     <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black text-emerald-500 uppercase">Ativo</span>
                     </div>
                  </td>
                  <td className="py-5 px-4 text-right font-black text-foreground">R$ 500,00</td>
                  <td className="py-5 pl-4 text-right">
                      <button 
                        onClick={() => alert("📱 Simulando Interface de Feed do TikTok...")}
                        className="bg-accent/50 text-muted-foreground px-3 py-1.5 rounded-lg text-[10px] font-black uppercase group-hover:bg-primary group-hover:text-primary-foreground transition-all border border-border/50"
                      >
                        Ver Feed
                      </button>
                  </td>
                </tr>
                <tr className="hover:bg-primary/5 transition-colors group cursor-pointer">
                  <td className="py-5 pr-4">
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors text-base">topo_funil_b2b</p>
                    <p className="text-[10px] font-mono text-muted-foreground mt-1 opacity-50 tracking-tighter">#118490231</p>
                  </td>
                  <td className="py-5 px-4 space-y-2">
                     <span className="bg-gradient-to-r from-blue-500 via-yellow-400 to-green-500 text-white font-black rounded-md px-2 py-0.5 text-[9px] shadow-md block w-max uppercase tracking-tighter"> Google Ads </span>
                     <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span className="text-[9px] font-black text-amber-500 uppercase">Pausado</span>
                     </div>
                  </td>
                  <td className="py-5 px-4 text-right font-black text-foreground">R$ 300,00</td>
                  <td className="py-5 pl-4 text-right">
                      <button 
                         onClick={() => alert("🔍 Abrindo Simulador de Busca do Google...")}
                         className="bg-accent/50 text-muted-foreground px-3 py-1.5 rounded-lg text-[10px] font-black uppercase group-hover:bg-primary group-hover:text-primary-foreground transition-all border border-border/50"
                      >
                        Ver Search
                      </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
