import apiClient from '@/services/axios'
import store from 'store'

const VendorService = {
  customerList: () => {
    return apiClient
      .get('/isees/api/vendor/all')
      .then(response => {
        return response.data && response.data.data
      })
      .catch(err => console.log(err))
  },
  createCustomer: (values, method) => {
    console.log(values, 'from services')
    let url = '/isees/api/vendor/save'
    if (method === 'put') {
      url = `/isees/api/vendor/update`
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
      .get(`/isees/api/vendor/id?id=${id}`)
      .then(response => {
        return response.data && response.data.data
      })
      .catch(err => console.log(err))
  },
  deleteActivity: id => {
    return apiClient
      .delete(`/isees/api/vendor/delete?id=${id}`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
}

export default VendorService
