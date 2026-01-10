# FormPath JS Documentation

A single-page documentation site for FormPath JS. It showcases installation, tutorials, fundamentals, and API usage, built as a static HTML page styled with Tailwind CSS via CDN.

## Overview

The page is organized in the following order:

1. Get Started
2. Tutorials
3. Fundamentals
4. API

## Quick Install

Add the CDN script tag:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/FormPath-js/3.2.0/FormPath.min.js"></script>
```

Basic usage:

```html
<script>
  // It initializes automatically on DOMReady
  const ff = new FormPath({
    onChange: (data) => console.log('Live Data:', data)
  });
</script>
```

## Tutorials

- Simple Form
- Multipane Tracking
- Dynamic Arrays

## Fundamentals

- Form Discovery
- Path Mapping Logic
- IndexedDB Engine

## API

Data access example:

```js
// Get all data from IndexedDB
const allData = await ff.getAllData();

// Access specific section
const profile = allData['profile-form'];
```

Clearing data examples:

```js
ff.clearData(['registration-form']);
ff.clearData(); // No arguments clears all
```

## Run Locally

Open `index.html` in your browser.

## Build

Install dependencies, then run:

```bash
npm install
npm run build
```

The output is generated in `dist/` with the site HTML plus the compiled package files.

To build only one target:

```bash
npm run build:site
npm run build:package
```

## Deploy (GitHub Pages)

```bash
npm run deploy
```

This publishes the `dist/` folder using `gh-pages`.
