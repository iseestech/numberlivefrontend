import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import ProfitAndLossList from '@/components/accountancy/accounts/profitAndLoss/profitAndLossList'

const ProfitAndLossComponent = () => {
  return (
    <div>
      <Helmet title="Purchase: Invoice" />
      <ProfitAndLossList />
    </div>
  )
}

export default ProfitAndLossComponent
