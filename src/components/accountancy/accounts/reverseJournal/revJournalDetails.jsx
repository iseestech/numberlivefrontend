import React, { useState, useEffect } from 'react'
import { DownOutlined } from '@ant-design/icons'
import {
  Menu,
  Dropdown,
  Table,
  Form,
  Select,
  Button,
  Input,
  DatePicker,
  notification,
  Row,
  Col,
} from 'antd'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import JournalService from '@/services/journal'
import CreateNew from '@/components/accountancy/common/createNew'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import HelperFunction from '@/services/helper'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import store from 'store'

import SendEmail from '@/components/accountancy/common/sendEmail'
import ReceiptPrint from '@/components/accountancy/common/receipt'
import { history } from '@/main'
import moment from 'moment'
// import CreateProductModal from './createProductModal'
import './index.scss'
import DisplayJournal from '@/components/accountancy/common/DisplayJournal'
import WithRouter from "@/WithRouter"
const { Option } = Select

const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const columnData = [
  {
    title: '#',
    dataIndex: 'key',
    key: 'key',
    render: (text, record, index) => index + 1,
  },
  {
    title: 'Account',
    dataIndex: 'accountName',
    name: 'accountName',
    // className: 'drag-visible',
    responsive: ['xs', 'sm'],
  },
  {
    title: 'Description',
    dataIndex: 'description',
    name: 'description',
    responsive: ['xs', 'sm'],
  },
  // {
  //   title: 'Contact',
  //   dataIndex: 'contact',
  //   name: 'contact',
  //   responsive: ['xs', 'sm'],
  //   className: 'contacts',
  //   style: { with: '25%' },
  // },
  {
    title: 'Debit',
    dataIndex: 'debit',
    name: 'debit',
    responsive: ['xs', 'sm'],
  },
  {
    title: 'Credit',
    dataIndex: 'credit',
    responsive: ['xs', 'sm'],
    name: 'credit',
  },
]
const dataSource = [
  {
    key: '1',
    item: '12',
    quantity: '1',
    description: 'test',
    index: 1,
    unitPrice: '2',
    discount: '5',
    account: '',
    taxRate: '2',
    amount: '11',
  },
]

