import apiClient from '@/services/axios'
import store from 'store'

const DashboardService = {
  dashboardData: org => {
    return apiClient
      .get(`/isees/api/dashboard/data?orgCode=${org}`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  dateCashflow: values => {
    return apiClient
      .get(
        `/isees/api/dashboard/datecashflow?orgCode=${values.orgCode}&startDate=${values.startDate}&endDate=${values.endDate}`,
      )
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  cashflowdata: values => {
    return apiClient
      .get(
        `/isees/api/dashboard/cashflowdata?orgCode=${values.orgCode}&startDate=${values.startDate}&endDate=${values.endDate}`,
      )
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },

  yearwisesale: (org, year) => {
    return apiClient
      .get(`/isees/api/dashboard/yearwisesale?orgCode=${org}&year=${year}`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  yearwisesaleData: values => {
    return apiClient
      .get(
        `/isees/api/dashboard/yearwisesaledata?orgCode=${values.orgCode}&startDate=${values.startDate}&endDate=${values.endDate}`,
      )
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  getIncomeVsExpenses: value => {
    return apiClient
      .get(
        `/isees/api/dashboard/datewiseincomevsexpenses?orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  getTopExpenses: value => {
    return apiClient
      .get(`/isees/api/dashboard/topexpenses?orgCode=${value.orgCode}`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  bankAccountList: value => {
    return apiClient
      .get(`/isees/api/dashboard/bankaccountlist?orgCode=${value}`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
}

export default DashboardService
