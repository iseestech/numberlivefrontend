import apiClient from '@/services/axios'
import store from 'store'

const adminServices = {
  adminUsers: () => {
    return apiClient
      .get(`/isees/api/Admindashboard/activeuser`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
}

export default adminServices
