import React, { useContext, useState, useEffect, useRef } from 'react'
import {
  Table,
  Popconfirm,
  Button,
  Input,
  Form,
  Select,
  Space,
  Divider,
  Modal,
  DatePicker,
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
import store from 'store'

// const selOrgData = store.get('selectedOrg')
import CreateProAndSer from '@/components/accountancy/productsAndServices/createProAndSer'

import CreateCustomer from '@/components/accountancy/contacts/createCustomer'
import ProductService from '@/services/products'
import CustomerService from '@/services/customer'
import QuotationService from '@/services/sales'
import TaxService from '@/services/settings'
import axios from 'axios'
import HelperFunction from '@/services/helper'
import { history } from '@/main'
// import ProductTable from './productTable'
import './index.scss'
import costCenter from '@/services/costCenter'
import CreateCostCenter from '@/pages/costCenter/createCostCenter'
import ProductTable from './productTable'
import WithRouter from '@/WithRouter'
const selOrgData = store.get('selectedOrg')

const { TextArea } = Input
const { Option } = Select
const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
))

class CreateOrder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDirty: false,
      deleteProdIds: [],
      currentProdId: {},
      selectedCust: {},
      custData: [],
      selectedCustId: {},
      masterOrderData: {},
      masterProdData: [],
      defaultData: [
        { name: 'taxType', value: 'NoTax' },
        { name: 'status', value: 'DRAFT' },
      ],
      action: 'Create',
      prodData: [],
      taxData: [],
      total: 0,
      subTotal: 0,
      totalTax: 0,
      totalDiscount: 0,
      totalAmtWoTax: 0,
      taxValue: 'NoTax',
      custName: '',
      name: '',
      count: 4,
      visible: false,
      isVisible: false,
      isShown: false,
      estimateDate: HelperFunction.getCurrentDate(),
      expiryDate: HelperFunction.getCurrentDate(),
      costCenterData: [],
      selectedCostCenter: {},
      isCreateCostCenterModal: false,
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
          sale_qty: 0,
          productQty: 0,
          rating: 0,
          sale_account: 0,
          sale_desc: '',
          sale_tax_rate: '',
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
        },
      ],
      filterOutColumns: [],
      discountNew: 0,
      discountNewAmt: 0,
      shippingCharges: 0,
      netAmount: 0,
      paymentTerms: '',
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
    // console.log(e, 'handleCompName', selected, custData)
    this.setState({ paymentTerms: selected[0].payment_terms })
    this.formRef.current.setFieldsValue({ paymentTerms: selected[0].payment_terms } || 'Net 30')
    this.passCustData(selected)
    this.formRef.current.setFieldsValue({ estimateDate: moment(new Date(), 'DD/MM/YYYY') })
    this.handlePurchaseDate(moment(new Date(), 'DD/MM/YYYY'))
  }

  fetchCustDataNew = () => CustomerService.customerList()

  fetchProdData = () => ProductService.productList()

  fetchTaxData = () => TaxService.taxList()

  fetCostCenter = () => costCenter.getRegion()

  handleNetAmount = (e, val) => {
    const { total, shippingCharges, discountNew, discountNewAmt } = this.state
    console.log(e, val)
    if (val === 'discount') {
      this.setState({
        discountNew: e,
        discountNewAmt: Number((e * total) / 100).toFixed(selOrgData?.decimals || 0),
        // e*total/100: shippingCharges,
        netAmount: Number(total - (e * total) / 100 + shippingCharges).toFixed(
          selOrgData?.decimals || 0,
        ),
      })
    } else {
      this.setState({
        // discountNew: 0,
        // discountNewAmt: 0,
        shippingCharges: Number(e).toFixed(selOrgData?.decimals || 0),
        netAmount: Number(total - discountNewAmt + e).toFixed(selOrgData?.decimals || 0),
      })
    }
  }

  componentDidMount = () => {
    const org = store.get('selectedOrg')
    // document.getElementsByClassName('initial__loading')[0].style.display = 'block'
    // let prodResult = []
    // let custResult = []
    const { params } = this.props
    const { columns } = this.state

    const getAllData = async prodVal => {
      const [customerData, productData, taxData, costCenterData] = await axios.all([
        this.fetchCustDataNew(),
        this.fetchProdData(),
        this.fetchTaxData(),
        this.fetCostCenter(),
      ])
      this.setState({
        costCenterData,
      })
      // console.log(fetchTaxData, 'fetchTaxData')
      // if (productData && productData.data.length) {
      //   productData.data.forEach((ele, i) => {
      //     ele.key = i + 1
      //   })
      // }

      const prodDataClone = _.cloneDeep(productData.data || [])
      const prodId = []
      prodVal.forEach(x => prodId.push(String(x.id)))
      const prodClone = prodDataClone.map((x, i) => {
        if (prodId.includes(String(x.id))) {
          x.disabled = true
          x.key = i + 1
        }
        return x
      })

      this.setState({
        // prodData: productData.data,
        // masterProdData: productData.data || [],
        prodData: prodClone || [],
        masterProdData: prodClone || [],
        custData: customerData,
        filterOutColumns: columns,
        taxData,
      })
    }
    // fetchProdData()
    if (params.orderId) {
      // console.log(params.orderId, '(params.invoiceId')
      const fetchInvoiceData = async () => {
        const result = await QuotationService.getOrder(params.orderId, 'get')
        // console.log(result, 'invoiceId result')
        // getQuotation(result ? result.data : [])
        const resultData = result?.data || []
        const getProductId = []
        resultData.productDto.forEach(x => {
          x.isEdit = true
          getProductId.push(x.id)
        })
        const stockData = await this.fetchStock({
          orgCode: org.orgCode,
          productId: getProductId.toString(),
        })
        // console.log(stockData, 'stockData', getProductId)
        resultData.productDto.forEach(x => {
          const selectedProd = stockData.filter(item => item.productId === x.id)
          x.stockonhand = selectedProd?.[0]?.stockonhand || ''
        })
        const data = []
        // console.log(resultData, 'resultData.length')
        if (resultData.id) {
          _.forEach(resultData, (val, key) => {
            // if (key !== 'productDto')
            data.push({
              name: [key],
              value: key === 'estimateDate' || key === 'expiryDate' || key === 'dueDate' ? moment(val) : val,
            })
          })
          this.setState(
            {
              defaultData: data,
              masterOrderData: result.data,
              subTotal: resultData.sub_total,
              total: resultData.total,
              totalDiscount: resultData.totalSaleDiscountAmount,
              totalTax: resultData.totalSaleTaxAmount,
              totalAmtWoTax: resultData.totalAmtWithoutTax,
              dataSource: resultData.productDto,
              taxValue: resultData.taxType,
              action: 'Update',
              expiryDate: resultData.expiryDate,
              estimateDate: resultData.estimateDate,
              selectedCustId: {
                customerId: resultData.customerId,
                firstName: resultData.firstName,
                lastName: resultData.lastName,
              },
              discountNew: resultData.discountNew,
              discountNewAmt: resultData.discountNewAmt,
              shippingCharges: resultData.shippingCharges,
              netAmount: resultData.netAmount,
            },
            () => getAllData(resultData.productDto),
          )
        }
      }
      fetchInvoiceData()
    } else {
      getAllData([])
    }
    window.addEventListener('beforeunload', this.handleBeforeUnload)
  }

  // showModal = (e, record) => {
  //   // console.log(e, record, 'e, record')
  //   const { visible } = this.state
  //   this.setState({
  //     visible: !visible,
  //     currentProdId: record,
  //   })
  // }

  showModal = (e, record, index) => {
    // console.log(e, record, 'e, record', index)
    const { visible } = this.state
    this.setState({
      visible: !visible,
      currentProdId: index,
    })
  }

  handleProduct = (e, record, from) => {
    // console.log(record, 'handleProduct')
    const { dataSource, prodData, currentProdId, masterProdData } = this.state
    const fields = this.formRef.current.getFieldsValue()
    const { productDto } = fields
    productDto.splice(currentProdId, 1, record)
    this.formRef.current.setFieldsValue({ productDto })

    this.setState(
      {
        dataSource: productDto,
        prodData: [...prodData, record],
        masterProdData: [...masterProdData, record],
      },
      () => this.updateProduct(record.id, record, 'name', currentProdId),
    )
  }

  formValuesChange = e => {
    const isDirty = Object.keys(e).length
    this.setState({ isDirty })
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

  // handleNewCustomer = record => {
  //   const { custData, isVisible } = this.state
  //   this.setState(
  //     {
  //       custData: [...custData, record],
  //       selectedCustId: {
  //         customerId: record.customer_id,
  //         firstName: record.customer_fname,
  //         lastName: record.customer_lname,
  //       },
  //     },
  //     () => this.handleCustModal(),
  //   )
  // }

  handleNewCustomer = record => {
    const { custData, isVisible } = this.state
    record.customer_id = record.customerId
    this.formRef.current.setFieldsValue({ customerId: record.customerId })
    this.setState(
      {
        custData: [...custData, record],
        selectedCust: {
          customer_id: record.customerId,
          customer_fname: record.customer_fname,
          customer_lname: record.customer_lname,
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

  handleProdModal = () => {
    const { visible } = this.state
    this.setState({
      visible: !visible,
    })
  }

  validateProductRow = data => {
    const tempArr = []
    if (_.isEmpty(data)) {
      return false
    }

    data.forEach(item => {
      if (item.sale_qty < 1 && item.sale_unit_price < 1) {
        item.saleQtyError = true
        item.saleUnitPriceError = true
        tempArr.push(true)
      } else if (item.sale_qty < 1 && item.sale_unit_price > 0) {
        item.saleQtyError = true
        item.saleUnitPriceError = false
        tempArr.push(true)
      } else if (item.sale_qty > 0 && item.sale_unit_price < 1) {
        item.saleQtyError = false
        item.saleUnitPriceError = true
        tempArr.push(true)
      } else {
        item.saleQtyError = false
        item.saleUnitPriceError = false
        tempArr.push(false)
      }

      if (item.saleDiscountPercent < 0) {
        item.saleDiscountPercentError = true
        tempArr.push(true)
      }
      // else if (item.purchaseDiscountPercent > 0) {
      //   item.purchaseDiscountPercentError = false
      //   tempArr.push(false)
      // }
    })
    // console.log(tempArr);
    this.formRef.current.setFieldsValue({ productDto: data })
    this.setState({
      dataSource: data,
      prodData: data,
    })
    return tempArr.every(element => element === true)
  }

  onFinish = values => {
    const {
      dataSource,
      estimateDate,
      expiryDate,
      totalTax,
      selectedCust,
      subTotal,
      total,
      totalAmtWoTax,
      totalDiscount,
      selectedCustId,
      masterOrderData,
      deleteProdIds,
      discountNew,
      discountNewAmt,
      shippingCharges,
      netAmount,
      selectedCostCenter,
      paymentTerms,
    } = this.state
    const { params, user } = this.props
    // console.log(values, 'values')
    // console.log('dataSource 123', selectedCust)
    const newData = Object.assign(masterOrderData, values)
    const org = store.get('selectedOrg')

    if (this.validateProductRow(values.productDto)) {
      return false
    }

    newData.productDto = values.productDto
    newData.sub_total = subTotal
    newData.total = total
    newData.firstName = selectedCust.customer_fname || selectedCustId.firstName
    newData.lastName = selectedCust.customer_lname || selectedCustId.lastName
    newData.customerId = selectedCust.customer_id || selectedCustId.customerId
    // newData.expiryDate = moment(document.getElementById('expiryDate').value).format('MM/DD/YYYY')
    newData.estimateDate = moment(document.getElementById('estimateDate').value).format(
      'MM/DD/YYYY',
    )
    newData.amount = total
    newData.totalSaleDiscountAmount = totalDiscount
    newData.totalSaleTaxAmount = totalTax
    newData.totalAmtWithoutTax = totalAmtWoTax
    newData.acceptStatus = false
    newData.productId = deleteProdIds.toString()
    newData.currency = org.currency
    newData.discountNew = discountNew
    newData.discountNewAmt = discountNewAmt
    newData.shippingCharges = shippingCharges
    newData.netAmount = netAmount
    newData.netSubTotal = total - discountNewAmt
    newData.dueDate = moment(values?.dueDate, 'DD MMM YYYY').format('MM/DD/YYYY')
    newData.payment_terms = values.paymentTerms

    const prodId = []
    dataSource.forEach((item, i) => {
      dataSource[i].productQty = item.sale_qty
      prodId.push(item.id)
    })
    // console.log(prodId)
    newData.product_id = prodId.toString()

    let method = 'post'
    // console.log(match, 'defaultData')
    if (params.orderId) {
      method = 'put'
      // newData.id = params.orderId
    }
    // newData.email = user.email
    newData.email = selectedCust.customer_email || masterOrderData.email

    // console.log(newData, 'values')
    const finalData = { ...newData, ...selectedCostCenter }
    const fetchData = async () => {
      const result = await QuotationService.createOrder(finalData, method)
      this.setState(
        {
          isDirty: false,
        },
        () => this.props.navigate('/sales/orders'),
      )
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

  // handleDescription = (e, record) => {
  //   const { dataSource, prodData } = this.state
  //   // console.log(e.target.name, e.target.value)
  //   // console.log(element,record)
  //   let prodItem = []
  //   record[e.target.name] = e.target.value
  //   dataSource.forEach(element => {
  //     // console.log(element, record)
  //     if (element.id === record.id) {
  //       prodItem = prodData.filter(item => item.id === parseInt(e.value, 10))
  //       Object.assign(element, prodItem[0])
  //       // element = e.label;
  //     }
  //   })

  //   this.setState({
  //     dataSource,
  //   })
  // }

  handleDescription = (e, row, record, index) => {
    // console.log(e.target.value, row, record, index)

    const { dataSource } = this.state

    dataSource.forEach(element => {
      if (element.id === record.id) {
        element.sale_desc = e.target.value
      }
    })

    this.formRef.current.setFieldsValue({ productDto: dataSource })
  }

  handleChange = (e = 0, record = {}, fieldName = '') => {
    // console.log(e, 'e', record, 'handleChange', fieldName)
    const { dataSource, taxValue, taxData, discountNew, shippingCharges } = this.state
    let amount = 0
    let subAmount = 0
    let totalTax = 0
    let totalDiscount = 0
    let totalAmtWoTax = 0
    let total = 0
    let subTotal = 0
    let name = ''
    let value = ''
    if (e && e.value && e.value.length && fieldName === 'productName') {
      const { value: val } = e
      name = 'productName'
      value = val
    } else if (fieldName === 'productForm') {
      const { value: val } = e
      name = 'productName'
      value = val
    } else if (fieldName === 'sale_tax_rate') {
      // const { value: val } = e
      name = 'sale_tax_rate'
      const taxObj = taxData.find(x => x?.id?.toString() === e.toString())
      value = taxObj?.rate || 0
    } else {
      // const { value: val, name: nameVal } = e.target
      name = fieldName
      value = e
    }
    dataSource.forEach(element => {
      // console.log(element, 'element', record)
      if (element.id === record.id) {
        if (name === 'sale_tax_rate') {
          element[name] = Number(e)
        } else {
          element[name] = Number(value)
        }
        let { sale_amount: sum, saleDiscountPercent: discount, sale_tax_rate: taxRate } = record
        const { sale_unit_price: unitPrice, sale_qty: quantity } = record
        // console.log(unitPrice, 'quantity', quantity)
        discount = discount || 0
        if (name === 'saleDiscountPercent') {
          discount = Number(value) || 0
          sum = quantity * unitPrice
          // console.log(sum, 'summm')
          subAmount += sum
          const taxObj = taxData.find(x => x.id === taxRate)
          taxRate = taxObj?.rate || 0
        } else if (name === 'sale_tax_rate') {
          // console.log('value', Number(value))
          taxRate = Number(value || 0) || 0
          sum = quantity * unitPrice
          subAmount += sum
        } else if (name === 'productName') {
          sum = quantity * unitPrice
          subAmount += sum
        } else {
          const currentField = ['sale_qty', 'sale_unit_price']
          _.remove(currentField, item => item === name)
          sum = _.reduce(
            currentField,
            (i, n) => {
              // console.log(Number(element[n]) * i)
              return Number(element[n]) * i
            },
            1,
          )
          sum = Number(value) * Number(sum)
          subAmount += sum
          const taxObj = taxData.find(x => x.id === taxRate)
          taxRate = taxObj?.rate || 0
          discount = discount || 0
        }
        // console.log(sum, 'taxable', discount)

        discount *= sum / 100
        totalDiscount += discount

        const taxable = sum - discount
        let tax = (taxable / 100) * taxRate
        if (taxValue === 'TaxInclusive') {
          const proTxRate = element.sale_tax_rate || 0
          // let txVal = (taxable * proTxRate) / (proTxRate + 100)
          const txVal = (taxable / (proTxRate + 100)) * 100

          // txVal = taxable - txVal
          // console.log(taxValue, 'taxValue', taxable, 'txVal', txVal)
          element.amountWithoutTax = parseFloat(txVal)
          totalAmtWoTax += txVal
          totalTax += tax
          amount = taxable
        } else if (taxValue === 'TaxExclusive') {
          totalTax += tax
          amount = taxable + tax
          element.amountWithoutTax = parseFloat(taxable) || 0
          totalAmtWoTax += taxable
        } else if (taxValue === 'NoTax') {
          totalTax += tax
          amount = quantity * unitPrice - discount
          element.amountWithoutTax = taxable
          element.sale_tax_rate = ''
          totalAmtWoTax += taxable || 0
          tax = 0
        }

        // amount = taxable + tax
        // element[name] = amount;
        // Object.assign(element, { sale_amount: amount })
        // console.log(amount, 'Amount', sum)
        element.sale_amount = amount || 0
        element.saleDiscountAmount = discount || 0
        element.saleTaxRateAmount = tax || 0
        element.sub_total = subAmount || 0
        total += amount || 0
        subTotal += subAmount || 0
      } else {
        total += parseFloat(element.sale_amount) || 0
        subTotal += (parseFloat(element.sale_qty) || 0) * (parseFloat(element.sale_unit_price) || 0)
        totalDiscount += parseFloat(element.saleDiscountAmount) || 0
        totalTax += parseFloat(element.saleTaxRateAmount) || 0
        totalAmtWoTax += parseFloat(element.amountWithoutTax) || 0
      }
      // console.log('element', element)
    })
    total = parseFloat(total || 0).toFixed(selOrgData?.decimals)
    subTotal = parseFloat(subTotal || 0).toFixed(selOrgData?.decimals)
    totalDiscount = parseFloat(totalDiscount || 0).toFixed(selOrgData?.decimals)
    totalTax = parseFloat(totalTax || 0).toFixed(selOrgData?.decimals)
    totalAmtWoTax = parseFloat(totalAmtWoTax || 0).toFixed(selOrgData?.decimals)

    this.formRef.current.setFieldsValue({ productDto: dataSource })
    const netAmount = total - (Number(discountNew || 0) * total) / 100 + Number(shippingCharges)
    this.setState({
      dataSource,
      total,
      subTotal,
      totalTax,
      totalDiscount,
      totalAmtWoTax,
      discountNewAmt: Number((discountNew * total) / 100).toFixed(selOrgData?.decimals),
      netAmount: Number(netAmount).toFixed(selOrgData?.decimals),
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

  // handleDelete = record => {
  //   const { dataSource, total, subTotal } = this.state
  //   this.setState({
  //     dataSource: dataSource.filter(item => item.key !== record.key),
  //     total: total - record.amount,
  //     subTotal: subTotal - record.amount,
  //   })
  // }
  setNewCostCenterData = async () => {
    const result = await costCenter.getRegion()
    this.setState({
      costCenterData: result,
    })
  }

  toggleCreateCostCenterModal = () => {
    const { isCreateCostCenterModal } = this.state
    this.setState({
      isCreateCostCenterModal: !isCreateCostCenterModal,
    })
    this.setNewCostCenterData()
  }

  handleSelectedCostCenter = e => {
    const { costCenterData } = this.state
    for (let i = 0; i < costCenterData?.length; ) {
      if (e === costCenterData[i]?.centerName) {
        this.setState({
          selectedCostCenter: {
            centerName: e,
            centerId: costCenterData[i].id,
          },
        })
      }
      i += 1
    }
  }

  handleShowHide = () => {
    const { isVisible } = this.state
    this.setState({
      isVisible: !isVisible,
    })
  }

  handleAdd = () => {
    const { count } = this.state
    const fields = this.formRef.current.getFieldsValue()

    const { productDto } = fields
    // console.log(productDto, 'productDto', count)
    const dataSource = productDto
    this.formRef.current.setFieldsValue({ productDto: dataSource })
    this.setState({
      dataSource,
    })
  }

  handleStDate = (date, dateString) => {
    // console.log(date, dateString, ' date, dateString')
    // const {estimateDate} = this.state
    // const val = moment(dateString).tz('Asia/Calcutta').format();
    if (date) {
      this.setState({
        estimateDate: date ? dateString : '',
      })
    }
  }

  handlePurchaseDate = (date, dateString) => {
    if (date) {
      // this.setState({
      //   purchaseDate: date ? dateString : '',
      // })

      const { paymentTerms, dueDate } = this.formRef.current.getFieldsValue()
      console.log(paymentTerms)
      const newDueDate = moment(date, 'DD/MM/YYYY')
      switch (paymentTerms) {
        case 'Net 15':
          newDueDate.add(15, 'days')
          break
        case 'Net 30':
          newDueDate.add(30, 'days')
          break
        case 'Net 45':
          newDueDate.add(45, 'days')
          break
        case 'Net 60':
          newDueDate.add(60, 'days')
          break
        case 'Due End of the month':
          newDueDate.endOf('month')
          break
        case 'Due End of the next month':
          newDueDate.add(30, 'days').endOf('month')
          break
        default:
          // use for custom
          this.formRef.current.setFieldsValue({ dueDate })
          return
      }

      this.formRef.current.setFieldsValue({ dueDate: newDueDate })
    }
  }

  handlePaymentTerms = paymentTerms => {
    // this.setState({paymentTerms: e})
    const { estimateDate, dueDate } = this.formRef.current.getFieldsValue()
    if (estimateDate) {
      const newDueDate = moment(estimateDate, 'DD/MM/YYYY')
      switch (paymentTerms) {
        case 'Net 15':
          newDueDate.add(15, 'days')
          break
        case 'Net 30':
          newDueDate.add(30, 'days')
          break
        case 'Net 45':
          newDueDate.add(45, 'days')
          break
        case 'Net 60':
          newDueDate.add(60, 'days')
          break
        case 'Due End of the month':
          newDueDate.endOf('month')
          break
        case 'Due End of the next month':
          newDueDate.add(30, 'days').endOf('month')
          break
        default:
          // use for custom date
          this.formRef.current.setFieldsValue({ dueDate })
          return
      }

      this.formRef.current.setFieldsValue({ dueDate: newDueDate })
    }
  }

  handleExDate = (date, dateString) => {
    // console.log(date, dateString, ' date, dateString')
    // const {estimateDate} = this.state
    // const val = moment(dateString).tz('Asia/Calcutta').format();

    if (date) {
      this.setState({
        expiryDate: date ? dateString : '',
      })
    }
  }

  onNameChange = event => {
    // console.log(event.target, 'temp', event.target)
    this.setState({
      custName: event.target.value,
    })
  }

  passCustData = data => {
    // console.log(data, 'selected Date')
    this.setState({
      selectedCust: data[0],
      // selectedCustId: { customerId: data[0].customer_id },
    })
  }

  handleTax = value => {
    const {
      columns,
      filterOutColumns,
      dataSource,
      taxData,
      discountNew,
      shippingCharges,
    } = this.state
    // console.log(filterOutColumns, 'filterOutColumns')
    let total = 0
    let subTotal = 0
    let totalAmtWoTax = 0
    let totalTax = 0
    const filterColumn = []

    dataSource.forEach(element => {
      let amount = Number(element.sale_qty) * (Number(element.sale_unit_price) || 0)
      const discount = ((Number(element.saleDiscountPercent) || 0) * amount) / 100
      let subAmount = 0
      subAmount += amount
      const taxable = amount - discount
      const taxObj = taxData.find(x => x.id === element.sale_tax_rate)
      const taxRate = taxObj?.rate || 0
      const tax = (taxable / 100) * (Number(taxRate) || 0)

      amount -= discount
      // console.log(tax, 'tax', element.sale_tax_rate)

      if (value === 'TaxInclusive') {
        const proTxRate = taxRate || 0
        // let txVal = (taxable * proTxRate) / (proTxRate + 100)
        const txVal = (taxable / (proTxRate + 100)) * 100

        // const txVal = (taxable / (proTxRate + 100) * 100)

        // txVal = taxable - txVal
        element.amountWithoutTax = parseFloat(txVal)
        // amount+= taxable
        element.sale_amount = taxable
        totalAmtWoTax += txVal
        totalTax += tax
      } else if (value === 'TaxExclusive') {
        element.amountWithoutTax = parseFloat(amount)
        totalAmtWoTax += amount
        amount += tax
        element.sale_amount = amount
        totalTax += tax
      } else if (value === 'NoTax') {
        element.sale_tax_rate = ''
        // amount += tax
        element.amountWithoutTax = amount
        totalAmtWoTax += amount
        element.sale_amount = amount
        element.saleTaxRateAmount = 0
        totalTax += 0
      }
      total += amount
      subTotal += subAmount
      // totalTax += totalTax
    })
    const netAmount = total - (discountNew * total) / 100 + Number(shippingCharges)
    this.setState({
      taxValue: value,
      columns: filterColumn,
      dataSource,
      totalTax: Number(totalTax).toFixed(selOrgData?.decimals),
      total: Number(total).toFixed(selOrgData?.decimals),
      subTotal: Number(subTotal).toFixed(selOrgData?.decimals),
      totalAmtWoTax: Number(totalAmtWoTax).toFixed(selOrgData?.decimals),
      discountNewAmt: Number((discountNew * total) / 100).toFixed(selOrgData?.decimals),
      netAmount: Number(netAmount).toFixed(selOrgData?.decimals),
    })
  }

  fetchStock = data => ProductService.getStockOnHand(data)

  updateProduct = async (e, row, keyName, index) => {
    const org = store.get('selectedOrg')
    // console.log(e, '|', row, '|', keyName, '|', index)
    const { prodData, dataSource, masterProdData } = this.state
    const result = await this.fetchStock({
      orgCode: org.orgCode,
      productId: e,
    })
    // console.log(result, 'result updateProduct')
    row.stockonhand = (result && result[0]?.stockonhand) || ''

    let idVal = e
    if (keyName === 'name') {
      idVal = e
      const selectedProd = prodData.filter(x => x.id === idVal)
      selectedProd[0].sale_amount = 0
      selectedProd[0].sale_qty = 1
      // selectedProd[0].sale_tax_rate = ''

      const returnedTarget = Object.assign(row, selectedProd[0])
      // const { productDto } = dataSource
      dataSource[index] = returnedTarget
      this.formRef.current.setFieldsValue({ productDto: dataSource })

      const prodDataClone = _.cloneDeep(masterProdData)
      const prodId = []
      dataSource.forEach(x => prodId.push(String(x.id)))
      // console.log(prodId, 'prodId', prodData)
      const data = prodDataClone.map(x => {
        if (prodId.includes(String(x.id))) {
          x.disabled = true
        }
        return x
      })
      // mockData.productDetailsDto = productDetailsDto
      this.setState({ prodData: data }, this.handleChange(e, selectedProd[0], 'productName'))
    }
  }

  handleDelete = (record, index) => {
    // console.log(record, index)
    const fields = this.formRef.current.getFieldsValue()
    const { productDto } = fields
    productDto.splice(index, 1)
    this.formRef.current.setFieldsValue({ productDto })

    const {
      total,
      subTotal,
      totalDiscount,
      totalTax,
      totalAmtWoTax,
      masterProdData,
      deleteProdIds,
      discountNew,
      shippingCharges,
    } = this.state
    const prodData = _.cloneDeep(masterProdData)
    const prodId = []

    const deleteProdIdVal = deleteProdIds || []
    if (record.isDeleted === false) {
      deleteProdIdVal.push(record.id)
    }

    productDto.forEach(x => prodId.push(String(x.id)))
    const data = prodData.map(x => {
      if (prodId.includes(String(x.id))) {
        x.disabled = true
      } else {
        x.disabled = false
      }
      return x
    })
    const itemTotal = (record.sale_qty || 0) * (record.sale_unit_price || 0)
    const newTotal = total - (record.sale_amount || 0)
    const netAmount = newTotal - (discountNew * newTotal) / 100 + Number(shippingCharges)
    this.setState(
      {
        dataSource: productDto,
        deleteProdIds: deleteProdIdVal,
        total: Number(total - (record.sale_amount || 0)).toFixed(selOrgData?.decimals),
        subTotal: Number(subTotal - (itemTotal || 0)).toFixed(selOrgData?.decimals),
        prodData: data,
        totalDiscount: Number(totalDiscount - (parseFloat(record.saleDiscountAmount) || 0)).toFixed(
          selOrgData?.decimals,
        ),
        totalTax: Number(totalTax - (parseFloat(record.saleTaxRateAmount) || 0)).toFixed(
          selOrgData?.decimals,
        ),
        totalAmtWoTax: Number(totalAmtWoTax - (parseFloat(record.amountWithoutTax) || 0)).toFixed(
          selOrgData?.decimals,
        ),
        discountNewAmt: Number((discountNew * newTotal) / 100).toFixed(selOrgData?.decimals),
        netAmount: Number(netAmount).toFixed(selOrgData?.decimals),
      },
      () => {},
    )
  }

  render() {
    const {
      dataSource,
      columns,
      items,
      custData,
      name,
      custName,
      isVisible,
      visible,
      isShown,
      total,
      subTotal,
      estimateDate,
      expiryDate,
      defaultData,
      action,
      taxValue,
      prodData,
      taxData,
      selectedCustId,
      totalSaleDiscountAmount,
      totalSaleTaxAmount,
      taxType,
      totalTax,
      totalDiscount,
      totalAmtWoTax,
      isDirty,
      discountNew,
      discountNewAmt,
      shippingCharges,
      netAmount,
      costCenterData,
      isCreateCostCenterModal,
      paymentTerms,
    } = this.state
    const { params } = this.props

    return (
      <>
        <Modal
          title="Add Customer"
          onOk={this.handleCustModal}
          onCancel={this.handleCustModal}
          visible={isVisible}
          className="customerModal"
          // okText="Add Product"
          footer={null}
          // style={{ width: '700px' }}
          width={1000}
        >
          <CreateCustomer
            fromModal
            getData={this.getData}
            handleNewCustomer={this.handleNewCustomer}
          />
        </Modal>
        <Form
          className="createForm form__layout--css"
          layout="horizontal"
          fields={defaultData}
          onFinish={this.onFinish}
          ref={this.formRef}
          onFinishFailed={this.onFinishFailed}
          onValuesChange={this.formValuesChange}
        >
          <Row className="mb-3 form__header--css">
            <Col span={20} style={{ fontSize: '18px' }}>
              {params?.orderId ? (
                <span>Edit: {params?.orderId}</span>
              ) : (
                'New Sales Order'
              )}
            </Col>
            <Col span={4} className="text-end">
              <Button type="default" className="text-center me-2" htmlType="submit">
                <Link to="/sales/orders">Cancel</Link>
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
                  custData={custData}
                  handleShowHide={this.handleShowHide}
                  passCustData={this.passCustData}
                  selectedCustId={selectedCustId.customerId}
                /> */}
                      <Select
                        // style={{ width: 240 }}
                        placeholder="Select/Add Customer"
                        value={custData.length ? selectedCustId : ''}
                        onChange={e => this.handleCompName(e)}
                        showSearch
                        optionFilterProp="children"
                        popupRender={menu => (
                          <div>
                            <Divider style={{ margin: '4px 0' }} />
                            <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                              <Button
                                onClick={() => {
                                  this.handleShowHide()
                                }}
                                role="button"
                              >
                                <PlusOutlined /> Add Customer
                              </Button>
                            </div>
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
                      name="estimateDate"
                      label="Date"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please select date',
                        },
                      ]}
                    >
                      {/* <Space direction="vertical" size={12}>
                  <DatePicker
                    onChange={this.handleStDate}
                    defaultValue={moment('', 'YYYY/MM/DD')}
                    format="YYYY/MM/DD"
                    value={moment(estimateDate, 'YYYY/MM/DD')}
                  />
                </Space> */}
                      <DatePicker
                        style={{ width: '100%' }}
                        format="DD MMM YYYY"
                        defaultValue={moment(new Date(), 'DD/MM/YYYY')}
                        onChange={this.handlePurchaseDate}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {/* <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="expiryDate"
                      label="Expiry"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please select date',
                        },
                      ]}
                    >
                      <Space direction="vertical" size={12}>
                  <DatePicker
                    onChange={this.handleExDate}
                    defaultValue={moment('2021/01/01', 'YYYY/MM/DD')}
                    format="YYYY/MM/DD"
                    value={moment(expiryDate, 'YYYY/MM/DD')}
                  />
                </Space>
                      <DatePicker style={{ width: '100%' }} format="DD MMM YYYY" />
                    </Form.Item>
                  </Col>
                </Row>
              </Col> */}
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="paymentTerms"
                      label="Payment terms"
                      className="form__input--label text-start"
                      rules={[
                        {
                          required: true,
                          message: 'Please select value!',
                        },
                      ]}
                    >
                      <Select
                        // style={{ width: 240 }}
                        placeholder=""
                        onChange={this.handlePaymentTerms}
                        defaultValue={paymentTerms}
                        value={paymentTerms}
                        showSearch
                        optionFilterProp="children"
                      >
                        <Option value="Net 15">Net 15 </Option>
                        <Option value="Net 30">Net 30 </Option>
                        <Option value="Net 45">Net 45</Option>
                        <Option value="Net 60">Net 60</Option>
                        <Option value="Due End of the month">Due End of the month</Option>
                        <Option value="Due End of the next month">Due End of the next month</Option>
                        <Option value="custom">Custom</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="dueDate"
                      label="Due Date"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please select date!',
                        },
                      ]}
                    >
                      <DatePicker
                        style={{ width: '100%' }}
                        onChange={this.handleDueDate}
                        format="DD MMM YYYY"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {/* <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="orderNo"
                      className="form__input--label not--required--field"
                      label="Order Number"
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                </Row>
              </Col> */}
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="orderNo"
                      label="SO Number"
                      className="form__input--label not--required--field"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Please enter PO No',
                      //   },
                      // ]}
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
                      name="costCenter"
                      label="Region"
                      className="form__input--label not--required--field"
                      rules={[
                        {
                          message: 'Please select Region!',
                        },
                      ]}
                    >
                      <Select
                        // style={{ width: 100 }}
                        onChange={e => this.handleSelectedCostCenter(e)}
                        showSearch
                        optionFilterProp="children"
                        popupRender={menu => (
                          <div>
                            <Divider style={{ margin: '4px 0' }} />
                            <Button
                              onClick={e => this.toggleCreateCostCenterModal()}
                              // className="me-3"
                              style={{ display: 'flex', margin: '0 auto' }}
                            >
                              <PlusOutlined />
                              Add Region
                            </Button>
                            {menu}
                          </div>
                        )}
                      >
                        {costCenterData.map(ele => {
                          return (
                            <Option value={ele.centerName} key={ele.centerName}>
                              {ele.centerName}
                            </Option>
                          )
                        })}
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
                      //     message: 'Please enter reference',
                      //   },
                      // ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
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
            </div>
            <div className="col-md-6" style={{ display: isShown ? 'block' : 'none' }}>
              <Form.Item name="title" label="Title">
                <Input />
              </Form.Item>
            </div>
            <div className="col-md-6" style={{ display: isShown ? 'block' : 'none' }}>
              <Form.Item name="desc" label="Description">
                <TextArea />
              </Form.Item>
            </div> */}

                    {/* <div className="col-md-4">
              <Form.Item
                name="currency"
                label="Currency"
                rules={[
                  {
                    required: true,
                    message: 'Please select currency',
                  },
                ]}
              >
                <Select style={{ width: 240 }} placeholder="">
                  <Option value="KWD">KWD </Option>
                  <Option value="INR">INR</Option>
                </Select>
              </Form.Item>
            </div> */}

                    <Form.Item
                      name="taxType"
                      label="Amounts Are"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please select tax type',
                        },
                      ]}
                    >
                      <Select placeholder="" onChange={e => this.handleTax(e)}>
                        <Option value="TaxExclusive">Tax Exclusive </Option>
                        <Option value="TaxInclusive">Tax Inclusive</Option>
                        <Option value="NoTax">No Tax</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              {/* <div className="col-md-12">
              <Table
                pagination={false}
                dataSource={dataSource}
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
            </div> */}
              <Col span={24} className="fs-13 text-uppercase mb-3">
                <span className="bulletIcon">Products</span>
              </Col>

              <Col span={24}>
                <Form.List name="productDto">
                  {(productDto, options) => {
                    // console.log(dataSource, 'dataSource.productDto')
                    return (
                      <ProductTable
                        // productDetailsDto={productDetailsDto}
                        add={options.add}
                        remove={options.remove}
                        productData={prodData}
                        // handleDelete={this.handleDelete}
                        handleAddRow={this.handleAdd}
                        itemData={dataSource || []}
                        taxData={taxData || []}
                        updateProduct={this.updateProduct}
                        updateRow={this.handleChange}
                        // updateQtyRow={this.updateQtyRow}
                        // handleAddRow={this.handleAddRow}
                        handleDeleteRow={this.handleDelete}
                        handleDescription={this.handleDescription}
                        showModal={this.showModal}
                        taxValue={taxValue}
                      />
                    )
                  }}
                </Form.List>
              </Col>

              {/* <div className="col-md-9">
              <Button
                onClick={this.handleAdd}
                type="primary"
                style={{
                  marginBottom: 16,
                }}
              >
                Add a row
              </Button>
            </div> */}
              {/* <div className="col-md-7">&nbsp;</div>
            <div className="col-md-5">
              <div style={{ border: '1px dashed', padding: '10px 0' }}>
                <div className="row">
                  <div className="col-md-7 text-end">SubTotal :</div>
                  <div className="col-md-5 text-center">{subTotal || '-'}</div>
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
                </div>
              </div>
            </div> */}
              <Col span={10} offset={14} className="mt-3 total__section">
                <div className="total__section--con">
                  <Row>
                    <div className="col-md-7 text-start ps-5 pt-2">SubTotal :</div>
                    <div className="col-md-5 text-end pt-2">{subTotal || '-'}</div>
                    <div className="col-md-7 text-start ps-5 pt-2">Discount :</div>
                    <div className="col-md-5 text-end pt-2">{totalDiscount || '-'}</div>
                    <div className="col-md-7 text-start ps-5 pt-2">Tax :</div>
                    <div className="col-md-5 text-end pt-2">{totalTax || '-'}</div>
                    <div className="col-md-7 text-start ps-5 pt-2">Amount are with :</div>
                    <div className="col-md-5 text-end pt-2">
                      {taxValue === 'NoTax' && <strong>No Tax</strong>}
                      {taxValue === 'TaxExclusive' && <strong>Tax Exclusive</strong>}
                      {taxValue === 'TaxInclusive' && <strong>Tax Inclusive</strong>}
                    </div>
                    <div className="col-md-7 text-start ps-5 pt-2">
                      <strong>Total :</strong>
                    </div>
                    <div className="col-md-5 text-end pt-2">
                      <strong>{total || '-'}</strong>
                    </div>
                    <div className="col-md-7 text-start ps-5 pt-2">Extra Discount % </div>
                    <div className="col-md-5 text-start pt-2">
                      {/* "discountNew" || '-' */}
                      <InputNumber
                        formatter={HelperFunction.isValidNumNew}
                        placeholder="%"
                        onChange={e => this.handleNetAmount(e, 'discount')}
                        defaultValue={discountNew || '-'}
                        value={discountNew}
                        min={0}
                      />
                      &nbsp;&nbsp; {discountNewAmt || '-'}
                    </div>
                    {/* <div className="col-md-7 text-start ps-5 pt-2">Discount Amt </div>
                    <div className="col-md-5 text-start pt-2">{discountNewAmt || '-'}</div> */}
                    <div className="col-md-7 text-start ps-5 pt-2">Shipping Charges </div>
                    <div className="col-md-5 text-start pt-2">
                      <InputNumber
                        formatter={HelperFunction.isValidNumNew}
                        // placeholder="%"
                        value={shippingCharges}
                        onChange={e => this.handleNetAmount(e, 'shipping')}
                        min={0}
                      />
                      &nbsp;&nbsp;{' '}
                      {Number((total || 0) - (discountNewAmt || 0)).toFixed(selOrgData?.decimals) ||
                        '-'}
                    </div>
                    <div className="col-md-7 text-start ps-5 pt-2  pb-3">
                      <strong>Net Amount </strong>
                    </div>
                    <div className="col-md-5 text-start pt-2 pb-3">
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

              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item name="terms" label={null}>
                      <TextArea />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <hr />
            <div className="form__footer text-end">
              <Form.Item
                name="status"
                label="Status"
                className="status__dropdown me-2 text-center"
                rules={[
                  {
                    required: true,
                    message: 'Please select status',
                  },
                ]}
              >
                <Select placeholder="Select status">
                  <Select.Option value="DRAFT">Draft </Select.Option>
                  <Select.Option value="SENT">Sent</Select.Option>
                  <Select.Option value="DECLINED">Declined</Select.Option>
                  <Select.Option value="ACCEPTED">Accepted</Select.Option>
                </Select>
              </Form.Item>
              <Button type="default" className="text-center me-2" htmlType="submit">
                <Link to="/sales/orders">Cancel</Link>
              </Button>
              <Button type="primary" className="text-center me-3" htmlType="submit">
                {action}
              </Button>
            </div>
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

          {visible && (
            <Modal
              title="Create Product And Service"
              onOk={this.handleProdModal}
              onCancel={this.handleProdModal}
              visible={visible}
              className="customerModal"
              // okText="Add Product"
              footer={null}
              // style={{ width: '700px' }}
              width={1000}
            >
              <CreateProAndSer
                headingText="Create Product And Service"
                visible={visible}
                productId=""
                // loadData={loadData}
                // productData={}
                handleChange={this.handleProduct}
                showModal={this.handleProdModal}
                isOutside
                fromModal
              />
            </Modal>
          )}</Form>
      </>
    )
  }
}

const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})

export default connect(mapStateToProps)(WithRouter(CreateOrder))


