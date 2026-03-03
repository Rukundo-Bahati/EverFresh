# EVERFRESH Mobile

EverFresh Mobile is a React Native (Expo Router) control app for EverFresh storage hardware.
It supports:

- Single smart container setups (one purchased container)
- Multi-container control-center setups (one control unit supplying conditions to many containers)

The app enforces setup-based access, validates IDs against admin-recorded data, and only allows users to manage containers registered under their setup.

## Product Model

- Single setup:
  - User registers a `Container ID`
  - User enters setup access code
  - Account controls only that one container

- Control-center setup:
  - User registers a `Control Center ID`
  - User adds each owned container ID (optional nickname)
  - User enters setup access code
  - Account controls only those registered containers

## Main Features

- Setup-based authentication (no email/password login)
- Two-step login:
  1. Setup ID check page
  2. Access code page
- Two-step registration:
  1. Setup ID check page (+ container list builder for control-center)
  2. Access code page to complete registration
- Inline not-found/invalid ID feedback during registration/login
- Account-scoped management:
  - Dashboards only show containers linked to logged-in setup
  - Batches are filtered to registered containers only
- AI-assisted batch creation:
  - Enter product name only
  - AI autofills profile/targets in background
  - Save -> review modal -> confirm
- Batch and container detail pages on card tap
- In-app alerts center with read/unread + notification preference controls
- Mobile-first chocolate theme UI
- Motion and navigation:
  - Screen content enter animation
  - Horizontal swipe navigation across main tab pages

## Current App Flows

### Login

- `app/auth/login.tsx`: enter setup ID and validate
- `app/auth/login-access.tsx`: enter access code and sign in

### Registration

- `app/auth/signup.tsx`: setup check and (for control-center) container list build
- `app/auth/signup-access.tsx`: access code and save registration

### Operations

- Dashboard home with live metrics + charts
- Containers list and container detail screen
- Batches list, add-batch modal flow, and batch detail screen
- Settings for profile, container model view, alerts, power, analytics, advanced, logout

## Data/State Model (Current)

This prototype uses local in-memory stores to simulate DB behavior:

- `constants/sessionStore.ts`
  - Admin-recorded setup IDs and access codes
  - Setup registration/login workflow state
  - Account creation and current session

- `constants/appStore.ts`
  - Containers, batches, alerts
  - Filtering by logged-in account registered container links
  - Batch draft generation + save

In production, this should be replaced by API + persistent backend DB.

## Tech Stack

- Expo + React Native + TypeScript
- Expo Router
- NativeWind (Tailwind for RN)
- `react-native-chart-kit`

## Run

```bash
npm install
npm run start
```

## Testing

### Automated checks

Type-check used for this codebase:

```bash
npx tsc --noEmit --moduleResolution bundler
```

### Manual test checklist

1. Login setup check
- Enter unknown setup ID -> inline "not found" error shown
- Enter known but unregistered setup -> inline "found but not registered" error shown
- Enter registered setup -> proceeds to access page

2. Login access code
- Wrong code -> inline error
- Correct code -> dashboard opens

3. Registration: single-container
- Valid single container ID -> setup verified
- Continue to access page, wrong code rejected
- Correct code registers and logs in
- App shows only that container in managed views

4. Registration: control-center
- Valid control center ID -> setup verified
- Add container IDs:
  - invalid/unlinked ID rejected immediately
  - valid IDs appear in list
- Access page:
  - wrong code rejected
  - correct code saves registration
- App shows only selected registered containers

5. Batches and containers detail pages
- Tap batch card -> batch details screen
- Tap container card -> container details screen

6. Add batch
- Enter product name -> AI details autofill
- Save -> review modal -> confirm
- Batch appears in list and container profile updates

7. Notifications
- Alerts appear in alerts center
- Unread count updates
- Opening alerts marks as read

8. Responsiveness
- Verify all major screens on real device portrait
- Confirm add-batch modal and list cards are fully visible

### Ready test data

Single-container registration tests:
- `CTR-9003` + access code `3903`
- `CTR-9004` + access code `3904`
- `CTR-9005` + access code `3905`
- `CTR-9006` + access code `3906`
- `CTR-9007` + access code `3907`

Multi-container registration tests:
- `CTRL-1004` + access code `423456`
  - valid containers: `CTR-16`, `CTR-17`, `CTR-18`, `CTR-19`, `CTR-20`
- `CTRL-1005` + access code `523456`
  - valid containers: `CTR-03`, `CTR-07`, `CTR-11`, `CTR-15`, `CTR-19`

Pre-registered login tests:
- `CTRL-1001` + `123456`
- `CTRL-1002` + `223456`
- `CTRL-1003` + `323456`
- `CTR-9001` + `3901`
- `CTR-9002` + `3902`

Negative tests:
- Not found setup: `CTRL-9999`
- Wrong format for container mode: `CTRL-1002` on single-container registration
- Wrong format for control-center mode: `CTR-9003` on control-center registration
- Wrong access code example: `CTRL-1001` + `000000`

Sign-out test:
- From dashboard, go to Settings -> Logout -> Sign Out
- Expected: app returns to `/auth/login` and session is cleared
- Reopening protected dashboard routes without re-login should redirect to login

## Demo Credentials

- Setup ID: `CTRL-1001`
- Access Code: `123456`

## Notes

- Company/farm display label is auto-generated at registration in current local store.
- Admin update tooling is not yet implemented in this mobile app.
- Backend persistence and real admin tables should be the next integration step.
