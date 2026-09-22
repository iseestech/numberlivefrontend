import { Table, Row, Col, Button, notification } from 'antd'
import React, { useState, useEffect } from 'react'
import moment from 'moment'
import store from 'store'
import BankService from '@/services/banking'

let totalAmt = {
  debit: 0,
  credit: 0,
}

const tableCol = [
  {
    title: 'Date',
    dataIndex: 'date',
    // width: 30,
    className: 'date--selected',
    responsive: ['xs', 'sm'],
    render: record => moment(record.date).format('DD MMM YYYY'),
  },
  {
    title: 'Name',
    dataIndex: 'actName',
    name: 'acactNamet_name',
    responsive: ['xs', 'sm'],
  },
  {
    title: 'Reference',
    dataIndex: 'Reference',
    // name: 'name',
    responsive: ['xs', 'sm'],
  },
  {
    title: 'Spent',
    dataIndex: 'withdrawals',
    name: 'withdrawals',
    responsive: ['xs', 'sm'],
    className: 'text-end',
  },
  {
    title: 'Recieve',
    dataIndex: 'deposits',
    name: 'deposits',
    className: 'text-end',

    responsive: ['xs', 'sm'],
  },
]

const data = [
  { act_name: 'Abc', ID: '1', key: '1' },
  { act_name: 'xyz', ID: '3', key: '2' },
]
const TransactionList = props => {
  // console.log('isShown', props)
  const { isShown, accId, isDebit, amount, handleClick, fetchAccList, leftSideObj } = props
  const [selectedRow, setSelectedRow] = useState([])
  const [unMatchedData, setunMatchedData] = useState([])

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      setSelectedRow(selectedRows)
    },
    getCheckboxProps: record => ({
      ID: record.ID,
    }),
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const org = store.get('selectedOrg')
    // const { match } = this.props
    let type = 'Debit'
    if (!isDebit) {
      type = 'Credit'
    }
    const result = await BankService.transactionMatchedList(org.orgCode, accId, false, type)
    // console.log(result, 'isDebit', isDebit)

    setunMatchedData(result || [])
    // const csvDataVal = HelperFunction.getDataForCSV(result, unMatchedColumns)
    // setReportData({
    //   csvData: csvDataVal || [],
    //   apiData: result || [],
    //   columns: unMatchedColumns || [],
    //   fileName: 'Reconciliation Status' || '',
    //   // dateValue: dateValue || [],
    //   salesValue: 'Reconciliation Status' || '',
    //   flag: 'reconciliationStatusUM' || '',
    //   // footerRowData: footerRowData || [],
    // })
  }

  const reconcileTransaction = async () => {
    let value = amount.debit
    let key = 'debit'
    if (!isDebit) {
      value = amount.credit
      key = 'credit'
    }
    // console.log(value, 'value', totalAmt)
    if (value === totalAmt[key]) {
      // const handleDate = async (e, item) => {
      // console.log(e.target.value, item)
      const obj = {
        // transactionId: selectedRow[0].transactionId,
        bankDate: moment(leftSideObj.date).format('MM/DD/YYYY'),
        sId: leftSideObj.id,
      }
      const result = await BankService.bankReconcile(obj, { transactions: selectedRow })
      if (result.status === 200) {
        notification.success({
          message: 'Success',
          description: `Successfully matched`,
          duration: 6,
        })
        fetchAccList(accId)
      }
    } else {
      notification.error({
        message: 'Error',
        description: `Please check selected transaction, amount should be ${value}`,
        duration: 6,
      })
    }
  }

  return (
    <div className={isShown ? 'isActive' : 'not-active'}>
      <Row>
        <Col span={24} className="fs-13 text-uppercase mb-3 ps-3">
          <span className="bulletIcon">Find and match transactions</span>
        </Col>
        <Col span={24}>
          <Table
            className="tableForm reConform__table--field"
            pagination={false}
            // scroll={{ y: 300 }}
            key="ID"
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            dataSource={unMatchedData}
            columns={tableCol}
          />
        </Col>
        <Col span={24} className="p-1" style={{ background: '#f7f7f7' }} />

        <Col span={24} className="matched__section">
          <Col span={24} className="fs-13 text-uppercase mb-2 mt-2" style={{ paddingLeft: '10px' }}>
            <span className="bulletIcon"> Matched transactions</span>
          </Col>
          <Table
            className="tableForm reConform__table--field selTrList"
            pagination={false}
            // scroll={{ y: 300 }}
            // key="id"
            // rowSelection={{
            //   type: 'checkbox',
            //   ...rowSelection,
            // }}
            // className="tableForm"
            dataSource={selectedRow}
            columns={tableCol}
            summary={pageData => {
              const credit = pageData.reduce((sum, record) => sum + record?.deposits, 0)
              const debit = pageData.reduce((sum, record) => sum + record?.withdrawals, 0)
              totalAmt = {
                credit,
                debit,
              }
              return (
                <>
                  <Table.Summary.Row
                    className="ant-table-footer"
                    style={{
                      fontWeight: 'bold',
                      // textAlign:"left"
                    }}
                  >
                    <Table.Summary.Cell className="text-start">Subtotal</Table.Summary.Cell>
                    <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                    <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                    <Table.Summary.Cell className="pe-2">{debit}</Table.Summary.Cell>
                    <Table.Summary.Cell className="pe-2">
                      <span>{credit}</span>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row
                    className="ant-table-footer"
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    <Table.Summary.Cell className="text-start">Total</Table.Summary.Cell>
                    <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                    <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                    <Table.Summary.Cell className="pe-2">{debit}</Table.Summary.Cell>
                    <Table.Summary.Cell className="pe-2">
                      <span>{credit}</span>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              )
            }}
          />
        </Col>
        {/* <Col span={24} className="p-3">
          <h6>Sum of Selected transaction</h6>
          <hr />
           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal</span>
            <span>500</span>
          </div> 

          <Row>
            <Col span={12}>
              <span>Subtotal</span>
            </Col>
            <Col span={12}>
              <span>500</span>
            </Col>
          </Row>
          <hr />
        </Col>
        <Col span={24} style={{ display: 'flex', justifyContent: 'end' }}>
          <span>500</span>
        </Col> */}
        <hr />
        <Col span={24} className="mt-3" style={{ display: 'flex', justifyContent: 'end' }}>
          <Button type="default" onClick={handleClick} className="me-2">
            Cancel
          </Button>
          <Button
            // type="primary"
            className="me-3"
            onClick={reconcileTransaction}
            style={{ background: '#28a745', color: '#fff' }}
          >
            Reconcile
          </Button>
        </Col>
        {/* <Col span={24}>
          <hr />
        </Col> */}
      </Row>
    </div>
  )
}

export default TransactionList
