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

import ProductTable from './productTable'

import './index.scss'

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
    values.productId = deleteProdIds.toString()
    values.currency = org.currency
    values.creditSubTotal = total.credit
    values.creditTotal = total.credit
    values.debitSubTotal = total.debit
    values.debitTotal = total.debit

    const { match } = this.props
    let method = 'post'
    if (match.params.id) {
      method = 'put'
      values.journelNo = match.params.id
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

  fetchChartOfAccount = () => ChartOfAccService.listAllAccounts('ALL')

  fetchCustDataNew = () => CustomerService.customerList()

  componentDidMount = () => {
    const { match } = this.props

    const getAllData = async () => {
      const [chartOfAccount, custData] = await axios.all([
        this.fetchChartOfAccount(),
        this.fetchCustDataNew(),
      ])

      this.setState({
        chartOfAccount: (chartOfAccount && chartOfAccount) || [],
        custData: custData || [],
      })
    }

    if (match.params.id) {
      const fetchData = async () => {
        const result = await JournalService.getJournalById(match.params.id, 'post')
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

        this.setState({
          masterData: result.data,
          dataSource: result.data.journelActDto,
          journalFormData: data,
          action: 'Update',
        })
      }
      fetchData()
    }

    getAllData()
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { dataSource } = this.state
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter(el => !!el)
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
      total.debit += parseFloat(ele.debit || 0)
      total.credit += parseFloat(ele.credit || 0)
    })

    // console.log(total, 'total')
    this.formRef.current.setFieldsValue({ journelActDto: dataSource })

    this.setState({
      dataSource,
      total,
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
    // record.accountName = selected.length ? selected[0].actName : ''
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
    const { match } = this.props
    const routeName = match.path.split('/')
    const DraggableContainer = props => (
      <SortableContainer
        useDragHandle
        helperClass="row-dragging"
        onSortEnd={this.onSortEnd}
        {...props}
      />
    )

    return (
      <>
        <Form
          layout="vertical"
          onFinish={this.onFinish}
          ref={this.formRef}
          onFinishFailed={this.onFinishFailed}
          onValuesChange={this.formValuesChange}
          fields={journalFormData}
        >
          <div className="row">
            <div className="col-md-3">
              <Form.Item
                name="journelDate"
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
                  // onChange={this.handleStDate}
                  // defaultValue={moment('2021/01/01', 'YYYY/MM/DD')}
                  format="DD MMM YYYY h:mm:ss a"
                  // value={estimateDate}
                />
              </Form.Item>
            </div>

            <div className="col-md-3">
              <Form.Item
                name="journelNo"
                label="Journal#"
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please enter #!',
                //   },
                // ]}
              >
                <Input disabled />
              </Form.Item>
            </div>
            <div className="col-md-3">
              <Form.Item name="reference" label="Reference#">
                <Input />
              </Form.Item>
            </div>
            {/* <div className="col-md-2">
              <Form.Item name="currency" label="Currency">
                <Select placeholder="">
                  <Option value="KWD">KWD </Option>
                  <Option value="INR">INR</Option>
                </Select>
              </Form.Item>
            </div> */}
            <div className="col-md-2">
              <Form.Item
                name="currency"
                label="Currency"
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
            </div>
            {/* <div className="col-md-3">&nbsp;</div> */}

            <div className="col-md-12">
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
            </div>

            <div className="col-md-5">
              {/* <Button
                onClick={this.handleAdd}
                type="primary"
                style={{
                  marginBottom: 16,
                }}
              >
                Add a row
              </Button> */}
              &nbsp;
            </div>

            <div className="col-md-6">
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
                <div className="col-sm-4">{diffValue.credit > 0 ? diffValue.credit : ''}</div>
                <div className="col-sm-3">
                  {diffValue.debit > 0 ? diffValue.debit : ''}
                  {diffValue.credit === diffValue.debit ? '0.00' : ''}
                </div>
              </div>
            </div>
            {/* <div className="col-md-2">&nbsp;</div> */}
            <div className="col-md-4">
              <Form.Item name="notes" label="Notes">
                <TextArea />
              </Form.Item>
            </div>

            <div className="col-md-12 text-center">
              <Button type="default" className="text-center" htmlType="submit">
                <strong>
                  <Link to="/sales/orders">Cancel</Link>
                </strong>
              </Button>
              <Button type="primary" className="text-center" htmlType="submit">
                <strong>{action}</strong>
              </Button>
            </div>
          </div></Form>
      </>
    )
  }
}

export default connect()(CreateJournal)


