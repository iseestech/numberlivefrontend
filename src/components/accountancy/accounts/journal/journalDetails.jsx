import React, { useState, useEffect } from 'react'
import { DownOutlined } from '@ant-design/icons'
import {
  Menu,
  Dropdown,
  Form,
  Table,
  notification,
  Modal,
  Button,
  DatePicker,
  Row,
  Col,
} from 'antd'
// import { Button } from 'reactstrap'
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
import WithRouter from '@/WithRouter'
// import CreateProductModal from './createProductModal'
import './index.scss'
import DisplayJournal from '@/components/accountancy/common/DisplayJournal'

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
  const [isModalVisible, setIsModalVisible] = useState(false)

  // const routeName = routerData.match.path.split('/')[2]

  const [quoteData, getQuotation] = useState([])
  const { id: quoteId } = routerData.params

  const showModal = () => {
    setIsModalVisible(true)
  }

  // const handleOk = () => {
  //   setIsModalVisible(false)
  // }

  const handleCancel = () => {
    setIsModalVisible(false)
  }
  useEffect(() => {
    if (quoteId) {
      const fetchData = async () => {
        const result = await JournalService.getJournalById(quoteId)
        getQuotation(result ? result.data : [])

        const csvDataVal = HelperFunction.getDataForCSV(
          result.data ? result.data.journelActDto : [],
          columnData,
        )
        setCSVData(csvDataVal || [])
      }
      fetchData()
    }
  }, [quoteId])

  // const approveInvoice = () => {
  //   const { customerId, invoiceNo } = quoteData
  //   const data = `customerId=${customerId}&purchaseId=${quoteId}&status=true`
  //   const fetchData = async () => {
  //     const result = await PurchaseService.approveOrder(data, 'post')
  //     // console.log(result, 'result')
  //     history.push('/purchase/invoices')
  //     // getQuotation(result ? result.data : [])
  //   }
  //   fetchData()
  // }

  const menu = (
    <Menu>
      {/* <Menu.Item>
        <a target="_blank" rel="noopener noreferrer">
          Mark as Inactive
        </a>
      </Menu.Item> */}
      {/* <Menu.Item>
        <a target="_blank" rel="noopener noreferrer">
          Delete
        </a>
      </Menu.Item> */}
      <Menu.Item>
        {' '}
        <Link to={`/accounts/journal/edit/${quoteId}`}>Edit</Link>
      </Menu.Item>
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

  const convertToInvoice = () => {
    const org = store.get('selectedOrg')
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

    const fetchData = async () => {
      const result = await JournalService.convertToReverse({
        orgCode: org.orgCode,
        journelNo: quoteId,
        revjournelDate: moment(document.getElementById('reverseDate').value).format('MM/DD/YYYY'),
      })
      // console.log(result, 'result')
      if (result.statusCode === 200) {
        setIsModalVisible(false)
        notification.success({
          message: 'Success',
          description: 'Successfully converted.',
          duration: 6,
        })
        history.push('/accounts/journals')
      }
    }
    return fetchData()
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
    isJv,
  } = quoteData

  return (
    <div className="details_layout--page">
      <Row className="mb-3 details__header--css">
        <Col span={12} style={{ fontSize: '18px' }}>
          Journal: {quoteId}
        </Col>
        {/* <Link to="/products-and-services/products" style={{ textTransform: 'capitalize' }}>
          Back
        </Link> */}
        <Col span={12} className="text-end">
          <Button type="default" className="text-center me-2" htmlType="submit">
            <Link to="/accounts/journals">Back</Link>
          </Button>
          {!isJv && (
            <Button color="success" onClick={showModal} className="me-2 mb-2">
              Reverse Journal
              {/* convertToInvoice */}
            </Button>
          )}
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

          {!isJv && (
            <Button color="secondary" outline className="me-2 mb-2">
              <Dropdown trigger={["click"]} popupRender={()=>menu} className="me-2 mb-2">
                <a className="ant-dropdown-link">
                  Options <DownOutlined />
                </a>
              </Dropdown>
            </Button>
          )}
        </Col>
      </Row>
      <Row className="details__page--content">
        <Col span={24} className="fs-13 text-uppercase mb-3">
          <span className="bulletIcon">Basic Information</span>
        </Col>

        <Col span={6} className="pb-2">
          <div>
            <strong>Date:- </strong>
          </div>

          <span>{HelperFunction.dateFormatted(journelDate)}</span>
        </Col>

        <Col span={6} className="pb-2">
          <div>
            <strong>Journal#:- </strong>
          </div>
          <span>{journelNo}</span>{' '}
        </Col>

        <Col span={6} className="pb-2">
          <div>
            <strong>Currency:- </strong>
          </div>
          <span>{currency}</span>{' '}
        </Col>

        <Col span={6} className="pb-2">
          <div>
            {' '}
            <strong>Reference#- </strong>
          </div>
          <span>{reference}</span>{' '}
        </Col>
        <Col span={24}>
          <hr />
        </Col>
        <Col span={24} className="fs-13 text-uppercase mb-3">
          <span className="bulletIcon">List</span>
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
        {/* <div className="col-md-3">
          <div>
            <br />
            <div>
              Subtotal: <strong>{subTotal}</strong>
            </div>
            <div>
              Total Sales Tax 0%: <strong>0.00</strong>
            </div>
            <hr style={{ margin: '5px 0' }} />
            <div>
              <h3>
                <strong>Total : </strong>
                <strong>{total}</strong>
              </h3>
            </div>
            <hr style={{ margin: '5px 0', borderBottom: '10px' }} />
          </div>
        </div> */}
        {/* <div className="col-md-6">
          <div className="row">
            <div className="col-sm-5">Sub Total</div>
            <div className="col-sm-3">{creditSubTotal || 0.0}</div>
            <div className="col-sm-3">{debitSubTotal || 0.0}</div>
          </div>
          <div className="row">
            <div className="col-sm-5">Total</div>
            <div className="col-sm-3">{creditTotal || 0.0}</div>
            <div className="col-sm-3">{debitTotal || 0.0}</div>
          </div>
          <div className="row" style={{ color: 'red' }}>
            <div className="col-sm-5">Difference</div>
            <div className="col-sm-3">0.00</div>
            <div className="col-sm-3">0.00</div>
          </div>
        </div> */}
        <Col span={24}>
          <hr />
        </Col>
        <Col span={24} className="fs-13 text-uppercase mb-3">
          <span className="bulletIcon">Notes</span>
        </Col>
        <Col span={14}>
          <span>{notes}</span>
        </Col>
      </Row>
      <div>
        <DisplayJournal trId={quoteId} formName="journal" isJournal={false} />
      </div>

      <CreateNew visible={isShown} handleCreateModal={handleCreateModal} />
      <SendEmail visible={isShownEmail} handleSendModal={handleSendModal} />
      {/* <ReceiptPrint
        visible={isShownReciept}
        handleRecieptModal={handleRecieptModal}
        quoteData={quoteData}
      /> */}

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
          salesValue="Journal Receipt"
          flag="JournalReceipt"
        />
      )}

      {isModalVisible && (
        <Modal
          title="Create Reverse Jounal"
          open={isModalVisible}
          onOk={convertToInvoice}
          onCancel={handleCancel}
          okText="Create"
        >
          <Form.Item name="reverseDate" id="reverseDate" label="Reverse Journal Date">
            <DatePicker
              style={{ width: '100%' }}
              format="DD MMM YYYY"
              disabledDate={disabledDate}
            />
          </Form.Item>
        </Modal>
      )}
    </div>
  )
}

export default connect()(WithRouter(JournalDetails))

