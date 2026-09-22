import apiClient from '@/services/axios'
import queryString from 'query-string'
import store from 'store'

const InventoryService = {
  getStockList: (date, orgCode) => {
    // isees/api/Stock/getStock?customerId 15/9/2021;
    // .get(`/isees/api/Stock/dateWiseStockdata?date=2021%2F09%2F15&orgCode=ORG--18620`)

    return apiClient
      .get(`/isees/api/Stock/dateWiseStockdata?date=${date}&orgCode=${orgCode}`)
      .then(response => {
        return response && response
      })
      .catch(err => console.log(err))
  },

  getStockListNew: id => {
    // isees/api/Stock/getStock?customerId
    return apiClient
      .get(`/isees/api/Stock/getStock`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  createStockEntry: (values, method) => {
    console.log(values, 'from services')
    let url = '/isees/api/inventory/save'
    if (method === 'put') {
      url = '/isees/api/inventory/update'
    }
    return apiClient[method](url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  getStockById: id => {
    return apiClient
      .get(`/isees/api/inventory/id?id=${id}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  createInvAdjustment: (values, method) => {
    console.log(values, 'from services')
    let url = '/isees/api/inventory/adjustment'
    if (method === 'put') {
      url = '/isees/api/inventory/update'
    }
    return apiClient[method](url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  getInventoryList: id => {
    // /api/inventory/adjustment/all
    // isees/api/Stock/getStock?customerId
    return apiClient
      .get(`/isees/api/inventory/adjustment/all`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  getStockOnHandList: orgCode => {
    // /api/inventory/adjustment/all
    // isees/api/Stock/getStock?customerId
    return apiClient
      .get(`/isees/api/Stock/stockonhandlist?orgCode=${orgCode}`)
      .then(response => {
        return response && response
      })
      .catch(err => console.log(err))
  },
  getInventoryListById: id => {
    // /api/inventory/adjustment/all
    // isees/api/Stock/getStock?customerId
    return apiClient
      .get(`/isees/api/inventory/id?id=${id}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
}

export default InventoryService
