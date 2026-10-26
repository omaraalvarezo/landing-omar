import { categoryPath, getCategories } from './directory';

/** Frases completas. No corta en decimales ni en nombres como Respond.io. */
export function sentences(text: string): string[] {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return [];
  const parts: string[] = [];
  let start = 0;
  for (const match of clean.matchAll(/[.!?](?=\s+[A-ZÁÉÍÓÚÑ¿])/g)) {
    const end = (match.index ?? 0) + 1;
    parts.push(clean.slice(start, end).trim());
    start = end;
    while (clean[start] === ' ') start += 1;
  }
  const tail = clean.slice(start).trim();
  if (tail) parts.push(tail);
  return parts;
}

function clipLongSentence(sentence: string, max: number): string {
  const window = sentence.slice(0, max - 1);
  const breaks = [window.lastIndexOf('; '), window.lastIndexOf(': '), window.lastIndexOf(', ')];
  const at = Math.max(...breaks);
  if (at >= 80) return `${window.slice(0, at).replace(/[ ,:;]+$/u, '')}.`;
  const space = window.lastIndexOf(' ');
  const base = (space >= 80 ? window.slice(0, space) : window).replace(/[ ,:;]+$/u, '');
  return `${base}…`;
}

/** Meta description que cabe en el resultado de búsqueda. El párrafo visible puede ser más largo. */
export function clipMeta(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;

  const parts = sentences(clean);
  if (parts[0] && parts[0].length <= max) {
    let acc = '';
    for (const sentence of parts) {
      const next = acc ? `${acc} ${sentence}` : sentence;
      if (next.length > max) break;
      acc = next;
    }
    return acc;
  }
  return clipLongSentence(parts[0] || clean, max);
}

/** La ficha corta gana contexto de categoría sin inventar funciones. */
export function toolMeta(desc: string, category: string): string {
  const clean = desc.replace(/\s+/g, ' ').trim();
  const label = category.charAt(0).toLowerCase() + category.slice(1);
  if (clean.length >= 90) return clipMeta(clean);
  return clipMeta(`${clean} Está en el directorio de IA para ${label} de una pyme.`);
}

/** Quita el sufijo de sección cuando el título ya no cabe en el resultado. */
export function pageTitle(title: string, suffix: string, max = 65): string {
  const withSuffix = `${title}${suffix}`;
  return withSuffix.length <= max ? withSuffix : title;
}

export interface DirectoryFaq {
  q: string;
  a: string;
}

export interface DirectoryPageSeo {
  title: string;
  lead: string;
  faqs?: DirectoryFaq[];
}

export interface CategorySeo extends DirectoryPageSeo {
  related: string[];
  faqs: DirectoryFaq[];
}

export const DIRECTORY_INDEX: DirectoryPageSeo = {
  title: 'Herramientas de IA para pymes en Latinoamérica',
  lead:
    'Directorio en español de herramientas de IA para quien opera una pyme en Latinoamérica. Sirve para elegir por la tarea —atender, seguir un lead o automatizar— y para leer qué no hace cada ficha. Si apenas la estás probando, abre una sola.',
  faqs: [
    {
      q: '¿Qué es este directorio de herramientas de IA?',
      a: 'Es una lista en español de herramientas para pymes, con la tarea que cubre cada una, lo que no hace y el enlace al sitio oficial. No es un ranking ni un catálogo de agentes.',
    },
    {
      q: '¿Para quién es el directorio?',
      a: 'Para quien opera una pyme en Latinoamérica y tiene que escoger una herramienta sin armar un proyecto largo. También sirve si el equipo apenas está probando y quiere una sola tarea para empezar.',
    },
    {
      q: '¿Cómo elijo una herramienta de IA?',
      a: 'Elige la tarea, no la marca: atención al cliente si el chat se repite, ventas y CRM si se pierde el seguimiento, automatización si copias un dato a mano. En la ficha, lee lo que no hace.',
    },
    {
      q: '¿Por qué tantas pymes la prueban y pocas la usan en el trabajo?',
      a: 'Porque un chat suelto no entra en la operación. Sirve cuando queda atado a una tarea que ya se repite, como la respuesta de siempre o el seguimiento. Esta página no publica una tasa de adopción.',
    },
    {
      q: '¿Esto reemplaza una capacitación de IA para pymes?',
      a: 'No hay curso ni diploma. Hay fichas para elegir y guías para probar una herramienta en una tarea. Los prompts se copian y se adaptan con el equipo.',
    },
    {
      q: '¿Puedo automatizar la atención y el seguimiento de leads?',
      a: 'Sí, en lo que ya tiene respuesta escrita: atención al cliente cubre el chat y WhatsApp, y ventas y CRM cubre el seguimiento. Una persona sigue cerrando quejas, precios y excepciones.',
    },
  ],
};

