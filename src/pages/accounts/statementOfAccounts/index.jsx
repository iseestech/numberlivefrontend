import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import StateOfAccountList from '@/components/accountancy/accounts/statementOfAccounts/stateOfAccountList'

const StateOfAccountComponent = () => {
  return (
    <div>
      <Helmet title="Purchase: Invoice" />
      <StateOfAccountList />
    </div>
  )
}

export default StateOfAccountComponent
