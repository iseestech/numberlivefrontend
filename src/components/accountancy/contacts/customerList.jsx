import React, { useState, useEffect } from 'react'
import { Button, Table, Modal, Input, notification, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import {
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons'
import { connect } from 'react-redux'
import CustomerService from '@/services/customer'
import { useLocation } from 'react-router-dom'
const { confirm } = Modal
const mapStateToProps = (state) => {
  console.log('Redux state:', state)
  return {
    routerData: state.router
  }
}
const CustomerList = routerData => {
  
const location = useLocation()
  const tableColumns = [
    // {
    //   title: '#',
    //   dataIndex: 'key',
    //   key: 'key',
    //   // render: (val) => val,
    // },
    {
      title: 'Name',
      dataIndex: 'customer_fname',
      key: 'customer_fname',
      sorter: (a, b) => a.customer_fname.localeCompare(b.customer_fname),
      render: (text, record) => {
        return (
          <Row>
            <Col span={22}>
              <div className="text-uppercase">
                <strong> {record.company_name}</strong>
              </div>
              <div>
                <span className="pe-2">&nbsp; &nbsp;&nbsp;</span>
                <b>{`${record.customer_fname} ${record.customer_lname}`}</b>
              </div>
              <div>
                <span className="pe-2">
                  <EnvironmentOutlined />
                </span>
                {`${record.address}, ${record.city} ${record.state}, ${record.country}-${record.zip_code}.`}
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
                {record.customer_email.toLowerCase()}
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
              <Link to={`/contacts/customer/edit/${record.customer_id}`}>
                <span className="editIcon">
                  <EditOutlined />{' '}
                </span>{' '}
              </Link>
              <span>&nbsp;|</span>
              <button
                style={{ border: 'none', background: 'none' }}
                type="button"
                onClick={() => deleteCustomer(record.customer_id)}
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
    // {
    //   title: 'Company Name',
    //   dataIndex: 'company_name',
    //   key: 'company_name',
    //   sorter: (a, b) => a.company_name.localeCompare(b.company_name),
    // },
    // {
    //   title: 'Email',
    //   dataIndex: 'customer_email',
    //   key: 'customer_email',
    //   sorter: (a, b) => a.customer_email.localeCompare(b.customer_email),
    // },
    // {
    //   title: 'Mobile No',
    //   dataIndex: 'phone_number',
    //   key: 'phone_number',
    // },
    // {
    //   title: 'Actions',
    //   key: 'actions',
    //   render: (text, record) => {
    //     return (
    //       <span>
    //         <Link to={`/contacts/customer/edit/${record.customer_id}`}>Edit |</Link>
    //         <button
    //           style={{ border: 'none', background: 'none' }}
    //           type="button"
    //           onClick={() => deleteCustomer(record.customer_id)}
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
    // const result = await CustomerService.customerList().then(res=> res)
    // getCustomers(result);

    const fetchData = async () => {
      const result = await CustomerService.customerList()
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
      const result = await CustomerService.customerList()
      getCustomers(result)
      setBaseData(result)
    }

    fetchData()
  }

  const deleteCustomer = id => {
    confirm({
      title: 'Do you want to delete this item?',
      content: '',
      onOk() {
        const fetchData = async () => {
          const result = await CustomerService.deleteActivity(id)
          if (result.statusCode === 409) {
            notification.warning({
              message: 'Warning',
              description: result.message,
              duration: 5,
            })
          }
          if (result.statusCode === 200) {
            notification.success({
              message: 'Success',
              description: 'Record deleted successfully!',
              duration: 5,
            })
            getData()
          }
        }
        fetchData()
      },
      onCancel() {},
    })
  }
  const search = value => {
    console.log(value, 'value')
    const filterTableVal = baseData.filter(o =>
      Object.keys(o).some(k =>
        String(o[k])
          .toLowerCase()
          .includes(value.toLowerCase()),
      ),
    )

    console.log(filterTableVal, 'filterTableVal')
    getCustomers(filterTableVal)
  }

  const routeName = location?.pathname?.split('/')[2]
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }} className="mb-4">
        <div>
          <Input.Search allowClear placeholder="Search by..." enterButton onSearch={search} />
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
        rowKey="customer_id"
        columns={tableColumns}
        dataSource={customers}
        pagination
        showSorterTooltip={false}
      />
    </div>
  )
}

export default connect(mapStateToProps)(CustomerList)