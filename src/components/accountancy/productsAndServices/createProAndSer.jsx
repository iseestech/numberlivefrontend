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
  DatePicker,
  Divider,
  Space,
  notification,
  Row,
  Col,
} from 'antd'
import { history } from '@/main'
import axios from 'axios'
import moment from 'moment'
import ProductService from '@/services/products'
import ChartOfAccService from '@/services/chartOfAccount'
import { useNavigate, Link } from 'react-router-dom'
import store from 'store'
import HelperFunction from '@/services/helper'
import { connect } from 'react-redux'
import './index.scss'

import { PlusOutlined } from '@ant-design/icons'

// import ChartOfAccountOnType from '../common/chartOfAccountOnType'
import TaxOnType from '../common/taxOnType'
import TaxService from '@/services/settings'
import CreateUnit from '../settings/units/createUnit'
import UnitList from '../settings/units/unitList'
import CreateTax from '../settings/taxes/createTax'
import WithRouter from '@/WithRouter'
import _ from 'lodash'
const { confirm } = Modal
const { Group } = Checkbox
const { TextArea } = Input
const { Option } = Select
const selOrgData = store.get('selectedOrg')

const optionsWithPurchase = [{ label: 'I Purchase this product', value: true }]
const optionsWithSale = [{ label: 'I Sell this product', value: true }]

// const mapStateToProps = ({ router }) => ({
//   routerData: router,
// })

