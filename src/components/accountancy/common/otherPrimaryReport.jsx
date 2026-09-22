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
import PrimaryReport from './pdf/CommonReport/Invoice'
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

class OtherPrimaryReport extends React.Component {
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
    const {
      visible,
      quoteData,
      salesValue,
      flag,
      dateValue,
      detailsInfo,
      masterData = {},
    } = this.props
    let org = JSON.parse(localStorage.getItem('selectedOrg'))

    return (
      <div className="myModal">
        {/* <ReactToPrint content={() => this.componentRef}>
          <PrintContextConsumer>
            {({ handlePrint }) => <button onClick={handlePrint}>Print this out!</button>}
          </PrintContextConsumer>
        </ReactToPrint> */}

        <Modal
          title=""
          open={visible}
          okText="Create"
          className="receiptModal"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          style={{ width: '860px !important', top: '30px', paddingTop: "40px" }}
        >
          <PDFViewer style={{ width: '100%', height: 600}} className="app">
            {flag &&
              (flag === 'ChartOfAccounts' ||
                flag === 'ProductList' ||
                flag === 'PurchasePaymentDetails' ||
                flag === 'SalesPaymentDetails' ||
                flag === 'PurchasePaymentList' ||
                flag === 'SalesReturn' ||
                flag === 'SalesPayments' ||
                flag === 'Stock' ||
                flag === 'InventoryAdjustment' ||
                flag === 'Expense' ||
                flag === 'BankList' ||
                flag === 'Company' ||
                flag === 'Journal' ||
                flag === 'InvoiceList' ||
                flag === 'OtherIncome' ||
                flag === 'SalesInvoiceList' ||
                flag === 'SalesQuotation' ||
                flag === 'SalesOrder' ||
                flag === 'PurchaseOrderDetails' ||
                flag === 'PurchaseDetails' ||
                flag === 'PurchaseReturnDetails' ||
                flag === 'PurchaseOrderListReport' ||
                flag === 'PurchaseInvoiceListReport' ||
                flag === 'JournalReceipt' ||
                flag === 'SalesQuoteList' ||
                flag === 'SalesOrderList' ||
                flag === 'SalesInvoiceReportList' ||
                flag === 'PurchaseReturnList' ||
                flag === 'SalesByCustomerDetails' ||
                flag === 'SalesByItems' ||
                flag === 'CustomerBalance' ||
                flag === 'CutomerDetails' ||
                flag === 'DatewiseInventory' ||
                flag === 'RecievableSummary' ||
                flag === 'VendorBalance' ||
                flag === 'SalesByCustomer' ||
                flag === 'VendorPaymentList') && (
                <PrimaryReport
                  invoice={invoice}
                  orgName={org.orgName}
                  orgCode={org.orgCode}
                  quoteData={quoteData}
                  flag={flag}
                  detailsInfo={detailsInfo}
                  salesValue={salesValue}
                  dateValue={dateValue}
                  masterData={masterData}
                />
              )}
          </PDFViewer>
        </Modal>
      </div>
    )
  }
}

export default OtherPrimaryReport
