import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import ExpensesList from '@/components/accountancy/expenses/expensesList'

const ExpensesComponent = () => {
  return (
    <div>
      <Helmet title="Purchase: Invoice" />
      <ExpensesList />
    </div>
  )
}

export default ExpensesComponent
