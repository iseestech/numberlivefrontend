import React from 'react'
import { Helmet } from 'react-helmet'
import { Link, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
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
  Form,
  Radio,
} from 'antd'

const { Dragger } = Upload
const { Option } = Select

const CreateQuotation = props => {
  const location = useLocation()
  const routeName = location.pathname.split('/')
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
          <Form layout="vertical">
            <div className="row">
              <div className="col-md-4">
                <Form.Item name="custName" label="Customer Name">
                  <Input placeholder="Enter Customer Name" />
                </Form.Item>
              </div>
              <div className="col-md-4">
                <Form.Item name="address3-1" label="Date">
                  <Input placeholder="Enter date" />
                </Form.Item>
              </div>
              <div className="col-md-4">
                <Form.Item name="address3-1" label="Expiration Date">
                  <Input placeholder="Enter date" />
                </Form.Item>
              </div>
              <div className="col-md-4">
                <Form.Item name="address3-1" label="recipient">
                  <Input placeholder="Recipient Name" />
                </Form.Item>
              </div>
              <div className="col-md-4">
                <Form.Item name="address3-1" label="Currency">
                  <Input placeholder="Currency" />
                </Form.Item>
              </div>
              <div className="col-md-4">
                <Form.Item name="address3-1" label="Payment Terms">
                  <Input placeholder="PaymentTerms" />
                </Form.Item>
              </div>
              <div className="col-md-3">
                <Form.Item name="address3-1" label="Address">
                  <Input placeholder="Enter Address" />
                </Form.Item>
              </div>
              <div className="col-md-3">
                <Form.Item name="custState" label="Country">
                  <Input />
                </Form.Item>
              </div>
              <div className="col-md-2">
                <Form.Item name="custState" label="State">
                  <Input />
                </Form.Item>
              </div>
              <div className="col-md-2">
                <Form.Item name="custState" label="City">
                  <Input />
                </Form.Item>
              </div>
              <div className="col-md-2">
                <Form.Item name="zip" label="Zip">
                  <Input />
                </Form.Item>
              </div>
              <div className="col-md-12">
                <strong>Add Product : </strong>
              </div>
              <div className="col-md-1">
                <Form.Item name="address3-1" label="#">
                  <Input type="checkbox" placeholder="" />
                </Form.Item>
              </div>
              <div className="col-md-3">
                <Form.Item name="address3-1" label="Product">
                  <Input placeholder="" />
                </Form.Item>
              </div>
              <div className="col-md-2">
                <Form.Item name="address3-1" label="Description">
                  <Input placeholder="" />
                </Form.Item>
              </div>
              <div className="col-md-2">
                <Form.Item name="address3-1" label="Price">
                  <Input placeholder="" />
                </Form.Item>
              </div>
              <div className="col-md-1">
                <Form.Item name="address3-1" label="Quantity">
                  <Input placeholder="" />
                </Form.Item>
              </div>
              <div className="col-md-1">
                <Form.Item name="address3-1" label="Discount">
                  <Input placeholder="" />
                </Form.Item>
              </div>
              <div className="col-md-2">
                <Form.Item name="address3-1" label="Total">
                  <Input placeholder="" />
                </Form.Item>
              </div>
              <div className="col-md-12 text-start">
                <Form.Item name="confirm4">
                  <button type="button" className="btn btn-primary px-5 m-1">
                    {' '}
                    Add Product / Service{' '}
                  </button>
                  <button type="button" className="btn btn-danger px-5">
                    <span>Remove</span>
                  </button>
                </Form.Item>
              </div>
              <div className="col-md-12">
                <Form.Item name="address3-1" label="Notes">
                  <Input placeholder="" />
                </Form.Item>
              </div>
              <div className="col-md-2">
                <Form.Item name="address3-1" label="Subtotal">
                  <Input placeholder="" />
                </Form.Item>
              </div>
              <div className="col-md-2">
                <Form.Item name="address3-1" label="Discount Rate">
                  <Input placeholder="Eployee Count" />
                </Form.Item>
              </div>
              <div className="col-md-2">
                <Form.Item name="address3-1" label="Discount Amount">
                  <Input placeholder="" />
                </Form.Item>
              </div>
              <div className="col-md-2">
                <Form.Item name="address3-1" label="Tax">
                  <Input placeholder="" />
                </Form.Item>
              </div>
              <div className="col-md-2">
                <Form.Item name="address3-1" label="Other Cost">
                  <Input placeholder="" />
                </Form.Item>
              </div>
              <div className="col-md-2">
                <Form.Item name="address3-1" label="Total Amount">
                  <Input placeholder="" />
                </Form.Item>
              </div>
              <div className="col-md-12 text-center">
                <Form.Item name="confirm4">
                  <button type="button" className="btn btn-light px-5 m-1">
                    <a href="#/contacts/customers">Cancel</a>
                  </button>
                  <button type="button" className="btn btn-success px-5">
                    {' '}
                    Create{' '}
                  </button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default connect()(CreateQuotation)
