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
} from 'antd'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import { MenuOutlined, PlusOutlined } from '@ant-design/icons'
import { arrayMove } from "@dnd-kit/sortable";
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import CreateCustomer from '@/components/accountancy/contacts/createCustomer'
import ProductService from '@/services/products'
import CustomerService from '@/services/customer'
import PurchaseService from '@/services/purchase'
import { history } from '@/main'
// import './index.scss'

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
  const handleCompName = e => {
    const data = custData
    const selected = data.filter(item => item.customer_id === parseInt(e, 10))
    // console.log(e, 'handleCompName', selected, data)
    passCustData(selected)
  }
  return (
    <Select
      style={{ width: 240 }}
      placeholder="Select Customer"
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
              <PlusOutlined /> Add Vendor
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
class CreatePurchaseReturn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [
        { name: 'jack', key: 1 },
        { name: 'lucy', key: 2 },
      ],
      selectedCust: {},
      custData: [],
      prodData: [],
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
                    {menu}
                  </div>
                )}
              >
                {prodData.map((item, index) => (
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
          dataIndex: 'quantity',
          responsive: ['xs', 'sm'],
          render: (key, record) => (
            <Input
              placeholder="Enter Quantity"
              name="quantity"
              // onChange={e => this.handleCalculation(e, record)}
              onBlur={e => this.handleChange(e, record)}
              defaultValue={record.quantity}
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
          title: 'Discount',
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
          render: (key, record) => (
            <Input
              placeholder="Enter Tax %"
              defaultValue={record.purchase_tax_rate}
              name="purchase_tax_rate"
              onBlur={e => this.handleChange(e, record)}
            />
          ),
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

  componentDidMount = () => {
    let prodResult = []
    let custResult = []
    const { match } = this.props
    const fetchProdData = async () => {
      prodResult = await ProductService.productList()
      // console.log(prodResult, 'result')
      if (prodResult && prodResult.data.length) {
        prodResult.data.forEach((ele, i) => {
          ele.key = i + 1
        })
        // getProductList(result.data);
        this.setState({ prodData: prodResult.data }, () => fetchCustData())
      }
    }

    const fetchCustData = async () => {
      custResult = await CustomerService.customerList()
      this.setState({ custData: custResult })
    }
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
          _.forEach(resultData, (value, key) => {
            if (key !== 'productDto')
              data.push({
                name: [key],
                value,
              })
          })
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
                customerId: resultData.customer_id,
                firstName: resultData.customer_fname,
                lastName: resultData.customer_lname,
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
      sub_total: subTotal,
      total,
      defaultData,
      selectedCustId,
    } = this.state
    // console.log(values, 'values')
    const { match, user } = this.props
    // console.log('dataSource 123', selectedCust)

    values.acceptStatus = true
    // values.firstName = selectedCust.customer_fname || selectedCustId.firstName
    // values.lastName = selectedCust.customer_lname || selectedCustId.lastName
    values.customerId = selectedCust.customer_id || selectedCustId.customer_id
    values.id = 0
    // values.customerId = selectedCust.id

    // let method = 'post'
    // if (match.params.purchaseId) {
    //   method = 'put'
    //   values.id = match.params.purchaseId
    // }
    // values.email = user.email
    values.amount = Number(values.amount)
    // console.log(values, 'values')
    const fetchData = async () => {
      const result = await PurchaseService.updatePurchaseReturn(values)
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
        const { purchase_unit_price: unitPrice, quantity } = record

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
          const currentField = ['quantity', 'purchase_unit_price']
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
    })
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
      isShown,
      total,
      subTotal,
      purchaseDate,
      deliveryDate,
      defaultData,
      action,
      selectedCustId,
      prodData,
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
    // console.log(dataSource, 'dataSource')
    return (
      <>
        <Modal
          title="Add Customer"
          onOk={() => this.setState({ isVisible: !isVisible })}
          onCancel={() => this.setState({ isVisible: !isVisible })}
          visible={isVisible}
          className="customerModal"
          okText="Add Product"
          style={{ width: '700px' }}
        >
          <CreateCustomer />
        </Modal>
        <Form
          layout="vertical"
          fields={defaultData}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <div className="row">
            <div className="col-md-4">
              <Form.Item name="customer_fname" label="Customer Name">
                <LoadCon
                  custData={custData}
                  handleShowHide={this.handleShowHide}
                  passCustData={this.passCustData}
                  selectedCustId={selectedCustId.customerId}
                />
              </Form.Item>
            </div>
            <div className="col-md-4">
              <Form.Item name="product_id" label="product">
                <Select style={{ width: 240 }} placeholder="">
                  {prodData.map((item, index) => (
                    <Option key={item.id}>{item.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-4">
              <Form.Item name="amount" label="amount">
                <Input />
              </Form.Item>
            </div>

            <div className="col-md-12 text-center">
              <Button type="default" className="text-center" htmlType="submit">
                <strong>
                  <Link to="/">Cancel</Link>
                </strong>
              </Button>
              <Button type="primary" className="text-center" htmlType="submit">
                <strong>{action}</strong>
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

export default connect(mapStateToProps)(CreatePurchaseReturn)
