import apiClient from '@/services/axios'
import store from 'store'

const ExpensesService = {
  expensesList: () => {
    return apiClient
      .get('/isees/api/expenses/all')
      .then(response => {
        return response.data && response.data.data
      })
      .catch(err => console.log(err))
  },
  createExpenses: (values, method) => {
    console.log(values, 'from services')
    let url = '/isees/api/expenses/add'
    if (method === 'put') {
      url = `/isees/api/expenses/update`
    }
    return apiClient[method](url, values)
      .then(response => {
        console.log(response, 'response')
        return response
      })
      .catch(err => console.log(err))
  },
  getExpenses: id => {
    return apiClient
      .get(`/isees/api/expenses/getExpensesById?expensesNo=${id}`)
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
  deleteExpenses: id => {
    return apiClient
      .delete(`/isees/api/expenses/delete?expenseNo=${id}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
}

export default ExpensesService
