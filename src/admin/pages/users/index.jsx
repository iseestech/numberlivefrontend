import React, { useEffect, useState } from 'react'
import { Button, Table, Popconfirm } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import adminServices from '@/services/admin'
import { connect } from 'react-redux'
import { history } from '@/main'
// import tableData from './data.json'

const mapStateToProps = ({ router, user }) => ({
  routerData: router,
  userData: user,
})

const Users = (routerData, userData) => {
  const [tableData, setTableData] = useState([])
  useEffect(() => {
    getUsers()
  }, [])

  async function getUsers() {
    const data = await adminServices.adminUsers()
    setTableData(
      data.map((ele, i) => {
        return { ...ele, key: i + 1 }
      }),
    )
  }

  const tableColumns = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Name',
      dataIndex: 'ms_name',
      key: 'name',
    },
    {
      title: 'Address',
      dataIndex: 'ms_address',
      key: 'address',
    },
    {
      title: 'Email',
      dataIndex: 'ms_email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'ms_mobile',
      key: 'phone',
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'Created By',
      dataIndex: 'created_by',
      key: 'created_by',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => <Link to={`/admin/user-setting/${record.key}`}>click here</Link>,
    },
  ]

  const handleDelete = record => {
    history.push(`/admin/user-setting/${record.key}`)
  }

  return (
    <div>
      <Table columns={tableColumns} dataSource={tableData} pagination={false} />
    </div>
  )
}

export default connect(mapStateToProps)(Users)
