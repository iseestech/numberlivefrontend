import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import PurchaseInvoiceList from '@/components/accountancy/purchase/invoices/purchaseInvoiceList'

const InvoiceComponent = () => {
  return (
    <div>
      <Helmet title="Purchase: Invoice" />
      <PurchaseInvoiceList />
    </div>
  )
}

export default InvoiceComponent
