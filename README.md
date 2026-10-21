# Cúmulo — Calculadora de Interés Compuesto & Proyector Patrimonial

Plataforma interactiva de alta precisión para proyectar el crecimiento exponencial de inversiones mediante interés compuesto, aportaciones periódicas, ajuste por inflación y desglose año por año.

---

## Características Principales

1. **Motor de Cálculo Financiero de Alta Precisión:**
   - Capital inicial y aportaciones periódicas (quincenales, mensuales o anuales).
   - Tasa de interés anual con capitalización configurable (diaria, mensual, trimestral, semestral o anual).
   - Ajuste por inflación para proyectar el **Poder Adquisitivo Real**.
   - Detección automática del **Punto de Inflexión** (año en que los intereses superan el total ahorrado de tu bolsillo).
   - Estimación de **Renta Pasiva Mensual** bajo la regla del 5%.
   - Cálculo automático de la **Regla del 72** (tiempo necesario para duplicar el capital).

2. **Gráfico Dinámico & Scrubbing Interactivo (SVG Puro):**
   - Vista conmutable entre **Área Acumulada** y **Barras Anuales**.
   - Tooltip interactivo al deslizar el cursor sobre cualquier año.
   - Marcador visual de hitos (primer millón e inflexión).

3. **Estrategias Preconfiguradas (Benchmarks 2026):**
   - **CETES / Renta Fija Gubernamental:** 10.5% anual (mensual).
   - **S&P 500 / ETFs Indexados:** 10.0% anual (anual).
   - **FIBRAS / Bienes Raíces:** 8.5% anual (trimestral).
   - **SOFIPOs / Cuentas de Alto Rendimiento:** 13.5% anual (diaria).
   - **Portafolio Conservador:** 6.5% anual (mensual).

4. **Calculadora Inversa de Metas:**
   - Define una meta patrimonial (ej. $1,000,000 o $5,000,000) y el algoritmo calcula la aportación mensual exacta requerida para lograrla en el plazo deseado.

5. **Auditoría Numérica Año por Año & Exportación CSV:**
   - Tabla con desglose de saldo inicial, aportación anual, interés del año, interés acumulado y saldo real.
   - Botón de exportación directa a archivo `.csv` compatible con Excel.
   - Botón para copiar resumen al portapapeles y compartir.

---

## Stack Tecnológico

- **Framework:** Next.js (App Router, Turbopack)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS (Atmósfera Obsidian Matrix Fintech)
- **Iconografía:** Lucide React (SVG puros)
- **Visualización de Datos:** SVG reactivo nativo

---

## Ejecución Local

```bash
cd /home/luisponce94/calculadora-interes-compuesto
npm run dev   # Servidor de desarrollo en puerto 3001
npm run build # Compilación de producción
npm run start # Servidor de producción en puerto 3001
```
