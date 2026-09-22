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
  Divider,
  DatePicker,
} from 'antd'
import axios from 'axios'
import ProductService from '@/services/products'
import store from 'store'
import moment from 'moment'
import ChartOfAccService from '@/services/chartOfAccount'
import './index.scss'
// import ChartOfAccountOnType from '../common/chartOfAccountOnType'
import TaxOnType from '../common/taxOnType'
import TaxService from '@/services/settings'

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
      taxData: [],
      isSalesSelected: true,
      isPurchaseSelected: true,
      isStockSelected: true,
      defaultData: [
        { name: 'sales', value: true },
        { name: 'purchase', value: true },
        { name: 'stock', value: true },
        { name: 'invStartDate', value: moment(new Date()) },
      ],
    }
    this.formRef = React.createRef()
  }

  fetchProdCat = () => ProductService.productListCat('Category')

  fetchProdGroup = () => ProductService.productListCat('Group')
  fetchTaxData = () => TaxService.taxList('ALL')
  fetchProdUnit = () => ProductService.productListCat('Unit')

  // fetchChartOfAccount = () => ChartOfAccService.listAllAccounts('ALL')
  fetchChartOfAccount = orgCode => ChartOfAccService.ChartOfAllAcount(orgCode)

  componentDidMount = () => {
    const org = store.get('selectedOrg')

    // console.log(this.props, 'props')
    const getAllData = async () => {
      const [prodCat, prodGroup, prodUnit, chartOfAccount, taxData] = await axios.all([
        this.fetchProdCat(),
        this.fetchProdGroup(),
        this.fetchProdUnit(),
        this.fetchChartOfAccount(org.orgCode),
        this.fetchTaxData(),
      ])

      // console.log(chartOfAccount, '&& chartOfAccount.data')
      this.setState({
        productCat: (prodCat && prodCat.data) || [],
        productGrp: (prodGroup && prodGroup.data) || [],
        productUnit: (prodUnit && prodUnit.data) || [],
        chartOfAccount: (chartOfAccount && chartOfAccount) || [],
        taxData: taxData || [],
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
    const { isLoading, isSalesSelected, isPurchaseSelected, isStockSelected } = this.state
    // values.purchase = values.purchase && values.purchase.length ? true : false
    // values.sales = values.sales && values.sales.length ? true : false
    values.id = 0

    const method = 'post'
    // values.description = ''
    // values.image = 'string'
    // values.imageId = 'string'
    // values.minimum = 0
    // values.price = 0
    // values.purchase_amount = 0
    // values.purchase_discount = 0
    // values.quanitities_in_cart = 0
    // values.rating = 0
    // values.special = true
    // // values.stock = true
    // values.tax = 0
    // values.thumb = 'string'
    // values.quantity = 0
    // values.thumbId = 'string'
    values.invStartDate = document.getElementById('invStartDate')
      ? moment(document.getElementById('invStartDate').value).format('MM/DD/YYYY')
      : ''
    // if (id) {
    //   method = 'put'
    //   values.id = id
    // }

    // values.created_by = 'Asad'
    // values.customer_email = 'asad@gmail.com'
    // handleName('4', '8')

    if (!isSalesSelected) {
      values.sale_unit_price = 0
      values.sale_account = 0
      values.sale_tax_rate = 0
      values.sale_desc = ''
    } else if (!isPurchaseSelected) {
      values.purchase_unit_price = 0
      values.purchase_account = 0
      values.purchase_tax_rate = 0
      values.purchase_desc = ''
    }

    // handleChange({ value: 101, label: 'Laptop', key: 101 },tempData, 'productForm')
    // console.log(values, 'Values***********')
    const fetchData = async () => {
      const result = await ProductService.createProduct(values, method)
      // this.onFinish()
      // console.log(result, 'product result')
      if (result.data && result.data.message === 'Name already exist.') {
        return notification.warning({
          message: 'Product Not created',
          description: 'Name already exist.',
          duration: 6,
        })
      }

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
              'productName',
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

  // handleQuantity = e => {
  //   const value = this.formRef.current.getFieldValue('purchase_unit_price') || 0
  //   // console.log(e, 'e', e, value)
  //   this.formRef.current.setFieldsValue({ stockValue: e * value })
  //   // this.setState({
  //   //   stockValue: e * value,
  //   // })
  // }

  handleType = val => {
    // console.log(val, 'val')
    this.setState({
      productType: val,
    })
  }

  handleQuantity = (e, value) => {
    const stock = this.formRef.current.getFieldValue('quantity') || 0
    const rate = this.formRef.current.getFieldValue('openingRate') || 0
    // console.log(e, 'e', e, value)
    if (value === 'stock') {
      this.formRef.current.setFieldsValue({ stockValue: e * rate })
    } else {
      this.formRef.current.setFieldsValue({ stockValue: e * stock })
    }

    // this.setState({
    //   stockValue: e * value,
    // })
  }

  handleCheckBox = (e, key) => {
    // console.log(e, key)
    this.setState({
      [key]: e.target.checked,
    })
  }

  render() {
    const { headingText, visible, productData, productId } = this.props
    const {
      productCat,
      productGrp,
      productUnit,
      productType,
      chartOfAccount,
      taxData,
      isSalesSelected,
      isPurchaseSelected,
      isStockSelected,
    } = this.state
    // console.log(chartOfAccount, 'props create Modal')
    const { stockValue } = this.state
    // const getData = async () => {
    // const data = []
    // _.forEach(productData, (value, key) => {
    //   data.push({
    //     name: [key],
    //     value,
    //   })
    // })
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
                fields={defaultData}
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
                      <Select
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder=""
                      >
                        {productGrp.map((item, index) => {
                          return (
                            <Option key={item.groupId} value={item.groupId}>
                              {item.groupName}
                            </Option>
                          )
                        })}
                      </Select>
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item name="category" label="Category">
                      <Select
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder=""
                      >
                        {productCat.map((item, index) => {
                          return (
                            <Option key={item.catId} value={item.catId}>
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
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Please enter code!',
                      //   },
                      // ]}
                    >
                      <Input placeholder="Product Code" disabled />
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
                            <Option key={item.unitId} value={item.unitId}>
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
                          <Checkbox onChange={e => this.handleCheckBox(e, 'isSalesSelected')}>
                            I Sell this product
                          </Checkbox>
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
                              <Input placeholder="" disabled={!isSalesSelected} />
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
                                disabled={!isSalesSelected}
                              >
                                {chartOfAccount.map((item, index) => (
                                  <Option value={item.id} key={item.id}>
                                    {item.actname}
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
                              <Select
                                showSearch
                                filterOption={(input, option) =>
                                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                disabled={!isSalesSelected}
                              >
                                {taxData.map((item, index) => (
                                  <Option value={item.id} key={item.id}>
                                    {`${item.tax_name}(${item.rate})`}
                                  </Option>
                                ))}
                              </Select>
                              {/* <InputNumber placeholder="" /> */}
                            </Form.Item>
                          </div>
                          <div className="col-md-12">
                            <Form.Item name="sale_desc" label="Sales Description">
                              <TextArea disabled={!isSalesSelected} />
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
                          <Checkbox onChange={e => this.handleCheckBox(e, 'isPurchaseSelected')}>
                            I Purchase this product
                          </Checkbox>
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
                              <Input placeholder="" disabled={!isPurchaseSelected} />
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
                                disabled={!isPurchaseSelected}
                              >
                                {chartOfAccount.map((item, index) => (
                                  <Option value={item.id} key={item.id}>
                                    {item.actname}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>
                          <div className="col-md-4">
                            <Form.Item name="purchase_tax_rate" label="Tax rate">
                              <Select
                                showSearch
                                filterOption={(input, option) =>
                                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                disabled={!isPurchaseSelected}
                              >
                                {taxData.map((item, index) => (
                                  <Option value={item.id} key={item.id}>
                                    {`${item.tax_name}(${item.rate})`}
                                  </Option>
                                ))}
                              </Select>
                              {/* <InputNumber placeholder="" /> */}
                            </Form.Item>
                          </div>
                          <div className="col-md-12">
                            <Form.Item name="purchase_desc" label="Purchases Description">
                              <TextArea disabled={!isPurchaseSelected} />
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
                            <Checkbox onChange={e => this.handleCheckBox(e, 'isStockSelected')}>
                              Enable Tracking
                            </Checkbox>
                          </Form.Item>
                        </div>
                        <div className="col-md-2">
                          <Form.Item name="quantity" label="Opening Stock">
                            <InputNumber
                              placeholder=""
                              onChange={e => this.handleQuantity(e, 'stock')}
                              disabled={!isStockSelected}
                            />
                          </Form.Item>
                        </div>
                        <div className="col-md-1">*</div>
                        <div className="col-md-2">
                          <Form.Item name="openingRate" label="Opening Rate">
                            <InputNumber
                              placeholder=""
                              onChange={e => this.handleQuantity(e, 'rate')}
                              disabled={!isStockSelected}
                            />
                          </Form.Item>
                        </div>
                        <div className="col-md-1">=</div>
                        <div className="col-md-2">
                          <Form.Item name="stockValue" label="Opening Value">
                            <InputNumber placeholder="" disabled />
                          </Form.Item>
                        </div>
                        <div className="col-md-4">&nbsp;</div>
                        <div className="col-md-3">
                          <Form.Item name="invStartDate" label="Inventory Start Date">
                            <DatePicker
                              // onChange={this.handleStDate}
                              // defaultValue={moment(new Date(), 'YYYY/MM/DD')}
                              format="YYYY/MM/DD"
                              disabled={!isStockSelected}
                              // value={moment(purchaseDate, 'YYYY/MM/DD')}
                            />
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
