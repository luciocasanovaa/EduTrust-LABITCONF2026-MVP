# EduTrust Fintech — MVP (LABITCONF 2026)

Plataforma fintech de becas universitarias con desembolsos verificados en dólares digitales (USDT), auditoría institucional, recepción de donaciones y portal de talento.

La idea central: los donadores financian becas, y cada materia aprobada por el alumno (verificada por la institución con su acta) libera automáticamente la recompensa asociada. Todo queda registrado y auditable.

## Roles y pantallas

El acceso se controla por rol (`src/utils/edutrustLogic.ts`, `ROLE_ALLOWED_SCREENS`).

| Rol | Pantallas |
|-----|-----------|
| **Alumno** | Mi Beca · Retirar a mi cuenta · Retiro completado · Perfil profesional y ofertas |
| **Donador** | Recepción de donaciones · Panel de auditoría · Búsqueda de talento |
| **Institución** | Portal de institución (carga de notas y actas) |

La pantalla de ingreso (`IngresoEstudiantes`) permite elegir el rol. También se puede entrar directo con `?role=alumno`, `?role=donador` o `?role=institucion` en la URL.

### Reglas de negocio principales

- Nota mínima de aprobación: **6**. Una materia aprobada con acta libera su recompensa en USDT; una desaprobada no genera desembolso.
- Validación de retiros contra el saldo disponible y cuentas bancarias registradas (ARS / USD).
- Aprobación de hitos de desembolso desde el panel de auditoría.
- Validación y registro de donaciones.
- Filtro de candidatos por perfil para empresas/donadores.

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Motion (animaciones) y lucide-react (íconos)
- `@google/genai` (integración con Gemini, opcional)

## Estructura

```
src/
├── App.tsx              # Estado global, navegación y control de acceso por rol
├── main.tsx
├── data/seedData.ts     # Datos de ejemplo (alumno, materias, donaciones, ofertas...)
├── screens/             # Una pantalla por archivo
├── types/edutrust.ts    # Tipos y enums del dominio
└── utils/
    ├── edutrustLogic.ts       # Lógica de negocio pura
    └── edutrustLogic.test.ts  # Tests (node:test)
```

## Cómo correrlo

**Requisitos:** Node.js 20+

```bash
npm install
cp .env.example .env.local   # completar GEMINI_API_KEY si se usa Gemini
npm run dev                  # http://localhost:3000

> **Si `npm install` falla por conflictos de dependencias** (error `ERESOLVE`), instalá con:
>
> ```bash
> npm install --legacy-peer-deps
> ```
>
> Si aún así falla, forzá la instalación:
>
> ```bash
> npm install --force
> ```
```

Otros scripts:

```bash
npm run build     # build de producción
npm run preview   # sirve el build
npm run lint      # chequeo de tipos (tsc --noEmit)
npx tsx --test src/utils/edutrustLogic.test.ts   # tests de lógica
```

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `GEMINI_API_KEY` | API key de Gemini |
| `APP_URL` | URL donde se hostea la app |

---

Proyecto desarrollado para **LABITCONF 2026**.
