import React, { useState, useEffect } from 'react'
import store from 'store'
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
} from 'antd'
import ReactDOM from 'react-dom'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
// import SelectCurrency   from 'react-select-currency'
import OrganizationService from '@/services/organization'
// import './index.scss'

const { Option } = Select

const mapStateToProps = ({ user }) => ({
  userData: user,
})

const OrganizationSelection = props => {
  const [orgName, setOrgName] = useState('')
  const { userData, isModalVisible: isVisible } = props
  const { organization } = userData
  const [isModalVisible, setIsModalVisible] = useState(isVisible)
  const orgData = store.get('organization')
  store.set('organization', organization)
  const showOrgnization = store.get('showOrgnization')
  // console.log(showOrgnization, 'showOrgnization')
  const [orgList, getOrgList] = useState([])

  useEffect(() => {
    const { id } = userData
    const fetchData = async () => {
      const result = await OrganizationService.organizationList(id)
      // console.log(result, 'result')
      getOrgList(result?.data || [])
    }
    fetchData()
  }, [userData])

  //   const onFinish = values => {
  //     // console.log('Success:', values)
  //     values.currDate = new Date().toLocaleDateString()
  //     // values.userId = userData.id
  //     const fetchData = async () => {
  //       const result = await OrganizationService.createOrganization(values, 'post')
  //       // history.push('/sales/quotations')
  //       handleCancel()
  //       // console.log(result, 'result')
  //     }

  //     return fetchData()
  //   }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
    store.set('showOrgnization', '')
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleName = e => {
    // console.log('Failed:', e)
    const selectedOrg = orgList.filter(item => item.id === orgName)
    // console.log('selectedOrg', selectedOrg)
    store.set('organization', selectedOrg[0])
    store.set('selectedOrg', selectedOrg[0])
    store.set('showOrgnization', '')
    window.location.reload()
  }

  return (
    <>
      <Modal
        title="Select Organization"
        visible={showOrgnization === 'yes' && true}
        footer={null}
        onCancel={false}
        closable={false}
      >
        {!orgList.length && <h2>Loading...!!!</h2>}

        {orgList.length >= 1 && (
          <>
            <Select
              style={{ width: '100%' }}
              placeholder="Select Organization"
              labelInValue
              defaultValue={{ value: orgData.id }}
              onChange={e => setOrgName(e.value)}
            >
              {orgList.map((item, index) => (
                <Option value={item.id} key={item.id}>
                  {item.orgName}
                </Option>
              ))}
            </Select>
            <div className="text-end">
              <Button type="primary" className="mt-2" onClick={e => handleName(e)}>
                Submit
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  )
}

export default connect(mapStateToProps)(OrganizationSelection)

