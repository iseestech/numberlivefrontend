import React, { useState, useEffect } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { Menu, Button, Dropdown, Table, Modal, Popover, Row, Col } from 'antd'
// import { Button } from 'reactstrap'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import QuotationService from '@/services/sales'
import CreateNew from '@/components/accountancy/common/createNew'
import SendEmail from '@/components/accountancy/common/sendEmail'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import ReceiptPrint from '@/components/accountancy/common/receipt'
import DisplayJournal from '@/components/accountancy/common/DisplayJournal'
import HelperFunction from '@/services/helper'
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
    title: 'Product #',
    dataIndex: 'product_code',
  },
  {
    title: 'Product Name',
    dataIndex: 'name',
    render: (text, record, index) => {
      return (
        <Row>
          <Col span={24}>
            <strong style={{ textTransform: 'capitalize' }}>{record.name}</strong>
          </Col>
          <Col span={24} className="mt-3">
            <span>{record.sale_desc}</span>
          </Col>
        </Row>
      )
    },
  },
  // {
  //   title: 'Description',
  //   dataIndex: 'sale_desc',
  // },
  {
    title: 'Quantity',
    dataIndex: 'sale_qty',
  },
  {
    title: 'Unit Price',
    dataIndex: 'sale_unit_price',
  },
  {
    title: 'Discount',
    dataIndex: 'saleDiscountPercent',
  },
  // {
  //   title: 'Account',
  //   dataIndex: 'sale_account',
  // },
  {
    title: 'Tax %',
    // dataIndex: 'sale_tax_rate',
    dataIndex: 'ptaxsign',
  },
  {
    title: 'Amount',
    dataIndex: 'sale_amount',
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

const InvoiceDetails = routerData => {
  const [isVisible, setVisible] = useState(false)
  const [isShown, setShown] = useState(false)
  const [isShownEmail, setShownEmail] = useState(false)
  const [isShownReciept, setShownReciept] = useState(false)
  const [csvData, setCSVData] = useState([])

  // console.log(routerData.match.path.split('/'), 'router')
  // const routeName = routerData.match.path.split('/')[2]

  const [quoteData, getQuotation] = useState([])
  const { id: quoteId } = routerData.params

  useEffect(() => {
    if (quoteId || routerData.invoiceId) {
      const val = routerData.from === 'salePayment' ? routerData.invoiceId : quoteId
      // console.log(quoteId, 'quoteId')
      const fetchData = async () => {
        const result = await QuotationService.getInvoice(val, 'post')
        // console.log(result, 'result')
        getQuotation(result ? result.data : [])

        const csvDataVal = HelperFunction.getDataForCSV(
          result && result.data ? result.data.productDto : [],
          columnData,
        )
        setCSVData(csvDataVal)
      }
      fetchData()
    }
  }, [quoteId])

  const approveInvoice = () => {
    const { customerId, invoiceNo } = quoteData
    const data = `customerId=${customerId}&invoiceID=${quoteId}&status=APPROVE`
    const fetchData = async () => {
      const result = await QuotationService.approveInvoice(data, 'post')
      // console.log(result, 'result')
      // history.push('/inventory/stocks')
      // getQuotation(result ? result.data : [])
    }
    fetchData()
  }

  const MenuOptions = data => {
    // console.log(data, 'data')
    return (
      <Menu>
        {/* <Menu.Item>
        <a target="_blank" rel="noopener noreferrer">
          Mark as Inactive
        </a>
      </Menu.Item> */}
        <Menu.Item
          key="0"
          disabled={data.paymentStatus !== 'UNPAID' && true}
          onClick={() => routerData.navigate(`/sales/invoice/edit/${quoteId}`)}
        >
          Edit
          {/* <Link to={`/sales/invoice/edit/${quoteId}`}>&nbsp;&nbsp;Edit</Link> */}
        </Menu.Item>
        <Menu.Item
          key="1"
          disabled={data.paymentStatus !== 'UNPAID' && true}
          onClick={() => deleteItem(quoteId)}
        >
          {/* <button
            style={{ border: 'none', background: 'none' }}
            type="button"
            onClick={() => deleteItem(quoteId)}
          >
            Delete
          </button> */}
          Delete
        </Menu.Item>
        {/* <Menu.Item onClick={() => handleCreateModal()}>Create New</Menu.Item> */}
      </Menu>
    )
  }
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
          history.push('/sales/invoices')
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
    total,
    sub_total: subTotal,
    terms,
    status,
    taxType,
    totalSaleDiscountAmount,
    totalSaleTaxAmount,
    paymentStatus,
    discountNew,
    discountNewAmt,
    shippingCharges,
    netAmount,
    customerName,
  } = quoteData

  return (
    <div className="details_layout--page">
      {routerData.from !== 'salePayment' && (
        <Row className="mb-3 details__header--css">
          <Col span={12} style={{ fontSize: '18px' }}>
            Sales Invoice: {quoteId}
          </Col>
          <Col span={12} className="text-end">
            <Button type="default" className="text-center me-2" htmlType="submit">
              <Link to="/sales/invoices">Back</Link>
            </Button>
            <Button color="secondary" className="me-2 mb-2">
              <Dropdown
                trigger={["click"]}
                popupRender={() => <ExportOptions
                    handleRecieptModal={handleRecieptModal}
                    csvData={csvData}
                    apiData={productDto}
                    columns={columnData}
                    fileName="Sales Invoice Details"
                  />
                }
                className="me-2 mb-2"
              >
                <a className="ant-dropdown-link">
                  Export As <DownOutlined />
                </a>
              </Dropdown>
            </Button>
            {status === 'ACCEPTED' && (
              <Button color="success" onClick={() => approveInvoice()} className="me-2 mb-2">
                Approve
              </Button>
            )}
            {/* {paymentStatus === 'UNPAID' && ( */}
            <Button color="secondary" outline className="me-2 mb-2">
              <Dropdown
                trigger={["click"]}
                popupRender={() => <MenuOptions paymentStatus={paymentStatus} />}
                className="me-2 mb-2"
              >
                <a className="ant-dropdown-link">
                  {paymentStatus !== 'UNPAID' && (
                    <Popover
                      content="Can not delete invoice, Payment found against the invoice"
                      trigger="hover"
                    >
                      Options
                    </Popover>
                  )}
                  {paymentStatus === 'UNPAID' && 'Options'}
                  <DownOutlined />
                </a>
              </Dropdown>
            </Button>
            {/* )} */}
          </Col>
        </Row>
      )}
      <hr />
      <Row className="details__page--content">
        <Col span={24} className="fs-13 text-uppercase mb-3">
          <span className="bulletIcon">Basic Information</span>
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
          <span>{HelperFunction.dateFormatted(estimateDate)}</span>
        </Col>
        <Col span={6} className="pb-2">
          <div>
            <strong>Invoice Number</strong>
          </div>
          <span>{invoiceNo}</span>
        </Col>
        <Col span={6} className="pb-2">
          <div>
            <strong>Email</strong>
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
            dataSource={productDto}
            columns={columnData}
            rowKey="id"
            scroll={{ x: 691 }}
          />
        </Col>
        {/* <div className="col-md-9">&nbsp;</div>
        <div className="col-md-3">
          <div>
            <br />
            <div>
              Subtotal: <strong>{subTotal}</strong>
            </div>
            <div>
              Total Sales Tax 0%: <strong>0.00</strong>
            </div>
            <hr style={{ margin: '5px 0' }} />
            <div>
              <h3>
                <strong>Total : </strong>
                <strong>{total}</strong>
              </h3>
            </div>
            <hr style={{ margin: '5px 0', borderBottom: '10px' }} />
          </div>
        </div> */}

        <Col span={10} offset={14} className="mt-3 total__section">
          <div className="total__section--con">
            <Row>
              <div className="col-md-7 text-start ps-5 pt-2">SubTotal </div>
              <div className="col-md-5 text-end pt-2">{subTotal || '-'}</div>
              <div className="col-md-7 text-start ps-5 pt-2">Discount </div>
              <div className="col-md-5 text-end pt-2">{totalSaleDiscountAmount || '-'}</div>
              <div className="col-md-7 text-start ps-5 pt-2">Tax </div>
              <div className="col-md-5 text-end pt-2">{totalSaleTaxAmount || '-'}</div>
              <div className="col-md-7 text-start ps-5 pt-2">Amount are with </div>
              <div className="col-md-5 text-end pt-2">
                {taxType === 'NoTax' && <strong>No Tax</strong>}
                {taxType === 'TaxExclusive' && <strong>Tax Exclusive</strong>}
                {taxType === 'TaxInclusive' && <strong>Tax Inclusive</strong>}
              </div>
              <div className="col-md-7 text-start ps-5 pt-2">
                <strong>Total </strong>
              </div>
              <div className="col-md-5 text-end pt-2">
                <strong>{total || '-'}</strong>
              </div>
              <div className="col-md-7 text-start ps-5 pt-2">Extra Discount % </div>
              <div
                className="col-md-5 text-start pt-2"
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <span>{discountNew}%</span>
                <span>{discountNewAmt || '-'}</span>
              </div>
              {/* <div className="col-md-7 text-start ps-5 pt-2">Discount Amt </div>
                    <div className="col-md-5 text-start pt-2">{discountNewAmt || '-'}</div> */}
              <div className="col-md-7 text-start ps-5 pt-2">Shipping Charges </div>
              <div
                className="col-md-5 text-start pt-2"
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <span>{shippingCharges}</span>
                <span>{(total || 0) - (discountNewAmt || 0) || '-'}</span>
              </div>
              <div className="col-md-7 text-start ps-5 pt-2  pb-3">
                <strong>Net Amount </strong>
              </div>
              <div className="col-md-5 text-end pt-2 pb-3">
                <strong>{netAmount || '-'}</strong>
              </div>
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
      <DisplayJournal type="sale invoice" trId={quoteId} formName="saleInvoice" isJournal />

      <CreateNew visible={isShown} handleCreateModal={handleCreateModal} />
      <SendEmail visible={isShownEmail} handleSendModal={handleSendModal} />
      <ReceiptPrint
        visible={isShownReciept}
        handleRecieptModal={handleRecieptModal}
        quoteData={quoteData}
        salesValue="Sales Invoice"
        flag="Sales Details"
      />
    </div>
  )
}

export default connect()(WithRouter(InvoiceDetails))
