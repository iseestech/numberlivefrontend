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
  InputNumber,
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
import store from 'store'
import CreateProductModal from '@/components/accountancy/productsAndServices/createProductModal'
import CreateCustomer from '@/components/accountancy/contacts/createCustomer'
import ChartOfAccService from '@/services/chartOfAccount'
import HelperFunction from '@/services/helper'
import CreateAccountGroup from './createAccountGroup'

import './index.scss'

const selOrgData = store.get('selectedOrg')

const { TextArea } = Input
const { Option, OptGroup } = Select
const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
))

class CreateChartOfAccount extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      primaryAccData: [],
      parentAccData: [],
      isParentAcc: false,
      isGroupOpen: false,
      isSubGrp: false,
      action: 'Create',
      actType: '',
      accountsGroupEntity: { id: '' },
      accountsSubGroupEntity: [],
      primaryActList: {
        accSubGroup: [],
        lstAccGroup: [],
      },
      createdCustGroup: '',
      userCustGroup: [],
      data: [],
      accountTypeList: [],
      subGropDataById: [],
      selectedPrimaryAcc: {},
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

      const [accountTypeList] = await axios.all([
        // this.fetchChartOfAccList(),
        this.fetchChartOfAllPrimaryAccounts(),
      ])
      // console.log(primaryActList, 'reseeeeeeeeult')

      this.setState(
        {
          // primaryAccData: actList,
          accountTypeList,
        },
        () => {
          if (chartData.id) {
            const data = []
            _.forEach(chartData, (value, key) => {
              // if (key === 'groupType') {
              //   let newVal = value === 'PRIMARY' ? 'AG' : 'SG'
              //   newVal = value === 'CUSTOM' ? 'CG' : newVal

              //   data.push({
              //     name: 'accGroupId',
              //     value: `${chartData.accGroupId}_${newVal}`,
              //   })
              // } else if (key === 'parentType') {
              //   let newVal = value === 'PRIMARY' ? 'AG' : 'SG'
              //   newVal = value === 'CUSTOM' ? 'CG' : newVal
              //   data.push({
              //     name: 'parentAccount',
              //     value: `${chartData.parentAccount}_${newVal}`,
              //   })
              // } else {
              //   data.push({
              //     name: [key],
              //     value,
              //   })
              // }
              // if (key !== 'accGroupId') {
              data.push({
                name: key,
                value,
              })
              // }
            })
            /*  const subAct =
              (chartData.accountsSubGroupEntity && chartData.accountsSubGroupEntity[0]) || []
            if (subAct.id) {
              data.push(
                {
                  name: 'isParentAcc',
                  value: chartData.accountsSubGroupEntity && true,
                },
                { name: 'parentAcc', value: subAct.id },
              )
            } */
            this.setState(
              {
                data,
                // accountsGroupEntity: chartData.accountsGroupEntity,
                // accountsSubGroupEntity: chartData.accountsSubGroupEntity || [],
                // isParentAcc: chartData.makeSubAccount || false,
                // isSubGrp: chartData.accountsSubGroupEntity && true,
                // actType: chartData.actType,
              },
              () => {
                // console.log(chartData.accGroupId, 'chartData')
                this.formRef.current.setFieldsValue({ accGroupId: chartData.accGroupId })
                this.getSubGroupData(chartData.accGroupId)
              },
            )
          }
        },
      )
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
    const { showModal, isAddEdit, chartData } = this.props
    const obj = {
      ...values,
    }
    // obj.accGroupId = values.accGroupId.value
    // console.log(
    //   accountsGroupEntity,
    //   accountsSubGroupEntity,
    //   'accountsGroupEntity, accountsSubGroupEntity ',
    // )
    // values.accGroupId = values

    let method = 'post'
    if (!isAddEdit) {
      method = 'put'
      obj.id = chartData.id
    }
    const fetchData = async () => {
      const result = await ChartOfAccService.createChartOfAccount(obj, method)
      console.log('result ', result)
      if (result?.data?.statusCode === 409) {
        notification.warning({
          message: 'Error',
          description: result.data && result.data.message,
        })
      } else {
        showModal(true)
      }
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

  getCreatedGroup = value => {
    // console.log('value', value)
    const { isGroupOpen, userCustGroup, subGropDataById } = this.state
    const userGroup = subGropDataById
    userGroup.push(value)
    this.setState(
      {
        isGroupOpen: false,
        // userCustGroup: userGroup,
        subGropDataById: userGroup,
      },
      () => {
        this.formRef.current.setFieldsValue({ accSubGroupId: value.id })
        // this.formRef.current.setFieldsValue({ primaryAccId: value.accGroupId})
      },
    )
  }

  closeGroupModal = data => {
    const { isGroupOpen } = this.state
    this.setState({ isGroupOpen: !isGroupOpen })
  }

  getSubGroupData = async e => {
    const { accountTypeList } = this.state
    let data = []
    accountTypeList.forEach(item => {
      const temp = item.lstAccountGroupDto.filter(x => x.id === e)
      if (temp.length) {
        data = temp
      }
    })

    const org = store.get('selectedOrg')

    const result = await ChartOfAccService.getSubGroupById(e, org.orgCode)

    this.setState({
      subGropDataById: result,
      selectedPrimaryAcc: {
        id: data[0].id,
        name: data[0].name,
      },
    })
  }

  getSubGroup = e => {
    // const getData = async () => {
    //   const result = await ChartOfAccService.getSubGroupById(e.value)
    //   // console.log(result, 'reseeeeeeeeult')

    //   this.setState({
    //     subGropDataById: result,
    //     selectedPrimaryAcc: {
    //       id: e.value,
    //       name: e.label,
    //     },
    //   })
    // }

    this.getSubGroupData(e)
  }

  render() {
    const { match, chartData, isAddEdit, showModal } = this.props
    // console.log(chartData, 'chartData', isAddEdit)
    const {
      primaryAccData,
      parentAccData,
      isParentAcc,
      createdCustGroup,
      userCustGroup,
      isSubGrp,
      isGroupOpen,
      data,
      action,
      accountTypeList,
      accountsGroupEntity,
      accountsSubGroupEntity,
      primaryActList,
      subGropDataById,
      selectedPrimaryAcc,
    } = this.state
    // const routeName = match.path.split('/')
    // console.log(isParentAcc, 'isParentAcc');
    // console.log(chartData, 'data', chartData)

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
              <Form.Item
                name="accGroupId"
                label="Account Type"
                rules={[
                  {
                    required: true,
                    message: 'Please Select Account!',
                  },
                ]}
              >
                <Select
                  placeholder=""
                  onChange={this.getSubGroup}
                  // labelInValue
                  // defaultValue={{ value: chartData.accGroupId }}
                >
                  {accountTypeList.map(item => {
                    return (
                      <OptGroup key={item.category} label={item.category}>
                        {item.lstAccountGroupDto.map(x => {
                          return (
                            <Option key={x.id} value={x.id}>
                              {x.name}
                            </Option>
                          )
                        })}
                      </OptGroup>
                    )
                  })}
                </Select>
              </Form.Item>
            </div>

            <div className="col-md-12">
              <Form.Item
                name="actCode"
                className="chartOfAccField"
                label="Code"
                extra="A unique code/number for this account (limited to 10 charcters)"
                rules={[
                  {
                    required: true,
                    message: 'Please enter Account code!',
                  },
                ]}
              >
                <Input maxLength={10} disabled={!isAddEdit} />
              </Form.Item>
            </div>

            <div className="col-md-12">
              <Form.Item
                className="chartOfAccField"
                name="actName"
                label="Name"
                extra="A short title for this account (limited to 150 charcters)"
                rules={[
                  {
                    required: true,
                    message: 'Please enter Account name!',
                    // max:"2"
                  },
                ]}
              >
                <Input maxLength={150} />
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
              <Form.Item name="makeSubAccount" label={null} valuePropName="checked">
                <Checkbox onChange={e => this.setState({ isParentAcc: e.target.checked })}>
                  Make this a sub-account
                </Checkbox>
              </Form.Item>
            </div> */}
            {/* {isParentAcc && (
              <div className="col-md-12">
                <Form.Item name="parentAccount" label="Parent Account">
                  <Select
                    style={{ width: 240 }}
                    placeholder=""
                    // onChange={this.handleSubAccountType}
                  >
                    {primaryActList.lstAccGroup.map(item => {
                      return (
                        <Option key={`${item.id}_AG`} value={`${item.id}_AG`}>
                          {item.name}
                        </Option>
                      )
                    })}
                    {primaryActList.accSubGroup.map(item => {
                      return (
                        <Option key={`${item.id}_SG`} value={`${item.id}_SG`}>
                          {item.subGroup}
                        </Option>
                      )
                    })}
                    {primaryActList.lstAccount.map(item => {
                      return (
                        <Option key={`${item.id}_CG`} value={`${item.id}_CG`}>
                          {item.actName}
                        </Option>
                      )
                    })}
                  </Select>
                </Form.Item>
              </div>
            )} */}

            <div className="col-md-12">
              <Form.Item
                name="accSubGroupId"
                label="Group"
                rules={[
                  {
                    required: true,
                    message: 'Please select group!',
                  },
                ]}
              >
                <Select
                  // style={{ width: 240 }}
                  placeholder="Select/Add Group"
                  popupRender={menu => (
                    <div>
                      <Divider style={{ margin: '4px 0' }} />
                      <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                        <Button
                          onClick={() => this.setState({ isGroupOpen: !isGroupOpen })}
                          role="button"
                        >
                          <PlusOutlined /> Add Group
                        </Button>
                      </div>
                      {menu}
                    </div>
                  )}
                >
                  {subGropDataById.map(item => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.subGroup}
                      </Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </div>
            {/* <div className="col-md-12">
              <Form.Item name="actType" label="Primary Account">
                <Select style={{ width: 240 }} placeholder="" onChange={this.handleAccountType}>
                  {primaryAccData.map(item => {
                    return (
                      <OptGroup key={item.category} label={item.category}>
                        {item.lstAccountGroupDto.map(val => (
                          <Option key={val.id} value={val.id}>
                            {val.name}
                          </Option>
                        ))}
                      </OptGroup>
                    )
                  })}
                </Select>
              </Form.Item>
            </div> */}
            {/* <div className="col-md-12">
              <Form.Item
                name="act_id"
                label="Account Code"
                rules={[
                  {
                    required: true,
                    message: 'Please enter Account code!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div> */}
            <div className="col-md-12">
              <Form.Item
                name="accountBalance"
                label="Account Balance"
                rules={[
                  {
                    required: true,
                    message: 'Please add Account balance!',
                  },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  onKeyDown={HelperFunction.isValidNumber}
                  precision={selOrgData?.decimals}
                />
              </Form.Item>
            </div>
            <div className="col-md-12">
              <Form.Item
                className="chartOfAccField"
                name="discription"
                label="Description"
                extra="A description of how this account should be used"
              >
                <Input />
              </Form.Item>
            </div>
            <div className="col-md-12 text-center">
              {/* <Button type="default" className="text-center" htmlType="submit">
                <strong>
                  <Link to="/accounts/chart-of-accounts">Cancel</Link>
                </strong>
              </Button> */}
              <Button type="default" className="text-center" onClick={() => showModal(true)}>
                <strong>Cancel</strong>
              </Button>

              <Button type="primary" className="text-center" htmlType="submit">
                <strong>{isAddEdit ? 'Create' : 'Update'}</strong>
              </Button>
            </div>
          </div>
        </Form>
        <Modal
          className="chart-of-account"
          title="Create New Group"
          footer={null}
          visible={isGroupOpen}
          // onOk={handleOk}
          onCancel={() => this.setState({ isGroupOpen: !isGroupOpen })}
        >
          <CreateAccountGroup
            primaryAcc={selectedPrimaryAcc}
            getCreatedGroup={this.getCreatedGroup}
            closeGroupModal={this.closeGroupModal}
          />
        </Modal>
      </>
    )
  }
}

export default connect()(CreateChartOfAccount)

