import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import ReportList from '@/components/accountancy/reports/index'
import data from './data.json'

const ReportComponent = () => {
  return (
    <div className="details_layout--page">
      <ReportList data={data} />
    </div>
  )
}

export default ReportComponent
