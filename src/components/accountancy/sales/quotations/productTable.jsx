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
import HelperFunction from '@/services/helper'
import store from 'store'

const selOrgData = store.get('selectedOrg')

const { Column } = Table

const { TextArea } = Input
const { Option } = Select

const tableCol = [
  // {
  //   title: 'Sort',
  //   dataIndex: 'sort',
  //   width: 30,
  //   className: 'drag-visible',
  //   render: () => <DragHandle />,
  //   responsive: ['xs', 'sm'],
  // },
  {
    title: 'Name',
    dataIndex: 'name',
    className: 'drag-visible',
    responsive: ['xs', 'sm'],
    render: (key, record) => {
      const { prodData, name } = this.state
      return (
        <Select
          style={{ width: 180 }}
          placeholder="Enter Name"
          labelInValue
          defaultValue={{ value: record.name }}
          onChange={e => this.handleName(e, record)}
          popupRender={menu => (
            <div>
              <Divider style={{ margin: '4px 0' }} />
              <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                {/* <CreateProductModal
                    headingText="Add Product"
                    isOutside
                    handleName={() => this.handleName()}
                  /> */}
                <Button type="primary" onClick={e => this.showModal(e, record)} className="me-3">
                  Add Product
                </Button>
              </div>
              {menu}
            </div>
          )}
        >
          {prodData.map((item, index) => (
            <Option key={item.id}>{item.name}</Option>
          ))}
        </Select>
      )
    },
  },
  {
    title: 'Description',
    dataIndex: 'sale_desc',
    responsive: ['xs', 'sm'],
    render: (key, record) => (
      <Input
        placeholder="Enter description"
        onBlur={e => this.handleDescription(e, record)}
        name="sale_desc"
        defaultValue={record.sale_desc}
      />
    ),
  },
  {
    title: 'Quantity',
    dataIndex: 'sale_qty',
    responsive: ['xs', 'sm'],
    render: (key, record) => (
      <Input
        placeholder="Enter Quantity"
        name="sale_qty"
        // onChange={e => this.handleCalculation(e, record)}
        onBlur={e => this.handleChange(e, record)}
        defaultValue={record.sale_qty}
      />
    ),
  },
  {
    title: 'Unit Price',
    dataIndex: 'sale_unit_price',
    responsive: ['xs', 'sm'],
    render: (key, record) => (
      <Input
        placeholder="Enter Unit"
        name="sale_unit_price"
        // onChange={e => this.handleCalculation(e, record)}
        onBlur={e => this.handleChange(e, record)}
        defaultValue={record.sale_unit_price}
      />
    ),
  },
  {
    title: 'Discount %',
    dataIndex: 'saleDiscountPercent',
    responsive: ['xs', 'sm'],
    render: (key, record) => (
      <Input
        placeholder="Enter discount"
        name="saleDiscountPercent"
        defaultValue={record.saleDiscountPercent}
        onBlur={e => this.handleChange(e, record)}
      />
    ),
  },
  // {
  //   title: 'Account',
  //   responsive: ['xs', 'sm'],
  //   dataIndex: 'sale_account',
  //   render: (key, record) => (
  //     <Input
  //       name="sale_account"
  //       placeholder="Enter Account"
  //       defaultValue={record.sale_account}
  //     />
  //   ),
  // },
  {
    title: 'Tax %',
    responsive: ['xs', 'sm'],
    dataIndex: 'sale_tax_rate',
    render: (key, record) => {
      const { taxData } = this.state
      return (
        <>
          <Select
            style={{ width: 150 }}
            placeholder="Select tax %"
            labelInValue
            defaultValue={{ value: record.sale_tax_rate }}
            onChange={e => this.handleChange(e, record, 'sale_tax_rate')}
          >
            {taxData.map((item, index) => (
              <Option key={item.id} value={item.rate}>
                {`${item.tax_name} (${item.rate}%)`}
              </Option>
            ))}
          </Select>
        </>
      )
    },
  },
  {
    title: 'Amount',
    responsive: ['xs', 'sm'],
    dataIndex: 'sale_amount',
    render: (key, record) => <Input placeholder="Enter Amount" defaultValue={record.sale_amount} />,
  },
  {
    title: 'Action',
    dataIndex: 'action',
    responsive: ['xs', 'sm'],
    className: 'actionCol',
    render: (text, record) => {
      const { dataSource } = this.state
      return dataSource.length >= 1 ? (
        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record)}>
          <a>Delete</a>
        </Popconfirm>
      ) : null
    },
  },
]

