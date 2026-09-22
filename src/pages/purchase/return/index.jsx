import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import PurchaseReturnList from '@/components/accountancy/purchase/returns/purchaseReturnList'

const PRComponent = () => {
  return (
    <div>
      <Helmet title="Purchase: Invoice" />
      <PurchaseReturnList />
    </div>
  )
}

export default PRComponent
