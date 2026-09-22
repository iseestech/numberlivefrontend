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
import CreateProductModal from '@/components/accountancy/productsAndServices/createProductModal'
import CreateCustomer from '@/components/accountancy/contacts/createCustomer'
import ProductService from '@/services/products'
import ChartOfAccService from '@/services/chartOfAccount'
import BankService from '@/services/banking'
// import VendorService from '@/services/customer'
import CustomerService from '@/services/customer'
import VendorService from '@/services/vendor'
import axios from 'axios'
import store from 'store'
import PurchaseService from '@/services/purchase'
import PurchaseInvoiceDetails from '@/components/accountancy/purchase/invoices/purchaseInvoiceDetails'
import { history } from '@/main'
import InvoiceTable from './invoiceTable'
import './index.scss'
import WithRouter from '@/WithRouter'
const selOrgData = store.get('selectedOrg')
const { TabPane } = Tabs
const { TextArea } = Input
const { Option } = Select
// const DragHandle = sortableHandle(() => (
//   <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
// ))

class AddPurchasePayment extends React.Component {
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
      // currentProdId: {},
      visible: false,
      selectedCust: {},
      custData: [],
      // prodData: [],
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

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
  }

  handleBeforeUnload = event => {
    event.preventDefault()
    event.returnValue = ''
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

  // fetchProdData = () => ProductService.productList()

  componentDidMount = () => {
    // console.log('componentDidMount called')
    const { params, trId, isEdit } = this.props
    const org = store.get('selectedOrg')

    if (params.id) {
      // console.log(params.id, '(params.invoiceId')
      this.fetchInvoiceData(params.id)
    } else if (params.bankId) {
      if (isEdit) {
        this.fetchInvoiceData(trId)
      } else {
        this.setState(
          {
            defaultData: [{ name: 'debitFrom', value: Number(params.bankId) }],
          },
          () => this.getAllData(),
        )
      }
    } else {
      this.getAllData()
    }
  }

  getAllData = async () => {
    const org = store.get('selectedOrg')
    const [chartOfAccount, custData] = await axios.all([
      // this.fetchProdData(),
      this.fetchChartOfAccount(org),
      this.fetchCustData(),
    ])
    // if (prodData && prodData.data.length)
    //   prodData.data.forEach((ele, i) => {
    //     ele.key = i + 1
    //   })

    // console.log(chartOfAccount, '&& chartOfAccount.data')
    this.setState({
      // prodData: prodData ? prodData.data : [],
      custData: custData || [],
      chartOfAccount: chartOfAccount || [],
    })
    window.addEventListener('beforeunload', this.handleBeforeUnload)
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

    if (amtInExcess !== 0) {
      return notification.error({
        message: 'Error',
        description:
          'The amount entered for invoice(s) exceeds the total payment made to the vendor. The Amount in excess diff should be 0.',
        duration: 6,
      })
    }
    if (amountExceed === true) {
      return notification.error({
        message: 'Error',
        description: 'The amount entered is more than the balance due for the selected invoices.',
        duration: 6,
      })
    }

    values.sub_total = total
    values.total = total
    // values.amount_useForPayment = amountUseForPayment
    values.amtInExcess = amtInExcess
    values.amount_paid = amountReceived
    values.amount_refunded = amountRefunded
    // values.lstPurchasePaymentInvoiceDto = invoiceData
    // values.accepted = true
    values.vendor_name = selectedCust.firstName || selectedCustId.firstName
    // values.lastName = selectedCust.lastName || selectedCustId.lastName
    values.vendorId = selectedCust.id || selectedCustId.vendorId
    // values.desc = ''
    // values.title = ''
    values.paymentDate = moment(values.paymentDate).format('MM/DD/YYYY HH:mm:ss')
    values.payment_date = moment(values.paymentDate).format('MM/DD/YYYY HH:mm:ss')

    let method = 'post'
    if (params.id && !isEdit) {
      method = 'put'
      values.paymentNo = params.id
      values.id = paymentMaserData.id
    }

    if (trId && isEdit) {
      method = 'put'
      values.paymentNo = trId
      values.id = paymentMaserData.id
    }

    // values.email = user.email
    // console.log(values, 'values')
    const fetchData = async () => {
      const result = await PurchaseService.savePurchasePayment(values, method)
      if (params.bankId || reconcile) {
        this.setState(
          {
            isDirty: false,
          },
          () => closeModal(true),
        )
      } else {
        this.setState(
          {
            isDirty: false,
          },
          () => this.props.navigate('/purchase/payments'),
        )
      }
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

  // handleProduct = (e, record, from) => {
  //   const { dataSource, prodData, currentProdId } = this.state
  //   dataSource.forEach(element => {
  //     if (element.id === currentProdId.id) {
  //       Object.assign(element, record)
  //     }
  //   })
  //   this.setState(
  //     {
  //       dataSource,
  //     },
  //     () => this.handleChange(e, record, from),
  //   )
  // }

  handleChange = (e, record, keyName, index) => {
    // console.log(e, record, keyName, index, 'e record')

    const invoiceFormData = this.formRef.current.getFieldValue('lstPurchasePaymentInvoiceDto')
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

    this.formRef.current.setFieldsValue({ lstPurchasePaymentInvoiceDto: invoiceFormData })

    this.setState({
      total: Number(total).toFixed(selOrgData?.decimals),
      // invoiceData,
      amtInExcess: Number(amountReceived - total).toFixed(selOrgData?.decimals),
      amountReceived: Number(amountReceived).toFixed(selOrgData?.decimals),
      amountExceed: Number(amtExceed).toFixed(selOrgData?.decimals),
      // amountRefunded,
      amountUseForPayment: Number(total).toFixed(selOrgData?.decimals),
    })
  }

  passCustData = data => {
    // console.log(data, 'selected Date')
    const { selectedCust } = this.state
    // this.setState({
    //   selectedCust: data[0],
    // })

    const org = store.get('selectedOrg')

    const fetchCustData = async () => {
      // const result = await PurchaseService.getUnpaidInvoice(data[0].id)
      const result = await PurchaseService.getUnpaidInvoiceNew({
        id: data[0].id,
        orgCode: org.orgCode,
      })
      this.formRef.current.setFieldsValue({ lstPurchasePaymentInvoiceDto: result })

      // console.log(result, 'custResult')
      this.setState({
        selectedCust: data[0],
        selectedCustId: { vendorId: data[0].id },
        invoiceData: result,
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
    const invoiceFormData = this.formRef.current.getFieldValue('lstPurchasePaymentInvoiceDto')

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

      this.formRef.current.setFieldsValue({ lstPurchasePaymentInvoiceDto: invoiceFormData })
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
    const { params, closeModal, reconcile } = this.props

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
          <div className="form__content--css">
            <Row className="form__body-content pt-0 pb-0">
              <Col span={24} className="fs-13 text-uppercase mb-3">
                <span className="bulletIcon">Basic Information</span>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="vendorId"
                      label="Vendor Name"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please select vendors!',
                        },
                      ]}
                    >
                      <Select
                        // style={{ width: 240 }}
                        placeholder="Select Vendor"
                        value={custData.length ? selectedCustId : ''}
                        onChange={e => this.handleCompName(e)}
                        showSearch
                        optionFilterProp="children"
                        disabled={params.id && true}
                      >
                        {custData.map(item => (
                          <Option value={item.id} key={`${item.companyName}_${item.id}`}>
                            {`${item.firstName} ${item.lastName} (${item.companyName})`}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="paymentDate"
                      label="Payment Date"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please select date!',
                        },
                      ]}
                    >
                      {/* <Space direction="vertical" size={12}> */}
                      <DatePicker
                        style={{ width: '100%' }}
                        format="DD MMM YYYY HH:mm:ss"
                        disabled={!invoiceData.length && true}
                      />
                      {/* </Space> */}
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="amountPaid"
                      label="Amount Paid"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter amount!',
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        precision={selOrgData?.decimals}
                        onBlur={e => this.handleAmount(e)}
                        disabled={!invoiceData.length && true}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      className="form__input--label not--required--field"
                      name="paymentNo"
                      label="Payment #"
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="debitFrom"
                      label="Debit from"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please select!',
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        disabled={(params.bankId || !invoiceData.length) && true}
                      >
                        {chartOfAccount.map((item, index) => (
                          <Option value={item.accountid} key={item.accountid}>
                            {item.actname}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="paymentMode"
                      label="Payment Mode"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please select Payment mode!',
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        disabled={!invoiceData.length && true}
                      >
                        <Option value="Cash">Cash</Option>
                        <Option value="Bank Remittance">Bank Remittance</Option>
                        <Option value="Bank Transfer">Bank Transfer</Option>
                        <Option value="Debit/Credit Card">Debit/Credit Card</Option>
                        <Option value="Cheque">Cheque</Option>
                        <Option value="UPI">UPI</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="refference"
                      label="Refference"
                      className="form__input--label not--required--field"
                    >
                      <Input disabled={!invoiceData.length && true} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="taxDeducted"
                      label="Tax Deducted"
                      className="form__input--label not--required--field"
                    >
                      <Input disabled={!invoiceData.length && true} />
                    </Form.Item>
                  </Col>
                </Row>
                <hr />
              </Col>

              <Col span={24} className="fs-13 text-uppercase mb-3">
                <span className="bulletIcon">Unpaid Invoices</span>
              </Col>

              <Col span={24}>
                <Form.List name="lstPurchasePaymentInvoiceDto">
                  {(lstPurchasePaymentInvoiceDto, options) => {
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
                    <div className="col-md-5 text-end pt-2">{amountReceived}</div>
                    <div className="col-md-7 text-start ps-5 pt-2">Amount used for payments </div>
                    <div className="col-md-5 text-end pt-2">{amountUseForPayment}</div>
                    <div className="col-md-7 text-start ps-5 pt-2">Amount Refunded </div>
                    <div className="col-md-5 text-end pt-2">{amountRefunded}</div>
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
              {params.bankId || reconcile ? (
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
          </div></Form>

        {isModalVisible && (
          <Modal
            title="Purchase Invoice"
            visible={isModalVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={null}
            width={1000}
          >
            <PurchaseInvoiceDetails invoiceId={invoiceId} from="purchasePayment" />
          </Modal>
        )}
      </>
    )
  }
}

const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})




export default connect(mapStateToProps)(WithRouter(AddPurchasePayment));
