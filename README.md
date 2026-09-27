# Lista Frontend

A Vue 3 single-page application (SPA) for a personal list of books. Users sign in with username and password, receive a JWT from Keycloak, and then browse or add books through a FastAPI backend.

This repository is the frontend of a three-repo assignment: this app, a FastAPI backend, and an LDAP + Keycloak lab environment.

---

## Features

- Login with username and password against Keycloak (Resource Owner Password grant)
- JWT stored in Pinia and `localStorage`
- Protected Dashboard and Add Book routes (Vue Router guards)
- Book list loaded from the backend API
- Form to add a new book
- Axios request interceptor that attaches `Authorization: Bearer <token>`
- Axios response interceptor that logs the user out on HTTP 401
- Toast notification when the session expires
- Custom CSS inspired by a modern Chinese aesthetic (cinnabar red, gold, ink black, rice paper)

---

## Tech stack

| Technology | Role |
| --- | --- |
| **Vue 3** | UI library. Views use the Composition API with `<script setup>`. |
| **Pinia** | Client state: auth token/username and the book list. |
| **Vue Router 4** | Client-side routing and `beforeEach` guards on protected routes. |
| **Axios** | HTTP client. Request interceptor injects the JWT; response interceptor handles 401. |
| **Vite** | Dev server and production bundler. |
| **Plain CSS** | Styling without Tailwind, Vuetify, or similar frameworks. Fonts: [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) (serif) and [Inter](https://fonts.google.com/specimen/Inter) (sans), loaded from Google Fonts. |

---

## Project structure

```
src/
├── App.vue                 # Root layout: toast + router outlet
├── main.js                 # App bootstrap (Vue, Pinia, router, CSS)
├── assets/
│   └── main.css            # Global styles
├── components/
│   ├── Icon.vue
│   └── Toast.vue           # Session-expired (and other) notifications
├── router/
│   └── index.js            # Routes and auth guard
├── stores/
│   ├── auth.js             # JWT + username (Pinia + localStorage)
│   └── books.js            # Books API client (Axios interceptors)
└── views/
    ├── LoginView.vue
    ├── DashboardView.vue
    └── AddBookView.vue
```

---

## Requirements

- **Node.js** `^22.18.0` or `>=24.12.0` (see `package.json` `engines`)
- **npm** (comes with Node.js)

These services must already be running (they live in the related repositories, not in this one):

| Service | URL |
| --- | --- |
| Vite frontend (this app) | `http://localhost:5173` |
| FastAPI backend | `http://localhost:8001` |
| Keycloak | `http://localhost:8081` |

Keycloak settings used by the login form:

- Realm: `cybersecurity`
- Client ID: `fastapi-api`

Test accounts:

| Username | Password |
| --- | --- |
| `alice` | `alice123` |
| `bob` | `bob123` |

---

## Installation

```bash
npm install
```

---

## Development

Start the Vite dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The app expects the backend at `http://localhost:8001` and Keycloak at `http://localhost:8081`.

Preview a production build locally:

```bash
npm run preview
```

---

## Production build

```bash
npm run build
```

Vite writes the static bundle to `dist/`.

---

## Authentication flow

1. **Login** — The user submits username and password on the Login view.
2. **Keycloak (ROPC)** — The frontend posts those credentials to Keycloak using the Resource Owner Password grant (`grant_type=password`), with `client_id=fastapi-api` and `scope=openid`, as `application/x-www-form-urlencoded`.
3. **JWT** — Keycloak responds with an access token (JWT).
4. **Pinia + localStorage** — The auth store saves the token and username in memory and in `localStorage` (`jwt_token`, `jwt_username`).
5. **Navigation** — The user is sent to the Dashboard. Router guards keep `/dashboard` and `/add` off-limits unless a token is present.
6. **Axios interceptor** — Each request to the backend is created with `baseURL` `http://localhost:8001`. A **request** interceptor sets:

   ```http
   Authorization: Bearer <token>
   ```

7. **Backend** — FastAPI validates the JWT and returns books or accepts a new book.

Token request (conceptually):

```javascript
const params = new URLSearchParams()
params.append('grant_type', 'password')
params.append('client_id', 'fastapi-api')
params.append('username', username)
params.append('password', password)
params.append('scope', 'openid')

await axios.post(
  'http://localhost:8081/realms/cybersecurity/protocol/openid-connect/token',
  params,
  { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
)
```

---

## Routes / views

| Path | View | Auth |
| --- | --- | --- |
| `/` | Redirects to `/login` | — |
| `/login` | **Login** — username/password form | Public |
| `/dashboard` | **Dashboard** — list of books | Protected (`requiresAuth`) |
| `/add` | **Add Book** — form to create a book | Protected (`requiresAuth`) |

If a protected route is opened without a token, the guard redirects to `/login`.

---

## Session expiration

If the backend returns **401** (for example an expired JWT):

1. The Axios **response** interceptor calls logout (clears Pinia and `localStorage`).
2. The app dispatches a `session-expired` event and navigates to `/login`.
3. A toast informs the user that the session expired and they should sign in again.

---

## Related repositories

This frontend is meant to be used together with:

- **lista-backend** (FastAPI): `https://github.com/<org>/lista-backend`
- **ldap-keycloak-oauth2-lab** (LDAP + Keycloak lab): `https://github.com/<org>/ldap-keycloak-oauth2-lab`

Replace `<org>` with the actual GitHub organization or username.

