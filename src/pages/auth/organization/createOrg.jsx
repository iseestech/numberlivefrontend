import React, { useMemo, useState, useEffect } from 'react'
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
  Radio,
  notification,
  Result,
  Spin,
  Upload,
} from 'antd'
import { SmileOutlined, LoadingOutlined, UploadOutlined } from '@ant-design/icons'
import store from 'store'
import ReactDOM from 'react-dom'
import { Country, State, City } from 'country-state-city'
import moment from 'moment'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { history } from '@/main'
// import countryList from 'react-select-country-list'
import OrganizationService from '@/services/organization'
// import './index.scss'
// const { Option } = Select;

// function info() {
//   Modal.info({
//     title: 'This is a notification message',
//     content: (
//       <div>
//         <p>some messages...some messages...</p>
//         <p>some messages...some messages...</p>
//       </div>
//     ),
//     onOk() {},
//   });
// }

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

const mapStateToProps = ({ user, dispatch }) => ({
  userData: user,
  dispatch,
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
const industryData = [
  'Agriculture; plantations;other rural sectors ',
  'Basic Metal Production ',
  'Chemical industries ',
  'Commerce ',
  'Construction ',
  'Education ',
  'Financial services; professional services ',
  'Food; drink; tobacco ',
  'Forestry; wood; pulp and paper ',
  'Health services ',
  'Hotels; tourism; catering ',
  'Information Technolofy',
  'Mining (coal; other mining) ',
  'Mechanical and electrical engineering ',
  'Media; culture; graphical ',
  'Oil and gas production; oil refining ',
  'Postal and telecommunications services ',
  'Public service ',
  'Shipping; ports; fisheries; inland waterways ',
  'Textiles; clothing; leather; footwear ',
  'Transport (including civil aviation; railways; road transport) ',
  'Transport equipment manufacturing ',
  'Utilities (water; gas; electricity) ',
]
const CreateOrganizationComp = props => {
  const [value, setValue] = useState('')
  const countryList = useMemo(() => Country.getAllCountries(), [])
  const [form] = Form.useForm()
  const {
    userData,
    dispatch,
    match: {
      params: { orgId },
    },
  } = props

  const formRef = React.createRef()
  // console.log(userData, 'userData')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [orgList, getOrgList] = useState([])
  const [selectedTimezone, setSelectedTimezone] = useState('')
  const [stateData, setStateData] = useState([])
  const [cityData, setCityData] = useState([])
  const [orgData, setOrgData] = useState({})
  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    // setIsModalVisible(false)
    setIsLoading(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const hideModal = () => {
    setIsModalVisible(false)
  }

  useEffect(() => {
    if (orgId) {
      const fetchData = async () => {
        const result = await OrganizationService.organizationListById(orgId)
        form.setFieldsValue({ ...result })
        // getOrgList(result ? result.data : [])
      }
      fetchData()
    }
    //
  }, [orgId, form])

  const normLogoFile = e => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }

  const onFinish = (values, fromD) => {
    console.log(values, 'value')
    const { currency } = values
    const accessToken = store.get('accessToken')
    console.log(values, 'value')
    values.currDate = moment().format('MM/DD/YYYY')
    values.userId = userData.id
    values.isActive = true
    // values.currency = currency.value
    values.subcrPlan = 'STARTER'
    values.lastFinYear = moment(values.lastFinYear).format('MM/DD/YYYY')

    const logoFileList = values.logo
    delete values.logo
    values.imageFile = logoFileList && logoFileList[0] && logoFileList[0].originFileObj

    setIsModalVisible(true)

    console.log(values, 'values')
    const fetchData = async () => {
      const result = await OrganizationService.createOrganization(values, 'post')
      //   history.push('/user/organizations')
      // handleCancel()
      //   console.log(result, 'result')
      notification.success({
        message: 'Succesfully Created',
        description: 'You have successfully created the Organization',
        duration: 5,
      })
      if (accessToken.length) {
        setIsLoading(false)
        // history.push('/dashboard/alpha')
      } else {
        history.push('/auth/login')
      }
    }

    fetchData()
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const handleName = e => {
    console.log('Failed:', e)
    // window.location.reload()
  }

  const handleBtn = () => {
    // console.log('working', formRef)
    formRef.current.setFieldsValue({ from: 'PLAN' })
    formRef.current.submit()
    // formRef.current.getFieldsValue(['organizationName'],(x)=>{
    //   console.log(x)
    // })
  }
  // console.log('option', options)
  const handleCountry = val => {
    const currencyObj = countryList.find(x => x.isoCode === val)
    console.log(val, 'val', currencyObj)

    formRef.current.setFieldsValue({ city: '', state: '', currency: currencyObj.currency })
    setStateData(State.getStatesOfCountry(val))
  }

  const handleState = val => {
    const countryCode = formRef.current.getFieldValue('businessLocation')
    formRef.current.setFieldsValue({ city: '' })
    setCityData(City.getCitiesOfState(countryCode, val))
  }

  return (
    <div>
      <Form
        form={form}
        ref={formRef}
        style={{ margin: '0 auto', border: '1px solid #CCC', padding: '30px' }}
        name="basic"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Modal
          centered
          // title="Basic Modal"
          visible={isModalVisible}
          footer={null}
          // onOk={handleOk}
          // onCancel={handleCancel}
          closable={false}
        >
          {isLoading ? (
            <h5>
              {' '}
              <Spin indicator={antIcon} /> Please wait we are preparing your dashboard...{' '}
            </h5>
          ) : (
            <Result
              icon={<SmileOutlined />}
              title="Great, we have done all the operations!"
              extra={
                <Button type="primary">
                  <Link to="/dashboard/alpha">Go to Dashboard</Link>
                </Button>
              }
            />
          )}
        </Modal>
        <h3>Create Organization</h3>
        <br />
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
              autoComplete="off"
            >
              <Input autoComplete="off" />
            </Form.Item>
          </div>
          <div className="col-sm-6">
            <Form.Item label="Industry" name="industry">
              <Select
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {industryData.map((item, index) => {
                  return (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  )
                })}
              </Select>
            </Form.Item>
          </div>
          <div className="col-sm-6">
            <Form.Item
              label="Country"
              name="businessLocation"
              rules={[
                {
                  required: true,
                  message: 'Please Select Your Location!',
                },
              ]}
            >
              {/*  <Input /> */}
              {/* <Select showSearch options={options} value={value} /> */}
              <Select
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={handleCountry}
              >
                {countryList.map((item, index) => {
                  return (
                    <Option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </Option>
                  )
                })}
              </Select>
            </Form.Item>
          </div>
          {/* <div className="col-sm-6">
            <Form.Item label="Organization Code" name="orgCode">
              <Input disabled />
            </Form.Item>
          </div> */}
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
              <Select
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={handleState}
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
          </div>
          <div className="col-sm-6">
            <Form.Item label="Street" name="street">
              <Input />
            </Form.Item>
          </div>
          <div className="col-sm-6">
            <Form.Item
              label="Organization Logo"
              name="logo"
              valuePropName="fileList"
              getValueFromEvent={normLogoFile}
            >
              <Upload
                listType="picture"
                accept="image/*"
                maxCount={1}
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>Select Logo</Button>
              </Upload>
            </Form.Item>
          </div>
          <div className="col-sm-6" style={{ display: 'none' }}>
            <Form.Item label="from" name="from">
              <Input type="hidden" />
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
            <Form.Item
              label="Currency"
              name="currency"
              // rules={[
              //   {
              //     required: true,
              //     message: 'Please select currency!',
              //   },
              // ]}
            >
              {/* <Select placeholder="Select Currency" disabled>
                <Option value="INR">INR</Option>
                <Option value="USD">USD</Option>
                <Option value="KWT">KWT</Option>
              </Select> */}
              <Input disabled />
              {/* <SelectCurrency /> */}
            </Form.Item>
          </div>
          <div className="col-sm-6">
            <Form.Item label="Financial Year" name="lastFinYear">
              {/* <Space direction="vertical">
                <DatePicker format={"MM/DD"}/>
              </Space> */}
              <DatePicker format="DD MMM YYYY" />
            </Form.Item>
          </div>
          {/* <div className="col-sm-6">
            <Form.Item label="Time Zone" name="timeZone">
                className="timezone__piker"
                value="Asia/Yerevan"
                inputProps={{
                  placeholder: 'Select Timezone...',
                  name: 'timezone',
                }}
              />
            </Form.Item>
          </div> */}
          <div className="col-sm-6">
            <Form.Item label="Do you have Employee?" name="isEmployee">
              <Radio.Group>
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
          {/* <div className="col-sm-6">
            <Form.Item label="Select Plan" name="subcrPlan">
              <Select style={{ width: 180 }} placeholder="Enter Name" labelInValue>
                <Option value="STARTER">Starter</Option>
                <Option value="STANDARD">Standard</Option>
                <Option value="PREMIUM">Premium</Option>
              </Select>
            </Form.Item>
          </div> */}
          <div className="col-sm-12 text-center">
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Create Organization
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  )
}

export default connect(mapStateToProps)(CreateOrganizationComp)
