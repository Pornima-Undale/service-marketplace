# LocalPro — Hyperlocal Service Marketplace (Angular Frontend)

A complete Angular 18 (standalone components + signals) frontend built to match the
`service-marketplace-backend-v2` Spring Boot API.

## Tech Stack
- Angular 18 (standalone components, signals, new `@if/@for` control flow)
- Reactive Forms
- Plain CSS custom properties (no UI framework) — Open Sans / Poppins, blue (#0A6EB4) theme
- Zero external UI libraries — fully hand-built, professional design system

## Getting Started

```bash
npm install
npm start
```

The app runs at **http://localhost:4200** by default and expects the Spring Boot backend
to be running at **http://localhost:8080** (already configured for CORS in the backend's
`CorsConfig`). Change the API URL in `src/environments/environment.ts` if needed.

To create a production build:
```bash
npm run build
```
Output is written to `dist/service-marketplace-frontend`.

## What's included

- **Public pages:** Landing page, Browse Services (search/filter/sort), Service Detail
  (with reviews & ratings)
- **Auth:** Login & Register (role selection: Customer / Provider), JWT stored in
  localStorage, auto-attached to every request via an HTTP interceptor
- **Customer:** Book a service, view booking status ("My Bookings")
- **Provider:** Business profile setup, add/edit/delete services, accept & complete
  incoming bookings, dashboard with quick stats
- **Admin:** Manage users (list & delete), manage categories
- Route guards (`authGuard`, `roleGuard`, `guestGuard`), global toast notifications,
  loading skeletons, empty states, and 404 page

## ⚠️ Known backend limitations worked around in the UI

The backend API (as provided) has a few gaps that shape some UX decisions below —
worth knowing about if you extend the backend later:

1. **No `GET /categories`.** Only `POST /categories` exists, so the app can't fetch the
   full category list from the server. The frontend keeps a local cache (in
   `localStorage`) of categories created through the app itself, used to populate the
   "Category" dropdown when a provider lists a service. Filtering services *by* category
   on the Browse page doesn't need this cache — it derives categories directly from the
   services already returned by `GET /services`.
2. **No "get logged-in user" endpoint**, and `/users/**` is restricted to `ADMIN` only.
   So a Provider can't automatically discover their own numeric user ID to create a
   `ProviderProfile`. The **Business Profile** setup form asks for the User ID directly
   (with an on-screen hint to get it from an Admin via Manage Users).
3. **Bookings & Reviews aren't linked to the logged-in user** — `POST /bookings` and
   `POST /reviews` in the backend don't attach the authenticated user as
   customer, so `customerName` may show as blank on new entries, and "My Bookings" /
   "Booking Requests" currently list *all* bookings in the system rather than filtering
   by the logged-in user (there's no backend support for that filter yet). This is
   clearly called out with an info banner in both screens.
4. **No `GET /services/{id}`** — the service detail page fetches the full service list
   and finds the matching one client-side.

None of these are frontend bugs — they're simply the current shape of the API. If the
backend adds endpoints like `GET /categories`, `GET /users/me`, `GET /services/{id}`, or
starts associating bookings/reviews with the authenticated user, the corresponding
frontend code is written to be easy to simplify (see comments in `category.service.ts`
and `provider-profile.service.ts`).

## Project Structure

```
src/app/
  core/
    guards/        route guards (auth, role, guest)
    interceptors/  JWT attach + global error handling
    models/        TypeScript interfaces matching backend DTOs/entities
    services/      one service per backend controller
  shared/
    components/    navbar, footer, toast
  features/
    home/
    services/      list, detail, create/edit form
    auth/          login, register
    bookings/      my-bookings (customer), provider-bookings
    provider/      dashboard, business profile setup
    admin/         users, categories
    not-found/
```
