import React, { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [ persons, setPersons ] = useState([
    { name: 'Arto Hellas', number: '123456' }
  ]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')

  const addContact = (event) => {
    event.preventDefault()
    let personsCopy = [...persons]
    let isExist = personsCopy.find(p => p.name === newName)
    if (isExist) {
      alert(`${newName} is already added to phonebook`)
    } else {
      personsCopy.push({
        name: newName,
        number: newNumber
      })
      setPersons(personsCopy)
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const displayPersons = newFilter.trim() === '' ?
                         persons : 
                         persons.filter(p => p.name.toLowerCase().indexOf(newFilter) > -1)

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={newFilter} onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm 
        onSubmit={addContact}
        name={newName}
        number={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={displayPersons} />
    </div>
  )
}

export default App