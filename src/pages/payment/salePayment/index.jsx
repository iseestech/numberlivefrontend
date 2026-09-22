import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import SalesPaymentList from '@/components/accountancy/payment/salesPayment/salesPaymentList'

const SMComponent = () => {
  return (
    <div>
      <Helmet title="Purchase: Invoice" />
      <SalesPaymentList />
    </div>
  )
}

export default SMComponent
