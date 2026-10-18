export interface SistemaTool {
  slug: string;
  role: string;
  plan: string;
  monthlyCostUsd: number | null;
  monthlyCostCop: number | null;
  checkedOn: string;
  sourceUrl: string;
  enzoUses: boolean;
}

export interface SistemaPiece {
  id: 'recepcion' | 'checklist' | 'entrega' | 'seguimiento';
  title: string;
  why: string;
  steps: string[];
  tools: string[];
  templates: { file: string; title: string; body: string }[];
}

export interface SistemaContent {
  intro: string;
  setupOrder: string[];
  pieces: SistemaPiece[];
  tools: SistemaTool[];
}
