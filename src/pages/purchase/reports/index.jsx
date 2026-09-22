import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import PurchaseReportList from '@/components/accountancy/purchase/reports/purchaseReportList'

const PurchaseReportComponent = () => {
  return (
    <div>
      <Helmet title="Purchase: Invoice" />
      <PurchaseReportList />
    </div>
  )
}

export default PurchaseReportComponent
