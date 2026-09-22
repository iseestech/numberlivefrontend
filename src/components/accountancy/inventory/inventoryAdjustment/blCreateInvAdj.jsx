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
  Radio,
  AutoComplete,
  InputNumber,
} from 'antd'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import { MenuOutlined, PlusOutlined } from '@ant-design/icons'
// import { arrayMove } from "@dnd-kit/sortable";
import { Link, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import axios from 'axios'
import CreateCustomer from '@/components/accountancy/contacts/createCustomer'
import ProductService from '@/services/products'
import InventoryService from '@/services/inventory'
import PhysicalStocsService from '@/services/physicalStocks'
import { history } from '@/main'
import CreateInvAdj from './createInvAdj'
import './index.scss'

const { TextArea } = Input
const { Option } = Select
const reasonOptions = [
  {
    value: 'Reason 1',
  },
  {
    value: 'Reason 2',
  },
  {
    value: 'Reason 3',
  },
]

class CreateInventoryAdjustment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modeValue: true,
      productData: [],
      dataSource: [{ key: '1' }, { key: '2' }],
      mockData: {
        description: 'name',
        users: [
          {
            id: 1,
            key: 0,
            productName: '',
            closingStock: null,
            newQty: '',
            qtyAdjusted: '',
            costPrize: '',
            reason: '',
            test: '',
          },
          {
            id: 2,
            key: 1,
            productName: '',
            closingStock: null,
            newQty: '',
            qtyAdjusted: '',
            costPrize: '',
            reason: '',
          },
        ],
      },
      handleQtyColumns: [
        {
          title: 'ITEM DETAILS',
          dataIndex: 'productName',
          className: 'drag-visible',
          responsive: ['xs', 'sm'],
          render: (key, record) => {
            // console.log('record', key, record)
            const { productData, name } = this.state
            return (
              <Select
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                style={{ width: 220 }}
                placeholder="Enter Name"
                labelInValue
                defaultValue={{ value: record.productName }}
                onChange={e => this.handleName(e, record)}
              >
                {productData.map((item, index) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            )
          },
        },
        {
          title: 'QUANTITY AVAILABLE',
          dataIndex: 'qty',
          responsive: ['xs', 'sm'],
          render: (key, record) => (
            <Input
              placeholder="Enter Quantity"
              onBlur={e => this.handleDescription(e, key, record)}
              name="qty"
              defaultValue={record.qty}
              disabled
            />
          ),
        },
        {
          title: 'NEW QUANTITY ON HAND',
          dataIndex: 'newQty',
          responsive: ['xs', 'sm'],
          render: (key, record) => (
            <Input
              placeholder="Enter Quantity"
              name="newQty"
              // onChange={e => this.handleCalculation(e, record)}
              onBlur={e => this.handleChange(e, key, record)}
              defaultValue={record.newQty}
            />
          ),
        },
        {
          title: 'QUANTITY ADJUSTED',
          dataIndex: 'qtyAdjusted',
          responsive: ['xs', 'sm'],
          render: (key, record) => (
            <Input
              placeholder="Enter Unit"
              name="qtyAdjusted"
              // onChange={e => this.handleCalculation(e, record)}
              onBlur={e => this.handleChange(e, record)}
              defaultValue={record.qtyAdjusted}
            />
          ),
        },
        // {
        //   title: 'PURCHASE PRICE',
        //   dataIndex: 'purchasePrize',
        //   responsive: ['xs', 'sm'],
        //   render: (key, record) => (
        //     <Input
        //       placeholder="Enter Prize"
        //       name="purchasePrize"
        //       defaultValue={record.purchasePrize}
        //       onBlur={e => this.handleChange(e, record)}
        //     />
        //   ),
        // },
        {
          title: 'COST PRICE',
          responsive: ['xs', 'sm'],
          dataIndex: 'costPrize',
          render: (key, record) => (
            <Input placeholder="Enter Amount" defaultValue={record.costPrize} disabled />
          ),
        },
        {
          title: 'REASON',
          dataIndex: 'reason',
          responsive: ['xs', 'sm'],
          render: (key, record) => (
            <AutoComplete
              style={{
                width: 180,
              }}
              options={reasonOptions}
              placeholder="Select reason"
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
            />
          ),
        },
        {
          title: 'ACTION',
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
    this.formRef = React.createRef()

    this.handleValColumns = [
      {
        title: 'ITEM DETAILS',
        dataIndex: 'productName',
        className: 'drag-visible',
        responsive: ['xs', 'sm'],
        render: (key, record) => {
          const { productData, name } = this.state
          return (
            <Select
              style={{ width: 180 }}
              placeholder="Enter Name"
              labelInValue
              defaultValue={{ value: record.productName }}
              onChange={e => this.handleName(e, record)}
            >
              {productData.map((item, index) => (
                <Option key={item.id}>{item.productName}</Option>
              ))}
            </Select>
          )
        },
      },
      {
        title: 'CURRENT VALUE',
        dataIndex: 'sale_desc',
        responsive: ['xs', 'sm'],
        render: (key, record) => (
          <Input
            placeholder="Enter description"
            onBlur={e => this.handleDescription(e, record)}
            name="sale_desc"
            defaultValue={record.sale_desc}
          />
        ),
      },
      {
        title: 'CHANGED VALUE',
        dataIndex: 'sale_qty',
        responsive: ['xs', 'sm'],
        render: (key, record) => (
          <Input
            placeholder="Enter Quantity"
            name="sale_qty"
            // onChange={e => this.handleCalculation(e, record)}
            onBlur={e => this.handleChange(e, record)}
            defaultValue={record.sale_qty}
          />
        ),
      },
      {
        title: 'ADJUSTED VALUE',
        dataIndex: 'sale_discount',
        responsive: ['xs', 'sm'],
        render: (key, record) => (
          <Input
            placeholder="Enter discount"
            name="sale_discount"
            defaultValue={record.sale_discount}
            onBlur={e => this.handleChange(e, record)}
          />
        ),
      },
      {
        title: 'ACTION',
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
    ]
  }

  fetchProdData = () => InventoryService.getStockList()

  handleChange = (e, key, record) => {
    // console.log(record, 'handleChange', key)
  }

  componentDidMount = () => {
    const { dataSource } = this.state
    const getAllData = async () => {
      const [productData] = await axios.all([this.fetchProdData()])

      this.setState({ productData: productData.data })
    }
    getAllData()
  }

  handleDelete = record => {
    // console.log(record, 'record')
    const { dataSource, total, subTotal } = this.state
    // this.setState({
    //   mockData: { user: dataSource.filter(item => item.key !== record.key) },
    //   total: total - record.amount,
    //   subTotal: subTotal - record.amount,
    // })
  }

  onFinish = values => {
    // console.log(values, 'Values')
    // const { productName } = values
    // values.difference = values.systemStock - values.physicalStock
    // values.phyStockDate = new Date().toLocaleDateString()
    // values.productName = productName.value
    // console.log(values, 'values')
    // const fetchData = async () => {
    //   const result = await PhysicalStocsService.createPhysicalStock(values, 'post')
    //   // this.onFinish()
    //   history.push('/inventory/physicalStocks')
    // }

    // fetchData()
  }

  onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo)
  }

  handleName = e => {
    // console.log(e, 'e')
    const { productData } = this.state

    const prod = productData.filter(item => item.id === e.value)
    this.formRef.current.setFieldsValue({ systemStock: prod[0].purchase_qty })
  }

  handleQtyValue = () => {
    const { modeValue } = this.state
    this.setState({
      modeValue: !modeValue,
    })
  }

  handleStDate = () => {}

  handleAdd = () => {
    const { count, dataSource } = this.state
    const newData = {
      key: count,
      index: count,
      description: '',
      id: count,
    }

    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    })
  }

  handleAddRow = () => {
    const { mockData } = this.state
    const fields = this.formRef.current.getFieldsValue()

    const { users } = fields
    // console.log(users, 'Users')
    // users.push({
    //   id: '',
    //   productName: '',
    //   closingStock: '',
    //   newQty: '',
    //   qtyAdjusted: '',
    //   costPrize: '',
    //   reason: '',
    // })
    mockData.users = users
    this.formRef.current.setFieldsValue({ users })
    this.setState({
      mockData,
    })
  }

  updateRow = (e, row, keyName, index) => {
    // console.log(e, '|', row, '|', keyName, '|', index)
    const { productData, mockData } = this.state
    const selectedProd = productData.filter(x => x.productId === e)
    const fields = this.formRef.current.getFieldsValue()
    const { users } = fields
    users[index] = selectedProd.length ? selectedProd[0] : row

    // console.log('mockDataVal', users)
    this.formRef.current.setFieldsValue({ users })
    // this.setState({ mockData: mockDataVal })
  }

  handleDeleteRow = index => {
    // console.log(row, index, 'row, index')
    const { mockData } = this.state
    const fields = this.formRef.current.getFieldsValue()
    const { users } = fields
    users.splice(index, 1)
    mockData.users = users
    // console.log(users, 'users', mockData.users)
    this.formRef.current.setFieldsValue({ users })
    // this.setState({
    //   mockData,
    // })
  }

  render() {
    const { modeValue, productData, columns, dataSource, mockData, handleQtyColumns } = this.state
    // console.log('productData', this.handleColumns)

    return (
      <>
        <Form
          layout="vertical"
          initialValues={mockData}
          className="inventory__adjustment--form"
          onFinish={this.onFinish}
          ref={this.formRef}
          onFinishFailed={this.onFinishFailed}
        >
          <div className="row">
            <div className="col-md-4">
              <Form.Item name="modeOfAdjustment" label="Mode of adjustment">
                <Radio.Group onChange={this.handleQtyValue}>
                  <Radio value="quantity" checked={modeValue}>
                    Quantity Adjustment
                  </Radio>
                  <Radio value="value">Value Adjustment</Radio>
                </Radio.Group>
              </Form.Item>
            </div>
            <div className="col-md-4">
              <Form.Item name="referenceNumber" label="Reference Number">
                <Input />
              </Form.Item>
            </div>
            {/*  <div className="col-md-6">
              <Form.Item name="itemName" label="Item Name">
                <Select placeholder="">
                  {productData.map(item => (
                    <Option value={item.id}>{item.name}</Option>
                  ))}
                </Select>
              </Form.Item>
                  </div> */}
            <div className="col-md-4">
              <Form.Item name="date" label="Date">
                <Space direction="vertical" size={12}>
                  <DatePicker
                    onChange={this.handleStDate}
                    // defaultValue={moment(estimateDate, 'YYYY/MM/DD')}
                    format="YYYY/MM/DD"
                    // value={moment(estimateDate, 'YYYY/MM/DD')}
                  />
                </Space>
              </Form.Item>
            </div>
            <div className="col-md-4">
              <Form.Item name="accId" label="Account">
                <Select placeholder="">
                  <Option value="KWD">Cost Of Good sold </Option>
                  <Option value="KWD">Sale Account</Option>
                </Select>
              </Form.Item>
            </div>
            {/* {modeValue && (
              <>
                <div className="col-md-12 horizontal__lable">
                  <Form.Item name="quantity" label="Quantity Available">
                    <Input />
                  </Form.Item>
                </div>

                <div className="col-md-12 horizontal__lable">
                  <Form.Item name="newQuantity" label="New Quantity on hand">
                    <Input />
                  </Form.Item>
                </div>

                <div className="col-md-12 horizontal__lable">
                  <Form.Item name="quantityAdj" label="Quantity Adjusted">
                    <Input />
                  </Form.Item>
                </div>
              </>
            )}
            {!modeValue && (
              <>
                <div className="col-md-12 horizontal__lable">
                  <Form.Item name="currValue" label="Current Value">
                    <Input />
                  </Form.Item>
                </div>

                <div className="col-md-12 horizontal__lable">
                  <Form.Item name="changeValue" label="Changed Value">
                    <Input />
                  </Form.Item>
                </div>

                <div className="col-md-12 horizontal__lable">
                  <Form.Item name="valAdj" label="Adjusted Value">
                    <Input />
                  </Form.Item>
                </div>
              </>
            )} */}
            {/* <div className="col-md-12">
              <Form.Item name="reasons" label="Reason">
                <Input />
              </Form.Item>
            </div> */}
            <div className="col-md-6">
              <Form.Item name="description" label="Description">
                <TextArea row={4} />
              </Form.Item>
            </div>
            {/* {modeValue && (
              <div className="col-md-12">
                <Table
                  pagination={false}
                  dataSource={mockData.user}
                  columns={handleQtyColumns}
                  rowKey="id"
                  scroll={{ x: 691 }}
                />
                <br />
              </div>
            )} */}
            <div className="col-md-12">
              <Form.List name="users">
                {(users, options) => {
                  // console.log(options, 'options', users)
                  return (
                    <CreateInvAdj
                      users={users}
                      add={options.add}
                      remove={options.remove}
                      productData={productData}
                      handleDelete={this.handleDelete}
                      itemData={mockData.users}
                      updateRow={this.updateRow}
                      handleAddRow={this.handleAddRow}
                      handleDeleteRow={this.handleDeleteRow}
                    />
                  )
                }}
              </Form.List>
            </div>
            {/* {!modeValue && (
              <div className="col-md-12">
                <Table
                  pagination={false}
                  dataSource={dataSource}
                  columns={this.handleValColumns}
                  rowKey="key"
                  scroll={{ x: 691 }}
                />
                <br />
              </div>
            )} */}
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
            <div className="col-md-12 text-center">
              <Button type="default" className="text-center" htmlType="submit">
                <strong>
                  <Link to="/inventory/inventory-adjustments">Cancel</Link>
                </strong>
              </Button>
              <Button type="primary" className="text-center" htmlType="submit">
                <strong>Convert to Adjusted</strong>
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

export default connect(mapStateToProps)(CreateInventoryAdjustment)
