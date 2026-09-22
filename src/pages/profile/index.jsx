import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { InboxOutlined } from '@ant-design/icons'
import {
  Input,
  Tabs,
  Slider,
  Cascader,
  Upload,
  message,
  Checkbox,
  Select,
  Button,
  Form,
} from 'antd'

const { TabPane } = Tabs
const { Dragger } = Upload
const { Search, TextArea } = Input

function callback(key) {
  console.log(key)
}

const UserProfile = () => {
  const opts = {
    name: 'file',
    multiple: true,
    action: '',
    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
  }

  return (
    <div>
      <div className="kit__utils__heading">
        <h5>Profile</h5>
      </div>
      <div className="mb-5">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Personal Information" key="1">
            <div className="card">
              <div className="card-body">
                <Form layout="vertical">
                  <div className="row" style={{ margin: '0' }}>
                    <h5 className="col-md-12 mb-4">
                      <span className="bulletIcon">Basic Information</span>
                    </h5>
                    <div className="col-md-6">
                      <Form.Item name="custName" label="First Name">
                        <Input placeholder="Enter First Name" />
                      </Form.Item>
                    </div>
                    <div className="col-md-6">
                      <Form.Item name="custName" label="Last Name">
                        <Input placeholder="Enter Last Name" />
                      </Form.Item>
                    </div>
                    <div className="col-md-6">
                      <Form.Item name="custName" label="Brief Bio">
                        <TextArea rows={4} />
                        <br />
                        <br />
                        <Form.Item name="custName" label="Job Title">
                          <Input placeholder="Enter Job Title" />
                        </Form.Item>
                      </Form.Item>
                    </div>
                    <div className="col-md-3">
                      <Form.Item valuePropName="fileList" name="upload3" label="Profile Image">
                        <Dragger {...opts}>
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                          </p>
                          <p className="ant-upload-text">
                            Click or drag file to this area to upload
                          </p>
                          <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly prohibit from uploading
                            company data or other band files
                          </p>
                        </Dragger>
                      </Form.Item>
                    </div>
                    <div className="col-md-6">
                      <Form.Item name="custName" label="Address">
                        <Input placeholder="Enter Address" />
                      </Form.Item>
                    </div>
                    <h5 className="col-md-12 mb-4">
                      <strong>Contact Information</strong>
                    </h5>
                    <div className="col-md-4">
                      <Form.Item name="custName" label="Mobile">
                        <Input placeholder="" />
                      </Form.Item>
                    </div>
                    <div className="col-md-4">
                      <Form.Item name="custName" label="Website">
                        <Input placeholder="" />
                      </Form.Item>
                    </div>
                    <div className="col-md-4">
                      <Form.Item name="custName" label="Skype">
                        <Input placeholder="" />
                      </Form.Item>
                    </div>
                    <div className="col-md-4">
                      <Form.Item name="custName" label="Twitter">
                        <Input placeholder="" />
                      </Form.Item>
                    </div>
                    <div className="col-md-4">
                      <Form.Item name="custName" label="LinkedIn">
                        <Input placeholder="" />
                      </Form.Item>
                    </div>
                    <div className="col-md-4">
                      <Form.Item name="custName" label="Facebook">
                        <Input placeholder="" />
                      </Form.Item>
                    </div>
                    <div className="col-md-12 text-end">
                      <button type="submit" className="btn btn-default px-5 me-5">
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-success px-5">
                        Update
                      </button>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </TabPane>
          <TabPane tab="Account Information" key="2">
            <div className="card">
              <div className="card-body">
                <h5 className="mb-4">
                  <strong>Account Information</strong>
                </h5>

                <Form layout="vertical">
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Item name="fullname6" label="Email ID">
                        <Input placeholder="Your Email..." />
                      </Form.Item>
                    </div>
                    <div className="col-md-6">
                      <Form.Item name="email6" label="Password">
                        <Input placeholder="" />
                      </Form.Item>
                    </div>
                    <div className="col-md-12 text-end">
                      <button type="submit" className="btn btn-success px-5">
                        Update
                      </button>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default UserProfile
