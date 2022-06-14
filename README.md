# Copy
Uma biblioteca simples para copiar arquivos e diretórios.

## Instalação
npm
```bash
  $ npm intall https://github.com/ArthurLobopro/copy-directory --save
```

yarn 
```bash 
  $ yarn add https://github.com/ArthurLobopro/copy-directory --save
```

## Usage
copydirectory(src, dest, callBack)
  * src - source directory
  * dest - targert directory
  * callBack - invoked when copy file done

Copiar diretório de forma assíncrona:
```js
  const { copyDirAsync } = require('@lobo/copy')
  copyDirAsync("caminho/do/arquivo", "caminho/de/destino", (error) => {})
```
Copiar diretório de forma síncrona:
```js
  const { copyDir } = require('@lobo/copy')
  copyDir("caminho/do/arquivo", "caminho/de/destino")
```

## Licensa
MIT

## Créditos

Baseado em https://github.com/ClivarLee/copy-directory 