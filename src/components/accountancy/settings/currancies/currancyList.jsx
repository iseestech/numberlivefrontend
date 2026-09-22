import React, { useState, useEffect } from 'react'
import { Button, Table, Modal } from 'antd'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import CustomerService from '@/services/customer'
import apiClient from '@/services/axios'
import tableData from './data.json'
import CreateCurrancy from './createCurrancy'

const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const tableColumns = [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Currancy Name',
    dataIndex: 'currancyName',
    key: 'currancyName',
  },
  {
    title: 'Currancy Code',
    dataIndex: 'currancyCode',
    key: 'currancyCode',
  },
  {
    title: 'Currancy Symbol',
    dataIndex: 'currancySymbol',
    key: 'currancySymbol',
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (text, record) => {
      // console.log(text, record)
      return <Link to={`/settings/currancy/${record.id}`}>click here</Link>
    },
  },
]

const CurrancyList = routerData => {
  const [customers, getCustomers] = useState([])
  const [page, setpage] = useState(1)
  const [isModalVisible, setIsModalVisible] = useState(false)
  useEffect(() => {
    // const result = await CustomerService.customerList().then(res=> res)
    // getCustomers(result);

    const fetchData = async () => {
      const result = await CustomerService.customerList()
      getCustomers(result)
    }

    fetchData()
  }, [page])

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  // console.log(customers, 'customers')
  const routeName = routerData.match.path.split('/')[2]
  // console.log(CustomerService.customerList())
  return (
    <div>
      <div className="text-end">
        {/* <Button type="primary" size="large" className="text-center w-10 mb-1" htmlType="submit">
          <strong>Import</strong>
        </Button>
        <Button type="primary" size="large" className="text-center w-10 mb-1" htmlType="submit">
          <strong>Export</strong>
        </Button> */}
        <Button
          type="primary"
          onClick={showModal}
          size="large"
          className="text-center w-10 mb-1"
          htmlType="submit"
        >
          {/* <strong>
            {' '}
            <Link
              to='/settings/currancy/create'
              className="text-white"
            >
              Create {routeName}
            </Link>
          </strong> */}
          Create Currency
        </Button>
      </div>
      <Table columns={tableColumns} dataSource={tableData} pagination={false} />
      <Modal
        title="Create Currency"
        footer={null}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <CreateCurrancy />
      </Modal>
    </div>
  )
}

export default connect()(CurrancyList)
