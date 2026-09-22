import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import InvoiceList from '@/components/accountancy/sales/invoices/invoiceList'

const InvoiceComponent = () => {
  return (
    <div>
      <Helmet title="Sales: Invoices" />
      <InvoiceList />
    </div>
  )
}

export default InvoiceComponent
