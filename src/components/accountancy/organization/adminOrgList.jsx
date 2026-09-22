import React, { useState, useEffect } from 'react'
import { Button, Table, Modal, Tabs, Select } from 'antd'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import OrganizationService from '@/services/organization'
// import tableData from './data.json'
// import tableData from './data.json'
const { confirm } = Modal

const { Option } = Select
const { TabPane } = Tabs

const mapStateToProps = ({ router, loginType }) => ({
  routerData: router,
  loginType,
})

const tableColumnsNew = [
  {
    title: 'Org#',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'OrgCode',
    dataIndex: 'orgCode',
    key: 'orgCode',
  },
  {
    title: 'Org Name',
    dataIndex: 'orgName',
    key: 'orgName',
  },
  {
    title: 'Plan',
    dataIndex: 'subcrPlan',
    key: 'subcrPlan',
  },
  {
    title: 'Industry',
    dataIndex: 'industry',
    key: 'industry',
  },
  {
    title: 'Location',
    dataIndex: 'businessLocation',
    key: 'businessLocation',
  },
  {
    title: 'Finacial Year',
    dataIndex: 'lastFinYear',
    key: 'lastFinYear',
  },
]

const AdminOrganizationComp = routerData => {
  const [quotations, getQuotations] = useState([])
  const [quotationList, getQuotationsList] = useState({})
  const [customers, getCustomers] = useState([])
  const [page, setpage] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      const result = await OrganizationService.organizationListAdmin()
      // console.log(result, 'ress')
      if (result?.data?.length) {
        result.data.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      getQuotations(result.data || [])
    }
    fetchData()
    // fetchCustData()
  }, [page])

  // console.log(routerData, 'router')
  const routeName = routerData.match.path.split('/')[2]
  return (
    <div>
      {routerData.loginType !== 'ADMIN' && (
        <div className="text-end">
          <Button type="primary" size="large" className="text-center w-10 mb-1" htmlType="submit">
            <strong>
              {' '}
              <Link to="/user/organization/create" className="text-white">
                Create {routeName}
              </Link>
            </strong>
          </Button>

          <hr />
        </div>
      )}
      <Table
        id="organizationTable"
        rowKey="id"
        columns={tableColumnsNew}
        dataSource={quotations}
        // pagination={false}
        pagination
        showSorterTooltip={false}
      />
    </div>
  )
}

export default connect()(AdminOrganizationComp)

