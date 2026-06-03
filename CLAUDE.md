# CLAUDE.md — Betcol / FIFA World Cup 2026 Prediction App

## Stack
- **Frontend**: Next.js + TypeScript + Tailwind (`/web`)
- **Data principal**: `/web/lib/worldcupData.ts` — contiene `TEAMS` (Record<string, TeamData>) y `GROUP_STAGE_MATCHES`
- **Datos investigados**: `/data/wc2026/groups/grupo-[A-L].json` — fuente de verdad persistente

---

## Rutina: actualizar estadísticas de un grupo

### Palabras clave que activan esta rutina
`Grupo A` · `Grupo B` · ... · `Grupo L` · `actualiza [equipo]` · `research [equipo]`

### Proceso automático al recibir el keyword

```
1. Verificar si existe /data/wc2026/groups/grupo-[X].json
   └── SÍ → leer datos guardados, saltar al paso 4
   └── NO → continuar al paso 2

2. Lanzar 5 búsquedas paralelas (WebSearch) por cada equipo del grupo:
   - Ángulo 1: "[país] last 10 official international matches 2025 2026 results scores"
   - Ángulo 2: "[competición regional] qualifiers/tournament results [país] goals"
   - Ángulo 3: "[país] FIFA ranking June 2026"
   - Ángulo 4: FIFA World Cup 2026 Group [X] teams composition
   - Ángulo 5: Verificación cruzada de resultados clave

3. Guardar resultados en /data/wc2026/groups/grupo-[X].json
   (formato definido abajo)

4. Generar bloque TypeScript listo para copiar en worldcupData.ts
   (formato definido abajo)

5. Actualizar directamente worldcupData.ts en la sección del grupo correspondiente
```

---

## Formato JSON de investigación (fuente de verdad)

```json
{
  "group": "A",
  "lastUpdated": "2026-06-03",
  "teams": {
    "México": {
      "flag": "🇲🇽",
      "ranking": 15,
      "matches": [
        {
          "date": "2023-11-21",
          "opponent": "Honduras",
          "scoreFor": 2,
          "scoreAgainst": 0,
          "result": "W",
          "competition": "CONCACAF Nations League 2023-24 QF",
          "venue": "H",
          "confirmed": true
        }
      ],
      "notes": "Co-anfitrión — sin clasificatoria. Fuentes: ESPN, CONCACAF.com"
    }
  }
}
```

**Campos:**
- `result`: `"W"` | `"D"` | `"L"` — si fue penales, contar como W/L del ganador
- `confirmed`: `true` si el score viene de fuente directa; `false` si es estimado
- `notes`: competiciones cubiertas + fuentes usadas

---

## Formato TypeScript de salida (para worldcupData.ts)

```typescript
'NombreEquipo': {
  name: 'NombreEquipo',
  flag: '🏳️',
  // Competiciones: [lista de torneos cubiertos]
  // Partido más reciente: [fecha y resultado]
  // Fuente: [URL o nombre de fuente]
  wins: 0,       // victorias en últimos 10 partidos oficiales
  draws: 0,      // empates
  losses: 0,     // derrotas (wins + draws + losses == 10)
  goalsFor: 0,   // goles anotados
  goalsAgainst: 0, // goles recibidos
  form: ['W','D','L','W','W','L','D','W','W','D'], // del más antiguo al más reciente
  ranking: 0,    // FIFA ranking (última actualización disponible)
  group: 'A',
},
```

---

## Reglas de investigación

1. **Partidos oficiales primero**: Clasificatorias · Nations League · Copa Continental · Copa del Mundo · Copa Confederaciones
2. **Si hay menos de 10 oficiales**: completar con amistosos e indicarlo con `"confirmed": false`
3. **Penaltis**: contar como victoria/derrota (el ganador de la tanda lleva W)
4. **Resultado adjudicado** (walkover/descalificación): contar como derrota oficial
5. **Ranking**: usar última actualización FIFA disponible (pubicada 01/04/2026; próxima: 11/06/2026)
6. **Estimaciones**: siempre anotar en `notes` qué resultados son estimados y por qué

---

## Grupos del Mundial 2026

| Grupo | Equipos |
|-------|---------|
| A | México · Sudáfrica · Corea del Sur · Chequia |
| B | Canadá · Bosnia y Herzegovina · Catar · Suiza |
| C | Brasil · Marruecos · Escocia · Haití |
| D | Estados Unidos · Paraguay · Australia · Turquía |
| E | Alemania · Curazao · Costa de Marfil · Ecuador |
| F | Países Bajos · Japón · Suecia · Túnez |
| G | Bélgica · Irán · Nueva Zelanda · Egipto |
| H | España · Cabo Verde · Arabia Saudita · Uruguay |
| I | Francia · Senegal · Irak · Noruega |
| J | Argentina · Argelia · Austria · Jordania |
| K | Portugal · RD Congo · Uzbekistán · Colombia |
| L | Inglaterra · Croacia · Ghana · Panamá |

---

## Estado de investigación

| Grupo | Estado | Fecha |
|-------|--------|-------|
| A | ✅ Completado | 2026-06-03 |
| B | ✅ Completado | 2026-06-03 |
| C | ⏳ Pendiente | — |
| D | ⏳ Pendiente | — |
| E | ⏳ Pendiente | — |
| F | ⏳ Pendiente | — |
| G | ⏳ Pendiente | — |
| H | ⏳ Pendiente | — |
| I | ⏳ Pendiente | — |
| J | ⏳ Pendiente | — |
| K | ⏳ Pendiente | — |
| L | ⏳ Pendiente | — |

---

## Archivos clave

```
/web/lib/worldcupData.ts   ← editar aquí los bloques TypeScript finales
/data/wc2026/groups/       ← JSONs de investigación por grupo (fuente de verdad)
/CLAUDE.md                 ← este archivo (rutina y workflow)
```
