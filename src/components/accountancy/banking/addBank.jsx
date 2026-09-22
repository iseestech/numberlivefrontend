import React, { useContext, useState, useEffect, useRef } from 'react'
import {
  Table,
  Popconfirm,
  Button,
  Input,
  Form,
  Radio,
  Select,
  Divider,
  InputNumber,
  Modal,
  DatePicker,
  Row,
  Col,
} from 'antd'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import { MenuOutlined, PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import store from 'store'
import CreateProductModal from '@/components/accountancy/productsAndServices/createProductModal'
import CreateCustomer from '@/components/accountancy/contacts/createCustomer'
import { history } from '@/main'
import BankService from '@/services/banking'
import TextArea from 'antd/lib/input/TextArea'
import WithRouter from "@/WithRouter";
// import './index.scss'
import HelperFunction from '@/services/helper'

const selOrgData = store.get('selectedOrg')
const { Option } = Select

class AddBank extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      customerData: [],
      action: 'Create',
      isCrdit: false,
      isDirty: false,
    }
    // This binding is necessary to make `this` work in the callback
    this.onFinish = this.onFinish.bind(this)
    this.onFinishFailed = this.onFinishFailed.bind(this)
  }

  componentDidMount = () => {
    const { recordData } = this.props
    const { params } = this.props

    // const { isEdit, id } = recordData
    const isEdit = false
    const id = 0
    // console.log(isEdit, 'isEdit', match)
    // const { id } = params
    if (!params.id) {
      return
    }
    const getData = async () => {
      const result = await BankService.getBank(params.id)
      // console.log(result, 'result BankService')
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
      })
    }

    getData()
  }

  onFinish = values => {
    // console.log(values, 'values')
    const { params, hideModal, recordData } = this.props
    const org = store.get('selectedOrg')

    // const { isEdit, id } = recordData
    const { id } = params
    let method = 'post'
    if (id) {
      method = 'put'
      values.id = id
    }
    values.orgCode = org.orgCode
    // console.log(values, 'values')
    const fetchData = async () => {
      const result = await BankService.createBank(values, method)
      // hideModal(true)
      // console.log(result, 'result')
      // this.setState({ isDirty: false })
      this.setState({ isDirty: false }, () => this.props.navigate('/banking/lists'))
    }

    return fetchData()
  }

  onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo)
  }

  handleChange = e => {
    // console.log(`selected ${e.target.value}`)
    this.setState({
      isCrdit: e.target.value === 'credit' && true,
    })
  }

  hideModal = () => {
    const { hideModal } = this.props
    hideModal()
  }

  formValuesChange = e => {
    const isDirty = Object.keys(e).length
    this.setState({ isDirty })
  }

  render() {
    const { customerData, action, isCrdit, isDirty } = this.state
    const { params } = this.props

    return (
      <>
        <Form
          className="createForm form__layout--css"
          layout="horizontal"
          fields={customerData}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          onValuesChange={this.formValuesChange}
        >
          <Row className="mb-3 form__header--css">
            <Col span={20} style={{ fontSize: '18px' }}>
              {params?.id ? <span>Edit: {params?.id}</span> : 'New Bank'}
            </Col>
            <Col span={4} className="text-end">
              <Button type="default" className="text-center me-2" htmlType="submit">
                <Link to="/banking/lists">Cancel</Link>
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
                      name="accountType"
                      className="form__input--label"
                      label="Select Account Type"
                      rules={[
                        {
                          required: true,
                          message: 'Select Account Type',
                        },
                      ]}
                    >
                      <Radio.Group onChange={this.handleChange}>
                        <Radio value="bank">Bank</Radio>
                        <Radio value="credit">Credit</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="actName"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter account name',
                        },
                      ]}
                      className="form__input--label"
                      label="Account Name"
                    >
                      <Input onKeyPress={HelperFunction.isValidString} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="accountCode"
                      className="form__input--label "
                      label="Account Code"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter account code',
                        },
                      ]}
                    >
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
                  <Col span={11}>
                    <Form.Item
                      name="currency"
                      rules={[
                        {
                          required: true,
                          message: 'Please select currency',
                        },
                      ]}
                      className="form__input--label"
                      label="Currency"
                    >
                      <Select placeholder="">
                        <Option value="KWD">KWD </Option>
                        <Option value="INR">INR</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              {!isCrdit && (
                <Col span={24}>
                  <Row>
                    <Col span={11}>
                      <Form.Item
                        name="accNo"
                        className="form__input--label"
                        label="Account Number"
                        rules={[
                          {
                            required: true,
                            message: 'Please enter account number',
                          },
                        ]}
                      >
                        <Input
                          style={{ width: '100%' }}
                          onKeyPress={HelperFunction.isValidMobile}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              )}
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="bankName"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter bank name',
                        },
                      ]}
                      className="form__input--label"
                      label="Bank Name"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {!isCrdit && (
                <Col span={24}>
                  <Row>
                    <Col span={11}>
                      <Form.Item
                        name="ifscCode"
                        rules={[
                          {
                            required: true,
                            message: 'Please enter IFSC code',
                          },
                        ]}
                        className="form__input--label"
                        label="IFSC"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              )}
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="accountBalance"
                      label="Account Balance"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter balance',
                        },
                      ]}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Please add Account balance!',
                      //   },
                      // ]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        precision={selOrgData?.decimals}
                        onKeyDown={HelperFunction.isValidNumber}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="description"
                      className="form__input--label not--required--field"
                      label="Description"
                    >
                      <TextArea />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Col span={24}>
              <hr />
            </Col>
            <div className="form__footer text-end">
              <Button type="default" className="text-center me-2" onClick={() => this.hideModal()}>
                <strong>Cancel</strong>
              </Button>
              <Button type="primary" className="text-center me-3" htmlType="submit">
                <strong>{action}</strong>
              </Button>
            </div>
          </div></Form>
      </>
    )
  }
}

export default connect()(WithRouter(AddBank))


