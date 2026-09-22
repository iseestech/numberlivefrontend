import { Tabs } from 'antd'
import React, { Component } from 'react'

import AddPurchasePayment from './addPurchasePayment'
import VendorAdvPayment from './vendorAdvPayment'
import PurchasePaymentDetails from './purchasePaymentDetails'
import VendorPaymentDetails from './vendorPaymentDetails'

const { TabPane } = Tabs

class PaymentDetails extends React.Component {
  render() {
    const { location } = this.props
    return (
      <div>
        {location?.pathname?.includes('vendorPayment') ? (
          <VendorPaymentDetails />
        ) : (
          <PurchasePaymentDetails />
        )}
      </div>
    )
  }
}

export default PaymentDetails

