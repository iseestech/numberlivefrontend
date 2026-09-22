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
  Row,
  Col,
  Tabs,
} from 'antd'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import { MenuOutlined, PlusOutlined } from '@ant-design/icons'
// import { arrayMove } from "@dnd-kit/sortable";
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import axios from 'axios'
import CreateCustomer from '@/components/accountancy/contacts/createCustomer'
import ProductService from '@/services/products'
import ChartOfAccService from '@/services/chartOfAccount'
import CustomerService from '@/services/customer'
import QuotationService from '@/services/sales'
import HelperFunction from '@/services/helper'
import { history } from '@/main'
// import './index.scss'

const { TabPane } = Tabs

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
class CreatePurchasePayment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
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
      chartOfAccount: [],
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
      columns: [
        // {
        //   title: 'Date',
        //   dataIndex: 'date',
        //   width: 30,
        //   className: 'drag-visible',
        //   render: () => <DragHandle />,
        //   responsive: ['xs', 'sm'],
        // },
        {
          title: 'Invoice Date',
          dataIndex: 'estimateDate',
          responsive: ['xs', 'sm'],
          render: (key, record) => <span>{record.estimateDate}</span>,
        },
        {
          title: 'Invoice Number',
          dataIndex: 'invoiceNo',
          responsive: ['xs', 'sm'],
          render: (key, record) => <span>{record.invoiceNo}</span>,
        },
        {
          title: 'Invoice Amount',
          dataIndex: 'amount',
          responsive: ['xs', 'sm'],
          render: (key, record) => <span>{record.amount}</span>,
        },
        {
          title: 'Amount  Due',
          dataIndex: 'invoiceDueAmount',
          responsive: ['xs', 'sm'],
          render: (key, record) => <span>{record.invoiceDueAmount || 0}</span>,
        },
        {
          title: 'Payment',
          dataIndex: 'salePayment',
          responsive: ['xs', 'sm'],
          render: (key, record) => (
            <Input
              placeholder="Enter Payment"
              name="salePayment"
              style={{ width: '100px' }}
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

  fetchChartOfAccount = () => ChartOfAccService.listAllAccounts('ALL')

  fetchCustData = () => CustomerService.customerList()

  // fetchProdData = () => ProductService.productList()

  componentDidMount = () => {
    // this.formRef.current.setFieldsValue({ inExpiryDate: "2022/12/10" })
    // console.log('this.formRef.current.', this.formRef.current)

    const { match } = this.props

    const getAllData = async () => {
      const [chartOfAccount, custData] = await axios.all([
        // this.fetchProdData(),
        this.fetchChartOfAccount(),
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

    // const fetchProdData = async () => {
    //   prodResult = await ProductService.productList()
    //   // console.log(prodResult, 'result')
    //   if (prodResult && prodResult.data.length) {
    //     prodResult.data.forEach((ele, i) => {
    //       ele.key = i + 1
    //     })
    //     // getProductList(result.data);
    //     this.setState({ prodData: prodResult.data }, () => fetchCustData())
    //   }
    // }

    // const fetchCustData = async () => {
    //   custResult = await CustomerService.customerList()
    //   // console.log(custResult, 'custResult')
    //   this.setState({ custData: custResult })
    // }

    if (match.params.invoiceId) {
      // console.log(match.params.invoiceId, '(match.params.invoiceId', match.params.id)
      const fetchInvoiceData = async () => {
        const result = await QuotationService.getSalesPayment(match.params.invoiceId, 'post')
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
                value: key === 'estimateDate' || key === 'expiryDate' ? moment(val) : val,
              })
          })
          this.setState(
            {
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
            () => getAllData(),
          )
        }
      }
      fetchInvoiceData()
    } else {
      getAllData()
    }
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
    } = this.state
    // console.log(values, 'values')
    const { match, user } = this.props
    // console.log('dataSource 123', match)
    // values.productDto = dataSource
    values.amount_useForPayment = amountUseForPayment
    values.amtInExcess = amtInExcess
    values.amount_received = amountReceived
    values.amount_refunded = amountRefunded
    values.saleInvoiceDto = invoiceData
    // values.sub_total = subTotal
    values.total = total
    values.customer_name = selectedCust.customer_fname || selectedCustId.firstName
    // values.lastName = selectedCust.customer_lname || selectedCustId.lastName
    values.customer_id = selectedCust.customer_id || selectedCustId.customerId
    // values.desc = ''
    // values.title = ''
    values.payment_date = new Date(paymentDate)
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
    if (match.params.id) {
      method = 'put'
      values.id = match.params.id
    }
    // values.email = user.email
    // console.log(values, 'values')
    const fetchData = async () => {
      const result = await QuotationService.saveSalesPayment(values, method)
      history.push('/sales/payments')
    }

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
    const { selectedCust } = this.state
    const fetchCustData = async () => {
      const result = await QuotationService.getUnpaidInvoice(2)
      // console.log(result, 'custResult')
      this.setState({
        selectedCust: data[0],
        selectedCustId: { customerId: data[0].customer_id },
        invoiceData: result.data,
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
      },
      () => this.handleCalculation(),
    )
  }

  handleChange = (e, record) => {
    // console.log(e.target.value, record, 'e record')
    const { invoiceData } = this.state
    invoiceData.forEach(ele => {
      // console.log(ele.id, 'eleID')
      if (ele.id === record.id) {
        // console.log('in If')
        ele.salePayment = Number(e.target.value)
      }
    })

    // console.log(invoiceData, 'invoiceData')
    this.setState(
      {
        invoiceData,
      },
      () => this.handleCalculation('payment'),
    )
  }

  handleCalculation = key => {
    let total = 0
    let amtInExcess = 0
    let amountUseForPayment = 0
    const { invoiceData, amountRefunded, amountReceived } = this.state
    let userAmount = amountReceived
    // let useAmt = 0
    // let lastUseAmt = 0;
    //  let excessAmt = 0;
    // const getAmount = (value) => {
    //   if(userAmount === 0) {
    //     return false
    //   }
    //   if(userAmount >= value) {
    //     userAmount -=  value
    //     useAmt += value;
    //   }else if (userAmount == value) {

    //   }else {

    //   }

    //   return true;
    // }
    invoiceData.forEach(ele => {
      // console.log(total, ele, 'ele')
      const { amount: saleAmount, invoiceDueAmount } = ele
      // console.log(userAmount, 'userAmpunt', saleAmount)
      if (userAmount >= saleAmount) {
        // console.log('idblock', ele.salePayment)
        ele.salePayment =
          key === 'payment' ? Number(ele.salePayment) : invoiceDueAmount || saleAmount
        total += ele.salePayment
        amountUseForPayment += ele.salePayment
        userAmount -= invoiceDueAmount || saleAmount
      } else if (userAmount > 0) {
        // console.log(total, 'else if block', userAmount, ele.salePayment)
        ele.salePayment = key === 'payment' ? Number(ele.salePayment) : Number(userAmount)
        userAmount -= invoiceDueAmount || saleAmount
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
      chartOfAccount,
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
    } = this.state
    // console.log(expiryDate, 'expiryDate----------- ')
    const exDateVal = expiryDate
    const { match } = this.props
    const routeName = match.path.split('/')
    const DraggableContainer = props => (
      <SortableContainer
        useDragHandle
        helperClass="row-dragging"
        onSortEnd={this.onSortEnd}
        {...props}
      />
    )

    return (
      <>
        <Tabs defaultActiveKey="1" className="antd__tab--content">
          <TabPane tab="Purchase Payment" key="1">
            <Form
              className="form__layout--css"
              layout="horizontal"
              fields={defaultData}
              onFinish={this.onFinish}
              ref={this.formRef}
              onFinishFailed={this.onFinishFailed}
            >
              <Row className="mb-3 form__header--css">
                <Col span={20} style={{ fontSize: '18px' }}>
                  {match?.params?.purchaseId ? (
                    <span>Edit: {match?.params?.purchaseId}</span>
                  ) : (
                    'New Purchase Invoice'
                  )}
                </Col>
                <Col span={4} className="text-end">
                  <Button type="default" className="text-center me-2" htmlType="submit">
                    <Link to="/purchase/invoices">Cancel</Link>
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
              <div className="form__content--css">
                <Row className="form__body-content">
                  <Col span={24} className="fs-13 text-uppercase mb-3">
                    <span className="bulletIcon">Basic Information</span>
                  </Col>
                  <Col span={24}>
                    <Row>
                      <Col span={11}>
                        <Form.Item name="customerId" label="Customer Name">
                          <LoadCon
                            isDisable={action === 'Update' && true}
                            custData={custData}
                            handleShowHide={this.handleShowHide}
                            passCustData={this.passCustData}
                            selectedCustId={selectedCustId.customerId}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row>
                      <Col span={11}>
                        <Form.Item name="payment_date" label="Payment Date">
                          <Space direction="vertical" size={12}>
                            <DatePicker
                              onChange={this.handleStDate}
                              defaultValue={moment(paymentDate, 'YYYY/MM/DD')}
                              format="YYYY/MM/DD"
                              value={moment(paymentDate, 'YYYY/MM/DD')}
                            />
                          </Space>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row>
                      <Col span={11}>
                        <Form.Item name="amount_received" label="Amount Paid">
                          <Input onBlur={e => this.handleAmount(e)} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row>
                      <Col span={11}>
                        {/* <div className="col-md-2">
              <Form.Item name="expiryDate" label="Expiry Date">
                <Space direction="vertical" size={12}>
                  <DatePicker
                    onChange={this.handleExDate}
                    value={moment(expiryDate, 'YYYY/MM/DD')}
                    format="YYYY/MM/DD"
                  />
                </Space>
              </Form.Item>
            </div> */}

                        <Form.Item name="id" label="Payment #">
                          <Input disabled />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row>
                      <Col span={11}>
                        <Form.Item name="deposit_to" label="Debit from">
                          <Select
                            showSearch
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {chartOfAccount.map((item, index) => (
                              <Option value={item.id} key={item.id}>
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
                        <Form.Item name="payment_mode" label="Payment Mode">
                          <Select
                            showSearch
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {chartOfAccount.map((item, index) => (
                              <Option value={item.id} key={item.id}>
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
                        <Form.Item name="reference" label="Reference">
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row>
                      <Col span={11}>
                        <Form.Item name="tax_deducted" label="Tax Deducted">
                          <Input type="number" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                  {/* <div className="col-md-2">
              <Form.Item name="piNumber" label="PI Number">
                <Input />
              </Form.Item>
            </div> */}

                  <div className="col-md-12">
                    <h4>
                      <strong>Unpaid Invoices</strong>
                    </h4>
                  </div>
                  <div className="col-md-12">
                    <Table
                      pagination={false}
                      dataSource={invoiceData}
                      columns={columns}
                      rowKey="id"
                      components={{
                        body: {
                          wrapper: DraggableContainer,
                          // row: this.DraggableBodyRow,
                        },
                      }}
                      scroll={{ x: 691 }}
                    />
                    <br />
                  </div>

                  <div className="col-md-7">&nbsp;</div>
                  <div className="col-md-5">
                    <div>
                      <div className="row">
                        <div className="col-md-7 text-end">Total</div>
                        <div className="col-md-5 text-center">{total}</div>
                      </div>
                    </div>
                    {/* <hr style={{ marginTop: '5px', marginBottom: '5px' }} /> */}
                    <div style={{ border: '1px dashed', padding: '10px 0' }}>
                      <div className="row">
                        <div className="col-md-7 text-end">Amount Paid :</div>
                        <div className="col-md-5 text-center">{amountReceived}</div>
                        <div className="col-md-7 text-end">Amount used for payments :</div>
                        <div className="col-md-5 text-center">{amountUseForPayment}</div>
                        <div className="col-md-7 text-end">Amount Refunded :</div>
                        <div className="col-md-5 text-center">{amountRefunded}</div>
                        <div className="col-md-7 text-end"> Amount in excess :</div>
                        <div className="col-md-5 text-center">{amtInExcess}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <Form.Item name="tax_deducted" label="Notes">
                      <TextArea />
                    </Form.Item>
                  </div>
                  <div className="col-md-12">
                    <Form.Item name="purchase" label={null} valuePropName="checked">
                      {/* <Group options={optionsWithPurchase} /> */}
                      <Checkbox>Email a &quot;thank you&quot; note for this payment</Checkbox>
                    </Form.Item>
                  </div>
                  <div className="col-md-12">
                    <hr />
                  </div>
                  <div className="col-md-12 text-center">
                    <Button type="default" className="text-center" htmlType="submit">
                      <strong>
                        <Link to="/sales/invoices">Cancel</Link>
                      </strong>
                    </Button>
                    <Button type="primary" className="text-center" htmlType="submit">
                      <strong>{action}</strong>
                    </Button>
                  </div>
                </Row>
              </div>
              {/* <CreateProductModal
                headingText="Create Product And Service"
                visible={visible}
                productId=""
                // loadData={loadData}
                // productData={}
                handleChange={this.handleProduct}
                showModal={this.showModal}
                isOutside
              /> */}
            </Form>
          </TabPane>
          <TabPane tab="Advance Payment" key="2">
            {/* <Table
            id="table__layout--css"
            rowKey="id"
            columns={tableColumns}
            dataSource={quotations}
            pagination
            showSorterTooltip={false}
          /> */}
          </TabPane>
        </Tabs>
      </>
    )
  }
}

const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})

export default connect(mapStateToProps)(CreatePurchasePayment)

