import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import Bundle from './Bundle'

class LazyRoute extends Component {
  constructor (props) {
    super(props)

    this.authenticate = this.authenticate.bind(this)
    this.redirect = this.redirect.bind(this)
    this.routeRender = this.routeRender.bind(this)
  }

  authenticate (props) {
    const { restrict, allow, render, onForbidden } = this.props

    if (!(render instanceof Function)) {
      throw new Error('LazyRoute expects the render prop to be an instance of Function')
    }

    if (!restrict || (restrict && allow)) {
      return render
    }

    let OnForbidden

    if (React.isValidElement(onForbidden) || LazyRoute.isReactComponent(onForbidden)) {
      OnForbidden = onForbidden
    } else if (typeof onForbidden === 'function') {
      OnForbidden = onForbidden(props)
    } else if (
      (typeof onForbidden === 'object') ||
      (typeof onForbidden === 'string')
    ) {
      OnForbidden = this.redirect(onForbidden, props)
    } else {
      OnForbidden = <div className='lazy-route-forbidden'>Permission denied</div>
    }

    return () => {
      return new Promise((resolve) => {
        resolve(OnForbidden)
      })
    }
  }

  redirect (destination, props) {
    if (typeof destination === 'object') {
      return (<Redirect to={destination} />)
    }

    let to = {
      pathname: destination
    }

    if (!this.props.noReferrer) {
      to = Object.assign(to, {
        state: {
          from: props.location
        }
      })
    }

    return (<Redirect to={to} />)
  }

  routeRender () {
    const { onLoading, onError } = this.props

    const OnLoading = onLoading || null
    const OnError = onError || <div className='lazy-route-error'>Couldn't load component</div>

    return (props) => {
      const loader = this.authenticate(props)
      return (
        <Bundle load={loader}>
          {(err, Component) => {
            if (err) {
              if (React.isValidElement(OnError)) {
                return OnError
              } else if (LazyRoute.isReactComponent(OnError)) {
                return <OnError />
              } else if (typeof OnError === 'function') {
                return OnError(err, props)
              } else if (
                (typeof OnError === 'object') ||
                (typeof OnError === 'string')
              ) {
                return this.redirect(OnError, props)
              } else {
                return null
              }
            }

            const Result = Component || OnLoading || null

            if (React.isValidElement(Result) || Result === null) {
              return Result
            } else if (LazyRoute.isReactComponent(Result)) {
              return (Component) ? <Result {...props} /> : <Result />
            } else if (typeof Result === 'function') {
              return Result(props)
            } else {
              return null
            }
          }}
        </Bundle>
      )
    }
  }

  render () {
    const { render, onLoading, onError, restrict, allow, redirect, ...rest } = this.props
    return (
      <Route {...rest} render={this.routeRender()} />
    )
  }

  static isClassComponent = (component) => {
    return (
        typeof component === 'function' &&
        !!component.prototype.isReactComponent
    )
  }

  static isFunctionComponent = (component) => {
    return (
        typeof component === 'function' &&
        String(component).includes('return React.createElement')
    )
  }

  static isReactComponent = (component) => {
    return (
        LazyRoute.isClassComponent(component) ||
        LazyRoute.isFunctionComponent(component)
    )
  }

  static propTypes = {
    render: PropTypes.oneOfType([ PropTypes.string, PropTypes.func ]),
    onLoading: PropTypes.oneOfType([ PropTypes.element, PropTypes.func ]),
    onError: PropTypes.oneOfType([ PropTypes.element, PropTypes.func ]),
    onForbidden: PropTypes.string,
    restrict: PropTypes.bool,
    allow: PropTypes.bool,
    noReferrer: PropTypes.bool,
    redirect: PropTypes.string
  }
}

export default LazyRoute
