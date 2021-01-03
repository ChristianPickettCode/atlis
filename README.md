# atlis

> Contactless Data Transfers

[![NPM](https://img.shields.io/npm/v/atlis.svg)](https://www.npmjs.com/package/atlis) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

The Atlis React Library provides access to the Atlis data transfer API.

> [atlis.dev](https://atlis.dev)

## Install

```bash
npm install --save atlis
# or
yarn add atlis
```

## Usage

```jsx
import React from 'react';
import Atlis from 'atlis';
import Home from './components/home';

const App = () => {
  return(
      <Atlis 
          request={{ 
              data: ["email", "name"], 
              appName: "your app name", 
              appID: "your app id" }}>
          <Home />
      </Atlis>
  ); 
}

export default App;
```

## License

MIT 
