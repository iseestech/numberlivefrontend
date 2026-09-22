import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import PurchaseOrderReportList from '@/components/accountancy/purchase/reports/purchaseOrderReportList'

const PurchaseOrderReportComponent = () => {
  return (
    <div>
      <Helmet title="Purchase: Order" />
      <PurchaseOrderReportList />
    </div>
  )
}

export default PurchaseOrderReportComponent
