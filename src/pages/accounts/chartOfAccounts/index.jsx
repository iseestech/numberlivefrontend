import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import ChartOfAccountList from '@/components/accountancy/accounts/chartOfAccounts/chartOfAccountList'

const ChartOfAccountComponent = () => {
  return (
    <div>
      <Helmet title="Purchase: Invoice" />
      <ChartOfAccountList />
    </div>
  )
}

export default ChartOfAccountComponent
