import apiClient from '@/services/axios'
import store from 'store'

const JournalService = {
  JournalList: () => {
    return apiClient
      .get('/isees/api/journel/all')
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  createJournal: (values, method) => {
    console.log(values, 'from services')
    let url = '/isees/api/journel/save'
    if (method === 'put') {
      url = `/isees/api/journel/update`
    }
    return apiClient[method](url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  getJournalById: id => {
    return apiClient
      .get(`/isees/api/journel/getJournelById?JournelNo=${id}`)
      .then(response => {
        return response && response.data
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
  displayJournal: value => {
    return apiClient
      .get(
        `/isees/api/businessoverview/displayjournal?orgCode=${value.orgCode}&transaction_id=${value.id}&type=${value.type}`,
      )
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  journalListforRevJournal: value => {
    return apiClient
      .get(`/isees/api/reversejournel/journalno?orgCode=${value.orgCode}`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  journalDataById: value => {
    return apiClient
      .get(
        `/isees/api/reversejournel/journaldata?orgCode=${value.orgCode}&journelNo=${value.journelNo}`,
      )
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  reverseJournalList: value => {
    return apiClient
      .get(`/isees/api/reversejournel/all?orgCode=${value.orgCode}`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  revJournalById: value => {
    return apiClient
      .get(
        `/isees/api/reversejournel/getJournelById?orgCode=${value.orgCode}&RevjournelNo=${value.journalNo}`,
      )
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  deleteRevJournal: id => {
    return apiClient
      .delete(`/isees/api/reversejournel/delete?revjournelNo=${id}`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  createRevJournal: (values, method) => {
    console.log(values, 'from services')
    let url = '/isees/api/reversejournel/save'
    if (method === 'put') {
      url = `/isees/api/journel/update`
    }
    return apiClient[method](url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  convertToReverse: value => {
    return apiClient
      .get(
        `/isees/api/journel/convertToReverse?orgCode=${value.orgCode}&journelNo=${value.journelNo}&revjournelDate=${value.revjournelDate}`,
      )
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  getBalancesheet: value => {
    return apiClient
      .get(`/isees/api/businessoverview/balancesheet?orgCode=${value.orgCode}`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  getProfitAndLoss: value => {
    return apiClient
      .get(
        `/isees/api/businessoverview/profitloss?orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  getVerticalProfitAndLoss: value => {
    return apiClient
      .get(
        `/isees/api/businessoverview/verticalprofitloss?orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
}

export default JournalService
