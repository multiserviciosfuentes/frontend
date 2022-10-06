import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://multiserviciosfuentes20222.herokuapp.com/api/v1',
  // baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default instance
