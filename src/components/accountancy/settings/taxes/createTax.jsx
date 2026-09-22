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
  DatePicker,
  Row,
  Col,
  InputNumber,
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
import TaxService from '@/services/settings'
import { history } from '@/main'
// import './index.scss'
import HelperFunction from '@/services/helper'
import WithRouter from '@/WithRouter'
class CreateTax extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      customerData: [],
      action: 'Create',
      masterData: {},
    }
    // This binding is necessary to make `this` work in the callback
    this.onFinish = this.onFinish.bind(this)
    this.onFinishFailed = this.onFinishFailed.bind(this)
  }

  componentDidMount = () => {
    const { params } = this.props
    // console.log(match, 'match')
    const { id } = params
    if (!id) {
      return
    }
    const getData = async () => {
      const result = await TaxService.getTax(id)
      // console.log(result, 'result')
      const data = []
      _.forEach(result, (value, key) => {
        // console.log(key)
        data.push({
          name: [key],
          value,
        })
      })
      this.setState({
        customerData: data,
        action: 'Update',
        masterData: result,
      })
    }

    getData()
  }

  onFinish = values => {
    // console.log(values, 'values')
    const { params, onCancel, getTaxData } = this.props
    const { id } = params
    const { masterData } = this.state
    let method = 'post'
    if (id) {
      method = 'put'
      values.id = Number(id)
    }
    // console.log(values, 'values')
    const newData = Object.assign(masterData, values)

    const fetchData = async () => {
      const result = await TaxService.createTax(newData, method)
      // console.log(result, 'fetchData')
      if (getTaxData) {
        getTaxData(result.data)
      }
      if (id) {
          this.props.navigate('/settings/taxes')
      } else {
        onCancel(true)
      }
    }

    return fetchData()
  }

  onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo)
  }

  render() {
    const { customerData, action } = this.state
    const { onCancel } = this.props

    return (
      <>
        <Form
          className="form__layout--css"
          layout="horizontal"
          fields={customerData}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <div className="form__content--css pb-0" style={{ boxShadow: 'none' }}>
            <Row className="form__body-content pt-0 pb-0">
              <Col span={24}>
                <Row>
                  <Col span={24}>
                    <Form.Item name="rate" label="Tax Rate" className="text-start">
                      <InputNumber
                        style={{ width: '100%' }}
                        onKeyDown={HelperFunction.isValidNumber}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={24}>
                    <Form.Item name="tax_name" label="Tax Name">
                      <Input onKeyPress={HelperFunction.isValidString} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <div className="text-end">
              <hr />
              <Button type="default" className="text-center me-2" onClick={() => onCancel(false)}>
                <strong>Cancel tt</strong>
              </Button>
              <Button type="primary" className="text-center me-3" htmlType="submit">
                <strong>{action}</strong>
              </Button>
            </div>
          </div>
        </Form>
      </>
    )
  }
}

// export default connect()(CreateTax)
  

// const mapStateToProps = ({ user, settings, dispatch }) => ({
//   user,
// })

export default connect()(WithRouter(CreateTax));