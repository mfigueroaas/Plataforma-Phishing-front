# Guía de Usuario - Plataforma de Phishing

## 📚 Descripción

Sistema completo de guía de usuario integrada en la plataforma de gestión de campañas de phishing. Incluye contenido multinivel (básico/intermedio/avanzado) para diferentes tipos de usuarios.

## 🎯 Características

### Funcionalidades Principales
- ✅ **3 Niveles de Contenido**: Básico, Intermedio y Avanzado
- ✅ **11 Secciones Principales**: Desde introducción hasta administración
- ✅ **5 Anexos**: Casos de uso, FAQ, glosario, mejores prácticas y troubleshooting
- ✅ **Búsqueda Inteligente**: Busca por título, contenido y keywords
- ✅ **Navegación Expandible**: Sidebar con árbol de secciones/subsecciones
- ✅ **Breadcrumbs**: Navegación contextual
- ✅ **Botones Prev/Next**: Navegación secuencial
- ✅ **Scroll Suave**: Scroll automático a secciones
- ✅ **Componentes Reutilizables**: Warning, Tip, InfoBox, CodeBlock, StepByStep, SuccessBox

## 📊 Estadísticas

- **Total de líneas de código**: ~5,742 líneas
- **Archivos creados**: 11 archivos TypeScript/TSX
- **Secciones**: 11 principales + 5 anexos = 16 secciones totales
- **Subsecciones**: ~40 subsecciones
- **Niveles de contenido**: 3 (básico/intermedio/avanzado)

## 📁 Estructura de Archivos

```
src/components/guide/
├── types.ts                              # Definiciones TypeScript
├── GuideLevelSelector.tsx                # Selector de nivel (Básico/Intermedio/Avanzado)
├── GuideSearch.tsx                       # Búsqueda con filtrado en tiempo real
├── GuideNavigation.tsx                   # Sidebar con navegación expandible
├── GuideSection.tsx                      # Renderizador de contenido + componentes auxiliares
├── UserGuide.tsx                         # Componente principal (layout + integración)
├── sections-intro.tsx                    # Sección 1: Introducción
├── sections-setup.tsx                    # Secciones 2-3: Primeros Pasos y Configuración
├── sections-dashboard-groups.tsx         # Secciones 4-5: Dashboard y Grupos
├── sections-templates-landing-smtp.tsx   # Secciones 6-8: Plantillas, Landing Pages, SMTP
├── sections-campaigns.tsx                # Sección 9: Campañas (Core)
├── sections-tools-admin.tsx              # Secciones 10-11: Herramientas y Administración
└── sections-annexes.tsx                  # Anexos A-E
```

## 🗺️ Mapa de Contenido

### Secciones Principales

1. **Introducción y Bienvenida**
   - ¿Qué es esta plataforma?
   - Conceptos básicos de phishing
   - Estructura de la guía

2. **Primeros Pasos**
   - Acceso y login (Firebase Auth)
   - Roles y permisos (Viewer/Operator/Admin)

3. **Configuración de Cuenta**
   - ¿Qué es GoPhish?
   - Crear configuración de GoPhish
   - Probar conexión
   - Gestionar múltiples configuraciones

4. **Dashboard - Panel de Control**
   - Métricas principales (KPIs)
   - Gráficas e interpretación

5. **Usuarios y Grupos**
   - ¿Qué es un grupo de objetivos?
   - Crear un grupo (manual o CSV)
   - Mejores prácticas de organización

6. **Plantillas de Email**
   - ¿Qué es una plantilla?
   - Crear y editar plantillas
   - Variables dinámicas

7. **Landing Pages**
   - ¿Qué es una landing page?
   - Crear landing pages
   - Captura de formularios

8. **Perfiles SMTP**
   - ¿Qué es un perfil de envío?
   - Configurar Gmail/Office 365/SendGrid
   - Crear un perfil SMTP

9. **Campañas de Phishing** ⭐ (Sección más importante)
   - ¿Qué es una campaña?
   - Crear y lanzar campaña
   - Monitorear resultados en tiempo real
   - Completar y archivar campañas

10. **Herramientas de Seguridad**
    - Verificador de URLs sospechosas
    - Sistema de reportes de phishing

11. **Administración y Configuración**
    - Gestión de usuarios de la plataforma
    - Configuración avanzada de GoPhish

### Anexos

- **Anexo A**: Casos de Uso Comunes
- **Anexo B**: Preguntas Frecuentes (FAQ)
- **Anexo C**: Glosario de Términos
- **Anexo D**: Mejores Prácticas (Checklist pre-campaña)
- **Anexo E**: Solución de Problemas (Troubleshooting)

## 🎨 Componentes Auxiliares

### Warning
Alerta roja para advertencias importantes.
```tsx
<Warning title="Atención">
  Contenido de advertencia...
</Warning>
```

