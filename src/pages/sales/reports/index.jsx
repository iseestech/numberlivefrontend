import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import SalesReportList from '@/components/accountancy/sales/reports/salesReportList'

const PurchaseReportComponent = () => {
  return (
    <div>
      <Helmet title="Purchase: Invoice" />
      <SalesReportList />
    </div>
  )
}

export default SalesReportList
