import React, { useContext, useState, useEffect, useRef } from 'react'
import { Table, Popconfirm, Button, Input, Form, Select, Divider, Modal, DatePicker } from 'antd'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import { MenuOutlined, PlusOutlined } from '@ant-design/icons'
// import { arrayMove } from "@dnd-kit/sortable";
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import CreateProductModal from '@/components/accountancy/productsAndServices/createProductModal'
import CreateCustomer from '@/components/accountancy/contacts/createCustomer'
import QuotationService from '@/services/sales'
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
  const { itemsData, handleShowHide } = props
  const addItem = () => {}
  return (
    <Select
      style={{ width: 240 }}
      placeholder="Select/Add Customer"
      defaultValue="lucy"
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
      {itemsData.map(item => (
        <Option value={`${item.name}_${item.key}`} key={`${item.name}_${item.key}`}>
          {item.name}
        </Option>
      ))}
    </Select>
  )
}
class CreateProfitAndLoss extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [
        { name: 'jack', key: 1 },
        { name: 'lucy', key: 2 },
      ],
      itemsData: [
        { name: 'jack', key: 1 },
        { name: 'lucy', key: 2 },
      ],
      total: 0,
      subTotal: 0,
      custName: '',
      name: '',
      count: 4,
      isVisible: false,
      isShown: false,
      estimateDate: '',
      expiryDate: '',
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
        {
          title: 'Sort',
          dataIndex: 'sort',
          width: 30,
          className: 'drag-visible',
          render: () => <DragHandle />,
          responsive: ['xs', 'sm'],
        },
        {
          title: 'Name',
          dataIndex: 'name',
          className: 'drag-visible',
          responsive: ['xs', 'sm'],
          render: (key, record) => {
            const { items, name } = this.state
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
                    <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                      <CreateProductModal headingText="Add Product" />
                    </div>
                    {menu}
                  </div>
                )}
              >
                {items.map(item => (
                  <Option key={item.key}>{item.name}</Option>
                ))}
              </Select>
            )
          },
        },
        {
          title: 'Description',
          dataIndex: 'description',
          responsive: ['xs', 'sm'],
          render: (key, record) => (
            <Input
              placeholder="Enter description"
              //  onBlur={e => this.handleChange(e, record)}
              name="description"
              defaultValue={record.description}
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
        {
          title: 'Account',
          responsive: ['xs', 'sm'],
          dataIndex: 'purchase_account',
          render: (key, record) => (
            <Input
              name="purchase_account"
              placeholder="Enter Account"
              defaultValue={record.purchase_account}
            />
          ),
        },
        {
          title: 'Tax %',
          responsive: ['xs', 'sm'],
          dataIndex: 'purchase_tax_rate',
          render: (key, record) => (
            <Input
              placeholder="Enter Tax rate"
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

  onFinish = values => {
    const { dataSource, estimateDate, expiryDate } = this.state
    // console.log(values, 'values')
    values.productDto = dataSource
    values.product_id = ''
    values.sub_total = 0
    values.total = 0
    values.firstName = 'string'
    values.lastName = 'string'
    values.desc = 'oio'
    values.title = 'rtert'
    values.estimateDate = new Date(estimateDate)
    values.expiryDate = new Date(expiryDate)
    values.amount = 0
    values.currency = 0
    // const { match } = this.props
    // const id = match.params.customerId
    // let method = 'get'
    // if (id) {
    //   method = 'put'
    //   values.customer_id = id;
    // }
    values.email = 'asad@gmail.com'
    const fetchData = async () => {
      const result = await QuotationService.createQuotation(values, 'post')
    }

    return fetchData()
  }

  onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo)
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { dataSource } = this.state
    if (oldIndex !== newIndex) {
      const newData =  [] //arrayMove([].concat(dataSource), oldIndex, newIndex).filter(el => !!el)
      this.setState({ dataSource: newData })
    }
  }

  handleName = (e, record) => {
    const { dataSource } = this.state
    dataSource.forEach(element => {
      if (element.id === record.id) {
        element.name = e.label
      }
    })
    this.setState({
      dataSource,
    })
  }

  handleChange = (e, record) => {
    const { dataSource } = this.state
    let amount = 0
    let total = 0
    let subTotal = 0
    dataSource.forEach(element => {
      if (element.id === record.id) {
        element[e.target.name] = Number(e.target.value)
        let {
          purchase_amount: sum,
          purchase_discount: discount,
          purchase_tax_rate: taxRate,
        } = record
        const { purchase_unit_price: unitPrice, quantity } = record

        if (e.target.name === 'purchase_discount') {
          discount = Number(e.target.value)
          sum = quantity * unitPrice
        } else if (e.target.name === 'purchase_tax_rate') {
          taxRate = Number(e.target.value)
          sum = quantity * unitPrice
        } else {
          const currentField = ['quantity', 'purchase_unit_price']
          _.remove(currentField, item => item === e.target.name)
          sum = _.reduce(
            currentField,
            (i, n) => {
              return Number(element[n]) * i
            },
            1,
          )
          sum = Number(e.target.value) * Number(sum)
        }

        discount *= sum / 100
        const taxable = sum - discount
        const tax = (taxable / 100) * taxRate
        amount = taxable + tax
        element.purchase_amount = amount
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
  //   // console.log(record, 'handleCalculation', e.target.value)
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
      item: '',
      quantity: '',
      description: '',
      unitPrice: '',
      discount: '',
      account: '',
      taxRate: '',
      amount: '',
      index: count,
    }
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    })
  }

  handleStDate = (date, dateString) => {
    // const {estimateDate} = this.state
    // const val = moment(dateString).tz('Asia/Calcutta').format();
    this.setState({
      estimateDate: dateString,
    })
  }

  handleExDate = (date, dateString) => {
    // const {estimateDate} = this.state
    // const val = moment(dateString).tz('Asia/Calcutta').format();
    this.setState({
      expiryDate: dateString,
    })
  }

  onNameChange = event => {
    this.setState({
      custName: event.target.value,
    })
  }

  addItem = () => {
    const { itemsData, custName } = this.state
    const val = temp + 1

    this.setState({
      itemsData: [
        ...itemsData,
        { name: custName, key: itemsData.length + 1 } || {
          name: `New item ${val}`,
          key: itemsData.length + 1,
        },
      ],
      custName: '',
    })
  }

  render() {
    const {
      dataSource,
      columns,
      items,
      itemsData,
      name,
      custName,
      isVisible,
      isShown,
      total,
      subTotal,
      estimateDate,
      expiryDate,
    } = this.state
    const { params } = this.props
    // const routeName = match.path.split('/')
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
        <Modal
          title="Add Customer"
          onOk={() => this.setState({ isVisible: !isVisible })}
          onCancel={() => this.setState({ isVisible: !isVisible })}
          visible={isVisible}
          className="customerModal"
          okText="Add Product"
          width={1000}
        >
          <CreateCustomer />
        </Modal>
        test
        <Form layout="vertical" onFinish={this.onFinish} onFinishFailed={this.onFinishFailed}>
          <div className="row">
            <div className="col-md-4">
              <Form.Item name="customer_fname" label="Customer Name">
                <LoadCon itemsData={itemsData} handleShowHide={this.handleShowHide} />
              </Form.Item>
            </div>
            <div className="col-md-2">
              <Form.Item name="estimateDate" label="Date">
                <DatePicker
                  onChange={this.handleStDate}
                  defaultValue={moment('2015/01/01', 'YYYY/MM/DD')}
                  format="YYYY/MM/DD"
                  value={estimateDate}
                />
              </Form.Item>
            </div>
            <div className="col-md-2">
              <Form.Item name="expiryDate" label="Expiry">
                <DatePicker
                  onChange={this.handleExDate}
                  defaultValue={moment('2015/01/01', 'YYYY/MM/DD')}
                  format="YYYY/MM/DD"
                  value={expiryDate}
                />
              </Form.Item>
            </div>
            <div className="col-md-2">
              <Form.Item name="quoteNumber" label="Quote Number">
                <Input />
              </Form.Item>
            </div>
            <div className="col-md-2">
              <Form.Item name="reference" label="Reference">
                <Input />
              </Form.Item>
            </div>
            <div className="col-md-12">
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
            </div>
            <div className="col-md-6">
              <Form.Item name="currency" label="Currency">
                <Select style={{ width: 240 }} placeholder="">
                  <Option value="KWD">KWD </Option>
                  <Option value="INR">INR</Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item name="amount" label="Amounts Are">
                <Select style={{ width: 240 }} placeholder="">
                  <Option value="tax exclusive">Tax Exclusive </Option>
                  <Option value="tax inclusive">Tax Inclusive</Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-12">
              <Table
                pagination={false}
                dataSource={dataSource}
                columns={columns}
                rowKey="index"
                components={{
                  body: {
                    // wrapper: DraggableContainer,
                    // row: this.DraggableBodyRow,
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
            <div className="col-md-3">
              <strong>SubTotal : {subTotal}</strong>
              <hr style={{ marginTop: '5px', marginBottom: '5px' }} />
              <strong>Total : {total}</strong>
              <hr style={{ marginTop: '5px', marginBottom: '5px' }} />
            </div>
            <div className="col-md-12">
              <hr />
            </div>
            <div className="col-md-6">
              <Form.Item name="terms" label="Terms">
                <TextArea />
              </Form.Item>
            </div>
            <div className="col-md-12">
              <Form.Item name="status" label="Status">
                <Select placeholder="Select status" style={{ width: '200px' }}>
                  <Select.Option value="draft">Draft </Select.Option>
                  <Select.Option value="sent">Sent</Select.Option>
                  <Select.Option value="declined">Declined</Select.Option>
                  <Select.Option value="accepted">Accepted</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-12 text-center">
              <Button type="default" className="text-center" htmlType="submit">
                <strong>
                  <Link to="/sales/orders">Cancel</Link>
                </strong>
              </Button>
              <Button type="primary" className="text-center" htmlType="submit">
                <strong>Create</strong>
              </Button>
            </div>
          </div>
        </Form>
      </>
    )
  }
}

export default connect()(CreateProfitAndLoss)

