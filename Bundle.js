import React, { Component } from 'react'

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
    // props.load((mod) => {
    //   this.setState({
    //     // handle both es imports and cjs
    //     mod: mod.default ? mod.default : mod
    //   })
    // })
    props
      .load()
      .then((mod) => {
        this.setState({
          // handle both es imports and cjs
          mod: mod.default ? mod.default : mod
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
      return this.props.children(null, this.state.error)
    }
    return this.state.mod ? this.props.children(this.state.mod) : null
  }
}

export default Bundle
