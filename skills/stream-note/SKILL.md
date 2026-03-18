---
name: stream-note
description: >
  Transforma investigación de noticias en una "Nota Desarrollada" completa para streams en vivo o podcasts de larga duración (1-2 horas). 
  Se activa con el comando /stream-note seguido de la investigación.
  Genera: título clickbait, guion de puntos clave con negritas para leer en vivo, preguntas de engagement para el chat, 
  referencias, recomendaciones multimedia, clips para shorts (opcional), y blog post completo para newsletter.
  Usar siempre que el usuario escriba /stream-note, mencione "nota de stream", "preparar stream", 
  "procesar investigación para stream" o quiera convertir noticias/notas en contenido para podcast o streaming en vivo.
---

# Stream Note Skill

Convierte investigación en bruto en una Nota Desarrollada lista para stream, podcast o newsletter.

---

## Activación

El usuario escribe:

```
/stream-note [idioma: ES|EN|otro] [--shorts] 
[pega aquí su investigación, notas, enlaces o texto]
```

- **Idioma**: opcional. Si no se especifica, detectar el idioma de la investigación proporcionada.
- **--shorts**: flag opcional. Si está presente, incluir la sección "Clips para Shorts". Si no está, omitirla.

---

## Instrucciones de Comportamiento

1. **Leer toda la investigación** antes de generar cualquier sección.
2. **Inferir el título** si no se proporciona: debe ser creativo, clickbait honesto (no amarillista), con gancho narrativo.
3. **Tono**: narrativo, ágil, crítico, con toques de humor o curiosidad intelectual. Ideal para hablar en vivo, no para leer en silencio.
4. **Nunca inventar datos** no presentes en la investigación. Si falta contexto, indicarlo con `[VERIFICAR]`.
5. **Generar todas las secciones en el idioma especificado** (o detectado). Si el usuario indica `idioma: EN`, todo el output va en inglés, incluyendo los callouts de Obsidian.
6. **Genera el archivo en la carpeta developing** con el nombre de la investigación.
7. **Busca en internet por los enlaces de referencia** si el usuario no los proporciona. y si no los encuentra, indica que no se encontraron.
8. **Asegurate de que los enlaces sean validos y funcionales**.


---

## Formato de Output

Usar **Markdown estricto compatible con Obsidian**. Seguir esta estructura exacta:

---

### 1. Título

```
# [Título: Creativo, con gancho, honesto — no clickbait amarillista]
```

---

### 2. Temas

```markdown
## 📋 Temas que lo comprenden

- [emoji] Subtema 1
- [emoji] Subtema 2
- [emoji] Subtema 3
(mínimo 4, máximo 8 subtemas)
```

---

### 3. Guion de Puntos Clave

```markdown
## 🎙️ Guion de Puntos Clave (No dejar de mencionar)
```

- Lista de viñetas.
- Cada punto: **1-2 líneas máximo**. Fácil de leer mientras se habla en vivo.
- **Palabras clave siempre en negrita** para identificarlas de un vistazo.
- Incluir sub-viñetas cuando un punto necesite ejemplos concretos.
- Flujo narrativo: de lo más simple a lo más impactante (estructura de escalada).

---

### 4. Preguntas para el Chat

Usar callout de Obsidian:

```markdown
> [!question] **Preguntas para el Chat (Engagement)**
> - Pregunta 1
> - Pregunta 2
> - Pregunta 3
> - Pregunta 4 (opcional)
> - Pregunta 5 (opcional)
```

- Mínimo 3, máximo 5 preguntas.
- Deben ser **polémicas, abiertas o que generen debate**.
- Evitar preguntas de sí/no sin contexto.
- Conectar directamente con el tema de la nota.

---

### 5. Referencias

```markdown
## 🔗 Enlaces de Referencia

- [Fuente 1](url) — descripción breve
- [Fuente 2](url) — descripción breve
```

- Organizar por tipo: fuente primaria → cobertura → comunidad/redes.
- Si el usuario no proporcionó URLs, indicar el nombre de la fuente.

---

### 6. Recomendaciones Multimedia

```markdown
## 🎬 Recomendaciones Multimedia

**Visuales sugeridos:**
1. ...
2. ...

**Ideas para mostrar en stream:**
- ...

**Idea de clip viral:**
- ...
```

- Sugerir imágenes, videos de YouTube, tweets o gráficos.
- Incluir al menos 1 idea de clip/momento viral específico del segmento.

---

### 7. Clips para Shorts *(solo si el usuario usó el flag `--shorts`)*

```markdown
---

### Clips para Shorts

**Clip 1 — "[Título del clip]"**

"[Texto tal como se diría en cámara. 3-5 líneas. Impacto inmediato.]"

---

**Clip 2 — "[Título del clip]"**

"[Texto del clip 2]"
```

- Mínimo 3 clips, máximo 5.
- Cada clip debe funcionar **standalone** (sin contexto previo del stream).
- Formato: gancho → dato impactante → cierre con pregunta o dato sorpresivo.
- Si el flag `--shorts` no está presente, **omitir esta sección completamente**.

---

### 8. Blog Post / Newsletter

```markdown
## ✍️ Contenido Desarrollado (Blog Post)

### Introducción

[Hook potente: problema, dato impactante o paradoja. 3-5 párrafos cortos.]

### Desarrollo

[Explicación detallada con contexto histórico si aplica. Análisis de implicaciones. 
Usar párrafos cortos. Evitar muros de texto.]

### Conclusiones

[Reflexión final. Pregunta abierta para fomentar comentarios. No cerrar con moraleja obvia.]
```

---

## Reglas de Calidad

| Regla | Descripción |
|---|---|
| Párrafos cortos | Máximo 3-4 líneas por párrafo en blog post |
| Negritas funcionales | Solo en palabras clave, no decorativas |
| Tono consistente | Narrativo y crítico, nunca corporativo |
| Sin relleno | Eliminar frases como "es importante destacar que..." |
| Escalada de info | De lo conocido a lo sorprendente |
| Honestidad | Si algo es especulativo, marcarlo como tal |

---

## Ejemplo de Activación Correcta

```
/stream-note idioma: ES --shorts

EA está contratando un Senior Anti-Cheat Engineer para Javelin.
El puesto menciona soporte para Linux y Proton.
Los juegos de EA no funcionan en Linux por el anti-cheat a nivel kernel.
Steam Deck tiene millones de unidades con SteamOS/Linux.
También se menciona ARM64.
```

→ Claude genera la nota completa con todas las secciones, incluyendo Clips para Shorts.

---

## Ejemplo sin Shorts

```
/stream-note idioma: EN

[investigación en inglés]
```

→ Claude genera todo en inglés, omite la sección de Clips para Shorts.