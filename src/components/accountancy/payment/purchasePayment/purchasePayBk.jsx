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
} from 'antd'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import { MenuOutlined, PlusOutlined } from '@ant-design/icons'
// import { arrayMove } from "@dnd-kit/sortable";
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import CreateProductModal from '@/components/accountancy/productsAndServices/createProductModal'
import CreateCustomer from '@/components/accountancy/contacts/createCustomer'
import ProductService from '@/services/products'
import ChartOfAccService from '@/services/chartOfAccount'
// import VendorService from '@/services/customer'
import CustomerService from '@/ervices/customer'
import VendorService from '@/services/vendor'
import axios from 'axios'
import store from 'store'
import PurchaseService from '@/services/purchase'
import { history } from '@/main'
import './index.scss'

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
  const { custData, handleShowHide, passCustData, selectedCustId } = props
  // console.log(selectedCustId, 'selectedCustId')
  const addItem = () => {}
  // console.log(custData, 'custData')
  const handleCompName = e => {
    const data = custData
    const selected = data.filter(item => item.id === parseInt(e, 10))
    // console.log(e, 'handleCompName', selected, data)
    passCustData(selected)
  }
  return (
    <Select
      style={{ width: 240 }}
      placeholder="Select Vendor"
      value={custData.length ? selectedCustId : ''}
      onChange={e => handleCompName(e)}
      popupRender={menu => (
        <div>
          {/* <Divider style={{ margin: '4px 0' }} />
          <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
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
        <Option value={item.id} key={`${item.companyName}_${item.id}`}>
          {`${item.firstName} ${item.lastName} (${item.companyName})`}
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
      count: 4,
      isVisible: false,
      isShown: false,
      purchaseDate: '2021/01/01',
      deliveryDate: '2021/01/01',
      dataSource: [],
      invoiceData: [],
      paymentMaserData: {},
      columns: [
        {
          title: 'Invoice Date',
          dataIndex: 'estimate_date',
          responsive: ['xs', 'sm'],
          render: (key, record) => <span>{record.estimate_date}</span>,
        },
        {
          title: 'Invoice Number',
          dataIndex: 'invoiceNo',
          responsive: ['xs', 'sm'],
          render: (key, record) => <span>{record.invoice_no}</span>,
        },
        {
          title: 'Invoice Amount',
          dataIndex: 'amount',
          responsive: ['xs', 'sm'],
          render: (key, record) => <span>{record.total}</span>,
        },
        {
          title: 'Amount  Due',
          dataIndex: 'invoiceDueAmount',
          responsive: ['xs', 'sm'],
          render: (key, record) => <span>{record.invoice_due_amount || 0}</span>,
        },
        {
          title: 'Payment',
          dataIndex: 'paidAmount',
          responsive: ['xs', 'sm'],
          render: (key, record) => (
            <Input
              placeholder="Enter Payment"
              style={{ width: '100px' }}
              // onChange={e => this.handleCalculation(e, record)}
              onBlur={e => this.handleChange(e, record)}
              defaultValue={record.paidAmount || 0}
            />
          ),
        },

        // {
        //   title: 'Account',
        //   responsive: ['xs', 'sm'],
        //   dataIndex: 'purchase_account',
        //   render: (key, record) => (
        //     <Input
        //       name="purchase_account"
        //       placeholder="Enter Account"
        //       defaultValue={record.purchase_account}
        //     />
        //   ),
        // },
        // {
        //   title: 'Tax rate',
        //   responsive: ['xs', 'sm'],
        //   dataIndex: 'purchase_tax_rate',
        //   render: (key, record) => (
        //     <Input
        //       placeholder="Enter Tax rate"
        //       defaultValue={record.purchase_tax_rate}
        //       name="purchase_tax_rate"
        //       onBlur={e => this.handleChange(e, record)}
        //     />
        //   ),
        // },
        // {
        //   title: 'Amount',
        //   responsive: ['xs', 'sm'],
        //   dataIndex: 'purchase_amount',
        //   render: (key, record) => (
        //     <Input placeholder="Enter Amount" defaultValue={record.purchase_amount} />
        //   ),
        // },
        // {
        //   title: 'Action',
        //   dataIndex: 'action',
        //   responsive: ['xs', 'sm'],
        //   className: 'actionCol',
        //   render: (text, record) => {
        //     const { dataSource } = this.state
        //     return dataSource.length >= 1 ? (
        //       <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record)}>
        //         <a>Delete</a>
        //       </Popconfirm>
        //     ) : null
        //   },
        // },
      ],
    }
    // This binding is necessary to make `this` work in the callback
    this.onFinish = this.onFinish.bind(this)
    this.onFinishFailed = this.onFinishFailed.bind(this)
  }

  handleCompName = e => {
    const { custData } = this.state
    const selected = custData.filter(item => item.id === parseInt(e, 10))
    // console.log(e, 'handleCompName', selected, custData)
    this.passCustData(selected)
  }

  fetchChartOfAccount = () => ChartOfAccService.listAllAccounts('ALL')

  fetchCustData = () => VendorService.customerList()

  fetchProdData = () => ProductService.productList()

  componentDidMount = () => {
    const prodResult = []
    const custResult = []
    const { match } = this.props

    const getAllData = async () => {
      const [prodData, chartOfAccount, custData] = await axios.all([
        this.fetchProdData(),
        this.fetchChartOfAccount(),
        this.fetchCustData(),
      ])

      prodData.data.forEach((ele, i) => {
        ele.key = i + 1
      })

      // console.log(chartOfAccount, '&& chartOfAccount.data')
      this.setState({
        prodData: prodData.data || [],
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
    //   custResult = await VendorService.customerList()
    //   // console.log(custResult, 'custResult')
    //   this.setState({ custData: custResult })
    // }
    // fetchProdData()
    if (match.params.id) {
      // console.log(match.params.id, '(match.params.invoiceId')
      const fetchInvoiceData = async () => {
        const result = await PurchaseService.getPurchasePayment(match.params.id)
        // console.log(result, 'invoiceId result')
        // getQuotation(result ? result.data : [])
        const resultData = result ? result.data : {}
        const data = []
        // console.log(resultData, 'resultData.length')
        if (resultData.id) {
          _.forEach(resultData, (val, key) => {
            if (key !== 'lstPurchasePaymentInvoiceDto')
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
              amtInExcess: resultData.amtInExcess,
              amountReceived: resultData.amount_paid,
              amountRefunded: resultData.amount_refunded,
              amountUseForPayment: resultData.amount_useForPayment,
              purchaseDate: resultData.estimateDate || new Date(),
              deliveryDate: resultData.expiryDate || new Date(),
              selectedCustId: {
                vendorId: resultData.vendorId,
                firstName: resultData.firstName,
                lastName: resultData.LastName,
              },
            },
            () => getAllData(),
          )
          // this.setState(
          //   {
          //     defaultData: data,
          //     subTotal: resultData.sub_total,
          //     total: resultData.total,
          //     dataSource: resultData.productDto ? resultData.productDto : [],
          //     action: 'Update',
          //     purchaseDate: resultData.estimateDate || new Date(),
          //     deliveryDate: resultData.expiryDate || new Date(),
          //     selectedCustId:{
          //       vendorId: resultData.vendorId,
          //       firstName: resultData.firstName,
          //       lastName: resultData.LastName,
          //     },
          //   },
          //   () => fetchProdData(),
          // )
        }
      }
      fetchInvoiceData()
    } else {
      getAllData()
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
    } = this.state
    // console.log(values, 'values')
    const { match, user } = this.props
    // console.log('dataSource 123', selectedCust)
    // values.productDto = dataSource
    // values.product_id = 0;
    values.sub_total = total
    values.total = total
    values.amount_useForPayment = amountUseForPayment
    values.amtInExcess = amtInExcess
    values.amount_paid = amountReceived
    values.amount_refunded = amountRefunded
    values.lstPurchasePaymentInvoiceDto = invoiceData
    // values.accepted = true
    values.vendor_name = selectedCust.firstName || selectedCustId.firstName
    // values.lastName = selectedCust.lastName || selectedCustId.lastName
    values.vendorId = selectedCust.id || selectedCustId.vendorId
    // values.desc = ''
    // values.title = ''
    values.payment_date = new Date(purchaseDate)
    // values.delivery_Date = new Date(deliveryDate)
    // values.amount = 0
    // values.currency = 0
    // values.delivery_address = ''
    // values.status = true
    // values.account = 'string'
    // values.contact = 0
    // values.id = '0'
    // values.disc = 0
    // values.items = 'test'
    // values.purchase_id = 0
    // values.quantity = 0
    // values.region = 'string'
    // const prodId = []
    // dataSource.forEach(item => {
    //   prodId.push(item.id)
    // })
    // console.log(prodId)
    // values.product_id = prodId.toString()

    let method = 'post'
    if (match.params.id) {
      method = 'put'
      values.paymentNo = match.params.id
      values.id = paymentMaserData.id
    }
    // values.email = user.email
    // console.log(values, 'values')
    const fetchData = async () => {
      const result = await PurchaseService.savePurchasePayment(values, method)
      history.push('/purchase/payments')
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

  showModal = (e, record) => {
    // console.log(e, record, 'e, record')
    const { visible } = this.state
    this.setState({
      visible: !visible,
      currentProdId: record,
    })
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

  handleName = (e, record) => {
    // console.log(e, record)
    const { dataSource, prodData } = this.state
    let prodItem = []
    dataSource.forEach(element => {
      if (element.id === record.id) {
        prodItem = prodData.filter(item => item.id === parseInt(e.value, 10))
        Object.assign(element, prodItem[0])
        element = e.label
      }
    })
    this.setState(
      {
        dataSource,
      },
      () => this.handleChange(e, prodItem[0]),
    )
  }

  handleDescription = (e, record) => {
    const { dataSource, prodData } = this.state
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

  handleChange = (e, record) => {
    // console.log(e.target.value, record, 'e record')
    const { invoiceData } = this.state
    invoiceData.forEach(ele => {
      // console.log(ele.id, 'eleID')
      if (ele.id === record.id) {
        // console.log('in If')
        ele.paidAmount = Number(e.target.value)
      }
    })

    // console.log(invoiceData, 'invoiceData')
    this.setState(
      {
        invoiceData,
      },
      () => this.handleCalculation('paidAmount'),
    )
  }

  handleChangeBk = (e, record) => {
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
    } else {
      const { value: val, name: nameVal } = e.target
      name = nameVal
      value = val
    }
    dataSource.forEach(element => {
      if (element.id === record.id) {
        // console.log(name, 'e.target')
        element[name] = Number(value)
        let {
          purchase_amount: sum,
          purchase_discount: discount,
          purchase_tax_rate: taxRate,
        } = record
        const { purchase_unit_price: unitPrice, purchase_qty: quantity } = record

        if (name === 'purchase_discount') {
          discount = Number(value)
          // console.log(discount, 'discount999999999', sum)
          sum = quantity * unitPrice
        } else if (name === 'purchase_tax_rate') {
          taxRate = Number(value)
          sum = quantity * unitPrice
        } else if (name === 'productName') {
          // console.log('value', value)
          // console.log(record, 'productName in')
          sum = quantity * unitPrice
        } else {
          const currentField = ['purchase_qty', 'purchase_unit_price']
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
        element.purchase_amount = amount
        // console.log(amount, 'amount')
      } else {
        total += parseFloat(element.purchase_amount)
        subTotal += parseFloat(element.purchase_amount)
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

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { dataSource } = this.state
    // console.log('temp', dataSource)
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(x => x.index === restProps['data-row-key'])
    return <SortableItem index={index} {...restProps} />
  }

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
      purchase_qty: 0,
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
      sales_amount: '',
      sales_discount: '',
    }
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    })
  }

  handleStDate = (date, dateString) => {
    // console.log(date, dateString, ' date, dateString')

    if (date) {
      this.setState({
        purchaseDate: date ? dateString : '',
      })
    }
  }

  handleExDate = (date, dateString) => {
    // console.log(date, dateString, ' date, dateString')
    // const {purchaseDate} = this.state
    // const val = moment(dateString).tz('Asia/Calcutta').format();

    if (date) {
      this.setState({
        deliveryDate: date ? dateString : '',
      })
    }
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
    // console.log(amountReceived, 'amountReceived', userAmount)

    invoiceData.forEach(ele => {
      // console.log(total, ele, 'ele')
      const { total: saleAmount, invoice_due_amount: invoiceDueAmount } = ele
      ele.invoice_due_amount = invoiceDueAmount || 0
      // console.log(userAmount, 'userAmpunt', saleAmount, amountReceived, invoiceDueAmount)
      if (userAmount >= (saleAmount || 0)) {
        // console.log('idblock', ele.paidAmount, 'key', key)
        ele.paidAmount =
          key === 'paidAmount' ? Number(ele.paidAmount) : invoiceDueAmount || saleAmount
        total += ele.paidAmount
        amountUseForPayment += ele.paidAmount
        userAmount -= invoiceDueAmount || saleAmount
      } else if (userAmount > 0) {
        // console.log(total, 'else if block', userAmount, ele.paidAmount)
        ele.paidAmount = key === 'paidAmount' ? Number(ele.paidAmount) : Number(userAmount)
        userAmount -= invoiceDueAmount || saleAmount
        total += Number(ele.paidAmount)
        amountUseForPayment += ele.paidAmount
      } else {
        ele.paidAmount = 0
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

  // handleChange = (e, record) => {
  //   // console.log(e.target.value, record, 'e record')
  //   const { invoiceData } = this.state
  //   invoiceData.forEach(ele => {
  //     // console.log(ele.id, 'eleID')
  //     if (ele.id === record.id) {
  //       // console.log('in If')
  //       ele.salePayment = Number(e.target.value)
  //     }
  //   })

  //   // console.log(invoiceData, 'invoiceData')
  //   this.setState(
  //     {
  //       invoiceData,
  //     },
  //     () => this.handleCalculation('paidAmount'),
  //   )
  // }

  handleAmount = e => {
    // console.log(e.target.value, '8787878')
    this.setState(
      {
        amountReceived: e.target.value,
      },
      () => this.handleCalculation(),
    )
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
    } = this.state
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
          layout="vertical"
          fields={defaultData}
          onFinish={this.onFinish}
          ref={this.formRef}
          onFinishFailed={this.onFinishFailed}
        >
          <div className="row">
            <div className="col-md-4">
              <Form.Item
                name="vendorId"
                label="Vendor Name"
                rules={[
                  {
                    required: true,
                    message: 'Please select vendors!',
                  },
                ]}
              >
                {/* <LoadCon
                  custData={custData}
                  handleShowHide={this.handleShowHide}
                  passCustData={this.passCustData}
                  selectedCustId={selectedCustId.vendorId}
                /> */}

                {/* <Select
                  style={{ width: 240 }}
                  placeholder=""
                  // onChange={e => this.getInvoiceDetails(e)}
                >
                  {custData.map((item, index) => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {`${item.firstName} ${item.lastName}`}
                      </Option>
                    )
                  })}
                </Select> */}
                <Select
                  style={{ width: 240 }}
                  placeholder="Select Vendor"
                  value={custData.length ? selectedCustId : ''}
                  onChange={e => this.handleCompName(e)}
                >
                  {custData.map(item => (
                    <Option value={item.id} key={`${item.companyName}_${item.id}`}>
                      {`${item.firstName} ${item.lastName} (${item.companyName})`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-2">
              <Form.Item
                name="paymentDate"
                label="Payment Date"
                rules={[
                  {
                    required: true,
                    message: 'Please select date!',
                  },
                ]}
              >
                {/* <Space direction="vertical" size={12}> */}
                <DatePicker
                  onChange={this.handleStDate}
                  defaultValue={moment(new Date(), 'DD MMM YYYY')}
                  format="DD MMM YYYY"
                  value={moment(purchaseDate, 'DD MMM YYYY')}
                />
                {/* </Space> */}
              </Form.Item>
            </div>
            <div className="col-md-3">
              <Form.Item
                name="amountPaid"
                label="Amount Paid"
                rules={[
                  {
                    required: true,
                    message: 'Please enter amount!',
                  },
                ]}
              >
                <Input onBlur={e => this.handleAmount(e)} />
              </Form.Item>
            </div>
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
            <div className="col-md-2">
              <Form.Item name="paymentNo" label="Payment #">
                <Input disabled />
              </Form.Item>
            </div>
            <div className="col-md-3">
              <Form.Item
                name="debitFrom"
                label="Debit from"
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please select!',
                //   },
                // ]}
              >
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
            </div>

            <div className="col-md-3">
              <Form.Item
                name="paymentMode"
                label="Payment Mode"
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
                >
                  <Option value="Cash">Cash</Option>
                  <Option value="Bank Remittance">Bank Remittance</Option>
                  <Option value="Bank Transfer">Bank Transfer</Option>
                  <Option value="Debit/Credit Card">Debit/Credit Card</Option>
                  <Option value="Cheque">Cheque</Option>
                  <Option value="UPI">UPI</Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-2">
              <Form.Item
                name="refference"
                label="Refference"
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please enter Reference!',
                //   },
                // ]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="col-md-3">
              <Form.Item
                name="taxDeducted"
                label="Tax Deducted"
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please enter tax deducted!',
                //   },
                // ]}
              >
                <Input />
              </Form.Item>
            </div>

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
                    row: this.DraggableBodyRow,
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
                  <Link to="/purchase/payments">Cancel</Link>
                </strong>
              </Button>
              <Button type="primary" className="text-center" htmlType="submit">
                <strong>Send</strong>
              </Button>
            </div>
          </div>
          <CreateProductModal
            headingText="Create Product And Service"
            visible={visible}
            productId=""
            // loadData={loadData}
            // productData={}
            handleChange={this.handleProduct}
            showModal={this.showModal}
            isOutside
          />
        </Form>
      </>
    )
  }
}

const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})

export default connect(mapStateToProps)(CreatePurchasePayment)

