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
  notification,
  InputNumber,
  Row,
  Col,
} from 'antd'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import { MenuOutlined, PlusOutlined } from '@ant-design/icons'
import { arrayMove } from "@dnd-kit/sortable";
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import CreateProductModal from '@/components/accountancy/productsAndServices/createProductModal'
import CreateCustomer from '@/components/accountancy/contacts/createCustomer'
import ProductService from '@/services/products'
// import VendorService from '@/services/customer'
import CustomerService from '@/services/customer'
import PurchaseService from '@/services/purchase'
import VendorService from '@/services/vendor'
import axios from 'axios'
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

class CreatePurchaseReturn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDirty: false,

      items: [
        { name: 'jack', key: 1 },
        { name: 'lucy', key: 2 },
      ],
      invoiceList: [],
      vendorList: [],
      selectedCust: {},
      custData: [],
      prodData: [],
      defaultData: [
        { name: 'purchase_Date', value: moment() },
        { name: 'purReturnDate', value: moment() },
      ],
      action: 'Create',
      selectedCustId: {},
      total: 0,
      vendorId: '',
      subTotal: 0,
      custName: '',
      name: '',
      count: 4,
      isVisible: false,
      isShown: false,
      purchaseDate: '2021/01/01',
      deliveryDate: '2021/01/01',
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
          purchaseReturnQty: 0,
          productQty: 0,
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
          sales_amount: '',
          sales_discount: '',
        },
      ],
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
            return <Input name="name" disabled defaultValue={record.name} />
          },
        },
        {
          title: 'Purchase Quantity',
          dataIndex: 'purchase_qty',
          responsive: ['xs', 'sm'],
          render: (key, record) => (
            <Input
              placeholder="Enter Quantity"
              name="purchase_qty"
              // onChange={e => this.handleCalculation(e, record)}
              onBlur={e => this.handleChange(e, record)}
              defaultValue={record.purchase_qty}
              disabled
            />
          ),
        },
        {
          title: 'Purchase Rate',
          dataIndex: 'purchase_unit_price',
          responsive: ['xs', 'sm'],
          render: (key, record) => (
            <Input
              placeholder="Purchase rate"
              name="purchase_unit_price"
              // onChange={e => this.handleCalculation(e, record)}
              onBlur={e => this.handleChange(e, record)}
              defaultValue={record.purchase_unit_price}
              disabled
            />
          ),
        },
        {
          title: 'Return Quantity',
          dataIndex: 'purchaseReturnQty',
          responsive: ['xs', 'sm'],
          render: (key, record) => (
            <InputNumber
              onKeyDown={HelperFunction.isValidNumber}
              placeholder="Enter Return Quantity"
              name="purchaseReturnQty"
              // min={0}
              // onChange={e => this.handleCalculation(e, record)}
              onBlur={e => this.handleRetQtyChange(e, record)}
              defaultValue={record.purchaseReturnQty}
            />
          ),
        },
        {
          title: 'Return Value',
          dataIndex: 'purchaseReturnPrice',
          className: 'text-end',
          responsive: ['xs', 'sm'],
          render: (key, record) => (
            <Input
              // placeholder="Enter Return "
              name="purchaseReturnPrice"
              precision={selOrgData?.decimals}
              // onChange={e => this.handleCalculation(e, record)} purchaseReturnPrice
              // onBlur={e => this.handleChange(e, record)} purchaseReturnAmount
              defaultValue={record.purchaseReturnPrice}
              disabled
            />
          ),
        },
      ],
    }
    // This binding is necessary to make `this` work in the callback
    this.onFinish = this.onFinish.bind(this)
    this.onFinishFailed = this.onFinishFailed.bind(this)
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
  }

  handleBeforeUnload = event => {
    event.preventDefault()
    event.returnValue = ''
  }

  fetchVendorList = () => VendorService.customerList()

  fetchInvoiceList = org => PurchaseService.getInvoiceByVendor(org)

  componentDidMount = () => {
    // let prodResult = []
    // let custResult = []
    const quoteData = []
    const { params } = this.props

      console.log(this.props, 'params')
    // getPurchaseReturn
    // console.log(match, 'match')
    const org = store.get('selectedOrg')
    const invoiceList = async () => {
      const [vendorList] = await axios.all([this.fetchVendorList()])

      this.setState({
        vendorList,
      })
    }

    if (params.purchaseId) {
      const fetchReturnData = async () => {
        const result = await PurchaseService.getPurchaseReturn(params.purchaseId)
        // console.log(result, 'fetchReturnData')
        const resultData = result.data || []
        const data = []
        // console.log(resultData, 'resultData.length')
        if (resultData.id) {
          _.forEach(resultData, (val, key) => {
            if (key !== 'lstProduct')
              data.push({
                name: key,
                value: key === 'estimateDate' || key === 'purReturnDate' ? moment(val) : val,
              })
          })
        }

        this.setState(
          {
            defaultData: data,
            total: resultData.amount,
            dataSource: resultData.lstProduct,
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

  formValuesChange = e => {
    const isDirty = Object.keys(e).length
    this.setState({ isDirty })
  }
  

  onFinish = values => {
    const {
      vendorId,
      sub_total: subTotal,
      total,
      defaultData,
      selectedCustId,
      dataSource,
      costCenter,
    } = this.state
    const { params, user } = this.props
    // const values = {}
    values.acceptStatus = 'APPROVE'
    values.vendorId = vendorId

    // values.lstProduct = dataSource
    // values.product_id = 0;
    // values.sub_total = subTotal
    // values.total = total
    values.amount = total

    const prodId = []
    const prodQty = []
    let isMoreRetQty = false
    dataSource.forEach(item => {
      prodId.push(item.id)
      prodQty.push(item.purchaseReturnQty)
      if (item.purchase_qty < item.purchaseReturnQty) {
        isMoreRetQty = true
      }
      // item.productQty = item.purchaseReturnQty;
    })
    values.lstProduct = dataSource
    // console.log(prodId)
    values.product_id = prodId.toString()
    values.productQty = Number(prodQty.toString())

    let type = 'create'
    if (params.purchaseId) {
      type = 'edit'
      values.id = params.purchaseId
    }
    // console.log(values, 'values')
    const date1 = moment(document.getElementById('purchase_Date').value)
    const date2 = moment(document.getElementById('purReturnDate').value)

    // if (date2 < date1) {
    //   // alert('Return Date should be greater than Purchase Date')
    //   notification.warning({
    //     message: 'Date',
    //     description: 'Return Date should be greater than Purchase Date',
    //   })
    //   return false
    //   // document.getElementById('expiryDate').value = document.getElementById('estimateDate').value
    // }

    values.purchase_Date = moment(document.getElementById('purchase_Date').value).format(
      'MM/DD/YYYY',
    )
    // values.purReturnDate = document.getElementById('purReturnDate').value
    values.purReturnDate = moment(document.getElementById('purReturnDate').value).format(
      'MM/DD/YYYY',
    )
    values.centerId = costCenter.centerId
    const fetchData = async () => {
      // const result = await PurchaseService.savePurchaseReturn(values)
      const result = await PurchaseService.updatePurchaseReturn(values, type)
      this.setState(
        {
          isDirty: false,
        },
        () => this.props.navigate('/purchase/returns'),
      )
    }
    if (isMoreRetQty) {
      notification.warning({
        message: 'Return Quantity',
        description: 'Return quantity should be less than purchase quantity',
      })
      return false
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
    // console.log(e, record)
    const { dataSource } = this.state
    const { value: val } = e.target
    // const val = e;
    let total = 0
    // console.log(dataSource, 'dataSourcedddd')
    dataSource.forEach(element => {
      if (element.id === record.id) {
        const pAmount = parseFloat(element.purchase_amount) || 0
        const pQty = parseFloat(element.purchase_qty) || 0
        const singleProductValue = parseFloat(pAmount / pQty) || 0
        element.purchaseReturnPrice = singleProductValue * val
        total += singleProductValue * val
        element.purchaseReturnQty = val
      } else {
        total += parseFloat(element.purchaseReturnPrice) || 0
      }
    })
    total = parseFloat(total)

    this.setState({
      dataSource,
      total: Number(total).toFixed(selOrgData?.decimals),
    })
  }

  handleChange = (e, record) => {
    // console.log(record, 'handleChange', e)
    const { dataSource } = this.state
    // const amount = 0
    let total = 0
    dataSource.forEach(element => {
      if (element.id === record.id) {
        const pAmount = parseFloat(element.purchase_amount) || 0
        const pQty = parseFloat(element.purchase_qty) || 0
        const singleProductValue = parseFloat(pAmount / pQty)
        element.purchaseReturnPrice = singleProductValue
        total += singleProductValue
      } else {
        total += parseFloat(element.purchaseReturnPrice) || 0
        // subTotal += parseFloat(element.purchase_amount)
      }
    })

    total += parseFloat(total)
    this.setState({
      dataSource,
      total: Number(total).toFixed(selOrgData?.decimals),
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
      purchaseReturnQty: 0,
      productQty: 0,
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
    this.setState({
      selectedCust: data[0],
    })
  }

  getInvoiceDetails = id => {
    // console.log('id', id)
    const fetchData = async () => {
      const result = await PurchaseService.getPurchaseInvoice(id)
      // console.log(result, 'result')
      // getQuotation(result ? result.data : []);
      const resultData = result.data || []
      const data = []
      // console.log(resultData, 'resultData.length')
      if (resultData.id) {
        _.forEach(resultData, (val, key) => {
          if (key !== 'productDto')
            data.push({
              name: key,
              value: key === 'purchase_Date' || key === 'purReturnDate' ? moment(val) : val,
            })
        })
        // console.log(data, 'data')
        this.setState({
          defaultData: data,
          // subTotal: resultData.sub_total,
          // total: resultData.total,
          dataSource: resultData.productDto ? resultData.productDto : [],
          purchaseDate: resultData.estimateDate || new Date(),
          deliveryDate: resultData.expiryDate || new Date(),
          vendorId: resultData.vendorId,
          costCenter: { centerName: resultData.centerName, centerId: resultData.centerId },
        })
      }
    }
    fetchData()
  }

  getInvoiceListByVendor = async e => {
    // console.log(e, 'e')

    const [invoiceListData] = await axios.all([this.fetchInvoiceList(e)])

    // console.log(invoiceListData, 'invoiceListData')
    // const filteredInvoice = []
    // invoiceListData.forEach(item => {
    //   if (item.status !== 'ACCEPTED') {
    //     filteredInvoice.push(item)
    //   }
    // })
    this.setState({
      invoiceList: invoiceListData.data || [],
    })
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
      isShown,
      total,
      subTotal,
      purchaseDate,
      deliveryDate,
      defaultData,
      action,
      selectedCustId,
      vendorList,
      isDirty,
      costCenter,
    } = this.state

    const { amount } = defaultData

    const { params } = this.props
    // const routeName = path.split('/')
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
          className="form__layout--css"
          layout="horizontal"
          fields={defaultData}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          onValuesChange={this.formValuesChange}
        >
          <Row className="mb-3 form__header--css">
            <Col span={20} style={{ fontSize: '18px' }}>
              {params?.purchaseId ? (
                <span>Edit: {params?.purchaseId}</span>
              ) : (
                'New Purchase Return'
              )}
            </Col>
            <Col span={4} className="text-end">
              <Button type="default" className="text-center me-2" htmlType="submit">
                <Link to="/purchase/returns">Cancel</Link>
              </Button>
              <Button
                type="primary"
                size="medium"
                className="text-center"
                htmlType="submit"
                // loading={isLoading}
              >
                {params?.purchaseId ? 'Update' : 'Create'}
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
                          message: 'Please select vendor!',
                        },
                      ]}
                    >
                      <Select
                        // style={{ width: 240 }}
                        placeholder=""
                        onChange={e => this.getInvoiceListByVendor(e)}
                        disabled={params.purchaseId && true}
                        showSearch
                        optionFilterProp="children"
                      >
                        {vendorList.map((item, index) => {
                          return (
                            <Option key={item.id} value={item.id}>
                              {`${item.firstName} ${item.lastName}`}
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
                      name="invoiceNo"
                      label="Select Invoice"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please select Invoice!',
                        },
                      ]}
                    >
                      <Select
                        // style={{ width: 240 }}
                        placeholder=""
                        onChange={e => this.getInvoiceDetails(e)}
                        disabled={params.purchaseId && true}
                        showSearch
                        optionFilterProp="children"
                      >
                        {invoiceList.map((item, index) => {
                          return (
                            <Option key={item.id} value={item.invoiceNo}>
                              {item.invoiceNo}
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
                      name="purchase_Date"
                      className="form__input--label"
                      label="Purchase Date"
                    >
                      {/* <Space direction="vertical" size={12}> */}
                      <DatePicker
                        style={{ width: '100%' }}
                        // onChange={this.handleExDate}
                        defaultValue={moment(new Date(), 'DD MMM YYYY')}
                        format="DD MMM YYYY"
                        // value={moment(purchaseDate, 'YYYY/MM/DD')}
                        disabled
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
                      name="purReturnDate"
                      label="Return Date"
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
                        // onChange={this.handleExDate}
                        defaultValue={moment(new Date(), 'DD MMM YYYY')}
                        format="DD MMM YYYY"
                        // value={moment(purchaseDate, 'YYYY/MM/DD')}
                      />
                      {/* </Space> */}
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item name="centerName" label="Region" className="form__input--label">
                      {/* <Space direction="vertical" size={12}> */}
                      <Input defaultValue={costCenter.centerName} disabled />
                      {/* </Space> */}
                    </Form.Item>
                  </Col>
                </Row>
                <hr />
              </Col>

              {/* <div className="col-md-2">
              <Form.Item name="delivery_Date" label="Delivery Date">
                <Space direction="vertical" size={12}>
                  <DatePicker
                    onChange={this.handleStDate}
                    defaultValue={moment('2021/01/01', 'YYYY/MM/DD')}
                    format="YYYY/MM/DD"
                    value={moment(deliveryDate, 'YYYY/MM/DD')}
                  />
                </Space>
              </Form.Item>
            </div> */}
              {/* <div className="col-md-2">
              <Form.Item name="invoiceNo" label="PI Number">
                <Input />
              </Form.Item>
            </div> */}

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
              <Col span={24} className="fs-13 text-uppercase mb-3">
                <span className="bulletIcon">Products</span>
              </Col>
              <Col span={24}>
                <Table
                  className="tableForm form__table--field"
                  pagination={false}
                  dataSource={dataSource}
                  columns={columns}
                  rowKey="id"
                  // components={{
                  //   body: {
                  //     wrapper: DraggableContainer,
                  //     row: this.DraggableBodyRow,
                  //   },
                  // }}
                  // scroll={{ x: 691 }}
                />
                <br />
              </Col>

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
                    <div className="col-md-7 text-start ps-5 pt-2">
                      <strong>Total </strong>
                    </div>
                    <div className="col-md-5 text-end pt-2">
                      <strong>{total || '-'}</strong>
                    </div>
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
                <span className="bulletIcon">Reason</span>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item name="desc" label={null}>
                      <TextArea />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

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
            </Row>
            <div className="text-end">
              <hr />
              <Button type="default" className="text-center me-2" htmlType="submit">
                <strong>
                  <Link to="/purchase/returns">Cancel</Link>
                </strong>
              </Button>
              <Button type="primary" className="text-center me-3" htmlType="submit">
                <strong>{params?.purchaseId ? 'Update' : 'Create'}</strong>
              </Button>
            </div>
          </div></Form>
      </>
    )
  }
}

const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})

// export default connect(mapStateToProps)(CreatePurchaseReturn)

export default connect(mapStateToProps)(WithRouter(CreatePurchaseReturn));
