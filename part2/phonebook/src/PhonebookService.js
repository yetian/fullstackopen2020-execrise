import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newPerson => {
  return axios.post(baseUrl, newPerson)
}

const update = (id, newPerson) => {
  return axios.put(`${baseUrl}/${id}`, newPerson)
}

const deleteById = id => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default {
  getAll, create, update, deleteById
}