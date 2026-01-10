# FormPath JS

FormPath JS is a vanilla JavaScript library that maps form input names into nested JSON
structures and persists them in IndexedDB for reactive, durable form state.

## Install

```bash
pnpm add formpath
```

## Usage

```js
import FormPath from 'formpath';

const ff = new FormPath({
  onChange: (data) => console.log('Live Data:', data)
});
```

## Build the library

```bash
pnpm install
pnpm build
```

## Site and examples

The landing page and example suite live in the `formpath.github.io` package at the
repository root.
