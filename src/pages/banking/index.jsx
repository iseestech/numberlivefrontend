import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import BankList from '@/components/accountancy/banking/bankList'

const BankComponent = () => {
  return (
    <div>
      <Helmet title="Purchase: Invoice" />
      <BankList />
    </div>
  )
}

export default BankComponent
