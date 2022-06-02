import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class index extends Component {
  render() {
    return (
      <>
        <Link to='./MainPage'>
            <input type="button" value="start"/>
        </Link>
      </>
    )
  }
}
