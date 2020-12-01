import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRouter from './router'

export default class App extends Component {
  render() {
    return (
      <Router>
        <AppRouter />
      </Router>
    )
  }
}
