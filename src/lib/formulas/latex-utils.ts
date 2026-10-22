// src/lib/formulas/latex-utils.ts
import katex from 'katex'
import 'katex/dist/katex.min.css'

export function renderFormula(latex: string, displayMode = true): string {
  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: true,
      strict: false,
      trust: true,
      macros: {
        '\\R': '\\mathbb{R}',
        '\\N': '\\mathbb{N}',
        '\\Z': '\\mathbb{Z}',
      },
    })
  } catch (error) {
    console.error(`KaTeX render failed for: ${latex}`, error)
    const safeEscaped = latex
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
    return `<span class="formula-error text-red-600 font-mono text-xs inline-flex items-center gap-1.5" role="alert"><span>Formula rendering fallback:</span><code class="bg-red-50 text-red-700 px-1 py-0.5 rounded text-[11px] font-mono border border-red-200">${safeEscaped}</code></span>`
  }
}

export function validateLatex(latex: string): { valid: boolean; error?: string } {
  try {
    katex.renderToString(latex, { throwOnError: true, displayMode: true })
    return { valid: true }
  } catch (error) {
    return { valid: false, error: (error as Error).message }
  }
}
