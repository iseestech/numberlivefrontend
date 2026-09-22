import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import PurchasePaymentList from '@/components/accountancy/payment/purchasePayment/purchasePaymentList'

const PMComponent = () => {
  return (
    <div>
      <Helmet title="Purchase: Invoice" />
      <PurchasePaymentList />
    </div>
  )
}

export default PMComponent
