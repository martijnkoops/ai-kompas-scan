# Deploy-stappenplan: AI-Kompas Scan

Dit stappenplan zet de scan online via GitHub Pages en schrijft de resultaten weg naar een Google Sheet via Google Apps Script.

## Stap 1: Google Sheet maken

1. Ga naar https://sheets.google.com.
2. Maak een nieuwe lege spreadsheet.
3. Geef de spreadsheet een herkenbare naam, bijvoorbeeld `AI-Kompas Scan Resultaten`.
4. Je hoeft geen kolommen aan te maken. `Code.gs` schrijft de kopregel automatisch bij de eerste inzending.

## Stap 2: Apps Script koppelen aan de Sheet

1. Open de Google Sheet.
2. Kies in het menu `Extensies` > `Apps Script`.
3. Verwijder de voorbeeldcode.
4. Kopieer de volledige inhoud van `Code.gs` uit deze map.
5. Plak die code in de Apps Script-editor.
6. Sla het project op.

Belangrijk: maak het script vanuit de Sheet aan via `Extensies` > `Apps Script`. Dan werkt `SpreadsheetApp.getActiveSpreadsheet()` in `Code.gs`. Als je een losstaand Apps Script-project maakt, moet je in `Code.gs` zelf `SpreadsheetApp.openById("SHEET_ID")` gebruiken.

## Stap 3: Apps Script als web-app deployen

1. Klik rechtsboven in Apps Script op `Implementeren` > `Nieuwe implementatie`.
2. Klik op het tandwiel bij `Type selecteren`.
3. Kies `Web-app`.
4. Vul in:
   - Beschrijving: `AI-Kompas Scan Backend`
   - Uitvoeren als: `Ikzelf`
   - Wie heeft toegang: `Iedereen`
5. Klik op `Implementeren`.
6. Geef toestemming wanneer Google daarom vraagt.
7. Kopieer de `Web-app-URL`. Die eindigt meestal op `/exec`.

Als `Iedereen` niet beschikbaar is, blokkeert het Google Workspace-beheer waarschijnlijk anonieme web-apps. Dan moet een beheerder dit toestaan, of je moet de scan beperken tot ingelogde Google-gebruikers. Voor een openbare GitHub Pages-site die anoniem mag schrijven naar de Sheet is `Iedereen` nodig.

## Stap 4: Web-app-URL in `index.html` zetten

1. Open `index.html`.
2. Zoek:

```javascript
const APPS_SCRIPT_URL = "JOUW_GOOGLE_APPS_SCRIPT_URL_HIER";
```

3. Vervang de placeholder door de gekopieerde Apps Script URL:

```javascript
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycb.../exec";
```

4. Sla `index.html` op.

Let op: als je later `Code.gs` wijzigt, moet je in Apps Script opnieuw deployen via `Implementeren` > `Implementaties beheren` > potlood-icoon > `Nieuwe versie` > `Implementeren`. Als je alleen `index.html` wijzigt, hoef je Apps Script niet opnieuw te deployen.

## Stap 5: GitHub-repository maken

1. Ga naar https://github.com.
2. Maak een nieuwe repository, bijvoorbeeld `ai-kompas-scan`.
3. Zet de repository bij voorkeur op `Public` als je gratis en eenvoudig GitHub Pages wilt gebruiken.
4. Upload minimaal:
   - `index.html`
5. Optioneel kun je ook uploaden:
   - `Code.gs`
   - `deploy-stappenplan.md`
   - `Competenties AIgeletterdheid V.1.docx`

Voor de website zelf is alleen `index.html` nodig.

## Stap 6: GitHub Pages activeren

1. Ga in de repository naar `Settings`.
2. Klik links op `Pages`.
3. Kies bij `Build and deployment`:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
4. Klik op `Save`.
5. Wacht 1 tot 2 minuten.
6. Bovenaan de Pages-pagina verschijnt de live URL:

```text
https://GEBRUIKERSNAAM.github.io/REPOSITORYNAAM/
```

GitHub Pages publiceert vanuit de root of `/docs` van een branch. Voor deze scan is root het eenvoudigst.

## Stap 7: Testen

1. Open de GitHub Pages URL.
2. Doorloop de hele scan.
3. Vul op het eindscherm een testcode in, bijvoorbeeld `TEST-001`.
4. Klik op `Resultaten Opslaan`.
5. Open de Google Sheet.
6. Controleer of er een rij is toegevoegd met:
   - timestamp
   - anonieme code
   - deelscores
   - totaalscore
   - leveldetails als JSON

## Troubleshooting

### Er komt geen rij in de Sheet

Controleer eerst:

1. Staat de echte Apps Script URL in `index.html`?
2. Eindigt de URL op `/exec`?
3. Is de web-app gedeployed met `Uitvoeren als: Ikzelf`?
4. Staat toegang op `Iedereen`?
5. Is het script aangemaakt vanuit de Google Sheet?
6. Heb je na wijzigingen in `Code.gs` een nieuwe Apps Script-versie gedeployed?

### De knop zegt dat de koppeling ontbreekt

Dan staat deze placeholder nog in `index.html`:

```javascript
const APPS_SCRIPT_URL = "JOUW_GOOGLE_APPS_SCRIPT_URL_HIER";
```

Vervang die door de echte Web-app-URL.

### De browserresponse is niet leesbaar

Dat klopt bij deze implementatie. De frontend gebruikt `mode: 'no-cors'` en `Content-Type: text/plain` om een eenvoudige POST naar Apps Script te doen zonder CORS-preflight. Daardoor kan de browser de response niet inhoudelijk uitlezen, maar de data kan wel worden weggeschreven.

### Je ziet in Apps Script wel codewijzigingen, maar GitHub gebruikt nog oud gedrag

Er zijn twee aparte deployments:

- `index.html` wordt gepubliceerd door GitHub Pages.
- `Code.gs` wordt gepubliceerd door Apps Script.

Wijzigingen in `index.html`: commit/upload naar GitHub en wacht tot Pages opnieuw publiceert.

Wijzigingen in `Code.gs`: maak in Apps Script een nieuwe web-app-versie aan.

## Klopt de handleiding nog?

Ja, de hoofdroute klopt nog:

1. Sheet maken.
2. Apps Script als web-app deployen.
3. Web-app-URL in `index.html` zetten.
4. `index.html` hosten via GitHub Pages.
5. Eindscherm testen en Sheet controleren.

De oude handleiding was alleen minder precies over Apps Script-herdeploys, CORS/no-cors en Workspace-toegang. Deze versie is daarop aangescherpt.
