import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import PhonebookService from './PhonebookService'

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')  
  const [ newFilter, setNewFilter ] = useState('')

  const addContact = async (event) => {
    event.preventDefault()
    let personsCopy = [...persons]
    let isExist = personsCopy.find(p => p.name.toLowerCase() === newName.toLowerCase())
    if (isExist) {
      if (isExist.number === newNumber) {
        alert(`${newName} is already added to phonebook`)
      } else {
        if (window.confirm(`${newName} is already in the phonebook, replace number?`)) {
          try {
            await PhonebookService.update(isExist.id, {
              name: newName,
              number: newNumber
            })
            fetchData()
          } catch (err) {
            alert(`Failed to update ${newName}`)
          }
        }
      }
    } else {
      try {
        let response = await PhonebookService.create({
          name: newName,
          number: newNumber
        })
        personsCopy.push(response.data)
        setPersons(personsCopy)
      } catch (err) {
        alert(`Failed to add the contact "${newName}".`)
      }
    }
  }

  const fetchData = async () => {
    const persons = await PhonebookService.getAll()
    setPersons(persons.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const handleDeletion = async (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      try {
        await PhonebookService.deleteById(person.id)
        fetchData()
      } catch (err) {
        alert(`Failed to delete ${person.name}.`)
      }
    }
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
      <Persons persons={displayPersons} onDeleteButtonClick={handleDeletion}/>
    </div>
  )
}

export default App