const ProductTable = props => {
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
    taxValue,
  } = props

  const [rowData, setRowData] = useState([])
  const handleProduct = (e, val, row, keyName, index) => {
    // console.log(e, val, row, index)
    updateProduct(e, row, keyName, index)
  }

  const handleChange = (e, valD, row, keyName, index) => {
    // e.persist()
    // console.log(e)
    // updateQtyRow(e, row, keyName, index)
    const reg1 = /[^0-9.]+/g
    const val = e ? e.toString() : ''
    const dt = val ? val.replace(reg1, '').split('.') : ''
    const newVal = dt.length > 1 ? `${dt[0]}.${dt[1]}` : dt[0]
    // updateRow(newVal, row, keyName, index)

    updateRow(newVal, row, keyName, index)
  }

  // console.log('productData ProductTable', productData)

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
            <Form.Item>
              <Button
                onClick={() => {
                  add({
                    // name: rowData.length + 1,
                    key: rowData.length + 1,
                    fieldKey: rowData.length + 1,
                    // id: rowData.length + 1,
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
                const prodCode = record.product_code

                // const handleChange = (, keyName) => {
                //   // e.persist();
                //   // console.log(e, keyName, 'e, value, record, index')
                // }
                const handleReason = (e, keyVal, rowVal, i) => {
                  // console.log(e, keyVal, rowVal, i, 'value')
                }

                return (
                  <>
                    {/* {item.dataIndex !== 'action' &&
                      item.dataIndex !== 'name' &&
                      item.dataIndex !== 'sale_tax_rate' &&
                      item.dataIndex !== 'sale_desc' &&
                      item.dataIndex !== 'reason' && (
                        <>
                          <Form.Item
                            name={[index, item.dataIndex]}
                            rules={[
                              {
                                required: item.dataIndex === 'sale_qty' && true,
                                message: 'Please enter Quantity',
                              },
                            ]}
                          >
                            <InputNumber
                              placeholder={item.placeholder}
                              onChange={e => handleChange(e, value, record, item.dataIndex, index)}
                              // onChange={handleChange}
                              // min={item.dataIndex === 'sale_qty' ? 1 : 0}
                              // disabled={item.name === 'saleQty' || item.name === 'salePrize'}
                            />
                          </Form.Item>
                          <div>
                            {record.stockonhand !== undefined && item.dataIndex === 'sale_qty' && (
                            <> Avl Stock: {record.stockonhand ? record.stockonhand : 0} </>
                             )} 
                          </div>
                        </>
                      )} */}
                    {item.dataIndex === 'sale_qty' && (
                      <>
                        <Form.Item
                          name={[index, item.dataIndex]}
                          rules={[
                            {
                              required: item.dataIndex === 'sale_qty' && true,
                              message: 'Please enter Quantity',
                            },
                          ]}
                        >
                          <InputNumber
                            placeholder={item.placeholder}
                            min={0}
                            onChange={e => handleChange(e, value, record, item.dataIndex, index)}
                            formatter={HelperFunction.isValidNumNew}
                          />
                        </Form.Item>
                        <div
                          style={{
                            fontSize: '12px',
                            margin: '0',
                            textAlign: 'right',
                            width: '100%',
                          }}
                        >
                          {record.stockonhand !== undefined && item.dataIndex === 'sale_qty' && (
                            <>Avl Stock: {record.stockonhand ? record.stockonhand : 0} </>
                          )}
                          {record.saleQtyError && (
                            <div style={{ color: '#f5222e' }}>
                              <div>Quantity should be equal or greater than 1</div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    {item.dataIndex === 'sale_unit_price' && (
                      <>
                        <Form.Item
                          name={[index, item.dataIndex]}
                          rules={[
                            {
                              required: item.dataIndex === 'sale_unit_price' && true,
                              message: 'Please enter price',
                            },
                          ]}
                        >
                          <InputNumber
                            placeholder={item.placeholder}
                            min={0}
                            precision={selOrgData?.decimals}
                            onChange={e => handleChange(e, value, record, item.dataIndex, index)}
                            formatter={HelperFunction.isValidNumNew}
                          />
                        </Form.Item>
                        {record.saleUnitPriceError && (
                          <div style={{ color: '#f5222e' }}>
                            <div>Price should be equal or greater than 1</div>
                          </div>
                        )}
                      </>
                    )}
                    {item.dataIndex === 'name' && (
                      <>
                        <Form.Item
                          name={[index, item.dataIndex]}
                          rules={[
                            {
                              required: true,
                              message: 'Please choose product',
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            filterOption={(input, option, dt) => {
                              return (
                                option.prodName.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                                option.prodCode
                                  ?.toString()
                                  .toLowerCase()
                                  .indexOf(input?.toString().toLowerCase()) >= 0
                              )
                            }}
                            // labelInValue
                            defaultValue={record.prdId}
                            style={{ width: 220 }}
                            onChange={e => handleProduct(e, value, record, item.dataIndex, index)}
                            popupRender={menu => (
                              <div>
                                <Divider style={{ margin: '4px 0' }} />
                                <Button
                                  type="primary"
                                  onClick={e => showModal(e, record, index)}
                                  // className="me-3"
                                  style={{ display: 'flex', margin: '0 auto' }}
                                >
                                  Add Product
                                </Button>
                                {menu}
                              </div>
                            )}
                            disabled={record.isEdit && true}
                          >
                            {productData &&
                              productData.map((ele, i) => (
                                <Option
                                  prodCode={ele.product_code}
                                  key={`${ele.id}`}
                                  value={ele.id}
                                  disabled={ele.disabled}
                                  prodName={ele.name}
                                >
                                  <p style={{ width: '100%', margin: '0' }}>
                                    {ele.name}
                                    <p
                                      style={{
                                        fontSize: '10px',
                                        margin: '0',
                                        textAlign: 'right',
                                        width: '100%',
                                      }}
                                    >
                                      SKU: {ele.product_code}
                                    </p>
                                  </p>
                                </Option>
                              ))}
                          </Select>
                          {/* <Input
                          placeholder={item.placeholder}
                          onChange={e => handleChange(e, value, record, item.name, index)}
                          // onChange={handleChange}
                        /> */}
                        </Form.Item>
                        <div style={{ fontSize: '12px', textAlign: 'right' }}>
                          {prodCode !== undefined && prodCode ? <>SKU: {prodCode} </> : ''}
                        </div>
                      </>
                    )}
                    {/* {item.name === 'reason' && item.render()} */}
                    {item.dataIndex === 'saleDiscountPercent' && (
                      <>
                        <Form.Item
                          name={[index, item.dataIndex]}
                          // rules={[
                          //   {
                          //     required: item.dataIndex === 'saleDiscountPercent' && true,
                          //     message: 'Please enter Discount',
                          //   },
                          // ]}
                        >
                          <InputNumber
                            placeholder={item.placeholder}
                            min={0}
                            onChange={e => handleChange(e, value, record, item.dataIndex, index)}
                            formatter={HelperFunction.isValidNumNew}
                          />
                        </Form.Item>
                        <div>
                          {record.saleDiscountPercentError && (
                            <div style={{ color: '#f5222e' }}>
                              <div>Discount should be equal or greater than 0</div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    {item.dataIndex === 'sale_tax_rate' && (
                      <Form.Item
                        name={[index, item.dataIndex]}
                        rules={[
                          {
                            required: taxValue !== 'NoTax' && true,
                            message: 'Please Select Tax',
                          },
                        ]}
                      >
                        <Select
                          style={{ width: 150 }}
                          placeholder="Select tax %"
                          // labelInValue
                          defaultValue={record.sale_tax_rate}
                          onChange={e => handleChange(e, value, record, item.dataIndex, index)}
                          // disabled
                          disabled={taxValue === 'NoTax' && true}
                        >
                          {taxData.map(tax => (
                            <Option key={`${tax.id}}`} value={tax.id}>
                              {`${tax.tax_name} (${tax.rate}%)`}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    )}
                    {item.dataIndex === 'sale_desc' && (
                      <Form.Item name={[index, item.dataIndex]}>
                        <Input onChange={e => handleDescription(e, value, record)} />
                      </Form.Item>
                    )}
                    {item.dataIndex === 'sale_amount' && (
                      <>
                        <Form.Item name={[index, item.dataIndex]}>
                          <InputNumber
                            placeholder={item.placeholder}
                            precision={selOrgData?.decimals}
                            onChange={e => handleChange(e, value, record, item.dataIndex, index)}
                            disabled={item.dataIndex === 'sale_amount' && true}
                            formatter={HelperFunction.isValidNumNew}
                          />
                        </Form.Item>
                      </>
                    )}
                    {item.dataIndex === 'action' && (
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
                            handleDeleteRow(record, index)
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

export default ProductTable
