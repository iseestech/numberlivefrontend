import React, { useContext, useState, useEffect, useRef } from 'react'
import {
  Table,
  Popconfirm,
  Button,
  Input,
  Form,
  Space,
  Select,
  Divider,
  Modal,
  DatePicker,
  InputNumber,
} from 'antd'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import { MenuOutlined, PlusOutlined } from '@ant-design/icons'
import { arrayMove } from "@dnd-kit/sortable";
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import axios from 'axios'
import CreateProductModal from '@/components/accountancy/productsAndServices/createProductModal'
import CreateVendor from '@/components/accountancy/contacts/vendor/createVendor'
import ProductService from '@/services/products'
import CustomerService from '@/services/customer'
import TaxService from '@/services/settings'
import VendorService from '@/services/vendor'
import PurchaseService from '@/services/purchase'
import { history } from '@/mian'
import './index.scss'
import HelperFunction from '@/services/helper'

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
  // console.log(custData, 'custData')
  const addItem = () => {}
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
      // value={custData.length ? selectedCustId : ''}
      // onChange={e => handleCompName(e)}
      popupRender={menu => (
        <div>
          <Divider style={{ margin: '4px 0' }} />
          <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
            <Button
              onClick={() => {
                handleShowHide()
              }}
              role="button"
            >
              <PlusOutlined /> Add Vendor
            </Button>
          </div>
          {menu}
        </div>
      )}
    >
      {/* {custData.map(item => (
        <Option value={item.id} key={`${item.companyName}_${item.id}`}>
          {`${item.firstName} ${item.lastName} (${item.companyName})`}
        </Option>
      ))} */}
      <Option value="demo">demo</Option>
    </Select>
  )
}
class CreatePurchaseOrder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [
        { name: 'jack', key: 1 },
        { name: 'lucy', key: 2 },
      ],
      currentProdId: {},
      visible: false,
      selectedCust: {},
      custData: [],
      taxData: [],
      totalDiscount: 0,
      totalTax: 0,
      prodData: [],
      masterProdData: [],
      defaultData: [{ name: 'taxType', value: 'TaxExclusive' }],
      action: 'Create',
      selectedCustId: {},
      taxValue: 'TaxExclusive',
      total: 0,
      subTotal: 0,
      custName: '',
      name: '',
      count: 4,
      isVisible: false,
      isShown: false,
      purchaseDate: HelperFunction.getCurrentDate(),
      deliveryDate: HelperFunction.getCurrentDate(),
      dataSource: [
        {
          description: '',
          id: '',
          index: 1,
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
          productQty: 0,
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
        },
      ],
      filterOutColumns: [],
      columns: [
        // {
        //   title: 'Sort',
        //   dataIndex: 'sort',
        //   width: 30,
        //   className: 'drag-visible',
        //   render: () => <DragHandle />,
        //   responsive: ['xs', 'sm'],
        // },
        {
          title: 'Name',
          dataIndex: 'name',
          className: 'drag-visible',
          responsive: ['xs', 'sm'],
          render: (key, record) => {
            const { prodData, name } = this.state
            // console.log(prodData, 'prodData')
            const filterProd = _.cloneDeep(prodData)
            const newFilterProd = filterProd.filter(
              x => x.visible === true || x.visible === undefined,
            )
            // console.log(newFilterProd, 'filterProd', filterProd)
            return (
              <Select
                style={{ width: 180 }}
                placeholder="Enter Name"
                labelInValue
                defaultValue={{ value: record.name }}
                onChange={e => this.handleName(e, record)}
                popupRender={menu => (
                  <div>
                    <Divider style={{ margin: '4px 0' }} />
                    {/* <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                      <CreateProductModal headingText="Add Product" />
                    </div> */}
                    <Button
                      type="primary"
                      onClick={e => this.showModal(e, record)}
                      // className="me-3"
                      style={{ display: 'flex', margin: '0 auto' }}
                    >
                      Add Product
                    </Button>
                    {menu}
                  </div>
                )}
              >
                {newFilterProd.map((item, index) => (
                  <Option key={item.id}>{item.name}</Option>
                ))}
              </Select>
            )
          },
        },
        {
          title: 'Description',
          dataIndex: 'purchase_desc',
          responsive: ['xs', 'sm'],
          render: (key, record) => (
            <Input
              placeholder="Enter description"
              onBlur={e => this.handleDescription(e, record)}
              name="purchase_desc"
              defaultValue={record.purchase_desc}
            />
          ),
        },
        {
          title: 'Quantity',
          dataIndex: 'purchase_qty',
          responsive: ['xs', 'sm'],
          render: (key, record) => (
            <Input
              placeholder="Enter Quantity"
              name="purchase_qty"
              // onChange={e => this.handleCalculation(e, record)}
              // onBlur={e => this.handleChange(e, record)}
              onChange={HelperFunction.isValidNumber}
              defaultValue={record.purchase_qty}
            />
          ),
        },
        {
          title: 'Unit Price',
          dataIndex: 'purchase_unit_price',
          responsive: ['xs', 'sm'],
          render: (key, record) => (
            <Input
              placeholder="Enter Unit"
              name="purchase_unit_price"
              // onChange={e => this.handleCalculation(e, record)}
              onBlur={e => this.handleChange(e, record)}
              defaultValue={record.purchase_unit_price}
            />
          ),
        },
        {
          title: 'Discount (%)',
          dataIndex: 'purchase_discount',
          responsive: ['xs', 'sm'],
          render: (key, record) => (
            <Input
              placeholder="Enter discount"
              name="purchase_discount"
              defaultValue={record.purchase_discount}
              onBlur={e => this.handleChange(e, record)}
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
        {
          title: 'Tax %',
          responsive: ['xs', 'sm'],
          dataIndex: 'purchase_tax_rate',
          render: (key, record) => {
            const { taxData } = this.state
            return (
              <>
                {/* <Input
                  placeholder="Enter Tax rate"
                  defaultValue={record.purchase_tax_rate}
                  name="purchase_tax_rate"
                  onBlur={e => this.handleChange(e, record)}
                /> */}

                <Select
                  style={{ width: 150 }}
                  placeholder="Select tax rate"
                  labelInValue
                  defaultValue={{ value: record.purchase_tax_rate }}
                  onChange={e => this.handleChange(e, record, 'purchase_tax_rate')}
                  // disabled
                >
                  {taxData.map((item, index) => (
                    <Option key={`${item.rate}}`} value={item.id}>
                      {`${item.tax_name} (${item.rate}%)`}
                    </Option>
                  ))}
                </Select>
              </>
            )
          },
        },
        {
          title: 'Amount',
          responsive: ['xs', 'sm'],
          dataIndex: 'purchase_amount',
          render: (key, record) => (
            <Input placeholder="Enter Amount" defaultValue={record.purchase_amount} />
          ),
        },
        {
          title: 'Action',
          dataIndex: 'action',
          responsive: ['xs', 'sm'],
          className: 'actionCol',
          render: (text, record) => {
            const { dataSource } = this.state
            return dataSource.length >= 1 ? (
              <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record)}>
                <a>Delete</a>
              </Popconfirm>
            ) : null
          },
        },
      ],
    }
    // This binding is necessary to make `this` work in the callback
    this.onFinish = this.onFinish.bind(this)
    this.onFinishFailed = this.onFinishFailed.bind(this)
  }

  handleCompName = e => {
    const { custData } = this.state
    const data = custData
    const selected = data.filter(item => item.id === parseInt(e, 10))
    // console.log(e, 'handleCompName', selected, data)
    this.passCustData(selected)
  }

  handleTaxChange = (e, val) => {
    // console.log('handleTaxChange', e, val)
  }

  fetchProducts = () => ProductService.productList()

  fetchTaxes = () => TaxService.taxList()

  fetchCustData = () => VendorService.customerList()

  componentDidMount = () => {
    // let prodResult = []
    // let custResult = []
    const { columns, defaultData } = this.state
    // console.log(columns, 'columns')
    const { match } = this.props
    const fetchProdData = async () => {
      const [prodResult, taxData, custData] = await axios.all([
        this.fetchProducts(),
        this.fetchTaxes(),
        this.fetchCustData(),
      ])
      // console.log(prodResult, 'prodResult')
      if (prodResult && prodResult.data.length) {
        prodResult.data.forEach((ele, i) => {
          ele.key = i + 1
        })
        // getProductList(result.data);
      }
      this.setState({
        prodData: prodResult.data || [],
        masterProdData: prodResult.data || [],
        filterOutColumns: columns,
        taxData,
        custData,
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
    //   }
    //   this.setState({ prodData: prodResult.data || [], filterOutColumns: columns }, () =>
    //     fetchCustData(),
    //   )
    // }

    // const fetchCustData = async () => {
    //   custResult = await VendorService.customerList()
    //   this.setState({ custData: custResult })
    // }
    // fetchProdData()

    if (match.params.purchaseId) {
      // console.log(match.params.purchaseId, '(match.params.invoiceId')
      const fetchInvoiceData = async () => {
        const result = await PurchaseService.getPurchaseOrder(match.params.purchaseId, 'get')
        // console.log(result, 'invoiceId result')
        // getQuotation(result ? result.data : [])
        const resultData = result.data || []
        const data = []
        // console.log(resultData, 'resultData.length')
        if (resultData.id) {
          _.forEach(resultData, (val, key) => {
            if (key !== 'productDto')
              data.push({
                name: key,
                value: key === 'estimateDate' || key === 'expiryDate' ? moment(val) : val,
              })
          })
          // console.log(data, 'data')
          this.setState(
            {
              defaultData: data,
              subTotal: resultData.sub_total,
              total: resultData.total,
              dataSource: resultData.productDto,
              action: 'Update',
              purchaseDate: resultData.estimateDate || new Date(),
              deliveryDate: resultData.expiryDate || new Date(),
              selectedCustId: {
                vendorId: resultData.vendorId,
                firstName: resultData.firstName,
                lastName: resultData.lastName,
              },
            },
            () => fetchProdData(),
          )
        }
      }
      fetchInvoiceData()
    } else {
      fetchProdData()
    }
  }

  onFinish = values => {
    const {
      dataSource,
      purchaseDate,
      deliveryDate,
      selectedCust,
      subTotal,
      total,
      defaultData,
      selectedCustId,
    } = this.state
    // console.log(values, 'values')
    const { match, user } = this.props
    // console.log(selectedCustId, 'dataSource 123', selectedCust)
    values.productDto = dataSource
    // values.product_id = '0'
    values.sub_total = subTotal
    values.total = total
    values.accepted = false
    values.firstName = selectedCust.firstName || selectedCustId.firstName
    values.lastName = selectedCust.lastName || selectedCustId.lastName
    values.vendorId = selectedCust.id || selectedCustId.vendorId
    // values.vendorId = selectedCust.id
    values.desc = ''
    values.title = ''
    values.purchaseDate = document.getElementById('estimateDate').value
    values.estimateDate = document.getElementById('estimateDate').value
    values.expiryDate = document.getElementById('expiryDate').value
    values.amount = total
    values.currency = 0
    values.delivery_address = ''
    values.status = true
    values.account = 'string'
    values.contact = 0
    values.id = '0'
    values.disc = 0
    values.items = 'test'
    values.purchase_id = 0
    // values.quantity = 0
    values.region = 'string'
    const prodId = []
    dataSource.forEach((item, i) => {
      dataSource[i].productQty = item.purchase_qty
      prodId.push(item.id)
    })
    // console.log(values, 'values')
    // console.log(prodId)
    values.product_id = prodId.toString()

    let method = 'post'
    if (match.params.purchaseId) {
      method = 'put'
      values.id = match.params.purchaseId
    }
    values.email = user.email
    // console.log(values, 'values')
    const fetchData = async () => {
      const result = await PurchaseService.createPurchaseOrder(values, method)
      history.push('/purchase/orders')
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
    // console.log('handleName', e, record)
    const { dataSource, masterProdData } = this.state
    let prodItem = []
    const prodData = _.cloneDeep(masterProdData)
    const prodId = []

    dataSource.forEach(element => {
      // prodId.push(String(x.id));
      if (element.id === record.id) {
        prodItem = prodData.filter(item => item.id === parseInt(e.value, 10))
        Object.assign(element, prodItem[0])
        element = e.label
      }
    })

    dataSource.forEach(x => prodId.push(String(x.id)))
    const data = prodData.filter(x => !prodId.includes(String(x.id)))

    this.setState(
      {
        dataSource,
        prodData: data,
      },
      () => this.handleChange(e, prodItem[0], 'productName'),
    )
  }

  handleDescription = (e, record) => {
    const { dataSource, prodData } = this.state
    // console.log(e.target.name, e.target.value)
    // console.log(element,record)
    // console.log(e, record, 'handleDescription')
    let prodItem = []
    record[e.target.name] = e.target.value
    dataSource.forEach(element => {
      if (element.id === record.id) {
        prodItem = prodData.filter(item => item.id === parseInt(e.value, 10))
        Object.assign(element, prodItem[0])
        // element = e.label;
      }
    })

    this.setState({
      dataSource,
    })
  }

  handleChange = (e, record, colName) => {
    // console.log(e, 'e', record, 'handleChange', colName)
    const { dataSource, taxValue } = this.state
    let amount = 0
    let subAmount = 0
    let totalTax = 0
    let totalDiscount = 0
    let total = 0
    let subTotal = 0
    let name = ''
    let value = ''
    if (e.value && e.value.length && colName === 'productName') {
      const { value: val } = e
      name = 'productName'
      value = val
    } else if (colName === 'purchase_tax_rate') {
      const { value: val, label } = e
      // const newVal = label.split('(')[1].split('%')[0]
      // console.log(newVal, 'newVal')
      name = 'purchase_tax_rate'
      // value = parseFloat(newVal)
      value = val
    } else {
      const { value: val, name: nameVal } = e.target
      name = nameVal
      value = val
    }
    dataSource.forEach(element => {
      // console.log(element, 'element')
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
          subAmount = sum
        } else if (name === 'purchase_tax_rate') {
          taxRate = Number(value)
          sum = quantity * unitPrice
          subAmount = sum
        } else if (name === 'productName') {
          // console.log('value', value)
          // console.log(record, 'productName in')
          element.purchase_qty = 0
          sum = quantity * unitPrice
          subAmount = sum
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
          subAmount = sum
        }

        discount *= sum / 100
        totalDiscount += discount
        // console.log(discount, '999999', quantity)

        const taxable = sum - discount
        const tax = (taxable / 100) * taxRate
        // console.log(discount, 'discount', sum, 'sum', taxable, tax, taxRate)

        if (taxValue === 'TaxInclusive') {
          // console.log('totalTax += tax')
        } else if (taxValue === 'TaxExclusive') {
          // console.log('totalTax += tax')
        } else {
          // totalTax += tax
          // console.log('totalTax += tax')
        }
        totalTax += tax
        amount = taxable + tax

        element.purchase_amount = amount
        element.purchase_discount_value = discount
        element.purchase_tax_value = tax

        // console.log(amount, 'amount')
      } else {
        // console.log(element.purchase_discount_value, 'purchase_discount_value')
        total += parseFloat(element.purchase_amount)
        subTotal += parseFloat(element.purchase_amount)
        totalDiscount += parseFloat(element.purchase_discount_value) || 0
        totalTax += parseFloat(element.purchase_tax_value) || 0
      }
    })
    // console.log(totalDiscount, 'totalDiscount')
    total += parseFloat(amount)
    subTotal += parseFloat(subAmount)
    totalDiscount = parseFloat(totalDiscount)
    totalTax = parseFloat(totalTax)
    this.setState({
      dataSource,
      total,
      subTotal,
      totalTax,
      totalDiscount,
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
    const { dataSource, total, subTotal, masterProdData } = this.state
    const prodData = _.cloneDeep(masterProdData)
    const prodId = []
    const newData = dataSource.filter(item => item.key !== record.key)
    newData.forEach(x => prodId.push(String(x.id)))
    const data = prodData.filter(x => !prodId.includes(String(x.id)))

    this.setState(
      {
        dataSource: newData,
        total: total - record.purchase_amount,
        subTotal: subTotal - record.purchase_amount,
        prodData: data,
      },
      () => {},
    )
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
      productQty: 0,
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
    // const {purchaseDate} = this.state
    // const val = moment(dateString).tz('Asia/Calcutta').format();
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
    this.setState({
      selectedCust: data[0],
      selectedCustId: { vendorId: data[0].id },
    })
  }

  handleNewCustomer = record => {
    const { custData, isVisible } = this.state
    this.setState(
      {
        custData: [...custData, record],
        selectedCustId: {
          vendorId: record.id,
          firstName: record.firstName,
          lastName: record.lastName,
        },
      },
      () => this.handleCustModal(),
    )
  }

  handleCustModal = () => {
    const { isVisible } = this.state
    this.setState({
      isVisible: !isVisible,
    })
  }

  handleTax = value => {
    const { columns, filterOutColumns, dataSource } = this.state
    // console.log(filterOutColumns, 'filterOutColumns')
    let total = 0
    let subTotal = 0
    let amount = 0
    let filterColumn = []
    if (value === 'TaxInclusive' || value === 'NoTax') {
      filterColumn = filterOutColumns.filter(x => x.dataIndex !== 'purchase_tax_rate')
    } else {
      filterColumn = filterOutColumns
    }
    // console.log(filterOutColumns, 'filterOutColumns after')
    dataSource.forEach(element => {
      amount = Number(element.purchase_qty) * (Number(element.purchase_unit_price) || 0)
      const discount = ((Number(element.purchase_discount) || 0) * amount) / 100
      amount -= discount
      let tax = 0
      if (value === 'TaxExclusive') {
        tax = (amount / 100) * (Number(element.purchase_tax_rate) || 0)
      } else {
        element.purchase_tax_rate = 0
      }

      amount += tax
      element.purchase_amount = amount
      total += amount
      subTotal += amount
    })
    // total += total + amount

    this.setState({
      taxValue: value,
      columns: filterColumn,
      dataSource,
      total,
      subTotal,
    })
  }

  // handleAllTaxValue = () => {

  // }

  render() {
    const {
      dataSource,
      columns,
      items,
      custData,
      name,
      custName,
      isVisible,
      isShown,
      total,
      subTotal,
      purchaseDate,
      deliveryDate,
      taxValue,
      defaultData,
      action,
      selectedCustId,
      visible,
      totalDiscount,
      totalTax,
      filterOutColumns,
    } = this.state
    // console.log(defaultData, 'defaultData')
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
        {isVisible && (
          <Modal
            title="Add Vendor"
            onOk={this.handleCustModal}
            onCancel={this.handleCustModal}
            visible={isVisible}
            className="customerModal"
            // okText="Add Product"
            footer={null}
            // style={{ width: '700px' }}
            width={1000}
          >
            <CreateVendor
              fromModal
              // getData={this.getData}
              handleNewCustomer={this.handleNewCustomer}
            />
          </Modal>
        )}
        <Form
          layout="vertical"
          fields={defaultData}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <div className="row">
            <div className="col-md-3">
              <Form.Item
                name="vendorId"
                label="Vendor Name"
                rules={[
                  {
                    required: true,
                    message: 'Please select vendor name!',
                  },
                ]}
              >
                {/* <LoadCon
                  custData={custData}
                  handleShowHide={this.handleShowHide}
                  passCustData={this.passCustData}
                  selectedCustId={selectedCustId.vendorId}
                /> */}
                <Select
                  style={{ width: '100%' }}
                  placeholder="Select Vendor"
                  value={custData.length ? selectedCustId.vendorId : ''}
                  onChange={e => this.handleCompName(e)}
                  popupRender={menu => (
                    <div>
                      <Divider style={{ margin: '4px 0' }} />
                      <div className="text-center" style={{ padding: '5px' }}>
                        <Button onClick={this.handleShowHide} role="button">
                          <PlusOutlined /> Add Vendor
                        </Button>
                      </div>
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
              </Form.Item>
            </div>
            <div className="col-md-3">
              <Form.Item
                name="estimateDate"
                label="Purchase Date"
                rules={[
                  {
                    required: true,
                    message: 'Please select date!',
                  },
                ]}
              >
                {/* <DatePicker
                // onChange={this.handleStDate}
                // defaultValue={moment('2021/01/01', 'DD/MM/YYYY')}
                // format="DD/MM/YYYY"
                // value={moment(purchaseDate, 'DD/MM/YYYY')}
                /> */}
                <DatePicker style={{ width: '100%' }} format="DD MMM YYYY" />
              </Form.Item>
            </div>
            <div className="col-md-3">
              <Form.Item
                name="expiryDate"
                label="Delivery Date"
                rules={[
                  {
                    required: true,
                    message: 'Please select date!',
                  },
                ]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  // onChange={this.handleExDate}
                  // defaultValue={moment('', 'DD/MM/YYYY')}
                  format="DD MMM YYYY"
                  // value={moment(deliveryDate, 'DD/MM/YYYY')}
                />
              </Form.Item>
            </div>
            {/* <div className="col-md-2">
              <Form.Item name="purchase_order_no" label="PO Number">
                <Input disabled />
              </Form.Item>
            </div> */}
            <div className="col-md-3">
              <Form.Item
                name="reference"
                label="Reference"
                rules={[
                  {
                    required: true,
                    message: 'Please enter reference!',
                  },
                ]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </div>
            {/* <div className="col-md-12">
              <Button
                style={{
                  border: '0',
                  padding: '0',
                }}
                className="showHideDes"
                onClick={() =>
                  this.setState({
                    isShown: !isShown,
                  })
                }
                role="button"
              >
                <strong> Show/Hide details </strong>
              </Button>
            </div> */}
            <div className="col-md-6" style={{ display: isShown ? 'block' : 'none' }}>
              <Form.Item name="title" label="Title">
                <Input />
              </Form.Item>
            </div>
            <div className="col-md-6" style={{ display: isShown ? 'block' : 'none' }}>
              <Form.Item name="desc" label="Description">
                <TextArea />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                name="currency"
                label="Currency"
                rules={[
                  {
                    required: true,
                    message: 'Please select Currency!',
                  },
                ]}
              >
                <Select style={{ width: 240 }} placeholder="">
                  <Option value="KWD">KWD </Option>
                  <Option value="INR">INR</Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-3">&nbsp;</div>
            <div className="col-md-3">
              <Form.Item
                name="taxType"
                label="Amounts Are"
                className="text-start"
                rules={[
                  {
                    required: true,
                    message: 'Please select value!',
                  },
                ]}
              >
                <Select style={{ width: 240 }} placeholder="" onChange={e => this.handleTax(e)}>
                  <Option value="TaxExclusive">Tax Exclusive </Option>
                  <Option value="TaxInclusive">Tax Inclusive</Option>
                  <Option value="NoTax">No Tax</Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-12">
              <Table
                pagination={false}
                dataSource={dataSource}
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

            <div className="col-md-9">
              <Button
                onClick={this.handleAdd}
                type="primary"
                style={{
                  marginBottom: 16,
                }}
              >
                Add a row
              </Button>
            </div>
            {/* <div className="col-md-3">
              <strong>SubTotal : {subTotal}</strong>
              <hr style={{ marginTop: '5px', marginBottom: '5px' }} />
              <strong>Total : {total}</strong>
              <hr style={{ marginTop: '5px', marginBottom: '5px' }} />

              {taxValue === 'NoTax' && (
                <div>
                  Amount are with : <strong>No Tax</strong>
                </div>
              )}
              {taxValue === 'TaxExclusive' && (
                <div>
                  Amount are with : <strong>Tax Exclusive</strong>
                </div>
              )}
              {taxValue === 'TaxInclusive' && (
                <div>
                  Amount are with : <strong>Tax Inclusive</strong>
                </div>
              )}
            </div> */}

            <div className="col-md-7">&nbsp;</div>
            <div className="col-md-5">
              {/* <div>
                <div className="row">
                  <div className="col-md-7 text-end">
                    <strong>Total</strong>
                  </div>
                  <div className="col-md-5 text-center">{total}</div>
                </div>
              </div> */}
              {/* <hr style={{ marginTop: '5px', marginBottom: '5px' }} /> */}
              <div style={{ border: '1px dashed', padding: '10px 0' }}>
                <div className="row">
                  <div className="col-md-7 text-end">SubTotal :</div>
                  <div className="col-md-5 text-center">{subTotal || '-'}</div>
                  <div className="col-md-7 text-end">Discount :</div>
                  <div className="col-md-5 text-center">{totalDiscount || '-'}</div>
                  <div className="col-md-7 text-end">Tax :</div>
                  <div className="col-md-5 text-center">{totalTax || '-'}</div>
                  <div className="col-md-7 text-end">
                    <strong>Total :</strong>
                  </div>
                  <div className="col-md-5 text-center">
                    <strong>{total || '-'}</strong>
                  </div>
                  <div className="col-md-7 text-end">Amount are with :</div>
                  <div className="col-md-5 text-center">
                    {taxValue === 'NoTax' && <strong>No Tax</strong>}
                    {taxValue === 'TaxExclusive' && <strong>Tax Exclusive</strong>}
                    {taxValue === 'TaxInclusive' && <strong>Tax Inclusive</strong>}
                  </div>

                  {/* <div className="col-md-7 text-end mb-1">Discount(%) :</div>
                  <div className="col-md-5 text-center mb-1">
                    <Form.Item name="disOnBill" className="mb-0">
                      <InputNumber
                        onChange={e => this.setState({ total: subTotal - (e * subTotal) / 100 })}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-md-7 text-end"> Tax (%):</div>
                  <div className="col-md-5 text-center mb-1">
                    <Form.Item name="taxOnBill" className="mb-0">
                      <InputNumber
                        onChange={e => this.setState({ total: subTotal + (subTotal / 100) * e })}
                      />
                    </Form.Item>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <hr />
            </div>
            <div className="col-md-6">
              <Form.Item name="terms" label="Terms">
                <TextArea />
              </Form.Item>
            </div>
            {/* <div className="col-md-12">
              <Form.Item name="status" label="Status">
                <Select placeholder="Select status" style={{ width: '200px' }}>
                  <Select.Option value="draft">Draft </Select.Option>
                  <Select.Option value="sent">Sent</Select.Option>
                  <Select.Option value="declined">Declined</Select.Option>
                  <Select.Option value="accepted">Accepted</Select.Option>
                </Select>
              </Form.Item>
            </div> */}
            <div className="col-md-12 text-center">
              <Button type="default" className="text-center" htmlType="submit">
                <strong>
                  <Link to="/purchase/orders">Cancel</Link>
                </strong>
              </Button>
              <Button type="primary" className="text-center" htmlType="submit">
                <strong>{action}</strong>
              </Button>
            </div>
          </div>
          {visible && (
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
          )}
        </Form>
      </>
    )
  }
}

const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})

export default connect(mapStateToProps)(CreatePurchaseOrder)

