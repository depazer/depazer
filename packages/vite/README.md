# @depazer/vite

## Install

```bash
npm i @depazer/vite -D
```

## Usage

```ts
import { defineConfig } from 'vite'
import depazer from '@depazer/vite'

export default defineConfig({
  plugins: [
    depazer({
      monorepo: false // default false
    })
  ]
})
```

## Preview

[localhost:5173/\_\_depazer](http://localhost:5173/__depazer)
