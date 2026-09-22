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
  Modal,
  DatePicker,
  Row,
  Col,
  notification,
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
import QuotationService from '@/services/sales'
import store from 'store'
import { history } from '@/main'
import './index.scss'
import HelperFunction from '@/services/helper'
import WithRouter from '@/WithRouter'
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
  const { custData, handleShowHide, passCustData, selectedCustId } = props
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
      style={{ width: 240 }}
      placeholder="Select/Add Customer"
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
              <PlusOutlined /> Add Customer
            </Button>
          </div>

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
class CreateSaleReturn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDirty: false,

      items: [
        { name: 'jack', key: 1 },
        { name: 'lucy', key: 2 },
      ],
      defaultData: [],
      invoiceList: [],
      selectedCust: {},
      custData: [],
      prodData: [],
      total: 0,
      customerId: '',
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
      estimateDate: '2021/01/01',
      expiryDate: '2021/01/01',
      costCenter: {},
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
          productQty: 0,
          saleReturnQty: 0,
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
        },
      ],
      columns: [
        {
          title: '#',
          dataIndex: 'key',
          key: 'key',
          render: (text, record, index) => index + 1,
        },
        {
          title: 'Name',
          dataIndex: 'name',
          className: 'drag-visible',
          responsive: ['xs', 'sm'],
          render: (key, record) => {
            const { prodData, name } = this.state
            return <Input defaultValue={record.name} disabled />
          },
        },
        {
          title: 'Sales Quantity',
          dataIndex: 'sale_qty',
          responsive: ['xs', 'sm'],
          render: (key, record) => (
            <Input
              placeholder="Enter Quantity"
              name="sale_qty"
              // onChange={e => this.handleCalculation(e, record)}
              onBlur={e => this.handleChange(e, record)}
              defaultValue={record.sale_qty}
              disabled
            />
          ),
        },
        {
          title: 'Sales Rate',
          dataIndex: 'sale_unit_price',
          responsive: ['xs', 'sm'],
          render: (key, record) => (
            <Input
              // placeholder=""
              name="sale_unit_price"
              precision={selOrgData?.decimals}
              // onChange={e => this.handleCalculation(e, record)}
              // onBlur={e => this.handleChange(e, record)}
              defaultValue={record.sale_unit_price}
              disabled
            />
          ),
        },
        {
          title: 'Return Quantity',
          dataIndex: 'saleReturnQty',
          responsive: ['xs', 'sm'],
          render: (key, record) => (
            <InputNumber
              onKeyDown={HelperFunction.isValidNumber}
              placeholder="Enter Return Quantity"
              name="saleReturnQty"
              // onChange={e => this.handleCalculation(e, record)}
              onBlur={e => this.handleRetQtyChange(e, record)}
              defaultValue={record.saleReturnQty}
            />
          ),
        },
        {
          title: 'Return Value',
          dataIndex: 'saleReturnPrice',
          responsive: ['xs', 'sm'],
          render: (key, record) => (
            <InputNumber
              // placeholder="Enter Return Quantity"
              name="saleReturnPrice"
              precision={selOrgData?.decimals}
              // onChange={e => this.handleCalculation(e, record)}
              // onBlur={e => this.handleChange(e, record)}
              defaultValue={record.saleReturnPrice}
              disabled
            />
          ),
        },
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

  componentDidMount = () => {
    const quoteData = []
    const { params } = this.props

    const invoiceList = async () => {
      const org = store.get('selectedOrg')
      const result = await QuotationService.invoiceList(org.orgCode)
      // console.log(result, 'ress111')
      if (result && result.length) {
        result.forEach(item => {
          // console.log(item, 'items')
          if (item.status === 'ACCEPTED') {
            quoteData.push(item)
          }
        })
        this.setState({ invoiceList: result })
      }
    }

    console.log(params, 'params.RId', this.props)

    if (params?.RId) {
      const fetchReturnData = async () => {
        const result = await QuotationService.getSalesReturnById(params?.RId)
        // console.log(result, 'fetchReturnData')
        const resultData = result.data || []
        const data = []
        // console.log(resultData, 'resultData.length')
        if (resultData.id) {
          _.forEach(resultData, (val, key) => {
            if (key !== 'lstProductDto')
              data.push({
                name: key,
                value: key === 'createDate' || key === 'purReturnDate' ? moment(val) : val,
              })
          })
        }

        this.setState(
          {
            defaultData: data,
            total: resultData.amount,
            dataSource: resultData.lstProductDto,
            action: 'Update',
          },
          () => invoiceList(),
        )
      }
      fetchReturnData()
    } else {
      invoiceList()
    }
    window.addEventListener('beforeunload', this.handleBeforeUnload)
  }

  showModal = (e, record) => {
    // console.log(e, record, 'e, record')
    const { visible } = this.state
    this.setState({
      visible: !visible,
      currentProdId: record,
    })
  }

  formValuesChange = e => {
    const isDirty = Object.keys(e).length
    this.setState({ isDirty })
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

  onFinish = values => {
    const {
      dataSource,
      customerId,
      selectedCust,
      sub_total: subTotal,
      total,
      selectedCustId,
      costCenter,
    } = this.state
    // console.log(values, 'values')
    const { params, user } = this.props
    const obj = {}

    obj.lstProduct = dataSource
    // values.product_id = 0;
    obj.sub_total = subTotal
    obj.total = total
    obj.amount = total

    obj.acceptStatus = 'APPROVE'
    obj.customerId = customerId
    const prodId = []
    const prodQty = []
    // const saleReturnQty = [];
    let isMoreRetQty = false
    dataSource.forEach(item => {
      prodId.push(Number(item.id))
      prodQty.push(item.saleReturnQty)
      // saleReturnQty.push(item.productQty)
      // item.productQty = item.saleReturnQty;
      if (item.sale_qty < item.saleReturnQty) {
        isMoreRetQty = true
      }
    })
    // console.log(prodId)
    obj.product_id = prodId.toString()
    obj.productQty = Number(prodQty.toString())
    // obj.saleReturnQty= Number(saleReturnQty.toString());
    obj.invoiceNo = values.invoiceNo
    obj.updateDate = 'string'
    obj.createDate = 'string'
    obj.lstProductDto = dataSource
    obj.saleReturnDate = moment(document.getElementById('estimateDate').value).format('MM/DD/YYYY')
    obj.centerId = costCenter?.centerId || ''
    obj.centerName = costCenter.centerName || ''

    // let method = 'post'
    // if (params.invoiceId) {
    //   method = 'put'
    //   values.id = params.invoiceId
    // }
    // values.email = user.email
    // console.log(obj, 'values')
    if (isMoreRetQty) {
      notification.warning({
        message: 'Return Quantity',
        description: 'Return quantity should be less than purchase quantity',
      })
      return false
    }

    const fetchData = async () => {
      const result = await QuotationService.saveSalesReturn(obj)
      this.setState(
        {
          isDirty: false,
        },
        () => this.props.navigate('/sales/returns'),
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

  handleRetQtyChange = (e, record, fieldName) => {
    e.persist()
    // console.log(e.target.value, record)
    const { dataSource } = this.state
    const { value: val } = e.target
    let total = 0
    dataSource.forEach(element => {
      if (element.id === record.id) {
        const pAmount = parseFloat(element.sale_amount) || 0
        const pQty = parseFloat(element.sale_qty) || 0
        const singleProductValue = parseFloat(pAmount / pQty) || 0
        element.saleReturnPrice = singleProductValue * val
        total += singleProductValue * val
        element.saleReturnQty = val
      } else {
        total += parseFloat(element.saleReturnPrice) || 0
      }
    })
    total = parseFloat(total)

    this.setState({
      dataSource,
      total,
    })
  }

  // handleChange = (e, record, fieldName) => {
  //   // console.log(record, 'handleChange', e)
  //   const { dataSource } = this.state
  //   let amount = 0
  //   let total = 0
  //   let subTotal = 0
  //   let name = ''
  //   let value = ''
  //   if (e.value && e.value.length) {
  //     const { value: val } = e
  //     name = 'productName'
  //     value = val
  //   } else if (fieldName === 'productForm') {
  //     const { value: val } = e
  //     name = 'productName'
  //     value = val
  //   } else if (fieldName === 'sale_tax_rate') {
  //     const { value: val } = e
  //     name = 'sale_tax_rate'
  //     value = val
  //   } else {
  //     const { value: val, name: nameVal } = e.target
  //     name = nameVal
  //     value = val
  //   }
  //   dataSource.forEach(element => {
  //     if (element.id === record.id) {
  //       // console.log(name, 'e.target')
  //       element[name] = Number(value)
  //       let { sale_amount: sum, sale_discount: discount, sale_tax_rate: taxRate } = record
  //       const { sale_unit_price: unitPrice, saleReturnQty: quantity } = record

  //       if (name === 'sale_discount') {
  //         discount = Number(value)
  //         // console.log(discount, 'discount999999999', sum)
  //         sum = quantity * unitPrice
  //       } else if (name === 'sale_tax_rate') {
  //         taxRate = Number(value)
  //         sum = quantity * unitPrice
  //       } else if (name === 'productName') {
  //         // console.log('value', value)
  //         // console.log(record, 'productName in')
  //         sum = quantity * unitPrice
  //       } else {
  //         const currentField = ['saleReturnQty', 'sale_unit_price']
  //         _.remove(currentField, item => item === name)
  //         sum = _.reduce(
  //           currentField,
  //           (i, n) => {
  //             return Number(element[n]) * i
  //           },
  //           1,
  //         )
  //         sum = Number(value) * Number(sum)

  //         // if(name === 'productQty') {
  //         //   element.rProductQty = record.productQty
  //         // }
  //       }

  //       discount *= sum / 100
  //       // console.log(discount, '999999', quantity)
  //       const taxable = sum - discount
  //       const tax = (taxable / 100) * taxRate
  //       // console.log(discount, 'discount', sum, 'sum', taxable, tax, taxRate)
  //       amount = taxable + tax
  //       element.sale_amount = amount
  //       // console.log(amount, 'amount')
  //     } else {
  //       total += parseFloat(element.sale_amount)
  //       subTotal += parseFloat(element.sale_amount)
  //     }
  //   })

  //   total += parseFloat(amount)
  //   subTotal += parseFloat(amount)
  //   this.setState({
  //     dataSource,
  //     total,
  //     subTotal,
  //   })
  // }

  handleChange = (e, record) => {
    // console.log(record, 'handleChange', e)
    const { dataSource } = this.state
    // const amount = 0
    let total = 0
    dataSource.forEach(element => {
      if (element.id === record.id) {
        const pAmount = parseFloat(element.sale_amount) || 0
        const pQty = parseFloat(element.sale_qty) || 0
        const singleProductValue = parseFloat(pAmount / pQty)
        element.saleReturnPrice = singleProductValue
        total += singleProductValue
      } else {
        total += parseFloat(element.saleReturnPrice) || 0
        // subTotal += parseFloat(element.purchase_amount)
      }
    })

    total += parseFloat(total)
    this.setState({
      dataSource,
      total: Number(total).toFixed(selOrgData?.decimals),
    })
  }

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
        estimateDate: date ? dateString : '',
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
    this.setState({
      selectedCust: data[0],
      selectedCustId: { customerId: data[0].customer_id },
    })
  }

  handleTax = value => {
    // console.log(value, 'value')
    this.setState({
      taxValue: value,
    })
  }

  getInvoiceDetails = id => {
    // console.log('id', id)
    const fetchData = async () => {
      const result = await QuotationService.getInvoice(id)
      // console.log(result, 'result')
      // getQuotation(result ? result.data : []);
      const resultData = (result && result.data) || []
      const data = []
      // console.log(resultData, 'resultData.length')
      if (resultData.id) {
        _.forEach(resultData, (val, key) => {
          if (key !== 'productDto')
            data.push({
              name: [key],
              value: key === 'estimateDate' || key === 'expiryDate' ? moment(val) : val,
            })
        })
        this.setState({
          defaultData: data,
          subTotal: 0,
          total: 0,
          dataSource: resultData.productDto,
          action: 'Update',
          expiryDate: resultData.expiryDate,
          estimateDate: resultData.estimateDate,
          customerId: resultData.customerId,
          costCenter: { centerName: resultData.centerName, centerId: resultData.centerId },
        })
      }
    }
    fetchData()
  }

  render() {
    const {
      invoiceList,
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
      taxValue,
      action,
      selectedCustId,
      isDirty,
      costCenter,
    } = this.state
    // console.log(expiryDate, 'expiryDate----------- ')
    const exDateVal = expiryDate
    const { params } = this.props
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
              {params?.RId ? <span>Edit: {params?.RId}</span> : 'New Sales Return'}
            </Col>
            <Col span={4} className="text-end">
              <Button type="default" className="text-center me-2" htmlType="submit">
                <Link to="/sales/returns">Cancel</Link>
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
                      name="invoiceNo"
                      label="Select Invoice"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please select Invoice',
                        },
                      ]}
                    >
                      <Select
                        // style={{ width: 240 }}
                        placeholder=""
                        onChange={e => this.getInvoiceDetails(e)}
                        showSearch
                        optionFilterProp="children"
                      >
                        {invoiceList.map((item, index) => {
                          return (
                            <Option key={item.invoiceno} value={item.invoiceno}>
                              {`${item.customername} (${item.invoiceno})`}
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
                      name="firstName"
                      className="form__input--label not--required--field"
                      label="Customer Name"
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
                      name="estimateDate"
                      label="Date"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please select Invoice',
                        },
                      ]}
                    >
                      {/* <Space direction="vertical" size={12}>
                  <DatePicker
                    onChange={this.handleStDate}
                    defaultValue={moment(estimateDate, 'YYYY/MM/DD')}
                    format="YYYY/MM/DD"
                    value={moment(estimateDate, 'YYYY/MM/DD')}
                  />
                </Space> */}
                      <DatePicker style={{ width: '100%' }} format="DD MMM YYYY" />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="invoiceNo"
                      className="form__input--label not--required--field"
                      label="Invoice Number"
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
                      name="centerName"
                      className="form__input--label not--required--field"
                      label="Region"
                    >
                      <Input defaultValue={costCenter.centerName} disabled />
                    </Form.Item>
                  </Col>
                </Row>
                <hr />
              </Col>
              <Col span={24} className="fs-13 text-uppercase mb-3">
                <span className="bulletIcon">Products</span>
              </Col>

              <Col span={24}>
                <Table
                  className=" form__table--field"
                  pagination={false}
                  dataSource={dataSource}
                  columns={columns}
                  rowKey="id"
                  components={{
                    body: {
                      // wrapper: DraggableContainer,
                      // row: this.DraggableBodyRow,
                    },
                  }}
                  scroll={{ x: 691 }}
                />
                <br />
              </Col>

              {/* <strong>SubTotal : {subTotal}</strong>
              <hr style={{ marginTop: '5px', marginBottom: '5px' }} />
              <strong>Total : {total}</strong>
              <hr style={{ marginTop: '5px', marginBottom: '5px' }} /> */}
              {/* <div>
                <br />
                <div>
                  Subtotal: <strong>{subTotal}</strong>
                </div>
                {taxValue === 'No Tax' && (
                  <div>
                    Amount are with : <strong>{taxValue}</strong>
                  </div>
                )}
                {taxValue === 'Tax Exclusive' && (
                  <div>
                    Amount are with : <strong>{taxValue}</strong>
                  </div>
                )}
                {taxValue === 'Tax Inclusive' && (
                  <div>
                    Amount are with : <strong>{taxValue}</strong>
                  </div>
                )}
                <hr style={{ margin: '5px 0' }} />
                <div>
                  <h3>
                    <strong>Total : </strong>
                    <strong>{total}</strong>
                  </h3>
                </div>
                <hr style={{ margin: '5px 0', borderBottom: '10px' }} />
              </div> */}
              {/* <div className="col-md-9">&nbsp;</div> */}
              <Col span={10} offset={14} className="mt-3 total__section">
                <div className="total__section--con">
                  <Row>
                    {/* <div className="col-md-7 text-end">SubTotal :</div>
                  <div className="col-md-5 text-center">{subTotal || '-'}</div>
                  <div className="col-md-7 text-end">Discount :</div>
                  <div className="col-md-5 text-center">{totalDiscount || '-'}</div>
                  <div className="col-md-7 text-end">Tax :</div>
                  <div className="col-md-5 text-center">{totalTax || '-'}</div> */}
                    <div className="col-md-7 text-start ps-5 pt-2">Total</div>
                    <div className="col-md-5 text-end pt-2">{total}</div>
                    {/* <div className="col-md-7 text-end">Amount are with :</div>
                  <div className="col-md-5 text-center">
                    {taxValue === 'NoTax' && <strong>No Tax</strong>}
                    {taxValue === 'TaxExclusive' && <strong>Tax Exclusive</strong>}
                    {taxValue === 'TaxInclusive' && <strong>Tax Inclusive</strong>}
                  </div> */}
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
            <div className=" text-end pb-3">
              <hr />
              <Button type="default" className="text-center me-2" htmlType="submit">
                <Link to="/sales/returns">Cancel</Link>
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
          /> */}</Form>
      </>
    )
  }
}

const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})

export default connect(mapStateToProps)(WithRouter(CreateSaleReturn))

