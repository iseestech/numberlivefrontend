import React, { useState, useEffect, useRef } from 'react'
import { DownOutlined } from '@ant-design/icons'
import {
  Menu,
  Dropdown,
  Table,
  Modal,
  Input,
  notification,
  Form,
  Popover,
  Row,
  Col,
  Button,
} from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import PurchaseService from '@/services/purchase'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import CreateNew from '@/components/accountancy/common/createNew'
import SendEmail from '@/components/accountancy/common/sendEmail'
import HelperFunction from '@/services/helper'
import { history } from '@/main'
import './index.scss'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import DisplayJournal from '@/components/accountancy/common/DisplayJournal'
import store from 'store'
import WithRouter from '@/WithRouter'
const { confirm } = Modal
const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const selOrgData = store.get('selectedOrg')

const columnData = [
  {
    title: '#',
    dataIndex: 'key',
    key: 'key',
    // render: (text, record, index) => index + 1,
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

const PurchaseOrderDetails = routerData => {
  const [isVisible, setVisible] = useState(false)
  const [isShown, setShown] = useState(false)
  const [isShownEmail, setShownEmail] = useState(false)
  const [isShownReciept, setShownReciept] = useState(false)
  const [csvData, setCSVData] = useState([])
  const invoiceRef = useRef(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  // console.log(routerData.match.path.split('/'), 'router')
  // const routeName = routerData.match.path.split('/')[2]

  const [quoteData, getQuotation] = useState([])
  const { id: quoteId } = routerData?.params

  useEffect(() => {
    if (quoteId) {
      // console.log(quoteId, 'quoteId')
      const fetchData = async () => {
        const result = await PurchaseService.getPurchaseOrder(quoteId, 'post')
        // console.log(result, 'result')
        const csvDataVal = HelperFunction.getDataForCSV(
          result && result.data ? result.data.productDto : [],
          columnData,
        )
        if (result?.data?.productDto?.length) {
          result.data.productDto.forEach((ele, i) => {
            ele.key = i + 1
          })
        }
        getQuotation(result ? result.data : {})
        setCSVData(csvDataVal)
      }
      fetchData()
    }
  }, [quoteId])

  const convertPI = () => {
    const { vendorId, invoiceNo } = quoteData
    // const data = `vendor_id=${vendorId}&orderId=${quoteId}&status=true`;
    const { state } = invoiceRef.current
    const value = state?.value || ''
    const data = `vendor_id=${vendorId}&orderId=${quoteId}&status=APPROVE&purchaseNumber=${value}`

    const fetchData = async () => {
      const result = await PurchaseService.purchaseConvertToInvoice(data, 'get')
      // const result = await PurchaseService.approvePurchaseInvoice(data, 'get')
      // console.log(result, 'result')
      if (result && result?.data?.statusCode === 409) {
        notification.warning({
          message: 'Warning',
          description: result?.data?.message,
        })
      } else {
        history.push('/purchase/invoices')
      }
      // getQuotation(result ? result.data : [])
    }
    // const fetchDataVal = async () => {
    //   const val = {
    //     vendorId,
    //     id: 0,
    //   }
    //   const resultVal = await PurchaseService.updateOpeningStock(val, 'post')
    //   // console.log(resultVal, 'ResultVal')
    //   if (resultVal.status === 200) {
    //     fetchData()
    //   }
    // }
    if (value.trim()) {
      fetchData()
    } else {
      notification.warning({
        message: 'Warning',
        description: 'Please Enter Purchase Number',
      })
    }
  }

  const deleteItem = id => {
    confirm({
      title: 'Do you Want to delete this item?',
      content: '',
      onOk() {
        const fetchData = async () => {
          const result = await PurchaseService.deleteActivity(id)
          // console.log(result, 'resullll')
          // history.push('/purchase/orders')
        }
        fetchData()
      },
      onCancel() {
        // console.log('Cancel')
      },
    })
  }
  const gotoEditPage = () => {
    console.log(quoteId, 'quoteId', routerData)
   routerData.navigate(`/purchase/order/edit/${quoteId}`);
  }


const MenuOptions = (data) => {
  const disabled = data.acceptStatus === "APPROVE";

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
      onClick: () => deleteItem(quoteId),
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
    purchase_order_no: purchaseNumber,
    estimateDate,
    productDto,
    desc,
    title,
    total,
    sub_total: subTotal,
    terms,
    acceptStatus,
    totalPurchaseDiscountAmount,
    totalPurchaseTaxAmount,
    taxType,
    paymentStatus,
    discountNew,
    discountNewAmt,
    shippingCharges,
    netAmount,
  } = quoteData
  // console.log(
  //   'quote Data order details',
  //   quoteData,
  //   //   Object.keys(quoteData).reduce((arr, key)=>{
  //   //     const subObj = {[key]: quoteData[key]};
  //   //     return arr.concat(subObj)
  //   // }, [])
  // )
  // console.log(paymentStatus, 'paymentStatus')
  return (
    <div className="details_layout--page">
      <Row className="mb-3 details__header--css">
        <Col span={12} style={{ fontSize: '18px' }}>
          {purchaseNumber}
        </Col>
        <Col span={12} className="text-end">
          <Button type="default" className="text-center me-2" htmlType="submit">
            <Link to="/purchase/orders">Back</Link>
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
                  fileName="Purchase Order Details" />}
             
              className="me-2 mb-2"
            >
              <a className="ant-dropdown-link">
                Export As <DownOutlined />
              </a>
            </Dropdown>
          </Button>

          {acceptStatus !== 'APPROVE' && (
            <Button color="success" onClick={showModal} className="me-2 mb-2">
              Convert To PI
            </Button>
          )}
          {paymentStatus !== 'UNPAID' && paymentStatus !== 'PAID' && (
            <Button color="secondary" outline className="me-2 mb-2">
              <Dropdown trigger={["click"]}
              placement="bottomRight" popupRender={() => <MenuOptions acceptStatus={acceptStatus} />} className="me-2 mb-2">
                <a className="ant-dropdown-link">
                  {acceptStatus === 'APPROVE' && (
                    <Popover content="Order is already approved" trigger="hover">
                      Options
                    </Popover>
                  )}
                  {acceptStatus !== 'APPROVE' && 'Options'}
                  <DownOutlined />
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
            <strong>PO Number</strong>
          </div>
          <span>{purchaseNumber}</span>
        </Col> */}
        <Col span={6} className="pb-2">
          <div>
            <strong>Email</strong>
          </div>
          <span>{email}</span>
        </Col>

        <Col span={24}>
          <hr />
        </Col>
        <Col span={24} className="fs-13 text-uppercase mb-3">
          <span className="bulletIcon">Products</span>
        </Col>
        {/* <div className="col-md-12 text-end">
          <span>Amount are tax exclusive</span>
        </div> */}
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

        {/*  <div className="col-md-3">
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
              <div className="col-md-7 text-start ps-5 pt-2">SubTotal</div>
              <div className="col-md-5 text-end pt-2">{subTotal || '-'}</div>
              <div className="col-md-7 text-start ps-5 pt-2">Discount</div>
              <div className="col-md-5 text-end pt-2">{totalPurchaseDiscountAmount || '-'}</div>
              <div className="col-md-7 text-start ps-5 pt-2">Tax</div>
              <div className="col-md-5 text-end pt-2">{totalPurchaseTaxAmount || '-'}</div>
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
                <span>
                  {Number((total || 0) - (discountNewAmt || 0)).toFixed(selOrgData?.decimals) ||
                    '-'}
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
        <Col span={16}>
          <span>{terms}</span>
        </Col>
      </Row>
      <div>
        <DisplayJournal trId={quoteId} formName="purchaseOrder" isJournal={false} />
      </div>
      <CreateNew visible={isShown} handleCreateModal={handleCreateModal} />
      <SendEmail visible={isShownEmail} handleSendModal={handleSendModal} />
      {/* <ReceiptPrint
        visible={isShownReciept}
        handleRecieptModal={handleRecieptModal}
        quoteData={quoteData || []}
        salesValue="Purchase Order"
        flag="Purchase Details"
      /> */}
      <Modal
        title="Convert To PI"
        footer={null}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form.Item name="title" label="Vendor's Bill No.">
          <Input className="mb-2" ref={invoiceRef} />
        </Form.Item>
        <div className="text-end">
          <Button color="success" onClick={convertPI} className="me-2 mb-2">
            Convert
          </Button>
        </div>
      </Modal>
      {isShownReciept && (
        <OtherPrimaryReport
          visible={isShownReciept}
          handleRecieptModal={() => setShownReciept(!isShownReciept)}
          quoteData={productDto || []}
          detailsInfo={{
            Vendor: firstName,
            Date: HelperFunction.dateFormatted(estimateDate),
            'PO Number': purchaseNumber,
            Email: email,
          }}
          salesValue="Purchase Order"
          flag="PurchaseOrderDetails"
          masterData={quoteData}
        />
      )}
    </div>
  )
}



export default connect()(WithRouter(PurchaseOrderDetails));