const JournalDetails = routerData => {
  const [isVisible, setVisible] = useState(false)
  const [isShown, setShown] = useState(false)
  const [isShownEmail, setShownEmail] = useState(false)
  const [isShownReciept, setShownReciept] = useState(false)
  const [csvData, setCSVData] = useState([])
  const [journalList, setJournalList] = useState([])
  const [selectedJournal, setJournal] = useState('')

  const org = store.get('selectedOrg')

  // console.log(routerData.match.path.split('/'), 'router')
  // const routeName = routerData.match.path.split('/')[2]

  const [quoteData, getQuotation] = useState([])
  const { id: quoteId } = routerData.params

  useEffect(() => {
    if (quoteId) {
      console.log(quoteId, 'quoteId')
      const fetchData = async () => {
        const result = await JournalService.revJournalById({
          orgCode: org.orgCode,
          journalNo: quoteId,
        })
        // console.log(result, 'result')
        getQuotation(result?.data || [])

        const csvDataVal = HelperFunction.getDataForCSV(
          result ? result?.data?.journelActDto : [],
          columnData,
        )
        // console.log(csvDataVal, 'csvDataVal')
        setCSVData(csvDataVal || [])
      }
      fetchData()
    }
  }, [quoteId])

  useEffect(() => {
    const fetchData = async () => {
      const result = await JournalService.journalListforRevJournal({ orgCode: org.orgCode })

      // getQuotation(result ? result.data : [])
      setJournalList(result || [])
      const csvDataVal = HelperFunction.getDataForCSV(
        result.data ? result.data.journelActDto : [],
        columnData,
      )
      // console.log(csvDataVal, 'csvDataVal')
      // setCSVData(csvDataVal || [])
    }
    fetchData()
  }, [])

  const handleChange = async e => {
    const obj = {
      journelNo: e,
      orgCode: org.orgCode,
    }
    // const fetchData = async () => {
    const result = await JournalService.journalDataById(obj)
    // console.log(result, 'result')
    getQuotation({
      ...result.data,
      journelActDto: result?.journelActDto || [],
    })
    setJournal(e)
    const csvDataVal = HelperFunction.getDataForCSV(
      result.data ? result.data.journelActDto : [],
      columnData,
    )
    // console.log(csvDataVal, 'csvDataVal')
    // setCSVData(csvDataVal || [])
    // }
    // fetchData()
  }

  const createJournal = async e => {
    // console.log('createJournal', quoteData)
    if (
      document.getElementById('reverseDate') &&
      document.getElementById('reverseDate').value === ''
    ) {
      notification.warning({
        message: 'Warning',
        description: 'Please enter date',
      })
      return false
    }
    // const obj = {
    //   journelNo: e,
    //   orgCode: org.orgCode,
    // }
    const data = {
      ...quoteData,
      revjournelDate: moment(document.getElementById('reverseDate').value).format('MM/DD/YYYY'),
    }
    // console.log(data, 'dass')
    const result = await JournalService.createRevJournal(data, 'post')
    // console.log(result, 'result')
    if (result.status === 200) {
      history.push('/accounts/rev-journals')
    }
    return true
  }

  const deleteRevJournal = async () => {
    const result = await JournalService.deleteRevJournal(quoteId)
    // console.log(result, 'result')
    if (result.statusCode === 200) {
      history.push('/accounts/rev-journals')
    }
  }
  const menu = (
    <Menu>
      <Menu.Item onClick={deleteRevJournal}>Delete</Menu.Item>
    </Menu>
  )

  const handleDetails = () => {
    setVisible(!isVisible)
  }
  const handleCreateModal = () => {
    setShown(!isShown)
  }
  const handleSendModal = () => {
    setShownEmail(!isShownEmail)
  }
  const handleRecieptModal = () => {
    setShownReciept(!isShownReciept)
  }

  const disabledDate = current => {
    return current && current < moment(quoteData.journelDate).endOf('day')
  }

  const {
    journelActDto,
    journelDate,
    currency,
    differnce,
    journelNo,
    journelType,
    notes,
    reference,
    subTotal,
    total,
    creditSubTotal,
    creditTotal,
    debitSubTotal,
    debitTotal,
    revjournelDate,
  } = quoteData

  // console.log(quoteData, 'quoteDataquoteDataquoteData')
  return (
    <div className="details_layout--page">
      <Row className="mb-3 details__header--css">
        <Col span={4} style={{ fontSize: '18px' }}>
          {quoteId ? <span>Edit: {quoteId}</span> : 'New Reverse Journal: '}
        </Col>
        <Col span={8} style={{ fontSize: '18px' }}>
          {!quoteId && (
            <Form
              layout="horizontal"
              // fields={defaultData}
              style={{ display: 'flex' }}
              // fields={defaultData}
              // onFinish={onFinish}
              // onFinishFailed={onFinishFailed}
            >
              <Form.Item
                style={{ marginBottom: 0 }}
                className="datewisefilter me-1"
                name="paymentAct"
                label="Select Jornal"
                // rules={[
                //   {
                //     required: true,
                //     message: 'Please Select Date!',
                //   },
                // ]}
              >
                <Select
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  value=""
                  style={{ width: '150px' }}
                  onChange={handleChange}
                >
                  {journalList.map(x => {
                    return (
                      <Select.Option key={x.journel_no} value={x.journel_no}>
                        {x.journel_no}
                      </Select.Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </Form>
          )}
        </Col>
        <Col span={12} className="text-end">
          <Button type="default" className="text-center me-2" htmlType="submit">
            <Link to="/accounts/rev-journals">Back</Link>
          </Button>
          {quoteId && (
            <>
              <Button color="secondary" className="me-2 mb-2">
                <Dropdown
                  trigger={["click"]}
                  popupRender={() => <ExportOptions
                      handleRecieptModal={handleRecieptModal}
                      csvData={csvData}
                      apiData={journelActDto}
                      columns={columnData}
                      fileName="Journal Details"
                    />
                  }
                  className="me-2 mb-2"
                >
                  <a className="ant-dropdown-link">
                    Export As <DownOutlined />
                  </a>
                </Dropdown>
              </Button>

              <Button color="secondary" outline className="me-2 mb-2">
                <Dropdown trigger={["click"]} popupRender={() => menu} className="me-2 mb-2">
                  <a className="ant-dropdown-link">
                    Options <DownOutlined />
                  </a>
                </Dropdown>
              </Button>
            </>
          )}
        </Col>
      </Row>
      {(selectedJournal.length > 0 || quoteId?.length > 0) && (
        <div className="details__page--content pb-0">
          <Row>
            <Col span={24} className="fs-13 text-uppercase mb-3">
              <span className="bulletIcon">Basic Information</span>
            </Col>

            <Col span={24} className="pb-2">
              <div className="details__page--item">
                <strong>Date </strong>
                {!quoteId ? (
                  <span>
                    <DatePicker format="DD MMM YYYY" id="reverseDate" disabledDate={disabledDate} />
                  </span>
                ) : (
                  <span>{HelperFunction.dateFormatted(revjournelDate)}</span>
                )}
              </div>
            </Col>

            <Col span={24} className="pb-2">
              <div className="details__page--item">
                <strong>Journal Date </strong>

                <span>{HelperFunction.dateFormatted(journelDate)}</span>
              </div>
            </Col>

            <Col span={24} className="pb-2">
              <div className="details__page--item">
                <strong>Journal# </strong>
                <span>{journelNo}</span>{' '}
              </div>
            </Col>
            <Col span={24} className="pb-2">
              <div className="details__page--item">
                <strong>Currency </strong>
                <span>{currency}</span>{' '}
              </div>
            </Col>
            <Col span={24} className="pb-2">
              <div className="details__page--item">
                <strong>Reference </strong>
                <span>{reference}</span>{' '}
              </div>
            </Col>
            <Col span={24}>
              <hr />
            </Col>
            <Col span={24} className="fs-13 text-uppercase mb-3">
              <span className="bulletIcon">Accounts</span>
            </Col>
            <Col span={24}>
              <Table
                className="journalDetails details__table--field"
                pagination={false}
                dataSource={journelActDto}
                columns={columnData}
                rowKey="id"
                scroll={{ x: 691 }}
                summary={pageData => {
                  const credit = pageData.reduce((sum, record) => sum + record.credit, 0)
                  const debit = pageData.reduce((sum, record) => sum + record.debit, 0)

                  return (
                    <>
                      <Table.Summary.Row
                        className="ant-table-footer"
                        style={{
                          fontWeight: 'bold',
                        }}
                      >
                        <Table.Summary.Cell>Total</Table.Summary.Cell>
                        <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                        <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                        <Table.Summary.Cell>{credit}</Table.Summary.Cell>
                        <Table.Summary.Cell>{debit}</Table.Summary.Cell>
                      </Table.Summary.Row>
                    </>
                  )
                }}
              />
            </Col>
            <Col span={24}>
              <hr />
            </Col>
            <Col span={24} className="fs-13 text-uppercase mb-3">
              <span className="bulletIcon">Notes</span>
            </Col>
            <Col span={16}>
              <span>{notes}</span>
            </Col>
          </Row>
          <Row className="bg-white pb-3 text-end" style={{ justifyContent: 'end' }}>
            {' '}
            <Col span={24}>
              <hr />
            </Col>
            {!quoteId && (
              <div className="text-end">
                <Button type="default" className="text-center me-2" htmlType="submit">
                  <Link to="/accounts/rev-journals">Back</Link>
                </Button>
                <Button type="primary" className="text-center me-3" onClick={createJournal}>
                  {/* <ReloadOutlined /> */}
                  Create
                </Button>
              </div>
            )}
          </Row>
        </div>
      )}

      {/* <div>
        <hr />
        <DisplayJournal trId={quoteId} formName="journal" isJournal={false} />
      </div> */}

      {isShownReciept && (
        <OtherPrimaryReport
          visible={isShownReciept}
          handleRecieptModal={() => setShownReciept(!isShownReciept)}
          quoteData={journelActDto || []}
          detailsInfo={{
            Date: HelperFunction.dateFormatted(journelDate),
            'Journal#': journelNo,
            Currency: currency,
            'Reference#': reference,
          }}
          salesValue="Reverse Journal Receipt"
          flag="JournalReceipt"
        />
      )}
    </div>
  )
}

export default connect()(WithRouter(JournalDetails))

