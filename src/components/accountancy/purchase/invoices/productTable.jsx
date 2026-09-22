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
  Row,
  Col,
} from 'antd'
import { PlusOutlined, EditOutlined, MinusOutlined, DeleteOutlined } from '@ant-design/icons'
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
  // {
  //   title: 'Sort',
  //   dataIndex: 'sort',
  //   width: 30,
  //   className: 'drag-visible',
  //   render: () => <DragHandle />,
  //   responsive: ['xs', 'sm'],
  // },
  {
    title: 'Product Details',
    dataIndex: 'name',
    name: 'name',
    responsive: ['xs', 'sm'],
    render: (key, record) => {
      const { prodData, name } = this.state
      // console.log(prodData, 'prodData')
      const filterProd = _.cloneDeep(prodData)
      const newFilterProd = filterProd.filter(x => x.visible === true || x.visible === undefined)
      // console.log(newFilterProd, 'filterProd', filterProd)
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
              {/* <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                  <CreateProductModal headingText="Add Product" />
                </div> */}
              <Button
                type="primary"
                onClick={e => this.showModal(e, record)}
                // className="me-3"
                style={{ display: 'flex', margin: '0 auto' }}
              >
                Add Product
              </Button>
              {menu}
            </div>
          )}
        >
          {newFilterProd.map((item, index) => (
            <Option key={item.id}>{item.name}</Option>
          ))}
        </Select>
      )
    },
  },
  // {
  //   title: 'Description',
  //   dataIndex: 'purchase_desc',
  //   name: 'purchase_desc',
  //   responsive: ['xs', 'sm'],
  //   render: (key, record) => (
  //     <Input
  //       placeholder="Enter description"
  //       onBlur={e => this.handleDescription(e, record)}
  //       name="purchase_desc"
  //       defaultValue={record.purchase_desc}
  //     />
  //   ),
  // },
  {
    title: 'Quantity',
    dataIndex: 'purchase_qty',
    name: 'purchase_qty',
    responsive: ['xs', 'sm'],
    render: (key, record) => (
      <Input
        placeholder="Enter Quantity"
        name="purchase_qty"
        // onChange={e => this.handleCalculation(e, record)}
        onBlur={e => this.handleChange(e, record)}
        defaultValue={record.purchase_qty}
      />
    ),
  },
  {
    title: 'Unit Price',
    name: 'purchase_unit_price',
    dataIndex: 'purchase_unit_price',
    responsive: ['xs', 'sm'],
    render: (key, record) => (
      <Input
        placeholder="Enter Unit"
        name="purchase_unit_price"
        // onChange={e => this.handleCalculation(e, record)}
        onBlur={e => this.handleChange(e, record)}
        defaultValue={record.purchase_unit_price}
      />
    ),
  },
  {
    title: 'Discount %',
    dataIndex: 'purchaseDiscountPercent',
    name: 'purchaseDiscountPercent',
    responsive: ['xs', 'sm'],
    render: (key, record) => (
      <Input
        placeholder="Enter discount"
        name="purchaseDiscountPercent"
        defaultValue={record.purchaseDiscountPercent}
        onBlur={e => this.handleChange(e, record)}
      />
    ),
  },
  // {
  //   title: 'Account',
  //   responsive: ['xs', 'sm'],
  //   dataIndex: 'purchase_account',
  //   render: (key, record) => (
  //     <Input
  //       name="purchase_account"
  //       placeholder="Enter Account"
  //       defaultValue={record.purchase_account}
  //     />
  //   ),
  // },
  {
    title: 'Tax %',
    responsive: ['xs', 'sm'],
    name: 'purchase_tax_rate',
    dataIndex: 'purchase_tax_rate',
    render: (key, record) => {
      const { taxData } = this.state
      return (
        <>
          {/* <Input
              placeholder="Enter Tax rate"
              defaultValue={record.purchase_tax_rate}
              name="purchase_tax_rate"
              onBlur={e => this.handleChange(e, record)}
            /> */}

          <Select
            style={{ width: 150 }}
            placeholder="Select tax rate"
            labelInValue
            defaultValue={{ value: record.purchase_tax_rate }}
            onChange={e => this.handleChange(e, record, 'purchase_tax_rate')}
            // disabled
          >
            {taxData.map((item, index) => (
              <Option key={`${item.rate}}`} value={item.id}>
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
    dataIndex: 'purchase_amount',
    name: 'purchase_amount',
    render: (key, record) => (
      <Input placeholder="Enter Amount" defaultValue={record.purchase_amount} />
    ),
  },
  {
    title: '',
    name: 'action',
    dataIndex: 'action',
    responsive: ['xs', 'sm'],
    className: 'actionCol',
    render: (text, record, index) => {
      const { dataSource } = this.state
      return dataSource.length >= 1 ? (
        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record, index)}>
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
    showTaxModal,
  } = props

  const [rowData, setRowData] = useState([])
  const [columns, setColumns] = useState([])

  const handleProduct = (e, val, row, keyName, index) => {
    // console.log(e, val, row, index)
    updateProduct(e, row, keyName, index)
  }

  const handleChange = (e, row, keyName, index) => {
    // e.persist()
    // console.log(e)
    // updateQtyRow(e, row, keyName, index)
    const reg1 = /[^0-9.]+/g
    const val = e !== 0 ? e.toString() : e === 0 ? '0' : ''
    const dt = val ? val.replace(reg1, '').split('.') : ''
    const newVal = dt.length > 1 ? `${dt[0]}.${dt[1]}` : dt[0]
    updateRow(newVal, row, keyName, index)
  }

  // console.log('productData', productData)

  useEffect(() => {
    // console.log(itemData, 'itemData useEffect')
    setRowData(itemData)
    setColumns(tableCol)
  }, [itemData])

  // console.log(taxValue, 'rowData')
  return (
    <>
      <Table
        className="tableForm form__table--field"
        dataSource={rowData}
        rowClassName={e => {
          return !e?.isError && 'errorRowClass'
        }}
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
              className={item.name === 'name' && 'productDetailsHeader'}
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
                    {item.name === 'purchase_amount' && (
                      <>
                        <Form.Item name={[index, item.name]}>
                          <InputNumber
                            formatter={HelperFunction.isValidNumNew}
                            placeholder={item.placeholder}
                            precision={selOrgData?.decimals}
                            onChange={e => handleChange(e, record, item.name, index)}
                            // defaultValue={0}
                            min={0}
                            disabled={item.name === 'purchase_amount' && true}
                          />
                        </Form.Item>
                      </>
                    )}

                    {item.name === 'purchaseDiscountPercent' && (
                      <>
                        <Form.Item name={[index, item.name]}>
                          <InputNumber
                            formatter={HelperFunction.isValidNumNew}
                            placeholder={item.placeholder}
                            onChange={e => handleChange(e, record, item.name, index)}
                            // defaultValue={0}
                            min={0}
                          />
                        </Form.Item>
                        {record.purchaseDiscountPercentError && (
                          <div style={{ color: '#f5222e' }}>
                            <div>Discount should be equal or greater than 0</div>
                          </div>
                        )}
                      </>
                    )}
                    {item.name === 'purchase_unit_price' && (
                      <>
                        <Form.Item
                          name={[index, item.name]}
                          rules={[
                            {
                              required: item.name === 'purchase_unit_price' && true,
                              message: 'Please enter price',
                            },
                          ]}
                        >
                          <InputNumber
                            formatter={HelperFunction.isValidNumNew}
                            placeholder={item.placeholder}
                            precision={selOrgData?.decimals}
                            onChange={e => handleChange(e, record, item.name, index)}
                            // defaultValue={0}
                            min={0}
                          />
                        </Form.Item>
                        {record.purchaseUnitPriceError && (
                          <div style={{ color: '#f5222e' }}>
                            <div>Price should be equal or greater than 1</div>
                          </div>
                        )}
                      </>
                    )}
                    {item.name === 'purchase_qty' && (
                      <>
                        <Form.Item
                          name={[index, item.name]}
                          rules={[
                            {
                              required: true,
                              message: 'Please enter quantity',
                            },
                          ]}
                        >
                          <InputNumber
                            formatter={HelperFunction.isValidNumNew}
                            placeholder={item.placeholder}
                            onChange={e => handleChange(e, record, item.name, index)}
                            // defaultValue={0}
                            min={0}
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
                          {record.stockonhand !== undefined && item.name === 'purchase_qty' && (
                            <>Avl Stock: {record.stockonhand ? record.stockonhand : 0} </>
                          )}
                        </div>
                        {record.purchaseQtyError && (
                          <div style={{ color: '#f5222e' }}>
                            <div>Quantity should be equal or greater than 1</div>
                          </div>
                        )}
                      </>
                    )}
                    {item.name === 'name' && (
                      <Row>
                        <Col span={24}>
                          <Form.Item
                            name={[index, item.name]}
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
                              // style={{ width: 160 }}
                              onChange={e => handleProduct(e, value, record, item.name, index)}
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
                            {prodCode !== undefined && <>SKU: {prodCode} </>}
                          </div>
                        </Col>
                        <Col span={24} className="mt-3">
                          <Form.Item name={[index, 'purchase_desc']}>
                            <TextArea
                              // style={{ width: "", height: "50px" }}
                              defaultValue={record.purchase_desc}
                              onChange={e => handleDescription(e, value, record)}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    )}
                    {/* {item.name === 'reason' && item.render()} */}

                    {item.name === 'purchase_tax_rate' && (
                      <Form.Item
                        name={[index, item.name]}
                        rules={[
                          {
                            required: taxValue !== 'NoTax' && true,
                            message: 'Please Select Tax',
                          },
                        ]}
                      >
                        <Select
                          style={{ width: 150 }}
                          placeholder="Select tax rate"
                          // labelInValue
                          defaultValue={record.purchase_tax_rate}
                          onChange={e => handleChange(e, record, item.name, index)}
                          popupRender={menu => (
                            <div>
                              <Divider style={{ margin: '4px 0' }} />
                              {/* <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                <CreateProductModal headingText="Add Product" />
                              </div> */}
                              <Button
                                type="primary"
                                onClick={e => showTaxModal(e, record, item.name, index)}
                                // className="me-3"
                                style={{ display: 'flex', margin: '0 auto' }}
                              >
                                Add Purchase Tax
                              </Button>
                              {menu}
                            </div>
                          )}
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
                    {item.name === 'purchase_desc' && (
                      <Form.Item name={[index, item.name]}>
                        <TextArea
                          style={{ width: 150, height: 10 }}
                          onChange={e => handleDescription(e, value, record)}
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

export default ProductTable
