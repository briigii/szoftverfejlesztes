# Interactive Map Application

Modern, interaktív térképes webalkalmazás React, Leaflet és Laravel használatával, amely lehetővé teszi saját helyek mentését, kategorizálását, keresését és térképes megjelenítését.

---

# Projekt célja

A projekt célja egy modern, felhasználóbarát térképes rendszer fejlesztése volt, amelyben a felhasználók saját pontokat helyezhetnek el a térképen, ezekhez kategóriát, leírást, képet és egyedi marker ikont rendelhetnek, majd a mentett helyeket listában és interaktív térképen is megtekinthetik.

A projekt során kiemelt szerepet kapott:

* a frontend és backend összekötése,
* a REST API kommunikáció,
* a térképes adatkezelés,
* a reszponzív felhasználói felület kialakítása.

---

# Fő funkciók

* Interaktív térkép megjelenítése Leaflet.js segítségével
* Saját pontok elhelyezése térképre kattintással
* Automatikus helynév és ország felismerése reverse geocoding segítségével
* Pontokhoz név, kategória, leírás és kép hozzáadása
* Mentett pontok listázása
* Mentett pont részletes nézete
* Markerre kattintva popup információk megjelenítése
* Keresés név, kategória, ország és leírás alapján
* Marker clustering (pontok csoportosítása)
* Egyedi marker ikonok használata
* Profil és beállítások panel
* Regisztráció és bejelentkezés
* REST API alapú adatkezelés
* Képfeltöltés Laravel backend segítségével
* Reszponzív működés mobil és desktop környezetben

---

# Használt technológiák

## Frontend

* React
* Vite
* JavaScript
* React Leaflet
* Leaflet.js
* Material UI
* CSS

## Backend

* Laravel
* PHP
* REST API
* Sanctum autentikáció
* File Storage kezelés

## Adatbázis

* MySQL

## Térképes szolgáltatások

* OpenStreetMap
* Nominatim Reverse Geocoding

## Verziókezelés

* Git
* GitHub

---

# Projekt struktúra

```bash
Interactive_map_frontend/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AuthPage.jsx
│   │   ├── CountryGroupsPanel.jsx
│   │   ├── LandingPage.jsx
│   │   ├── Map.jsx
│   │   ├── SavedPointsPanel.jsx
│   │   ├── SettingsPanel.jsx
│   │   └── Sidebar.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
interactive-map-backend/
├── app/
├── routes/
├── database/
├── storage/
└── public/
```

---

# REST API működés

A frontend és backend kommunikáció REST API segítségével történik.

## Főbb API végpontok

| Method | Endpoint         | Funkció              |
| ------ | ---------------- | -------------------- |
| GET    | /api/points      | Összes pont lekérése |
| POST   | /api/points      | Új pont létrehozása  |
| DELETE | /api/points/{id} | Pont törlése         |

---

# Adatbázis struktúra

## points tábla

| Mező        | Típus     | Leírás                |
| ----------- | --------- | --------------------- |
| id          | integer   | Azonosító             |
| title       | string    | Hely neve             |
| description | text      | Leírás                |
| lat         | float     | Szélességi koordináta |
| lng         | float     | Hosszúsági koordináta |
| country     | string    | Ország                |
| city        | string    | Város                 |
| image_path  | string    | Kép elérési útja      |
| created_at  | timestamp | Létrehozás ideje      |

---

# Telepítés és futtatás

## Repo klónozásA
```bash
git clone https://github.com/brigiii/Szoftverfejlesztes.git
```

## Frontend telepítése

```bash
cd Interactive_map_frontend
npm install
npm run dev
```

A frontend alapértelmezett címe:

```bash
http://localhost:5173
```

---

## Backend telepítése

```bash
cd interactive-map-backend
composer install
php artisan migrate
php artisan serve
```

A backend alapértelmezett címe:

```bash
http://127.0.0.1:8000
```

---

# Új pont létrehozásának folyamata

1. A felhasználó rákattint a térképre.
2. Az alkalmazás reverse geocoding segítségével lekéri a hely adatait.
3. Megjelenik az adatbeviteli panel.
4. A felhasználó megadja:

   * a hely nevét,
   * kategóriát,
   * leírást,
   * képet,
   * marker ikont.
5. A frontend POST kérést küld a backendnek.
6. A backend eltárolja az adatokat MySQL adatbázisban.
7. A pont megjelenik a térképen és a mentett pontok listájában.

---

# Mentett pontok kezelése

A mentett pontok a bal oldali panelen jelennek meg.

Egy pontra kattintva megjelenik:

* a hely képe,
* a hely neve,
* az ország,
* a kategória,
* a leírás,
* a marker ikon.

A felhasználó:

* szerkesztheti a pont adatait,
* törölheti a pontot,
* megtekintheti térképen.

---

# Keresés és szűrés

A rendszer támogatja a keresést:

* név alapján,
* kategória alapján,
* ország alapján,
* leírás alapján.

A keresés valós időben történik.

---

# Marker clustering

Kicsinyített térképnél a pontok automatikusan csoportosításra kerülnek.

A cluster marker megmutatja, hogy az adott területen hány pont található.

Ez javítja:

* az átláthatóságot,
* a teljesítményt,
* a felhasználói élményt.

---

# Profil és beállítások

A profil panel segítségével a felhasználó:

* megtekintheti az adatait,
* szerkesztheti profilját,
* kezelheti a beállításokat,
* törölheti a fiókját.

---

# Tesztelés

A rendszer manuális funkcionális teszteléssel került ellenőrzésre.

## Tesztelt funkciók

* regisztráció,
* bejelentkezés,
* pont létrehozása,
* pont törlése,
* képfeltöltés,
* API kommunikáció,
* marker megjelenítés,
* keresés,
* mobil nézet,
* popup rendszer.

## Tesztelési eredmények

A frontend és backend kommunikáció sikeresen működött.

A rendszer megfelelően kezelte:

* GET műveleteket,
* POST műveleteket,
* DELETE műveleteket.

---

# Feltárt hibák és javítások

A tesztelés során egy felhasználói adatkezelési probléma került azonosításra.

A regisztráció során a rendszer csak felhasználónevet kért be, emiatt:

* a név mező üres maradt,
* a felhasználónév jelent meg névként.

A probléma oka a frontend és backend eltérő adatmodellje volt.

## Javítási intézkedések

* külön name mező bevezetése,
* backend validáció módosítása,
* frontend-backend adatstruktúrák egységesítése,
* profiloldal javítása.

---

# Verziókezelés

A projekt Git és GitHub használatával készült.

A verziókezelés során:

* commitok készültek,
* branchek használata történt,
* merge konfliktusok kerültek javításra,
* frontend és backend integráció GitHub segítségével történt.

---

# Jövőbeli fejlesztések

* többfelhasználós támogatás,
* valós idejű szinkronizáció,
* dark mode,
* útvonaltervezés,
* felhő alapú képtárolás,
* kedvencek rendszer,
* megosztható térképek.

---

# Készítők

* Bődör Brigitta
* Kovács Dorina Angelika
* Tóth Júlia

---

# Projekt típusa

Szoftverfejlesztés projektfeladat

Mérnökinformatikus szak

Szoftverfejlesztés specializáció

---

# Licenc

A projekt oktatási célra készült.
