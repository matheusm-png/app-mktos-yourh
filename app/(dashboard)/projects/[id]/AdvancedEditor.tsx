'use client'

import React, { useState } from 'react'
import { Editor } from 'novel'

export default function AdvancedEditor({ 
  initialContent, 
  onSave 
}: { 
  initialContent?: string, 
  onSave: (val: string) => void 
}) {
  const [saveStatus, setSaveStatus] = useState("Salvo")

  return (
    <div className="relative w-full max-w-screen-lg">
      <div className="absolute right-5 top-5 z-10 mb-5 rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">
        {saveStatus}
      </div>
      
      {/* Novel renderiza o Exato Notion Clone Native 1:1 Engine */}
      <Editor
        defaultValue={initialContent || ""}
        disableLocalStorage={true}
        onUpdate={(e) => {
          setSaveStatus("Não salvo")
        }}
        onDebouncedUpdate={(e) => {
          setSaveStatus("Salvando...")
          const blockContent = e?.getHTML() || ""
          onSave(blockContent)
          setTimeout(() => setSaveStatus("Salvo"), 500)
        }}
        debounceDuration={1000}
        className="w-full min-h-[500px] border border-border/50 bg-background/50 backdrop-blur rounded-2xl shadow-sm prose prose-invert max-w-none p-4 lg:p-12 focus:outline-none"
      />
    </div>
  )
}
