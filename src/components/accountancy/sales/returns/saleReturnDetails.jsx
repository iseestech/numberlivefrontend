import React, { useState, useEffect } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { Menu, Button, Row, Col, Dropdown, Table, Modal } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import QuotationService from '@/services/sales'
import CreateNew from '@/components/accountancy/common/createNew'
import SendEmail from '@/components/accountancy/common/sendEmail'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import HelperFunction from '@/services/helper'
import ReceiptPrint from '@/components/accountancy/common/receipt'
import DisplayJournal from '@/components/accountancy/common/DisplayJournal'
import { history } from '@/main'
import WithRouter from '@/WithRouter'
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
  {
    title: 'Name',
    dataIndex: 'name',
    className: 'drag-visible',
    responsive: ['xs', 'sm'],
  },
  {
    title: 'Sale Quantity',
    dataIndex: 'purchase_qty',
    responsive: ['xs', 'sm'],
  },
  {
    title: 'Sale Rate',
    dataIndex: 'purchase_unit_price',
    responsive: ['xs', 'sm'],
  },
  {
    title: 'Return Quantity',
    dataIndex: 'purchaseReturnQty',
    responsive: ['xs', 'sm'],
  },
  {
    title: 'Return Amount',
    dataIndex: 'purchaseReturnAmount',
    responsive: ['xs', 'sm'],
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

const SaleReturnDetails = routerData => {
  const location = useLocation()
  const [isVisible, setVisible] = useState(false)
  const [isShown, setShown] = useState(false)
  const [isShownEmail, setShownEmail] = useState(false)
  const [isShownReciept, setShownReciept] = useState(false)
  const [csvData, setCSVData] = useState([])

  // console.log(routerData.match.path.split('/'), 'router')
  const routeName = location?.pathname?.split('/')[2]

  const [quoteData, getQuotation] = useState([])
  const { id: quoteId } = routerData?.params

  useEffect(() => {
    if (quoteId) {
      // console.log(quoteId, 'quoteId')
      const fetchData = async () => {
        const result = await QuotationService.getSalesReturnById(quoteId, 'post')
        // console.log(result, 'getSalesReturnById')
        getQuotation(result ? result.data : [])

        const csvDataVal = HelperFunction.getDataForCSV(
          result.data ? result.data.productDto : [],
          columnData,
        )
        setCSVData(csvDataVal)
      }
      fetchData()
    }
  }, [quoteId])

  const approveInvoice = () => {
    const { customerId, invoiceNo } = quoteData
    const data = `customerId=${customerId}&invoiceID=${quoteId}&status=true`
    const fetchData = async () => {
      const result = await QuotationService.approveInvoice(data, 'post')
      // console.log(result, 'result')
      history.push('/inventory/stocks')
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
        <Link to={`/sales/return/edit/${quoteId}`}>&nbsp;&nbsp;Edit</Link>
      </Menu.Item>
      {/* <Menu.Item>
        <button
          style={{ border: 'none', background: 'none' }}
          type="button"
          onClick={() => deleteItem(quoteId)}
        >
          Delete
        </button>
      </Menu.Item> */}
      {/* <Menu.Item onClick={() => handleCreateModal()}>Create New</Menu.Item> */}
    </Menu>
  )

  const handleDetails = () => {
    setVisible(!isVisible)
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

  const deleteItem = id => {
    confirm({
      title: 'Do you Want to delete this item?',
      content: '',
      onOk() {
        const fetchData = async () => {
          const result = await QuotationService.deleteActivity(id, 'SalesInvoice')
          history.push('/sales/quotations')
        }
        fetchData()
      },
      onCancel() {
        // console.log('Cancel')
      },
    })
  }

  const {
    firstName,
    email,
    invoiceNo,
    estimateDate,
    productDto,
    desc,
    title,
    amount: total,
    // sub_total: subTotal,
    terms,
    status,
    lstProductDto,
  } = quoteData

  return (
    <div className="details_layout--page">
      <Row className="mb-3 details__header--css">
        <Col span={12} style={{ fontSize: '18px' }}>
          Sales Return: {quoteId}
        </Col>
        <Col span={12} className="text-end">
          {/* <Link to="/products-and-services/products" style={{ textTransform: 'capitalize' }}>
          Back
        </Link> */}
          <div>
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
            <Button type="default" className="text-center me-2" htmlType="submit">
              <Link to="/sales/returns">Back</Link>
            </Button>
            {/* <Button color="secondary" className="me-2 mb-2">
              <Dropdown
                overlay={
                  <ExportOptions
                    handleRecieptModal={handleRecieptModal}
                    csvData={csvData}
                    apiData={lstProductDto}
                    columns={columnData}
                    fileName="Sale Return Details"
                  />
                }
                className="me-2 mb-2"
              >
                <a className="ant-dropdown-link">
                  In-Progress <DownOutlined />
                </a>
              </Dropdown>
            </Button> */}
            {status === 'accepted' && (
              <Button color="success" onClick={() => approveInvoice()} className="me-2 mb-2">
                Approve
              </Button>
            )}
            <Button color="secondary" outline className="me-2 mb-2">
              <Dropdown trigger={["click"]} popupRender={()=>menu} className="me-2 mb-2">
                <a className="ant-dropdown-link">
                  Options <DownOutlined />
                </a>
              </Dropdown>
            </Button>
          </div>
        </Col>
      </Row>
      {/* <hr /> */}
      <Row className="details__page--content">
        <Col span={24} className="fs-13 text-uppercase mb-3">
          <span className="bulletIcon">Basic Information</span>
        </Col>
        <Col span={6} className="pb-2">
          <div>
            <strong>Customer</strong>
          </div>
          <span>{firstName}</span>
        </Col>
        <Col span={6} className="pb-2">
          <div>
            <strong>Date</strong>
          </div>
          <span>{estimateDate}</span>
        </Col>
        <Col span={6} className="pb-2">
          <div>
            <strong>Invoice Number</strong>
          </div>
          <span>{invoiceNo}</span>
        </Col>
        <Col span={6} className="pb-2">
          <div>
            <strong>Sales Return No</strong>
          </div>
          <span>{email}</span>
        </Col>

        {/* <div className="col-md-12">
          <Button role="button" style={{ marginTop: '15px' }} onClick={() => handleDetails()}>
            Add Contact Details
          </Button>
        </div> */}
        {/* {isVisible && (
          <div className="col-md-12">
            <div className="row">Contact field</div>
          </div>
        )} */}
        <Col span={24}>
          <hr />
        </Col>
        {/* <div className="col-md-12 text-end">
          <span>Amount are tax exclusive</span>
        </div> */}
        <Col span={24} className="fs-13 text-uppercase mb-3">
          <span className="bulletIcon">Products</span>
        </Col>
        <Col span={24}>
          <Table
            className="details__table--field"
            pagination={false}
            dataSource={lstProductDto}
            columns={columnData}
            rowKey="id"
            scroll={{ x: 691 }}
          />
        </Col>

        <Col span={10} offset={14} className="mt-3 total__section">
          <div className="total__section--con">
            <Row>
              <div className="col-md-7 text-start ps-5 pt-2">Total :</div>
              <div className="col-md-5 text-end pt-2">{total || '-'}</div>
            </Row>
          </div>
        </Col>
        <Col span={24}>
          <hr />
        </Col>
        <Col span={24} className="fs-13 text-uppercase mb-3">
          <span className="bulletIcon">Terms & Conditions</span>
        </Col>
        <Col span={14}>
          <span>{terms}</span>
        </Col>
      </Row>
      <DisplayJournal type="sale return" trId={quoteId} formName="saleReturn" isJournal />

      <CreateNew visible={isShown} handleCreateModal={handleCreateModal} />
      <SendEmail visible={isShownEmail} handleSendModal={handleSendModal} />
      <ReceiptPrint
        visible={isShownReciept}
        handleRecieptModal={handleRecieptModal}
        quoteData={quoteData}
        salesValue="Purchase Invoice"
        flag="Purchase Details"
      />
    </div>
  )
}

export default connect()(WithRouter(SaleReturnDetails))
