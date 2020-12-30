# atlis

> Contactless data transfers

[![NPM](https://img.shields.io/npm/v/atlis.svg)](https://www.npmjs.com/package/atlis) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save atlis
yarn add atlis
```

## Usage

```jsx
import React from 'react'
import Atlis from 'atlis'

const App = () => {
  return(
      <Atlis 
          request={{ 
              data: ["email", "name"], // "name" is optional
              appName: "your app name", 
              appID: "your app id" }}>
          <Home />
      </Atlis>
  ); 
}

export default App;
```

## License

MIT © [ChristianPickettCode](https://github.com/ChristianPickettCode)
