import apiClient from '@/services/axios'
import store from 'store'

const EmployeeService = {
  employeeList: () => {
    return apiClient
      .get('/isees/api/employee/all')
      .then(response => {
        return response.data && response.data.data
      })
      .catch(err => console.log(err))
  },
  createEmployee: (values, method) => {
    console.log(values, 'from services')
    let url = '/isees/api/employee/save'
    if (method === 'put') {
      url = `/isees/api/employee/update`
    }
    return apiClient[method](url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  getEmployee: id => {
    return apiClient
      .get(`/isees/api/employee/id?empId=${id}`)
      .then(response => {
        return response.data && response.data.data
      })
      .catch(err => console.log(err))
  },
  deleteActivity: id => {
    return apiClient
      .delete(`/isees/api/employee/delete?id=${id}`)
      .then(response => {
        return response.data && response.data.data
      })
      .catch(err => console.log(err))
  },
}

export default EmployeeService
