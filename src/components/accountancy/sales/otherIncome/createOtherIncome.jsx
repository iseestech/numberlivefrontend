import React, { useContext, useState, useEffect, useRef } from 'react'
import {
  Table,
  Popconfirm,
  Button,
  Input,
  Form,
  Select,
  Divider,
  Modal,
  Space,
  DatePicker,
  Row,
  Col,
  InputNumber,
} from 'antd'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import ChartOfAccService from '@/services/chartOfAccount'
import BankService from '@/services/banking'

import { Link, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import axios from 'axios'
import ProductService from '@/services/products'
import CustomerService from '@/services/customer'
import TaxService from '@/services/settings'
import HelperFunction from '@/services/helper'
import QuotationService from '@/services/sales'
import store from 'store'

import { history } from '@/main'
import './index.scss'
import DisplayJournal from '@/components/accountancy/common/DisplayJournal'
import costCenter from '@/services/costCenter'
import CreateCostCenter from '@/pages/costCenter/createCostCenter'
import { PlusOutlined } from '@ant-design/icons'
import WithRouter from '@/WithRouter'
const selOrgData = store.get('selectedOrg')
const { TextArea } = Input
const { Option } = Select

const temp = 0

const SortableItem = sortableElement(props => <tr className="temp" {...props} />)
const SortableContainer = sortableContainer(props => <tbody {...props} />)

class CreateOtherIncome extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      action: 'Create',
      dataSource: [{ key: 0, index: 0, id: 0 }],
      isDirty: false,
      chartOfAccount: [],
      bankAccounts: [],
      costCenterData: [],
      selectedCostCenter: {},
      isCreateCostCenterModal: false,
    }
    // This binding is necessary to make `this` work in the callback
    this.onFinish = this.onFinish.bind(this)
    this.onFinishFailed = this.onFinishFailed.bind(this)
  }

  fetchChartOfAccount = org => ChartOfAccService.ChartOfAllAcount(org?.orgCode)

  fetchBankAccount = org => BankService.bankList(org?.orgCode)

  fetCostCenter = () => costCenter.getRegion()

  componentDidMount = () => {
    // console.log('in componentDidMount ')
    // let prodResult = []
    const { params, isEdit, trId } = this.props
    const org = store.get('selectedOrg')

    if (params.incomeId) {
      this.fetchInvoiceData(params.incomeId)
    } else if (params.bankId) {
      if (isEdit) {
        this.fetchInvoiceData(trId)
      } else {
        this.setState(
          {
            defaultData: [
              { name: 'toAccount', value: Number(params.bankId) },
              { name: 'date', value: moment(new Date(), 'DD MMM YYYY HH:mm:ss') },
              { name: 'paymentMode', value: 'Cash' },
            ],
          },
          () => this.getAllData(),
        )
      }
    } else {
      this.setState(
        {
          defaultData: [
            { name: 'date', value: moment(new Date(), 'DD MMM YYYY HH:mm:ss') },
            { name: 'paymentMode', value: 'Cash' },
          ],
        },
        () => this.getAllData(),
      )
    }
    // this.getAllData()
  }

  getAllData = async () => {
    const org = store.get('selectedOrg')

    const [bankAccounts, chartOfAccount, costCenterData] = await axios.all([
      this.fetchBankAccount(org),
      this.fetchChartOfAccount(org),
      this.fetCostCenter(),
    ])
    this.setState({
      costCenterData,
    })
    const data = chartOfAccount.filter(x => x.natureofaccount === 'INCOME')
    this.setState({
      chartOfAccount: data || [],
      bankAccounts: bankAccounts || [],
    })
  }

  fetchInvoiceData = async incomeId => {
    const result = await QuotationService.getOtherIncome(incomeId, 'get')
    // getQuotation(result ? result.data : [])
    const resultData = result.data || []
    const data = []
    if (resultData.id) {
      _.forEach(resultData, (val, key) => {
        data.push({
          name: [key],
          value: key === 'date' ? moment(val) : val,
        })
      })
      this.setState({
        defaultData: data,
        action: 'Update',
      })
    }
  }

  onFinish = values => {
    // const {} = this.state
    // console.log(values, 'values')
    const { selectedCostCenter } = this.state
    const { params, user, closeModal, trId, isEdit, reconcile } = this.props
    values.date = moment(document.getElementById('date').value).format('MM/DD/YYYY HH:mm:ss')
    // console.log(values, 'values')

    values.total = values.amount
    let method = 'post'
    if (params.incomeId && !isEdit) {
      method = 'put'
      values.id = params.incomeId
    }

    if (trId && isEdit) {
      method = 'put'
      values.id = trId
    }
    values.centerId = selectedCostCenter.centerId
    // values.email = user.email
    const fetchData = async () => {
      const result = await QuotationService.createOtherIncome(values, method)
      // console.log(result, 'result')
      if (params.bankId || reconcile) {
        this.setState(
          {
            isDirty: false,
          },
          () => closeModal(true),
        )
      } else {
        this.setState(
          {
            isDirty: false,
          },
          () => this.props.navigate('/sales/other-incomes'),
        )
      }
    }

    return fetchData()
  }

  onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo)
  }

  handleChange = (e, record, fieldName) => {
    const { value: val } = e.target
    const { dataSource } = this.state
    const amount = 0
    let total = 0

    dataSource.forEach(element => {
      if (element.id === record.id) {
        element.sale_amount = Number(val || 0)
      }
      total += parseFloat(element.sale_amount || 0)
    })
    // total += parseFloat(amount)
    this.setState({
      dataSource,
      total,
    })
  }

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { dataSource } = this.state
    // console.log('temp', dataSource)
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(x => x.index === restProps['data-row-key'])
    return <SortableItem index={index} {...restProps} />
  }

  handleDelete = record => {
    const { dataSource, total, subTotal } = this.state
    this.setState({
      dataSource: dataSource.filter(item => item.key !== record.key),
      total: total - record.amount,
      subTotal: subTotal - record.amount,
    })
  }

  handleAdd = () => {
    const { count, dataSource } = this.state
    const newData = {
      key: count,
      index: count,
      id: count,
    }
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    })
  }

  handleStDate = (date, dateString) => {
    // console.log(date, dateString, ' date, dateString')
    // const {estimateDate} = this.state
    // const val = moment(dateString).tz('Asia/Calcutta').format();
    if (date) {
      this.setState({
        estimateDate: date ? dateString : '',
      })
    }
  }

  getData = data => {
    // console.log(data, 'from Modal')
    const { isVisible } = this.state
    this.setState(
      {
        isVisible: !isVisible,
      },
      () => this.fetchCustData(),
    )
  }

  formValuesChange = e => {
    const isDirty = Object.keys(e).length && true
    this.setState({ isDirty })
  }

  setNewCostCenterData = async () => {
    const result = await costCenter.getRegion()
    this.setState({
      costCenterData: result,
    })
  }

  toggleCreateCostCenterModal = () => {
    const { isCreateCostCenterModal } = this.state
    this.setState({
      isCreateCostCenterModal: !isCreateCostCenterModal,
    })
    this.setNewCostCenterData()
  }

  handleSelectedCostCenter = e => {
    const { costCenterData } = this.state
    for (let i = 0; i < costCenterData?.length; ) {
      if (e === costCenterData[i]?.centerName) {
        this.setState({
          selectedCostCenter: {
            centerName: e,
            centerId: costCenterData[i].id,
          },
        })
      }
      i += 1
    }
  }

  render() {
    const {
      dataSource,
      // showModal,
      columns,
      total,
      estimateDate,
      defaultData,
      action,
      isDirty,
      chartOfAccount,
      bankAccounts,
      costCenterData,
      isCreateCostCenterModal,
    } = this.state
    const { params, modalWidth, closeModal, reconcile } = this.props
    const DraggableContainer = props => (
      <SortableContainer
        useDragHandle
        helperClass="row-dragging"
        onSortEnd={this.onSortEnd}
        {...props}
      />
    )

    // console.log(dataSource, 'dataSource from Render')

    return (
      <>
        <Form
          className="form__layout--css"
          layout="horizontal"
          fields={defaultData}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          onValuesChange={this.formValuesChange}
          style={{ width: modalWidth || '100%', margin: '0 auto' }}
        >
          <Row className="mb-3 form__header--css">
            <Col span={20} style={{ fontSize: '18px' }}>
              {params?.incomeId ? (
                <span>Edit: {params?.incomeId}</span>
              ) : (
                'New Other Income'
              )}
            </Col>
            <Col span={4} className="text-end">
              <Button type="default" className="text-center me-2" htmlType="submit">
                <Link to="/sales/other-incomes">Cancel</Link>
              </Button>
              <Button
                type="primary"
                size="medium"
                className="text-center"
                htmlType="submit"
                // loading={isLoading}
              >
                {action}
              </Button>
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
                      name="date"
                      label="Date"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please select date!',
                        },
                      ]}
                    >
                      <DatePicker
                        style={{ width: '100%' }}
                        defaultValue={moment(new Date(), 'DD MMM YYYY HH:mm:ss')}
                        format="DD MMM YYYY HH:mm:ss"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="ref"
                      className="form__input--label not--required--field"
                      label="Reference"
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
                      name="fromAccount"
                      label="Income Account"
                      className="form__input--label"
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
                      >
                        {chartOfAccount.map((item, index) => (
                          <Option value={item.id} key={item.id}>
                            {item.actName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="toAccount"
                      label="Deposited To"
                      className="form__input--label"
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
                        disabled={params.bankId && true}
                      >
                        {bankAccounts.map((item, index) => (
                          <Option value={item.accountid} key={item.accountid}>
                            {item.actname}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="amount"
                      label="Amount"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter amount!',
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        precision={selOrgData?.decimals}
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
                      name="paymentMode"
                      label="Payment Mode"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please select payment mode!',
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        defaultValue="Cash"
                      >
                        <Option value="Cash">Cash</Option>
                        <Option value="Bank Remittance">Bank Remittance</Option>
                        <Option value="Bank Transfer">Bank Transfer</Option>
                        <Option value="Debit/Credit Card">Debit/Credit Card</Option>
                        <Option value="Cheque">Cheque</Option>
                        <Option value="UPI">UPI</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="centerName"
                      label="Region"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please select Region!',
                        },
                      ]}
                    >
                      <Select
                        // style={{ width: 100 }}
                        onChange={e => this.handleSelectedCostCenter(e)}
                        popupRender={menu => (
                          <div>
                            <Divider style={{ margin: '4px 0' }} />
                            <Button
                              onClick={e => this.toggleCreateCostCenterModal()}
                              // className="me-3"
                              style={{ display: 'flex', margin: '0 auto' }}
                            >
                              <PlusOutlined />
                              Add Region
                            </Button>
                            {menu}
                          </div>
                        )}
                      >
                        {costCenterData &&
                          costCenterData.map(ele => {
                            return (
                              <Option value={ele.centerName} key={ele.centerName}>
                                {ele.centerName}
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
                      name="description"
                      className="form__input--label not--required--field"
                      label="Description"
                    >
                      <TextArea />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              {/* <div className="col-md-12">
              <Table
                pagination={false}
                dataSource={dataSource}
                columns={columns}
                rowKey="id"
                scroll={{ x: 691 }}
              />
              <br />
            </div> */}

              {/* <div className="col-md-9">
              <Button
                onClick={this.handleAdd}
                type="primary"
                style={{
                  marginBottom: 16,
                }}
              >
                Add a row
              </Button>
            </div> */}
              {/* <div className="col-md-3">
              <div>
                <br />
                <hr style={{ margin: '5px 0' }} />
                <div>
                  <h3>
                    <strong>Total : </strong>
                    <strong>{total}</strong>
                  </h3>
                </div>
                <hr style={{ margin: '5px 0', borderBottom: '10px' }} />
              </div>
            </div> */}
            </Row>
            <hr />
            <div className="text-end pb-3 pe-3">
              {params.bankId || reconcile ? (
                <Button type="default" className="text-center me-2" onClick={() => closeModal()}>
                  Cancel
                </Button>
              ) : (
                <Button type="default" className="text-center me-3" htmlType="submit">
                  <Link to="/sales/other-incomes">Cancel</Link>
                </Button>
              )}
              <Button type="primary" className="text-center" htmlType="submit">
                <strong>{action}</strong>
              </Button>
            </div>
          </div></Form>
        <div>
          {!reconcile && (
            <DisplayJournal
              trId={params.incomeId}
              formName="otherIncome"
              type="Other income"
              isJournal
            />
          )}
        </div>
        {isCreateCostCenterModal && (
          <Modal
            title="Create Region"
            footer={null}
            visible={isCreateCostCenterModal}
            onOk={() => this.toggleCreateCostCenterModal()}
            onCancel={() => this.toggleCreateCostCenterModal()}
          >
            <CreateCostCenter
              onCancel={() => this.toggleCreateCostCenterModal()}
              actionType="Create"
              closeModal={() => this.toggleCreateCostCenterModal()}
            />
          </Modal>
        )}
      </>
    )
  }
}

const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})

export default connect(mapStateToProps)(WithRouter(CreateOtherIncome))


