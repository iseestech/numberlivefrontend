import { useState, useEffect, useForm } from 'react'
import * as React from 'react'
import {
  Form,
  Input,
  Button,
  Table,
  Select,
  InputNumber,
  AutoComplete,
  Divider,
  Popconfirm,
} from 'antd'
import { PlusOutlined, EditOutlined, MinusOutlined } from '@ant-design/icons'
import _ from 'lodash'
import './index.scss'
import HelperFunction from '@/services/helper'
import store from 'store'

const selOrgData = store.get('selectedOrg')
const { Column } = Table

const { TextArea } = Input
const { Option } = Select
const reasonOptions = [
  {
    value: 'Reason 1',
  },
  {
    value: 'Reason 2',
  },
  {
    value: 'Reason 3',
  },
]

const tableCol = [
  {
    title: 'Invoice Date',
    name: 'estimate_date',
    dataIndex: 'estimate_date',
    responsive: ['xs', 'sm'],
  },
  {
    title: 'Invoice Number',
    name: 'invoice_no',
    dataIndex: 'invoice_no',
    responsive: ['xs', 'sm'],
  },
  {
    title: 'Region',
    name: 'centerName',
    dataIndex: 'centerName',
    responsive: ['xs', 'sm'],
  },
  {
    title: 'Invoice Amount',
    name: 'invoiceAmount',
    dataIndex: 'invoiceAmount',
    responsive: ['xs', 'sm'],
  },
  {
    title: 'Amount  Due',
    dataIndex: 'invoice_due_amount',
    name: 'invoice_due_amount',
    responsive: ['xs', 'sm'],
  },
  {
    title: 'Payment',
    name: 'paidAmount',
    dataIndex: 'paidAmount',
    responsive: ['xs', 'sm'],
  },
]

const InvoiceTable = props => {
  const {
    productDetailsDto,
    handleAddRow,
    handleDeleteRow,
    productData,
    handleDelete,
    itemData,
    updateProduct,
    updateQtyRow,
    remove,
    updateRow,
    add,
    taxData,
    handleDescription,
    showModal,
    openInvoiceModal,
  } = props
  const [rowData, setRowData] = useState([])
  const handleProduct = (e, val, row, keyName, index) => {
    // console.log(e, val, row, index)
    updateProduct(e, row, keyName, index)
  }

  const handleChange = (e, row, keyName, index) => {
    // e.persist()
    // console.log(e)
    // updateQtyRow(e, row, keyName, index)
    updateRow(e, row, keyName, index)
  }

  // console.log('productData', productData)

  useEffect(() => {
    // console.log(itemData, 'itemData useEffect')
    setRowData(itemData)
  }, [itemData])

  // console.log(rowData, 'rowData')
  return (
    <>
      <Table
        className="tableForm form__table--field"
        dataSource={rowData}
        pagination={false}
        rowKey="key"
        summary={pageData => {
          const dueAmt = pageData.reduce((sum, record) => sum + record.invoice_due_amount, 0)
          return (
            <>
              <Table.Summary.Row
                className="ant-table-footer"
                style={{
                  fontWeight: 'bold',
                }}
              >
                <Table.Summary.Cell>Total Amount Due</Table.Summary.Cell>
                <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                <Table.Summary.Cell>{dueAmt}</Table.Summary.Cell>
                <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          )
        }}
      >
        {tableCol.map((item, indexVal) => {
          // console.log(itemData.length, 'itemData.length')
          return (
            <Column
              dataIndex={item.name}
              title={item.title}
              key={[indexVal, item.name]}
              render={(value, record, index) => {
                return (
                  <>
                    {item.name === 'paidAmount' && (
                      <Form.Item name={[index, item.name]}>
                        <InputNumber
                          onKeyDown={HelperFunction.isValidNumber}
                          placeholder={item.placeholder}
                          precision={selOrgData?.decimals}
                          onChange={e => handleChange(e, record, item.name, index)}
                          // disabled
                          className="disabledInput"
                        />
                      </Form.Item>
                    )}
                    {item.name !== 'paidAmount' && item.name !== 'invoice_no' && (
                      <Form.Item name={[index, item.name]}>
                        <Input disabled className="disabledInput" />
                      </Form.Item>
                    )}

                    {item.name === 'invoice_no' && (
                      <button
                        type="button"
                        onClick={() => openInvoiceModal(record.invoice_no)}
                        style={{ background: 'none', border: 'none' }}
                      >
                        <Form.Item name={[index, item.name]}>
                          <Input disabled className="disabledInput" />
                        </Form.Item>
                      </button>
                    )}
                  </>
                )
              }}
            />
          )
        })}
      </Table>
    </>
  )
}

export default InvoiceTable
