import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import QuotationList from '@/components/accountancy/sales/quotations/quotationList'

const QuotationComponent = () => {
  
  return (
    <div>
      <Helmet title="Sales: Quaotations" />
      <QuotationList />
    </div>
  )
}

export default QuotationComponent
