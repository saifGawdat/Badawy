# Multi-Step Consultation Booking Wizard

## Overview
Replace the current single-page appointment form with a 4-step interactive wizard that guides patients through booking a consultation with Dr. Mostafa Badawi.

---

## Current State
- `src/components/sections/Appointment.tsx` — single-page form with all fields visible at once
- Fields: fullName, email, phone, procedure (dropdown), locationId (dropdown), message (textarea)
- Posts to `POST /api/appointments`
- Prisma `Appointment` model has: id, fullName, email, phone, procedure, message, status, locationId, createdAt

---

## Proposed Flow

### Step 1 — Personal Information
**File:** `src/components/sections/AppointmentWizard/StepPersonalInfo.tsx`
- Full Name (required)
- Phone Number (required)
- Email Address (optional)

### Step 2 — Select Procedure
**File:** `src/components/sections/AppointmentWizard/StepProcedure.tsx`
- Visual card grid (2-3 columns) showing each service with image + title
- Fetches from `GET /api/items`
- Tap to select, highlighted state

### Step 3 — Branch & Scheduling
**File:** `src/components/sections/AppointmentWizard/StepSchedule.tsx`
- Branch selector (radio cards) — fetches from `GET /api/locations`
- Preferred date input
- Preferred time input

### Step 4 — Review & Confirm
**File:** `src/components/sections/AppointmentWizard/StepConfirm.tsx`
- Summary card showing all selections
- Edit button returns to specific step
- Additional notes textarea
- Confirm button submits

### Wizard Container
**File:** `src/components/sections/AppointmentWizard/WizardContainer.tsx`
- Progress bar (4 steps)
- Step navigation (Back / Continue)
- Framer Motion slide transitions between steps
- Manages shared wizard state via React `useReducer` or `useState`
- On final submit: POST to `/api/appointments`

---

## State Management

```typescript
interface WizardState {
  step: 1 | 2 | 3 | 4;
  fullName: string;
  email: string;
  phone: string;
  procedureId: string | null;
  procedureTitle: string;
  locationId: string | null;
  locationName: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  isSubmitting: boolean;
}
```

---

## Data Flow

```
WizardContainer
  ├── StepPersonalInfo    → updates state.fullName, .phone, .email
  ├── StepProcedure       → fetches /api/items, updates state.procedureId
  ├── StepSchedule        → fetches /api/locations, updates state.locationId, .preferredDate, .preferredTime
  └── StepConfirm         → displays summary, handles submit
        │
        ▼
  POST /api/appointments  → { fullName, email, phone, procedure, locationId, message, preferredDate, preferredTime }
        │
        ▼
  toast.success → reset wizard → redirect or show confirmation
```

---

## Prisma Schema Changes

```prisma
model Appointment {
  id             String            @id @default(cuid())
  fullName       String
  email          String
  phone          String
  procedure      String
  message        String            @default("")
  status         AppointmentStatus @default(new)
  locationId     String?
  location       Location?         @relation(fields: [locationId], references: [id])
  preferredDate  String?           // NEW
  preferredTime  String?           // NEW
  createdAt      DateTime          @default(now())
}
```

Run:
```bash
npx prisma migrate dev --name add-preferred-date-time
```

---

## Component Tree

```
src/components/sections/AppointmentWizard/
├── index.ts              // re-exports
├── WizardContainer.tsx    // main wizard with progress + step routing
├── StepPersonalInfo.tsx   // step 1
├── StepProcedure.tsx      // step 2
├── StepSchedule.tsx       // step 3
├── StepConfirm.tsx        // step 4
├── ProgressBar.tsx        // visual progress indicator
└── types.ts              // shared types
```

---

## UI/UX Notes

- **Progress bar:** 4 dots or segments at the top, filled as user progresses
- **Transitions:** Framer Motion `AnimatePresence` with slide left/right direction based on forward/backward navigation
- **Validation:** Each step validates before allowing "Continue"
- **Mobile:** Full-screen step layout (one step at a time, no scrolling)
- **Direction-aware:** RTL support via `useLanguage()` context — progress bar flows right-to-left in Arabic
- **Styling:** Reuse existing `GlassCard`, input styles from `Appointment.tsx`

---

## Implementation Order

1. Create `types.ts` — shared WizardState + action types
2. Create `ProgressBar.tsx` — visual step indicator
3. Create `StepPersonalInfo.tsx` — name, phone, email
4. Create `StepProcedure.tsx` — visual service cards
5. Create `StepSchedule.tsx` — branch, date, time
6. Create `StepConfirm.tsx` — summary + submit
7. Create `WizardContainer.tsx` — orchestrate steps, manage state, handle submit
8. Update `Appointment.tsx` — replace form with `<WizardContainer />`
9. Update Prisma schema + run migration
10. Update `POST /api/appointments` route to accept new fields

---

## Files to Create/Modify

| Action | File |
|--------|------|
| Create | `src/components/sections/AppointmentWizard/types.ts` |
| Create | `src/components/sections/AppointmentWizard/ProgressBar.tsx` |
| Create | `src/components/sections/AppointmentWizard/StepPersonalInfo.tsx` |
| Create | `src/components/sections/AppointmentWizard/StepProcedure.tsx` |
| Create | `src/components/sections/AppointmentWizard/StepSchedule.tsx` |
| Create | `src/components/sections/AppointmentWizard/StepConfirm.tsx` |
| Create | `src/components/sections/AppointmentWizard/WizardContainer.tsx` |
| Create | `src/components/sections/AppointmentWizard/index.ts` |
| Modify | `src/components/sections/Appointment.tsx` |
| Modify | `prisma/schema.prisma` |
| Create | prisma migration (via CLI) |
| Modify | `src/app/api/appointments/route.ts` |

---

## Estimated Effort

- **Wizard components:** ~3-4 hours
- **Prisma + API changes:** ~30 min
- **Integration & testing:** ~1 hour
- **Total:** ~5-6 hours
