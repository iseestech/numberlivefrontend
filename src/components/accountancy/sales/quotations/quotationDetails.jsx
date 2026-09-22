import React, { useState, useEffect } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { Menu, Button, Dropdown, Table, Modal, Row, Col } from 'antd'
// import { Button } from 'reactstrap'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import QuotationService from '@/services/sales'
import CreateNew from '@/components/accountancy/common/createNew'
import SendEmail from '@/components/accountancy/common/sendEmail'
import ReceiptPrint from '@/components/accountancy/common/receipt'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import HelperFunction from '@/services/helper'
import { history } from '@/main'
// import CreateProductModal from './createProductModal'
import './index.scss'
import DisplayJournal from '@/components/accountancy/common/DisplayJournal'
import WithRouter from '@/WithRouter'
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
    title: 'Product Details',
    className: 'product__details--header',
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
    title: 'Discount (%)',
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

const QuotationDetails = routerData => {
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
        const result = await QuotationService.getQuotation(quoteId)
        // console.log(result, 'result')
        getQuotation(result ? result.data : [])

        const csvDataVal = HelperFunction.getDataForCSV(
          result?.data ? result?.data?.productDto : [],
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
      history.push('/sales/invoices')
      // getQuotation(result ? result.data : [])
    }
    fetchData()
  }

  const convertTo = () => {
    const prodId = []
    quoteData.productDto.forEach(item => {
      prodId.push(item.id)
    })
    quoteData.acceptStatus = true
    quoteData.product_id = prodId.toString()
    // console.log(quoteData, 'quoteData')
    const fetchData = async () => {
      const result = await QuotationService.convertTo(quoteData, 'post')
      // console.log(result, 'result')
      setShown(!isShown)
      // history.push('/sales/invoices')
    }
    fetchData()
  }

  const deleteItem = id => {
    confirm({
      title: 'Do you Want to delete this item?',
      content: '',
      onOk() {
        const fetchData = async () => {
          const result = await QuotationService.deleteActivity(id, 'salesQuotation')
          history.push('/sales/quotations')
        }
        fetchData()
      },
      onCancel() {
        // console.log('Cancel')
      },
    })
  }

 const MenuOptions = (
  <Menu
    items={[
      {
        key: "edit",
        label: (
          <Link to={`/sales/quotation/edit/${quoteId}`}>
            Edit
          </Link>
        ),
      },
      {
        key: "delete",
        label: (
          <button
            type="button"
            onClick={() => deleteItem(quoteId)}
            style={{
              border: "none",
              background: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        ),
      },
    ]}
  />
);

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

  const convertToOrder = () => {
    // isees/api/salesQuotation/quoteStatus?customerId=13&quoteId=22&status=true
    // console.log('test')
    const { customerId } = quoteData
    const data = `customerId=${customerId}&quoteId=${quoteId}&status=APPROVE`
    const fetchData = async () => {
      const result = await QuotationService.convertToOrder(data, 'get')
      // console.log(result, 'result')
      history.push('/sales/orders')
      // getQuotation(result ? result.data : [])
    }
    fetchData()
  }

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
    taxType,
    totalSaleDiscountAmount,
    totalSaleTaxAmount,
    discountNew,
    discountNewAmt,
    shippingCharges,
    netAmount,
    acceptStatus,
    customerName,
  } = quoteData

  return (
    <div className="details_layout--page">
      <Row className="mb-3 details__header--css">
        <Col span={12} style={{ fontSize: '18px' }}>
          Sales Quotation: {quoteId}
        </Col>
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

          <Button color="secondary" className="me-2 mb-2">
            <Dropdown
            trigger={["click"]}
              popupRender={ () =><ExportOptions
                  handleRecieptModal={handleRecieptModal}
                  csvData={csvData}
                  apiData={productDto}
                  columns={columnData}
                  fileName="Sales Quotation Details"
                />
              }
              className="me-2 mb-2"
            >
              <a className="ant-dropdown-link">
                Export As <DownOutlined />
              </a>
            </Dropdown>
          </Button>
          {/* <Button color="success" className="me-2 mb-2" onClick={() => handleCreateModal()}>
              Convert To Order 
            </Button> */}
          {status === 'ACCEPTED' && (
            <Button color="success" className="me-2 mb-2" onClick={() => convertToOrder()}>
              Convert To Order
            </Button>
          )}
          {acceptStatus !== 'APPROVE' && (
            <Button color="secondary" outline className="me-2 mb-2">
              <Dropdown trigger={["click"]} popupRender={() => MenuOptions} className="me-2 mb-2">
                <a className="ant-dropdown-link">
                  Options <DownOutlined />
                </a>
              </Dropdown>
            </Button>
          )}
        </Col>
      </Row>
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
            <strong>Quote Number</strong>
          </div>
          <span>{quoteNumber}</span>
        </Col>
        <Col span={6} className="pb-2">
          <div>
            <strong>Email</strong>
          </div>
          <span>{email}</span>
        </Col>
        <Col span={6} className="pb-2">
          <div>
            <strong>Amount are</strong>
          </div>
          <span>
            {taxType === 'NoTax' && <strong>No Tax</strong>}
            {taxType === 'TaxExclusive' && <strong>Tax Exclusive</strong>}
            {taxType === 'TaxInclusive' && <strong>Tax Inclusive</strong>}
          </span>
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
        {/* <div className="col-md-12">
          <hr style={{ margin: '5px 0' }} />
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

        {/* <div className="col-md-7">&nbsp;</div>
        <div className="col-md-5" style={{ marginTop: '15px' }}>
          <div style={{ border: '1px dashed', padding: '10px 0' }}>
            <div className="row">
              <div className="col-md-7 text-end">SubTotal :</div>
              <div className="col-md-5 text-center">{subTotal || '-'}</div>
              <div className="col-md-7 text-end">
                <strong>Total :</strong>
              </div>
              <div className="col-md-5 text-center">
                <strong>{total || '-'}</strong>
              </div>
              <div className="col-md-7 text-end">Amount are with :</div>
              <div className="col-md-5 text-center">
               
              </div>
            </div>
          </div>
        </div> */}

        <Col span={10} offset={14} className="mt-3 total__section">
          <div className="total__section--con">
            <Row>
              <div className="col-md-7 text-start ps-5 pt-2">SubTotal</div>
              <div className="col-md-5 text-end pt-2">{subTotal || '-'}</div>
              <div className="col-md-7 text-start ps-5 pt-2">Discount</div>
              <div className="col-md-5 text-end pt-2">{totalSaleDiscountAmount || '-'}</div>
              <div className="col-md-7 text-start ps-5 pt-2">Tax</div>
              <div className="col-md-5 text-end pt-2">{totalSaleTaxAmount || '-'}</div>
              <div className="col-md-7 text-start ps-5 pt-2">Amount are with</div>
              <div className="col-md-5 text-end pt-2">
                {taxType === 'NoTax' && <strong>No Tax</strong>}
                {taxType === 'TaxExclusive' && <strong>Tax Exclusive</strong>}
                {taxType === 'TaxInclusive' && <strong>Tax Inclusive</strong>}
              </div>
              <div className="col-md-7 text-start ps-5 pt-2">
                <strong>Total</strong>
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
      <div>
        {/* <hr /> */}
        <DisplayJournal trId={quoteId} formName="salesquotation" isJournal={false} />
      </div>
      <CreateNew
        visible={isShown}
        handleCreateModal={handleCreateModal}
        approveInvoice={convertTo}
      />
      <SendEmail visible={isShownEmail} handleSendModal={handleSendModal} />
      <ReceiptPrint
        visible={isShownReciept}
        handleRecieptModal={handleRecieptModal}
        quoteData={quoteData}
        salesValue="Sales Quotation"
        flag="Sales Details"
      />
    </div>
  )
}

export default connect()(WithRouter(QuotationDetails))
