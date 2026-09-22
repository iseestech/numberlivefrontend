import apiClient from '@/services/axios'
import store from 'store'

const CustomerService = {
  customerList: () => {
    return apiClient
      .get('/isees/api/customer/all')
      .then(response => {
        return response.data && response.data.data
      })
      .catch(err => console.log(err))
  },
  createCustomer: (values, method) => {
    console.log(values, 'from services')
    let url = '/isees/api/customer/save'
    if (method === 'put') {
      url = `/isees/api/customer/update`
    }
    return apiClient[method](url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  getCustomer: id => {
    return apiClient
      .get(`/isees/api/customer/id?id=${id}`)
      .then(response => {
        return response.data && response.data.data
      })
      .catch(err => console.log(err))
  },
  deleteActivity: id => {
    return apiClient
      .delete(`/isees/api/customer/delete?id=${id}`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
}

export default CustomerService