class CreateProAndSer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      isSalesSelected: true,
      isPurchaseSelected: true,
      isStockSelected: true,
      isTaxModalVisible: false,
      typeVal: 'Group',
      groupModal: false,
      productType: 'goods',
      productDetails: {},
      action: 'Create',
      stockValue: 0,
      productCat: [],
      productGrp: [],
      productUnit: [],
      chartOfAccount: [],
      productData: [],
      taxData: [],
      isDirty: false,
      defaultData: [
        { name: 'sales', value: true },
        { name: 'purchase', value: true },
        { name: 'stock', value: true },
        { name: 'invStartDate', value: moment(new Date()) },
      ],
    }
    this.formRef = React.createRef()
  }

  formValuesChange = e => {
    const isDirty = Object.keys(e).length
    this.setState({ isDirty })
  }

  fetchProdCat = () => ProductService.productListCat('Category')

  fetchProdGroup = () => ProductService.productListCat('Group')
  fetchProdUnit = () => ProductService.productListCat('Unit')
  fetchTaxData = () => TaxService.taxList('ALL')
  // fetchChartOfAccount = () => ChartOfAccService.listAllAccounts('ALL')
  fetchChartOfAccount = orgCode => ChartOfAccService.ChartOfAllAcount(orgCode)
  fetchProdData = id => ProductService.getProduct(id, 'post')

  componentDidMount = () => {
    const org = store.get('selectedOrg')
    // console.log(this.props, 'props')
    const { id: prodId } = this.props.params
    console.log('prodId', prodId, this.props)
    const { defaultData } = this.state
    let data = []
    let services = [
      this.fetchProdCat(),
      this.fetchProdGroup(),
      this.fetchProdUnit(),
      this.fetchChartOfAccount(org.orgCode),
      this.fetchTaxData(),
    ]
    if (prodId) {
      services.push(this.fetchProdData(prodId))
    }
    const getAllData = async () => {
      if (prodId) {
        HelperFunction.isLoadingRequest(true)
        // console.log(prodId, 'IN IIIIIIFFF')
        var [prodCat, prodGroup, prodUnit, chartOfAccount, taxData, productData] = await axios.all(
          services,
        )
        HelperFunction.isLoadingRequest(false)
        // console.log('productData', productData)
        const { prodData } = productData.data || {}
        _.forEach(productData.data, (val, key) => {
          data.push({
            name: [key],
            value: key === 'invStartDate' ? moment(val) : val,
          })
        })
        this.setState(
          {
            defaultData: data,
            productData: productData.data || [],
            // productCat: (prodCat && prodCat.data) || [],
            productCat: [] || [],
            productGrp: (prodGroup && prodGroup.data) || [],
            productUnit: (prodUnit && prodUnit.data) || [],
            taxData: taxData || [],
            chartOfAccount: (chartOfAccount && chartOfAccount) || [],
            productType: productData && productData.data ? productData.data.product_type : 'goods',
            isSalesSelected: productData.data.sales,
            isPurchaseSelected: productData.data.purchase,
            isStockSelected: productData.data.stock,
          },
          () => this.getCategoryByGrpId(productData?.data?.groupId || '', false),
        )
      } else {
        // HelperFunction.isLoadingRequest(true)
        // console.log(prodId, 'IN Else')
        var [prodCat, prodGroup, prodUnit, chartOfAccount, taxData, productData] = await axios.all(
          services,
        )
        HelperFunction.isLoadingRequest(false)

        this.setState({
          // defaultData: data,
          productData: (productData && productData.data) || [],
          // productCat: (prodCat && prodCat.data) || [],
          productCat: [] || [],
          productGrp: (prodGroup && prodGroup.data) || [],
          productUnit: (prodUnit && prodUnit.data) || [],
          taxData: taxData || [],
          chartOfAccount: (chartOfAccount && chartOfAccount) || [],
          productType: productData && productData.data ? productData.data.product_type : 'goods',
        })
      }

      // console.log(data, '&& chartOfAccount.data')
      // this.setState({
      //   defaultData: data,
      //   productData: (productData && productData.data) || [],
      //   productCat: (prodCat && prodCat.data) || [],
      //   productGrp: (prodGroup && prodGroup.data) || [],
      //   productUnit: (prodUnit && prodUnit.data) || [],
      //   taxData: taxData || [],
      //   chartOfAccount: (chartOfAccount && chartOfAccount) || [],
      //   productType: productData && productData.data ? productData.data.product_type : 'goods',
      // })
    }
    getAllData()
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  showGroupModal = (e, val) => {
    this.setState({
      groupModal: true,
      typeVal: val,
    })
  }

  hideGroupModal = () => {
    this.setState({
      groupModal: false,
    })
  }

  handleOk = values => {
    this.setState({
      visible: false,
    })
  }

  getCreatedData = obj => {
    const { productGrp, productCat, productUnit, typeVal } = this.state
    // console.log(obj, 'obj')

    if (typeVal === 'Group') {
      productGrp.push(obj)
      this.formRef.current.setFieldsValue({ groupId: obj.groupId })
      this.setState({
        productGrp,
      })
    } else if (typeVal === 'Category') {
      productCat.push(obj)

      this.formRef.current.setFieldsValue({ catId: obj.catId })
      this.setState({
        productCat,
      })
    } else if (typeVal === 'Unit') {
      productUnit.push(obj)
      this.formRef.current.setFieldsValue({ unit: obj.unitId })
      this.setState({
        productUnit,
      })
    }
  }

  onFinish = values => {
    // console.log('onFinish values', values, this.props)
    const {params, productId, isOutside, handleChange, fromModal } = this.props
    const { id } = params
    // const id = productId
    const { isLoading, isSalesSelected, isPurchaseSelected, isStockSelected } = this.state

    let method = 'post'
    values.invStartDate = document.getElementById('invStartDate')
      ? moment(document.getElementById('invStartDate').value).format('MM/DD/YYYY')
      : ''
    // console.log(values, 'values')
    if (id) {
      method = 'put'
      values.id = id
    }

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
    // console.log(values, method)
    // values.created_by = 'Asad'
    // values.customer_email = 'asad@gmail.com'
    // handleName('4', '8')

    // handleChange({ value: 101, label: 'Laptop', key: 101 },tempData, 'productForm')
    // console.log(values, 'Values***********')
    const fetchData = async () => {
      const result = await ProductService.createProduct(values, method)
      // this.onFinish()
      // console.log(result, 'result fetchData')
      if (result && result.data && result.data.message === 'Name already exist.') {
        return notification.warning({
          message: 'Product Not created',
          description: 'Name already exist.',
          duration: 6,
        })
      }

      // console.log(result, 'product result')

      if (!fromModal) {


        // this.setState(
        //   {
        //     isDirty: false,
        //   },
        //   () => history.push('/products-and-services/products'),
        // )


         this.setState(
           {
             isDirty: false,
           },
           () => {
             this.props.navigate("/products-and-services/products");
           },
         );
      } else {
        // getData({ customerId : 5 })
        // handleNewCustomer(result.data.data || [])

        this.props.showModal()
        handleChange({ value: '101', label: 'name', key: '101' }, result.data.data, 'productName')
      }

      // this.setState(
      //   {
      //     isDirty: false,
      //   },
      //   () => history.push('/products-and-services/products'),
      // )
    }
    return fetchData()
  }

  onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo)
  }

  // handleCancel = () => {
  //   this.props.showModal()
  //   this.setState({
  //     visible: false,
  //   })
  // }

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

  handleType = val => {
    // console.log(val, 'val')
    this.setState({
      productType: val,
    })
  }

  showTaxModal = () => {
    this.setState({
      isTaxModalVisible: true,
    })
  }

  getTaxData = () => {
    productGrp.push(obj)
    this.formRef.current.setFieldsValue({ groupId: obj.groupId })
    this.setState({
      productGrp,
    })
  }

  handleCheckBox = (e, key) => {
    // console.log(e, key)
    this.setState({
      [key]: e.target.checked,
    })
  }

  getCategoryByGrpId = (e, val) => {
    // console.log(e, val, '3333')
    const { id: prodId } = this.props.params
    // console.log('getCategoryByGrpId')
    if (e) {
      const fetchData = async () => {
        const result = await ProductService.getCategoryByGroup(e)
        if (val !== false) {
          this.formRef.current.setFieldsValue({ catId: '' })
        }
        this.setState({
          productCat: result?.data || [],
        })
      }
      fetchData()
    }
  }

  render() {
    const { headingText, visible, productId } = this.props
    const {
      productCat,
      productGrp,
      productUnit,
      productType,
      chartOfAccount,
      productData,
      taxData,
      groupModal,
      typeVal,
      isTaxModalVisible,
      isDirty,
      defaultData,
      isSalesSelected,
      isPurchaseSelected,
      isStockSelected,
    } = this.state

    // const isSaleSelected = this.formRef.current
    //   ? this.formRef.current.getFieldValue('sales')
    //   : false
    // const isPurchaseSelected = this.formRef.current
    //   ? this.formRef.current.getFieldValue('purchase')
    //   : false

    // const isStock = this.formRef.current ? this.formRef.current.getFieldValue('stock') : false

    // console.log(isSalesSelected, 'isPurchaseSelected', isPurchaseSelected)
    const { id } = this.props.params
    if (id) {
    } else {
    }
    const { stockValue } = this.state
    // const getData = async () => {

    // _.forEach(productData, (val, key) => {
    //   data.push({
    //     name: [key],
    //     value: key === 'invStartDate' ? moment(val) : val,
    //   })
    // })
    // console.log(data)
    const action = id ? 'Update' : 'Create'
    // this.props.match.params
    // }
    console.log('defaultData', defaultData)
    return (
      <div>
        {/* <Button type="primary" onClick={this.showModal} className="me-3">
          {headingText}
        </Button> */}
        <div className="">
          <div className="">
            <Form
              layout="horizontal"
              fields={defaultData}
              ref={this.formRef}
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
              onValuesChange={this.formValuesChange}
              className="form__layout--css"
            >
              <Row className="mb-3 form__header--css">
                <Col span={20} style={{ fontSize: '18px' }}>
                  New Product/Service
                </Col>
                <Col span={4} className="text-end">
                  <Button type="default" className="text-center me-2" htmlType="submit">
                    <Link to="/products-and-services/products">Cancel</Link>
                  </Button>
                  <Button
                    type="primary"
                    size="medium"
                    className="text-center"
                    htmlType="submit"
                    // loading={isLoading}
                  >
                    {action}
                  </Button>
                </Col>
              </Row>

              <div className="form__content--css">
                <Row className="form__body-content">
                  <Col span={24} className="fs-13 text-uppercase mb-3">
                    <span className="bulletIcon">Basic Information</span>
                  </Col>
                  <Col span={24}>
                    <Row>
                      <Col span={11}>
                        <Form.Item
                          name="product_type"
                          label="Product Type"
                          className="form__input--label"
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
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row>
                      <Col span={11}>
                        <Form.Item
                          name="groupId"
                          className="form__input--label not--required--field"
                          label="Group"
                        >
                          <Select
                            showSearch
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={this.getCategoryByGrpId}
                            placeholder=""
                            popupRender={menu => (
                              <div>
                                <Divider style={{ margin: '4px 0' }} />
                                {/* <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                              <CreateProductModal headingText="Add Product" />
                            </div> */}
                                <Button
                                  onClick={e => this.showGroupModal(e, 'Group')}
                                  className="selectDropDownBtn"
                                >
                                  <span>
                                    <PlusOutlined /> Add Group
                                  </span>
                                </Button>
                                {menu}
                              </div>
                            )}
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
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row>
                      <Col span={11}>
                        <Form.Item
                          name="catId"
                          className="form__input--label not--required--field"
                          label="Category"
                        >
                          <Select
                            showSearch
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            placeholder=""
                            popupRender={menu => (
                              <div>
                                <Divider style={{ margin: '4px 0' }} />
                                {/* <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                              <CreateProductModal headingText="Add Product" />
                            </div> */}
                                <Button
                                  // type="primary"
                                  onClick={e => this.showGroupModal(e, 'Category')}
                                  className="selectDropDownBtn"
                                >
                                  <span>
                                    <PlusOutlined /> Add Category
                                  </span>
                                </Button>
                                {menu}
                              </div>
                            )}
                            // disabled={!productCat.length && true}
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
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row>
                      <Col span={11}>
                        <Form.Item
                          name="product_code"
                          className="form__input--label not--required--field"
                          label="Product Code"
                        >
                          <Input placeholder="Product Code" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row>
                      <Col span={11}>
                        <Form.Item
                          name="name"
                          label="Product Name"
                          className="form__input--label"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter Name!',
                            },
                          ]}
                        >
                          <Input placeholder="" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row>
                      <Col span={11}>
                        <Form.Item
                          name="unit"
                          label="Unit Of Measurement"
                          className="form__input--label "
                          rules={[
                            {
                              required: true,
                              message: 'Please select Unit!',
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            placeholder="Select product Unit"
                            popupRender={menu => (
                              <div>
                                <Divider style={{ margin: '4px 0' }} />
                                {/* <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                            <CreateProductModal headingText="Add Product" />
                          </div> */}
                                <Button
                                  // type="primary"
                                  onClick={e => this.showGroupModal(e, 'Unit')}
                                  className="selectDropDownBtn"
                                >
                                  <span>
                                    <PlusOutlined /> Add Unit
                                  </span>
                                </Button>
                                {menu}
                              </div>
                            )}
                          >
                            {productUnit.map((item, index) => {
                              return (
                                <Option key={item.unitId} value={item.unitId}>
                                  {item.unitName}
                                </Option>
                              )
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <hr />
                  </Col>

                  <Col span={12}>
                    <Row>
                      <Col span={22}>
                        <Form.Item
                          name="sales"
                          className="form__input--label"
                          label={null}
                          valuePropName="checked"
                        >
                          {/* <Group options={optionsWithSale} /> */}
                          <Checkbox onChange={e => this.handleCheckBox(e, 'isSalesSelected')}>
                            I Sell this product
                          </Checkbox>
                        </Form.Item>
                      </Col>

                      <Col span={22}>
                        <Form.Item
                          name="sale_unit_price"
                          label="Unit Price"
                          className="form__input--label"
                          rules={[
                            {
                              required: isSalesSelected && true,
                              message: 'Please enter Unit Price!',
                            },
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            placeholder=""
                            precision={selOrgData?.decimals}
                            disabled={!isSalesSelected}
                            onKeyDown={HelperFunction.isValidNumber}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={22}>
                        <Form.Item
                          name="sale_account"
                          className="form__input--label not--required--field"
                          label="Sales Account"
                          // rules={[
                          //   {
                          //     required: true,
                          //     message: 'Please select Sale Account!',
                          //   },
                          // ]}
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
                                {item.actName}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={22}>
                        <Form.Item
                          name="sale_tax_rate"
                          className="form__input--label not--required--field"
                          label="Tax rate"
                        >
                          {/* <Select>
                                <Option key="0">Test </Option>
                                <Option key="0">Demo</Option>
                              </Select> */}
                          <Select
                            showSearch
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            popupRender={menu => (
                              <div>
                                <Divider style={{ margin: '4px 0' }} />
                                {/* <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                    <CreateProductModal headingText="Add Product" />
                                  </div> */}
                                <Button
                                  onClick={e => this.showTaxModal(e, 'sale')}
                                  className="selectDropDownBtn"
                                >
                                  <span>
                                    <PlusOutlined /> Add Sales Tax
                                  </span>
                                </Button>
                                {menu}
                              </div>
                            )}
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
                      </Col>
                      <Col span={22}>
                        <Form.Item
                          name="sale_desc"
                          className="form__input--label not--required--field"
                          label="Sales Description"
                        >
                          <TextArea disabled={!isSalesSelected} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Row style={{ justifyContent: 'right' }}>
                      <Col span={22}>
                        <Form.Item
                          className="form__input--label "
                          name="purchase"
                          label={null}
                          valuePropName="checked"
                        >
                          {/* <Group options={optionsWithPurchase} /> */}
                          <Checkbox onChange={e => this.handleCheckBox(e, 'isPurchaseSelected')}>
                            I Purchase this product
                          </Checkbox>
                        </Form.Item>
                      </Col>

                      <Col span={22}>
                        <Form.Item
                          name="purchase_unit_price"
                          label="Unit Price"
                          className="form__input--label"
                          rules={[
                            {
                              required: isPurchaseSelected && true,
                              message: 'Please enter Unit Price!',
                            },
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            placeholder=""
                            precision={selOrgData?.decimals}
                            disabled={!isPurchaseSelected}
                            onKeyDown={HelperFunction.isValidNumber}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={22}>
                        <Form.Item
                          name="purchase_account"
                          label="Purchases Account"
                          className="form__input--label not--required--field"
                          // rules={[
                          //   {
                          //     required: true,
                          //     message: 'Please select Purchase Account!',
                          //   },
                          // ]}
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
                                {item.actName}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={22}>
                        <Form.Item
                          className="form__input--label not--required--field"
                          name="purchase_tax_rate"
                          label="Tax rate"
                        >
                          <Select
                            showSearch
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            popupRender={menu => (
                              <div>
                                <Divider style={{ margin: '4px 0' }} />
                                {/* <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                    <CreateProductModal headingText="Add Product" />
                                  </div> */}
                                <Button
                                  // type="primary"
                                  onClick={e => this.showTaxModal(e, 'purchase')}
                                  className="selectDropDownBtn"
                                >
                                  <span>
                                    <PlusOutlined /> Add Purchase Tax
                                  </span>
                                </Button>
                                {menu}
                              </div>
                            )}
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
                      </Col>
                      <Col span={22}>
                        <Form.Item
                          name="purchase_desc"
                          className="form__input--label not--required--field"
                          label="Purchases Description"
                        >
                          <TextArea disabled={!isPurchaseSelected} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                  {productType !== 'service' && (
                    <Col span={24}>
                      <hr />
                      <Row>
                        <Col span={11}>
                          <Form.Item
                            name="stock"
                            className="form__input--label not--required--field"
                            label={null}
                            valuePropName="checked"
                          >
                            {/* <Group options={optionsWithSale} /> */}
                            <Checkbox onChange={e => this.handleCheckBox(e, 'isStockSelected')}>
                              Enable Tracking
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Row>
                            <Col span={11}>
                              <Form.Item
                                className="form__input--label not--required--field"
                                name="quantity"
                                label="Opening Stock"
                              >
                                <InputNumber
                                  style={{ width: '100%' }}
                                  placeholder=""
                                  onChange={e => this.handleQuantity(e, 'stock')}
                                  disabled={!isStockSelected}
                                  onKeyDown={HelperFunction.isValidNumber}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={24}>
                          <Row>
                            <Col span={11}>
                              <Form.Item
                                className="form__input--label not--required--field"
                                name="openingRate"
                                label="Opening Rate"
                              >
                                <InputNumber
                                  style={{ width: '100%' }}
                                  placeholder=""
                                  precision={selOrgData?.decimals}
                                  onChange={e => this.handleQuantity(e, 'rate')}
                                  disabled={!isStockSelected}
                                  onKeyDown={HelperFunction.isValidNumber}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={24}>
                          <Row>
                            <Col span={11}>
                              <Form.Item
                                name="stockValue"
                                className="form__input--label not--required--field"
                                label="Opening Value"
                              >
                                <InputNumber style={{ width: '100%' }} placeholder="" disabled />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={24}>
                          <Row>
                            <Col span={11}>
                              <Form.Item
                                name="invStartDate"
                                className="form__input--label not--required--field"
                                label="Inventory Start Date"
                              >
                                <DatePicker
                                  style={{ width: '100%' }}
                                  format="DD MMM YYYY"
                                  disabled={!isStockSelected}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  )}
                </Row>
                <div className="text-end">
                  <hr />
                  <Button type="default" size="medium" className="text-center me-2">
                    <Link to="/products-and-services/products">Cancel</Link>
                  </Button>
                  <Button
                    type="primary"
                    size="medium"
                    htmlType="submit"
                    className="btn btn-success me-3"
                  >
                    {action}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
        {groupModal && (
          <Modal
            title={`Create ${typeVal}`}
            visible={groupModal}
            onCancel={this.hideGroupModal}
            style={{ width: '700px' }}
            footer={null}
          >
            {/* <UnitList /> */}
            <CreateUnit
              type={typeVal}
              singleRecord={{}}
              action={'Add'}
              closeModal={this.hideGroupModal}
              dataSource={productGrp || []}
              createdData={this.getCreatedData}
              fromProduct={true}
            />
          </Modal>
        )}
        {isTaxModalVisible && (
          <Modal
            title="Create Tax"
            footer={null}
            visible={isTaxModalVisible}
            onOk={() => this.setState({ isTaxModalVisible: false })}
            onCancel={() => this.setState({ isTaxModalVisible: false })}
          >
            <CreateTax
              onCancel={() => this.setState({ isTaxModalVisible: false })}
              getTaxData={this.getTaxData}
            />
          </Modal>
        )}
      </div>
    )
  }
}

// export default connect()(CreateProAndSer)

export default connect()(WithRouter(CreateProAndSer));