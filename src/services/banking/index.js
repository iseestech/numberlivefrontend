import apiClient from '@/services/axios'
import store from 'store'

const BankService = {
  // bankList: () => {
  //   return apiClient
  //     .get('/isees/api/bank/all')
  //     .then(response => {
  //       return response.data && response.data.data
  //     })
  //     .catch(err => console.log(err))
  // },
  bankList: (orgCode, status) => {
    return apiClient
      .get(
        `/isees/api/chartofaccountlistview/paymentaccount?orgCode=${orgCode}&status=${status ||
          false}`,
      )
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },

  createBank: (values, method) => {
    console.log(values, 'from services')
    let url = '/isees/api/bank/save'
    if (method === 'put') {
      url = `/isees/api/bank/update`
    }
    return apiClient[method](url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  getBank: id => {
    return apiClient
      .get(`/isees/api/bank/id?id=${id}`)
      .then(response => {
        return response.data && response.data.data
      })
      .catch(err => console.log(err))
  },
  deleteActivity: actName => {
    return apiClient
      .delete(`/isees/api/bank/delete?actName=${actName}`)
      .then(response => {
        return response.data && response.data.data
      })
      .catch(err => console.log(err))
  },
  createTransaction: (values, method) => {
    console.log(values, 'from services')
    let url = '/isees/api/transaction/save'
    if (method === 'put') {
      url = `/isees/api/transaction/update`
    }
    return apiClient[method](url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  getTransactionById: id => {
    return apiClient
      .get(`/isees/api/transaction/id?id=${id}`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },

  transactionList: (orgCode, id) => {
    return apiClient
      .get(`/isees/api/bankbalancelist/data?orgCode=${orgCode}&paymentAct=${id}`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  transactionMatchedList: (orgCode, id, status, type) => {
    return apiClient
      .get(
        `/isees/api/bankbalancelist/datamatched?orgCode=${orgCode}&paymentAct=${id}&status=${status ||
          false}&type=${type}`,
      )
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  bankReconcile: (values, transactions) => {
    console.log(values, 'from services')
    const url = `/isees/api/bankReconcil/bankReconcile?bankDate=${values.bankDate}&sId=${values.sId}`

    return apiClient
      .post(url, transactions)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  reconcileUnmatchedList: (orgCode, id) => {
    return apiClient
      .get(`/isees/api/bankReconcil/unmatchedlist?orgCode=${orgCode}&actId=${id}`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  uploadBankStatement: (orgCode, id) => {
    return apiClient
      .post(`/isees/api/bankReconcil/uploadbankstatement?orgCode=${orgCode}&actId=${id}`)
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
}

export default BankService
