import React from 'react'

import basePage from './basePage.js'

import roverImage from './images/spark-kit-rover.webp'

class Home extends basePage {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      error: null,
      infoMessage: null
    }
  }

  componentDidMount () {
    this.loadDone()
  }

  renderTitle () {
    return 'Spark Kit'
  }

  renderContent () {
    return (
      <div>
        <p>
        <img src={roverImage} width="50%" height="50%" /><br/>
          ArduPilot標準なローバー。</p>
        <p><a href='https://www.robot-to-society.com/lp/sparkkit'>Spark Kitについて</a></p>
        <p><a href='https://github.com/rtos-org/spark-kit.git'>ドキュメント</a></p>
        <p><a href='https://github.com/rtos-org/spark-kit.git'>コミュニティ</a></p>
      </div>
    )
  }
}

export default Home
