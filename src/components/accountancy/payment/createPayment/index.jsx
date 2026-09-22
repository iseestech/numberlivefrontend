import React, { useContext, useState, useEffect, useRef } from 'react'
import {
  Table,
  Popconfirm,
  Button,
  Input,
  Form,
  Select,
  Divider,
  Space,
  Checkbox,
  Modal,
  DatePicker,
  notification,
  Row,
  Col,
  InputNumber,
} from 'antd'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import { MenuOutlined, PlusOutlined } from '@ant-design/icons'
import { arrayMove } from "@dnd-kit/sortable";
import { Link, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import CreateProductModal from '@/components/accountancy/productsAndServices/createProductModal'
import CreateCustomer from '@/components/accountancy/contacts/createCustomer'
import ProductService from '@/services/products'
import CustomerService from '@/services/customer'
import ChartOfAccService from '@/services/chartOfAccount'
import InvoiceDetails from '@/components/accountancy/sales/invoices/invoiceDetails'
import BankService from '@/services/banking'

import QuotationService from '@/services/sales'
import HelperFunction from '@/services/helper'
import store from 'store'
import axios from 'axios'
import { history } from '@/main'
import WithRouter from '@/WithRouter'
// import './index.scss'

const selOrgData = store.get('selectedOrg')
const { TextArea } = Input
const { Option } = Select
const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
))

const temp = 0

const SortableItem = sortableElement(props => <tr className="temp" {...props} />)
const SortableContainer = sortableContainer(props => <tbody {...props} />)

