import { Tabs } from 'antd'
import React, { Component } from 'react'

import AddPurchasePayment from './addPurchasePayment'
import VendorAdvPayment from './vendorAdvPayment'

const { TabPane } = Tabs
class CreatePurchasePayment extends Component {
  render() {
    const { location } = this.props
    return (
      <div>
        {location?.pathname?.includes('edit') ? (
          <div>
            {location?.pathname?.includes('vendorPayment') ? (
              <VendorAdvPayment />
            ) : (
              <AddPurchasePayment />
            )}
          </div>
        ) : (
          <Tabs defaultActiveKey="1" className="antd__tab--content">
            <TabPane tab="Purchase Payment" key="1">
              <AddPurchasePayment />
            </TabPane>
            <TabPane tab="Advance Payment" key="2">
              <VendorAdvPayment />
            </TabPane>
          </Tabs>
        )}
      </div>
    )
  }
}

export default CreatePurchasePayment

