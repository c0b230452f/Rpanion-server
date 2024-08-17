import React from 'react'

import basePage from './basePage.js'

import Img from './images/homeImg.webp'

import './css/home.css';

class Home extends basePage {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      error: null,
      infoMessage: null
    }
  }

  componentDidMount() {
    this.loadDone()
  }

  renderTitle() {
    return 'QAI Web'
  }

  renderContent() {
    return (
      <div class="homepe">
        <img src={Img} />
        <p>HIGH PERFORMANCE VTOL DRONE</p>
        <p>MADE IN JAPAN</p>
      </div>
    )
  }
}

export default Home
