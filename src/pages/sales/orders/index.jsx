import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import OrderList from '@/components/accountancy/sales/orders/orderList'

const OrderComponent = () => {
  
  return (
    <div>
      <Helmet title="Sales: Orders" />
      <OrderList />
    </div>
  )
}

export default OrderComponent
