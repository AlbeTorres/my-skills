# My Agent Skills

Instala skills para tus agentes de IA favoritos con un solo comando.

## Uso

```bash
npx my-agent-skills
```

El instalador interactivo te guiará para:

1. **Elegir qué skills instalar** — podés seleccionar una o varias
2. **Elegir el agente** — Claude Code, OpenCode, Antigravity, o ruta personalizada
3. **Elegir dónde** — a nivel de proyecto o global del sistema
4. **Confirmar** y listo ✅

## Skills disponibles

| Skill    | Descripción             |
|----------|-------------------------|
| skill1   | Mi Skill 1              |
| skill2   | Mi Skill 2              |

## Agentes soportados

- **Claude Code** — `.claude/skills/`
- **OpenCode** — `.opencode/skills/`
- **Antigravity** — `.antigravity/skills/`
- **Ruta personalizada** — la que vos quieras

## Agregar más skills

Creá una carpeta dentro de `skills/` con un archivo `SKILL.md` adentro.  
El instalador la detecta automáticamente.

```
skills/
├── mi-nueva-skill/
│   └── SKILL.md
```
