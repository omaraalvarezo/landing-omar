---
title: IA para investigar antes de vender
description: "Antes de una llamada, Perplexity y Gemini Notebook (antes NotebookLM) sirven para leer fuentes. Apollo.io y HubSpot ordenan el prospecto. La ficha hay que contrastarla: ninguna verifica sola al cliente."
published: 2026-10-16
tools:
  - perplexity
  - notebooklm
  - apollo-io
  - hubspot
steps:
  - Anota el nombre de la empresa, la ciudad y la pregunta concreta que quieres resolver en la llamada.
  - Busca en Perplexity y abre las fuentes. Si la respuesta no trae enlace, no la uses en la reunión.
  - Si ya tienes un PDF, una propuesta vieja o un sitio guardado, cárgalo a Gemini Notebook y pregunta solo sobre ese material.
  - Completa el contacto en Apollo.io o en HubSpot. Trata el teléfono y el cargo como una pista, no como un hecho, hasta confirmarlos.
  - Llega a la llamada con tres preguntas, no con un discurso generado.
prompt: 'Prepara una ficha de una página para una llamada comercial. Empresa: """nombre y ciudad""". Pregunta que quiero resolver: """una pregunta""". Devuelve: qué sé con fuente, qué no sé, y tres preguntas para la llamada. No inventes cargos, teléfonos, ingresos ni clientes. Si un dato no viene en el texto que te pego, márcalo como “sin confirmar”.'
faqs:
  - q: ¿La base de prospectos ya trae el dato verificado?
    a: No lo asumas. Apollo.io está en el directorio como base de prospectos y secuencias. Un cargo o un correo puede estar viejo. Confírmalo antes de escribirle a alguien como si ya lo conocieras.
  - q: ¿Gemini Notebook busca en toda la web?
    a: No es su papel en esta guía. Aquí se usa para preguntarle a documentos que tú cargaste. Para buscar fuentes públicas, la ficha del directorio que aplica es Perplexity.
  - q: ¿Hace falta un CRM para la primera llamada?
    a: No. HubSpot está en la lista porque tiene plan gratuito y funciones de IA. Si todavía no hay pipeline, una ficha de una página alcanza. El CRM entra cuando hay más de un trato al tiempo.
related:
  - armar-una-propuesta
---

## El problema

La llamada empieza con “cuéntame de tu empresa” porque nadie leyó nada antes. El prospecto lo nota. Investigar no es pedirle al chat una biografía. Es salir con fuentes y con los huecos marcados.

Perplexity apunta a lo público. Gemini Notebook se queda en tus documentos. Apollo.io y HubSpot guardan el contacto. Ninguno cierra la venta.
