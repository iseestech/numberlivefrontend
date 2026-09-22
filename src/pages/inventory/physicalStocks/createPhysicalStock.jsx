import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import CreatePhysicalStockEntry from '@/components/accountancy/inventory/physicalStocks/createPhysicalStockEntry'

const CreatePhysicalStocks = () => {
  return (
    <div>
      <CreatePhysicalStockEntry />
    </div>
  )
}

export default CreatePhysicalStocks
