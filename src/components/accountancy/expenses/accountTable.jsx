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
import { PlusOutlined, DeleteOutlined, EditOutlined, MinusOutlined } from '@ant-design/icons'
import _ from 'lodash'
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
    title: 'Expense Account',
    dataIndex: 'accId',
    name: 'accId',
    className: 'drag-visible',
    // responsive: ['xs', 'sm'],
  },
  {
    title: 'Notes',
    dataIndex: 'notes',
    name: 'notes',
    // responsive: ['xs', 'sm'],
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    name: 'amount',
    // responsive: ['xs', 'sm'],
    // render: (key, record) => (
    //   <Input
    //     placeholder="Enter contact"
    //     name="contact"
    //     // onChange={e => this.handleCalculation(e, record)}
    //     onBlur={e => this.handleChange(e, record)}
    //     defaultValue={record.quantity}
    //   />
    // ),
  },
  //   {
  //     title: 'Debits',
  //     dataIndex: 'debit',
  //     name: 'debit',
  //     responsive: ['xs', 'sm'],
  //   },
  //   {
  //     title: 'Credits',
  //     dataIndex: 'credit',
  //     responsive: ['xs', 'sm'],
  //     name: 'credit',
  //   },
  {
    title: '',
    dataIndex: 'action',
    name: 'action',
    // responsive: ['xs', 'sm'],
    className: 'actionCol text-end',
  },
]

const AccountTable = props => {
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
    chartOfAccount,
    handleDescription,
    showModal,
    custData,
  } = props

  const [rowData, setRowData] = useState([])
  const handleProduct = (e, val, row, keyName, index) => {
    // console.log(e, val, row, index)
    updateProduct(e, row, keyName, index)
  }

  const handleChange = (e, val, row, keyName, index) => {
    // e.persist()
    // console.log(e)
    // updateQtyRow(e, row, keyName, index)
    updateRow(e, row, keyName, index)
  }

  //   // console.log('chartOfAccount ===>123', chartOfAccount)

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
        footer={() => {
          return (
            <Button
              onClick={() => {
                add({
                  // name: rowData.length + 1,
                  key: rowData.length + 1,
                  fieldKey: rowData.length + 1,
                  // id: rowData.length + 1,
                  id: 0,
                })
                handleAddRow()
              }}
            >
              <PlusOutlined /> Add field
            </Button>
          )
        }}
        rowKey="key"
      >
        {tableCol.map((item, indexVal) => {
          // console.log(itemData.length, 'itemData.length')
          return (
            <Column
              className="table__td"
              dataIndex={item.name}
              title={item.title}
              key={[indexVal, item.name]}
              // editable={item.editable}
              // onCell={() => handleCell()}
              render={(value, record, index) => {
                // const handleChange = (, keyName) => {
                //   // e.persist();
                //   // console.log(e, keyName, 'e, value, record, index')
                // }
                const handleReason = (e, keyVal, rowVal, i) => {
                  // console.log(e, keyVal, rowVal, i, 'value')
                }

                return (
                  <>
                    {item.name !== 'action' &&
                      item.name !== 'accId' &&
                      item.name !== 'contact' &&
                      item.name !== 'notes' && (
                        <Form.Item
                          name={[index, item.name]}
                          className="mb-0"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter amount',
                            },
                          ]}
                        >
                          <InputNumber
                            onKeyDown={HelperFunction.isValidNumber}
                            placeholder={item.placeholder}
                            onChange={e => handleChange(e, value, record, item.name, index)}
                            // onChange={handleChange}
                            precision={selOrgData?.decimals}
                            disabled={item.name === 'productQty' || item.name === 'purchasePrize'}
                            style={{ width: '100%' }}
                            min={0}
                          />
                        </Form.Item>
                      )}
                    {item.name === 'accId' && (
                      <Form.Item
                        name={[index, item.name]}
                        className="mb-0"
                        rules={[
                          {
                            required: true,
                            message: 'Please select account!',
                          },
                        ]}
                      >
                        <Select
                          style={{ width: 180 }}
                          placeholder="Enter Name"
                          showSearch
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          //   labelInValue
                          // defaultValue={{ value: record.name }}
                          onChange={e => handleProduct(e, value, record, item.name, index)}
                          // popupRender={menu => (
                          //   <div>
                          //     <Divider style={{ margin: '4px 0' }} />
                          //     <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                          //       <CreateProductModal headingText="Add Product" />
                          //     </div>
                          //     {menu}
                          //   </div>
                          // )}
                        >
                          {chartOfAccount.map((ele, i) => (
                            <Option value={ele.id} key={ele.id}>
                              {ele.actName}
                            </Option>
                          ))}
                        </Select>
                        {/* <Input
                          placeholder={item.placeholder}
                          onChange={e => handleChange(e, value, record, item.name, index)}
                          // onChange={handleChange}
                        /> */}
                      </Form.Item>
                    )}
                    {/* {item.name === 'reason' && item.render()} */}

                    {item.name === 'contact' && (
                      <Form.Item name={[index, item.name]} className="mb-0">
                        <Select
                          style={{ width: 180 }}
                          placeholder="Enter Name"
                          // labelInValue
                          // defaultValue={Number(item.contact)}
                          // onChange={e => this.handleName(e, record)}
                        >
                          {custData.map(ele => (
                            <Option
                              value={String(ele.customer_id)}
                              key={`${ele.company_name}_${ele.customer_id}`}
                            >
                              {`${ele.customer_fname} ${ele.customer_lname} (${ele.company_name})`}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    )}
                    {item.name === 'notes' && (
                      <Form.Item name={[index, item.name]} className="mb-0">
                        <TextArea onChange={e => handleDescription(e, record, item.name, index)} />
                      </Form.Item>
                    )}
                    {item.name === 'action' && (
                      <div className="text-end">
                        {/* <Button
                          icon={<EditOutlined />}
                          shape="circle"
                          style={{ marginRight: 8 }}
                          onClick={() => editRow(row)}
                        /> */}
                        <Popconfirm
                          title="Sure to delete?"
                          // onConfirm={() => handleDeleteRow(record, index)}
                          onConfirm={() => {
                            // remove(index)
                            handleDeleteRow(record, index)
                          }}
                          disabled={itemData.length <= 1 && true}
                        >
                          <Button
                            icon={
                              <span className="deleteIcon">
                                <DeleteOutlined />
                              </span>
                            }
                            // shape="circle"
                            disabled={itemData.length <= 1 && true}
                            // onClick={() => remove(record.name)}
                            style={{ background: 'none', border: 'none', color: '#e65555' }}
                          />
                        </Popconfirm>
                      </div>
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

export default AccountTable
