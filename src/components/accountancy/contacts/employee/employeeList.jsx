import React, { useState, useEffect } from 'react'
import { Button, Table, Modal, Input, Row, Col } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import {
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons'
import EmployeeService from '@/services/employee'
import apiClient from '@/services/axios'
import tableData from './data.json'

const { confirm } = Modal
const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const EmployeeList = routerData => {
  const location = useLocation()
  const tableColumns = [
    // {
    //   title: '#',
    //   dataIndex: 'key',
    //   key: 'key',
    //   // render: (text, record, index) => index + 1,
    // },
    {
      title: 'Name',
      dataIndex: 'empFirstName',
      key: 'empFirstName',
      // sorter: (a, b) => a.empFirstName.localeCompare(b.empFirstName),

      // render: (text, record) => {
      //   // console.log(text, record)
      //   return `${record.empFirstName} ${record.empLastName}`
      // },
      render: (text, record) => {
        return (
          <Row>
            <Col span={22}>
              <div className="text-uppercase">
                <strong> {`${record.empFirstName} ${record.empLastName}`}</strong>
              </div>
              {/* <div>
                <span className="pe-2">&nbsp; &nbsp;&nbsp;</span>
                {record.company_name}
              </div> */}
              <div>
                <span className="pe-2">
                  <EnvironmentOutlined />
                </span>
                {record?.address} {record?.city && record?.city},{record?.state && record?.state},{' '}
                {record?.country && record?.country}-{record.zip_code}
              </div>
              {/* <div>
                <span className="pe-2">
                  <GlobalOutlined />
                </span>
                {record.website}
              </div> */}
              <div>
                <span className="pe-2">
                  <MailOutlined />
                </span>
                {record.email.toLowerCase()}
              </div>
              <div>
                <span className="pe-2">
                  <PhoneOutlined />
                </span>
                {record.phone_number}
              </div>
            </Col>
            <Col span={2} className="text-end">
              {' '}
              <Link to={`/contacts/employee/edit/${record.empId}`}>
                {' '}
                <span className="editIcon">
                  <EditOutlined />{' '}
                </span>{' '}
              </Link>{' '}
              <span>&nbsp;&nbsp;|</span>
              <button
                style={{ border: 'none', background: 'none' }}
                type="button"
                onClick={() => deleteCustomer(record.empId)}
              >
                <span className="deleteIcon">
                  <DeleteOutlined />
                </span>
              </button>
            </Col>
          </Row>
        )
      },
    },
    /*  {
      title: 'Company Name',
      dataIndex: 'company_name',
      key: 'company_name',
    }, */
    // {
    //   title: 'Email',
    //   dataIndex: 'email',
    //   key: 'email',
    //   sorter: (a, b) => a.email.localeCompare(b.email),
    // },
    // {
    //   title: 'Mobile No',
    //   dataIndex: 'phone_number',
    //   key: 'phone_number',
    // },
    // {
    //   title: 'Note',
    //   dataIndex: 'notes',
    //   key: 'notes',
    // },
    // {
    //   title: 'Created By',
    //   dataIndex: 'created_by_email',
    //   key: 'created_by_email',
    // },
    // {
    //   title: 'Actions',
    //   key: 'actions',
    //   render: (text, record) => {
    //     // console.log(text, record)
    //     return (
    //       <span>
    //         <Link to={`/contacts/employee/edit/${record.empId}`}>Edit |</Link>
    //         <button
    //           style={{ border: 'none', background: 'none' }}
    //           type="button"
    //           onClick={() => deleteCustomer(record.empId)}
    //         >
    //           Delete
    //         </button>
    //       </span>
    //     )
    //   },
    // },
  ]
  const [customers, getCustomers] = useState([])
  const [baseData, setBaseData] = useState([])
  const [page, setpage] = useState(1)
  useEffect(() => {
    // const result = await EmployeeService.customerList().then(res=> res)
    // getCustomers(result);

    const fetchData = async () => {
      const result = await EmployeeService.employeeList()
      if (result.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      getCustomers(result)
      setBaseData(result)
    }

    fetchData()
  }, [page])

  const getData = () => {
    const fetchData = async () => {
      const result = await EmployeeService.employeeList()
      getCustomers(result)
      setBaseData(result)
    }

    fetchData()
  }

  const deleteCustomer = id => {
    confirm({
      title: 'Do you Want to delete this item?',
      content: '',
      onOk() {
        const fetchData = async () => {
          const result = await EmployeeService.deleteActivity(id)
          getData()
        }
        fetchData()
      },
      onCancel() {
        // console.log('Cancel')
      },
    })
  }

  const onHandleChange = (e, value) => {
    // console.log(e.target.value, value)
  }

  const search = value => {
    const filterTableVal = baseData.filter(o =>
      Object.keys(o).some(k =>
        String(o[k])
          .toLowerCase()
          .includes(value.toLowerCase()),
      ),
    )
    getCustomers(filterTableVal)
  }

  // const routeName = routerData?.match?.path?.split('/')[2]
  const routeName = location?.pathname?.split('/')[2]
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }} className="mb-4">
        <div>
          <Input.Search placeholder="Search by..." enterButton onSearch={search} />
        </div>
        <div className="text-end">
          <Button type="primary" className="text-center" htmlType="submit">
            <Link
              to={`/contacts/${routeName?.substring(0, routeName?.length - 1)}/create`}
              className="text-white"
            >
              Create
            </Link>
          </Button>
        </div>
      </div>
      <Table
        id="table__layout--css-v2"
        rowKey="empId"
        columns={tableColumns}
        dataSource={customers}
        pagination
        showSorterTooltip={false}
      />
    </div>
  )
}

export default connect(mapStateToProps)(EmployeeList)

