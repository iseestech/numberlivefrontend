import React from 'react'
import { PDFViewer } from '@react-pdf/renderer'
import Invoice from '../../../components/accountancy/common/pdf/reports/OrderList'
import invoice from '../../../components/accountancy/common/pdf/invoiceData'

const Print = () => {
  return (
    <div>
      {/* <Helmet title="Print" /> */}
      {/* <Login /> */}
      {/* Print */}
      <PDFViewer width="800" height="600" className="app">
        <Invoice invoice={invoice} />
      </PDFViewer>
    </div>
  )
}

export default Print
