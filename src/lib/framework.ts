export const SERVICE_SYSTEM_STAGES = [
  {
    id: 'captar',
    number: 'C1',
    name: 'Captar',
    promise: 'Convertir atención en oportunidades identificables.',
    question: '¿De dónde llegan y dónde quedan registrados?',
    examples: 'TikTok, pauta, referidos, formularios, WhatsApp y recursos.',
  },
  {
    id: 'convertir',
    number: 'C2',
    name: 'Convertir',
    promise: 'Dar criterio y siguiente acción a cada oportunidad.',
    question: '¿Qué hace que una persona avance o se descarte?',
    examples: 'Calificación, CRM, seguimiento, cotización, agenda y pago.',
  },
  {
    id: 'cumplir',
    number: 'C3',
    name: 'Cumplir',
    promise: 'Prestar el servicio con menos dependencia del dueño.',
    question: '¿Cómo se entrega bien, incluso cuando tú no estás mirando?',
    examples: 'Flujos, responsables, checklists, documentos, alertas y control.',
  },
  {
    id: 'continuar',
    number: 'C4',
    name: 'Continuar',
    promise: 'Hacer que la relación siga después de entregar.',
    question: '¿Qué ocurre después del pago o de la entrega?',
    examples: 'Postventa, garantías, NPS, mantenimiento, reactivación y referidos.',
  },
] as const;

export type ServiceSystemStageId = (typeof SERVICE_SYSTEM_STAGES)[number]['id'];

const STAGE_IDS = new Set<string>(SERVICE_SYSTEM_STAGES.map((stage) => stage.id));

export function isServiceSystemStage(value: unknown): value is ServiceSystemStageId {
  return typeof value === 'string' && STAGE_IDS.has(value);
}

export function serviceSystemStageLabel(value: unknown): string {
  const stage = SERVICE_SYSTEM_STAGES.find((item) => item.id === value);
  return stage ? `${stage.number} · ${stage.name}` : '';
}
