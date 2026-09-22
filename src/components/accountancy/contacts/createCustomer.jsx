import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import PhoneInput from 'react-phone-input-2'

import { Country, State, City } from 'country-state-city'
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
  Alert,
} from 'antd'
import { FormInstance } from 'antd/lib/form'
import _ from 'lodash'
// import {Form } from '@ant-design/compatible'
import apiClient from '@/services/axios'
import CustomerService from '@/services/customer'
import { history } from '@/main'
import store from 'store'
import './index.scss'
import DisplayJournal from '../common/DisplayJournal'
import HelperFunction from '../../../services/helper'
import WithRouter from "@/WithRouter";
const { TextArea } = Input
const { Dragger } = Upload
const { Option } = Select

// Validation with REGEX
const rxLive = /^[+-]?\d*(?:[.,]\d*)?$/
const selOrgData = store.get('selectedOrg')
// @connect()
class CreateCustomer extends React.Component {
  // prefixSelector = (
  //   <Form.Item name="prefix" noStyle>
  //     <Select
  //       style={{
  //         width: 70,
  //       }}
  //     >
  //       <Option value="86">+86</Option>
  //       <Option value="87">+87</Option>
  //     </Select>
  //   </Form.Item>
  // )

  constructor(props) {
    super(props)
    this.state = {
      customerData: {},
      action: 'Create',
      isLoading: false,
      countryData: Country.getAllCountries() || [],
      stateData: [],
      cityData: [],
      delCountryData: Country.getAllCountries() || [],
      delStateData: [],
      delCityData: [],
      isDirty: false,
      masterData: {},
      isSameAddress: 2,
    }

    // This binding is necessary to make `this` work in the callback
    this.onFinish = this.onFinish.bind(this)
    this.onFinishFailed = this.onFinishFailed.bind(this)
    this.formRef = React.createRef()
    
  }

  componentDidMount() {
    const { params } = this.props
    const id = params?.customerId
    if (!id) {
      return
    }
    const getData = async () => {
      const result = await CustomerService.getCustomer(id)
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
      if (id && result?.country) {
        this.handleCountry(result.country)
      }
    }

    getData()
  }

  formValuesChange = e => {
    const isDirty = Object.keys(e).length && true
    this.setState({ isDirty })
  }

