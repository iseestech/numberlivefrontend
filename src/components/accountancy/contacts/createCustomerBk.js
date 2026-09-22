import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
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
} from 'antd'
// import {Form } from '@ant-design/compatible'
import CustomerService from '@/services/customer'

const { Dragger } = Upload
const { Option } = Select

// @connect()
class FormComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      customerData: {},
      address: 'erer',
    }

    // This binding is necessary to make `this` work in the callback
    this.onFinish = this.onFinish.bind(this)
    this.onFinishFailed = this.onFinishFailed.bind(this)
  }

  componentDidMount() {
    const { match } = this.props
    // const getData = async () => {
    //   const id = match.params.customerId
    //   const result = await CustomerService.getCustomer(id)
    //   this.setState({
    //     customerData: result,
    //     address: 'updated'
    //   })
    // }
    // getData()
    this.setState({
      customerData: [],
      address: 'updated',
    })
  }

  onFinish = values => {
    values.created_by = 'Asad'
    values.customer_email = 'asad@gmail.com'
    const fetchData = async () => {
      const result = await CustomerService.createCustomer(values)
    }

    return fetchData()
  }

  onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo)
  }

  render() {
    const { match, form } = this.props
    const routeName = match.path.split('/')
    // console.log(form, 'state customerData')
    // const { getFieldDecorator } = form;
    const { customerData, address } = this.state
    // const { address } = customerData;
    return (
      <div>
        <div className="kit__utils__heading">
          <div className="style_breadcrumbs__3JqP-">
            <div>
              <a href="#/dashboard/alpha">Home</a>
              <span>
                <span className="style_arrow__3xq-B" />
                <a
                  href={`#/${routeName[1].replaceAll('-', ' ')}/${routeName[2]}s`}
                  style={{ textTransform: 'capitalize' }}
                >
                  {routeName[1]}
                </a>
                <span className="style_arrow__3xq-B" />
                <strong className="style_current__26jvB">Create {routeName[2]}</strong>
              </span>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <Form
              layout="vertical"
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
              initialValues={{ address }}
            >
              <div className="row">
                <h5 className="col-md-12 mb-4">
                  <strong>Basic Information {address}</strong>
                </h5>
                <div className="col-md-4">
                  <Form.Item name="company_name" label="Company Name">
                    <Input placeholder="Company Name" defaultValue={address} />
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item name="customer_fname" label="First Name">
                    <Input placeholder="Enter Name" />
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item name="customer_lname" label="Last Name">
                    <Input placeholder="Enter Name" />
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item name="phone_nummber" label="Phone No">
                    <Input placeholder="" />
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item name="customer_email" label="E-mail">
                    <Input placeholder="" />
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item name="linked_in_id" label="Linkedin">
                    <Input placeholder="" />
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item name="website" label="Website">
                    <Input placeholder="" />
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item name="opening_balance" label="Opening Balance">
                    <Input placeholder="" />
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item name="address" label="Address">
                    <Input placeholder="1234 Main St." />
                  </Form.Item>
                </div>
                <div className="col-md-2">
                  <Form.Item name="country" label="Country">
                    <Input />
                  </Form.Item>
                </div>
                <div className="col-md-2">
                  <Form.Item name="state" label="State">
                    <Input />
                  </Form.Item>
                </div>
                <div className="col-md-2">
                  <Form.Item name="city" label="City">
                    <Input />
                  </Form.Item>
                </div>
                <div className="col-md-2">
                  <Form.Item name="zip_code" label="Zip">
                    <Input />
                  </Form.Item>
                </div>
                <div className="col-md-12">
                  Use same address for delivery{' '}
                  <Radio.Group defaultValue={1}>
                    <Radio value={1}>Yes</Radio> <Radio value={2}>No</Radio>
                  </Radio.Group>
                  <br />
                  <br />
                </div>
                <div className="col-md-4">
                  <Form.Item name="delivery_email" label="Email">
                    <Input placeholder="1234 Main St." />
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item name="delivery_phone_number" label="Phone No">
                    <Input placeholder="1234 Main St." />
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item name="delivery_address" label="Address">
                    <Input placeholder="1234 Main St." />
                  </Form.Item>
                </div>
                <div className="col-md-2">
                  <Form.Item name="delivery_country" label="Country">
                    <Input />
                  </Form.Item>
                </div>
                <div className="col-md-2">
                  <Form.Item name="delivery_state" label="State">
                    <Input />
                  </Form.Item>
                </div>
                <div className="col-md-2">
                  <Form.Item name="delivery_city" label="City">
                    <Input />
                  </Form.Item>
                </div>
                <div className="col-md-2">
                  <Form.Item name="delivery_zipcode" label="Zip">
                    <Input />
                  </Form.Item>
                </div>
                <div className="col-md-12">
                  <strong>Advance Option : </strong>
                </div>
                <div className="col-md-4">
                  <Form.Item name="payment_terms" label="Payment terms">
                    <Input placeholder="" />
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item name="tax" label="Tax">
                    <Input placeholder="" />
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item name="tax_id" label="Tax ID">
                    <Input placeholder="" />
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item name="bank_acc_number" label="Bank Account Number">
                    <Input placeholder="" />
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item name="bank_acc_name" label="Bank Account Name">
                    <Input placeholder="" />
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item name="employee_count" label="Employee Count">
                    <Input placeholder="Employee Count" />
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item name="industry" label="Industry">
                    <Input placeholder="" />
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item name="company_reg_number" label="Company Register Number">
                    <Input placeholder="" />
                  </Form.Item>
                </div>
                <div className="col-md-12">
                  <Form.Item name="note" label="Notes">
                    <Input placeholder="" />
                  </Form.Item>
                </div>
                <div className="col-md-12 text-center">
                  <Form.Item name="confirm4">
                    <button type="button" className="btn btn-light px-5 m-1">
                      <a href="#/contacts/customers">Cancel</a>
                    </button>
                    <Button type="primary" htmlType="submit" className="btn btn-success px-5">
                      Create
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(FormComponent)

// const CreateCustomer = Form.create({})(FormComponent)

// export default CreateCustomer

