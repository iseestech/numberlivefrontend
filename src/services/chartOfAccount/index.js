import apiClient from '@/services/axios'
import store from 'store'

const ChartOfAccService = {
  ChartOfAccList: type => {
    return apiClient
      .get(`/isees/getAccountType?category=${type}`)
      .then(response => {
        return response.data && response.data.data
      })
      .catch(err => console.log(err))
  },
  ChartOfAllAcountList: type => {
    return apiClient
      .get(`/isees/all`)
      .then(response => {
        return response.data && response.data.data
      })
      .catch(err => console.log(err))
  },
  ChartOfAllAcount: orgCode => {
    return apiClient
      .get(`/isees/api/chartofaccountlistview/data?orgCode=${orgCode}`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  getNaturewiseData: (id, orgCode) => {
    return apiClient
      .get(
        `/isees/api/chartofaccountlistview/naturewisedata?natureofaccount=${id}&orgCode=${orgCode}`,
      )
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  ChartOfAllPrimaryAccounts: type => {
    return apiClient
      .get(`/isees/allPrimaryAccounts`)
      .then(response => {
        return response.data && response.data.data
      })
      .catch(err => console.log(err))
  },
  getSubGroupById: (id, orgCode) => {
    return apiClient
      .get(`/isees/getSubGroupAccountsByAccId?id=${id}&orgCode=${orgCode}`)
      .then(response => {
        return response.data && response.data.data
      })
      .catch(err => console.log(err))
  },
  getParentAccount: id => {
    return apiClient
      .get(`/isees/getParentAccountType?accId=${id}`)
      .then(response => {
        return response.data && response.data.data
      })
      .catch(err => console.log(err))
  },
  createChartOfAccount: (values, method) => {
    console.log(values, 'from services')
    let url = '/isees/addAccount'
    if (method === 'put') {
      url = `/isees/editAccount`
    }
    return apiClient
      .post(url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  addSubGroupAccount: (values, method) => {
    console.log(values, 'from services')
    const url = '/isees/addSubGroup'
    // if (method === 'put') {
    //   url = `/isees/update`
    // }
    return apiClient
      .post(url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  listAllAccounts: value => {
    return apiClient
      .get(`/isees/listAllAccounts?category=${value}`)
      .then(response => {
        return response.data && response.data.data
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
  accountSubGroup: orgId => {
    return apiClient
      .get(`/isees/api/chartofaccountlistview/accountsubgroup?orgCode=${orgId}`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
}

export default ChartOfAccService