export const CATEGORY_SEO: Record<string, CategorySeo> = {
  asistentes: {
    title: 'Asistentes de IA para pymes: cuál elegir',
    lead:
      'Un asistente sirve para redactar, resumir y ordenar ideas en una pyme. Esta lista es para usarlo en una tarea, no para abrir cuatro cuentas. En el navegador mira ChatGPT, Claude o Gemini; si ya trabajas en Microsoft 365, mira Copilot.',
    related: ['escritura', 'atencion-al-cliente', 'productividad'],
    faqs: [
      {
        q: '¿Qué asistente de IA le sirve a una pyme?',
        a: 'El que puedes abrir esta semana y atar a un borrador, un resumen o una lista. ChatGPT, Claude y Gemini cubren el chat. Microsoft Copilot entra si el trabajo ya está en Microsoft 365.',
      },
      {
        q: '¿Conviene pagar varios asistentes a la vez?',
        a: 'No al principio. Una cuenta basta para ver si el equipo la usa. La segunda se justifica cuando la primera no cubre el formato o el lugar donde ya trabajas.',
      },
      {
        q: '¿El asistente atiende solo a los clientes?',
        a: 'Deja el borrador, no la decisión: el precio, la queja y el dato que no está escrito los cierra una persona. Para el chat con el cliente, sigue en atención al cliente.',
      },
    ],
  },
  investigacion: {
    title: 'IA para investigar antes de vender en pymes',
    lead:
      'Investigar con IA, aquí, es leer fuentes antes de vender o de decidir. Sirve a quien llega a la llamada con un borrador, no con un dato inventado. Perplexity busca y cita; Gemini Notebook trabaja sobre los archivos que tú le pasas.',
    related: ['ventas-y-crm', 'asistentes'],
    faqs: [
      {
        q: '¿Qué uso para investigar un prospecto?',
        a: 'Perplexity, si necesitas fuentes públicas con cita, y Gemini Notebook, si el material ya lo tienes tú. Las dos dejan un borrador y ninguna confirma sola que el cliente exista o pueda pagar.',
      },
      {
        q: '¿Puedo fiarme de lo que resume la IA?',
        a: 'No como dato final. Sirve para llegar más rápido a la fuente. Antes de repetirlo en una llamada, abre el enlace o el archivo y contrasta el punto que vas a usar.',
      },
      {
        q: '¿La investigación reemplaza al CRM?',
        a: 'Arma el contexto de la llamada, no el seguimiento. El siguiente paso vive en ventas y CRM: si no lo anotas, la lectura se pierde.',
      },
    ],
  },
  diseno: {
    title: 'Herramientas de IA para diseño en pymes',
    lead:
      'El diseño con IA sirve para armar una pieza, quitar un fondo o probar una imagen sin un estudio. Es para quien publica en redes o en una ficha de producto. Canva y Firefly cubren la pieza; Photoroom, remove.bg y Pixelcut, la foto; Midjourney explora, no deja el logo.',
    related: ['video', 'e-commerce', 'escritura'],
    faqs: [
      {
        q: '¿Qué herramienta de diseño miro primero?',
        a: 'Canva, si necesitas la pieza del día; Photoroom, remove.bg o Pixelcut, si la foto es de un producto; Adobe Firefly, si ya trabajas en Adobe. Midjourney explora una imagen y no deja el logo ni la marca listos.',
      },
      {
        q: '¿Puedo publicar la imagen tal como sale?',
        a: 'Solo si una persona la revisó. Mira que no haya un texto torcido, una marca ajena o un antes que no fotografiaste. La herramienta no sabe qué puede salir con el nombre del negocio.',
      },
      {
        q: '¿El diseño reemplaza al video?',
        a: 'Aquí se arma la imagen fija, no el clip. Si el trabajo es un video, sigue en esa categoría; si falta el texto, un asistente redacta el borrador y diseño lo monta.',
      },
    ],
  },
  video: {
    title: 'Herramientas de IA para video en pymes',
    lead:
      'El video con IA sirve para editar un clip que ya grabaste o para generar uno corto con guion propio. Es para quien publica seguido y no tiene editor de planta. Empieza por CapCut o Descript si ya tienes el material.',
    related: ['voz', 'diseno'],
    faqs: [
      {
        q: '¿Edito un video grabado o genero uno nuevo?',
        a: 'Si ya está grabado, CapCut o Descript. Si hay que generarlo, HeyGen, Synthesia o Higgsfield. Empieza por el material que ya tienes: suele salir más fiel al negocio.',
      },
      {
        q: '¿Estas herramientas publican el video?',
        a: 'No publican: entregan el archivo o el corte, y quién lo sube lo decides tú. Revisa caras, marcas y promesas antes de publicarlo.',
      },
      {
        q: '¿La voz del video está en esta categoría?',
        a: 'No: la locución está en voz, con ElevenLabs, y aquí se edita o se genera el video. Si solo falta una voz sobre un guion, no abras varias cuentas de video.',
      },
    ],
  },
  voz: {
    title: 'IA de voz para pymes: locución y audio',
    lead:
      'La voz con IA, en esta lista, es para locutar un texto que ya escribiste. Sirve si un audio o un video necesita voz y no hay quién grabe. Hoy la ficha es ElevenLabs. El video completo está en video; el chat, en atención.',
    related: ['video', 'atencion-al-cliente'],
    faqs: [
      {
        q: '¿Qué herramienta de voz hay en el directorio?',
        a: 'ElevenLabs. Sirve para locutar un guion que ya escribiste. No es un contestador del negocio ni un editor de video.',
      },
      {
        q: '¿Puedo usar la voz de un cliente o de alguien del equipo?',
        a: 'No sin permiso. Usa una voz de la herramienta o una voz que esa persona autorizó. No clones la voz de alguien del equipo para ahorrarte el aviso.',
      },
      {
        q: '¿La voz reemplaza la atención por WhatsApp?',
        a: 'No: la atención escrita está en atención al cliente y la voz sirve para un audio o un video con guion. Quien escribe sigue necesitando una respuesta, no una locución.',
      },
    ],
  },
  automatizacion: {
    title: 'IA para automatizar tareas de una pyme',
    lead:
      'Automatizar, aquí, es conectar dos herramientas para no copiar un dato a mano. Sirve cuando el mismo paso se repite: un aviso, un registro, un seguimiento. Zapier y Make arman el flujo sin código; n8n, si quieres tenerlo contigo.',
    related: ['atencion-al-cliente', 'ventas-y-crm', 'productividad'],
    faqs: [
      {
        q: '¿Qué automatizo primero en una pyme?',
        a: 'El paso que ya está escrito y se repite: pasar un formulario a una hoja, avisar que algo quedó listo o dejar un seguimiento. No automatices lo que todavía no sabes hacer a mano.',
      },
      {
        q: '¿Elijo Zapier, Make o n8n?',
        a: 'Zapier o Make, si quieres armar el flujo sin código, y n8n si prefieres guardarlo contigo. Los tres conectan apps y ninguno decide la excepción ni el descuento.',
      },
      {
        q: '¿La automatización contesta sola al cliente?',
        a: 'Puede enviar un aviso que ya aprobaste. La queja, el precio y lo que no está escrito siguen con una persona, en atención al cliente.',
      },
    ],
  },
  'atencion-al-cliente': {
    title: 'IA para atención al cliente en pymes',
    lead:
      'La atención con IA sirve para contestar lo que ya está escrito: horario, dirección, estado. Es para el negocio cuyo chat repite la misma pregunta. En el sitio, Tidio o Intercom Fin; en WhatsApp, ManyChat, Respond.io, WhatsApp Business o Treble.',
    related: ['ventas-y-crm', 'automatizacion'],
    faqs: [
      {
        q: '¿Qué herramienta uso para atender clientes?',
        a: 'Tidio o Intercom Fin, si escriben en el sitio; ManyChat, Respond.io, WhatsApp Business o Treble, si escriben por WhatsApp. Empieza por uno solo. Treble es la API, no la app gratis.',
      },
      {
        q: '¿El bot puede cerrar una queja o un precio?',
        a: 'Esas salen a una persona: el bot cubre la respuesta que ya aprobaste. Si el dato no está escrito, tiene que decir que lo revisa alguien y no inventarlo.',
      },
      {
        q: '¿Atiendo y hago seguimiento con la misma herramienta?',
        a: 'La atención contesta y el seguimiento del contacto está en ventas y CRM. Si hay que pasar un dato de una app a otra, mira automatización.',
      },
    ],
  },
  'ventas-y-crm': {
    title: 'IA para ventas y seguimiento de leads',
    lead:
      'Ventas y CRM sirve para no perder el siguiente mensaje de un contacto. Es para quien cotiza y después se le olvida el seguimiento. HubSpot ordena el pipeline; Apollo.io ayuda con la lista; el perfil de Google junta reseñas.',
    related: ['atencion-al-cliente', 'automatizacion', 'investigacion'],
    faqs: [
      {
        q: '¿Cómo sigo un lead sin perderlo?',
        a: 'Anota el siguiente paso en un CRM, no en la memoria: HubSpot cubre el pipeline y Apollo.io ayuda a armar la lista. El perfil de Google muestra el negocio y las reseñas, no el seguimiento.',
      },
      {
        q: '¿La herramienta de ventas cierra la venta?',
        a: 'Ordena el contacto y el recordatorio; el precio y el sí los das tú. Si antes de llamar quieres leer fuentes, usa investigación y contrasta lo que salga.',
      },
      {
        q: '¿El seguimiento es lo mismo que la atención?',
        a: 'La atención contesta lo que ya está escrito y el seguimiento es el mensaje de después de una cotización o una visita. Si se te olvida, el hueco está aquí, no en el chat.',
      },
    ],
  },
  productividad: {
    title: 'IA de productividad para una pyme',
    lead:
      'Productividad con IA es dejar por escrito lo que hoy vive en la memoria: una nota, un formulario, una propuesta. Notion guarda; Jotform recoge; Gamma presenta; Otter.ai, Fireflies.ai y Fathom transcriben. Elige el hueco, no todas.',
    related: ['asistentes', 'automatizacion', 'escritura'],
    faqs: [
      {
        q: '¿Qué herramienta de productividad abro primero?',
        a: 'La del hueco que ya te cuesta: Notion si se pierde el documento, Jotform si el dato no queda anotado, Gamma si hay que presentar, y Otter.ai, Fireflies.ai o Fathom si la reunión no deja acta.',
      },
      {
        q: '¿Una nota de IA reemplaza el criterio?',
        a: 'Deja el texto ordenado para que alguien lo lea; el precio, el plazo y lo que se prometió los confirmas tú. Si el borrador todavía no existe, empieza por un asistente.',
      },
      {
        q: '¿Esto pasa el dato de una app a otra?',
        a: 'No por sí solo. Aquí se escribe y se guarda. Si el mismo dato hay que pasarlo a otra herramienta, el puente está en automatización.',
      },
    ],
  },
  'desarrollo-web': {
    title: 'IA para el sitio web de una pyme',
    lead:
      'Desarrollo web con IA sirve para sacar una página cuando no hay un equipo de programación. Es para un negocio que necesita presencia, no una plataforma a medida. En esta lista están Lovable y Framer. El texto y el precio los sigues definiendo tú.',
    related: ['diseno', 'e-commerce', 'atencion-al-cliente'],
    faqs: [
      {
        q: '¿Puedo armar el sitio de la pyme sin programar?',
        a: 'Lovable y Framer están para publicar una página sin un equipo de desarrollo. El texto, lo que cobras y el dominio no los inventa la herramienta.',
      },
      {
        q: '¿La página atiende sola al cliente?',
        a: 'Publica, no atiende: quien contesta el mensaje está en atención al cliente y quien sigue el contacto, en ventas y CRM. El sitio sin ese paso solo deja el aviso.',
      },
      {
        q: '¿Qué reviso antes de publicar la página?',
        a: 'El texto de lo que sí ofreces, un medio de contacto que lees y que el precio, si aparece, sea el que cobras. La herramienta puede armar el diseño. No confirma que el negocio esté bien descrito.',
      },
    ],
  },
  escritura: {
    title: 'IA para escribir textos de una pyme',
    lead:
      'Esta categoría corrige o traduce un texto que ya tienes. Grammarly revisa la redacción; DeepL traduce. Si todavía no hay borrador, empieza por un asistente y vuelve aquí para la revisión. Ninguna de las dos inventa la oferta.',
    related: ['asistentes', 'productividad'],
    faqs: [
      {
        q: '¿Uso Grammarly o un asistente para escribir?',
        a: 'El asistente arma el borrador, Grammarly lo corrige y DeepL lo traduce. Si abres el corrector sin texto, no tienes qué revisar.',
      },
      {
        q: '¿El corrector puede inventar una oferta?',
        a: 'Su trabajo es la redacción de un texto que ya escribiste: la oferta, el precio y la promesa los pones tú. Si cambia el sentido, deja tu frase.',
      },
      {
        q: '¿Traducir con DeepL alcanza para publicar?',
        a: 'Alcanza como borrador. Léelo en el idioma de salida antes de usarlo con un cliente. Un término de tu oficio puede quedar raro aunque la frase se vea bien.',
      },
    ],
  },
  'e-commerce': {
    title: 'IA para una tienda en línea de pyme',
    lead:
      'E-commerce con IA, aquí, es la ayuda dentro de la tienda, no un canal nuevo. Sirve si ya vendes en Shopify. La ficha es Sidekick de Shopify: puede dejar un borrador, no el precio ni el catálogo. La foto del producto sigue en diseño.',
    related: ['diseno', 'ventas-y-crm'],
    faqs: [
      {
        q: '¿Qué herramienta de tienda en línea hay aquí?',
        a: 'Sidekick de Shopify ayuda dentro de Shopify a redactar y a hacer tareas del admin. No arma el catálogo ni decide el precio, y si no vendes en Shopify esta categoría no cubre otra plataforma.',
      },
      {
        q: '¿La IA escribe la ficha del producto?',
        a: 'Puede dejar un borrador. El material, la talla, la compatibilidad y el precio los confirmas tú. La foto se trabaja en diseño, con Photoroom si hace falta.',
      },
      {
        q: '¿Dónde veo un caso y no una receta?',
        a: 'En la sección de casos, con la fuente al lado. Sirve para ver cómo otra empresa usó una herramienta. No es un catálogo de agentes ni un plan para copiar en tu tienda.',
      },
    ],
  },
};

