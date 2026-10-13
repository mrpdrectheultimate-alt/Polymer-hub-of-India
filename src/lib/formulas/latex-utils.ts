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
    const escaped = latex.replace(/'/g, "\\'").replace(/"/g, '&quot;')
    return `<span class="formula-error text-red-600 font-mono text-xs inline-flex items-center gap-1.5" role="alert"><span>Formula rendering fallback.</span><button onclick="navigator.clipboard.writeText('${escaped}')" class="underline text-blue-600 hover:text-blue-800 font-semibold cursor-pointer">Copy LaTeX</button></span>`
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
