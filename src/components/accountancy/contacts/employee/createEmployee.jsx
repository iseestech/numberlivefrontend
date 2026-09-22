import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import PhoneInput from 'react-phone-input-2'
import axios from 'axios'
import { InboxOutlined } from '@ant-design/icons'
import {
  Input,
  Slider,
  Cascader,
  Upload,
  message,
  Checkbox,
  Select,
  Button,
  Radio,
  Form,
  Row,
  Col,
  InputNumber,
} from 'antd'
import { FormInstance } from 'antd/lib/form'
import _ from 'lodash'
// import {Form } from '@ant-design/compatible'
import apiClient from '@/services/axios'
import { Country, State, City } from 'country-state-city'
import EmployeeService from '@/services/employee'
import { history } from '@/main'
import HelperFunction from '@/services/helper'
import store from 'store'
import WithRouter from '@/WithRouter'
import '../index.scss'

const selOrgData = store.get('selectedOrg')

const { Dragger } = Upload
const { Option } = Select

// @connect()
class CreateEmployee extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      customerData: {},
      action: 'Create',
      isLoading: false,
      countryData: Country.getAllCountries() || [],
      stateData: [],
      cityData: [],
      isDirty: false,
      masterData: {},
    }

    // This binding is necessary to make `this` work in the callback
    this.onFinish = this.onFinish.bind(this)
    this.onFinishFailed = this.onFinishFailed.bind(this)
    this.formRef = React.createRef()
  }

  componentDidMount() {
    const { params } = this.props
    // console.log(match, 'sdsd')
    const id = params.empId
    if (!id) {
      return
    }
    const getData = async () => {
      const result = await EmployeeService.getEmployee(id)
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

  formValuesChange = e => {
    const isDirty = Object.keys(e).length
    this.setState({ isDirty })
  }

  onFinish = values => {
    const { params, user, fromModal, getData } = this.props
    // console.log(match, 'match')
    const id =params.empId
    const { isLoading, masterData } = this.state
    let method = 'post'

    values.empId = 0
    if (id) {
      method = 'put'
      values.empId = id
    }
    // values.created_by = 'Asad'
    // values.customer_email = 'asad@gmail.com'
    // values.created_by = user.name
    // values.created_by_email = user.email

    // console.log(values, 'values')
    const newData = Object.assign(masterData, values)

    const fetchData = async () => {
      const result = await EmployeeService.createEmployee(newData, method)
      if (!fromModal) {
       

         this.setState(
           {
             isDirty: false,
           },
           () => {
             this.props.navigate("/contacts/employees");
           },
         );
      } else {
        getData({ customerId: 5 })
      }
    }
    return this.setState(
      {
        isLoading,
      },
      () => {
        fetchData()
      },
    )

    // return fetchData()
  }

  onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo)
  }

  handleAddress = e => {
    if (e.target.value === 1) {
      // console.log(e.target.value, 'etetet')
      const addressValue = [
        'customer_email',
        'phone_number',
        'address',
        'country',
        'state',
        'city',
        'zip_code',
      ]

      _.forEach(addressValue, (item, key) => {
        let objKey = `delivery_${item}`
        const value = this.formRef.current.getFieldValue(item)
        if (item === 'customer_email') {
          objKey = 'delivery_email'
        }
        if (item === 'zip_code') {
          objKey = 'zipcode'
        }
        this.formRef.current.setFieldsValue({ [objKey]: value })
      })
    }
  }

  handleCountry = val => {
    this.formRef.current.setFieldsValue({ city: '', state: '' })
    // this.formRef.current.setFieldsValue({ [objKey]: value })
    this.setState({ stateData: State.getStatesOfCountry(val) })
  }

  handleState = val => {
    const countryCode = this.formRef.current.getFieldValue('country')
    this.formRef.current.setFieldsValue({ city: '' })
    this.setState({ cityData: City.getCitiesOfState(countryCode, val) })
  }

  handleZipCode = (e, key) => {
    const { value } = e.target
    this.formRef.current.setFieldsValue({ [key]: value.trim() })
  }

  render() {
    const { params, form } = this.props
    // const routeName = params.path.split('/')
    // console.log(form, 'state customerData')
    // const { getFieldDecorator } = form;
    const {
      customerData,
      address,
      data,
      action,
      isLoading,
      countryData,
      stateData,
      cityData,
      isDirty,
    } = this.state
    // const { address } = customerData;
    return (
      <div>
        <Form
          fields={customerData}
          layout="horizontal"
          ref={this.formRef}
          name="control-ref"
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          onValuesChange={this.formValuesChange}
          className="form__layout--css"
        >
          <Row className="mb-3 form__header--css">
            <Col span={20} style={{ fontSize: '18px' }}>
              {action === 'Create' ? 'New Employee' : `Edit: ${params?.empId}`}
            </Col>
            <Col span={4} className="text-end">
              <Button type="default" className="text-center me-2" htmlType="submit">
                <Link to="/contacts/employees">Cancel</Link>
              </Button>
              <Button
                type="primary"
                size="medium"
                className="text-center"
                htmlType="submit"
                loading={isLoading}
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
                      name="empFirstName"
                      label="First Name"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter first name!',
                        },
                      ]}
                    >
                      <Input placeholder="Enter First Name" />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="empLastName"
                      label="Last Name"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter last name!',
                        },
                      ]}
                    >
                      <Input placeholder="Enter Last Name" />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="role"
                      className="form__input--label"
                      label="Role"
                      rules={[
                        {
                          required: true,
                          message: 'Please select role!',
                        },
                      ]}
                    >
                      <Select
                        allowClear
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        <Option value="1">Admin</Option>
                        <Option value="2">Staff</Option>
                        <Option value="3">Timesheet Staf</Option>
                        <Option value="4">Staff - Assigned Customers Only</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="phone_number"
                      label="Mobile No"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter mobile no!',
                        },
                      ]}
                    >
                      <Input
                        placeholder=""
                        minLength={10}
                        maxLength={10}
                        onKeyPress={HelperFunction.isValidMobil}
                      />
                      {/* <PhoneInput country="in" className="phone__number__css" /> */}
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="email"
                      label="E-mail"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          type: 'email',
                          // message: 'Please enter email',
                        },
                      ]}
                    >
                      <Input placeholder="" />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="linkedin"
                      className="form__input--label not--required--field"
                      label="Linkedin"
                    >
                      <Input placeholder="" />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {/* <div className="col-md-4">
              <Form.Item name="website" label="Website">
                <Input placeholder="" />
              </Form.Item>
            </div>
            <div className="col-md-4">
              <Form.Item name="currency" label="currency">
                <Input placeholder="" />
              </Form.Item>
            </div> */}
              <Col span={24}>
                <hr />
                <Row>
                  <Col span={22} className="fs-13 text-uppercase mb-3">
                    <span className="bulletIcon"> Address</span>
                  </Col>
                  <Col span={24}>
                    <Row>
                      <Col span={11}>
                        <Form.Item
                          name="address"
                          label="Address"
                          className="form__input--label"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter address!',
                            },
                          ]}
                        >
                          <Input placeholder="" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row>
                      <Col span={11}>
                        <Form.Item
                          name="country"
                          label="Country"
                          className="form__input--label"
                          rules={[
                            {
                              required: true,
                              message: 'Please select country!',
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={this.handleCountry}
                          >
                            {countryData.map((item, index) => {
                              return (
                                <Option key={item.isoCode} value={item.isoCode}>
                                  {item.name}
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
                          name="state"
                          label="State"
                          className="form__input--label"
                          rules={[
                            {
                              required: true,
                              message: 'Please select state!',
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={this.handleState}
                          >
                            {stateData.map((item, index) => {
                              return (
                                <Option key={item.isoCode} value={item.isoCode}>
                                  {item.name}
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
                          name="city"
                          className="form__input--label"
                          label="City"
                          rules={[
                            {
                              required: true,
                              message: 'Please select city!',
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {cityData.map((item, index) => {
                              return (
                                <Option key={item.name} value={item.name}>
                                  {item.name}
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
                          name="zip_code"
                          className="form__input--label not--required--field"
                          label="Zip"
                          // rules={[
                          //   {
                          //     required: true,
                          //     message: 'Please enter zip',
                          //   },
                          // ]}
                        >
                          <Input onChange={e => this.handleZipCode(e, 'zip_code')} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <hr />
                <Row>
                  <Col span={24} className="fs-13 text-uppercase mb-3">
                    <span className="bulletIcon">Advance Option</span>
                  </Col>
                  <Col span={24}>
                    <Row>
                      <Col span={11}>
                        <Form.Item
                          name="openingBalance"
                          label="Opening Balance"
                          className="form__input--label"
                          rules={[
                            {
                              type: 'number',
                              required: true,
                              // message: 'Please add balance!',
                            },
                          ]}
                        >
                          <InputNumber
                            placeholder=""
                            precision={selOrgData?.decimals}
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
                          name="bank_acc_number"
                          label="Bank Account Number"
                          className="form__input--label"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter account no!',
                            },
                          ]}
                        >
                          <Input
                            style={{ width: '100%' }}
                            placeholder=""
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
                          name="bank_acc_name"
                          label="Bank Account Name"
                          className="form__input--label"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter bank account name!',
                            },
                          ]}
                        >
                          <Input
                            placeholder=""
                            // onKeyPress={HelperFunction.isValidString}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
            <div className="text-end">
              <hr />
              <Button type="default" size="medium" className="text-center me-2" htmlType="submit">
                <Link to="/contacts/employees">Cancel</Link>
              </Button>
              <Button
                type="primary"
                size="medium"
                className="text-center me-3"
                htmlType="submit"
                loading={isLoading}
              >
                {action}
              </Button>
            </div>
          </div></Form>
      </div>
    )
  }
}

const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})

export default connect(mapStateToProps)(WithRouter(CreateEmployee));

// const CreateCustomer = Form.create({})(FormComponent)

// export default CreateCustomer


