import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import PurchaseInvoiceReportList from '@/components/accountancy/purchase/reports/purchaseInvoiceReportList'

const PurchaseInvoiceReportComponent = () => {
  return (
    <div>
      <Helmet title="Purchase: Invoice" />
      <PurchaseInvoiceReportList />
    </div>
  )
}

export default PurchaseInvoiceReportComponent
