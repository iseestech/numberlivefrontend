import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import CreatePurchaseOrder from '@/components/accountancy/purchase/orders/createPurchaseOrder'

const CreateOrder = () => {
  return (
    <div>
      <CreatePurchaseOrder />
    </div>
  )
}

export default CreateOrder
