import apiClient from '@/services/axios'
import store from 'store'

const costCenter = {
  getRegion: () => {
    return apiClient
      .get(`isees/costcenter/findbyorgcode`)
      .then(response => {
        return response.data && response.data.data
      })
      .catch(err => console.log(err))
  },
  createCostCenter: values => {
    const url = '/isees/costcenter/save'

    return apiClient
      .post(url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  updateCostCenter: values => {
    const url = '/isees/costcenter/update'
    return apiClient
      .put(url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  deleteCostCenter: id => {
    const url = `/isees/costcenter/delete?id=${id}`
    return apiClient
      .post(url)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
}

export default costCenter
