# Stoke & Smoke

Verbeterde, responsive one-page website voor Stoke & Smoke BBQ Catering.

## Lokaal bekijken

Start in deze map een eenvoudige webserver:

```powershell
python -m http.server 4173
```

Open daarna `http://127.0.0.1:4173/`.

## Belangrijkste bestanden

- `index.html` — inhoud, metadata en paginastructuur
- `styles.css` — vormgeving en responsive gedrag
- `script.js` — mobiel menu, subtiele animaties en contactformulier
- `assets/` — geoptimaliseerde WebP-afbeeldingen en JPG-bronbestanden
- `index_legacy.html` — back-up van de vorige startpagina

## Contactformulier

De website gebruikt geen externe formulierenservice. Na validatie opent de aanvraag in de e-mailapp of WhatsApp van de bezoeker. Controleer voor publicatie:

- telefoonnummer: `06 37 38 60 98`
- e-mailadres: `grillmaster@stokeandsmoke.nl`

## Publiceren

De site is statisch en kan rechtstreeks vanuit deze map worden gepubliceerd. `vercel.json` bevat de bestaande Vercel-instellingen. Oude conceptbestanden en interne documenten worden via `.vercelignore` niet meegestuurd.
