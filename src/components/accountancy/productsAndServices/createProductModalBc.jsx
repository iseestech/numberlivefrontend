/* eslint-disable */
import React from 'react'
import {
  Input,
  Slider,
  Cascader,
  Upload,
  Modal,
  message,
  Checkbox,
  Select,
  Button,
  Form,
  InputNumber,
  Radio,
} from 'antd'
import axios from 'axios'
import ProductService from '@/services/products'
import ChartOfAccService from '@/services/chartOfAccount'
import './index.scss'
// import ChartOfAccountOnType from '../common/chartOfAccountOnType'
import TaxOnType from '../common/taxOnType'

const { confirm } = Modal
const { Group } = Checkbox
const { TextArea } = Input
const { Option } = Select

const optionsWithPurchase = [{ label: 'I Purchase this product', value: true }]
const optionsWithSale = [{ label: 'I Sell this product', value: true }]

class CreateProductModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      productType: 'goods',
      productDetails: {},
      action: 'Create',
      stockValue: 0,
      productCat: [],
      productGrp: [],
      productUnit: [],
      chartOfAccount: [],
    }
    this.formRef = React.createRef()
  }

  fetchProdCat = () => ProductService.productListCat('Category')

  fetchProdGroup = () => ProductService.productListCat('Group')

  fetchProdUnit = () => ProductService.productListCat('Unit')

  fetchChartOfAccount = () => ChartOfAccService.listAllAccounts('ALL')

  componentDidMount = () => {
    // console.log(this.props, 'props')
    const getAllData = async () => {
      const [prodCat, prodGroup, prodUnit, chartOfAccount] = await axios.all([
        this.fetchProdCat(),
        this.fetchProdGroup(),
        this.fetchProdUnit(),
        this.fetchChartOfAccount(),
      ])

      // console.log(chartOfAccount, '&& chartOfAccount.data')
      this.setState({
        productCat: (prodCat && prodCat.data) || [],
        productGrp: (prodGroup && prodGroup.data) || [],
        productUnit: (prodUnit && prodUnit.data) || [],
        chartOfAccount: (chartOfAccount && chartOfAccount) || [],
      })
    }
    getAllData()
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  handleOk = values => {
    this.setState({
      visible: false,
    })
  }

  onFinish = values => {
    // console.log('onFinish values', values, this.props)
    const { productId, isOutside, handleChange } = this.props
    const id = productId
    const { isLoading } = this.state
    // values.purchase = values.purchase && values.purchase.length ? true : false
    // values.sales = values.sales && values.sales.length ? true : false
    values.id = 0

    let method = 'post'
    values.description = ''
    values.image = 'string'
    values.imageId = 'string'
    values.minimum = 0
    values.price = 0
    values.purchase_amount = 0
    values.purchase_discount = 0
    values.quanitities_in_cart = 0
    values.rating = 0
    values.special = true
    values.stock = true
    values.tax = 0
    values.thumb = 'string'
    values.quantity = 0
    values.thumbId = 'string'
    // console.log(values, 'values')
    if (id) {
      method = 'put'
      values.id = id
    }

    // values.created_by = 'Asad'
    // values.customer_email = 'asad@gmail.com'
    // handleName('4', '8')

    // handleChange({ value: 101, label: 'Laptop', key: 101 },tempData, 'productForm')
    // console.log(values, 'Values***********')
    const fetchData = async () => {
      const result = await ProductService.createProduct(values, method)
      // this.onFinish()
      // console.log(result, 'product result')
      this.setState(
        {
          visible: false,
        },
        () => {
          // console.log(isOutside, 'isOutside')
          if (!isOutside) {
            this.props.loadData()
          } else {
            const { id, name } = result.data.data
            // console.log('in else')
            this.props.showModal()
            handleChange(
              { value: '101', label: 'name', key: '101' },
              result.data.data,
              'productForm',
            )
          }
        },
      )
    }
    return fetchData()
  }

  onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo)
  }

  handleCancel = () => {
    this.props.showModal()
    this.setState({
      visible: false,
    })
  }

  showConfirm = () => {
    confirm({
      title: 'Do you Want to delete these items?',
      content: 'Some descriptions',
      onOk() {
        // console.log('OK')
      },
      onCancel() {
        // console.log('Cancel')
      },
    })
  }

  showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure delete this task?',
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        // console.log('OK')
      },
      onCancel() {
        // console.log('Cancel')
      },
    })
  }

  handleQuantity = e => {
    const value = this.formRef.current.getFieldValue('purchase_unit_price') || 0
    // console.log(e, 'e', e, value)
    this.formRef.current.setFieldsValue({ stockValue: e * value })
    // this.setState({
    //   stockValue: e * value,
    // })
  }

  handleType = val => {
    // console.log(val, 'val')
    this.setState({
      productType: val,
    })
  }

  render() {
    const { headingText, visible, productData, productId } = this.props
    const { productCat, productGrp, productUnit, productType, chartOfAccount } = this.state
    // console.log(chartOfAccount, 'props create Modal')
    const { stockValue } = this.state
    // const getData = async () => {
    const data = []
    _.forEach(productData, (value, key) => {
      data.push({
        name: [key],
        value,
      })
    })
    // console.log(data)
    const action = productId ? 'Update' : 'Create'
    // }
    return (
      <div>
        {/* <Button type="primary" onClick={this.showModal} className="me-3">
          {headingText}
        </Button> */}
        <Modal
          className="createProductModal"
          title={headingText}
          visible={visible}
          onCancel={this.handleCancel}
          style={{ width: '700px' }}
          footer={null}
        >
          <div className="card">
            <div className="card-body">
              <Form
                layout="vertical"
                fields={data}
                ref={this.formRef}
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
              >
                <div className="row">
                  <div className="col-md-4">
                    <Form.Item
                      name="product_type"
                      label="Product Type"
                      rules={[
                        {
                          required: true,
                          message: 'Please select Type!',
                        },
                      ]}
                    >
                      <Select placeholder="" onChange={this.handleType.bind(this)}>
                        <Option key="goods" value="goods">
                          Goods{' '}
                        </Option>
                        <Option key="service" value="service">
                          Service
                        </Option>
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item name="group" label="Group">
                      <Select showSearch placeholder="">
                        {productGrp.map((item, index) => {
                          return (
                            <Option key={item.groupId} value={`${item.groupName}_${item.groupId}`}>
                              {item.groupName}
                            </Option>
                          )
                        })}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item name="category" label="Category">
                      <Select showSearch placeholder="">
                        {productCat.map((item, index) => {
                          return (
                            <Option key={item.catId} value={`${item.catName}_${item.catId}`}>
                              {item.catName}
                            </Option>
                          )
                        })}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item
                      name="product_code"
                      label="Product Code"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter code!',
                        },
                      ]}
                    >
                      <Input placeholder="Enter Product Code" />
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item
                      name="name"
                      label="Product Name"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter Name!',
                        },
                      ]}
                    >
                      <Input placeholder="" />
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item
                      name="unit"
                      label="Unit"
                      rules={[
                        {
                          required: true,
                          message: 'Please select Unit!',
                        },
                      ]}
                    >
                      <Select showSearch placeholder="Select product Unit">
                        {productUnit.map((item, index) => {
                          return (
                            <Option key={item.unitId} value={`${item.unitName}_${item.unitId}`}>
                              {item.unitName}
                            </Option>
                          )
                        })}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-4">
                        <Form.Item name="sales" label={null} valuePropName="checked">
                          {/* <Group options={optionsWithSale} /> */}
                          <Checkbox>I Sell this product</Checkbox>
                        </Form.Item>
                      </div>
                      <div className="col-md-8">
                        <div className="row">
                          <div className="col-md-4">
                            <Form.Item
                              name="sale_unit_price"
                              label="Unit Price"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please enter Unit Price!',
                                },
                              ]}
                            >
                              <Input placeholder="" />
                            </Form.Item>
                          </div>
                          <div className="col-md-4">
                            <Form.Item
                              name="sale_account"
                              label="Sales Account"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please select Sale Account!',
                                },
                              ]}
                            >
                              {/* <ChartOfAccountOnType category="ALL" /> */}
                              <Select
                                showSearch
                                filterOption={(input, option) =>
                                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                              >
                                {chartOfAccount.map((item, index) => (
                                  <Option value={item.id} key={item.id}>
                                    {item.actName}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>
                          <div className="col-md-4">
                            <Form.Item name="sale_tax_rate" label="Tax rate">
                              {/* <Select>
                                <Option key="0">Test </Option>
                                <Option key="0">Demo</Option>
                              </Select> */}
                              <TaxOnType />
                              {/* <InputNumber placeholder="" /> */}
                            </Form.Item>
                          </div>
                          <div className="col-md-12">
                            <Form.Item name="sale_desc" label="Sales Description">
                              <TextArea />
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-4">
                        <Form.Item name="purchase" label={null} valuePropName="checked">
                          {/* <Group options={optionsWithPurchase} /> */}
                          <Checkbox>I Purchase this product</Checkbox>
                        </Form.Item>
                      </div>
                      <div className="col-md-8">
                        <div className="row">
                          <div className="col-md-4">
                            <Form.Item
                              name="purchase_unit_price"
                              label="Unit Price"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please enter Unit Price!',
                                },
                              ]}
                            >
                              <Input placeholder="" />
                            </Form.Item>
                          </div>
                          <div className="col-md-4">
                            <Form.Item
                              name="purchase_account"
                              label="Purchases Account"
                              rules={[
                                {
                                  required: true,
                                  message: 'Please select Account!',
                                },
                              ]}
                            >
                              {/* <ChartOfAccountOnType category="ALL" /> */}
                              <Select
                                showSearch
                                filterOption={(input, option) =>
                                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                              >
                                {chartOfAccount.map((item, index) => (
                                  <Option value={item.id} key={item.id}>
                                    {item.actName}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>
                          <div className="col-md-4">
                            <Form.Item name="purchase_tax_rate" label="Tax rate">
                              <TaxOnType />
                              {/* <InputNumber placeholder="" /> */}
                            </Form.Item>
                          </div>
                          <div className="col-md-12">
                            <Form.Item name="purchase_desc" label="Purchases Description">
                              <TextArea />
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {productType !== 'service' && (
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-4">
                          <Form.Item name="stock" label={null} valuePropName="checked">
                            {/* <Group options={optionsWithSale} /> */}
                            <Checkbox>Enable Tracking</Checkbox>
                          </Form.Item>
                        </div>
                        <div className="col-md-2">
                          <Form.Item name="productQty" label="Opening Stock">
                            <InputNumber placeholder="" onChange={e => this.handleQuantity(e)} />
                          </Form.Item>
                        </div>
                        <div className="col-md-1">*</div>
                        <div className="col-md-2">
                          <Form.Item name="openingRate" label="Opening Rate">
                            <InputNumber placeholder="" />
                          </Form.Item>
                        </div>
                        <div className="col-md-1">=</div>
                        <div className="col-md-2">
                          <Form.Item name="stockValue" label="Opening Value">
                            <InputNumber placeholder="" disabled />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="col-md-12 text-center">
                    <Form.Item>
                      <Button
                        type="default"
                        className="text-center me-2"
                        onClick={this.handleCancel}
                        htmlType="submit"
                      >
                        <strong>Cancel</strong>
                      </Button>
                      <Button type="primary" htmlType="submit" className="btn btn-success px-5">
                        {action}
                      </Button>
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default CreateProductModal