  onFinish = values => {
    const { params, user, fromModal, getData, handleNewCustomer } = this.props
    console.log(this.props, 'this.props')
    const id = params?.customerId
    const { isLoading, masterData } = this.state
    let method = 'post'
    const newData = Object.assign(masterData, values)
    newData.customer_id = 0
    if (id) {
      method = 'put'
      newData.customer_id = id
    }
    // values.created_by = 'Asad'
    // values.customer_email = 'asad@gmail.com'
    // const { value: curr } = values.currency
    newData.created_by = user.name
    newData.created_by_email = user.email
    // values.currency = curr
    const fetchData = async () => {
      const result = await CustomerService.createCustomer(newData, method)
      // console.log(result, 'customer Result')
      if (!result) {
        alert('Company Name already existed')
        return
      }
      if (!fromModal) {
        // this.setState(
        //   {
        //     isDirty: false,
        //   },
        //   () => history.push('/contacts/customers'),
        // )
        this.setState(
  {
    isDirty: false,
  },
  () => {
    this.props.navigate('/contacts/customers');
  }
);
        // history.push('/contacts/customers')
      } else {
        // getData({ customerId : 5 })
        handleNewCustomer(result.data.data || [])
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
          objKey = 'delivery_zipcode'
        }
        this.formRef.current.setFieldsValue({ [objKey]: value })
      })
    }
    this.setState({
      isSameAddress: e.target.value,
    })
  }

  onChangeAddress = () => {
    const { isSameAddress } = this.state
    if (isSameAddress === 1) {
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
          objKey = 'delivery_zipcode'
        }
        this.formRef.current.setFieldsValue({ [objKey]: value })
      })
    }
  }

  handleCountry = val => {
    const { isSameAddress } = this.state

    this.formRef.current.setFieldsValue({ city: '', state: '' })
    // this.formRef.current.setFieldsValue({ [objKey]: value })
    if (isSameAddress === 1) {
      this.setState(
        { stateData: State.getStatesOfCountry(val), delStateData: State.getStatesOfCountry(val) },
        () => this.onChangeAddress(val),
      )
    } else {
      this.setState({ stateData: State.getStatesOfCountry(val) }, () => this.onChangeAddress(val))
    }
  }

  handleState = val => {
    const { isSameAddress } = this.state
    const countryCode = this.formRef.current.getFieldValue('country')
    this.formRef.current.setFieldsValue({ city: '' })
    if (isSameAddress === 1) {
      this.setState(
        {
          cityData: City.getCitiesOfState(countryCode, val),
          delCityData: City.getCitiesOfState(countryCode, val),
        },
        () => this.onChangeAddress(val),
      )
    } else {
      this.setState({ cityData: City.getCitiesOfState(countryCode, val) }, () =>
        this.onChangeAddress(val),
      )
    }
  }

  handleCountryDel = val => {
    this.formRef.current.setFieldsValue({ delivery_state: '', delivery_city: '' })
    // this.formRef.current.setFieldsValue({ [objKey]: value })
    this.setState({ delStateData: State.getStatesOfCountry(val) })
  }

  handleStateDel = val => {
    const countryCode = this.formRef.current.getFieldValue('country')
    this.formRef.current.setFieldsValue({ delivery_city: '' })
    this.setState({ delCityData: City.getCitiesOfState(countryCode, val) })
  }

  // handleZipCode = (e, key) => {
  //   const { value } = e.target
  //   this.formRef.current.setFieldsValue({ [key]: value.trim() }, ()=>this.onChangeAddress())
  // }

  render() {
    const { match, form } = this.props
    // const routeName = match.path.split('/')
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
      delCountryData,
      delStateData,
      delCityData,
      isDirty,
      isSameAddress,
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
              {action === 'Create' ? 'New Customer' : `Edit: ${match?.params?.customerId}`}
            </Col>
            <Col span={4} className="text-end">
              <Button type="default" className="text-center me-2" htmlType="submit">
                <Link to="/contacts/customers">Cancel</Link>
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
                      name="company_name"
                      label="Company Name"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter company name!',
                        },
                      ]}
                    >
                      <Input placeholder="Company Name" />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="customer_fname"
                      label="First Name"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          // message: 'Please enter first name!',
                          // pattern: new RegExp('^[a-zA-Z]*$'),
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
                      name="customer_lname"
                      label="Last Name"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          // message: 'Please enter last name!',
                          // pattern: new RegExp('^[a-zA-Z]*$'),
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
                      name="phone_number"
                      className="form__input--label not--required--field"
                      label="Mobile No"
                      // rules={[
                      //   {
                      //     pattern: HelperFunction.isValidMobile,
                      //     message: 'Please enter valid Mobile No',
                      //   },
                      // ]}
                    >
                      <Input
                        placeholder="Please enter mobile no"
                        // minLength={5}
                        // maxLength={10}
                        onKeyPress={HelperFunction.isValidMobile}
                      />

                      {/* <Input placeholder="" addonBefore={this.prefixSelector} /> */}
                      {/* <PhoneInput country="in" className="phone__number__css" /> */}
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="customer_email"
                      label="E-mail"
                      className="form__input--label"
                      rules={[
                        {
                          type: 'email',
                          required: true,
                          // message: 'Please enter email!',
                          pattern: new RegExp('[a-z]*$'),
                        },
                      ]}
                    >
                      <Input placeholder="Please enter email" />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="linked_in_id"
                      className="form__input--label not--required--field"
                      label="Linkedin"
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
                      name="website"
                      className="form__input--label not--required--field"
                      label="Website"
                      rules={[
                        {
                          type: 'url',
                          required: false,
                          // message: 'Please enter email!',
                        },
                      ]}
                    >
                      <Input placeholder="" />
                    </Form.Item>
                  </Col>
                </Row>
                <hr />
              </Col>

              <Col span={12}>
                <Row>
                  <Col span={22} className="fs-13 text-uppercase mb-3">
                    <span className="bulletIcon">Address</span>
                  </Col>

                  <Col span={22}>
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
                      <Input placeholder="" onChange={this.onChangeAddress} />
                    </Form.Item>
                  </Col>
                  <Col span={22}>
                    <Form.Item
                      name="country"
                      label="Country"
                      className="form__input--label"
                      // defaultValue={customerData.length>0?customerData.country:null}
                      rules={[
                        {
                          required: true,
                          message: 'Please select country',
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
                  <Col span={22}>
                    <Form.Item
                      name="state"
                      label="State"
                      className="form__input--label"
                      // defaultValue={State.getStatesOfCountry(customerData.country)}
                      rules={[
                        {
                          required: true,
                          message: 'Please select state',
                        },
                      ]}
                    >
                      <Select
                        // defaultActiveFirstOptio={State.getStatesOfCountry(customerData.country)}
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
                  <Col span={22}>
                    <Form.Item
                      name="city"
                      label="City"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please select city',
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={this.onChangeAddress}
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
                  <Col span={22}>
                    <Form.Item
                      name="zip_code"
                      label="Zip"
                      className="form__input--label not--required--field"
                    >
                      {/* <Input onChange={e => this.handleZipCode(e, 'zip_code')} /> */}
                      <Input onChange={this.onChangeAddress} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                <Row style={{ justifyContent: 'right' }}>
                  <Col span={22} className="mb-3" style={{ fontStyle: 'italic' }}>
                    Use same address for delivery{' '}
                    <Radio.Group defaultValue={isSameAddress} onChange={this.handleAddress}>
                      <Radio value={1}>Yes</Radio> <Radio value={2}>No</Radio>
                    </Radio.Group>
                    {/* <br />
                <br /> */}
                  </Col>
                  {/* <Col span={24}>
                  <Form.Item
                    name="delivery_email"
                    className="form__input--label"
                    label="Email"
                    rules={[{ type: 'email' }]}
                  >
                    <Input placeholder="" />
                  </Form.Item>
                </Col> */}
                  {/* <Col span={24}>
                  <Form.Item
                    name="delivery_phone_number"
                    className="form__input--label"
                    label="Mobile No"
                  >
                    <Input placeholder="" />
                  </Form.Item>
                </Col> */}
                  <Col span={22}>
                    <Form.Item
                      name="delivery_address"
                      className="form__input--label"
                      label="Address"
                    >
                      <Input placeholder="" />
                    </Form.Item>
                  </Col>
                  <Col span={22}>
                    <Form.Item
                      name="delivery_country"
                      className="form__input--label"
                      label="Country"
                    >
                      <Select
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={this.handleCountryDel}
                      >
                        {delCountryData.map((item, index) => {
                          return (
                            <Option key={item.isoCode} value={item.isoCode}>
                              {item.name}
                            </Option>
                          )
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={22}>
                    <Form.Item name="delivery_state" className="form__input--label" label="State">
                      <Select
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={this.handleStateDel}
                      >
                        {delStateData.map((item, index) => {
                          return (
                            <Option key={item.isoCode} value={item.isoCode}>
                              {item.name}
                            </Option>
                          )
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={22}>
                    <Form.Item name="delivery_city" className="form__input--label" label="City">
                      <Select
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {delCityData.map((item, index) => {
                          return (
                            <Option key={item.name} value={item.name}>
                              {item.name}
                            </Option>
                          )
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={22}>
                    <Form.Item
                      name="delivery_zipcode"
                      className="form__input--label"
                      label="Zip"
                      // rules={[{ whiteSpace: true, message: 'no space' }]}
                    >
                      {/* <Input onChange={e => this.handleZipCode(e, 'delivery_zipcode')} /> */}
                      <Input />
                    </Form.Item>
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
                          name="payment_terms"
                          className="form__input--label not--required--field"
                          label="Payment terms"
                        >
                          {/* <Input placeholder="" /> */}
                          <Select
                            placeholder="Select Payment term"
                            showSearch
                            filterOption={(input, option) =>
                              option?.children?.toLowerCase().indexOf(input?.toLowerCase()) >= 0
                            }
                          >
                            <Option value="" />
                            <Option value="Net 15">Net 15</Option>
                            <Option value="Net 30">Net 30</Option>
                            <Option value="Net 45">Net 45</Option>
                            <Option value="Net 60">Net 60</Option>
                            <Option value="Due End of the month">Due End of the month</Option>
                            <Option value="Due End of the next month">
                              Due End of the next month
                            </Option>
                            <Option value="Due on Receipt">Due on Receipt</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row>
                      <Col span={11}>
                        <Form.Item
                          name="tax"
                          className="form__input--label not--required--field"
                          label="Tax"
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
                          name="tax_id"
                          className="form__input--label not--required--field"
                          label="Tax ID"
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
                          name="bank_acc_number"
                          className="form__input--label not--required--field"
                          label="Bank Account Number"
                        >
                          <Input placeholder="" onKeyPress={HelperFunction.isValidMobile} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row>
                      <Col span={11}>
                        <Form.Item
                          name="bank_acc_name"
                          className="form__input--label not--required--field"
                          label="Bank Account Name"
                        >
                          <Input placeholder="" onKeyPress={HelperFunction.isValidString} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row>
                      <Col span={11}>
                        <Form.Item
                          name="industry"
                          className="form__input--label not--required--field"
                          label="Industry"
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
                          name="company_reg_number"
                          className="form__input--label not--required--field"
                          label="Company Register Number"
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
                          name="opening_balance"
                          label="Opening Balance"
                          className="form__input--label"
                          rules={[
                            {
                              type: 'number',
                              required: true,
                            },
                          ]}
                        >
                          <InputNumber
                            type="number"
                            precision={selOrgData?.decimals}
                            style={{ width: '100%' }}
                            placeholder="Please enter amount"
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
                          name="notes"
                          className="form__input--label not--required--field"
                          label="Notes"
                        >
                          {/* <Input placeholder="" /> */}
                          <TextArea />
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
                <Link to="/contacts/customers">Cancel</Link>
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
        <div>
          {/* <hr /> */}
          <DisplayJournal
            // type="purchase invoice"
            trId={match?.params?.customerId}
            formName="customer"
            isJournal={false}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})

// export default WithRouter(CreateCustomer)
export default connect(mapStateToProps)(WithRouter(CreateCustomer));
// const CreateCustomer = Form.create({})(FormComponent)

// export default CreateCustomer


