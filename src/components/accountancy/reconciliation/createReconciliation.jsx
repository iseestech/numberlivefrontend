import React, { useEffect, useRef, useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { Row, Col, Tabs, Button, Form, Select, Modal, message, Upload } from 'antd'
import { Link } from 'react-router-dom'
import store from 'store'
import moment from 'moment'
import BankService from '@/services/banking'
import sampleFile from './sampleEntry.xlsx'
import RightSideContent from './rightSideContent'
import './index.scss'
import TransactionList from './transactionList'

const { TabPane } = Tabs

const data = [
  { transaction: {}, transactionSuggest: {}, isOpen: false, id: 1 },
  { transaction: {}, transactionSuggest: {}, isOpen: false, id: 2 },
]

const CreateReconciliation = () => {
  const formRef = useRef()

  const [isShown, setIsShown] = useState(false)
  const [rowData, setRowData] = useState([])
  const [bankAccList, setBankAccList] = useState([])
  const [accId, setAccId] = useState()
  const [unMatchedData, setunMatchedData] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const orgDt = store.get('selectedOrg')

  const uploadProps = {
    name: 'file',
    action: `https://103.8.167.194:9090/isees/api/bankReconcil/uploadbankstatement?actId=${accId}&orgCode=${orgDt.orgCode}`,
    headers: {
      // authorization: 'authorization-text',
    },
    onChange: info => {
      // console.log("uploadBankStatement",info);
      if (info.file.status !== 'uploading') {
        // console.log("!uploading",info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
        fetchAccList(accId)
        setModalVisible(false)
      } else if (info.file.status === 'error') {
        // message.error(`${info.file.name} file upload failed.`)
        message.error(`${info.file.response}.`)
      }
    },
  }

  const handleClick = (e, close) => {
    // console.log('Click', e)
    const newList = rowData.map(item => {
      if (item.id === e && close !== 'close') {
        const updatedItem = {
          ...item,
          isOpen: !item.isOpen,
        }
        return updatedItem
      }

      return {
        ...item,
        isOpen: false,
      }
    })

    setRowData(newList)
  }

  const fetchAccList = async id => {
    const org = store.get('selectedOrg')

    const result = await BankService.reconcileUnmatchedList(org.orgCode, id)
    // console.log(result, 'result')
    // fetchData(id)
    setRowData(result?.LeftSide)
  }

  useEffect(() => {
    // fetchAccList()
  }, [])

  useEffect(() => {
    // console.log('working')
    const getBankData = async () => {
      const org = store.get('selectedOrg')
      const result = await BankService.bankList(org.orgCode, true)
      // console.log('result fetchData', result)
      setBankAccList(result || [])
      setAccId(result?.[0]?.accountid || '')
      formRef.current.setFieldsValue({ paymentAct: result?.[0]?.accountid || '' })
      fetchAccList(result?.[0]?.accountid)
    }
    getBankData()
  }, [])

  const handleAccChange = val => {
    // console.log(val, 'val')
    setAccId(val)
  }

  // const fetchData = async actId => {
  //   const org = store.get('selectedOrg')
  //   // const { match } = this.props

  //   const result = await BankService.transactionMatchedList(org.orgCode, actId, false, 'Debit')
  //   // console.log(result, 'ress111')

  //   setunMatchedData(result || [])
  //   // const csvDataVal = HelperFunction.getDataForCSV(result, unMatchedColumns)
  //   // setReportData({
  //   //   csvData: csvDataVal || [],
  //   //   apiData: result || [],
  //   //   columns: unMatchedColumns || [],
  //   //   fileName: 'Reconciliation Status' || '',
  //   //   // dateValue: dateValue || [],
  //   //   salesValue: 'Reconciliation Status' || '',
  //   //   flag: 'reconciliationStatusUM' || '',
  //   //   // footerRowData: footerRowData || [],
  //   // })
  // }

  const onFinish = values => {
    // console.log(values, 'values')
    fetchAccList(values?.paymentAct)

    // fetchData(values.paymentAct)
    // setAccId(values.paymentAct)
    // setDateValue(values.datewise);
  }

  const callback = key => {
    // console.log(key)
  }
  return (
    <div className="reconcile__form--layout">
      <div className="form__content--css1">
        <div className="top__section">
          <div className="row">
            <Col span={20} className="ps-2">
              <Form
                ref={formRef}
                // className="form__layout--css"
                layout="horizontal"
                // fields={defaultData}
                style={{ display: 'flex' }}
                // fields={defaultData}
                onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
              >
                <Form.Item
                  style={{ marginBottom: 0 }}
                  className="datewisefilter me-1"
                  name="paymentAct"
                  label="Select Account"
                  rules={[
                    {
                      required: true,
                      message: 'Please Select Account',
                    },
                  ]}
                >
                  <Select
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    defaultValue={accId}
                    value={accId}
                    style={{ width: '150px' }}
                    onChange={handleAccChange}
                  >
                    {bankAccList.map(x => {
                      return (
                        <Select.Option key={x.id} value={x.accountid}>
                          {x.actname}
                        </Select.Option>
                      )
                    })}
                  </Select>
                </Form.Item>
                <>
                  <Button type="primary" className="text-center me-1" htmlType="submit">
                    <strong>Apply</strong>
                  </Button>
                  {/* <Button type="default" className="text-center" onClick={resetFilter}>
              Reset
            </Button> */}
                </>
              </Form>
            </Col>
            <Col span={4} className="pe-2 text-end">
              <Button
                type="default"
                onClick={() => setModalVisible(true)}
                style={{
                  background: '#1890fff0',
                  color: 'white',
                }}
                icon={<UploadOutlined />}
              >
                Upload
              </Button>
            </Col>
            {/* <div className="col-sm-2 text-end">
            <div>
              <Button color="secondary" className="me-2 mb-2">
                <Dropdown
                  overlay={
                    <ExportOptions
                      handleRecieptModal={() => setShownReciept(!isShownReciept)}
                      csvData={reportData.csvData || []}
                      apiData={reportData.apiData || []}
                      columns={reportData.columns || []}
                      fileName={reportData.fileName || ''}
                      flag={reportData.flag || ''}
                    />
                  }
                  className="me-2 mb-2"
                >
                  <a className="ant-dropdown-link">
                    Export As <DownOutlined />
                  </a>
                </Dropdown>
              </Button>
            </div>
          </div> */}
          </div>
          {/* <hr style={{ margin: '0' }} /> */}
          <div className="page-header text-center">
            {/* <h4>Test</h4>  */}
            {/* <h3 className="reports-headerspacing"> Reconciliation Status </h3> */}
            {/* <span>Basis: Accrual</span> */}
            {/* <h5>
            <span>From</span>&nbsp;01 May 2021 <span>To</span>&nbsp;31 May 2021
          </h5> */}
            <div className="tags"> </div>
          </div>
        </div>
        <Row>
          {rowData?.length >= 1 ? (
            <Col span={15}>
              <Row className="leftside-item">
                <Col span={16} className="date-section">
                  &nbsp;
                </Col>
                <Col span={4} className="amount-section text-end">
                  <h6 className="pt-2"> Spent </h6>
                </Col>
                <Col span={4} className="text-end">
                  <h6 className="pt-2">Receive</h6>
                </Col>
              </Row>
            </Col>
          ) : (
            <Col
              span={24}
              className="p-5 text-center mt-2 mb-2"
              style={{ border: '1px solid #ccc' }}
            >
              <span>No data to display</span>
            </Col>
          )}
          {/* <Col></Col> */}
          <Col span={24}>
            {rowData?.map(item => {
              return (
                <Row className="transaction-item1">
                  <Col span={15} className="leftSideContent mb-2">
                    <Row className="leftside-item">
                      <Col span={6} className="date-section">
                        <h6 className="pt-2">{moment(item.date).format('DD MMM YYYY')}</h6>
                        {/* <p className="p-2">{item.particular}</p> */}
                      </Col>
                      <Col span={10} className="date-section">
                        {/* <h6 className="pt-2 text-center">
                          {moment(item.date).format('DD MMM YYYY')}
                        </h6> */}
                        <span className="p-2">{item.particular}</span>
                      </Col>
                      <Col span={4} className="amount-section text-end">
                        {/* <h6 className="pt-2 text-center"> Spent </h6> */}
                        <span className="p-2">{item.debit}</span>
                      </Col>
                      <Col span={4} className="text-end">
                        {/* <h6 className="pt-2 text-center">Receive</h6> */}
                        <span className="p-2">{item.credit}</span>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={1} className="okText">
                    {/* <Button>Ok</Button>  */}
                    &nbsp;
                  </Col>

                  <Col span={8} className="rightSideContent text-end">
                    <RightSideContent
                      handleClick={close => handleClick(item.id, close)}
                      isDebit={item.debit}
                    />
                  </Col>
                  <Col span={24} className="transactionList">
                    {item.isOpen && (
                      <TransactionList
                        handleClick={() => handleClick(item.id)}
                        fetchAccList={fetchAccList}
                        testData={isShown}
                        unMatchedData={unMatchedData}
                        accId={accId}
                        isDebit={item.debit}
                        amount={{
                          debit: item.debit,
                          credit: item.credit,
                        }}
                        leftSideObj={item}
                      />
                    )}
                  </Col>
                </Row>
              )
            })}
          </Col>
        </Row>
      </div>
      <hr className="m-0" />
      <div className="text-end pt-3">
        <Button
          type="default"
          // color="black"
          size="medium"
          className="text-center w-10 me-1"
          htmlType="submit"
        >
          <strong>
            <Link to="/report/reconciliation">Back</Link>
          </strong>
        </Button>
      </div>
      {modalVisible && (
        <Modal
          title={null}
          centered
          visible={modalVisible}
          onOk={() => setModalVisible(false)}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>

          <div style={{ marginTop: '15px', textDecoration: 'underline' }}>
            <a href={sampleFile} target="_blank" rel="noopener noreferrer">
              Sample File
            </a>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default CreateReconciliation

