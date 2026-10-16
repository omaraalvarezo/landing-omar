---
checked: 2026-10-16
task: "Apollo.io sirve para prospección B2B: buscar empresas y personas con su cargo, armar listas y escribirles con secuencias de correo y llamadas. Sus agentes de IA investigan cuentas, redactan y hacen seguimiento. Tiene un plan gratuito sin límite de tiempo, pensado para uso ligero. La tarea en una pyme: llegarles a empresas que podrían ser clientes en vez de esperar a que escriban."
useCase:
  sector: coworking
  title: Una lista de empresas para ofrecer planes de equipo
  steps:
    - "Define el cliente en una línea: empresas de servicios de tu ciudad, de 5 a 30 empleados, con un gerente o un director administrativo."
    - "Filtra la base con esos criterios y revisa a mano los primeros 20 resultados. Si la mitad no aplica, ajusta el filtro."
    - "Escribe tú el primer correo: quién eres, qué ofreces y una pregunta. Corto. La IA puede proponer variaciones; tú eliges."
    - "Arma una secuencia de tres toques, no de diez. Si no responden al tercero, salen de la lista."
    - "Pasa a tu CRM solo a los que respondieron."
limits:
  - "No pude confirmar en su sitio la cobertura de datos para empresas de Colombia. Revisa tu ciudad antes de pagar."
  - "Los créditos se reparten por ciclo y los que no usas vencen, según la página de precios."
  - "En el plan gratuito solo puedes conectar cuentas de Gmail."
  - "Los planes son para uso interno del negocio; revender los datos requiere otro acuerdo. Y escribirle a alguien que no te dio su correo exige cuidado con la ley de datos personales."
alternatives:
  - tool: hubspot
    when: "si los clientes ya llegan solos y lo que falta es el seguimiento."
  - tool: perplexity
    when: "si quieres investigar a fondo pocas empresas antes de escribirles."
  - tool: chatgpt
    when: "si solo necesitas redactar el correo y ya tienes la lista."
beforePaying:
  - "Busca en el plan gratuito 50 empresas de tu ciudad y verifica cuántos datos de contacto son correctos."
  - "Revisa cuántos créditos gasta revelar un correo o un teléfono y cuántos trae el plan."
  - "Confirma que tu dominio de correo está listo para enviar en volumen sin caer en spam. Apollo trae herramientas de calentamiento, pero la reputación del dominio es tuya."
  - "Lee la política de uso justo que aplica a las funciones «ilimitadas»."
sources:
  - name: apollo.io
    url: https://www.apollo.io
  - name: los precios de Apollo
    url: https://www.apollo.io/pricing
---
