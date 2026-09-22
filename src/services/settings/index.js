import apiClient from '@/services/axios'
import store from 'store'

const TaxService = {
  taxList: () => {
    return apiClient
      .get('/isees/api/tax/all')
      .then(response => {
        return response.data && response.data.data
      })
      .catch(err => console.log(err))
  },
  createTax: (values, method) => {
    console.log(values, 'from services')
    let url = '/isees/api/tax/save'
    if (method === 'put') {
      url = `/isees/api/tax/update`
    }
    return apiClient[method](url, values)
      .then(response => {
        console.log(response, 'response')
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  getTax: id => {
    return apiClient
      .get(`/isees/api/tax/id?id=${id}`)
      .then(response => {
        return response.data && response.data.data
      })
      .catch(err => console.log(err))
  },
  deleteActivity: id => {
    return apiClient
      .delete(`/isees/api/vendor/delete?id=${id}`)
      .then(response => {
        return response.data && response.data.data
      })
      .catch(err => console.log(err))
  },
}

export default TaxService
