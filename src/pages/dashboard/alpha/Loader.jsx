import React, { Component } from 'react'
import { Spin } from 'antd'

class Loader extends Component {
  render() {
    return (
      <div
        style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Spin />
      </div>
    )
  }
}

export default Loader