export const HUBS: Record<string, DirectoryPageSeo> = {
  guias: {
    title: 'Guías de IA para pymes en Latinoamérica',
    lead:
      'Guías en español para usar una herramienta de IA en una tarea de pyme: atender, cobrar, publicar o seguir un contacto. Cada una nombra fichas del directorio y dice qué no hace. No es un curso.',
  },
  para: {
    title: 'IA para una tarea concreta de tu pyme',
    lead:
      'Elige la tarea —atender, cobrar, cotizar o publicar— y la guía nombra herramientas del directorio, los pasos y lo que no conviene automatizar. Talleres y detailing van primero.',
  },
  noticias: {
    title: 'Noticias de IA para pymes, con fuente',
    lead:
      'Notas de IA para quien opera una pyme. Cada una dice qué cambió, qué significa para el negocio y enlaza la fuente. Si la cifra no está en esa página, aquí no aparece.',
  },
  prompts: {
    title: 'Prompts de IA por rol para pymes',
    lead:
      'Prompts para practicar ventas, atención, contenido y finanzas con tu equipo. Se copian y se adaptan. No son una capacitación ni prometen un resultado.',
  },
  semana: {
    title: 'Herramienta de IA de la semana para pymes',
    lead:
      'Una ficha del directorio por semana, con cinco pasos para probarla en una tarea real. Sirve para elegir una herramienta, no para coleccionar cuentas.',
  },
  comparar: {
    title: 'Comparar herramientas de IA para pymes',
    lead:
      'Dos fichas del directorio, frente a frente, con la fecha de la fuente oficial. Sirve para elegir una. No hay puntaje ni un ganador inventado.',
  },
  alternativas: {
    title: 'Alternativas de IA cuando una no encaja',
    lead:
      'Si una herramienta no es la pieza, aquí hay otras fichas del mismo directorio. Cada lista dice para qué caso y la fecha en que se armó. No son equivalentes entre sí.',
  },
  casos: {
    title: 'Casos de uso de IA en negocios, con fuente',
    lead:
      'Un uso real, contado con la fuente al lado, para ver qué hizo otra empresa. No es un catálogo de agentes ni una receta para copiar en tu pyme.',
  },
  tendencias: {
    title: 'Tendencias de IA del mes para pymes',
    lead:
      'Lo que cambió este mes para una pyme que usa IA, sacado de las fuentes enlazadas. No hay conteos de redes ni de foros que nadie midió aquí.',
  },
};