const children = [{ name: 'test1' }, { name: 'test2' }]
const LoadCon = props => {
  const { custData, handleShowHide, passCustData, selectedCustId, isDisable } = props
  const addItem = () => {}
  // const selectedValue =
  // console.log(selectedCustId, 'selectedCustId', custData)
  const handleCompName = e => {
    const data = custData
    const selected = data.filter(item => item.customer_id === parseInt(e, 10))
    // console.log(e, 'handleCompName', selected, data)
    passCustData(selected)
  }
  return (
    <Select
      disabled={isDisable}
      style={{ width: 240 }}
      placeholder="Select/Add Customer"
      value={custData.length ? selectedCustId : ''}
      onChange={e => handleCompName(e)}
      popupRender={menu => (
        <div>
          <Divider style={{ margin: '4px 0' }} />
          {/* <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
            <Button
              onClick={() => {
                handleShowHide()
              }}
              role="button"
            >
              <PlusOutlined /> Add Customer
            </Button>
          </div> */}

          {menu}
        </div>
      )}
    >
      {custData.map(item => (
        <Option value={item.customer_id} key={`${item.company_name}_${item.customer_id}`}>
          {`${item.customer_fname} ${item.customer_lname} (${item.company_name})`}
        </Option>
      ))}
    </Select>
  )
}
class CreatePayment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDirty: false,

      items: [
        { name: 'jack', key: 1 },
        { name: 'lucy', key: 2 },
      ],
      amtInExcess: 0.0,
      amountReceived: 0.0,
      amountRefunded: 0.0,
      amountUseForPayment: 0.0,
      payment: 0.0,
      defaultData: [],
      selectedCust: {},
      custData: [],
      // prodData: [],
      total: 0.0,
      taxValue: 'No Tax',
      selectedCustId: {},
      subTotal: 0,
      custName: '',
      name: '',
      count: 4,
      action: 'Create',
      isVisible: false,
      visible: false,
      isShown: false,
      paymentDate: HelperFunction.getCurrentDate(),
      expiryDate: '2021/01/01',
      dataSource: [],
      invoiceData: [],
      chartOfAccount: [],
      masterData: {},
      amountExceed: false,
      isModalVisible: false,
      invoiceId: '',
      columns: [
        // {
        //   title: 'Date',
        //   dataIndex: 'date',
        //   width: 30,
        //   className: 'drag-visible',
        //   render: () => <DragHandle />,
        //   responsive: ['xs', 'sm'],
        // },
        // {
        //   title: '#',
        //   dataIndex: 'key',
        //   key: 'key',
        //   render: (text, record, index) => index + 1,
        // },
        {
          title: 'Invoice Date',
          dataIndex: 'invoiceDate',
          responsive: ['xs', 'sm'],
          render: (key, record) => <span>{record.invoiceDate}</span>,
        },
        {
          title: 'Invoice Number',
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
          title: 'Region',
          dataIndex: 'centerName',
          responsive: ['xs', 'sm'],
          render: (key, record) => <span>{record.centerName}</span>,
        },
        {
          title: 'Invoice Amount',
          dataIndex: 'invoiceAmount',
          responsive: ['xs', 'sm'],
          render: (key, record) => <span>{record.invoiceAmount}</span>,
        },
        {
          title: 'Amount  Due',
          dataIndex: 'invoice_due_amount',
          responsive: ['xs', 'sm'],
          render: (key, record) => <span>{record.invoice_due_amount || 0}</span>,
        },
        {
          title: 'Payment',
          dataIndex: 'salePayment',
          responsive: ['xs', 'sm'],
          render: (key, record) => (
            <InputNumber
              onKeyDown={HelperFunction.isValidNumber}
              placeholder="Enter Payment"
              name="salePayment"
              style={{ width: '100px' }}
              precision={selOrgData?.decimals}
              // onChange={e => this.handleCalculation(e, record)}
              onBlur={e => this.handleChange(e, record)}
              defaultValue={record.salePayment}
            />
          ),
        },
        // {
        //   title: 'Discount',
        //   dataIndex: 'sale_discount',
        //   responsive: ['xs', 'sm'],
        //   render: (key, record) => (
        //     <Input
        //       placeholder="Enter discount"
        //       name="sale_discount"
        //       defaultValue={record.sale_discount}
        //       onBlur={e => this.handleChange(e, record)}
        //     />
        //   ),
        // },
        // {
        //   title: 'Account',
        //   responsive: ['xs', 'sm'],
        //   dataIndex: 'sale_account',
        //   render: (key, record) => (
        //     <Input
        //       name="sale_account"
        //       placeholder="Enter Account"
        //       defaultValue={record.sale_account}
        //     />
        //   ),
        // },
        // {
        //   title: 'Tax rate',
        //   responsive: ['xs', 'sm'],
        //   dataIndex: 'sale_tax_rate',
        //   render: (key, record) => (
        //     <Input
        //       placeholder="Enter Tax rate"
        //       defaultValue={record.sale_tax_rate}
        //       name="sale_tax_rate"
        //       onBlur={e => this.handleChange(e, record)}
        //     />
        //   ),
        // },
        // {
        //   title: 'Amount',
        //   responsive: ['xs', 'sm'],
        //   dataIndex: 'sale_amount',
        //   render: (key, record) => (
        //     <Input placeholder="Enter Amount" defaultValue={record.sale_amount} disabled />
        //   ),
        // },
      ],
    }
    // This binding is necessary to make `this` work in the callback
    this.onFinish = this.onFinish.bind(this)
    this.onFinishFailed = this.onFinishFailed.bind(this)
    this.formRef = React.createRef()
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
    const selected = custData.filter(item => item.customer_id === parseInt(e, 10))
    // console.log(e, 'handleCompName', selected, data)
    this.passCustData(selected)
  }

  // fetchChartOfAccount = () => ChartOfAccService.listAllAccounts('ALL')

  // fetchChartOfAccount = () => ChartOfAccService.listAllAccounts('ALL')
  fetchChartOfAccount = org => BankService.bankList(org.orgCode)

  fetchCustData = () => CustomerService.customerList()

  // fetchProdData = () => ProductService.productList()

  componentDidMount = () => {
    // this.formRef.current.setFieldsValue({ inExpiryDate: "2022/12/10" })
    // console.log('this.formRef.current.', this.formRef.current)
    // let prodResult = []
    // let custResult = []
    const { params, trId, isEdit } = this.props
    const org = store.get('selectedOrg')
    if (params.id) {
      this.fetchInvoiceData(params.id)
    } else if (params.bankId) {
      if (isEdit) {
        this.fetchInvoiceData(trId)
      } else {
        this.setState(
          {
            defaultData: [{ name: 'deposit_to', value: Number(params.bankId) }],
          },
          () => this.getAllData(),
        )
      }
    } else {
      this.getAllData()
    }
    window.addEventListener('beforeunload', this.handleBeforeUnload)
  }

  getAllData = async () => {
    const org = store.get('selectedOrg')
    const [chartOfAccount, custData] = await axios.all([
      // this.fetchProdData(),
      this.fetchChartOfAccount(org),
      this.fetchCustData(),
    ])

    // prodData.data.forEach((ele, i) => {
    //   ele.key = i + 1
    // })

    // console.log(chartOfAccount, '&& chartOfAccount.data')
    this.setState({
      // prodData: prodData.data || [],
      custData: custData || [],
      chartOfAccount: chartOfAccount || [],
    })
  }

  fetchInvoiceData = async id => {
    const result = await QuotationService.getSalesPayment(id, 'post')
    // console.log(result, 'invoiceId result')
    // getQuotation(result ? result.data : [])
    const resultData = result.data || []
    const data = []
    // console.log(resultData, 'resultData.length')
    if (resultData.id) {
      _.forEach(resultData, (val, key) => {
        if (key !== 'saleInvoiceDto')
          data.push({
            name: [key],
            value: key === 'paymentDate' || key === 'payment_date' ? moment(val) : val,
          })
      })
      this.setState(
        {
          masterData: resultData,
          defaultData: data,
          dataSource: resultData.saleInvoiceDto,
          invoiceData: resultData.saleInvoiceDto,
          action: 'Update',
          amtInExcess: resultData.amtInExcess,
          amountReceived: resultData.amount_received,
          amountRefunded: resultData.amount_refunded,
          amountUseForPayment: resultData.amount_useForPayment,
          total: resultData.total,
          expiryDate: resultData.expiryDate,
          paymentDate: resultData.payment_date || HelperFunction.getCurrentDate(),
          selectedCustId: {
            customerId: resultData.customer_id,
            firstName: resultData.firstName,
            lastName: resultData.lastName,
          },
        },
        () => this.getAllData(),
      )
    }
  }

  formValuesChange = e => {
    const isDirty = Object.keys(e).length && true
    this.setState({ isDirty })
  }

  // showModal = (e, record) => {
  //   // console.log(e, record, 'e, record')
  //   const { visible } = this.state
  //   this.setState({
  //     visible: !visible,
  //     currentProdId: record,
  //   })
  // }

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

  onFinish = values => {
    const {
      dataSource,
      paymentDate,
      expiryDate,
      selectedCust,
      sub_total: subTotal,
      total,
      selectedCustId,
      amtInExcess,
      amountReceived,
      amountRefunded,
      payment,
      amountUseForPayment,
      invoiceData,
      masterData,
      amountExceed,
    } = this.state
    // console.log(values, 'values')
    const { params, user, closeModal, trId, isEdit, reconcile } = this.props
    // values.productDto = dataSource
    if (amtInExcess !== 0) {
      return notification.error({
        message: 'Error',
        description:
          'The amount entered for invoice(s) exceeds the total payment made from the customer. The Amount in excess diff should be 0.',
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
    values.amount_useForPayment = amountUseForPayment
    values.amtInExcess = amtInExcess
    values.amount_received = parseFloat(amountReceived)
    values.amount_refunded = amountRefunded
    values.saleInvoiceDto = invoiceData
    // values.sub_total = subTotal
    values.total = total
    values.customer_name = selectedCust.customer_fname || selectedCustId.firstName
    // values.lastName = selectedCust.customer_lname || selectedCustId.lastName
    values.customer_id = selectedCust.customer_id || selectedCustId.customerId
    // values.desc = ''
    // values.title = ''
    values.payment_date = moment(document.getElementById('payment_date').value).format(
      'MM/DD/YYYY HH:mm:ss',
    )

    // values.expiryDate = new Date(expiryDate)
    // values.amount = 0
    // values.currency = 0
    // values.accepted = true
    // const prodId = []
    // dataSource.forEach(item => {
    //   prodId.push(item.id)
    // })
    // console.log(prodId)
    // values.product_id = prodId.toString()
    values.id = 0
    let method = 'post'
    if (params.id && !isEdit) {
      method = 'put'
      values.id = masterData.id
      values.paymentNo = params.id
    }

    if (trId && isEdit) {
      values.id = masterData.id
      method = 'put'
      values.paymentNo = trId
    }
    // values.email = user.email
    // console.log(values, 'values')
    const fetchData = async () => {
      const result = await QuotationService.saveSalesPayment(values, method)
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
          () => this.props.naviagte('/sales/payments'),
        )
      }
    }
    // return false
    return fetchData()
  }

  onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo)
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { dataSource } = this.state
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter(el => !!el)
      // console.log('Sorted items: ', newData)
      this.setState({ dataSource: newData })
    }
  }

  // handleName = (e, record) => {
  //   // console.log(e, record)
  //   const { dataSource, prodData } = this.state
  //   let prodItem = []
  //   dataSource.forEach(element => {
  //     if (element.id === record.id) {
  //       prodItem = prodData.filter(item => item.id === parseInt(e.value, 10))
  //       Object.assign(element, prodItem[0])
  //       element = e.label
  //     }
  //   })
  //   this.setState(
  //     {
  //       dataSource,
  //     },
  //     () => this.handleChange(e, prodItem[0]),
  //   )
  // }

  handleDescription = (e, record) => {
    const { dataSource } = this.state
    // console.log(e.target.name, e.target.value)
    // console.log(element,record)
    dataSource.forEach(element => {
      // console.log(element, record)
      if (element.id === record.id) {
        // prodItem = prodData.filter(item => item.id === parseInt(e.value, 10))
        // Object.assign(element, prodItem[0]);
        // element = e.label;
      }
    })

    this.setState({
      dataSource,
    })
  }

  handleChangeBk = (e, record, fieldName) => {
    // console.log(record, 'handleChange', e)
    const { dataSource } = this.state
    let amount = 0
    let total = 0
    let subTotal = 0
    let name = ''
    let value = ''
    if (e.value && e.value.length) {
      const { value: val } = e
      name = 'productName'
      value = val
    } else if (fieldName === 'productForm') {
      const { value: val } = e
      name = 'productName'
      value = val
    } else if (fieldName === 'sale_tax_rate') {
      const { value: val } = e
      name = 'sale_tax_rate'
      value = val
    } else {
      const { value: val, name: nameVal } = e.target
      name = nameVal
      value = val
    }
    dataSource.forEach(element => {
      if (element.id === record.id) {
        // console.log(name, 'e.target')
        element[name] = Number(value)
        let { sale_amount: sum, sale_discount: discount, sale_tax_rate: taxRate } = record
        const { sale_unit_price: unitPrice, sale_qty: quantity } = record

        if (name === 'sale_discount') {
          discount = Number(value)
          // console.log(discount, 'discount999999999', sum)
          sum = quantity * unitPrice
        } else if (name === 'sale_tax_rate') {
          taxRate = Number(value)
          sum = quantity * unitPrice
        } else if (name === 'productName') {
          // console.log('value', value)
          // console.log(record, 'productName in')
          sum = quantity * unitPrice
        } else {
          const currentField = ['sale_qty', 'sale_unit_price']
          _.remove(currentField, item => item === name)
          sum = _.reduce(
            currentField,
            (i, n) => {
              return Number(element[n]) * i
            },
            1,
          )
          sum = Number(value) * Number(sum)
        }

        discount *= sum / 100
        // console.log(discount, '999999', quantity)
        const taxable = sum - discount
        const tax = (taxable / 100) * taxRate
        // console.log(discount, 'discount', sum, 'sum', taxable, tax, taxRate)
        amount = taxable + tax
        element.sale_amount = amount
        // console.log(amount, 'amount')
      } else {
        total += parseFloat(element.sale_amount)
        subTotal += parseFloat(element.sale_amount)
      }
    })

    total += parseFloat(amount)
    subTotal += parseFloat(amount)
    this.setState({
      dataSource,
      total,
      subTotal,
    })
  }

  // handleCalculation = (e, record) => {
  //   // console.log(record, 'handleCalculation', value)
  //   const { dataSource } = this.state

  //   dataSource.forEach(element => {
  //     if (element.key === record.key) {
  //       element[e.target.name] = e.target.value
  //     }
  //   })

  //   this.setState({
  //     dataSource,
  //   })
  // }

  // DraggableBodyRow = ({ className, style, ...restProps }) => {
  //   const { dataSource } = this.state
  //   // console.log('temp', dataSource)
  //   // function findIndex base on Table rowKey props and should always be a right array index
  //   const index = dataSource.findIndex(x => x.index === restProps['data-row-key'])
  //   return <SortableItem index={index} {...restProps} />
  // }

  handleDelete = record => {
    const { dataSource, total, subTotal } = this.state
    this.setState({
      dataSource: dataSource.filter(item => item.key !== record.key),
      total: total - record.amount,
      subTotal: subTotal - record.amount,
    })
  }

  handleShowHide = () => {
    const { isVisible } = this.state
    this.setState({
      isVisible: !isVisible,
    })
  }

  handleAdd = () => {
    const { count, dataSource } = this.state
    const newData = {
      key: count,
      index: count,
      description: '',
      id: count,
      image: '',
      imageId: '',
      minimum: 0,
      name: '',
      price: 0,
      product_code: 0,
      purchase: true,
      purchase_account: 0,
      purchase_desc: '',
      purchase_tax_rate: 0,
      purchase_unit_price: 0,
      quanitities_in_cart: 0,
      quantity: 0,
      sale_qty: 0,
      rating: 0,
      sale_account: 0,
      sale_desc: '',
      sale_tax_rate: 0,
      sale_unit_price: 0,
      sales: true,
      special: true,
      stock: true,
      tax: 0,
      thumb: '',
      thumbId: '',
      purchase_amount: 0,
      purchase_discount: 0,
      sale_amount: '',
      sale_discount: '',
    }
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    })
  }

  handleStDate = (date, dateString) => {
    // console.log(date, dateString, ' date, dateString')

    // const {estimateDate} = this.state
    // const val = moment(dateString).tz('Asia/Calcutta').format();
    if (date) {
      this.setState({
        paymentDate: date ? dateString : '',
      })
    }
  }

  handleExDate = (date, dateString) => {
    // console.log(date, dateString, ' date, dateString')
    // const {estimateDate} = this.state
    // const val = moment(dateString).tz('Asia/Calcutta').format();
    this.setState({
      expiryDate: dateString,
    })
  }

  onNameChange = event => {
    // console.log(event.target, 'temp', event.target)
    this.setState({
      custName: event.target.value,
    })
  }

  addItem = () => {
    // console.log('addItem')
    const { custData, custName } = this.state
    const val = temp + 1

    this.setState({
      custData: [
        ...custData,
        { name: custName, key: custData.length + 1 } || {
          name: `New item ${val}`,
          key: custData.length + 1,
        },
      ],
      custName: '',
    })
  }

  passCustData = data => {
    // console.log(data, 'selected Date')
    const org = store.get('selectedOrg')

    const { selectedCust } = this.state
    const fetchCustData = async () => {
      const result = await QuotationService.getUnpaidInvoice(data[0].customer_id, org.orgCode)
      // console.log(result, 'custResult')
      this.setState({
        selectedCust: data[0],
        selectedCustId: { customerId: data[0].customer_id },
        invoiceData: result,
      })
    }
    fetchCustData()
    // this.setState({
    //   selectedCust: data[0],
    //   selectedCustId: { customerId: data[0].customer_id },
    // })
  }

  handleTax = value => {
    // console.log(value, 'value')
    this.setState({
      taxValue: value,
    })
  }

  handleAmount = e => {
    // console.log(e.target.value, '8787878')
    this.setState(
      {
        amountReceived: e.target.value,
        amountExceed: false,
      },
      () => this.handleCalculation(),
    )
  }

  handleChange = (e, record) => {
    // console.log(e.target.value, record, 'e record')
    const { invoiceData } = this.state
    let total = 0
    const { amountReceived, amountExceed } = this.state
    let amtExceed = amountExceed

    invoiceData.forEach(ele => {
      // console.log(ele.id, 'eleID')
      if (ele.id === record.id) {
        // console.log('in If')
        ele.salePayment = Number(e.target.value)
        total += Number(e.target.value) || 0
        amtExceed = ele.salePayment > ele.invoice_due_amount && true
      } else {
        total += ele.salePayment || 0
      }
    })

    // console.log(invoiceData, 'invoiceData')
    this.setState({
      invoiceData,
      total: Number(total).toFixed(selOrgData?.decimals),
      amtInExcess: Number(amountReceived - total).toFixed(selOrgData?.decimals),
      amountReceived: Number(amountReceived).toFixed(selOrgData?.decimals),
      amountExceed: Number(amtExceed).toFixed(selOrgData?.decimals),
      // amountRefunded,
      amountUseForPayment: Number(total).toFixed(selOrgData?.decimals),
    })
  }

  handleCalculation = key => {
    let total = 0
    let amtInExcess = 0
    let amountUseForPayment = 0
    const { invoiceData, amountRefunded, amountReceived } = this.state
    let userAmount = amountReceived

    invoiceData.forEach(ele => {
      // console.log(total, ele, 'ele')
      const { invoiceAmount: saleAmount, invoice_due_amount: invoiceDueAmount } = ele
      // console.log(userAmount, 'userAmpunt', saleAmount)
      if (userAmount >= invoiceDueAmount) {
        // console.log('idblock', ele.salePayment)
        ele.salePayment =
          key === 'payment' ? Number(ele.salePayment) : invoiceDueAmount || invoiceDueAmount
        total += ele.salePayment
        amountUseForPayment += ele.salePayment
        userAmount -= invoiceDueAmount || invoiceDueAmount
      } else if (userAmount > 0) {
        // console.log(total, 'else if block', userAmount, ele.salePayment)
        ele.salePayment = key === 'payment' ? Number(ele.salePayment) : Number(userAmount)
        userAmount -= invoiceDueAmount || invoiceDueAmount
        total += Number(ele.salePayment)
        amountUseForPayment += ele.salePayment
      } else {
        ele.salePayment = 0
        // total += total
        // amountUseForPayment += total
        // userAmount =
        // console.log('else block')
      }
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
      invoiceData,
      dataSource,
      columns,
      items,
      custData,
      name,
      custName,
      isVisible,
      visible,
      isShown,
      paymentDate,
      expiryDate,
      defaultData,
      taxValue,
      action,
      selectedCustId,
      amtInExcess,
      amountReceived,
      amountRefunded,
      amountUseForPayment,
      total,
      subTotal,
      payment,
      chartOfAccount,
      isDirty,
      isModalVisible,
      invoiceId,
    } = this.state
    // console.log(expiryDate, 'expiryDate----------- ')
    const exDateVal = expiryDate
    const { params, closeModal, reconcile } = this.props

    // const routeName = path.split('/')
    // const DraggableContainer = props => (
    //   <SortableContainer
    //     useDragHandle
    //     helperClass="row-dragging"
    //     onSortEnd={this.onSortEnd}
    //     {...props}
    //   />
    // )

    return (
      <>
        {/* <Modal
          title="Add Customer"
          onOk={() => this.setState({ isVisible: !isVisible })}
          onCancel={() => this.setState({ isVisible: !isVisible })}
          visible={isVisible}
          className="customerModal"
          okText="Add Product"
          style={{ width: '700px' }}
        >
          <CreateCustomer />
        </Modal> */}
        <Form
          className="form__layout--css"
          layout="horizontal"
          fields={defaultData}
          onFinish={this.onFinish}
          ref={this.formRef}
          onFinishFailed={this.onFinishFailed}
          onValuesChange={this.formValuesChange}
        >
          <Row className="mb-3 form__header--css">
            <Col span={20} style={{ fontSize: '18px' }}>
              {params?.id ? <span>Edit: {params?.id}</span> : 'New Sales Payment'}
            </Col>
            <Col span={4} className="text-end">
              <Button type="default" className="text-center me-2" htmlType="submit">
                <Link to="/sales/payments">Cancel</Link>
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
          </Row>
          <div className="form__content--css p-0">
            <Row className="form__body-content">
              <Col span={24} className="fs-13 text-uppercase mb-3">
                <span className="bulletIcon">Basic Information</span>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="customerId"
                      label="Customer Name"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please select customer',
                        },
                      ]}
                    >
                      {/* <LoadCon
                  isDisable={action === 'Update' && true}
                  custData={custData}
                  handleShowHide={this.handleShowHide}
                  passCustData={this.passCustData}
                  selectedCustId={selectedCustId.customerId}
                /> */}
                      <Select
                        // style={{ width: 240 }}
                        placeholder="Select Customer"
                        value={custData.length ? selectedCustId : ''}
                        onChange={e => this.handleCompName(e)}
                        showSearch
                        optionFilterProp="children"
                        popupRender={menu => (
                          <div>
                            <Divider style={{ margin: '4px 0' }} />
                            {/* <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                        <Button
                          onClick={() => {
                            this.handleShowHide()
                          }}
                          role="button"
                        >
                          <PlusOutlined /> Add Customer
                        </Button>
                      </div> */}
                            {menu}
                          </div>
                        )}
                      >
                        {custData.map(item => (
                          <Option
                            value={item.customer_id}
                            key={`${item.company_name}_${item.customer_id}`}
                          >
                            {`${item.customer_fname} ${item.customer_lname} (${item.company_name})`}
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
                      name="payment_date"
                      label="Payment Date"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please select date',
                        },
                      ]}
                    >
                      <DatePicker
                        style={{ width: '100%' }}
                        format="DD MMM YYYY HH:mm:ss"
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
                      name="amount_received"
                      label="Amount Received"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter amount',
                        },
                      ]}
                    >
                      {/* <Input
                        onBlur={e => this.handleAmount(e)}
                        disabled={!invoiceData.length && true}
                      /> */}
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
                      name="id"
                      className="form__input--label not--required--field"
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
                      name="deposit_to"
                      label="Deposit To"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please select account',
                        },
                      ]}
                    >
                      {/* <Input /> */}
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
                      name="payment_mode"
                      label="Payment Mode"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please select account',
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
                        {/* {chartOfAccount.map((item, index) => (
                    <Option value={item.id} key={item.id}>
                      {item.actName}
                    </Option>
                  ))} */}
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
                      name="reference"
                      label="Reference"
                      className="form__input--label not--required--field"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Please enter Reference',
                      //   },
                      // ]}
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
                      name="tax_deducted"
                      label="Tax Deducted"
                      className="form__input--label not--required--field"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Please enter tax',
                      //   },
                      // ]}
                    >
                      <Input type="number" disabled={!invoiceData.length && true} />
                    </Form.Item>
                  </Col>
                </Row>
                <hr />
              </Col>

              {/* <div className="col-md-2">
              <Form.Item name="piNumber" label="PI Number">
                <Input />
              </Form.Item>
            </div> */}

              <Col span={24} className="fs-13 text-uppercase mb-3">
                <span className="bulletIcon">Unpaid Invoices</span>
              </Col>
              <Col span={24}>
                <Table
                  className="tableForm form__table--field"
                  pagination={false}
                  dataSource={invoiceData}
                  columns={columns}
                  rowKey="id"
                  components={{
                    body: {
                      // wrapper: DraggableContainer,
                      // row: this.DraggableBodyRow,
                    },
                  }}
                  // scroll={{ x: 691 }}
                  summary={pageData => {
                    const dueAmt = pageData.reduce(
                      (sum, record) => sum + record.invoice_due_amount,
                      0,
                    )
                    return (
                      <>
                        <Table.Summary.Row
                          className="ant-table-footer"
                          style={{
                            fontWeight: 'bold',
                          }}
                        >
                          <Table.Summary.Cell>Total Amount Due</Table.Summary.Cell>
                          <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                          <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                          <Table.Summary.Cell>{dueAmt}</Table.Summary.Cell>
                          <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                        </Table.Summary.Row>
                      </>
                    )
                  }}
                />
              </Col>

              <Col span={10} offset={14} className="mt-3 total__section">
                <div className="total__section--con">
                  <Row>
                    <div className="col-md-7 text-start ps-5 pt-2">Amount Received</div>
                    <div className="col-md-5 text-end pt-2">{amountReceived}</div>
                    <div className="col-md-7 text-start ps-5 pt-2">Amount used for payments</div>
                    <div className="col-md-5 text-end pt-2">{amountUseForPayment}</div>
                    <div className="col-md-7 text-start ps-5 pt-2">Amount Refunded</div>
                    <div className="col-md-5 text-end pt-2">{amountRefunded}</div>
                    <div className="col-md-7 text-start ps-5 pt-2"> Amount in excess</div>
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
                <Form.Item name="emailSend" label={null} valuePropName="checked">
                  {/* <Group options={optionsWithPurchase} /> */}
                  <Checkbox>Email a &quot;thank you&quot; note for this payment</Checkbox>
                </Form.Item>
              </div>
            </Row>
            <hr />

            <div className="text-end pb-3">
              {params.bankId || reconcile ? (
                <Button type="default" className="text-center me-2" onClick={() => closeModal()}>
                  Cancel
                </Button>
              ) : (
                <Button type="default" className="text-center me-2" htmlType="submit">
                  <Link to="/sales/invoices">Cancel</Link>
                </Button>
              )}
              <Button type="primary" className="text-center me-3" htmlType="submit">
                {action}
              </Button>
            </div>
          </div>

          {/* </Row> */}
          {/* <CreateProductModal
            headingText="Create Product And Service"
            visible={visible}
            productId=""
            // loadData={loadData}
            // productData={}
            handleChange={this.handleProduct}
            showModal={this.showModal}
            isOutside
          /> */}</Form>
        {isModalVisible && (
          <Modal
            title="Purchase Invoice"
            visible={isModalVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={null}
            width={1000}
          >
            <InvoiceDetails invoiceId={invoiceId} from="salePayment" />
          </Modal>
        )}
      </>
    )
  }
}

const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})

export default connect(mapStateToProps)(WithRouter(CreatePayment))


