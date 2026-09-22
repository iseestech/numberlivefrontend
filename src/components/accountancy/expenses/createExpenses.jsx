/* eslint-disable */

import React, { useContext, useState, useEffect, useRef } from 'react'
import {
  Table,
  Popconfirm,
  Button,
  Input,
  Form,
  Select,
  Divider,
  Space,
  Modal,
  DatePicker,
  Tabs,
  Radio,
  Menu,
  Dropdown,
  Upload,
  Checkbox,
  Row,
  Col,
} from 'antd'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import { MenuOutlined, PlusOutlined, DownOutlined } from '@ant-design/icons'
// import { arrayMove } from "@dnd-kit/sortable";
import { Link, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import axios from 'axios'
import moment from 'moment'
import CreateProductModal from '@/components/accountancy/productsAndServices/createProductModal'
import CreateCustomer from '@/components/accountancy/contacts/createCustomer'
import ChartOfAccService from '@/services/chartOfAccount'
import BankService from '@/services/banking'
import store from 'store'

import CustomerService from '@/services/customer'
import VendorService from '@/services/vendor'
import EmployeeService from '@/services/employee'
import ExpensesService from '@/services/expenses'
import QuotationService from '@/services/sales'
import { history } from '@/main'
import AccountTable from './accountTable'
import WithRouter from '@/WithRouter'
import './index.scss'
import CreateCostCenter from '@/pages/costCenter/createCostCenter'
import costCenter from '@/services/costCenter'

const selOrgData = store.get('selectedOrg')

const { TabPane } = Tabs
const { TextArea } = Input
const { Option } = Select
const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
))

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

const temp = 0

const SortableItem = sortableElement(props => <tr className="temp" {...props} />)
const SortableContainer = sortableContainer(props => <tbody {...props} />)

const children = [{ name: 'test1' }, { name: 'test2' }]
const LoadCon = props => {
  const { custData, handleShowHide, passCustData, selectedCustId } = props
  const addItem = () => {}
  // const selectedValue =
  // console.log(selectedCustId, 'selectedCustId', custData)
  const handleCompName = e => {
    const data = custData
    const selected = data.filter(item => item.customer_id === parseInt(e, 10))
    // console.log(e, 'handleCompName', selected, data)
    passCustData(selected)
  }
  return (
    <Select
      placeholder="Select/Add Customer"
      value={custData.length ? selectedCustId : ''}
      onChange={e => handleCompName(e)}
      popupRender={menu => (
        <div>
          <Divider style={{ margin: '4px 0' }} />
          {/* <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
            <Button
              onClick={() => {
                handleShowHide()
              }}
              role="button"
            >
              <PlusOutlined /> Add Customer
            </Button>
          </div> */}

          {menu}
        </div>
      )}
    >
      {custData.map(item => (
        <Option value={item.customer_id} key={`${item.company_name}_${item.customer_id}`}>
          {`${item.customer_fname} ${item.customer_lname} (${item.company_name})`}
        </Option>
      ))}
    </Select>
  )
}

