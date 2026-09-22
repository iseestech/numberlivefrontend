import React, { useState, useEffect } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { Menu, Button, Dropdown, Table, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import PurchaseService from '@/services/purchase'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import HelperFunction from '@/services/helper'
import CreateNew from '@/components/accountancy/common/createNew'
import SendEmail from '@/components/accountancy/common/sendEmail'
import ReceiptPrint from '@/components/accountancy/common/receipt'
import WithRouter from '@/WithRouter'
import { history } from '@/main'
// import CreateProductModal from './createProductModal'
import './index.scss'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import DisplayJournal from '@/components/accountancy/common/DisplayJournal'

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
    title: 'Purchase Quantity',
    dataIndex: 'purchase_qty',
    responsive: ['xs', 'sm'],
  },
  {
    title: 'Purchase Rate',
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

const PurchaseReturnDetails = routerData => {
  const [isVisible, setVisible] = useState(false)
  const [isShown, setShown] = useState(false)
  const [isShownEmail, setShownEmail] = useState(false)
  const [isShownReciept, setShownReciept] = useState(false)
  const [csvData, setCSVData] = useState([])

  // console.log(routerData.match.path.split('/'), 'router')
  // const routeName = routerData.match.path.split('/')[2]

  const [quoteData, getQuotation] = useState([])
  const { id: quoteId } = routerData?.params

  useEffect(() => {
    if (quoteId) {
      // console.log(quoteId, 'quoteId')
      const fetchData = async () => {
        // const result = await PurchaseService.getPurchaseReturn(match.params.purchaseId)

        const result = await PurchaseService.getPurchaseReturn(quoteId)
        // console.log(result, 'result')
        getQuotation(result ? result.data : [])
      }
      fetchData()
    }
  }, [quoteId])

  const approveInvoice = () => {
    const { customerId, invoiceNo } = quoteData
    const data = `customerId=${customerId}&purchaseId=${quoteId}&status=true`
    const fetchDataVal = async () => {
      const val = {
        custId: customerId,
        id: 0,
      }
      const resultVal = await PurchaseService.updateOpeningStock(val, 'post')
      // console.log(resultVal, 'ResultVal')
      if (resultVal.status === 200) {
        // fetchDataVal()
        fetchData()
      }
    }
    const fetchData = async () => {
      const result = await PurchaseService.approvePurchaseInvoice(data, 'post')
      // console.log(result, 'result')
      // if (result.statusCode === 200) {
      //   fetchDataVal()
      // }

      // history.push('/inventory/stocks')
      // getQuotation(result ? result.data : [])
    }
    fetchDataVal()
    // fetchData()
  }

  const menu = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer">
          Mark as Inactive
        </a>
      </Menu.Item>
      <Menu.Item>
        <Link to={`/purchase/return/edit/${quoteId}`}>Edit</Link>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer">
          Delete
        </a>
      </Menu.Item>
      <Menu.Item onClick={() => handleCreateModal()}>Create New</Menu.Item>
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

  const {
    firstName,
    email,
    purchaseReturnNo: invoiceNo,
    purReturnDate,
    lstProduct: productDto,
    desc,
    title,
    amount: total,
    sub_total: subTotal,
    terms,
    vendorId,
    vendorName,
  } = quoteData

  return (
    <div className="details_layout--page">
      <Row className="mb-3 details__header--css">
        <Col span={12} style={{ fontSize: '18px' }}>
          {invoiceNo}
        </Col>
        <Col span={12} className="text-end">
          <Button color="primary" outline className="me-2 mb-2">
            <Link to={`/purchase/return/edit/${quoteId}`} style={{ textTransform: 'capitalize' }}>
              Edit
            </Link>
          </Button>
          <Button color="secondary" className="me-0 mb-2">
            <Dropdown
              trigger={["click"]}
              popupRender={() =>
                <ExportOptions
                  handleRecieptModal={handleRecieptModal}
                  csvData={csvData}
                  apiData={productDto}
                  columns={columnData}
                  fileName="Purchase Return Details"
                />
              }
              className="me-2 mb-2"
            >
              <a className="ant-dropdown-link">
                Export As <DownOutlined />
              </a>
            </Dropdown>
          </Button>
          {/* <Button color="secondary" outline className="me-2 mb-2">
            <Dropdown overlay={menu} className="me-2 mb-2">
              <a className="ant-dropdown-link">
                Options <DownOutlined />
              </a>
            </Dropdown>
          </Button> */}
        </Col>
        {/* <Link to="/products-and-services/products" style={{ textTransform: 'capitalize' }}>
          Back
        </Link> */}
      </Row>
      <Row className="details__page--content">
        <Col span={24} className="fs-13 text-uppercase mb-3">
          <span className="bulletIcon">Basic Information</span>
        </Col>
        <Col span={6} className="pb-2">
          <div>
            <strong>Vendor</strong>
          </div>
          <span>{vendorName}</span>
        </Col>
        <Col span={6} className="pb-2">
          <div>
            <strong>Date</strong>
          </div>
          <span>{purReturnDate}</span>
        </Col>
        {/* <div className="col-md-3">
          <div>
            <strong>Purchase Return Number</strong>
          </div>
          <span>{invoiceNo}</span>
        </div> */}
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

        {/* <div className="col-md-12">
          <hr style={{ margin: '5px 0' }} />
        </div> */}
        {/* <div className="col-md-12 text-end">
          <span>Amount are tax exclusive</span>
        </div> */}
        <Col span={24}>
          <hr />
        </Col>
        <Col span={24} className="fs-13 text-uppercase mb-3">
          <span className="bulletIcon">Products</span>
        </Col>
        <Col span={24}>
          <Table
            className="details__table--field"
            pagination={false}
            dataSource={productDto}
            columns={columnData}
            rowKey="id"
            scroll={{ x: 691 }}
          />
        </Col>
        <Col span={10} offset={14} className="mt-3 total__section">
          <div className="total__section--con">
            <Row>
              <div className="col-md-7 text-start ps-5 pt-2">Total </div>
              <div className="col-md-5 text-end pt-2">{total || '-'}</div>
            </Row>
          </div>
        </Col>
        <Col span={24}>
          <hr />
        </Col>
        <Col span={24} className="fs-13 text-uppercase mb-3">
          <span className="bulletIcon">Reason</span>
        </Col>
        <Col span={14}>
          <span>{terms}</span>
        </Col>
      </Row>
      <DisplayJournal type="purchase return" trId={quoteId} formName="purchaseReturn" isJournal />
      <CreateNew visible={isShown} handleCreateModal={handleCreateModal} />
      <SendEmail visible={isShownEmail} handleSendModal={handleSendModal} />
      {isShownReciept && (
        <OtherPrimaryReport
          visible={isShownReciept}
          handleRecieptModal={() => setShownReciept(!isShownReciept)}
          quoteData={productDto || []}
          detailsInfo={{
            Vendor: firstName,
            Date: purReturnDate,
            'Purchase Return Number': invoiceNo,
          }}
          salesValue="Purchase Return"
          flag="PurchaseReturnDetails"
        />
      )}
      {/* <ReceiptPrint
        visible={isShownReciept}
        handleRecieptModal={handleRecieptModal}
        quoteData={quoteData}
        salesValue="Purchase Invoice"
      /> */}
      {/* 
      <ReceiptPrint
        visible={isShownReciept}
        handleRecieptModal={handleRecieptModal}
        quoteData={quoteData}
        salesValue="Purchase Invoice"
        flag="Purchase Details"
      /> */}
    </div>
  )
}


export default connect(mapStateToProps)(WithRouter(PurchaseReturnDetails));
