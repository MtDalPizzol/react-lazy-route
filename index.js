import React from 'react'
import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import Bundle from './Bundle'

export default function LazyRoute ({ render, onLoading, onError, ...rest }) {
  let loader = null

  if (render instanceof Function) {
    loader = render
  } else {
    throw new Error('LazyRoute expects the render prop to be an instance of Function')
  }

  const routeRender = (props) => {
    const OnLoading = onLoading || null
    const OnError = onError || <div className='lazy-route-error'>Couldn't load component.</div>

    return (
      <Bundle load={loader}>
        {(Component, err) => {
          if (err) {
            return (React.isValidElement(OnError)) ? OnError : <OnError />
          } else if (Component) {
            return <Component {...props} />
          } else if (OnLoading) {
            return (React.isValidElement(OnLoading)) ? OnLoading : <OnLoading />
          } else {
            return null
          }
        }}
      </Bundle>
    )
  }

  return (
    <Route {...rest} render={routeRender} />
  )
}

LazyRoute.propTypes = {
  render: PropTypes.oneOfType([ PropTypes.string, PropTypes.func ]),
  onLoading: PropTypes.oneOfType([ PropTypes.element, PropTypes.func ]),
  onError: PropTypes.oneOfType([ PropTypes.element, PropTypes.func ])
}
