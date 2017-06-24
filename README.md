# react-lazy-route
> A simple yet elegant and flexible wrapper around [**react-router-dom**](https://reacttraining.com/react-router/web/guides/philosophy)'s [**Route**](https://reacttraining.com/react-router/web/api/Route) to lazy load components.

## Table of contents

* [Installation](#installation)
* [Simple usage](#simple-usage)
* [Authentication](#authentication)
* [Options](#options)
* [Additional options](#additional-options)
  * [`onLoading`](#onloading)
  * [`onError`](#onerror)
  * [`restrict` and `allow`](#restrict-and-allow)
  * [`onForbidden`](#onforbidden)
  * [`noReferrer`](#noreferrer)

## Installation

```bash
# Using Yarn
$ yarn add react-lazy-route

# Using NPM
$ npm install --save react-lazy-route
```

## Simple usage

```javascript
import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import LazyRoute from 'react-lazy-route'

const Home = () => import('./home/Home')
const SignIn = () => import('./auth/SignIn')
const SignUp = () => import('./auth/SignUp')

class App extends Component {
  render () {
    return (
      <Router>
          <div>
            <LazyRoute exact path='/' render={Home} />
            <LazyRoute path='/auth/signin' render={SignIn} />
            <LazyRoute path='/auth/signup' render={SignUp} />
          </div>
      </Router>
    )
  }
}

export default App
```

## Authentication

You can still authenticate components in several ways, using HOCs, for example. But `<LazyRoute />` makes it extremely easy to restrict access to your routes, given you a granular and flexible access control mechanism.

It also guarantees the browser to not even try to load the component if the user dosn't have the access level required.

You can also customize what happens when access to a route is forbidden. See the [`onForbidden`](#onforbidden) prop bellow.

Here's an example where the user can view a list of posts but can't add new ones:

```javascript
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import LazyRoute from 'react-lazy-route'
import { enhanceUser } from './services/user'

const PostList = () => import('./post/list')
const PostForm = () => import('./post/form')

class App extends Component {
  render () {
    return (
      <Router>
        <div>
          <Switch>
            <LazyRoute
              path='/posts/add'
              render={PostForm}
              restrict
              allow={this.user.can('add', 'posts')} />
            <LazyRoute
              path='/posts'
              render={PostList}
              restrict
              allow={this.user.can('list', 'posts')} />
          </Switch>
        </div>
      </Router>
    )
  }
}

function mapStateToProps ({ auth }) {
  return {
    user: enhanceUser(auth.user)
  }
}

export default connect(mapStateToProps)(App)
```

## Options
You can use the same props available for the [**react-router-dom**](https://reacttraining.com/react-router/web/guides/philosophy)'s [**Route**](https://reacttraining.com/react-router/web/api/Route) component. The only difference is that the `render` prop must receive a function that returns a `Promise` which resolves with the component (more info on this [**here**](https://webpack.js.org/guides/code-splitting-async/#dynamic-import-import-)). Also, off course, since we're using `render`, we won't use de `component` prop.

## Additional options

Besides the [**Route**](https://reacttraining.com/react-router/web/api/Route) props, `<LazyRoute />` accepts additional props that makes it easy to handle a bunch of scenarios.


### `onLoading`
Shows while the component is being loaded.

**Accepts:**
  * a React component;
  * a valid React element;
  * a `function` which receives the `props` from the `<Route />` and must return a valid React element or `null`.

**Default:**
  `null`

```javascript
import Spinner from './custom/Spinner'

<LazyRoute
  path='/auth/signin'
  render={SignIn}
  onLoading={Spinner} />

<LazyRoute
  path='/auth/signin'
  render={SignIn}
  onLoading={<Spinner color='blue' />} />

<LazyRoute
  path='/auth/signin'
  render={SignIn}
  onLoading={(props) => {
    console.log('Custom loading logic...')
    return null
  }} />

```

### `onError`
Shows if the component fails to load.

**Accepts:**
  * a React component;
  * a valid React element;
  * a `function` which receives the `error object` and the `props` from the `<Route />` and must return a valid React element or `null`.
  * a `String` being a path to redirect the user to (passed to react-router-dom's `<Redirect />`).
  * an `Object` to redirect the user to (passed to react-router-dom's `<Redirect />`).

**Default:**
  `<div className='lazy-route-error'>Couldn't load component</div>`

```javascript
import CustomError from './custom/Error'

<LazyRoute
  path='/auth/signin'
  render={SignIn}
  onError={CustomError} />

<LazyRoute
  path='/auth/signin'
  render={SignIn}
  onError={<CustomError message='Could not load SignIn' />} />

<LazyRoute
  path='/auth/signin'
  render={SignIn}
  onError={(err, props) => {
    console.log(err)
    return null
  }} />

<LazyRoute
  path='/auth/signin'
  render={SignIn}
  onError='/505' />

<LazyRoute
  path='/auth/signin'
  render={SignIn}
  onError={{
    pathname: '/505',
    state: {
      error: 'Could not load SignIn'
    }
  }} />    

```

### `restrict` and `allow`

This two props work together. `restrict` disables free access to a route, whereas `allow` tells `<LazyRoute />` when to grant access to that route. Both props accepts a `Boolean`.

```javascript
<LazyRoute
  path='/user/dashboard'
  render={Dashboard}
  restrict
  allow={authenticated} />
```

### `onForbidden`
Shows when the user dosn't have access to the route.

**Accepts:**
  * a React component;
  * a valid React element;
  * a `function` which receives the the `props` from the `<Route />` and must return a valid React element or `null`.
  * a `String` being a path to redirect the user to (passed to react-router-dom's `<Redirect />`).
  * an `Object` to redirect the user to (passed to react-router-dom's `<Redirect />`).

**Default:**
  `<div className="lazy-route-forbidden">Permission denied</div>`

```javascript
import ForbiddenMessage from './custom/Error'

const PrivateFeature = () => import('./private/Feature')

<LazyRoute
  path='/private/feature'
  render={PrivateFeature}
  restrict
  allow={authenticated}
  onForbidden={ForbiddenMessage} />

<LazyRoute
  path='/private/feature'
  render={PrivateFeature}
  restrict
  allow={authenticated}
  onForbidden={<ForbiddenMessage message='Permission denied' />} />

<LazyRoute
  path='/private/feature'
  render={PrivateFeature}
  restrict
  allow={authenticated}
  onForbidden={(props) => {
    console.log('Custom logic when permission is denied')
    return null
  }} />

<LazyRoute
  path='/private/feature'
  render={PrivateFeature}
  restrict
  allow={authenticated}
  onForbidden='/401' />

<LazyRoute
  path='/private/feature'
  render={PrivateFeature}
  restrict
  allow={authenticated}
  onForbidden={{
    pathname: '/401',
    state: {
      error: 'Permission denied'
    }
  }} />    

```

### `noReferrer`

If you chose to redirect the user `onError` or `onForbidden` using a `String`, `<LazyRoute />` will add a `from` property to the `props.location.state` `Object`. This is useful, for example, when you want to redirect the user to the route he tried to access earlier and got redirected to a login page. You can prevent this behavior by adding this prop to your `<LazyRoute />`. If you redirect using an `Object`

```javascript
<LazyRoute
  path='/private/feature'
  render={PrivateFeature}
  onForbidden='/401'
  noReferrer />
```

## Contributing

Contributions are welcome and encouraged. Until now, this was only manually tested, since I don't have any experience on testing React Router. So, if anyone are whiling to write these tests or helping me with this, I'll gladly credit the work here.

## License

This software is provided free of charge and without restriction under the [MIT License](/LICENSE)
