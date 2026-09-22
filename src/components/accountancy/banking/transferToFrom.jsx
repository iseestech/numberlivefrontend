import React, { useContext, useState, useEffect, useRef } from 'react'
import {
  Table,
  Popconfirm,
  Button,
  Input,
  Form,
  Radio,
  Select,
  Divider,
  InputNumber,
  Modal,
  DatePicker,
} from 'antd'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import { MenuOutlined, PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import store from 'store'
import axios from 'axios'
import ChartOfAccService from '@/services/chartOfAccount'

import CreateProductModal from '@/components/accountancy/productsAndServices/createProductModal'
import CreateCustomer from '@/components/accountancy/contacts/createCustomer'

import { history } from '@/main'
import BankService from '@/services/banking'
import TextArea from 'antd/lib/input/TextArea'
// import './index.scss'

const { Option } = Select

class TransferToFrom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      chartOfAccount: [],
      action: 'Create',
      customerData: [],
    }
    // This binding is necessary to make `this` work in the callback
    this.onFinish = this.onFinish.bind(this)
    this.onFinishFailed = this.onFinishFailed.bind(this)
  }

  fetchChartOfAccount = orgCode => BankService.bankList(orgCode)

  componentDidMount = () => {
    // console.log(this.props, 'props')
    // const { id: prodId } = this.props.match.params
    const { defaultData } = this.state
    const { match, isTransferTo, isTransferFrom, trId, isEdit } = this.props

    // let data = []
    const org = store.get('selectedOrg')

    if (match.params.bankId) {
      // console.log('isTransferTo', isTransferTo)
      if (isTransferTo) {
        if (isEdit) {
          this.fetchInvoiceData(trId)
        } else {
          this.setState(
            {
              customerData: [{ name: 'toActId', value: Number(match.params.bankId) }],
            },
            () => this.getAllData(),
          )
        }
      } else if (isTransferFrom) {
        if (isEdit) {
          this.fetchInvoiceData(trId)
        } else {
          this.setState(
            {
              customerData: [{ name: 'fromActId', value: Number(match.params.bankId) }],
            },
            () => this.getAllData(),
          )
        }
      }
    }

    this.getAllData()
  }

  getAllData = async () => {
    const org = store.get('selectedOrg')

    const services = [this.fetchChartOfAccount(org.orgCode)]

    const [chartOfAccount] = await axios.all(services)
    this.setState({
      chartOfAccount: (chartOfAccount && chartOfAccount) || [],
    })
  }

  fetchInvoiceData = async id => {
    const result = await BankService.getTransactionById(id, 'get')
    // getQuotation(result ? result.data : [])
    // console.log(result, 'resultData')
    const resultData = result.data || []

    const data = []
    if (resultData.txId) {
      _.forEach(resultData, (val, key) => {
        data.push({
          name: [key],
          value: key === 'transDate' ? moment(val) : val,
        })
      })
      this.setState({
        customerData: data,
        action: 'Update',
      })
    }
  }

  onFinish = values => {
    // console.log(values, 'values')
    const { match, hideModal, recordData, closeModal, trId, isEdit } = this.props
    const org = store.get('selectedOrg')

    // const { isEdit, id } = recordData
    const { id } = match.params
    let method = 'post'
    // if (id) {
    //   method = 'put'
    //   values.id = id
    // }
    // values.txNo = 1
    // values.fromActId = 2
    // values.toActId = 3
    values.transDate = moment(values.transDate).format('MM/DD/YYYY HH:mm:ss')
    values.orgCode = org.orgCode

    if (trId && isEdit) {
      method = 'put'
      values.txId = trId
    }

    // console.log(values, 'values')
    const fetchData = async () => {
      const result = await BankService.createTransaction(values, method)
      // console.log(result, 'result')
      // hideModal(true)
      // history.push('/banking/lists')
      closeModal(true)
    }

    return fetchData()
  }

  onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo)
  }

  render() {
    const { customerData, action, isCrdit, isDirty, chartOfAccount } = this.state
    const { match, isTransferTo, isTransferFrom } = this.props

    return (
      <>
        <Form
          // className="transferToFrom"
          layout="vertical"
          fields={customerData}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          onValuesChange={this.formValuesChange}
          width={500}
        >
          <div className="row">
            <div className="col-md-12">
              <Form.Item
                name="fromActId"
                label="From Account"
                rules={[
                  {
                    required: true,
                    message: 'Please select account!',
                  },
                ]}
              >
                <Select
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  disabled={isTransferFrom && match.params.bankId && true}
                >
                  {chartOfAccount.map((item, index) => (
                    <Option value={item.accountid} key={item.accountid}>
                      {item.actname}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-12">
              <Form.Item
                name="toActId"
                label="To Account"
                rules={[
                  {
                    required: true,
                    message: 'Please select account!',
                  },
                ]}
              >
                <Select
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  disabled={isTransferTo && match.params.bankId && true}
                >
                  {chartOfAccount.map((item, index) => (
                    <Option value={item.accountid} key={item.accountid}>
                      {item.actname}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                name="transDate"
                label="Date"
                rules={[
                  {
                    required: true,
                    message: 'Please select date!',
                  },
                ]}
              >
                <DatePicker style={{ width: '100%' }} format="DD MMM YYYY HH:mm:ss" />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                name="amount"
                label="Amount"
                rules={[
                  {
                    required: true,
                    message: 'Please select amount!',
                  },
                ]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </div>
            <div className="col-md-12">
              <Form.Item name="reference" label="Reference#">
                <Input />
              </Form.Item>
            </div>
            <div className="col-md-12">
              <Form.Item name="description" label="Description">
                <TextArea />
              </Form.Item>
            </div>

            <div className="col-md-12 text-center">
              {/* <Button type="default" className="text-center">
                <strong>Cancel</strong>
              </Button> */}
              <Button type="primary" className="text-center" htmlType="submit">
                <strong>{action}</strong>
              </Button>
            </div>
          </div></Form>
      </>
    )
  }
}

export default connect()(TransferToFrom)