export interface TaskLink {
  href: string;
  label: string;
  note: string;
}

export const TASK_LINKS: TaskLink[] = [
  {
    href: categoryPath('atencion-al-cliente'),
    label: 'Atención al cliente',
    note: 'Chat, WhatsApp y respuestas que ya están escritas. La queja y el precio siguen con una persona.',
  },
  {
    href: categoryPath('ventas-y-crm'),
    label: 'Ventas y CRM',
    note: 'Seguimiento del contacto después de cotizar o responder. La herramienta no cierra la venta.',
  },
  {
    href: categoryPath('automatizacion'),
    label: 'Automatización',
    note: 'Pasar un dato de una app a otra cuando el paso ya se hace a mano.',
  },
  {
    href: categoryPath('asistentes'),
    label: 'Asistentes',
    note: 'Un chat para redactar o resumir. Una cuenta basta para empezar.',
  },
  {
    href: '/herramientas-ia/para/atender-clientes',
    label: 'Atender clientes',
    note: 'Guía para las preguntas que ya tienen respuesta, en el sitio o en WhatsApp.',
  },
  {
    href: '/herramientas-ia/para/responder-whatsapp',
    label: 'Responder WhatsApp',
    note: 'Guía para el canal de WhatsApp Business, con una persona para lo que el bot no cierra.',
  },
  {
    href: '/herramientas-ia/para/cobrar',
    label: 'Cobrar',
    note: 'Guía para el mensaje de una factura vencida. No inventa un descuento ni un plazo.',
  },
  {
    href: '/herramientas-ia/guias',
    label: 'Guías',
    note: 'Tareas, noticias con fuente, prompts, comparativas y casos.',
  },
  {
    href: '/herramientas-ia/prompts',
    label: 'Prompts',
    note: 'Textos para adaptar en ventas, atención, contenido y finanzas. No son un curso.',
  },
];

export function categorySeo(slug: string): CategorySeo {
  const seo = CATEGORY_SEO[slug];
  if (!seo) throw new Error(`SEO ausente para la categoría ${slug}`);
  return seo;
}

export function hubSeo(key: string): DirectoryPageSeo {
  const seo = HUBS[key];
  if (!seo) throw new Error(`SEO ausente para la sección ${key}`);
  return seo;
}

function assertDirectorySeo(): void {
  const slugs = getCategories().map((category) => category.slug);
  for (const slug of slugs) {
    if (!CATEGORY_SEO[slug]) throw new Error(`SEO ausente para la categoría ${slug}`);
  }
  for (const key of Object.keys(CATEGORY_SEO)) {
    if (!slugs.includes(key)) throw new Error(`SEO de categoría desconocida: ${key}`);
  }
  for (const [slug, seo] of Object.entries(CATEGORY_SEO)) {
    for (const related of seo.related) {
      if (related === slug || !slugs.includes(related)) {
        throw new Error(`Categoría relacionada inválida: ${slug} → ${related}`);
      }
    }
  }
}

assertDirectorySeo();
