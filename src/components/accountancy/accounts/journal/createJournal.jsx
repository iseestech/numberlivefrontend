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
  DatePicker,
  notification,
  InputNumber,
  Row,
  Col,
} from 'antd'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import { MenuOutlined, PlusOutlined } from '@ant-design/icons'
// import { arrayMove } from "@dnd-kit/sortable";
import { Link, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import store from 'store'
import moment from 'moment'
import axios from 'axios'
import CreateProductModal from '@/components/accountancy/productsAndServices/createProductModal'
import ChartOfAccService from '@/services/chartOfAccount'
import CustomerService from '@/services/customer'
import JournalService from '@/services/journal'
import { history } from '@/main'
import WithRouter from '@/WithRouter'
import ProductTable from './productTable'

import './index.scss'

const selOrgData = store.get('selectedOrg')

const { TextArea } = Input
const { Option } = Select
const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
))

const temp = 0

const SortableItem = sortableElement(props => <tr className="temp" {...props} />)
const SortableContainer = sortableContainer(props => <tbody {...props} />)

const children = [{ name: 'test1' }, { name: 'test2' }]
const LoadCon = props => {
  const { itemsData, handleShowHide } = props
  const addItem = () => {}
  return (
    <Select
      style={{ width: 240 }}
      placeholder="Select/Add Customer"
      defaultValue="lucy"
      popupRender={menu => (
        <div>
          <Divider style={{ margin: '4px 0' }} />
          <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
            <Button
              onClick={() => {
                handleShowHide()
              }}
              role="button"
            >
              <PlusOutlined /> Add Customer
            </Button>
          </div>
          {menu}
        </div>
      )}
    >
      {itemsData.map(item => (
        <Option value={`${item.name}_${item.key}`} key={`${item.name}_${item.key}`}>
          {item.name}
        </Option>
      ))}
    </Select>
  )
}
class CreateJournal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDirty: false,
      masterData: {},
      chartOfAccount: [],
      deleteProdIds: [],
      custData: [],
      total: {
        debit: 0,
        credit: 0,
      },
      diffValue: {
        debit: 0,
        credit: 0,
      },
      journalFormData: [
        {
          name: 'journelActDto',
          value: [
            { key: 1, id: 0 },
            { key: 2, id: 0 },
          ],
        },
        {
          name: 'currency',
          value: store.get('selectedOrg').currency,
        },
      ],
      subTotal: 0,
      custName: '',
      name: '',
      count: 4,
      isVisible: false,
      isShown: false,
      estimateDate: '',
      expiryDate: '',
      dataSource: [{}, {}],
      action: 'Create',
    }
    // This binding is necessary to make `this` work in the callback
    this.onFinish = this.onFinish.bind(this)
    this.onFinishFailed = this.onFinishFailed.bind(this)
    this.formRef = React.createRef()
  }

  onFinish = values => {
    const { masterData, diffValue, total, deleteProdIds } = this.state
    const org = store.get('selectedOrg')

    // values.estimateDate = moment(values.date).format('MM/DD/YYYY')

    if (diffValue.credit !== diffValue.debit) {
      return notification.warning({
        message: 'Error',
        description: 'Please ensure that the Debits and Credits are equal',
        duration: 6,
      })
    }

    values.journelDate = moment(values.journelDate).format('MM/DD/YYYY')
    values.productId = deleteProdIds.length ? deleteProdIds.toString() : 0
    values.currency = org.currency
    values.creditSubTotal = Number(total.credit).toFixed(selOrgData?.decimals)
    values.creditTotal = Number(total.credit).toFixed(selOrgData?.decimals)
    values.debitSubTotal = Number(total.debit).toFixed(selOrgData?.decimals)
    values.debitTotal = Number(total.debit).toFixed(selOrgData?.decimals)

    const { params } = this.props
    let method = 'post'
    if (params.id) {
      method = 'put'
      values.journelNo = params.id
      values.id = masterData.id
    }

    const fetchData = async () => {
      const result = await JournalService.createJournal(values, method)
      // console.log(result, 'result')
      this.setState(
        {
          isDirty: false,
        },
        () => this.props.navigate('/accounts/journals'),
      )
    }

    return fetchData()
  }

  formValuesChange = e => {
    const isDirty = Object.keys(e).length && true
    this.setState({ isDirty })
  }

  onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo)
  }

  // fetchChartOfAccount = () => ChartOfAccService.listAllAccounts('ALL')
  fetchChartOfAccount = orgCode => ChartOfAccService.ChartOfAllAcount(orgCode)

  fetchCustDataNew = () => CustomerService.customerList()

  componentDidMount = () => {
    const { params } = this.props
    const org = store.get('selectedOrg')

    const getAllData = async () => {
      const [chartOfAccount, custData] = await axios.all([
        this.fetchChartOfAccount(org.orgCode),
        this.fetchCustDataNew(),
      ])

      this.setState({
        chartOfAccount: (chartOfAccount && chartOfAccount) || [],
        custData: custData || [],
      })
    }

    if (params.id) {
      const fetchData = async () => {
        const result = await JournalService.getJournalById(params.id, 'post')
        const data = [
          {
            name: 'currency',
            value: store.get('selectedOrg').currency,
          },
        ]
        _.forEach(result.data, (val, key) => {
          // if (key !== 'productDetailsDto')
          data.push({
            name: key,
            value: key === 'journelDate' || key === 'date' ? moment(val || new Date()) : val,
          })
        })

        const { creditSubTotal, debitSubTotal, debitTotal, creditTotal } = result.data
        this.setState({
          masterData: result.data,
          dataSource: result.data.journelActDto,
          journalFormData: data,
          action: 'Update',
          total: {
            credit: creditTotal,
            debit: debitTotal,
          },
          diffValue: { credit: creditTotal - debitTotal, debit: debitTotal - creditTotal },
        })
      }
      fetchData()
    }

    getAllData()
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { dataSource } = this.state
    if (oldIndex !== newIndex) {
      const newData = [] // arrayMove([].concat(dataSource), oldIndex, newIndex).filter(el => !!el)
      this.setState({ dataSource: newData })
    }
  }

  handleName = (e, record) => {
    const { dataSource } = this.state
    dataSource.forEach(element => {
      if (element.id === record.id) {
        element.name = e.label
      }
    })
    this.setState({
      dataSource,
    })
  }

  handleChange = (e, record, colName, index) => {
    const { total: mainTotal } = this.state
    const dataSource = this.formRef.current.getFieldValue('journelActDto')

    const total = {
      debit: 0,
      credit: 0,
    }

    const subTotal = 0
    const name = colName
    const value = e

    if (name === 'debit') {
      // total.credit -= parseFloat(element.credit || 0)
      record.credit = 0
      record.debit = e
    } else if (name === 'credit') {
      // total.debit -= parseFloat(element.debit || 0)
      record.debit = 0
      record.credit = e
    }

    dataSource[index] = Object.assign(dataSource[index], record)

    // dataSource.forEach(element => {
    //   // console.log(element, 'element', record, value, 'ddd', total)
    //   // if (element.id === record.id) {
    //     // element[name] = parseFloat(e || 0)
    //     total.debit += parseFloat(element.debit);
    //     if (name === 'debit') {
    //       total.credit -= parseFloat(element.credit || 0)
    //       element.credit = 0
    //     } else if (name === 'credit') {
    //       total.debit -= parseFloat(element.debit || 0)
    //       element.debit = 0
    //     }
    //   // } else {
    //     // total[name] += parseFloat(element[name])
    //   // }
    // })

    dataSource.forEach(ele => {
      total.debit += Number(ele?.debit || 0)
      total.credit += Number(ele?.credit || 0)
    })

    // console.log(total, 'total')
    this.formRef.current.setFieldsValue({ journelActDto: dataSource })

    this.setState({
      dataSource,
      // total: Number(total).toFixed(selOrgData?.decimals),
      total: {
        debit: Number(total?.debit || 0).toFixed(selOrgData?.decimals),
        credit: Number(total?.credit || 0).toFixed(selOrgData?.decimals),
      },
      diffValue: { credit: total.credit - total.debit, debit: total.debit - total.credit },
    })
  }

  // handleDelete = record => {
  //   const { dataSource, total, subTotal } = this.state
  //   this.setState({
  //     dataSource: dataSource.filter(item => item.key !== record.key),
  //     total: total - record.amount,
  //     subTotal: subTotal - record.amount,
  //   })
  // }

  handleDelete = (record, index) => {
    const fields = this.formRef.current.getFieldsValue()
    const { journelActDto } = fields
    journelActDto.splice(index, 1)
    this.formRef.current.setFieldsValue({ journelActDto })

    const {
      total,
      subTotal,
      totalDiscount,
      totalTax,
      totalAmtWoTax,
      masterProdData,
      deleteProdIds,
    } = this.state
    const prodData = _.cloneDeep(masterProdData)
    const prodId = []
    // journelActDto.forEach(x => prodId.push(String(x.id)))
    // const data = prodData.map(x => {
    //   if (prodId.includes(String(x.id))) {
    //     x.disabled = true
    //   }
    //   return x
    // })

    const deleteProdIdVal = deleteProdIds || []
    if (record.isDeleted === false) {
      deleteProdIdVal.push(record.id)
    }

    this.setState(
      {
        dataSource: journelActDto,
        deleteProdIds: deleteProdIdVal,

        total: {
          debit: total.debit - (record.debit || 0),
          credit: total.credit - (record.credit || 0),
        },
        // total: total - (record.purchase_amount || 0),
        // subTotal: subTotal - (record.sub_total || 0),
        // prodData: data,
        // totalDiscount: totalDiscount - (parseFloat(record.purchaseDiscountAmount) || 0),
        // totalTax: totalTax - (parseFloat(record.purchaseTaxRateAmount) || 0),
        // totalAmtWoTax: totalAmtWoTax - (parseFloat(record.amountWithoutTax) || 0),
      },
      () => {
        const { total: Val } = this.state
        this.setState({
          diffValue: {
            debit: Val.debit - (Val.credit || 0),
            credit: Val.credit - (Val.debit || 0),
          },
        })
      },
    )
  }

  handleAdd = () => {
    const { count } = this.state
    const fields = this.formRef.current.getFieldsValue()
    const { journelActDto } = fields
    const dataSource = journelActDto
    this.formRef.current.setFieldsValue({ journelActDto: dataSource })
    this.setState({
      dataSource,
    })
  }

  updateProduct = (e, record, keyName, index) => {
    // console.log(e, 'e', record, 'handleChange', colName)
    const { chartOfAccount } = this.state
    const dataSource = this.formRef.current.getFieldValue('journelActDto')
    const selected = chartOfAccount.filter(x => x.id === e)
    // record.accountName = selected.length ? selected[0].n : ''
    dataSource[index] = Object.assign(dataSource[index], {
      accountName: selected[0]?.actName || '',
    })

    this.formRef.current.setFieldsValue({ journelActDto: dataSource })

    this.setState({
      dataSource,
    })
  }

  render() {
    const {
      dataSource,
      columns,
      items,
      itemsData,
      name,
      custName,
      isVisible,
      isShown,
      total,
      subTotal,
      estimateDate,
      expiryDate,
      isDirty,
      chartOfAccount,
      diffValue,
      journalFormData,
      action,
      custData,
    } = this.state
    const { params } = this.props
    // const DraggableContainer = props => (
    //   <SortableContainer
    //     useDragHandle
    //     helperClass="row-dragging"
    //     onSortEnd={this.onSortEnd}
    //     {...props}
    //   />
    // )

    return (
      <>
        <Form
          className="form__layout--css"
          layout="horizontal"
          onFinish={this.onFinish}
          ref={this.formRef}
          onFinishFailed={this.onFinishFailed}
          onValuesChange={this.formValuesChange}
          fields={journalFormData}
        >
          <Row className="mb-3 form__header--css">
            <Col span={20} style={{ fontSize: '18px' }}>
              {params?.id ? <span>Edit: {params?.id}</span> : 'New Journal'}
            </Col>
            <Col span={4} className="text-end">
              <Button type="default" className="text-center me-2" htmlType="submit">
                <Link to="/accounts/journals">Cancel</Link>
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
                      name="journelDate"
                      className="form__input--label"
                      required
                      label="Date"
                      rules={[
                        {
                          required: true,
                          message: 'Please select date!',
                        },
                      ]}
                    >
                      <DatePicker
                        style={{ width: '100%' }}
                        // onChange={this.handleStDate}
                        // defaultValue={moment('2021/01/01', 'YYYY/MM/DD')}
                        format="DD MMM YYYY h:mm:ss a"
                        // value={estimateDate}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="journelNo"
                      label="Journal#"
                      className="form__input--label"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Please enter #!',
                      //   },
                      // ]}
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item name="reference" className="form__input--label" label="Reference#">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="currency"
                      label="Currency"
                      className="form__input--label"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Please select type',
                      //   },
                      // ]}
                    >
                      {/* <Select placeholder="">
                  <Option value="KWD">Cash Based </Option>
                  <Option value="INR">INR</Option>
                </Select> */}
                      <Input disabled />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              {/* <Table
                pagination={false}
                dataSource={dataSource}
                columns={columns}
                rowKey="index"
                components={{
                  body: {
                    wrapper: DraggableContainer,
                    row: this.DraggableBodyRow,
                  },
                }}
                scroll={{ x: 691 }}
              /> */}
              <Col span={24}>
                <Form.List name="journelActDto">
                  {(journelActDto, options) => {
                    return (
                      <ProductTable
                        // productDetailsDto={productDetailsDto}
                        add={options.add}
                        remove={options.remove}
                        // productData={prodData}
                        // handleDelete={this.handleDelete}
                        handleAddRow={this.handleAdd}
                        itemData={dataSource || []}
                        chartOfAccount={chartOfAccount || []}
                        updateProduct={this.updateProduct}
                        updateRow={this.handleChange}
                        // updateQtyRow={this.updateQtyRow}
                        // handleAddRow={this.handleAddRow}
                        handleDeleteRow={this.handleDelete}
                        custData={custData}
                        // handleDescription={this.handleDescription}
                        // showModal={this.showModal}
                      />
                    )
                  }}
                </Form.List>
                {/* <br /> */}
              </Col>

              <Col span={10} offset={14} className="mt-3 total__section">
                <div className="total__section--con">
                  <div className="row">
                    <div className="col-sm-5">Sub Total</div>
                    <div className="col-sm-4">{total.debit}</div>
                    <div className="col-sm-3">{total.credit}</div>
                  </div>
                  <div className="row">
                    <div className="col-sm-5">Total</div>
                    <div className="col-sm-4">{total.debit}</div>
                    <div className="col-sm-3">{total.credit}</div>
                  </div>
                  <div className="row" style={{ color: 'red' }}>
                    <div className="col-sm-5">Difference</div>
                    <div className="col-sm-4">
                      {diffValue.credit > 0
                        ? Number(diffValue.credit).toFixed(selOrgData?.decimals)
                        : ''}
                    </div>
                    <div className="col-sm-3">
                      {diffValue.debit > 0
                        ? Number(diffValue.debit).toFixed(selOrgData?.decimals)
                        : ''}
                      {diffValue.credit === diffValue.debit ? '0.00' : ''}
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={24}>
                <hr />
              </Col>
              <Col span={24} className="fs-13 text-uppercase mb-3">
                <span className="bulletIcon">Notes</span>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item name="notes" label={null}>
                      <TextArea />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <hr />
            <div className="text-end pb-3">
              <Button type="default" className="text-center me-2" htmlType="submit">
                <Link to="/accounts/journals">Cancel</Link>
              </Button>
              <Button type="primary" className="text-center me-3" htmlType="submit">
                {action}
              </Button>
            </div>
          </div></Form>
      </>
    )
  }
}

export default connect()(WithRouter(CreateJournal))


