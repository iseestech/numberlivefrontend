import React, { useState, useEffect } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { Menu, Dropdown, Table } from 'antd'
import { Button } from 'reactstrap'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import PurchaseService from '@/services/purchase'
import CreateNew from '@/components/accountancy/common/createNew'
import SendEmail from '@/components/accountancy/common/sendEmail'
import ReceiptPrint from '@/components/accountancy/common/receipt'
import { history } from '@/main'
// import CreateProductModal from './createProductModal'
import './index.scss'

const mapStateToProps = ({ router }) => ({
  routerData: router,
})

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
    title: 'Tax %',
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

const BalanceSheetDetails = routerData => {
  const [isVisible, setVisible] = useState(false)
  const [isShown, setShown] = useState(false)
  const [isShownEmail, setShownEmail] = useState(false)
  const [isShownReciept, setShownReciept] = useState(false)
  const routeName = routerData.match.path.split('/')[2]

  const [quoteData, getQuotation] = useState([])
  const { id: quoteId } = routerData.match.params

  useEffect(() => {
    if (quoteId) {
      const fetchData = async () => {
        const result = await PurchaseService.getPurchaseOrder(quoteId, 'post')
        getQuotation(result ? result.data : [])
      }
      fetchData()
    }
  }, [quoteId])

  const approveInvoice = () => {
    const { customerId, invoiceNo } = quoteData
    const data = `customerId=${customerId}&purchaseId=${quoteId}&status=true`
    const fetchData = async () => {
      const result = await PurchaseService.approveOrder(data, 'post')
      history.push('/purchase/invoices')
      // getQuotation(result ? result.data : [])
    }
    fetchData()
  }

  const menu = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer">
          Mark as Inactive
        </a>
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
    quoteNumber,
    estimateDate,
    productDto,
    desc,
    title,
    total,
    sub_total: subTotal,
    terms,
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
          {/* <Button color="success" onClick={() => approveInvoice()} className="me-2 mb-2">
            Approve
          </Button> */}
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
          <span>{estimateDate}</span>
        </div>
        <div className="col-md-3">
          <div>
            <strong>Invoice Number</strong>
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
      <CreateNew visible={isShown} handleCreateModal={handleCreateModal} />
      <SendEmail visible={isShownEmail} handleSendModal={handleSendModal} />
      <ReceiptPrint
        visible={isShownReciept}
        handleRecieptModal={handleRecieptModal}
        quoteData={quoteData}
      />
    </div>
  )
}

export default connect()(BalanceSheetDetails)
