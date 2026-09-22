import React from 'react'
import {
  Table,
  Popconfirm,
  Button,
  Input,
  Form,
  Space,
  Checkbox,
  Select,
  Divider,
  Modal,
  DatePicker,
  Menu,
  Dropdown,
  notification,
  Row,
  Col,
} from 'antd'
// import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import { MenuOutlined, PlusOutlined, DownOutlined } from '@ant-design/icons'
// import { arrayMove } from "@dnd-kit/sortable";
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import HelperFunction from '@/services/helper'
import store from 'store'
import QuotationService from '@/services/sales'
import InvoiceDetails from '@/components/accountancy/sales/invoices/invoiceDetails'
import PurchaseService from '@/services/purchase'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import DisplayJournal from '@/components/accountancy/common/DisplayJournal'
import { history } from '@/main'

const { TextArea } = Input
const { Option } = Select

class PaymentDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isShownReciept: false,
      amtInExcess: 0.0,
      amountReceived: 0.0,
      amountRefunded: 0.0,
      amountUseForPayment: 0.0,
      total: 0,
      invoiceData: [],
      paymentMaserData: {},
      csvData: [],
      isModalVisible: false,
      invoiceId: '',
      tableCol: [
        {
          title: '#',
          dataIndex: 'key',
          key: 'key',
          render: (text, record, index) => index + 1,
        },
        {
          title: 'Invoice Date',
          name: 'invoiceDate',
          dataIndex: 'invoiceDate',
          responsive: ['xs', 'sm'],
        },
        {
          title: 'Invoice Number',
          name: 'invoice_no',
          dataIndex: 'invoice_no',
          responsive: ['xs', 'sm'],
          render: (text, record, index) => (
            <Button
              style={{ border: 0, background: 'none' }}
              type="button"
              onClick={() => this.showModal(record.invoice_no)}
            >
              {record.invoice_no}
            </Button>
          ),
        },
        {
          title: 'Invoice Amount',
          name: 'invoiceAmount',
          dataIndex: 'invoiceAmount',
          responsive: ['xs', 'sm'],
        },
        {
          title: 'Amount  Due',
          dataIndex: 'invoice_due_amount',
          name: 'invoice_due_amount',
          responsive: ['xs', 'sm'],
        },
        {
          title: 'Payment',
          name: 'salePayment',
          dataIndex: 'salePayment',
          responsive: ['xs', 'sm'],
        },
      ],
    }
    // This binding is necessary to make `this` work in the callback
  }

  componentDidMount = () => {
    const { match } = this.props
    const { tableCol } = this.state
    const org = store.get('selectedOrg')

    if (match.params.payId) {
      // console.log(match.params.payId, '(match.params.invoiceId')
      const fetchInvoiceData = async () => {
        const result = await QuotationService.getSalesPayment(match.params.payId)
        // console.log(result, 'invoiceId result')
        // getQuotation(result ? result.data : [])
        const resultData = result ? result.data : {}
        const data = []
        const csvDataVal = HelperFunction.getDataForCSV(
          resultData.saleInvoiceDto ? resultData.saleInvoiceDto : [],
          tableCol,
        )

        // console.log(resultData, 'resultData.length')
        if (resultData.id) {
          // console.log(data, 'data')
          this.setState({
            paymentMaserData: resultData,
            csvData: csvDataVal,
            total: resultData.total,
            invoiceData: resultData.saleInvoiceDto,
            amtInExcess: resultData.amtInExcess,
            amountReceived: resultData.amount_received,
            amountRefunded: resultData.amount_refunded,
            amountUseForPayment: resultData.amount_useForPayment,
          })
        }
      }
      fetchInvoiceData()
    }
  }

  showModal = id => {
    this.setState({
      isModalVisible: true,
      invoiceId: id,
    })
  }

  handleOk = () => {
    this.setState({
      isModalVisible: false,
    })
  }

  handleCancel = () => {
    this.setState({
      isModalVisible: false,
    })
  }

  handleDeleteModal = () => {
    // console.log(quoteId, 'result')
    const { match } = this.props

    const fetchData = async () => {
      const result = await QuotationService.deleteSalesPayment(match.params.payId)
      // console.log(result, 'result')
      if (result?.statusCode === 200) {
        notification.success({
          message: 'Success',
          description: result.message || 'Record deleted successfully',
          duration: 6,
        })
        history.push('/sales/payments')
      }

      // getQuotation(result ? result.data : [])
    }
    // fetchDataVal()
    fetchData()
  }

  render() {
    const {
      total,
      amtInExcess,
      amountReceived,
      amountRefunded,
      amountUseForPayment,
      invoiceData,
      paymentMaserData,
      isShownReciept,
      csvData,
      isModalVisible,
      invoiceId,
      tableCol,
    } = this.state
    const { match } = this.props
    const routeName = match.path.split('/')

    const {
      customerId,
      payment_date: paymentDate,
      invoiceNo,
      amountPaid,
      paymentNo,
      debitFrom,
      payment_mode: paymentMode,
      deposit_to: depositTo,
      refference,
      taxDeducted,
      firstName,
      lastName,
      actName,
      // amount_received
      reference,
    } = paymentMaserData
    // console.log(invoiceData, 'invoiceData')
    const menu = (
      <Menu>
        {/* <Menu.Item>
        <a target="_blank" rel="noopener noreferrer">
          Mark as Inactive
        </a>
      </Menu.Item> */}
        <Menu.Item>
          <Link to={`/sales/payment/edit/${match.params.payId}`}>Edit</Link>
        </Menu.Item>
        <Menu.Item onClick={() => this.handleDeleteModal()}>Delete</Menu.Item>
        {/* <Menu.Item onClick={() => handleCreateModal()}>Create New</Menu.Item> */}
      </Menu>
    )

    return (
      <div className="details_layout--page">
        <Row className="mb-3 details__header--css">
          <Col span={12} style={{ fontSize: '18px' }}>
            Sales Payment: {match?.params?.payId}
          </Col>
          <Col span={12} className="text-end">
            {/* <Link to="/products-and-services/products" style={{ textTransform: 'capitalize' }}>
          Back
        </Link> */}
            <div>
              {/* <CreateProductModal headingText="Edit Product" /> */}
              {/* <Button
              color="secondary"
              outline
              className="me-2 mb-2"
              // onClick={() => handleSendModal()}
            >
              Send
            </Button> */}
              {/* <Button
              color="secondary"
              className="me-2 mb-2"
              // onClick={() => handleRecieptModal()}
              onClick={() => this.setState({ isShownReciept: !isShownReciept })}
            >
              Print
            </Button> */}
              <Button type="default" className="text-center me-2" htmlType="submit">
                <Link to="/purchase/orders">Back</Link>
              </Button>
              <Button color="secondary" className="me-2 mb-2">
                <Dropdown
                  overlay={
                    <ExportOptions
                      handleRecieptModal={() => this.setState({ isShownReciept: !isShownReciept })}
                      csvData={csvData}
                      apiData={invoiceData}
                      columns={tableCol}
                      fileName="Sales Payment Details"
                    />
                  }
                  className="me-2 mb-2"
                >
                  <a className="ant-dropdown-link">
                    Export As <DownOutlined />
                  </a>
                </Dropdown>
              </Button>

              <Button color="secondary" className="me-2 mb-2">
                <Dropdown overlay={menu} className="me-2 mb-2">
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
            <span>
              {firstName} {lastName}
            </span>
          </Col>
          <Col span={6} className="pb-2">
            <div>
              <strong>Payment Date</strong>
            </div>
            <span>{HelperFunction.dateFormatted(paymentDate)}</span>
          </Col>
          {/* <Col span={6} className="pb-2">
            <div>
              <strong>Invoice Number</strong>
            </div>
            <span>{invoiceNo}</span>
          </div> */}
          <Col span={6} className="pb-2">
            <div>
              <strong>Amount Paid</strong>
            </div>
            <span>{amountReceived}</span>
          </Col>
          <Col span={6} className="pb-2">
            <div>
              <strong>Payment No</strong>
            </div>
            <span>{paymentNo}</span>
          </Col>
          <Col span={6} className="pb-2">
            <div>
              <strong>Deposit To</strong>
            </div>
            <span>{actName}</span>
          </Col>

          <Col span={6} className="pb-2">
            <div>
              <strong>Payment Mode</strong>
            </div>
            <span>{paymentMode}</span>
          </Col>
          <Col span={6} className="pb-2">
            <div>
              <strong>Refference</strong>
            </div>
            <span>{reference}</span>
          </Col>
          {/* <div className="col-md-3">
            <div>
              <strong>Tax Deducted</strong>
            </div>
            <span>{taxDeducted}</span>
          </div> */}
          <Col span={24}>
            <hr />
          </Col>

          <Col span={24} className="fs-13 text-uppercase mb-3">
            <span className="bulletIcon">Paid Invoices History</span>
          </Col>
          <Col span={24}>
            <Table
              className="details__table--field"
              pagination={false}
              dataSource={invoiceData}
              columns={tableCol}
              rowKey="id"
              scroll={{ x: 691 }}
            />
            <br />
          </Col>

          <Col span={10} offset={14} className="mt-3 total__section">
            <div className="total__section--con">
              <Row>
                {/* <hr style={{ marginTop: '5px', marginBottom: '5px' }} /> */}
                <div className="col-md-7 text-start ps-5 pt-2">Amount Paid </div>
                <div className="col-md-5 text-end pt-2r">{amountReceived}</div>
                <div className="col-md-7 text-start ps-5 pt-2">Amount used for payments </div>
                <div className="col-md-5 text-end pt-2r">{amountUseForPayment}</div>
                <div className="col-md-7 text-start ps-5 pt-2">Amount Refunded </div>
                <div className="col-md-5 text-end pt-2r">{amountRefunded}</div>
                <div className="col-md-7 text-start ps-5 pt-2"> Amount in excess </div>
                <div className="col-md-5 text-end pt-2r">{amtInExcess}</div>
                <div className="col-md-7 text-start ps-5 pt-2">Total</div>
                <div className="col-md-5 text-end pt-2r">{total}</div>
              </Row>
            </div>
          </Col>
          <Col span={24}>
            <hr />
          </Col>
          {/* <Col span={24} className="fs-13 text-uppercase mb-3">
          <span>Terms & Conditions</span>
        </Col> */}
        </Row>
        <DisplayJournal type="sale payment" trId={match.params.payId} isJournal />

        {isShownReciept && (
          <OtherPrimaryReport
            visible={isShownReciept}
            handleRecieptModal={() => this.setState({ isShownReciept: !isShownReciept })}
            quoteData={invoiceData || []}
            detailsInfo={{
              Customer: `${firstName} ${lastName}`,
              'Payment Date': paymentDate,
              // 'Invoice No': invoiceNo,
              'Amount Paid': amountReceived,
              'Payment No': paymentNo,
              'Deposit To': actName,
              'Payment Mode': paymentMode,
              // Refference: refference,
            }}
            salesValue="Sales Payment Receipt"
            flag="SalesPaymentDetails"
            masterData={{
              ...paymentMaserData,
              amountPaid: amountReceived,
              amountUseForPayments: amountUseForPayment,
              amoutRefunded: amountRefunded,
              amountExces: amtInExcess,
            }}
          />
        )}
        {isModalVisible && (
          <Modal
            title="Purchase Invoice"
            visible={isModalVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={null}
            width={1000}
          >
            <InvoiceDetails
              invoiceId={invoiceId}
              from="salePayment"
              formName="salePayment"
              isJournal
            />
          </Modal>
        )}
      </div>
    )
  }
}

const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})

export default connect(mapStateToProps)(PaymentDetails)

