import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Bundle extends Component {
  state = {
    // short for "module" but that's a keyword in js, so "mod"
    mod: null
  }

  componentWillMount () {
    this.load(this.props)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps)
    }
  }

  load (props) {
    this.setState({
      mod: null
    })
    props
      .load()
      .then((mod) => {
        this.setState({
          // handle both es imports and cjs
          mod: (mod && mod.default) ? mod.default : mod
        })
      })
      .catch((err) => {
        this.setState({
          error: err
        })
      })
  }

  render () {
    if (this.state.error) {
      return this.props.children(this.state.error, null)
    }
    return this.props.children(null, this.state.mod || null)
  }

  static propTypes = {
    load: PropTypes.func,
    children: PropTypes.func
  }
}

export default Bundle
