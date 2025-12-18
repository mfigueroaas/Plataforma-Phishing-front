# Plataforma Phishing - Frontend

## 🚀 Cómo ejecutar el proyecto

### Instalación y ejecución

```bash
# Instalar dependencias
npm i

# Iniciar servidor de desarrollo
npm run dev
```

## ⚡ Optimizaciones de Rendimiento

Este proyecto implementa optimizaciones avanzadas de rendimiento para cargas instantáneas:

- **Caché inteligente** con SessionStorage para UI instantánea
- **Stale-While-Revalidate** para datos siempre actualizados
- **Eliminación de listeners duplicados** en Firebase Auth
- **Carga diferida** de Firestore en segundo plano

### Métricas de rendimiento:
- Primera carga: ~1-2s
- Recarga con caché: <300ms
- UI visible: <100ms

📖 Ver detalles completos en [OPTIMIZACIONES.md](./OPTIMIZACIONES.md)

### Testing de rendimiento:
```bash
# En la consola del navegador, ejecutar:
node test-performance.js

# O copiar/pegar el contenido en DevTools Console
```

## 🛠️ Stack Tecnológico

- React 18 + TypeScript
- Vite
- Firebase Auth + Firestore
- Tailwind CSS + Radix UI
- CKEditor, Recharts

