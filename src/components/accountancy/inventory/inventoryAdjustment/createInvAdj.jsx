import { useState, useEffect, useForm } from 'react'
import * as React from 'react'
import { Form, Input, Button, Table, Select, InputNumber, AutoComplete, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, MinusOutlined } from '@ant-design/icons'
import HelperFunction from '@/services/helper'

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
    label: 'ITEM DETAILS',
    title: 'ITEM DETAILS',
    name: 'prdId',
    dataIndex: 'productName',
    placeholder: '',
    //   editable: true,
  },
  {
    label: 'QUANTITY AVAILABLE',
    title: 'QUANTITY AVAILABLE',
    name: 'productQty',
    dataIndex: 'productQty',
    placeholder: '',
    //   editable: true,
    render: (key, item) => {
      return (
        <Form.Item name="qty">
          <Input defaultValue={item.qty} value={item.productQty} />
        </Form.Item>
      )
    },
  },
  {
    label: 'NEW QUANTITY ON HAND',
    title: 'NEW QUANTITY ON HAND',
    name: 'updateQty',
    dataIndex: 'updateQty',
    placeholder: '',
    //   editable: true,
    render: (key, item) => {
      // console.log(item, 'QUANTITY ON HAN', key)
      return <>{item.updateQty}</>
    },
  },
  {
    label: 'QUANTITY ADJUSTED',
    title: 'QUANTITY ADJUSTED',
    name: 'qtyAdjusted',
    dataIndex: 'qtyAdjusted',
    placeholder: '',
    editable: true,
  },
  // {
  //   label: 'COST PRICE',
  //   title: 'COST PRICE',
  //   name: 'purchasePrize',
  //   placeholder: '',
  //   dataIndex: 'purchasePrize',
  //   editable: true,
  // },
  {
    label: 'REASON',
    title: 'REASON',
    name: 'reason',
    placeholder: '',
    dataIndex: 'reason',
    editable: false,
    render: (key, record) => {
      const handleReason = (e, keyVal, rowVal, i) => {
        // console.log(e, keyVal, rowVal, i, 'value')
      }
      return (
        <AutoComplete
          style={{
            width: 180,
          }}
          // onChange={e => handleReason(e, key, row, index)}
          onBlur={e => handleReason(e, record)}
          options={reasonOptions}
          placeholder="Select reason"
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
        />
      )
    },
  },
  {
    label: 'ACTION',
    title: 'ACTION',
    name: 'action',
    placeholder: '',
    editable: false,
  },
]

// const EditableCell = ({
//   editing,
//   dataIndex,
//   title,
//   inputType,
//   record,
//   index,
//   children,
//   ...restProps
// }) => {
//   const inputNode = inputType === 'number' ? <Input /> : <Input />
//   return (
//     <td {...restProps}>
//       {editing ? (
//         <Form.Item
//           name={dataIndex}
//           style={{
//             margin: 0,
//           }}
//           rules={[
//             {
//               required: true,
//               message: `Please Input ${title}!`,
//             },
//           ]}
//         >
//           {inputNode}
//         </Form.Item>
//       ) : (
//         children
//       )}
//     </td>
//   )
// }

const CreateInvAdj = props => {
  const {
    productDetailsDto,
    handleAddRow,
    handleDeleteRow,
    productData,
    handleDelete,
    itemData,
    updateRow,
    updateQtyRow,
    remove,
    add,
  } = props

  const [rowData, setRowData] = useState([])
  const handleProduct = (e, val, row, keyName, index) => {
    // console.log(e, val, row, index)
    updateRow(e, row, keyName, index)
  }

  const handleChange = (e, val, row, keyName, index) => {
    // e.persist()
    // console.log(e)
    // updateQtyRow(e, row, keyName, index)
    updateRow(e, row, keyName, index)
  }
  // console.log('productData', productData)

  // const handleDeleteRow = (record, index) => {
  //   // console.log(record, index, 'record, index')
  //   // add({
  //   //   id: '',
  //   //   productName: '',
  //   //   closingStock: '',
  //   //   newQty: '',
  //   //   qtyAdjusted: '',
  //   //   costPrize: '',
  //   //   reason: '',
  //   // })
  // }

  useEffect(() => {
    // console.log(itemData, 'itemData useEffect')
    setRowData(itemData)
  }, [itemData])

  // console.log(rowData, 'rowData')
  return (
    <>
      <Table
        className=" form__table--field"
        dataSource={rowData}
        pagination={false}
        footer={() => {
          return (
            <Form.Item>
              <Button
                onClick={() => {
                  add({
                    name: rowData.length + 1,
                    key: rowData.length + 1,
                    fieldKey: rowData.length + 1,
                    id: rowData.length + 1,
                  })
                  handleAddRow()
                }}
              >
                <PlusOutlined /> Add field
              </Button>
            </Form.Item>
          )
        }}
        rowKey="key"
      >
        {tableCol.map((item, indexVal) => {
          // console.log(itemData.length, 'itemData.length')
          return (
            <Column
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
                    {item.name !== 'action' && item.name !== 'prdId' && item.name !== 'reason' && (
                      <Form.Item
                        name={[index, item.name]}
                        rules={[
                          {
                            required:
                              (item.name !== 'productQty' || item.name === 'purchasePrize') && true,
                            message: 'Please enter quantity!',
                          },
                        ]}
                      >
                        <InputNumber
                          onKeyDown={HelperFunction.isValidNumber}
                          placeholder={item.placeholder}
                          onChange={e => handleChange(e, value, record, item.name, index)}
                          // onChange={handleChange}
                          disabled={item.name === 'productQty' || item.name === 'purchasePrize'}
                        />
                      </Form.Item>
                    )}
                    {item.name === 'prdId' && (
                      <Form.Item
                        name={[index, item.name]}
                        rules={[
                          {
                            required: true,
                            message: 'Please select account!',
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          // labelInValue
                          defaultValue={record.prdId}
                          style={{ width: 220 }}
                          onChange={e => handleProduct(e, value, record, item.name, index)}
                        >
                          {productData &&
                            productData.map((ele, i) => (
                              <Option
                                key={`${ele.id}`}
                                value={ele.product_id}
                                disabled={ele.disabled}
                              >
                                {ele.item_name}
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

                    {item.name === 'reason' && (
                      <Form.Item name={[index, item.name]}>
                        <AutoComplete
                          style={{
                            width: 180,
                          }}
                          // onChange={e => handleReason(e, key, row, index)}
                          onBlur={e => handleReason(e, record)}
                          options={reasonOptions}
                          placeholder="Select reason"
                          filterOption={(inputValue, option) =>
                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                          }
                        />
                      </Form.Item>
                    )}
                    {item.name === 'action' && (
                      <div style={{ display: 'flex' }}>
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
                            handleDeleteRow(index)
                          }}
                          disabled={itemData.length <= 1 && true}
                        >
                          <Button
                            icon={<MinusOutlined />}
                            shape="circle"
                            disabled={itemData.length <= 1 && true}
                            // onClick={() => remove(record.name)}
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

export default CreateInvAdj
