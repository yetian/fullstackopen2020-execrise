import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Statistics = ({valueObject}) => {
  let good = valueObject.good
  let neutral = valueObject.neutral
  let bad = valueObject.bad
  let all = good + neutral + bad
  let average = (good - bad) / all
  let positiveRate = good / all

  if (all !== 0) {
    return (
      <div>
        <h1>Statistics</h1>
  
        <table>
          <tbody>
            <Statistic text="Good" value={good} />
            <Statistic text="Neutral" value={neutral} />
            <Statistic text="Bad" value={bad} />
            <Statistic text="All" value={all} />
            <Statistic text="Average" value={average} />
            <Statistic text="Positive" value={positiveRate} />
          </tbody>
        </table>
      </div> 
    )
  }
  return (
    <p>No feedback given.</p>
  )
}

const Statistic = ({text, value}) => {
  return (
    <tr><td>{text}</td><td>{value}</td></tr>
  )
}

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const incrementGood = () => setGood(good + 1)
  const incrementNeutral = () => setNeutral(neutral + 1)
  const incrementBad = () => setBad(bad + 1)

  return (
    <div>
      <h1>Give Feedback</h1>
      <p>
        <button onClick={incrementGood}>
          Good
        </button>
        <button onClick={incrementNeutral}>
          Neutral
        </button>
        <button onClick={incrementBad}>
          Bad
        </button>
      </p>
      <Statistics valueObject={{good: good, neutral: neutral, bad: bad}}/>
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)