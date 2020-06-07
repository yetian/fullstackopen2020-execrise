import {useState} from 'react'
import React from 'react';
import './App.css';
import axios from 'axios'

const Country = ({country}) => {
  return (
    <div>
      <h1>{country.name}</h1>
      <p>capital: {country.capital}</p>
      <p>population: {country.population}</p>
      <h2>languages</h2>
      <ul>
        {country.languages.map(l => {
          return (
            <li key={l.iso639_2}>{l.name}</li>
          )
        })}
      </ul>
      <img src={country.flag} alt={country.name} height="100px"/>
    </div>
  )
}

const CountryList = (props) => {
  const [selectedCountry, setSelectedCountry] = useState(undefined)
  if (props.countries) {
    if (props.countries.length > 10) {
      return (
        <p>Too many matches, specify another filter</p>
      )
    } else if (props.countries.length === 0) {
      return (
        <p>Did not find any countries with the given filter</p>
      )
    }
    else if (props.countries.length > 1) {
      const handleShowClick = (country) => {
        setSelectedCountry(country)
      }
      return (
        <div>
          {props.countries.map(country => {
            return (
              <p key={country.numericCode}>
                {country.name} 
                <button onClick={() => handleShowClick(country)}>show</button>
              </p>
            )
          })}
          {selectedCountry !== undefined 
            ? <Country country={selectedCountry} /> 
            : null
          }
        </div>
      )
    } else {
      return (
        <Country country={props.countries[0]} />
      )
    }
  }
}

const App = () => {
  const [keyword, setKeyword] = useState('')
  const [countries, setCountries] = useState([])

  const onKeywordChange = async (event) => {
    setKeyword(event.target.value)
    const countries = await axios.get('https://restcountries.eu/rest/v2/all')
    const countriesData = countries.data.filter(c => {
      if (keyword.trim() !== '') {
        return c.name.toLowerCase().indexOf(keyword.toLowerCase()) >= 0
      }
      return true
    })
    setCountries(countriesData)
  }

  return (
    <div>
      find countries <input value={keyword} onChange={onKeywordChange}/>
      <CountryList countries={countries}/>
    </div>
  );
}

export default App;
