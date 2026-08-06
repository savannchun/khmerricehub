# KhmerRiceHub — React

Marketplace connecting Cambodian rice farmers with buyers. This project is wired to
**Firebase** (Firestore + Authentication) with a built-in demo-data fallback so it
always runs, even with an empty database.

## Run locally

```bash
npm install
npm run dev
```

## Firebase connection

Firebase is already configured in `src/firebase/firebase.js` (project: `khmerricehub`).
Three things were added on top of the demo app:

1. **Data layer** — `src/lib/services.js`
   - Reads live data from Firestore collections (`riceListings`, `farmers`, `reviews`,
     `orders`, `notifications`, `messages`, `users`).
   - If a collection is empty or Firestore is unreachable, it automatically falls back
     to the bundled demo data, so the app never breaks.
   - Writes: `createOrder` (checkout), `saveListing`, `markNotificationRead`, `seedDemoData`.

2. **Authentication** — `src/context/AuthContext.jsx`
   - Real email/password sign up + log in, Google sign-in, and logout via Firebase Auth.
   - Profile (`name`, `role`, `phone`) is stored in the `users` collection.
   - A **"Skip — continue as demo ..."** button keeps the app usable without Firebase Auth.

3. **Demo seeding** — one click
   - Admin Dashboard → **"Load demo data into Firestore"** uploads the bundled demo records
     into Firestore so the app reads "live" data.
   - Demo images are stored as `asset:<name>` tokens and resolved back to the bundled
     images on read.

## Firebase setup required once

1. In the [Firebase console](https://console.firebase.google.com), open the
   **khmerricehub** project.
2. **Firestore Database** → create database, then publish the demo rules in
   `firestore.rules` (permissive — read/write for everyone). Lock them down before production.
3. **Authentication** → Sign-in method → enable **Email/Password** and **Google**.
4. Deploy (optional):
   ```bash
   npm run build
   firebase deploy
   ```
   `firebase.json` is pre-configured for Firebase Hosting (rewrites to `index.html`).

## Project structure

- `src/lib/data.js` — demo data (fallback + seed source)
- `src/lib/services.js` — Firestore data layer
- `src/lib/useAsyncData.js` — small hook that loads data with an instant demo fallback
- `src/context/AuthContext.jsx` — Firebase Auth provider
- `src/firebase/firebase.js` — Firebase init (app, firestore, auth)
- `src/pages/` — storefront, buyer, farmer, and admin views

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build to `dist/`
- `npm run lint` — ESLint
