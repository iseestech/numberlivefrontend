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
  Checkbox,
  notification,
} from 'antd'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import axios from 'axios'
import { MenuOutlined, PlusOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import CreateProductModal from '@/components/accountancy/productsAndServices/createProductModal'
import CreateCustomer from '@/components/accountancy/contacts/createCustomer'

import ChartOfAccService from '@/services/chartOfAccount'
import './index.scss'

const { TextArea } = Input
const { Option, OptGroup } = Select
const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
))

class CreateAccountGroup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      primaryAccData: [],
      parentAccData: [],
      isGroupOpen: false,
      isParentAcc: false,
      isSubGrp: false,
      action: 'Create',
      actType: '',
      accountsGroupEntity: { id: '' },
      accountsSubGroupEntity: [],
      primaryActList: {
        accSubGroup: [],
        lstAccGroup: [],
      },
    }
    // This binding is necessary to make `this` work in the callback
    this.onFinish = this.onFinish.bind(this)
    this.onFinishFailed = this.onFinishFailed.bind(this)
    this.formRef = React.createRef()
  }

  componentDidMount() {
    // console.log('temp')
    const { chartData } = this.props
    // console.log('temp', chartData)
    const getData = async () => {
      // const result = await ChartOfAccService.ChartOfAccList('ALL')

      const [actList, primaryActList] = await axios.all([
        this.fetchChartOfAccList(),
        this.fetchChartOfAllPrimaryAccounts(),
      ])
      // console.log(primaryActList, 'reseeeeeeeeult')

      this.setState({
        primaryAccData: actList,
        primaryActList,
      })
    }

    getData()
  }

  fetchChartOfAccList = () => ChartOfAccService.ChartOfAccList('ALL')

  fetchChartOfAllPrimaryAccounts = () => ChartOfAccService.ChartOfAllPrimaryAccounts()

  // componentWillUnmount() {
  //   alert('The component is going to be unmounted');
  // }

  onFinish = values => {
    const { accountsGroupEntity, accountsSubGroupEntity, actType } = this.state
    const {
      showModal,
      isAddEdit,
      chartData,
      closeGroupModal,
      getCreatedGroup,
      primaryAcc,
    } = this.props
    // console.log(
    //   accountsGroupEntity,
    //   accountsSubGroupEntity,
    //   'accountsGroupEntity, accountsSubGroupEntity ',
    // )
    const { id: accGroupId, name } = primaryAcc
    const obj = {
      ...values,
      accountsGroupEntity: {
        catId: 0,
        code: 'string',
        id: 0,
        name: 'string',
      },
      defaultData: false,
      id: 0,
    }
    obj.accGroupId = accGroupId
    obj.under = name

    // getCreatedGroup(values)
    const fetchData = async () => {
      const result = await ChartOfAccService.addSubGroupAccount(obj, 'post')
      if (result?.data?.statusCode === 200) {
        const data = result?.data ? result?.data?.data : {}
        getCreatedGroup(data)
      } else {
        notification.error({
          message: 'Error',
          description: result?.data && result?.data?.message,
        })
      }
      // closeGroupModal()
    }

    return fetchData()
  }

  onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo)
  }

  onNameChange = event => {
    // this.setState({
    //   custName: event.target.value,
    // })
  }

  getSubActData = id => {
    const getData = async () => {
      const result = await ChartOfAccService.getParentAccount(id)
      // console.log(result, 'reseeeeeeeeult')

      this.setState({
        // actType: e.children,
        parentAccData: result.lstAccountsSubGroupDto,
        isSubGrp: result.lstAccountsSubGroupDto.length || false,

        // accountsGroupEntity: actGrp[0],
      })
    }

    getData()
  }

  handleListOfAccountType = (id, e) => {
    const idVal = e.key.split('_')[2] || e.key.split('_')[0]
    // console.log(id, idVal, 'handleAccountType', e)
    const { primaryActList } = this.state
    const { lstAccGroup } = primaryActList
    // console.log(lstAccGroup, 'lstAccGroup')
    const primaryAcc = lstAccGroup.filter(x => x.id.toString() === idVal.toString())
    // console.log(primaryAcc, 'primaryAcc')
    this.formRef.current.setFieldsValue({ primaryAccId: primaryAcc[0].id })
  }

  handleAccountType = (id, e) => {
    // const { dataset } = e.target
    // console.log(id, 'handleAccountType', e)
    // const catId = e.target.dataset.catId;
    const { primaryAccData } = this.state

    let actGrp = primaryAccData.map(item => item.lstAccountGroupDto.filter(ele => ele.id === id))
    actGrp = actGrp.filter(item => item.length)
    const flattenArr = _.flatten(actGrp)
    // flatten
    // console.log(actGrp, 'actGrp', flattenArr)

    this.setState({
      actType: e.children,
      parentAccData: flattenArr[0] || [],
      isSubGrp: (flattenArr.length && flattenArr[0].lstAccountsSubGroupDto.length) || false,
      accountsGroupEntity: (actGrp.length && actGrp[0][0]) || [],
    })

    // const getData = async () => {
    //   const result = await ChartOfAccService.getParentAccount(id)
    //   // console.log(result, 'reseeeeeeeeult', actGrp)

    //   this.setState({
    //     actType: e.children,
    //     parentAccData: result.lstAccountsSubGroupDto,
    //     isSubGrp: result.lstAccountsSubGroupDto.length || false,
    //     accountsGroupEntity: actGrp[0][0],
    //   })
    // }

    // getData()
  }

  handleSubAccountType = value => {
    // const catId = e.target.dataset.catId;
    // console.log('value', value)
    const { parentAccData } = this.state
    const filterData = parentAccData.filter(item => item.id === value)
    // console.log('filterData', filterData)
    this.setState({
      accountsSubGroupEntity: filterData,
    })
  }

  //   handleOk = val => {

  //   }

  //   handleCancel = () => {
  //     setIsModalVisible(false)
  //   }

  render() {
    const { match, chartData, isAddEdit, closeGroupModal } = this.props
    // console.log(chartData, 'chartData', isAddEdit)
    const {
      primaryAccData,
      parentAccData,
      isParentAcc,
      isSubGrp,
      data,
      isGroupOpen,
      action,
      accountsGroupEntity,
      accountsSubGroupEntity,
      primaryActList,
    } = this.state
    const routeName = match.path.split('/')
    // console.log(isParentAcc, 'isParentAcc')
    return (
      <>
        <Form
          layout="vertical"
          ref={this.formRef}
          fields={data}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <div className="row">
            <div className="col-md-12">
              <Form.Item name="subGroup" label="Group Name">
                <Input style={{ width: 240 }} />
              </Form.Item>
            </div>
            {/*  {isSubGrp && (
              <div className="col-md-12">
                <Form.Item name="isParentAcc" label={null} valuePropName="checked">
                  <Checkbox onChange={e => this.setState({ isParentAcc: e.target.checked })}>
                    Make this a sub-account
                  </Checkbox>
                </Form.Item>
              </div>
            )} */}
            {/* <div className="col-md-12">
              <Form.Item name="accGroupId" label="Primary Account">
                <Select
                  style={{ width: 240 }}
                  placeholder="Select Account"
                  //   value={custData.length ? selectedCustId : ''}
                  onChange={this.handleListOfAccountType}
                >
                  {primaryActList.lstAccGroup.map(item => {
                    return (
                      <Option key={`${item.id}_AG`} value={`${item.id}_AG`}>
                        {item.name}
                      </Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </div> */}

            <div className="col-md-12 text-center">
              <Button type="default" className="text-center" onClick={() => closeGroupModal()}>
                <strong>Cancel</strong>
              </Button>

              <Button type="primary" className="text-center" htmlType="submit">
                <strong>Add</strong>
              </Button>
            </div>
          </div>
        </Form>
      </>
    )
  }
}

export default connect()(CreateAccountGroup)

