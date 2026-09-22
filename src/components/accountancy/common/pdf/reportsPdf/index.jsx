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
// import PrimaryReport from '../CommonReport/Invoice'
import PdfContainer from './pdfContainer'
import BalanceSheetPdf from './balanceSheet'

import invoice from '../invoiceData'
import '../../scss/receipt.scss'
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

class ReportPdfContainer extends React.Component {
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
      info = {},
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
          style={{ width: '860px !important', top: '30px' }}
        >
          <PDFViewer width="800" height="600" className="app">
            {flag === 'balanceSheet' ? (
              <BalanceSheetPdf
                orgName={org.orgName}
                orgCode={org.orgCode}
                quoteData={quoteData || []}
                flag={flag}
                detailsInfo={detailsInfo}
                salesValue={salesValue}
                dateValue={dateValue}
                masterData={masterData}
                info={info}
              />
            ) : (
              <PdfContainer
                orgName={org.orgName}
                orgCode={org.orgCode}
                quoteData={quoteData || []}
                flag={flag}
                detailsInfo={detailsInfo}
                salesValue={salesValue}
                dateValue={dateValue}
                masterData={masterData}
                info={info}
              />
            )}
          </PDFViewer>
        </Modal>
      </div>
    )
  }
}

export default ReportPdfContainer
