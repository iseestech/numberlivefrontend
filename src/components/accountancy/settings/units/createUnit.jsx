import React, { useContext, useState, useEffect, useRef } from 'react'
import {
  Table,
  Popconfirm,
  Button,
  Input,
  notification,
  Form,
  Select,
  Divider,
  Modal,
  DatePicker,
  Row,
  Col,
} from 'antd'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import { MenuOutlined, PlusOutlined } from '@ant-design/icons'
// import arrayMove from 'array-move'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import CreateProductModal from '@/components/accountancy/productsAndServices/createProductModal'
import CreateCustomer from '@/components/accountancy/contacts/createCustomer'
import ProductsService from '@/services/products'
import DisplayJournal from '@/components/accountancy/common/DisplayJournal'
// import './index.scss'
import HelperFunction from '@/services/helper'

const { TextArea } = Input
const { Option } = Select
const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
))

const temp = 0

const SortableItem = sortableElement(props => <tr className="temp" {...props} />)
const SortableContainer = sortableContainer(props => <tbody {...props} />)

const CategoryComponent = props => {
  // console.log(props, 'dataSource')
  const { dataSource } = props
  return (
    <div className="form__content--css" style={{ boxShadow: 'none' }}>
      <Row className="form__body-content pt-0 pb-0">
        <Col span={24}>
          <Row>
            <Col span={24}>
              <Form.Item name="productGroupId" label="Group" className="form__input--label">
                <Select>
                  {dataSource &&
                    dataSource.map(item => {
                      return (
                        <Option key={item.groupId} value={item.groupId}>
                          {item.groupName}
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
            <Col span={24}>
              <Form.Item name="catName" label="Category Name" className="form__input--label">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <Form.Item
                name="catDisplayName"
                label="Category Display Name"
                className="form__input--label"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <Form.Item name="discription" label="Discription" className="form__input--label">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

const GroupComponent = props => {
  return (
    <div className="form__content--css" style={{ boxShadow: 'none' }}>
      <Row className="form__body-content pt-0 pb-0">
        <Col span={24}>
          <Row>
            <Col span={24}>
              <Form.Item name="groupName" label="Group Name" className="form__input--label">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <Form.Item
                name="groupDisplayName"
                label="Group Display Name"
                className="form__input--label"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <Form.Item name="discription" label="Discription" className="form__input--label">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

const UnitComponent = props => {
  return (
    <div className="form__content--css" style={{ boxShadow: 'none' }}>
      <Row className="form__body-content pt-0 pb-0">
        <Col span={24}>
          <Row>
            <Col span={24}>
              <Form.Item name="unitName" label="Unit Name" className="form__input--label">
                <Input onKeyPress={HelperFunction.isValidString} />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <Form.Item
                name="unitDisplayName"
                label="Unit Display Name"
                className="form__input--label"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <Form.Item name="discription" label="Discription" className="form__input--label">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

class CreateUnit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isVisible: false,
      // isShown: false,
      // action: 'Add',
    }
    // This binding is necessary to make `this` work in the callback
    this.onFinish = this.onFinish.bind(this)
    this.onFinishFailed = this.onFinishFailed.bind(this)
  }

  onFinish = values => {
    // const { dataSource, estimateDate, expiryDate } = this.state
    const { match, type, singleRecord, action, closeModal, fromProduct, createdData } = this.props
    // const { match } = this.props
    // const id = match.params.customerId
    let method = 'post'
    // let id = '';
    if (action === 'Update') {
      method = 'put'
      if (type === 'Category') {
        values.catId = singleRecord.catId
      } else if (type === 'Group') {
        values.groupId = singleRecord.groupId
      } else {
        values.unitId = singleRecord.unitId
      }
    }

    // values.email = 'asad@gmail.com'
    // console.log(values, 'values')
    const fetchData = async () => {
      const result = await ProductsService.createProductCat(values, method, type)
      // console.log(result, 'result')
      if (
        (result.data && result.data.message === 'Record Already exist with given Name') ||
        result.data.message === 'Name already exist.'
      ) {
        return notification.warning({
          message: 'Entry Not created',
          description: 'Name already exist.',
          duration: 6,
        })
      }

      if (fromProduct) {
        const resultData = result.data || {}
        createdData(resultData.data || {})
      }
      return closeModal(true)
    }

    fetchData()
  }

  onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo)
  }

  handleShowHide = () => {
    const { isVisible } = this.state
    this.setState({
      isVisible: !isVisible,
    })
  }

  render() {
    // const { action } = this.state
    const { match, type, singleRecord, action, closeModal, dataSource } = this.props
    // console.log(type, 'type')

    let data = []
    _.forEach(singleRecord, (value, key) => {
      // console.log(key)
      data.push({
        name: [key],
        value,
      })
    })

    if (action === 'Add') {
      data = []
    }
    // const routeName = match.path.split('/')
    return (
      <>
        <Form
          className="form__layout--css"
          layout="horizontal"
          fields={data}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <div className="">
            {type === 'Category' && <CategoryComponent dataSource={dataSource} />}
            {type === 'Group' && <GroupComponent />}
            {type === 'Unit' && <UnitComponent />}

            <div className="text-end">
              <hr />
              <Button type="default" className="text-center me-2" onClick={() => closeModal(false)}>
                <strong>Cancel</strong>
              </Button>
              <Button type="primary" className="text-center me-3" htmlType="submit">
                <strong>{action}</strong>
              </Button>
            </div>
          </div>
        </Form>
        <div>
          <hr style={{ marginBottom: 0 }} />
          {type === 'Category' && (
            <DisplayJournal
              trId={singleRecord.catId}
              formName="productCategory"
              isJournal={false}
            />
          )}
          {type === 'Group' && (
            <DisplayJournal trId={singleRecord.groupId} formName="productGroup" isJournal={false} />
          )}
          {type === 'Unit' && (
            <DisplayJournal trId={singleRecord.unitId} formName="tax" isJournal={false} />
          )}
        </div>
      </>
    )
  }
}

export default connect()(CreateUnit)
