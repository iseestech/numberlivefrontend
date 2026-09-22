import React, { useState, useEffect } from 'react'
import store from 'store'
import {
  Table,
  Popconfirm,
  Button,
  Input,
  Form,
  Select,
  Divider,
  Modal,
  Checkbox,
  Space,
  DatePicker,
} from 'antd'
import ReactDOM from 'react-dom'
import moment from 'moment'
import _ from 'lodash'
import { Link, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
// import TimezonePicker from 'react-timezone'
import { DownOutlined } from '@ant-design/icons'

// import SelectCurrency   from 'react-select-currency'
import OrganizationService from '@/services/organization'
import './index.scss'

const mapStateToProps = ({ user }) => ({
  userData: user,
})

const { TextArea } = Input
const { Option } = Select

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 6,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
}

const Organization = props => {
  const { userData } = props
  const { organization } = userData
  const orgData = store.get('organization')
  const selOrgData = store.get('selectedOrg')
  // console.log(selOrgData, 'selOrgData', orgData)

  // console.log(orgData, 'orgData')
  // store.set('organization', organization)
  // console.log(organization, 'organization')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [orgList, getOrgList] = useState([])
  const [selectedTimezone, setSelectedTimezone] = useState('')

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(true)
  }
  const hideModal = () => {
    setIsModalVisible(false)
  }

  useEffect(() => {
    const { id } = userData
    const fetchData = async () => {
      const result = await OrganizationService.organizationList(id)
      // console.log(result, 'result')
      getOrgList((result && result.data) || [])
    }
    fetchData()
  }, [userData])

  const onFinish = values => {
    // console.log('Success:', values)
    values.currDate = new Date().toLocaleDateString()
    // values.userId = userData.id
    const fetchData = async () => {
      const result = await OrganizationService.createOrganization(values, 'post')
      // history.push('/sales/quotations')
      handleCancel()
      // console.log(result, 'result')
    }

    return fetchData()
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const handleName = e => {
    // console.log('Failed:', e)
    const selectedOrg = orgList.filter(item => item.id === e.value)
    // console.log('selectedOrg',selectedOrg)
    store.set('organization', selectedOrg[0])
    store.set('selectedOrg', selectedOrg[0])

    window.location.reload()
  }

  return (
    <div>
      <Select
        style={{ width: 180 }}
        placeholder="Enter Name"
        labelInValue
        defaultValue={{ value: (orgData && orgData?.id) || (selOrgData && selOrgData.id) }}
        onChange={e => handleName(e)}
        // suffixIcon={<DownOutlined />}
        popupRender={menu => (
          <div>
            {menu}
            <Divider style={{ margin: '4px 0' }} />
            {/* <div className="text-center">
              <Button type="primary" onClick={showModal}>
                Add Organization
              </Button>
            </div> */}
            <div className="text-center">
              <Button type="primary">
                <Link to="/user/organization/create">Create Organization</Link>
              </Button>
            </div>
            <Divider style={{ margin: '4px 0' }} />
            <div className="text-center">
              <Button type="primary">
                <Link to="/user/organizations">Manage Organization</Link>
              </Button>
            </div>
          </div>
        )}
      >
        {orgList.map((item, index) => (
          <Option value={item.id} key={item.id}>
            {item.orgName}
          </Option>
        ))}
      </Select>
      <span style={{ marginLeft: '8px', fontSize: '0.7em', color: 'gray' }}>
        ID:{selOrgData?.orgCode || ' '}
      </span>
      {/* <Button type="primary" onClick={showModal}>
        Open Modal
      </Button> */}
      <Modal
        title="Create Organization"
        footer={null}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
      >
        <Form
          // {...layout}
          name="basic"
          layout="vertical"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div className="row">
            <div className="col-sm-6">
              <Form.Item
                label="Organization Name"
                name="orgName"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Organization!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="col-sm-6">
              <Form.Item
                label="Business Location"
                name="businessLocation"
                rules={[
                  {
                    required: true,
                    message: 'Please Select Your Location!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="col-sm-6">
              <Form.Item
                label="Organization Code"
                name="orgCode"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Organization code!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="col-sm-6">
              <Form.Item label="Industry" name="industry">
                <Input />
              </Form.Item>
            </div>
            <div className="col-sm-6">
              <Form.Item label="Street" name="street">
                <Input />
              </Form.Item>
            </div>
            <div className="col-sm-6">
              <Form.Item
                label="City"
                name="city"
                rules={[
                  {
                    required: true,
                    message: 'Please input your city!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="col-sm-6">
              <Form.Item
                label="State"
                name="state"
                rules={[
                  {
                    required: true,
                    message: 'Please input your state!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="col-sm-6">
              <Form.Item
                label="Zip Code"
                name="zipCode"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Address!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="col-sm-6">
              <Form.Item label="Currency" name="currency">
                <Input />
                {/* <SelectCurrency /> */}
              </Form.Item>
            </div>
            {/* <div className="col-sm-6">
              <Form.Item label="Time Zone" name="timeZone">
                <TimezonePicker
                  className="timezone__piker"
                  value="Asia/Yerevan"
                  onChange={timezone => console.log('New Timezone Selected:', timezone)}
                  inputProps={{
                    placeholder: 'Select Timezone...',
                    name: 'timezone',
                  }}
                />
              </Form.Item>
            </div> */}
            <div className="col-sm-6">
              <Form.Item label="Last Day of Financial Year " name="lastFinYear">
                <DatePicker format="MM/DD" />
              </Form.Item>
            </div>
            <div className="col-sm-12 text-center">
              <Form.Item>
                <Button onClick={hideModal}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default connect(mapStateToProps)(Organization)
