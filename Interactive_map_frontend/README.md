<<<<<<< HEAD
# Interactive Map Application

Modern, interaktív térképes webalkalmazás React és Leaflet használatával, amely lehetővé teszi saját helyek mentését, kategorizálását, keresését és térképes megjelenítését.

## Projekt célja

A projekt célja egy olyan felhasználóbarát térképes alkalmazás fejlesztése, amelyben a felhasználók saját pontokat helyezhetnek el a térképen, ezekhez leírást, kategóriát és képet rendelhetnek, majd a mentett helyeket listában és térképen is megtekinthetik.

## Fő funkciók

- Interaktív térkép megjelenítése Leaflet.js segítségével
- Saját pontok elhelyezése a térképen kattintással
- Automatikus helynév és ország felismerése reverse geocoding segítségével
- Pontokhoz név, kategória, leírás és kép hozzáadása
- Mentett pontok megjelenítése listában
- Mentett pont részletes nézete
- Markerre kattintva a mentett hely adatainak megjelenítése
- Keresés név, kategória, ország és leírás alapján
- Marker clustering, vagyis pontok csoportosítása kicsinyített térképen
- Egyedi marker ikon használata
- Profil és beállítások panel
- Bejelentkezés és regisztrációs felület
- Landing page interaktív térképes bemutatóval

## Használt technológiák

### Frontend

- React
- Vite
- JavaScript
- React Leaflet
- Leaflet.js
- Material UI

### Térképes szolgáltatások

- OpenStreetMap
- Nominatim Reverse Geocoding

### Backend és adatbázis tervezett technológiák

- Laravel
- REST API
- MySQL
- Docker

## Projekt struktúra

```bash
src/
├── assets/
├── components/
│   ├── AuthPage.jsx
│   ├── LandingPage.jsx
│   ├── Map.jsx
│   ├── MapShowcase.jsx
│   ├── SavedPointsPanel.jsx
│   ├── SettingsPanel.jsx
│   └── Sidebar.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## Telepítés és futtatás

### 1. Repository klónozása

```bash
git clone https://github.com/briigii/interactive-map.git
```

### 2. Projekt mappa megnyitása

```bash
cd interactive-map
```

### 3. Függőségek telepítése

```bash
npm install
```

### 4. Fejlesztői szerver indítása

```bash
npm run dev
```

Az alkalmazás alapértelmezetten a következő címen érhető el:

```bash
http://localhost:5173
```

## Szükséges csomagok

```bash
npm install react-leaflet leaflet
npm install react-leaflet-cluster
npm install @mui/material @emotion/react @emotion/styled
```

## Új pont létrehozásának folyamata

1. A felhasználó rákattint a térképre.
2. Az alkalmazás lekéri a helyhez tartozó címet és országot.
3. Megjelenik az új pont felvételi űrlap.
4. A felhasználó megadja a kategóriát, leírást és opcionálisan képet tölt fel.
5. Mentés után a pont megjelenik a térképen és a mentett pontok listájában.

## Mentett pontok kezelése

A mentett pontok a bal oldali panelen jelennek meg. Egy pontra kattintva megnyílik annak részletes nézete, ahol látható:

- a hely képe,
- a hely neve,
- az ország,
- a kategória,
- a leírás.

Markerre kattintva szintén megnyílik a kapcsolódó mentett hely részletes nézete.

## Keresés

A keresőmező segítségével a mentett helyek között lehet keresni:

- név alapján,
- kategória alapján,
- ország alapján,
- leírás alapján.

## Marker clustering

A térképen elhelyezett pontok kicsinyítés esetén automatikusan csoportosításra kerülnek. A csoportosított marker megjeleníti, hogy az adott területen hány mentett pont található.

## Beállítások és profil

A jobb felső sarokban található profil ikon segítségével elérhető a beállítások panel. Itt a felhasználó:

- megtekintheti az adatait,
- szerkesztheti a profilját,
- kezdeményezheti a fiók törlését.

## Tervezett backend integráció

A frontend jelenleg kliensoldali állapotkezeléssel működik. A későbbi fejlesztés során Laravel alapú backend kerül kialakításra, amely REST API-n keresztül biztosítja az adatok kezelését.

Tervezett API műveletek:

- pontok lekérdezése,
- új pont mentése,
- pont módosítása,
- pont törlése,
- kép feltöltése,
- felhasználói adatok kezelése,
- autentikáció.

## Készítők

- Bődör Brigitta
- Kovács Dorina Angelika
- Tóth Júlia

## Projekt típusa

Szoftverfejlesztés projektfeladat  
Mérnökinformatikus szak  
Szoftverfejlesztés specializáció

## Licenc
A projekt oktatási célra készült.
