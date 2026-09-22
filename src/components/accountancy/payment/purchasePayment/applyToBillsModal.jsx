import React, { useContext, useState, useEffect, useRef } from 'react'
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
  InputNumber,
  notification,
  Row,
  Col,
  Tabs,
} from 'antd'
// import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import { MenuOutlined, PlusOutlined } from '@ant-design/icons'
// import { arrayMove } from "@dnd-kit/sortable";
import { Link, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import ProductService from '@/services/products'
import BankService from '@/services/banking'
// import VendorService from '@/services/customer'
import CustomerService from '@/services/customer'
import VendorService from '@/services/vendor'
import VendorAdvPaymentService from '@/services/purchase/vendorAdvService'
import axios from 'axios'
import store from 'store'
import PurchaseService from '@/services/purchase'
import PurchaseInvoiceDetails from '@/components/accountancy/purchase/invoices/purchaseInvoiceDetails'
import { history } from '@/main'
import InvoiceTable from './invoiceTable'
import './index.scss'

const { TabPane } = Tabs
const { TextArea } = Input
const { Option } = Select
// const DragHandle = sortableHandle(() => (
//   <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
// ))

class ApplyToBillsModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [
        { name: 'jack', key: 1 },
        { name: 'lucy', key: 2 },
      ],
      amtInExcess: 0,
      amountReceived: 0.0,
      amountRefunded: 0.0,
      isDirty: false,
      amountUseForPayment: 0.0,
      payment: 0.0,
      currentProdId: {},
      visible: false,
      selectedCust: {},
      custData: [],
      prodData: [],
      chartOfAccount: [],
      defaultData: [],
      action: 'Create',
      selectedCustId: {},
      total: 0,
      subTotal: 0,
      custName: '',
      name: '',
      // count: 4,
      isVisible: false,
      isShown: false,
      purchaseDate: '2021/01/01',
      deliveryDate: '2021/01/01',
      dataSource: [],
      invoiceData: [],
      paymentMaserData: {},
      amountExceed: false,
      isModalVisible: false,
      invoiceId: '',
    }
    // This binding is necessary to make `this` work in the callback
    this.onFinish = this.onFinish.bind(this)
    this.onFinishFailed = this.onFinishFailed.bind(this)
    this.formRef = React.createRef()

    this.onFinishAdv = this.onFinishAdv.bind(this)
    this.onFinishFailedAdv = this.onFinishFailedAdv.bind(this)
    this.formRefAdv = React.createRef()
  }

  handleCompName = e => {
    const { custData } = this.state
    const selected = custData.filter(item => item.id === parseInt(e, 10))
    // console.log(e, 'handleCompName', selected, custData)
    this.passCustData(selected)
  }

  // fetchChartOfAccount = () => ChartOfAccService.listAllAccounts('ALL')
  fetchChartOfAccount = org => BankService.bankList(org.orgCode)

  fetchCustData = () => VendorService.customerList()

  fetchProdData = () => ProductService.productList()

  componentDidMount = () => {
    this.passCustData()
  }

  getAllData = async () => {
    const org = store.get('selectedOrg')
    const [prodData, chartOfAccount, custData] = await axios.all([
      this.fetchProdData(),
      this.fetchChartOfAccount(org),
      this.fetchCustData(),
    ])
    if (prodData && prodData.data.length)
      prodData.data.forEach((ele, i) => {
        ele.key = i + 1
      })

    // console.log(chartOfAccount, '&& chartOfAccount.data')
    this.setState({
      prodData: prodData ? prodData.data : [],
      custData: custData || [],
      chartOfAccount: chartOfAccount || [],
    })
  }

  fetchInvoiceData = async id => {
    const result = await PurchaseService.getPurchasePayment(id)
    // console.log(result, 'invoiceId result')
    // getQuotation(result ? result.data : [])
    const resultData = result ? result.data : {}
    const data = []
    // console.log(resultData, 'resultData.length')
    if (resultData.id) {
      _.forEach(resultData, (val, key) => {
        // if (key !== 'lstPurchasePaymentInvoiceDto')
        data.push({
          name: [key],
          value: key === 'paymentDate' || key === 'expiryDate' ? moment(val) : val,
        })
      })
      // console.log(data, 'data')
      this.setState(
        {
          defaultData: data,
          paymentMaserData: resultData,
          subTotal: resultData.sub_total,
          total: resultData.total,
          dataSource: resultData.lstPurchasePaymentInvoiceDto
            ? resultData.lstPurchasePaymentInvoiceDto
            : [],
          invoiceData: resultData.lstPurchasePaymentInvoiceDto,
          action: 'Update',
          amtInExcess: resultData.amountExces || 0,
          amountReceived: resultData.amountPaid,
          amountRefunded: resultData.amoutRefunded,
          amountUseForPayment: resultData.amountUseForPayments,

          purchaseDate: resultData.estimateDate || new Date(),
          deliveryDate: resultData.expiryDate || new Date(),
          selectedCustId: {
            vendorId: resultData.vendorId,
            firstName: resultData.firstName,
            lastName: resultData.LastName,
          },
        },
        () => this.getAllData(),
      )
    }
  }

  onFinish = values => {
    const {
      dataSource,
      purchaseDate,
      deliveryDate,
      selectedCust,
      sub_total: subTotal,
      total,
      defaultData,
      selectedCustId,
      amtInExcess,
      amountReceived,
      amountRefunded,
      payment,
      amountUseForPayment,
      invoiceData,
      paymentMaserData,
      amountExceed,
    } = this.state
    // console.log(values, 'values')
    const { match, user, closeModal, isEdit, trId, reconcile } = this.props
    // console.log(amtInExcess, 'dataSource 123', amountReceived)
    // values.productDto = dataSource
    // values.product_id = 0;

    // if (amtInExcess !== 0) {
    //   return notification.error({
    //     message: 'Error',
    //     description:
    //       'The amount entered for invoice(s) exceeds the total payment made to the vendor. The Amount in excess diff should be 0.',
    //     duration: 6,
    //   })
    // }
    if (amountExceed === true) {
      return notification.error({
        message: 'Error',
        description: 'The amount entered is more than the balance due for the selected invoices.',
        duration: 6,
      })
    }

    // values.sub_total = total
    // values.total = total
    // values.amtInExcess = amtInExcess
    // values.amount_paid = amountReceived
    // values.amount_refunded = amountRefunded
    // values.vendor_name = selectedCust.firstName || selectedCustId.firstName
    // values.vendorId = selectedCust.id || selectedCustId.vendorId
    // values.paymentDate = moment(values.paymentDate).format('MM/DD/YYYY HH:mm:ss')
    // values.payment_date = moment(values.paymentDate).format('MM/DD/YYYY HH:mm:ss')

    const method = 'post'
    // if (match.params.id && !isEdit) {
    //   method = 'put'
    //   values.paymentNo = match.params.id
    //   values.id = paymentMaserData.id
    // }

    // if (trId && isEdit) {
    //   method = 'put'
    //   values.paymentNo = trId
    //   values.id = paymentMaserData.id
    // }

    // values.email = user.email
    // console.log(values, 'values')
    const fetchData = async () => {
      const result = await VendorAdvPaymentService.addVendorAdvInvoice(values, method)
      history.push('/purchase/payments')
      // console.log('log ==> ', result)
    }
    return fetchData()
  }

  onFinishAdv = values => {
    // console.log('Values', values)
  }

  onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo)
  }

  onFinishFailedAdv = errorInfo => {
    // console.log('Failed:', errorInfo)
  }

  handleProduct = (e, record, from) => {
    const { dataSource, prodData, currentProdId } = this.state
    dataSource.forEach(element => {
      if (element.id === currentProdId.id) {
        Object.assign(element, record)
      }
    })
    this.setState(
      {
        dataSource,
      },
      () => this.handleChange(e, record, from),
    )
  }

  handleChange = (e, record, keyName, index) => {
    // console.log(e, record, keyName, index, 'e record')

    const invoiceFormData = this.formRef.current.getFieldValue('lstVendorAdvancedInvoiceDto')
    record.paidAmount = e
    invoiceFormData[index] = record
    let total = 0

    const { amountReceived, amountExceed } = this.state
    let amtExceed = amountExceed
    invoiceFormData.forEach(ele => {
      if (ele.id === record.id) {
        total += ele.paidAmount || 0
        amtExceed = ele.paidAmount > ele.invoice_due_amount && true
      } else {
        total += ele.paidAmount || 0
      }
    })

    this.formRef.current.setFieldsValue({ lstVendorAdvancedInvoiceDto: invoiceFormData })

    this.setState({
      total,
      // invoiceData,
      amtInExcess: amountReceived - total,
      amountReceived,
      amountExceed: amtExceed,
      // amountRefunded,
      amountUseForPayment: total,
    })
  }

  passCustData = data => {
    // console.log(data, 'selected Date')
    const { selectedCust } = this.state
    const { vendorId, receivedAmount } = this.props
    // this.setState({
    //   selectedCust: data[0],
    // })

    const org = store.get('selectedOrg')

    const fetchCustData = async () => {
      // const result = await PurchaseService.getUnpaidInvoice(data[0].id)
      const result = await PurchaseService.getUnpaidInvoiceNew({
        id: vendorId,
        orgCode: org.orgCode,
      })
      this.formRef.current.setFieldsValue({ lstVendorAdvancedInvoiceDto: result })

      // console.log(result, 'custResult')
      this.setState({
        // selectedCust: data[0],
        // selectedCustId: { vendorId },
        invoiceData: result,
        amountReceived: receivedAmount,
      })
    }
    fetchCustData()
  }

  handleCalculation = key => {
    let total = 0
    let amtInExcess = 0
    let amountUseForPayment = 0
    const { invoiceData, amountRefunded, amountReceived } = this.state
    let userAmount = amountReceived
    const invoiceFormData = this.formRef.current.getFieldValue('lstVendorAdvancedInvoiceDto')

    invoiceFormData.forEach(ele => {
      const { invoiceAmount: saleAmount, invoice_due_amount: invoiceDueAmount } = ele
      ele.invoice_due_amount = invoiceDueAmount || 0
      if (userAmount >= (invoiceDueAmount || 0)) {
        ele.paidAmount = invoiceDueAmount
        total += ele.paidAmount
        amountUseForPayment += ele.paidAmount
        userAmount -= invoiceDueAmount
      } else if (userAmount > 0) {
        ele.paidAmount = key === 'paidAmount' ? Number(ele.paidAmount) : Number(userAmount)
        userAmount -= invoiceDueAmount || saleAmount
        total += Number(ele.paidAmount)
        amountUseForPayment += ele.paidAmount
      } else {
        ele.paidAmount = 0
        // total += total
        // amountUseForPayment += total
        // userAmount =
      }

      this.formRef.current.setFieldsValue({ lstVendorAdvancedInvoiceDto: invoiceFormData })
    })

    amtInExcess = amountReceived - amountUseForPayment
    if (amountUseForPayment >= amountReceived) {
      amtInExcess = amountUseForPayment - amountReceived
    }

    // console.log(total, 'total')
    this.setState({
      total,
      invoiceData,
      amtInExcess,
      amountReceived,
      amountRefunded,
      amountUseForPayment,
    })
  }

  handleAmount = e => {
    const vendorId = this.formRef.current.getFieldValue('vendorId')
    if (!vendorId) {
      this.formRef.current.setFieldsValue({ amountPaid: 0 })
      return false
    }

    return this.setState(
      {
        amountReceived: e.target.value,
        amountExceed: false,
      },
      () => this.handleCalculation(),
    )
  }

  formValuesChange = e => {
    const isDirty = Object.keys(e).length && true
    this.setState({ isDirty })
  }

  formValuesChangeAdv = e => {
    const isDirty = Object.keys(e).length && true
    this.setState({ isDirty })
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

  render() {
    const {
      dataSource,
      visible,
      columns,
      items,
      custData,
      name,
      custName,
      isVisible,
      isShown,
      total,
      subTotal,
      chartOfAccount,
      purchaseDate,
      deliveryDate,
      defaultData,
      action,
      selectedCustId,
      amtInExcess,
      amountReceived,
      amountRefunded,
      amountUseForPayment,
      invoiceData,
      isDirty,
      isModalVisible,
      invoiceId,
    } = this.state
    const { match, closeModal, reconcile } = this.props

    return (
      <>
        <Form
          className="form__layout--css"
          layout="horizontal"
          fields={defaultData}
          onFinish={this.onFinish}
          ref={this.formRef}
          onFinishFailed={this.onFinishFailed}
          onValuesChange={this.formValuesChange}
        >
          {/* <Row className="mb-3 form__header--css">
            <Col span={20} style={{ fontSize: '18px' }}>
              {match?.params?.id ? <span>Edit: {match?.params?.id}</span> : 'New Purchase Payment'}
            </Col>
            <Col span={4} className="text-end">
              <Button type="default" className="text-center me-2" htmlType="submit">
                <Link to="/purchase/payments">Cancel</Link>
              </Button>
              <Button
                type="primary"
                size="medium"
                className="text-center"
                htmlType="submit"
                // loading={isLoading}
              >
                {action}
              </Button>
            </Col>
          </Row> */}
          <div className="form__content--css p-0" style={{ boxShadow: 'none' }}>
            <Row className="form__body-content pt-0 pb-0">
              {/* <Col span={24} className="fs-13 text-uppercase mb-3">
                <span className="bulletIcon">Unpaid Invoices</span>
              </Col> */}

              <Col span={24}>
                <Form.List name="lstVendorAdvancedInvoiceDto">
                  {(lstVendorAdvancedInvoiceDto, options) => {
                    // console.log(dataSource, 'dataSource.productDto')
                    return (
                      <InvoiceTable
                        // productDetailsDto={productDetailsDto}
                        // add={options.add}
                        // remove={options.remove}
                        // productData={invoiceData}
                        // handleDelete={this.handleDelete}
                        // handleAddRow={this.handleAdd}
                        itemData={invoiceData || []}
                        // taxData={taxData || []}
                        // updateProduct={this.updateProduct}
                        updateRow={this.handleChange}
                        openInvoiceModal={this.showModal}
                        // updateQtyRow={this.updateQtyRow}
                        // handleAddRow={this.handleAddRow}
                        // handleDeleteRow={this.handleDelete}
                        // handleDescription={this.handleDescription}
                        // showModal={this.showModal}
                      />
                    )
                  }}
                </Form.List>
              </Col>
              <Col span={10} offset={14} className="mt-3 total__section">
                <div className="total__section--con">
                  <Row>
                    <div className="col-md-7 text-start ps-5 pt-2">Amount Paid </div>
                    <div className="col-md-5 text-end pt-2">{total}</div>
                    {/* <div className="col-md-7 text-start ps-5 pt-2">Amount used for payments </div>
                    <div className="col-md-5 text-end pt-2">{amountUseForPayment}</div> */}
                    {/* <div className="col-md-7 text-start ps-5 pt-2">Amount Refunded </div>
                    <div className="col-md-5 text-end pt-2">{amountRefunded}</div> */}
                    <div className="col-md-7 text-start ps-5 pt-2"> Amount in excess </div>
                    <div className="col-md-5 text-end pt-2">{amtInExcess}</div>
                    <div className="col-md-7 text-start ps-5 pt-2">Total</div>
                    <div className="col-md-5 text-end pt-2">{total}</div>
                  </Row>
                </div>
              </Col>
              <Col span={24}>
                <hr />
              </Col>
              <Col span={24} className="fs-13 text-uppercase mb-3">
                <span className="bulletIcon">Notes</span>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item name="notes" label={null}>
                      <TextArea />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <div className="col-md-12">
                <Form.Item name="purchase" label={null} valuePropName="checked">
                  {/* <Group options={optionsWithPurchase} /> */}
                  <Checkbox>Email a &quot;thank you&quot; note for this payment</Checkbox>
                </Form.Item>
              </div>
            </Row>
            <div className="text-end">
              <hr />
              {match.params.bankId || reconcile ? (
                <Button type="default" className="text-center" onClick={() => closeModal()}>
                  <strong>Cancel</strong>
                </Button>
              ) : (
                <Button type="default" className="text-center me-2">
                  <strong>
                    <Link to="/purchase/payments">Cancel</Link>
                  </strong>
                </Button>
              )}
              <Button type="primary" className="text-center me-3" htmlType="submit">
                <strong>Send</strong>
              </Button>
            </div>
          </div>
        </Form>
      </>
    )
  }
}

const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})

export default connect(mapStateToProps)(ApplyToBillsModal)

