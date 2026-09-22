import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import { InboxOutlined } from '@ant-design/icons'
import PhoneInput from 'react-phone-input-2'
import { Country, State, City } from 'country-state-city'
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
  InputNumber,
  Form,
  Row,
  Col,
} from 'antd'
import _ from 'lodash'
// import {Form } from '@ant-design/compatible'
import apiClient from '@/services/axios'
import VendorService from '@/services/vendor'
import { history } from '@/main'
import store from 'store'
import '../index.scss'
import DisplayJournal from '@/components/accountancy/common/DisplayJournal'
import HelperFunction from '@/services/helper'
import WithRouter from '@/WithRouter'
const selOrgData = store.get('selectedOrg')

const { TextArea } = Input
const { Dragger } = Upload
const { Option } = Select

// @connect()
class CreateVendor extends React.Component {
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
    }

    // This binding is necessary to make `this` work in the callback
    this.onFinish = this.onFinish.bind(this)
    this.onFinishFailed = this.onFinishFailed.bind(this)
    this.formRef = React.createRef()
  }

  componentDidMount() {
    const { params } = this.props
    const id = params.customerId
    if (!id) {
      return
    }
    const getData = async () => {
      const result = await VendorService.getCustomer(id)
      // console.log(result, 'result')
      const data = []

      // const objKeys = ['address1', 'city', 'country', 'email', 'phoneNo', 'state', 'zipCode']

      // _.forEach(result.billingAddress, (value, key) => {
      //   if (objKeys.indexOf(key) > -1) {
      //     result[key] = value
      //   }
      // })

      // _.forEach(result.shippingAddress, (value, key) => {
      //   if (objKeys.indexOf(key) > -1) {
      //     result[`delivery_${key}`] = value
      //   }
      // })

      // console.log(result, 'result')

      _.forEach(result, (val, key) => {
        data.push({
          name: [key],
          value: !val ? '' : val,
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
    const { params, fromModal, handleNewCustomer } = this.props
    const id = params.customerId
    const { isLoading, masterData } = this.state
    let method = 'post'

    // address1, city, country, email, phoneNo, state, zipCode;
    // const objBillKeys = ['address1', 'city', 'country', 'email', 'phoneNo', 'state', 'zipCode']
    // const objShipKeys = [
    //   'delivery_address1',
    //   'delivery_city',
    //   'delivery_country',
    //   'delivery_email',
    //   'delivery_phoneNo',
    //   'delivery_state',
    //   'delivery_zipCode',
    // ]
    // const shippingAddress = {}
    // const billingAddress = {}

    // values.forEach((key, value) => {
    //   if(objKeys.indexOf(key)) {
    //     shippingAddress[key] = value;
    //     delete values[key];
    //   }
    // })
    // _.forEach(values, (value, key) => {
    //   // console.log(key)
    //   if (objBillKeys.indexOf(key) > -1) {
    //     billingAddress[key] = value
    //     delete values[key]
    //   }
    //   if (objShipKeys.indexOf(key) > -1) {
    //     shippingAddress[key.slice(9)] = value
    //     delete values[key]
    //   }
    // })

    // values.billingAddress = billingAddress
    // values.shippingAddress = shippingAddress
    // values.currency = 0
    // values.customer_id = 0
    // values.unuse_credits = 0
    // values.sourceOfSupply = 'string'
    // values.payables = 0
    // values.gst_in = 0
    // values.gst_treatment = 'string'
    // values.id = 0
    // values.created_by = 'Asad'
    // values.customer_email = 'asad@gmail.com'
    if (id) {
      method = 'put'
      values.id = id
    }

    // console.log(values, 'values')
    const newData = Object.assign(masterData, values)

    const fetchData = async () => {
      const result = await VendorService.createCustomer(newData, method)
      // console.log('result', result)
      if (!fromModal) {
        // this.setState(
        //   {
        //     isDirty: false,
        //   },
        //   () => history.push('/contacts/vendors'),
        // )

            this.setState(
              {
                isDirty: false,
              },
              () => {
                this.props.navigate("/contacts/vendors");
              },
            );
        
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

  // handleAddress = e => {
  //   // if (e.target.value === 1) {
  //   // console.log(e.target.value, 'etetet')
  //   const addressValue = ['email', 'phoneNo', 'address1', 'country', 'state', 'city', 'zipCode']

  //   _.forEach(addressValue, (item, key) => {
  //     const objKey = `delivery_${item}`
  //     const value = this.formRef.current.getFieldValue(item)
  //     this.formRef.current.setFieldsValue({ [objKey]: value })
  //   })
  //   // }
  // }

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

  handleZipCode = (e, key) => {
    const { value } = e.target
    this.formRef.current.setFieldsValue({ [key]: value.trim() })
  }

  render() {
    const { params, form } = this.props
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
    } = this.state
    // const { address } = customerData;
    return (
      <div>
        <Form
          fields={customerData}
          ref={this.formRef}
          layout="horizontal"
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          onValuesChange={this.formValuesChange}
          className="form__layout--css"
        >
          <Row className="mb-3 form__header--css">
            <Col span={20} style={{ fontSize: '18px' }}>
              {action === 'Create' ? 'New Vendor' : `Edit: ${params.customerId}`}
            </Col>
            <Col span={4} className="text-end">
              <Button type="default" className="text-center me-2" htmlType="submit">
                <Link to="/contacts/vendors">Cancel</Link>
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
                      name="companyName"
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
                      name="firstName"
                      label="First Name"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Enter first name!',
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
                      name="lastName"
                      label="Last Name"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Enter last name!',
                        },
                      ]}
                    >
                      <Input placeholder="Enter Last Name" />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              {/* <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="vendorDisplayName"
                      label="Vendor Display Name"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Enter display name!',
                        },
                      ]}
                    >
                      <Input placeholder="" />
                    </Form.Item>
                  </Col>
                </Row>
              </Col> */}
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="vendorEmail"
                      label="E-mail"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          type: 'email',
                          // message: 'Enter email address!',
                        },
                      ]}
                    >
                      <Input placeholder="Enter email address" />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="ven_mobile"
                      label="Mobile"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Enter mobile address!',
                        },
                      ]}
                    >
                      <Input placeholder="" onKeyPress={HelperFunction.isValidMobile} />
                      {/* <PhoneInput country="in" className="phone__number__css" /> */}
                    </Form.Item>
                  </Col>
                </Row>
                <hr />
              </Col>

              <Col span={12}>
                <Row>
                  <Col span={22} className="fs-13 text-uppercase mb-3">
                    <span className="bulletIcon">Billing Address</span>
                  </Col>
                  <Col span={22}>
                    <Form.Item
                      name="address1"
                      label="Address"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Enter address!',
                        },
                      ]}
                    >
                      <Input placeholder="" />
                    </Form.Item>
                  </Col>
                  <Col span={22}>
                    <Form.Item
                      name="country"
                      label="Country"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Enter country!',
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
                      rules={[
                        {
                          required: true,
                          message: 'Enter state!',
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
                  <Col span={22}>
                    <Form.Item
                      name="city"
                      label="City"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Enter city!',
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
                  <Col span={22}>
                    <Form.Item
                      name="zipCode"
                      label="Zip"
                      className="form__input--label not--required--field"
                    >
                      <Input onChange={e => this.handleZipCode(e, 'zipCode')} />
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
                          className="form__input--label not--required--field"
                          name="payment_terms"
                          label="Payment terms"
                        >
                          <Select
                            placeholder="Select Payment term"
                            showSearch
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
                          className="form__input--label not--required--field"
                          name="tds"
                          label="TDS"
                        >
                          <InputNumber placeholder="" style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  {/* <Col span={24}>
                    <Row>
                      <Col span={11}>
                        <Form.Item
                          className="form__input--label not--required--field"
                          name="payment_due_period"
                          label="Payment Due Period"
                        >
                          <Select
                            placeholder="Select Period"
                            showSearch
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            <Option value="PIA">Payment in advance</Option>
                            <Option value="Net 7">Payment seven days after invoice date</Option>
                            <Option value="Net 10">Payment ten days after invoice date</Option>
                            <Option value="Net 30">Payment 30 days after invoice date</Option>
                            <Option value="Net 60">Payment 60 days after invoice date</Option>
                            <Option value="EOM">End of month</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col> */}

                  <Col span={24}>
                    <Row>
                      <Col span={11}>
                        <Form.Item
                          name="opening_blc"
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
                          name="remarks"
                          className="form__input--label not--required--field"
                          label="Remarks"
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
                <Link to="/contacts/vendors">Cancel</Link>
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
          <DisplayJournal
            // type="purchase invoice"
            trId={params?.vendor}
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

// export default connect()(CreateVendor)
export default connect(mapStateToProps)(WithRouter(CreateVendor));
// const CreateCustomer = Form.create({})(FormComponent)

// export default CreateCustomer


