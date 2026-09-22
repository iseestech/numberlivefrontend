import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import BalanceSheetList from '@/components/accountancy/accounts/balanceSheet/balanceSheetList'

const BalanceSheetComponent = () => {
  return (
    <div>
      <Helmet title="Purchase: Invoice" />
      <BalanceSheetList />
    </div>
  )
}

export default BalanceSheetComponent
