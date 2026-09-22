/* eslint-disable */
import React from 'react'
import {
  Input,
  Slider,
  Cascader,
  Upload,
  Modal,
  message,
  Checkbox,
  Select,
  Button,
  Form,
  Radio,
  Table,
} from 'antd'
import ReactToPrint, { PrintContextConsumer } from 'react-to-print'
import { PDFViewer } from '@react-pdf/renderer'
import PurchaseInvoice from './pdf/reports/Invoice'
import OrderList from './pdf/purchaseListReports/Invoice'
import PurchaseReport from './pdf/purchaseListReports/purchaseReport'
import SalesReportList from './pdf/salesReportList/Invoice'
import SalesReport from './pdf/salesReportList/salesReport'
import SaleInvoice from './pdf/salesPDF/Invoice'
import invoice from './pdf/invoiceData'
import PaymentInvoice from './pdf/paymentPDF/purchasePayment/Invoice'
import './scss/receipt.scss'
const { confirm } = Modal
const { Group } = Checkbox
const { TextArea } = Input
function info() {
  Modal.info({
    title: 'This is a notification message',
    content: (
      <div>
        <p>some messages...some messages...</p>
        <p>some messages...some messages...</p>
      </div>
    ),
    onOk() {},
  })
}

function onChange(checkedValues) {
  // console.log('checked = ', checkedValues)
}

function success() {
  Modal.success({
    title: 'This is a success message',
    content: 'some messages...some messages...',
  })
}

function error() {
  Modal.error({
    title: 'This is an error message',
    content: 'some messages...some messages...',
  })
}

function warning() {
  Modal.warning({
    title: 'This is a warning message',
    content: 'some messages...some messages...',
  })
}

const optionsWithPurchase = [{ label: 'I Purchase this product', value: 'purchase' }]
const optionsWithSale = [{ label: 'I Sell this product', value: 'sale' }]

const columnData = [
  {
    title: 'Item',
    dataIndex: 'id',
  },
  {
    title: 'Description',
    dataIndex: 'purchase_desc',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
  },
  {
    title: 'Unit Price',
    dataIndex: 'purchase_unit_price',
  },
  {
    title: 'Discount',
    dataIndex: 'purchase_discount',
  },
  {
    title: 'Account',
    dataIndex: 'purchase_account',
  },
  {
    title: 'Tax rate',
    dataIndex: 'purchase_tax_rate',
  },
  {
    title: 'Amount',
    dataIndex: 'purchase_amount',
  },
]
const dataSource = [
  {
    key: '1',
    item: '12',
    quantity: '1',
    description: 'test',
    index: 1,
    unitPrice: '2',
    discount: '5',
    account: '',
    taxRate: '2',
    amount: '11',
  },
]

class ReceiptReportListModal extends React.Component {
  state = { visible: this.props.visible }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  handleOk = () => {
    this.setState({
      visible: false,
    })
  }

  handleCancel = () => {
    const { handleRecieptModal } = this.props
    handleRecieptModal()
  }

  showConfirm = () => {
    confirm({
      title: 'Do you Want to delete these items?',
      content: 'Some descriptions',
      onOk() {
        // console.log('OK')
      },
      onCancel() {
        // console.log('Cancel')
      },
    })
  }

  showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure delete this task?',
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        // console.log('OK')
      },
      onCancel() {
        // console.log('Cancel')
      },
    })
  }

  render() {
    const { visible, quoteData, salesValue, flag, dateValue } = this.props
    let org = JSON.parse(localStorage.getItem('selectedOrg'))

    // console.log(salesValue, 'salesValue')

    const {
      firstName,
      email,
      quoteNumber,
      estimateDate,
      productDto,
      desc,
      title,
      total,
      sub_total: subTotal,
      terms,
      status,
      lastName,
      invoiceNo,
      orderNo,
    } = quoteData || []

    // console.log(quoteData, 'quoteData')

    return (
      <div className="myModal">
        {/* <ReactToPrint content={() => this.componentRef}>
          <PrintContextConsumer>
            {({ handlePrint }) => <button onClick={handlePrint}>Print this out!</button>}
          </PrintContextConsumer>
        </ReactToPrint> */}

        <Modal
          title=""
          visible={visible}
          okText="Create"
          className="receiptModal"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          style={{ width: '860px !important', top: '30px' }}
        >
          {/* <ReactToPrint content={() => this.componentRef}>
            <PrintContextConsumer>
              {({ handlePrint }) => <button onClick={handlePrint}>Print this out!</button>}
            </PrintContextConsumer>
          </ReactToPrint> */}
          <PDFViewer width="800" height="600" className="app">
            {flag && flag.includes('Sales Details') && (
              <SaleInvoice
                invoice={invoice}
                orgName={org.orgName}
                orgCode={org.orgCode}
                quoteData={quoteData}
                salesValue={salesValue}
              />
            )}
            {flag.includes('Purchase Details') && (
              <PurchaseInvoice
                invoice={invoice}
                orgName={org.orgName}
                orgCode={org.orgCode}
                quoteData={quoteData}
                salesValue={salesValue}
              />
            )}

            {salesValue.includes('Payment') && (
              <PaymentInvoice
                invoice={invoice}
                orgName={org.orgName}
                orgCode={org.orgCode}
                quoteData={quoteData || []}
                salesValue={`Purchase ${salesValue}`}
              />
            )}
            {flag.includes('Purchase Order List') && (
              <PurchaseReport
                invoice={invoice}
                orgName={org.orgName}
                orgCode={org.orgCode}
                quoteData={quoteData}
                salesValue={salesValue}
                dateValue={dateValue}
              />
            )}
            {flag.includes('Purchase Invoice List') && (
              <PurchaseReport
                invoice={invoice}
                orgName={org.orgName}
                orgCode={org.orgCode}
                quoteData={quoteData}
                salesValue={salesValue}
                dateValue={dateValue}
              />
            )}
            {flag.includes('Sales List') && (
              <SalesReport
                invoice={invoice}
                orgName={org.orgName}
                orgCode={org.orgCode}
                quoteData={quoteData}
                salesValue={salesValue}
                dateValue={dateValue}
              />
            )}
          </PDFViewer>
          {/* <Invoice invoice={invoice} /> */}
          {/* <div
            className="card"
            ref={el => {
              this.componentRef = el
            }}
          >
            <div className="row card-body">
              <div className="col-md-6">
                {salesValue} - {status}
              </div>
              <div className="col-md-6 text-center">
                <div className="style_logo__1e6_V">
                  <img src="/assets/resources/images//assets/logo.svg" className="me-2" alt="Clean UI" />
                  <div className="style_name__1VXJb">ADVISOR</div>
                </div>
              </div>
              <div className="col-md-12">
                <hr />
              </div>
              <div className="col-md-2">
                <span>To: </span>
              </div>
              <div className="col-md-4">
                <span>{`${firstName} ${lastName}`}</span>
              </div>
              <div className="col-md-2">
                <span>From: </span>
              </div>
              <div className="col-md-4">
                <span>Isees</span>
              </div>
              <div className="col-md-2">
                <span>{salesValue} Number:</span>
              </div>
              <div className="col-md-2">
                <span>
                  {salesValue === 'Quote' && quoteNumber}
                  {salesValue === 'Order' && orderNo}
                  {salesValue === 'Invoice' && invoiceNo}
                </span>
              </div>
              <div className="col-md-2">
                <span>Issued:</span>
              </div>
              <div className="col-md-2">
                <span>{estimateDate}</span>
              </div>
              <div className="col-md-12">
                <hr />
              </div>
              <div className="col-md-12">
                <Table
                  pagination={false}
                  dataSource={productDto}
                  columns={columnData}
                  rowKey="index"
                  scroll={{ x: 691 }}
                />
              </div>
              <div className="col-md-9">&nbsp;</div>
              <div className="col-md-3">
                <div>
                  <br />
                  <div>
                    Subtotal: <strong>{subTotal}</strong>
                  </div>
                  <div>
                    Total Sales Tax 0%: <strong> 0.00</strong>
                  </div>
                  <hr style={{ margin: '5px 0' }} />
                  <div>
                    <h3>
                      <strong>Total: </strong>
                      <strong> {total}</strong>
                    </h3>
                  </div>
                  <hr style={{ margin: '5px 0', borderBottom: '10px' }} />
                </div>
              </div>
            </div>
          </div> */}
        </Modal>
      </div>
    )
  }
}

export default ReceiptReportListModal
