import React, { useContext, useState, useEffect, useRef } from 'react'
import {
  Table,
  Popconfirm,
  Button,
  Input,
  Form,
  Select,
  Divider,
  Modal,
  DatePicke,
  InputNumber,
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
import QuotationService from '@/services/sales'
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
class CreateCurrancy extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // isVisible: false,
      // isShown: false,
      // estimateDate: '',
      // expiryDate: '',
    }
    // This binding is necessary to make `this` work in the callback
    this.onFinish = this.onFinish.bind(this)
    this.onFinishFailed = this.onFinishFailed.bind(this)
  }

  onFinish = values => {
    // console.log(values, 'values')
    const fetchData = async () => {
      const result = await QuotationService.createQuotation(values, 'post')
    }

    // return fetchData()
  }

  onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo)
  }

  render() {
    // const {
    //   dataSource,
    //   columns,
    //   items,
    //   itemsData,
    //   name,
    //   custName,
    //   isVisible,
    //   isShown,
    //   total,
    //   subTotal,
    //   estimateDate,
    //   expiryDate,
    // } = this.state
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
        <Form layout="vertical" onFinish={this.onFinish} onFinishFailed={this.onFinishFailed}>
          <div className="row">
            <div className="col-md-4">
              <Form.Item name="currancyCode" label="Currancy Code">
                <Input />
              </Form.Item>
            </div>
            <div className="col-md-4">
              <Form.Item name="currancySymbol" label="Currancy Symbol">
                <Input />
              </Form.Item>
            </div>
            <div className="col-md-4">
              <Form.Item name="currancyName" label="Currancy Name">
                <Input />
              </Form.Item>
            </div>
            <div className="col-md-4">
              <Form.Item name="decimalPlaces" label="Decimal Places">
                <InputNumber />
              </Form.Item>
            </div>
            {/* <div className="col-md-4">
              <Form.Item name="format" label="Format">
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
                  <Link to="">Cancel</Link>
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

export default connect()(CreateCurrancy)