const LoadVendor = props => {
  const { vendorData, handleShowHide, passVendorData, selectedVendorId } = props
  // console.log(selectedCustId, 'selectedCustId')
  const addItem = () => {}
  // console.log(custData, 'custData')
  const handleCompName = e => {
    const data = vendorData
    const selected = data.filter(item => item.id === parseInt(e, 10))
    // console.log(e, 'handleCompName', selected, data)
    passVendorData(selected)
  }
  return (
    <Select
      placeholder="Select Vendor"
      value={vendorData.length ? selectedVendorId : ''}
      onChange={e => handleCompName(e)}
      popupRender={menu => (
        <div>
          <Divider style={{ margin: '4px 0' }} />
          {/* <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
            <Button
              onClick={() => {
                handleShowHide()
              }}
              role="button"
            >
              <PlusOutlined /> Add Vendor
            </Button>
          </div> */}
          {menu}
        </div>
      )}
    >
      {vendorData.map(item => (
        <Option value={item.id} key={`${item.companyName}_${item.id}`}>
          {`${item.firstName} ${item.lastName} (${item.companyName})`}
        </Option>
      ))}
    </Select>
  )
}
const LoadEmp = props => {
  const { empData, handleShowHide, passEmpData, selectedEmpId } = props

  // console.log(selectedEmpId, 'selectedEmpId', empData.length)
  const handleCompName = e => {
    const data = empData
    // console.log(data, 'data', e)
    const selected = data.filter(item => item.empId === parseInt(e, 10))
    // console.log(e, 'handleCompName', selected, data)
    passEmpData(selected)
  }
  return (
    <Select
      placeholder="Select/Add Employee"
      value={empData.length ? selectedEmpId : ''}
      onChange={e => handleCompName(e)}
      popupRender={menu => (
        <div>
          <Divider style={{ margin: '4px 0' }} />
          {/* <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
            <Button
              onClick={() => {
                handleShowHide()
              }}
              role="button"
            >
              <PlusOutlined /> Add Employee
            </Button>
          </div> */}

          {menu}
        </div>
      )}
    >
      {empData.map(item => (
        <Option value={item.empId} key={`${item.company_name}_${item.empId}`}>
          {`${item.empFirstName} ${item.empLastName} (${item.company_name})`}
        </Option>
      ))}
    </Select>
  )
}
class CreateExpenses extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDirty: false,

      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileList: [],
      items: [
        { name: 'jack', key: 1 },
        { name: 'lucy', key: 2 },
      ],
      deleteProdIds: [],
      defaultData: [
        { name: 'paymentMode', value: 'cash' },
        { name: 'expensesAccountDto', value: [{}] },
      ],
      selectedCust: {},
      custData: [],
      selectedCustId: {},
      selectedVendor: {},
      vendorData: [],
      selectedVendorId: {},
      selectedEmp: {},
      empData: [],
      selectedEmpId: {},
      prodData: [],
      chartOfAccount: [],
      accountData: [],
      total: 0,
      taxValue: 'No Tax',
      subtotal: 0,
      custName: '',
      name: '',
      count: 4,
      action: 'Create',
      isVisible: false,
      visible: false,
      isShown: false,
      date: '2021/01/01',
      expiryDate: '2021/01/01',
      masterOrderData: {},
      dataSource: [{ key: 1, id: 0 }],
      bulkDataSource: [{}, {}, {}, {}, {}, {}, {}],
      costCenterData: [],
      selectedCostCenter: {},
      isCreateCostCenterModal: false,
    }

    // This binding is necessary to make `this` work in the callback
    this.onFinish = this.onFinish.bind(this)
    this.onFinishFailed = this.onFinishFailed.bind(this)
    this.formRef = React.createRef()
  }

  menuCustomize = () => (
    <Menu>
      <Menu.Item key="0">
        <Checkbox onChange={() => this.handleColumn('vendor')}>Vendor</Checkbox>
      </Menu.Item>
      <Menu.Item key="1">
        <Checkbox onChange={() => this.handleColumn('notes')}>Notes</Checkbox>
      </Menu.Item>

      <Menu.Item key="3">
        {' '}
        <Checkbox onChange={() => this.handleColumn('customer')}>Customer</Checkbox>
      </Menu.Item>
      <Menu.Item key="4">
        {' '}
        <Checkbox onChange={() => this.handleColumn('projects')}>Projects</Checkbox>
      </Menu.Item>
      <Menu.Item key="5">
        {' '}
        <Checkbox onChange={() => this.handleColumn('billable')}>Billable</Checkbox>
      </Menu.Item>
      <Menu.Item key="6">
        {' '}
        <Checkbox onChange={() => this.handleColumn('ref #')}>Ref#</Checkbox>
      </Menu.Item>
    </Menu>
  )

  handleColumn = key => {
    const { bulkColumns, bulkOptsColumns } = this.state
    // console.log(key, 'bulkColumns')
    const tempObj = bulkOptsColumns.filter(item => item.title.toLowerCase() === key)
    const newEntry = bulkColumns.filter(item => item.title.toLowerCase() !== key)

    // console.log(newEntry, 'newEntry', tempObj)
    if (tempObj.length && bulkColumns.length === newEntry.length) {
      newEntry.push(tempObj[0])
    }
    const sortedData = _.sortBy(newEntry, [o => o.key])
    // console.log(newEntry, tempObj)

    this.setState({
      bulkColumns: sortedData,
    })
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    })
  }

  handleChangeF = ({ fileList }) => this.setState({ fileList })

  fetchAccData = orgCode => BankService.bankList(orgCode)

  fetchCOAccounts = org => ChartOfAccService.ChartOfAllAcount(org?.orgCode)

  fetchCustData = () => CustomerService.customerList()

  fetchVendorData = () => VendorService.customerList()

  fetchEmpData = () => EmployeeService.employeeList()

  fetCostCenter = () => costCenter.getRegion()

  componentDidMount = () => {
    // this.formRef.current.setFieldsValue({ inExpiryDate: "2022/12/10" })
    // console.log('this.formRef.current.', this.formRef.current)
    // let prodResult = []
    // let custResult = []
    const { params, isEdit, trId } = this.props

    // console.log('getExpenses', match)
    if (params.id) {
      this.fetchInvoiceData(params.id)
    } else if (params.bankId) {
      if (isEdit) {
        this.fetchInvoiceData(trId)
      } else {
        this.setState(
          {
            defaultData: [{ name: 'paidThrough', value: Number(params.bankId) }],
          },
          () => this.getAllData(),
        )
      }
    } else {
      this.getAllData()
    }
  }

  getAllData = async () => {
    const org = store.get('selectedOrg')

    const [
      chartOfAccount,
      custData,
      empData,
      vendorData,
      accountData,
      costCenterData,
    ] = await axios.all([
      this.fetchCOAccounts(org),
      this.fetchCustData(),
      this.fetchEmpData(),
      this.fetchVendorData(),
      this.fetchAccData(org?.orgCode),
      this.fetCostCenter(),
    ])
    this.setState({
      costCenterData,
    })
    // console.log(chartOfAccount, 'chartOfAccount')
    const data = chartOfAccount.filter(x => x.natureofaccount === 'EXPENSES')

    this.setState({ chartOfAccount: data, custData, vendorData, empData, accountData })
  }

  fetchInvoiceData = async expId => {
    const { params } = this.props
    const result = await ExpensesService.getExpenses(expId)
    // console.log(result, 'Expenses result')
    // getQuotation(result ? result.data : [])
    const resultData = result || []
    const data = []
    // console.log(resultData, 'resultData.length')
    if (resultData.id) {
      // resultData.expensesAccountDto.forEach((ele, i) => {
      //   ele.key = i + 1
      // })

      _.forEach(resultData, (val, key) => {
        // console.log(val, key, 'data123')
        // if (key !== 'expensesAccountDto')
        // tempVal = null
        //
        data.push({
          name: [key],
          value:
            key === 'date' || key === 'expiryDate'
              ? moment(val)
              : key === 'paidThrough' || key === 'empId'
              ? Number(val)
              : val || '',
        })
      })
      this.setState(
        {
          defaultData: data,
          masterOrderData: resultData,
          subtotal: resultData.subtotal,
          total: resultData.total,
          dataSource: resultData.expensesAccountDto,
          action: 'Update',
          date: resultData.date,
          selectedCustId: {
            customerId: resultData.custId,
            firstName: resultData.customerName,
          },
          selectedEmpId: {
            empId: Number(resultData.empId),
            empName: resultData.empName,
          },
          selectedVendorId: {
            vendorId: resultData.vendorId,
            vendorName: resultData.vendorName,
          },
        },
        () => this.getAllData(),
      )
    }
  }

  showModal = (e, record) => {
    // console.log(e, record, 'e, record')
    const { visible } = this.state
    this.setState({
      visible: !visible,
      currentProdId: record,
    })
  }

  handleProduct = (e, record, from) => {
    const { dataSource, prodData, currentProdId } = this.state
    dataSource.forEach(element => {
      if (element.id === currentProdId.id) {
        Object.assign(element, record)
      }
    })
    this.setState(
      {
        dataSource,
      },
      () => this.handleChange(e, record, from),
    )
  }

  formValuesChange = e => {
    const isDirty = Object.keys(e).length && true
    this.setState({ isDirty })
  }

  onFinish = values => {
    const {
      dataSource,
      date,
      expiryDate,
      selectedCust,
      selectedVendor,
      selectedEmp,
      subtotal,
      total,
      selectedCustId,
      selectedVendorId,
      selectedEmpId,
      masterOrderData,
      deleteProdIds,
      selectedCostCenter,
    } = this.state
    // console.log(values, 'values')
    const { params, user, closeModal, trId, isEdit, reconcile } = this.props
    const org = store.get('selectedOrg')

    // console.log(selectedEmpId, 'selectedEmp 123', selectedEmp)
    // values.productDto = dataSource
    values.subtotal = subtotal
    values.total = total
    values.amount = total
    values.customerName = selectedCust.customer_fname || selectedCustId.firstName
    // values.lastName = selectedCust.customer_lname || selectedCustId.lastName
    values.custId = selectedCust.customer_id || selectedCustId.customerId

    values.vendorName = selectedVendor.firstName || selectedVendorId.vendorName
    // values.lastName = selectedCust.customer_lname || selectedCustId.lastName
    values.vendorId = selectedVendor.vendor_id || selectedVendorId.vendorId

    // values.empName = selectedEmp.empFirstName || selectedEmpId.empName
    values.lastName = selectedCust.customer_lname || selectedCustId.lastName
    values.empId = selectedEmp.empId || selectedEmpId.empId
    // values.empId = values.empId.toString()
    // values.desc = ''
    // values.title = ''
    // values.date = new Date(date)
    values.productId = deleteProdIds.toString()
    values.currency = org.currency
    values.date = moment(document.getElementById('date').value).format('MM/DD/YYYY HH:mm:ss')
    values.expenseNo = 0

    // values.expiryDate = new Date(expiryDate)
    // values.amount = 0
    // values.currency = 0
    // values.accepted = true
    // const prodId = []
    // dataSource.forEach(item => {
    //   prodId.push(item.id)
    // })
    // console.log(prodId)
    // values.product_id = prodId.toString()
    values.id = 0
    let method = 'post'
    const expActId = []
    if (params.id && !isEdit) {
      method = 'put'
      values.id = masterOrderData.id
      values.expenseNo = params.id
      dataSource.forEach((item, i) => {
        // dataSource[i].id = ''
        expActId.push(item.id)
        delete dataSource[i].key
        // prodId.push(item.id)
      })
    } else if (trId && isEdit) {
      method = 'put'
      values.id = masterOrderData.id
      values.expenseNo = trId
      dataSource.forEach((item, i) => {
        // dataSource[i].id = ''
        expActId.push(item.id)
        delete dataSource[i].key
        // prodId.push(item.id)
      })
    } else {
      dataSource.forEach((item, i) => {
        dataSource[i].id = 0
        delete dataSource[i].key
        // prodId.push(item.id)
      })
    }
    values.expActId = expActId.toString() || 0
    // values.expensesAccountDto = dataSource
    // values.email = user.email
    // console.log(values, 'values')
    const finalData = { ...values, ...selectedCostCenter }
    const fetchData = async () => {
      const result = await ExpensesService.createExpenses(finalData, method)
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
          () => this.props.naviagte('/exp/expenses'),
        )
      }
    }

    return fetchData()
  }

  onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo)
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

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { dataSource } = this.state
    if (oldIndex !== newIndex) {
      const newData = [] //arrayMove([].concat(dataSource), oldIndex, newIndex).filter(el => !!el)
      // console.log('Sorted items: ', newData)
      this.setState({ dataSource: newData })
    }
  }

  updateAccount = (e, record, keyName, index) => {
    // console.log(e, '|', record, '|', keyName, '|', index)
    const { chartOfAccount, masterProdData } = this.state
    const dataSource = this.formRef.current.getFieldValue('expensesAccountDto')

    const selectedProd = chartOfAccount.filter(x => x.id === e)
    record.expensesAct = selectedProd[0].actName
    // record.actId = e;
    dataSource[index].expensesAct = selectedProd[0].actName
    dataSource[index].accId = e

    // dataSource[index] = Object.assign(dataSource[index], record)
    // console.log(dataSource, 'dataSource after')
    this.formRef.current.setFieldsValue({ expensesAccountDto: dataSource })
    this.setState({ dataSource })
  }

  handleEmpName = e => {
    // const data = empData
    const { empData } = this.state
    // console.log(empData, 'data', e)
    const selected = empData.filter(item => item.empId === parseInt(e, 10))
    // console.log(e, 'handleCompName', selected, empData)
    this.passEmpData(selected)
  }

  handleDescription = (e, record, colName, index) => {
    // console.log(e, 'eeee')
    record.notes = e.target.value

    const dataSource = this.formRef.current.getFieldValue('expensesAccountDto')

    dataSource[index] = Object.assign(dataSource[index], record)
    this.formRef.current.setFieldsValue({ expensesAccountDto: dataSource })
    this.setState({ dataSource })
  }

  // handleChange = (e, record, fieldName) => {
  //   // console.log(record, 'handleChange', e)
  //   const { dataSource } = this.state
  //   // console.log(dataSource, 'dataSource')
  //   const amount = 0
  //   let total = 0
  //   let subtotal = 0
  //   let name = ''
  //   let value = ''
  //   if (e.value) {
  //     const { value: val, name: eName } = e
  //     name = 'expensesAct'
  //     value = val
  //   } else {
  //     const { value: val, name: nameVal } = e.target
  //     name = nameVal
  //     value = val
  //   }
  //   dataSource.forEach(element => {
  //     // console.log(element, 'element', name)
  //     if (element.key && element.key === record.key) {
  //       // console.log(name, 'e.target')
  //       element[name] = value
  //     }
  //     total += parseFloat(element.amount || 0)
  //     subtotal += parseFloat(element.amount || 0)
  //     // }
  //   })

  //   total += parseFloat(amount)
  //   subtotal += parseFloat(amount)
  //   this.setState({
  //     dataSource,
  //     total,
  //     subtotal,
  //   })
  // }

  handleChange = (e, record, colName, index) => {
    // console.log(e, 'e', record, 'handleChange', colName)
    const dataSource = this.formRef.current.getFieldValue('expensesAccountDto')
    let total = 0
    let subtotal = 0
    record.amount = e
    dataSource[index] = Object.assign(dataSource[index], record)

    dataSource.forEach(ele => {
      total += parseFloat(ele.amount || 0)
      subtotal += parseFloat(ele.amount || 0)
    })

    this.formRef.current.setFieldsValue({ expensesAccountDto: dataSource })

    this.setState({
      total: Number(total).toFixed(selOrgData?.decimals),
      subtotal: Number(subtotal).toFixed(selOrgData?.decimals),
      dataSource,
    })
  }

  // handleCalculation = (e, record) => {
  //   // console.log(record, 'handleCalculation', value)
  //   const { dataSource } = this.state

  //   dataSource.forEach(element => {
  //     if (element.key === record.key) {
  //       element[e.target.name] = e.target.value
  //     }
  //   })

  //   this.setState({
  //     dataSource,
  //   })
  // }

  renderHeader = columnsD => {
    // console.log(columnsD, 'columnscolumns')
    return (
      <tr>
        {columnsD.map((item, idx) => {
          return <th>{item.title}</th>
        })}
      </tr>
    )
  }

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { dataSource } = this.state
    // console.log('temp', dataSource)
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(x => x.index === restProps['data-row-key'])
    return <SortableItem index={index} {...restProps} />
  }

  // handleDelete = record => {
  //   const { dataSource, total, subtotal, deleteProdIds } = this.state

  //   const deleteProdIdVal = deleteProdIds || []
  //   if (record.isDeleted === false) {
  //     deleteProdIdVal.push(record.id)
  //   }

  //   this.setState({
  //     dataSource: dataSource.filter(item => item.key !== record.key),
  //     deleteProdIds: deleteProdIdVal,
  //     total: total - record.amount,
  //     subtotal: subtotal - record.amount,
  //   })
  // }

  handleDelete = (record, index) => {
    // console.log(record, index)
    const fields = this.formRef.current.getFieldsValue()
    const { expensesAccountDto } = fields
    const deletedItem = expensesAccountDto.splice(index, 1)
    this.formRef.current.setFieldsValue({ expensesAccountDto })

    const {
      total,
      subtotal,
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
    // console.log(deletedItem, 'expensesAccountDto', expensesAccountDto)

    const deleteProdIdVal = deleteProdIds || []
    if (record.isDeleted === false) {
      deleteProdIdVal.push(record.id)
    }

    this.setState({
      dataSource: expensesAccountDto,
      deleteProdIds: deleteProdIdVal,

      // total: ,
      total: total - (deletedItem[0].amount || 0),
      subtotal: subtotal - (deletedItem[0].amount || 0),

      // subTotal: subTotal - (record.sub_total || 0),
      // prodData: data,
      // totalDiscount: totalDiscount - (parseFloat(record.purchaseDiscountAmount) || 0),
      // totalTax: totalTax - (parseFloat(record.purchaseTaxRateAmount) || 0),
      // totalAmtWoTax: totalAmtWoTax - (parseFloat(record.amountWithoutTax) || 0),
    })
  }

  handleShowHide = () => {
    const { isVisible } = this.state
    this.setState({
      isVisible: !isVisible,
    })
  }

  // handleAdd = () => {
  //   const { count, dataSource } = this.state
  //   const newData = { key: dataSource.length + 1 }
  //   this.setState({
  //     dataSource: [...dataSource, newData],
  //     count: count + 1,
  //   })
  // }

  handleAdd = () => {
    const { count } = this.state
    const fields = this.formRef.current.getFieldsValue()
    // console.log(fields, 'fields')
    const { expensesAccountDto } = fields
    // console.log(expensesAccountDto, 'journelActDto', count)
    const dataSource = expensesAccountDto
    this.formRef.current.setFieldsValue({ journelActDto: dataSource })
    this.setState({
      dataSource,
    })
  }

  handleStDate = (date, dateString) => {
    // console.log(date, dateString, ' date, dateString')

    // const {date} = this.state
    // const val = moment(dateString).tz('Asia/Calcutta').format();
    if (date) {
      this.setState({
        date: date ? dateString : '',
      })
    }
  }

  handleExDate = (date, dateString) => {
    // console.log(date, dateString, ' date, dateString')
    // const {date} = this.state
    // const val = moment(dateString).tz('Asia/Calcutta').format();
    this.setState({
      expiryDate: dateString,
    })
  }

  onNameChange = event => {
    // console.log(event.target, 'temp', event.target)
    this.setState({
      custName: event.target.value,
    })
  }

  addItem = () => {
    // console.log('addItem')
    const { custData, custName } = this.state
    const val = temp + 1

    this.setState({
      custData: [
        ...custData,
        { name: custName, key: custData.length + 1 } || {
          name: `New item ${val}`,
          key: custData.length + 1,
        },
      ],
      custName: '',
    })
  }

  passCustData = data => {
    // console.log(data, 'selected Date')
    const { selectedCust } = this.state
    this.setState({
      selectedCust: data[0],
      selectedCustId: { customerId: data[0].customer_id },
    })
  }

  passVendorData = data => {
    // console.log(data, 'selected Date')
    const { selectedVendor } = this.state
    this.setState({
      selectedVendor: data[0],
      selectedVendorId: { vendorId: data[0].id },
    })
  }

  passEmpData = data => {
    // console.log(data, 'selected Date')
    const { selectedEmp } = this.state
    this.setState({
      selectedEmp: data[0],
      selectedEmpId: { empId: data[0].empId },
    })
  }

  handleTax = value => {
    // console.log(value, 'value')
    this.setState({
      taxValue: value,
    })
  }

  render() {
    const {
      dataSource,
      columns,
      bulkDataSource,
      bulkColumns,
      items,
      custData,
      selectedCustId,
      vendorData,
      selectedVendorId,
      empData,
      selectedEmpId,
      name,
      custName,
      isVisible,
      visible,
      isShown,
      total,
      subtotal,
      date,
      expiryDate,
      defaultData,
      taxValue,
      action,
      previewVisible,
      previewImage,
      fileList,
      previewTitle,
      isDirty,
      chartOfAccount,
      accountData,
      prodData,
      costCenterData,
      isCreateCostCenterModal,
    } = this.state
    // console.log(accountData, 'bulkColumns----------- ')
    const exDateVal = expiryDate
    const { params, closeModal, reconcile } = this.props
    // const DraggableContainer = props => (
    //   <SortableContainer
    //     useDragHandle
    //     helperClass="row-dragging"
    //     onSortEnd={this.onSortEnd}
    //     {...props}
    //   />
    // )

    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    )

    return (
      <>
        <Modal
          title="Add Customer"
          onOk={() => this.setState({ isVisible: !isVisible })}
          onCancel={() => this.setState({ isVisible: !isVisible })}
          open={isVisible}
          className="customerModal"
          okText="Add Product"
          // style={{ width: '700px' }}
          width={1000}
        >
          <CreateCustomer />
        </Modal>
        {/* <Tabs defaultActiveKey="1"> */}
        {/* <TabPane tab="Record Expense" key="1"> */}
        <Form
          className="form__layout--css"
          layout="horizontal"
          fields={defaultData}
          onFinish={this.onFinish}
          ref={this.formRef}
          onFinishFailed={this.onFinishFailed}
          onValuesChange={this.formValuesChange}
        >
          <Row className="mb-3 form__header--css">
            <Col span={20} style={{ fontSize: '18px' }}>
              {params?.id ? <span>Edit: {params?.id}</span> : 'New Expense'}
            </Col>
            <Col span={4} className="text-end">
              <Button type="default" className="text-center me-2" htmlType="submit">
                <Link to="/exp/expenses">Cancel</Link>
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
                        onChange={this.handleStDate}
                        // defaultValue={moment(date, 'DD MMM YYYY')}
                        format="DD MMM YYYY HH:mm:ss"
                        // value={moment(date, 'DD MMM YYYY')}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="empId"
                      label="Employee"
                      className="form__input--label not--required--field"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Please select employee!',
                      //   },
                      // ]}
                    >
                      {/* <LoadEmp
                          empData={empData}
                          handleShowHide={this.handleShowHide}
                          passEmpData={this.passEmpData}
                          selectedEmpId={selectedEmpId.empId}
                        /> */}
                      <Select
                        placeholder="Select/Add Customer"
                        value={custData.length ? selectedCustId : ''}
                        onChange={e => this.handleEmpName(e)}
                        popupRender={menu => (
                          <div>
                            <Divider style={{ margin: '4px 0' }} />
                            {/* <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                <Button
                                  onClick={() => {
                                    this.handleShowHide()
                                  }}
                                  role="button"
                                >
                                  <PlusOutlined /> Add Employee
                                </Button>
                              </div> */}

                            {menu}
                          </div>
                        )}
                      >
                        {empData.map(item => (
                          <Option value={item.empId} key={`${item.company_name}_${item.empId}`}>
                            {`${item.empFirstName} ${item.empLastName} (${item.company_name})`}
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
                      name="paidThrough"
                      label="Paid Through"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please select account!',
                        },
                      ]}
                    >
                      <Select placeholder="" disabled={params.bankId && true}>
                        {accountData?.map((item, index) => (
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
                      name="paymentMode"
                      label="Payment Mode"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please select payment!',
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        // defaultValue="Cash"
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
                      name="costCenter"
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

              {/* <div className="col-md-12">
                      <Table
                        pagination={false}
                        dataSource={dataSource}
                        columns={columns}
                        rowKey="key"
                        components={{
                          body: {
                            wrapper: DraggableContainer,
                            row: this.DraggableBodyRow,
                          },
                        }}
                        // scroll={{ x: 691 }}
                      />
                      <br />
                    </div> */}
              <Col span={24} className="fs-13 text-uppercase mb-3">
                <span className="bulletIcon">Expenses</span>
              </Col>
              <Col span={24}>
                <Form.List name="expensesAccountDto">
                  {(expensesAccountDto, options) => {
                    // console.log(dataSource, 'dataSource.expensesAccountDto')
                    return (
                      <AccountTable
                        // productDetailsDto={productDetailsDto}
                        add={options.add}
                        remove={options.remove}
                        // productData={prodData}
                        // handleDelete={this.handleDelete}
                        handleAddRow={this.handleAdd}
                        itemData={dataSource || []}
                        chartOfAccount={chartOfAccount || []}
                        updateProduct={this.updateAccount}
                        updateRow={this.handleChange}
                        // updateQtyRow={this.updateQtyRow}
                        // handleAddRow={this.handleAddRow}
                        handleDeleteRow={this.handleDelete}
                        custData={prodData}
                        handleDescription={this.handleDescription}
                        // showModal={this.showModal}
                      />
                    )
                  }}
                </Form.List>
              </Col>
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
              {/* <div className="col-md-12">&nbsp;</div> */}

              <Col span={10} offset={14} className="mt-3 total__section">
                <div className="total__section--con">
                  <Row>
                    <div className="col-md-7 text-start ps-5 pt-2">Subtotal</div>
                    <div className="col-md-5 text-end pt-2">{subtotal}</div>
                    <div className="col-md-7 text-start ps-5 pt-2">Total</div>
                    <div className="col-md-5 text-end pt-2">{total}</div>
                  </Row>
                </div>
              </Col>
              <Col span={24}>
                <hr />
              </Col>

              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="vendorName"
                      className="form__input--label not--required--field"
                      label="Vendor Name"
                    >
                      <LoadVendor
                        vendorData={vendorData}
                        handleShowHide={this.handleShowHide}
                        passVendorData={this.passVendorData}
                        selectedVendorId={selectedVendorId.vendorId}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="invoiceNo"
                      className="form__input--label not--required--field"
                      label="Invoice#"
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
                      name="customerName"
                      className="form__input--label not--required--field"
                      label="Customer"
                    >
                      <LoadCon
                        custData={custData}
                        handleShowHide={this.handleShowHide}
                        passCustData={this.passCustData}
                        selectedCustId={selectedCustId.customerId}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              {/* <div className="col-sm-3">
                  <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChangeF}
                  >
                    {fileList.length >= 8 ? null : uploadButton}
                  </Upload>
                  <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                  >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </div> */}
            </Row>
            <hr />
            <div className="text-end pb-3">
              {params.bankId || reconcile ? (
                <Button type="default" className="text-center me-2" onClick={() => closeModal()}>
                  Cancel
                </Button>
              ) : (
                <Button type="default" className="text-center me-2" htmlType="submit">
                  <Link to="/exp/expenses">Cancel</Link>
                </Button>
              )}
              <Button type="primary" className="text-cente me-3" htmlType="submit">
                {action}
              </Button>
            </div>
          </div>
          {/* <CreateProductModal
                headingText="Create Product And Service"
                visible={visible}
                productId=""
                // loadData={loadData}
                // productData={}
                handleChange={this.handleProduct}
                showModal={this.showModal}
                isOutside
              /> */}</Form>
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
        {/* </TabPane> */}
        {/* <TabPane style={{display:"none;"}} tab="Record Mileage" key="2">
            <Form
              layout="vertical"
              fields={defaultData}
              onFinish={this.onFinish}
              ref={this.formRef}
              onFinishFailed={this.onFinishFailed}
            >
              <div className="row">
                <div className="col-sm-9">
                  <div className="row">
                    <div className="col-md-2">
                      <Form.Item name="date" label="Date">
                        <Space direction="vertical" size={12}>
                          <DatePicker
                            onChange={this.handleStDate}
                            defaultValue={moment(date, 'YYYY/MM/DD')}
                            format="YYYY/MM/DD"
                            value={moment(date, 'YYYY/MM/DD')}
                          />
                        </Space>
                      </Form.Item>
                    </div>
                    <div className="col-md-4">
                      <Form.Item name="customerId" label="Employee">
                        <Input />
                      </Form.Item>
                    </div>
                    <div className="col-md-6">
                      <Form.Item name="customerId" label="Calculate mileage using">
                        <Radio.Group value="default">
                          <Radio value="default">Distance Travelled</Radio>
                          <Radio value="large">Odometer Reading</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </div>
                    <div className="col-md-4">
                      <Form.Item name="customerId" label="Distance">
                        <Input />
                      </Form.Item>
                    </div>
                    <div className="col-md-4">
                      <Form.Item name="customerId" label="Odometer Reading">
                        <Input />
                      </Form.Item>
                    </div>
                    <div className="col-md-4">
                      <Form.Item name="customerId" label="Rate per KM">
                        <Input />
                      </Form.Item>
                    </div>
                    <div className="col-md-4">
                      <Form.Item name="customerId" label="Amount">
                        <Input disabled />
                      </Form.Item>
                    </div>

                    <div className="col-md-4">
                      <Form.Item name="currency" label="Paid Through">
                        <Select placeholder="">
                          <Option value="KWD">Adv. Tax </Option>
                          <Option value="INR">Emp. Tax</Option>
                        </Select>
                      </Form.Item>
                    </div>
                    <div className="col-md-4">
                      <Form.Item name="currency" label="Currency">
                        <Select placeholder="">
                          <Option value="KWD">KWD </Option>
                          <Option value="INR">INR</Option>
                        </Select>
                      </Form.Item>
                    </div>
                    <div className="col-md-12">
                      <hr />
                    </div>
                    <div className="col-md-4">
                      <Form.Item name="customerId" label="Vendor Name">
                        <LoadCon
                          custData={custData}
                          handleShowHide={this.handleShowHide}
                          passCustData={this.passCustData}
                          selectedCustId={selectedCustId.customerId}
                        />
                      </Form.Item>
                    </div>
                    <div className="col-md-3">
                      <Form.Item name="reference" label="Invoice#">
                        <Input />
                      </Form.Item>
                    </div>
                    <div className="col-md-3">
                      <Form.Item name="reference" label="Notes">
                        <TextArea />
                      </Form.Item>
                    </div>
                    <div className="col-md-12">
                      <hr />
                    </div>
                    <div className="col-md-4">
                      <Form.Item name="customerId" label="Customer">
                        <LoadCon
                          custData={custData}
                          handleShowHide={this.handleShowHide}
                          passCustData={this.passCustData}
                          selectedCustId={selectedCustId.customerId}
                        />
                      </Form.Item>
                    </div>
                    <div className="col-md-12 text-center">
                      <Button type="default" className="text-center" htmlType="submit">
                        <strong>
                          <Link to="/sales/invoices">Cancel</Link>
                        </strong>
                      </Button>
                      <Button type="primary" className="text-center" htmlType="submit">
                        <strong>{action}</strong>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="col-sm-3">
                  <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChangeF}
                  >
                    {fileList.length >= 8 ? null : uploadButton}
                  </Upload>
                  <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                  >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </div>
              </div>
            </Form>
          </TabPane> */}
        {/* <TabPane style={{display:"none;"}} tab="Bulk Add Expenses" key="3">
            <Dropdown overlay={this.menuCustomize} trigger={['click']}>
              <Button type="button" className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                Customize <DownOutlined />
              </Button>
            </Dropdown>
            <hr />
            <Table
              pagination={false}
              dataSource={bulkDataSource}
              columns={bulkColumns}
              rowKey="id"
              components={{
                header: {
                  row: () => this.renderHeader(bulkColumns),
                },
                body: {
                  wrapper: DraggableContainer,
                  row: this.DraggableBodyRow,
                },
              }}
              scroll={{ x: true }}
            />
            <Button
              onClick={this.handleAdd}
              type="primary"
              style={{
                marginBottom: 16,
              }}
            >
              Add a row
            </Button>
          </TabPane> */}
        {/* </Tabs> */}
      </>
    )
  }
}

const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})

export default connect(mapStateToProps)(WithRouter(CreateExpenses))


