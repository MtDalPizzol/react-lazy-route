# react-lazy-route
> A simple yet elegant wrapper around [react-router-dom](https://reacttraining.com/react-router/web/guides/philosophy)'s Route to lazy load components.

## Installation

```bash
# Using Yarn
$ yarn add react-lazy-route

# Using NPM
$ npm install --save react-lazy-route
```

## Usage

```javascript
import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import LazyRoute from 'react-lazy-route'
import CustomError from './custom/Error'
import CustomSpinner from './custom/Spinner'

const Home = () => import('./home/Home')
const SignIn = () => import('./auth/SignIn')
const SignUp = () => import('./auth/SignUp')

class App extends Component {
  render () {
    return (
      <Router>
          <div>
            <LazyRoute exact path='/' render={Home} />
            <LazyRoute
              path='/auth/signin'
              render={SignIn}
              onLoading={CustomSpinner}
              onError={CustomError}
            />
            <LazyRoute
              path='/auth/signup'
              render={SignUp}
              onLoading={<CustomSpinner color='blue'>}
              onError={<CustomError message='Could not load component'>}
            />
          </div>
      </Router>
    )
  }
}

export default App
```

## Options
You can use the same props available for the [**Route**](https://reacttraining.com/react-router/web/api/Route) component. The only difference is that the `render` prop must receive a function that returns a `Promise` which resolves with the component (more info on this [**here**](https://webpack.js.org/guides/code-splitting-async/#dynamic-import-import-)).

LazyRoute takes two additional props.

| Prop  | Required | Description | Default
| ------------- | ------------- | ----- |
| render | Required | A function that returns a `Promise` which resolves with the module. | N/A |
| onLoading | Optional | A component or an element to show while the lazy component is loading. | `null` |
| onError | Optional | A component or an element to show if the lazy component couldn't be loaded. | `<div className="lazy-route-error" />` |


## License

This software is provided free of charge and without restriction under the [MIT License](/LICENSE)
