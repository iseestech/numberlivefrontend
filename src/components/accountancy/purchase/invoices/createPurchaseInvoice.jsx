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
  InputNumber,
  DatePicker,
  notification,
  Row,
  Col,
} from 'antd'
import { MenuOutlined, PlusOutlined } from '@ant-design/icons'
// import { arrayMove } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import axios from 'axios'
import store from 'store'
import CreateProAndSer from '@/components/accountancy/productsAndServices/createProAndSer'
import CreateVendor from '@/components/accountancy/contacts/vendor/createVendor'
import ProductService from '@/services/products'
// import VendorService from '@/services/customer'
import CustomerService from '@/services/customer'
import VendorService from '@/services/vendor'
import PurchaseService from '@/services/purchase'
import TaxService from '@/services/settings'
import { history } from '@/main'
import './index.scss'
import HelperFunction from '@/services/helper'
import ProductTable from './productTable'
import CreateTax from '../../settings/taxes/createTax'
import CreateCostCenter from '../../../../pages/costCenter/createCostCenter'
import costCenter from '../../../../services/costCenter'
import WithRouter from '@/WithRouter'
const selOrgData = store.get('selectedOrg')
const { TextArea } = Input
const { Option } = Select

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
      {custData.map(item => (
        <Option value={item.id} key={`${item.companyName}_${item.id}`}>
          {`${item.firstName} ${item.lastName} (${item.companyName})`}
        </Option>
      ))}
    </Select>
  )
}
class CreatePurchaseInvoice extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDirty: false,

      items: [
        { name: 'jack', key: 1 },
        { name: 'lucy', key: 2 },
      ],
      currentProdId: {},
      deleteProdIds: [],
      visible: false,
      selectedCust: {},
      masterOrderData: {},
      custData: [],
      totalDiscount: 0,
      totalTax: 0,
      prodData: [],
      taxData: [],
      masterProdData: [],
      totalAmtWoTax: 0,
      costCenterData: [],
      selectedCostCenter: {},
      isCreateCostCenterModal: false,
      defaultData: [
        { name: 'taxType', value: 'NoTax' },
        { name: 'productDto', value: [{}] },
      ],
      taxValue: 'NoTax',
      action: 'Create',
      selectedCustId: {},
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
        },
      ],
      filterOutColumns: [],
      isTaxModalVisible: false,
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
    const data = custData
    const selected = data.filter(item => item.id === parseInt(e, 10))
    // console.log(e, 'handleCompName', selected, data)
    this.setState({ paymentTerms: selected[0].payment_terms })
    this.formRef.current.setFieldsValue({ paymentTerms: selected[0].payment_terms } || 'Net 30')
    this.passCustData(selected)
    this.formRef.current.setFieldsValue({ estimateDate: moment(new Date(), 'DD/MM/YYYY') })
    this.handlePurchaseDate(moment(new Date(), 'DD/MM/YYYY'))
  }

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

  fetchProducts = () => ProductService.productList()

  fetchTaxes = () => TaxService.taxList()

  fetCostCenter = () => costCenter.getRegion()

  componentDidMount = () => {
    const org = store.get('selectedOrg')
    // document.getElementsByClassName('initial__loading')[0].style.display = 'block'

    // let prodResult = []
    let custResult = []
    const { columns, defaultData, dataSource } = this.state
    const { params } = this.props
    const fetchProdData = async prodVal => {
      const [prodResult, taxData, costCenterData] = await axios.all([
        this.fetchProducts(),
        this.fetchTaxes(),
        this.fetCostCenter(),
      ])
      this.setState({
        costCenterData,
      })
      // console.log(prodResult, 'prodResult')
      // if (prodResult && prodResult.data.length) {
      //   prodResult.data.forEach((ele, i) => {
      //     ele.key = i + 1
      //   })
      //   // getProductList(result.data);
      // }

      const prodDataClone = _.cloneDeep(prodResult.data || [])
      const prodId = []
      prodVal.forEach(x => prodId.push(String(x.id)))
      // console.log(prodDataClone, prodId, '123', dataSource)
      const prodClone = prodDataClone.map((x, i) => {
        if (prodId.includes(String(x.id))) {
          x.disabled = true
          x.key = i + 1
        }
        return x
      })

      this.setState(
        {
          prodData: prodClone || [],
          masterProdData: prodClone || [],
          filterOutColumns: columns,
          taxData,
        },
        () => fetchCustData(),
      )
    }
    // const fetchProdData = async () => {
    //   prodResult = await ProductService.productList()
    //   // console.log(prodResult, 'result')
    //   if (prodResult && prodResult.data.length) {
    //     prodResult.data.forEach((ele, i) => {
    //       ele.key = i + 1
    //     })
    //     // getProductList(result.data);
    //     this.setState({ prodData: prodResult.data, filterOutColumns: columns }, () =>
    //       fetchCustData(),
    //     )
    //   }
    // }

    const fetchCustData = async () => {
      custResult = await VendorService.customerList()
      // console.log(custResult, 'custResult')
      this.setState({ custData: custResult })
    }
    // fetchProdData()
    if (params.purchaseId) {
      // console.log(match.params.purchaseId, '(match.params.invoiceId')
      const fetchInvoiceData = async () => {
        const result = await PurchaseService.getPurchaseInvoice(params.purchaseId)
        // console.log(result, 'invoiceId result')
        // getQuotation(result ? result.data : [])
        const resultData = result.data || []
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
              value: key === 'estimateDate' || key === 'expiryDate' ? moment(val) : val,
            })
          })
          // console.log(data, 'data')
          this.setState(
            {
              defaultData: data,
              masterOrderData: result.data,
              subTotal: resultData.sub_total,
              total: resultData.total,
              totalDiscount: resultData.totalPurchaseDiscountAmount,
              totalTax: resultData.totalPurchaseTaxAmount,
              totalAmtWoTax: resultData.totalAmtWithoutTax,
              dataSource: resultData.productDto ? resultData.productDto : [],
              taxValue: resultData.taxType,
              action: 'Update',
              purchaseDate: resultData.estimateDate || new Date(),
              deliveryDate: resultData.expiryDate || new Date(),
              selectedCustId: {
                vendorId: resultData.vendorId,
                firstName: resultData.firstName,
                lastName: resultData.lastName,
              },
              discountNew: resultData.discountNew,
              discountNewAmt: resultData.discountNewAmt,
              shippingCharges: resultData.shippingCharges,
              netAmount: resultData.netAmount,
            },
            () => fetchProdData(resultData.productDto),
          )
        }
      }
      fetchInvoiceData()
    } else {
      fetchProdData([])
    }

    window.addEventListener('beforeunload', this.handleBeforeUnload)
  }

  formValuesChange = e => {
    const isDirty = Object.keys(e).length
    this.setState({ isDirty })
  }

  validateProductRow = data => {
    const tempArr = []
    if (_.isEmpty(data)) {
      return false
    }

    data.forEach(item => {
      if (item.purchase_qty < 1 && item.purchase_unit_price < 1) {
        item.purchaseQtyError = true
        item.purchaseUnitPriceError = true
        tempArr.push(true)
      } else if (item.purchase_qty < 1 && item.purchase_unit_price > 0) {
        item.purchaseQtyError = true
        item.purchaseUnitPriceError = false
        tempArr.push(true)
      } else if (item.purchase_qty > 0 && item.purchase_unit_price < 1) {
        item.purchaseQtyError = false
        item.purchaseUnitPriceError = true
        tempArr.push(true)
      } else {
        item.purchaseQtyError = false
        item.purchaseUnitPriceError = false
        tempArr.push(false)
      }

      if (item.purchaseDiscountPercent < 0) {
        item.purchaseDiscountPercentError = true
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
      selectedCust,
      subTotal,
      totalTax,
      totalAmtWoTax,
      totalDiscount,
      total,
      defaultData,
      masterOrderData,
      selectedCustId,
      deleteProdIds,
      discountNew,
      discountNewAmt,
      shippingCharges,
      netAmount,
      selectedCostCenter,
    } = this.state

    // console.log(values, 'values')
    const { params, user } = this.props
    const org = store.get('selectedOrg')

    if (this.validateProductRow(values.productDto)) {
      return false
    }

    // console.log(selectedCustId, 'dataSource 123', selectedCust)
    const newData = Object.assign(masterOrderData, values)
    newData.productDto = values.productDto
    newData.sub_total = subTotal
    newData.total = total
    newData.accepted = 'APPROVE'
    newData.firstName = selectedCust.firstName || selectedCustId.firstName
    newData.lastName = selectedCust.lastName || selectedCustId.lastName
    newData.vendorId = selectedCust.id || selectedCustId.vendorId
    newData.purchaseinvoicedate = moment(document.getElementById('estimateDate').value).format(
      'MM/DD/YYYY',
    )
    newData.estimateDate = moment(document.getElementById('estimateDate').value).format(
      'MM/DD/YYYY',
    )
    // newData.expiryDate = document.getElementById('expiryDate').value
    newData.amount = total
    newData.totalPurchaseDiscountAmount = totalDiscount
    newData.totalPurchaseTaxAmount = totalTax
    newData.totalAmtWithoutTax = totalAmtWoTax
    newData.terms = values.terms
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
      dataSource[i].productQty = item.purchase_qty
      prodId.push(item.id)
    })
    // console.log(prodId)
    newData.product_id = prodId.toString()

    let method = 'post'
    if (params.purchaseId) {
      method = 'put'
      // values.id = match.params.purchaseId
      newData.purchase_order_no = params.purchaseId
    }
    // newData.email = user.email
    newData.email = selectedCust.vendorEmail || masterOrderData.email

    // console.log(newData, 'values')
    const finalData = { ...newData, ...selectedCostCenter }
    const fetchData = async () => {
      const result = await PurchaseService.createPurchaseInvoice(finalData, method)
      // console.log(result, 'result')
      this.setState(
        {
          isDirty: false,
        },
        () => {
          if (result && result?.data?.statusCode === 409) {
            notification.warning({
              message: 'Warning',
              description: result?.data?.message,
            })
          } else {

            this.props.navigate('/purchase/invoices');
          }
        },
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

  handleName = (e, record) => {
    // console.log(e, record)
    const { dataSource, masterProdData } = this.state
    let prodItem = []
    const prodData = _.cloneDeep(masterProdData)
    const prodId = []

    dataSource.forEach(element => {
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

  handleChange = (e, record, colName) => {
    // console.log(e, 'e', record, 'handleChange', colName)
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
    if (e && e.value && e.value.length && colName === 'productName') {
      const { value: val } = e
      name = 'productName'
      value = val
    } else if (colName === 'purchase_tax_rate') {
      // const { value: val, label } = e
      // const newVal = label.split('(')[1].split('%')[0]
      // console.log(newVal, 'newVal')
      name = 'purchase_tax_rate'
      const taxObj = taxData.find(x => x?.id?.toString() === e.toString())
      value = taxObj?.rate || 0
    } else {
      // const { value: val, name: nameVal } = e.target
      name = colName
      value = e
    }
    dataSource.forEach(element => {
      // console.log(element, 'element', record)
      if (element.id === record.id) {
        if (name === 'purchase_tax_rate') {
          element[name] = Number(e)
        } else {
          element[name] = Number(value)
        }
        let {
          purchase_amount: sum,
          purchaseDiscountPercent: discount,
          purchase_tax_rate: taxRate,
        } = record
        const { purchase_unit_price: unitPrice, purchase_qty: quantity } = record

        if (name === 'purchaseDiscountPercent') {
          discount = Number(value)
          // console.log(discount, 'discount999999999', sum)
          sum = quantity * unitPrice
          subAmount += sum
          const taxObj = taxData.find(x => x.id === taxRate)
          taxRate = taxObj?.rate || 0
        } else if (name === 'purchase_tax_rate') {
          taxRate = Number(value)
          sum = quantity * unitPrice
          subAmount += sum
        } else if (name === 'productName') {
          // console.log('value', value)
          // console.log(record, 'productName in')
          // element.purchase_qty = 0
          // element.purchase_amount = 0
          sum = quantity * unitPrice
          subAmount += sum
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
          subAmount += sum
          const taxObj = taxData.find(x => x.id === taxRate)
          taxRate = taxObj?.rate || 0
          discount = discount || 0
        }

        discount *= sum / 100
        totalDiscount += discount
        // console.log(discount, '999999', quantity)

        const taxable = sum - discount
        const tax = (taxable / 100) * taxRate
        // console.log(discount, 'discount', sum, 'sum', taxable, tax, taxRate)

        // totalTax += tax
        // amount = taxable + tax
        // console.log(taxValue, 'taxValue', taxable)
        if (taxValue === 'TaxInclusive') {
          const proTxRate = element.purchase_tax_rate || 0
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
          element.purchase_tax_rate = ''
          totalAmtWoTax += taxable
        }

        element.purchase_amount = amount || 0
        element.purchaseDiscountAmount = discount || 0
        element.purchaseTaxRateAmount = tax || 0
        element.sub_total = subAmount || 0
        total += amount || 0
        subTotal += subAmount || 0
        // console.log(subTotal, 'subTotal')
      } else {
        // console.log('IN Else')
        // console.log(element.purchaseDiscountAmount, 'purchase_amount', element.purchase_amount)
        total += parseFloat(element.purchase_amount) || 0
        subTotal +=
          (parseFloat(element.purchase_qty) || 0) * (parseFloat(element.purchase_unit_price) || 0)
        totalDiscount += parseFloat(element.purchaseDiscountAmount) || 0
        totalTax += parseFloat(element.purchaseTaxRateAmount) || 0
        totalAmtWoTax += parseFloat(element.amountWithoutTax) || 0
      }
    })
    // console.log(totalDiscount, 'totalDiscount', total)

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

    const deleteProdIdVal = deleteProdIds || []
    if (record.isDeleted === false) {
      deleteProdIdVal.push(record.id)
    }

    const prodData = _.cloneDeep(masterProdData)
    const prodId = []
    productDto.forEach(x => prodId.push(String(x.id)))
    const data = prodData.map(x => {
      if (prodId.includes(String(x.id))) {
        x.disabled = true
      } else {
        x.disabled = false
      }
      return x
    })
    const itemTotal = (record.purchase_qty || 0) * (record.purchase_unit_price || 0)
    const newTotal = total - (record.purchase_amount || 0)
    const netAmount = newTotal - (discountNew * newTotal) / 100 + Number(shippingCharges)
    this.setState(
      {
        dataSource: productDto,
        deleteProdIds: deleteProdIdVal,
        total: Number(total - (record.purchase_amount || 0)).toFixed(selOrgData?.decimals),
        subTotal: Number(subTotal - (itemTotal || 0)).toFixed(selOrgData?.decimals),
        prodData: data,
        totalDiscount: Number(
          totalDiscount - (parseFloat(record.purchaseDiscountAmount) || 0),
        ).toFixed(selOrgData?.decimals),
        totalTax: Number(totalTax - (parseFloat(record.purchaseTaxRateAmount) || 0)).toFixed(
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

  handleDescription = (e, row, record, index) => {
    // console.log(e.target.value, row, record, index)

    const { dataSource } = this.state

    dataSource.forEach(element => {
      if (element.id === record.id) {
        element.purchase_desc = e.target.value
      }
    })

    this.formRef.current.setFieldsValue({ productDto: dataSource })
  }

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
    // console.log('handleShowHide')
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

  handleDueDate = (date, dateString) => {
    this.formRef.current.setFieldsValue({ paymentTerms: 'Custom' })
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
    this.formRef.current.setFieldsValue({ vendorId: record.id })
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
    this.setState({
      isVisible: false,
    })
  }

  handleProdModal = () => {
    const { visible } = this.state
    this.setState({
      visible: !visible,
    })
  }

  handleCustModalCancel = () => {
    // const { isVisible } = this.state
    this.setState({
      isVisible: false,
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
    let totalTax = 0
    let totalAmtWoTax = 0
    const filterColumn = []

    dataSource.forEach(element => {
      let amount = Number(element.purchase_qty) * (Number(element.purchase_unit_price) || 0)
      const discount = ((Number(element.purchaseDiscountPercent) || 0) * amount) / 100
      let subAmount = 0
      subAmount += amount
      const taxable = amount - discount
      const taxObj = taxData.find(x => x.id === element.purchase_tax_rate)
      const taxRate = taxObj?.rate || 0
      const tax = (taxable / 100) * (Number(taxRate) || 0)

      amount -= discount

      if (value === 'TaxInclusive') {
        const proTxRate = taxRate || 0
        // let txVal = (taxable * proTxRate) / (proTxRate + 100)
        const txVal = (taxable / (proTxRate + 100)) * 100
        // txVal = taxable - txVal
        element.amountWithoutTax = parseFloat(txVal)
        // amount+= taxable
        element.purchase_amount = taxable
        totalAmtWoTax += txVal
        totalTax += tax
      } else if (value === 'TaxExclusive') {
        element.amountWithoutTax = parseFloat(amount)
        totalAmtWoTax += amount
        amount += tax
        element.purchase_amount = amount
        totalTax += tax
      } else if (value === 'NoTax') {
        element.purchase_tax_rate = ''
        // amount += tax
        element.amountWithoutTax = amount
        // totalAmtWoTax = 0
        totalAmtWoTax += amount
        element.purchase_amount = amount
        element.purchaseTaxRateAmount = 0
        totalTax += 0
      }
      total += amount
      subTotal += subAmount
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
    row.stockonhand = (result && result[0]?.stockonhand) || ''
    let idVal = e
    if (keyName === 'name') {
      idVal = e
      const selectedProd = prodData.filter(x => x.id === idVal)
      selectedProd[0].purchase_amount = 0
      selectedProd[0].purchase_qty = 1
      // selectedProd[0].purchase_tax_rate = ''
      selectedProd[0].stockonhand = row.stockonhand

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
        } else {
          x.disabled = false
        }
        return x
      })
      // mockData.productDetailsDto = productDetailsDto
      this.setState({ prodData: data }, this.handleChange(e, selectedProd[0], 'productName'))
    }
  }

  showTaxModal = (e, record) => {
    this.setState({
      isTaxModalVisible: true,
      selectedRecord: record || {},
    })
  }

  getTaxData = obj => {
    const { selectedRecord, taxData } = this.state
    // console.log('getTaxData', obj)
    this.setState(
      {
        taxData: [...taxData, { ...obj, tax_name: obj.taxName }],
      },
      () => {
        this.handleChange(obj.rate, selectedRecord, 'purchase_tax_rate')
      },
    )
  }

  render() {
    const {
      dataSource,
      visible,
      columns,
      items,
      custData,
      taxValue,
      name,
      prodData,
      custName,
      isVisible,
      isShown,
      total,
      subTotal,
      purchaseDate,
      deliveryDate,
      defaultData,
      action,
      selectedCustId,
      totalDiscount,
      totalTax,
      taxData,
      filterOutColumns,
      isDirty,
      isTaxModalVisible,
      discountNew,
      discountNewAmt,
      shippingCharges,
      netAmount,
      costCenterData,
      isCreateCostCenterModal,
      paymentTerms,
    } = this.state
    const { match } = this.props
    // const routeName = match.path.split('/')

    return (
      <>
        {isVisible && (
          <Modal
            title="Add Vendor"
            onOk={this.handleCustModal}
            onCancel={this.handleCustModalCancel}
            visible={isVisible}
            // className="customerModal"
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
          className="createForm form__layout--css"
          layout="horizontal"
          fields={defaultData}
          ref={this.formRef}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          onValuesChange={this.formValuesChange}
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
                    <Form.Item
                      name="vendorId"
                      label="Vendor Name"
                      className="form__input--label"
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
                        value={custData && custData?.length ? selectedCustId?.vendorId : ''}
                        onChange={e => this.handleCompName(e)}
                        showSearch
                        optionFilterProp="children"
                        popupRender={menu => (
                          <div>
                            <Divider style={{ margin: '4px 0' }} />
                            <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                              <Button onClick={this.handleShowHide} role="button">
                                <PlusOutlined /> Add Vendor
                              </Button>
                            </div>
                            {menu}
                          </div>
                        )}
                      >
                        {custData &&
                          custData.map(item => (
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
                      name="estimateDate"
                      label="Purchase Date"
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
                        onChange={this.handlePurchaseDate}
                        defaultValue={moment(new Date(), 'DD/MM/YYYY')}
                        format="DD MMM YYYY"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
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
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    {/* invoiceNo */}
                    <Form.Item
                      name="purchaseNumber"
                      label="PI Number"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter PI No!',
                        },
                      ]}
                    >
                      <Input />
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
                              <PlusOutlined /> Add Region
                            </Button>
                            {menu}
                          </div>
                        )}
                      >
                        {costCenterData &&
                          costCenterData.map(ele => {
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
                      //     message: 'Please enter Reference!',
                      //   },
                      // ]}
                    >
                      <Input style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="taxType"
                      label="Amounts Are"
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
                        onChange={e => this.handleTax(e)}
                      >
                        <Option value="TaxExclusive">Tax Exclusive </Option>
                        <Option value="TaxInclusive">Tax Inclusive</Option>
                        <Option value="NoTax">No Tax</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <hr />
              </Col>

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
                        showTaxModal={this.showTaxModal}
                      />
                    )
                  }}
                </Form.List>
              </Col>

              <Col span={10} offset={14} className="mt-3 total__section">
                <div className="total__section--con">
                  <Row>
                    <div className="col-md-7 text-start ps-5 pt-2">SubTotal </div>
                    <div className="col-md-5 text-end pt-2">{subTotal || '-'}</div>
                    <div className="col-md-7 text-start ps-5 pt-2">Discount </div>
                    <div className="col-md-5 text-end pt-2">{totalDiscount || '-'}</div>
                    <div className="col-md-7 text-start ps-5 pt-2">Tax </div>
                    <div className="col-md-5 text-end pt-2">{totalTax || '-'}</div>
                    <div className="col-md-7 text-start ps-5 pt-2">Amount are with </div>
                    <div className="col-md-5 text-end pt-2">
                      {taxValue === 'NoTax' && <strong>No Tax</strong>}
                      {taxValue === 'TaxExclusive' && <strong>Tax Exclusive</strong>}
                      {taxValue === 'TaxInclusive' && <strong>Tax Inclusive</strong>}
                    </div>
                    <div className="col-md-7 text-start ps-5 pt-2">
                      <strong>Total </strong>
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
                      {Number((total || 0) - (discountNewAmt || 0)).toFixed(selOrgData?.decimals)}
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
            <div className=" text-end">
              <hr />

              <Button type="default" className="text-center me-2" htmlType="submit">
                <strong>
                  <Link to="/purchase/invoices">Cancel</Link>
                </strong>
              </Button>
              <Button type="primary" className="text-center me-3" htmlType="submit">
                <strong>{action}</strong>
              </Button>
            </div>
          </div>
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
          )}
          {isTaxModalVisible && (
            <Modal
              title="Create Tax"
              footer={null}
              visible={isTaxModalVisible}
              onOk={() => this.setState({ isTaxModalVisible: false })}
              onCancel={() => this.setState({ isTaxModalVisible: false })}
            >
              <CreateTax
                onCancel={() => this.setState({ isTaxModalVisible: false })}
                getTaxData={this.getTaxData}
              />
            </Modal>
          )}

          {isCreateCostCenterModal && (
            <Modal
              title="Create Region"
              footer={null}
              visible={isCreateCostCenterModal}
              onOk={this.toggleCreateCostCenterModal}
              onCancel={this.toggleCreateCostCenterModal}
            >
              <CreateCostCenter
                onCancel={this.toggleCreateCostCenterModal}
                actionType="Create"
                closeModal={this.toggleCreateCostCenterModal}
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


export default connect(mapStateToProps)(WithRouter(CreatePurchaseInvoice));
