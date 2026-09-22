import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import PurchaseOrderList from '@/components/accountancy/purchase/orders/purchaseOrderList'

const PurchaseOrderComponent = () => {
  
  return (
    <div>
      <Helmet title="Sales: Orders" />
      <PurchaseOrderList />
    </div>
  )
}

export default PurchaseOrderComponent
