import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import PurchaseOrderList from '@/components/accountancy/purchase/orders/purchaseOrderList'

const OrderComponent = () => {
  return (
    <div>
      <Helmet title="Purchase: Order" />
      <PurchaseOrderList />
    </div>
  )
}

export default OrderComponent
