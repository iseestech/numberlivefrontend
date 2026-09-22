import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Table,
  Popconfirm,
  Button,
  Input,
  Form,
  Select,
  Divider,
  Modal,
  DatePicker,
  Menu,
  Dropdown,
} from 'antd'
import moment from 'moment'
import { DownOutlined } from '@ant-design/icons'

const { Option } = Select
const { RangePicker } = DatePicker

const ReportHeader = () => {
  const [dateValue, setDateValue] = useState()

  const menu = (
    <Menu>
      <Menu.Item key="0">Export As XLS</Menu.Item>
      <Menu.Item key="1">Export As CSV</Menu.Item>
    </Menu>
  )

  const onHandleChange = e => {
    // console.log(e)
    const startDay = moment(e[0]).format('DD MMM YYYY')
    const endDay = moment(e[1]).format('DD MMM YYYY')
    setDateValue(`from ${startDay} to ${endDay}`)
  }

  return (
    <div className="row">
      <div className="col-sm-6">
        {dateValue}
        <Form
          layout="horizontal"
          // fields={defaultData}
          style={{ display: 'flex' }}
          // fields={defaultData}
          // onFinish={sort}
          // onFinishFailed={onFinishFailed}
        >
          <Form.Item
            style={{ marginBottom: 0 }}
            className="datewisefilter me-1"
            name="datewise"
            label="Select Date"
            rules={[
              {
                required: true,
                message: 'Please Select Date!',
              },
            ]}
          >
            <RangePicker onChange={e => onHandleChange(e)} />
          </Form.Item>
        </Form>
      </div>
      {/* <div className="col-sm-5">&nbsp;</div> */}
      <div className="col-sm-6">
        <div>
          <Dropdown overlay={menu} trigger={['click']}>
            <Button className="ant-dropdown-link">
              Export As <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>
    </div>
  )
}
const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})

export default connect(mapStateToProps)(ReportHeader)

