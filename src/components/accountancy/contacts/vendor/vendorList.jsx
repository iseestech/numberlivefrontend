import React, { useState, useEffect } from 'react'
import { Button, Table, Modal, Input, notification, Row, Col } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import {
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons'
import { connect } from 'react-redux'
import VendorService from '@/services/vendor'

const { confirm } = Modal
const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const VendorList = routerData => {
  const location = useLocation()
  const tableColumns = [
    // {
    //   title: '#',
    //   dataIndex: 'key',
    //   key: 'key',
    // },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (text, record) => {
        const add = record || null
        return (
          <Row>
            <Col span={22}>
              <div className="text-uppercase">
                <strong> {record.companyName}</strong>
              </div>
              <div>
                <span className="pe-2">&nbsp; &nbsp;&nbsp;</span>
                <b>{`${record.firstName} ${record.lastName}`}</b>
              </div>
              <div>
                <span className="pe-2">
                  <EnvironmentOutlined />
                </span>
                {add?.address1 && add?.address1} {add?.city && add?.city} {add?.state && add?.state}{' '}
                {add?.country && add?.country} {add?.zipCode && add?.zipCode}
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
                {record.vendorEmail.toLowerCase()}
              </div>
              <div>
                <span className="pe-2">
                  <PhoneOutlined />
                </span>
                {record.ven_mobile}
                {/* / {record.ven_phone} */}
              </div>
            </Col>
            <Col span={2} className="text-end">
              {' '}
              <Link to={`/contacts/vendor/edit/${record.id}`}>
                {' '}
                <span className="editIcon">
                  <EditOutlined />{' '}
                </span>{' '}
              </Link>{' '}
              <span>&nbsp;|</span>
              <button
                style={{ border: 'none', background: 'none' }}
                type="button"
                onClick={() => deleteCustomer(record.id)}
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
    //   title: 'First Name',
    //   dataIndex: 'firstName',
    //   key: 'firstName',
    //   sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    // },
    // {
    //   title: 'Last Name',
    //   dataIndex: 'lastName',
    //   key: 'lastName',
    //   sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    // },
    // {
    //   title: 'Display Name',
    //   dataIndex: 'vendorDisplayName',
    //   key: 'vendorDisplayName',
    //   sorter: (a, b) => a.vendorDisplayName.localeCompare(b.vendorDisplayName),
    // },
    // {
    //   title: 'Email',
    //   dataIndex: 'vendorEmail',
    //   key: 'vendorEmail',
    //   sorter: (a, b) => a.vendorEmail.localeCompare(b.vendorEmail),
    // },
    // {
    //   title: 'Mobile No',
    //   dataIndex: 'ven_mobile',
    //   key: 'ven_mobile',
    // },
    // {
    //   title: 'Actions',
    //   key: 'actions',
    //   render: (text, record) => {
    //     // console.log(text, record)
    //     return (
    //       <span>
    //         <Link to={`/contacts/vendor/edit/${record.id}`}>Edit</Link> |
    //         <button
    //           style={{ border: 'none', background: 'none' }}
    //           type="button"
    //           onClick={() => deleteCustomer(record.id)}
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
    // const result = await VendorService.customerList().then(res=> res)
    // getCustomers(result);

    const fetchData = async () => {
      const result = await VendorService.customerList()
      if (result && result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      getCustomers(result || [])
      setBaseData(result || [])
    }

    fetchData()
  }, [page])

  const getData = () => {
    const fetchData = async () => {
      const result = await VendorService.customerList()
      getCustomers(result || [])
      setBaseData(result || [])
    }
    fetchData()
  }

  const deleteCustomer = id => {
    confirm({
      title: 'Do you Want to delete this item?',
      content: '',
      onOk() {
        const fetchData = async () => {
          const result = await VendorService.deleteActivity(id)
          if (result && result.statusCode === 409) {
            notification.warning({
              message: 'Warning',
              description: result.message,
              duration: 5,
            })
          } else {
            getData()
          }
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
          <Input.Search allowClear placeholder="Search by..." enterButton onSearch={search} />
        </div>
        <div className="text-end">
          {/* <Button type="primary" size="large" className="text-center w-10 mb-1" htmlType="submit">
          <strong>Import</strong>
        </Button>
        <Button type="primary" size="large" className="text-center w-10 mb-1" htmlType="submit">
          <strong>Export</strong>
        </Button> */}
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
        rowKey="id"
        columns={tableColumns}
        dataSource={customers}
        pagination
        showSorterTooltip={false}
      />
    </div>
  )
}


export default connect(mapStateToProps)(VendorList)