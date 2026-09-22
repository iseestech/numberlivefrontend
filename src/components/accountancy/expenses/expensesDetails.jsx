import React, { useState, useEffect } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { Menu, Dropdown, Table, Button, Row, Col, Modal } from 'antd'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import PurchaseService from '@/services/purchase'
import ExpensesService from '@/services/expenses'
import CreateNew from '@/components/accountancy/common/createNew'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import HelperFunction from '@/services/helper'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import SendEmail from '@/components/accountancy/common/sendEmail'
import ReceiptPrint from '@/components/accountancy/common/receipt'
import DisplayJournal from '@/components/accountancy/common/DisplayJournal'
import { history } from '@/main'
// import CreateProductModal from './createProductModal'
import './index.scss'

const { confirm } = Modal

const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const columnData = [
  {
    title: '#',
    dataIndex: 'key',
    key: 'key',
    render: (text, record, index) => index + 1,
  },
  // {
  //   title: 'Item#',
  //   dataIndex: 'id',
  // },
  {
    title: 'Expense Account',
    dataIndex: 'expensesAct',
  },
  {
    title: 'Notes',
    dataIndex: 'notes',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
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

const ExpensesDetails = routerData => {
  const [isVisible, setVisible] = useState(false)
  const [isShown, setShown] = useState(false)
  const [isShownEmail, setShownEmail] = useState(false)
  const [isShownReciept, setShownReciept] = useState(false)
  const [csvData, setCSVData] = useState([])

  // console.log(routerData.match.path.split('/'), 'router')
  const routeName = routerData.match.path.split('/')[2]

  const [quoteData, getQuotation] = useState([])
  const { id: quoteId } = routerData.match.params

  useEffect(() => {
    if (quoteId) {
      // console.log(quoteId, 'quoteId')
      const fetchData = async () => {
        const result = await ExpensesService.getExpenses(quoteId)
        // console.log(result, 'result')
        getQuotation(result || [])

        const csvDataVal = HelperFunction.getDataForCSV(
          result ? result.expensesAccountDto : [],
          columnData,
        )
        setCSVData(csvDataVal)
      }
      fetchData()
    }
  }, [quoteId])

  const approveInvoice = () => {
    const { customerId, invoiceNo } = quoteData
    const data = `customerId=${customerId}&purchaseId=${quoteId}&status=true`
    const fetchData = async () => {
      const result = await PurchaseService.approveOrder(data, 'post')
      // console.log(result, 'result')
      history.push('/purchase/invoices')
      // getQuotation(result ? result.data : [])
    }
    fetchData()
  }

  const menu = (
    <Menu>
      {/* <Menu.Item>
        <a target="_blank" rel="noopener noreferrer">
          Mark as Inactive
        </a>
      </Menu.Item> */}
      <Menu.Item>
        <Link to={`/exp/expense/edit/${quoteId}`}>Edit</Link>
      </Menu.Item>
      {/* <Menu.Item onClick={() => handleCreateModal()}>Create New</Menu.Item> */}
      <Menu.Item onClick={() => handleDeleteExpenses()}>Delete</Menu.Item>
    </Menu>
  )

  const handleDetails = () => {
    setVisible(!isVisible)
  }

  const handleDeleteExpenses = () => {
    confirm({
      title: 'Do you want to delete this item?',
      content: '',
      onOk() {
        const fetchData = async () => {
          const result = await ExpensesService.deleteExpenses(quoteId)
          // console.log(result, 'resullll')
          history.push('/exp/expenses')
        }
        fetchData()
      },
      onCancel() {
        // console.log('Cancel')
      },
    })
  }

  const handleCreateModal = () => {
    setShown(!isShown)
  }
  const handleSendModal = () => {
    setShownEmail(!isShownEmail)
  }
  const handleRecieptModal = () => {
    setShownReciept(!isShownReciept)
  }

  const {
    currency,
    customerName,
    empName,
    invoiceNo,
    paidThrough,
    subtotal,
    paymentMode,
    total,
    amount,
    vendorName,
    id: expensesId,
    date,
    expensesAccountDto,
    notes,
  } = quoteData

  return (
    <div className="details_layout--page">
      <Row className="mb-3 details__header--css">
        <Col span={12} style={{ fontSize: '18px' }}>
          Expense: {quoteId}
        </Col>
        {/* <Link to="/products-and-services/products" style={{ textTransform: 'capitalize' }}>
          Back
        </Link> */}
        <Col span={12} className="text-end">
          {/* <CreateProductModal headingText="Edit Product" /> */}
          {/* <Button color="secondary" outline className="me-2 mb-2" onClick={() => handleSendModal()}>
            Send
          </Button> */}
          {/* <Button
            color="secondary"
            outline
            className="me-2 mb-2"
            onClick={() => handleRecieptModal()}
          >
            Print
          </Button> */}
          {/* <Button color="success" onClick={() => approveInvoice()} className="me-2 mb-2">
            Approve
          </Button> */}
          <Button type="default" className="text-center me-2" htmlType="submit">
            <Link to="/exp/expenses">Back</Link>
          </Button>
          <Button color="secondary" className="me-2 mb-2">
            <Dropdown
              overlay={
                <ExportOptions
                  handleRecieptModal={handleRecieptModal}
                  csvData={csvData}
                  apiData={expensesAccountDto}
                  columns={columnData}
                  fileName="Expenses Details"
                />
              }
              className="me-2 mb-2"
            >
              <a className="ant-dropdown-link">
                Export As <DownOutlined />
              </a>
            </Dropdown>
          </Button>
          <Button color="secondary" outline className="me-2 mb-2">
            <Dropdown overlay={menu} className="me-2 mb-2">
              <a className="ant-dropdown-link">
                Options <DownOutlined />
              </a>
            </Dropdown>
          </Button>
        </Col>
      </Row>
      {/* <hr /> */}
      <Row className="details__page--content">
        <Col span={24} className="fs-13 text-uppercase mb-3">
          <span className="bulletIcon">Basic Information</span>
        </Col>
        <Col span={6} className="pb-2">
          <div>
            <strong>Date</strong>
          </div>
          <span>{date}</span>
        </Col>
        <Col span={6} className="pb-2">
          <div>
            <strong>Employee</strong>
          </div>
          <span>{empName}</span>
        </Col>
        <Col span={6} className="pb-2">
          <div>
            <strong>Paid Through</strong>
          </div>
          <span>{paidThrough}</span>
        </Col>
        <Col span={6} className="pb-2">
          <div>
            <strong>Currency</strong>
          </div>
          <span>{currency}</span>
        </Col>
        <Col span={6} className="pb-2">
          <div>
            <strong>Payment Mode</strong>
          </div>
          <span>{paymentMode}</span>
        </Col>
        <Col span={6} className="pb-2">
          <div>
            <strong>Customer</strong>
          </div>
          <span>{customerName}</span>
        </Col>
        <Col span={6} className="pb-2">
          <div>
            <strong>Date</strong>
          </div>
          <span>{date}</span>
        </Col>
        <Col span={6} className="pb-2">
          <div>
            <strong>Invoice Number</strong>
          </div>
          <span>{invoiceNo}</span>
        </Col>

        {/* <div className="col-md-3">
          <div>
            <strong>Email</strong>
          </div>
          <span>{email}</span>
        </div> */}

        {/* <div className="col-md-12">
          <Button role="button" style={{ marginTop: '15px' }} onClick={() => handleDetails()}>
            Add Contact Details
          </Button>
        </div> */}

        <Col span={24}>
          <hr />
        </Col>

        {/* <div className="col-md-12 text-end">
          <span>Amount are tax exclusive</span>
        </div> */}
        <Col span={24} className="fs-13 text-uppercase mb-3">
          <span className="bulletIcon">Expenses</span>
        </Col>
        <Col span={24}>
          <Table
            className="details__table--field"
            pagination={false}
            dataSource={expensesAccountDto}
            columns={columnData}
            rowKey="id"
            scroll={{ x: 691 }}
          />
        </Col>
        <Col span={10} offset={14} className="mt-3 total__section">
          <div className="total__section--con">
            <Row>
              <div className="col-md-7 text-start ps-5 pt-2"> Subtotal</div>
              <div className="col-md-5 text-end pt-2r">{subtotal}</div>
              <div className="col-md-7 text-start ps-5 pt-2">Total</div>
              <div className="col-md-5 text-end pt-2r">{total}</div>
            </Row>
          </div>
        </Col>

        {/* <div className="col-md-12">Notes: - {notes}</div> */}
      </Row>
      <DisplayJournal type="expenses" trId={quoteId} formName="expenses" isJournal />

      <CreateNew visible={isShown} handleCreateModal={handleCreateModal} />
      <SendEmail visible={isShownEmail} handleSendModal={handleSendModal} />
      {/* <ReceiptPrint
        visible={isShownReciept}
        handleRecieptModal={handleRecieptModal}
        quoteData={quoteData}
        flag=""
        salesValue=""
      /> */}

      {isShownReciept && (
        <OtherPrimaryReport
          visible={isShownReciept}
          handleRecieptModal={() => setShownReciept(!isShownReciept)}
          quoteData={[] || []}
          detailsInfo={{}}
          salesValue="Purchase Payment Receipt"
          flag="PurchasePaymentDetails"
        />
      )}
    </div>
  )
}

export default connect()(ExpensesDetails)

