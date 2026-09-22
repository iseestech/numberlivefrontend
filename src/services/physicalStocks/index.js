import apiClient from '@/services/axios'
import store from 'store'

const PhysicalStocsService = {
  physicalStocksList: () => {
    return apiClient
      .get('/isees/api/physicalStock/all')
      .then(response => {
        return response.data && response.data.data
      })
      .catch(err => console.log(err))
  },
  createPhysicalStock: (values, method) => {
    console.log(values, 'from services')
    let url = '/isees/api/physicalStock/save'
    if (method === 'put') {
      url = `/isees/api/physicalStock/update`
    }
    return apiClient[method](url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  getPhysicalStok: id => {
    return apiClient
      .get(`/isees/api/physicalStock/id?id=${id}`)
      .then(response => {
        return response.data && response.data.data
      })
      .catch(err => console.log(err))
  },
  deleteActivity: id => {
    return apiClient
      .delete(`/isees/api/physicalStock/delete?id=${id}`)
      .then(response => {
        return response.data && response.data.data
      })
      .catch(err => console.log(err))
  },
}

export default PhysicalStocsService
