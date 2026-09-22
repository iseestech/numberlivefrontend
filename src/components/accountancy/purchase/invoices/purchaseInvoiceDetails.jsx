import React, { useState, useEffect } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { Menu, Button, Dropdown, Table, Alert, Popover, Row, Col, Collapse } from 'antd'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import PurchaseService from '@/services/purchase'
import CreateNew from '@/components/accountancy/common/createNew'
import SendEmail from '@/components/accountancy/common/sendEmail'
import ReceiptPrint from '@/components/accountancy/common/receipt'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import DisplayJournal from '@/components/accountancy/common/DisplayJournal'
import HelperFunction from '@/services/helper'
import { history } from '@/main'
import store from 'store'
// import CreateProductModal from './createProductModal'
import './index.scss'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import WithRouter from '@/WithRouter'
const selOrgData = store.get('selectedOrg')
const { Panel } = Collapse

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
  //   title: 'Product #',
  //   dataIndex: 'product_code',
  // },
  {
    title: 'Product Details',
    dataIndex: 'name',
    className: 'product__details--header',
    // style:{{width: "30%"}},
    render: (text, record, index) => {
      return (
        <Row>
          <Col span={24}>
            <strong style={{ textTransform: 'capitalize' }}>{record.name}</strong>
          </Col>
          <Col span={24} className="mt-3">
            <span>{record.purchase_desc}</span>
          </Col>
        </Row>
      )
    },
  },
  // {
  //   title: 'Description',
  //   dataIndex: 'purchase_desc',
  // },
  {
    title: 'Quantity',
    dataIndex: 'purchase_qty',
    className: 'text-end',
  },
  {
    title: 'Unit Price',
    dataIndex: 'purchase_unit_price',
    className: 'text-end',
  },
  {
    title: 'Discount (%)',
    dataIndex: 'purchaseDiscountPercent',
    className: 'text-end',
  },
  // {
  //   title: 'Account',
  //   dataIndex: 'purchase_account',
  // },
  {
    title: 'Tax %',
    // dataIndex: 'purchase_tax_rate',
    dataIndex: 'ptaxsign',
    className: 'text-center',
  },
  {
    title: 'Amount',
    dataIndex: 'purchase_amount',
    className: 'text-end',
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

const PurchaseInvoiceDetails = routerData => {
  const [isVisible, setVisible] = useState(false)
  const [isShown, setShown] = useState(false)
  const [isShownEmail, setShownEmail] = useState(false)
  const [isShownReciept, setShownReciept] = useState(false)
  const [csvData, setCSVData] = useState([])
  // console.log(routerData.match.path.split('/'), 'router')
  // const routeName = routerData.match.path.split('/')[2]`

  const [quoteData, getQuotation] = useState([])
  const { id: quoteId } = routerData.params

  useEffect(() => {
    // console.log(routerData, 'routerData122')
    if (quoteId || routerData.invoiceId) {
      // console.log(quoteId, 'quoteId')
      const val = routerData.from === 'purchasePayment' ? routerData?.invoiceId : quoteId
      const fetchData = async () => {
        const result = await PurchaseService.getPurchaseInvoice(val)
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
    const { vendorId, invoiceNo } = quoteData
    const data = `vendor_id=${vendorId}&invoiceId=${quoteId}&status=APPROVE`
    const fetchDataVal = async () => {
      const val = {
        vendorId,
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
      const result = await PurchaseService.approvePurchaseInvoice(data, 'get')
      // console.log(result, 'result')
      // if (result.statusCode === 200) {
      //   fetchDataVal()
      // }

      history.push('/inventory/stocks')
      // getQuotation(result ? result.data : [])
    }
    // fetchDataVal()
    fetchData()
  }

  const handleDeleteModal = () => {
    // console.log(quoteId, 'result')
    const fetchData = async () => {
      const result = await PurchaseService.deleteActivityPI(quoteId, 'get')
      // console.log(result, 'result')
      // if (result.statusCode === 200) {
      //   fetchDataVal()
      // }

      history.push('/purchase/invoices')
      // getQuotation(result ? result.data : [])
    }
    // fetchDataVal()
    fetchData()
  }

  const gotoEditPage = () => {
    history.push(`/purchase/invoice/edit/${quoteId}`)
  }

  const MenuOptions = (data) => {
  const disabled = data.paymentStatus !== "UNPAID";

  const items = [
    {
      key: "edit",
      label: "Edit",
      disabled,
      onClick: gotoEditPage,
    },
    {
      key: "delete",
      label: "Delete",
      disabled,
      onClick: handleDeleteModal,
    },
  ];

  return <Menu items={items} />;
};

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
    invoiceNo,
    estimateDate,
    productDto,
    desc,
    title,
    total,
    sub_total: subTotal,
    terms,
    accepted,
    totalPurchaseDiscountAmount,
    totalPurchaseTaxAmount,
    taxType,
    purchaseNumber,
    paymentStatus,
    discountNew,
    discountNewAmt,
    shippingCharges,
    netAmount,
  } = quoteData
  // console.log('productDto', productDto, quoteId, routerData)
  return (
    <div className="details_layout--page">
      {routerData.from !== 'purchasePayment' && (
        <Row className="mb-3 details__header--css">
          <Col span={12} style={{ fontSize: '18px' }}>
            {purchaseNumber}
          </Col>
          <Col span={12} className="text-end">
            <Button type="default" className="text-center me-2" htmlType="submit">
              <Link to="/purchase/invoices">Back</Link>
            </Button>
            <Button color="secondary" className="me-2 mb-2">
            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              popupRender={() => <ExportOptions 
                handleRecieptModal={handleRecieptModal}
                  csvData={csvData}
                  apiData={productDto}
                  columns={columnData}
                  fileName="Purchase Invoice Details" />}
              
              className="me-2 mb-2"
                          >
                <a className="ant-dropdown-link">
                  Export As <DownOutlined />
                </a>
              </Dropdown>
            </Button>
            {accepted !== 'APPROVE' && (
              <Button color="success" onClick={() => approveInvoice()} className="me-2 mb-2">
                Approve
              </Button>
            )}
            <Button color="secondary" outline className="me-2 mb-2">
              <Dropdown
                trigger={["click"]}
              placement="bottomRight" popupRender={() => <MenuOptions paymentStatus={paymentStatus} />}
                className="me-2 mb-2"
              >
                <a className="ant-dropdown-link">
                  {/* <Alert type="info" showIcon /> Options */}
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
          </Col>
        </Row>
      )}
      {/* <hr /> */}
      <Row className="details__page--content">
        <Col span={24} className="fs-13 text-uppercase mb-3">
          <span className="bulletIcon">Basic Information</span>
        </Col>
        <Col span={6} className="pb-2">
          <div>
            <strong>Vendor</strong>
          </div>
          <span>{firstName}</span>
        </Col>
        <Col span={6} className="pb-2">
          <div>
            <strong>Date</strong>
          </div>
          <span>{HelperFunction.dateFormatted(estimateDate)}</span>
        </Col>
        {/* <Col span={6} className="pb-2">
          <div>
            <strong>Invoice Number</strong>
          </div>
          <span>{purchaseNumber}</span>
        </Col> */}
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
        </div>
        {isVisible && (
          <div className="col-md-12">
            <div className="row">Contact field</div>
          </div>
        )} */}
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
              <div className="col-md-7 text-start ps-5 pt-2">SubTotal </div>
              <div className="col-md-5 text-end pt-2">{subTotal || '-'}</div>
              <div className="col-md-7 text-start ps-5 pt-2">Discount </div>
              <div className="col-md-5 text-end pt-2">{totalPurchaseDiscountAmount || '-'}</div>
              <div className="col-md-7 text-start ps-5 pt-2">Tax </div>
              <div className="col-md-5 text-end pt-2">{totalPurchaseTaxAmount || '-'}</div>
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
                <span>
                  {Number((total || 0) - (discountNewAmt || 0)).toFixed(selOrgData?.decimals)}
                </span>
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
        {/* <Row style={{ width: '100%' }}>
          <Col span={24}>
            <Collapse onChange={callback}>
              <Panel header={<strong>Journal</strong>} key="1">
                <DisplayJournal type="purchase invoice" trId={quoteId} />
              </Panel>
            </Collapse>
          </Col>
        </Row> */}
      </Row>
      <div>
        <DisplayJournal
          type="purchase invoice"
          trId={quoteId}
          formName="purchaseInvoice"
          isJournal
        />
      </div>
      <CreateNew visible={isShown} handleCreateModal={handleCreateModal} />
      <SendEmail visible={isShownEmail} handleSendModal={handleSendModal} />
      {isShownReciept && (
        <OtherPrimaryReport
          visible={isShownReciept}
          handleRecieptModal={() => setShownReciept(!isShownReciept)}
          quoteData={productDto || []}
          detailsInfo={{
            Vendor: firstName,
            Date: HelperFunction.dateFormatted(estimateDate),
            'Invoice Number': invoiceNo,
            Email: email,
          }}
          salesValue="Purchase invoice"
          flag="PurchaseOrderDetails"
          masterData={quoteData}
        />
      )}
      {/* <ReceiptPrint
        visible={isShownReciept}
        handleRecieptModal={handleRecieptModal}
        quoteData={quoteData}
        salesValue="Purchase Invoice"
        flag="Purchase Details"
      /> */}
    </div>
  )
}


export default connect()(WithRouter(PurchaseInvoiceDetails));