### InfoBox
Cuadro azul informativo.
```tsx
<InfoBox title="Información">
  Contenido informativo...
</InfoBox>
```

### Tip
Sugerencia verde con bombilla.
```tsx
<Tip title="Consejo">
  Contenido del consejo...
</Tip>
```

### SuccessBox
Mensaje verde de éxito con checkmark.
```tsx
<SuccessBox title="Completado">
  Mensaje de éxito...
</SuccessBox>
```

### CodeBlock
Bloque de código con sintaxis highlight.
```tsx
<CodeBlock language="typescript">
{`const example = 'código aquí';`}
</CodeBlock>
```

### StepByStep
Guía paso a paso numerada.
```tsx
<StepByStep 
  title="Título opcional"
  steps={[
    { title: 'Paso 1', content: <p>Descripción...</p> },
    { title: 'Paso 2', content: <p>Descripción...</p> },
  ]} 
/>
```

## 🚀 Uso

### Acceder a la Guía

1. En el menú lateral de la plataforma, haz clic en **"Guía de Usuario"** (ícono de libro)
2. La guía se abrirá en la ruta `/guide`

### Seleccionar Nivel de Contenido

En la parte superior verás 3 botones:
- **📖 Básico**: Para usuarios sin conocimientos técnicos
- **💻 Intermedio**: Para administradores de IT
- **⚙️ Avanzado**: Para desarrolladores (código TypeScript/Go)

### Buscar Contenido

Usa el cuadro de búsqueda en el sidebar para filtrar secciones por palabra clave.

### Navegar

- **Sidebar**: Haz clic en secciones para expandir/colapsar
- **Breadcrumbs**: Muestra tu ubicación actual
- **Botones Prev/Next**: Navega secuencialmente
- **Scroll to Top**: Botón flotante para volver arriba

## 🔧 Desarrollo

### Agregar Nueva Sección

1. Crea/edita archivo de secciones (ej: `sections-mimodulo.tsx`)
2. Define la estructura:

```typescript
import { GuideSection } from './types';
import { MiIcono } from 'lucide-react';

export const miModuloSections: GuideSection[] = [
  {
    id: 'mi-seccion',
    title: 'Mi Sección',
    icon: MiIcono,
    subsections: [
      {
        id: 'mi-subseccion',
        title: 'Mi Subsección',
        searchKeywords: ['palabras', 'clave', 'busqueda'],
        content: {
          basico: <div>Contenido básico...</div>,
          intermedio: <div>Contenido intermedio...</div>,
          avanzado: <div>Contenido avanzado...</div>,
        },
      },
    ],
  },
];
```

3. Importa y agrega en `UserGuide.tsx`:

```typescript
import { miModuloSections } from './sections-mimodulo';

const sections: GuideSectionType[] = [
  ...existingSections,
  ...miModuloSections,
];
```

## 📝 Convenciones de Contenido

### Nivel Básico
- Lenguaje simple, sin jerga técnica
- Explicaciones paso a paso
- Capturas de pantalla (cuando aplique)
- Ejemplos del mundo real

### Nivel Intermedio
- Detalles técnicos moderados
- Diagramas de arquitectura
- Explicaciones de APIs
- Configuraciones avanzadas

### Nivel Avanzado
- Código fuente (TypeScript/Go)
- Implementaciones detalladas
- Queries SQL
- Mejores prácticas de desarrollo

## 🎯 Roadmap Futuro

- [ ] Agregar modo de impresión (PDF export)
- [ ] Agregar videos tutoriales embebidos
- [ ] Implementar sistema de favoritos
- [ ] Agregar historial de navegación
- [ ] Implementar feedback de usuarios
- [ ] Agregar modo oscuro específico para código
- [ ] Traducción a inglés (i18n)

## 🐛 Debugging

### Verificar errores TypeScript
```bash
cd proyecto/Plataforma-Phishing-front-main
npx tsc --noEmit
```

### Ver estructura de navegación
Abre DevTools (F12) y ejecuta:
```javascript
console.table(sections.map(s => ({
  id: s.id,
  title: s.title,
  subsections: s.subsections.length
})));
```

## 📄 Licencia

Este componente es parte de la Plataforma de Phishing y sigue la misma licencia del proyecto principal.

## 👥 Contribuir

Para contribuir contenido a la guía:

1. Identifica la sección/subsección a mejorar
2. Edita el archivo correspondiente (`sections-*.tsx`)
3. Mantén consistencia con el estilo existente
4. Usa componentes auxiliares (Warning, Tip, CodeBlock, etc.)
5. Verifica que no haya errores TypeScript
6. Prueba la navegación y búsqueda

---

**Última actualización**: Enero 2026  
**Versión**: 1.0.0  
**Total de contenido**: ~5,700+ líneas de código
