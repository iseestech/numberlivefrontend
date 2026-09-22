import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import SaleReturnList from '@/components/accountancy/sales/returns/saleReturnList'

const SRComponent = () => {
  return (
    <div>
      <Helmet title="Sales: Invoices" />
      <SaleReturnList />
    </div>
  )
}

export default SRComponent
