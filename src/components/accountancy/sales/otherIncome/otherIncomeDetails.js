import React, { useState, useEffect } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { Menu, Dropdown, Table, Modal } from 'antd'
import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import QuotationService from '@/services/sales'
import CreateNew from '@/components/accountancy/common/createNew'
import SendEmail from '@/components/accountancy/common/sendEmail'
import ReceiptPrint from '@/components/accountancy/common/receipt'
import HelperFunction from '@/services/helper'
import { history } from '@/main'
// import CreateProductModal from './createProductModal'
import './index.scss'

const { confirm } = Modal
const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const columnData = [
  {
    title: 'Item',
    dataIndex: 'id',
  },
  {
    title: 'Product Name',
    dataIndex: 'name',
  },
  {
    title: 'Description',
    dataIndex: 'sale_desc',
  },
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
    dataIndex: 'sale_discount',
  },
  {
    title: 'Account',
    dataIndex: 'sale_account',
  },
  // {
  //   title: 'Tax rate',
  //   dataIndex: 'sale_tax_rate',
  // },
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

const OtherIncomeDetails = routerData => {
  const [isVisible, setVisible] = useState(false)
  const [isShown, setShown] = useState(false)
  const [isShownEmail, setShownEmail] = useState(false)
  const [isShownReciept, setShownReciept] = useState(false)
  // console.log(routerData.match.path.split('/'), 'router')
  const routeName = routerData.match.path.split('/')[2]

  const [quoteData, getQuotation] = useState([])
  const { id: quoteId } = routerData.match.params

  useEffect(() => {
    if (quoteId) {
      // console.log(quoteId, 'quoteId')
      const fetchData = async () => {
        const result = await QuotationService.getQuotation(quoteId)
        // console.log(result, 'result')
        getQuotation(result ? result.data : [])
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

  const menu = (
    <Menu>
      {/* <Menu.Item>
        <a target="_blank" rel="noopener noreferrer">
          Mark as Inactive
        </a>
      </Menu.Item> */}
      <Menu.Item>
        <Link to={`/sales/quotation/edit/${quoteId}`}>&nbsp;&nbsp;Edit</Link>
      </Menu.Item>
      <Menu.Item>
        <button
          style={{ border: 'none', background: 'none' }}
          type="button"
          onClick={() => deleteItem(quoteId)}
        >
          Delete
        </button>
      </Menu.Item>
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
  } = quoteData

  return (
    <div>
      <div
        className="text-end"
        style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline' }}
      >
        {/* <Link to="/products-and-services/products" style={{ textTransform: 'capitalize' }}>
          Back
        </Link> */}
        <div style={{ display: 'flex' }}>
          {/* <CreateProductModal headingText="Edit Product" /> */}
          {/* <Button color="secondary" outline className="me-2 mb-2" onClick={() => handleSendModal()}>
            Send
          </Button> */}
          <Button
            color="secondary"
            outline
            className="me-2 mb-2"
            onClick={() => handleRecieptModal()}
          >
            Print
          </Button>
          {/* <Button color="success" className="me-2 mb-2" onClick={() => handleCreateModal()}>
              Convert To Order
            </Button> */}
          {status === 'ACCEPTED' && (
            <Button color="success" className="me-2 mb-2" onClick={() => convertToOrder()}>
              Convert To Order
            </Button>
          )}
          <Button color="secondary" outline className="me-2 mb-2">
            <Dropdown overlay={menu} className="me-2 mb-2">
              <a className="ant-dropdown-link">
                Options <DownOutlined />
              </a>
            </Dropdown>
          </Button>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-3">
          <div>
            <strong>Customer</strong>
          </div>
          <span>{firstName}</span>
        </div>
        <div className="col-md-3">
          <div>
            <strong>Date</strong>
          </div>
          <span>{HelperFunction.dateFormatted(estimateDate)}</span>
        </div>
        <div className="col-md-3">
          <div>
            <strong>Quote Number</strong>
          </div>
          <span>{quoteNumber}</span>
        </div>
        <div className="col-md-3">
          <div>
            <strong>Email</strong>
          </div>
          <span>{email}</span>
        </div>

        {/* <div className="col-md-12">
          <Button role="button" style={{ marginTop: '15px' }} onClick={() => handleDetails()}>
            Add Contact Details
          </Button>
        </div> */}
        {isVisible && (
          <div className="col-md-12">
            <div className="row">Contact field</div>
          </div>
        )}
        <div className="col-md-12">
          <hr style={{ margin: '5px 0' }} />
        </div>
        {/* <div className="col-md-12 text-end">
          <span>Amount are tax exclusive</span>
        </div> */}
        <div className="col-md-12">
          <Table
            pagination={false}
            dataSource={productDto}
            columns={columnData}
            rowKey="id"
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
        </div>

        <div className="col-md-12">Terms: - {terms}</div>
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
        salesValue="Quote"
      />
    </div>
  )
}

export default connect()(OtherIncomeDetails)

