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
  Row,
  Col,
  Upload,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import ReactDOM from 'react-dom'
import moment from 'moment'
import { Link, useNavigate } from 'react-router-dom'
import { Country, State, City } from 'country-state-city'
import { connect } from 'react-redux'
import { history } from '@/main'
import _ from 'lodash'
import store from 'store'
// import countryList from 'react-select-country-list'
import OrganizationService from '@/services/organization'
// import './index.scss'

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
  // const options = useMemo(() => country().getData(), [])
  const [form] = Form.useForm()
  const {
    userData,
    dispatch,
    // match: {
    //   params: { orgId="" },
    // },
  } = props

  const orgId = props?.routerData?.location?.pathname?.split('/')[4] || ''
  const formRef = React.createRef()
  // console.log(userData, 'userData')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [orgList, getOrgList] = useState([])
  const [selectedTimezone, setSelectedTimezone] = useState('')
  const [orgData, setOrgData] = useState({})
  const countryData = useMemo(() => Country.getAllCountries(), [])
  // console.log(countryData)
  const [stateData, setStateData] = useState([])
  const [cityData, setCityData] = useState([])
  const [isDirty, setDirty] = useState(false)

  const formValuesChange = e => {
    const isDirtyVal = Object.keys(e).length
    setDirty(isDirtyVal)
  }
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
    if (orgId) {
      const fetchData = async () => {
        const result = await OrganizationService.organizationListById(orgId)
        // console.log('result', result)
        result.currDate = moment(result.currDate)
        result.lastFinYear = moment(result.lastFinYear)
        setStateData(State.getStatesOfCountry(result.businessLocation))
        setCityData(City.getCitiesOfState(result.businessLocation, result.state))

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
    const { currency } = values
    // console.log(values, 'value')
    values.currDate = moment().format('MM/DD/YYYY')
    values.userId = userData.id
    values.isActive = true
    // values.currency = currency.value
    values.subcrPlan = values.subcrPlan || 'STARTER'
    values.lastFinYear = moment(values.lastFinYear).format('MM/DD/YYYY')

    const logoFileList = values.logo
    delete values.logo
    values.imageFile = logoFileList && logoFileList[0] && logoFileList[0].originFileObj

    const method = orgId ? 'put' : 'post'

    const fetchData = async () => {
      const result = await OrganizationService.createOrganization(values, method)
      const savedOrg = result && result.data && result.data.data
      // A newly created organization isn't auto-selected anywhere else in the
      // app, so subsequent requests (create customer, vendor, etc.) were
      // sending a null orgCode header until the user manually picked it from
      // the TopBar dropdown. Select it automatically right after creation.
      if (savedOrg && !orgId) {
        store.set('organization', savedOrg)
        store.set('selectedOrg', savedOrg)
      }
      setDirty(false)
      history.push('/user/organizations')
      // handleCancel()
      // console.log(result, 'result')
    }

    if (values.from === 'PLAN') {
      history.push({
        pathname: '/subscription-plan',
        state: values,
      })
    } else {
      fetchData()
    }
  }

  const onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo)
  }

  const handleName = e => {
    // console.log('Failed:', e)
    window.location.reload()
  }

  const handleBtn = () => {
    // console.log('working', formRef)
    formRef.current.setFieldsValue({ from: 'PLAN' })
    formRef.current.submit()
    // formRef.current.getFieldsValue(['organizationName'],(x)=>{
    //   // console.log(x)
    // })
  }

  const handleCountry = val => {
    const currencyObj = countryData.find(x => x.isoCode === val)
    // console.log(val, 'val', currencyObj)
    formRef.current.setFieldsValue({ city: '', state: '', currency: currencyObj.currency })
    setStateData(State.getStatesOfCountry(val))
  }

  const handleState = val => {
    const countryCode = formRef.current.getFieldValue('businessLocation')
    formRef.current.setFieldsValue({ city: '' })
    setCityData(City.getCitiesOfState(countryCode, val))
  }
  const match = {}
  return (
    <div>
      <Form
        className="form__layout--css"
        layout="horizontal"
        form={form}
        ref={formRef}
        // style={{ width: '80%', margin: '0 auto' }}
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onValuesChange={formValuesChange}
      >
        <Row className="mb-3 form__header--css">
          <Col span={12} style={{ fontSize: '18px' }}>
            {orgId ? <span>Edit: {orgId}</span> : 'New Organization'}
          </Col>
          <Col span={12} className="text-end" style={{ display: 'flex', justifyContent: 'end' }}>
            {orgId ? (
              <>
                <Button type="default" className="text-center me-2" htmlType="submit">
                  <Link to="/user/organizations">Cancel</Link>
                </Button>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Update
                  </Button>
                </Form.Item>
              </>
            ) : (
              <Form.Item>
                <Button type="default" className="text-center me-2" htmlType="submit">
                  <Link to="/user/organizations">Cancel</Link>
                </Button>
                <Button type="button" className="text-center me-2" onClick={handleBtn}>
                  Buy Now
                </Button>
                <Button type="primary" className="text-center me-2" htmlType="submit">
                  Start Trial
                </Button>
              </Form.Item>
            )}
          </Col>
        </Row>
        <div className="form__content--css p-0">
          <Row className="form__body-content">
            <Col span={24} className="fs-13 text-uppercase mb-3">
              <span className="bulletIcon">Basic Information</span>
            </Col>
            <Col span={24}>
              <Row>
                <Col span={11}>
                  <Form.Item
                    label="Organization Name"
                    name="orgName"
                    className="form__input--label"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Organization!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            {/* <div className="col-sm-6">
            <Form.Item label="Organization Code" name="orgCode">
              <Input disabled />
            </Form.Item>
          </div> */}
            {orgId && (
              <>
                <Col span={24}>
                  <Row>
                    <Col span={11}>
                      <Form.Item
                        label="Organization Code"
                        className="form__input--label not--required--field"
                        name="orgCode"
                      >
                        <Input disabled />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row>
                    <Col span={11}>
                      <Form.Item
                        label="Organization id"
                        className="form__input--label not--required--field"
                        name="id"
                      >
                        <Input disabled />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row>
                    <Col span={11}>
                      <Form.Item
                        label="SubScription Plan"
                        className="form__input--label not--required--field"
                        name="subcrPlan"
                      >
                        <Input disabled />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </>
            )}

            <Col span={24}>
              <Row>
                <Col span={11}>
                  <Form.Item
                    label="Industry"
                    className="form__input--label not--required--field"
                    name="industry"
                  >
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
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row>
                <Col span={11}>
                  <Form.Item
                    label="Country"
                    name="businessLocation"
                    className="form__input--label"
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
                    label="State"
                    name="state"
                    className="form__input--label"
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
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row>
                <Col span={11}>
                  <Form.Item
                    label="City"
                    name="city"
                    className="form__input--label"
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
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row>
                <Col span={11}>
                  <Form.Item
                    label="Street"
                    className="form__input--label not--required--field"
                    name="street"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row>
                <Col span={11}>
                  <Form.Item
                    label="Organization Logo"
                    className="form__input--label not--required--field"
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
                </Col>
              </Row>
            </Col>
            {/* <Col span={24}>
              <Row>
                <Col span={11}>
                  <Form.Item label="from" className="form__input--label" name="from">
                    <Input type="hidden" />
                  </Form.Item>
                </Col>
              </Row>
            </Col> */}
            <Col span={24}>
              <Row>
                <Col span={11}>
                  <Form.Item
                    label="Zip Code"
                    name="zipCode"
                    className="form__input--label"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Address!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row>
                <Col span={11}>
                  <Form.Item
                    label="Currency"
                    name="currency"
                    className="form__input--label"
                    rules={[
                      {
                        required: true,
                        message: 'Please select currency!',
                      },
                    ]}
                  >
                    {/* <Select placeholder="Select Currency" disabled>
                <Option value="INR">INR</Option>
                <Option value="USD">USD</Option>
                <Option value="KWT">KWT</Option>
              </Select> */}
                    <Input disabled />
                    {/* <SelectCurrency /> */}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row>
                <Col span={11}>
                  <Form.Item
                    label="Decimal"
                    name="decimals"
                    className="form__input--label"
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
                    <Input />
                    {/* <SelectCurrency /> */}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row>
                <Col span={11}>
                  <Form.Item
                    label="Financial Start Year"
                    className="form__input--label not--required--field"
                    name="lastFinYear"
                  >
                    <DatePicker format="DD MMM YYYY" />
                    {/* <Input /> */}
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            {/* <div className="col-sm-6">
            <Form.Item label="Time Zone" name="timeZone">
                style={{ width: '100%' }}
                className="timezone__piker"
                value="Asia/Yerevan"
                inputProps={{
                  placeholder: 'Select Timezone...',
                  name: 'timezone',
                }}
              />
            </Form.Item>
          </div> */}

            <Col span={24}>
              <Row>
                <Col span={11}>
                  <Form.Item
                    label="Do you have Employee?"
                    className="form__input--label not--required--field"
                    name="isEmployee"
                  >
                    <Radio.Group>
                      <Radio value="yes">Yes</Radio>
                      <Radio value="no">No</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <hr />
          <div className="text-end pb-1 me-2">
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              {orgId ? (
                <>
                  <Button type="default" className="text-center me-2" htmlType="submit">
                    <Link to="/user/organizations">Cancel</Link>
                  </Button>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Update
                    </Button>
                  </Form.Item>
                </>
              ) : (
                <Form.Item>
                  <Button type="default" className="text-center me-2" htmlType="submit">
                    <Link to="/user/organizations">Cancel</Link>
                  </Button>
                  <Button type="button" className="text-center me-2" onClick={handleBtn}>
                    Buy Now
                  </Button>
                  <Button type="primary" className="text-center me-2" htmlType="submit">
                    Start Trial
                  </Button>
                </Form.Item>
              )}
            </div>
          </div>
        </div></Form>
    </div>
  )
}

export default connect(mapStateToProps)(CreateOrganizationComp)


