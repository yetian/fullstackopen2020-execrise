import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(props.anecdotes.length).fill(0))

  const setRandomSelected = () => {
    let total = props.anecdotes.length
    let min = 0
    let max = total
    let randomSelected = Math.floor(Math.random() * (max - min) + min) // << this will not exceed the size of the list
    setSelected(randomSelected)
  }

  const vote = () => {
    const copiedVotes = [...votes]
    copiedVotes[selected] += 1
    setVotes(copiedVotes)
  }

  let maxVotes = Math.max(...votes)
  let maxVotedIndex = votes.indexOf(maxVotes)

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {props.anecdotes[selected]}
      <p>
        It has {votes[selected]} votes.
      </p>
      <p>
        <button onClick={vote}>
          Vote
        </button>
        <button onClick={setRandomSelected}>
          Next Anecdote
        </button>
      </p>
      <h1>Anecdote with the most votes</h1>
      {props.anecdotes[maxVotedIndex]}
      <p>
        It has {maxVotes} votes.
      </p>
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)