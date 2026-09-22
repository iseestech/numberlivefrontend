import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import OtherIncomeList from '@/components/accountancy/sales/otherIncome/otherIncomeList'

const OtherIncomeComponent = () => {
  return (
    <div>
      <Helmet title="Sales: Quaotations" />
      <OtherIncomeList />
    </div>
  )
}

export default OtherIncomeComponent
