import React, { useContext, useState, useEffect, useRef } from 'react'
import {
  Table,
  Popconfirm,
  Button,
  Input,
  Form,
  Select,
  Divider,
  Space,
  Modal,
  DatePicker,
  Radio,
  AutoComplete,
  InputNumber,
  Row,
  Col,
} from 'antd'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import { MenuOutlined, PlusOutlined, TrophyOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import _, { set } from 'lodash'
import moment from 'moment'
import axios from 'axios'
import CreateCustomer from '@/components/accountancy/contacts/createCustomer'
import ProductService from '@/services/products'
import InventoryService from '@/services/inventory'
import ChartOfAccService from '@/services/chartOfAccount'
import PhysicalStocsService from '@/services/physicalStocks'
import { history } from '@/main'
import store from 'store'
import DisplayJournal from '@/components/accountancy/common/DisplayJournal'
import CreateInvAdj from './createInvAdj'
import './index.scss'
import WithRouter from "@/WithRouter";
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

class CreateInventoryAdjustment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDirty: false,

      modeValue: true,
      masterProdData: [],
      deleteProdIds: [],
      productData: [],
      chartOfAccount: [],
      selectedCategory: 'all',
      selectedGroup: 'all',
      categoryList: [],
      groupList: [],
      filterdCategoryList: [],
      filterProductData: [],
      dataSource: [{ key: '1' }],
      invFormData: [
        { name: 'modeOfAdjustment', value: 'quantity' },
        {
          name: 'productDetailsDto',
          value: [
            {
              id: 1,
              key: 0,
              // prdId:0,
              prdId: '',
              closingStock: null,
              newQty: '',
              qtyAdjusted: '',
              costPrize: '',
              reason: '',
              test: '',
            },
          ],
        },
      ],
      action: 'Create',
      mockData: {
        description: 'name',
        productDetailsDto: [
          {
            id: 1,
            key: 0,
            // prdId:0,
            prdId: '',
            closingStock: null,
            newQty: '',
            qtyAdjusted: '',
            costPrize: '',
            reason: '',
            test: '',
          },
        ],
      },
    }
    // This binding is necessary to make `this` work in the callback
    this.onFinish = this.onFinish.bind(this)
    this.onFinishFailed = this.onFinishFailed.bind(this)
    this.formRef = React.createRef()
  }

  fetchProdData = (currDate, orgCode) => InventoryService.getStockList(currDate, orgCode)

  fetchChartOfAccount = orgCode => ChartOfAccService.ChartOfAllAcount(orgCode)

  fetchCategoryList = () => ProductService.productListCat('Category')

  fetchGroupList = () => ProductService.productListCat('Group')

  handleChange = (e, key, record) => {
    // console.log(record, 'handleChange', key)
  }

  formValuesChange = e => {
    const isDirty = Object.keys(e).length
    this.setState({ isDirty })
  }

  componentDidMount = () => {
    const org = store.get('selectedOrg')
    const currDate = moment(new Date()).format('YYYY/MM/DD')
    // console.log(this.props, 'this props')
    const { params } = this.props
    // const { dataSource } = this.state

    const getAllData = async () => {
      const [productData, chartOfAccount, categoryList, groupList] = await axios.all([
        this.fetchProdData(currDate, org.orgCode),
        this.fetchChartOfAccount(org.orgCode),
        this.fetchCategoryList(),
        this.fetchGroupList(),
      ])
      // console.log(productData, 'productData')
      this.setState({
        productData: productData.data,
        masterProdData: productData.data,
        chartOfAccount: chartOfAccount || [],
        categoryList: categoryList.data || [],
        groupList: groupList.data || [],
        filterProductData: productData.data,
        filterdCategoryList: categoryList.data || [],
      })
    }

    if (params.stockId) {
      // console.log(params.stockId, 'quoteId ifff')
      const fetchData = async () => {
        const result = await InventoryService.getInventoryListById(params.stockId, 'post')
        // console.log(result.data, 'result')
        const data = []
        _.forEach(result.data, (val, key) => {
          // if (key !== 'productDetailsDto')
          data.push({
            name: key,
            value: key === 'date' || key === 'date' ? moment(val || new Date()) : val,
          })
        })

        this.setState({
          mockData: result.data,
          invFormData: data,
          action: 'Update',
        })
      }
      fetchData()
    }
    getAllData()
  }

  handleDelete = record => {
    // console.log(record, 'record')
    const { dataSource, total, subTotal } = this.state
    // this.setState({
    //   mockData: { user: dataSource.filter(item => item.key !== record.key) },
    //   total: total - record.amount,
    //   subTotal: subTotal - record.amount,
    // })
  }

  onFinish = values => {
    // console.log(values, 'Values')
    // const { productName } = values
    // values.difference = values.systemStock - values.physicalStock
    // values.phyStockDate = new Date().toLocaleDateString()
    // values.productName = productName.value
    const { deleteProdIds } = this.state

    values.date = moment(document.getElementById('date').value).format('MM/DD/YYYY')
    values.productId = deleteProdIds.toString()
    const { params } = this.props
    let method = 'post'
    if (params.stockId) {
      method = 'put'
      values.id = params.stockId
    }
    // console.log(values, 'values')
    const fetchData = async () => {
      const result = await InventoryService.createInvAdjustment(values, method)
      // this.onFinish()
      this.setState(
        {
          isDirty: false,
        },
        () => this.props.navigate('/inventory/inventory-adjustments'),
      )
    }

    fetchData()
  }

  onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo)
  }

  handleName = e => {
    // console.log(e, 'e')
    const { productData } = this.state

    const prod = productData.filter(item => item.id === e.value)
    this.formRef.current.setFieldsValue({ systemStock: prod[0].purchase_qty })
  }

  handleQtyValue = () => {
    const { modeValue } = this.state
    this.setState({
      modeValue: !modeValue,
    })
  }

  handleStDate = value => {
    const org = store.get('selectedOrg')
    const currDate = moment(value).format('YYYY/MM/DD')
    // this.fetchProdData(currDate, org.orgCode)
    const { mockData } = this.state
    mockData.productDetailsDto = [{}]
    const getAllData = async () => {
      const [productData] = await axios.all([this.fetchProdData(currDate, org.orgCode)])
      // console.log(productData, 'productData')
      this.formRef.current.setFieldsValue({ productDetailsDto: [] })
      this.setState({
        productData: productData?.data || [],
        masterProdData: productData?.data || [],
      })
    }

    getAllData()
  }

  handleAdd = () => {
    const { count, dataSource } = this.state
    const newData = {
      key: count,
      index: count,
      description: '',
      id: count,
    }

    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    })
  }

  handleAddRow = () => {
    const { mockData } = this.state
    const fields = this.formRef.current.getFieldsValue()

    const { productDetailsDto } = fields
    // console.log(productDetailsDto, 'productDetailsDto')
    mockData.productDetailsDto = productDetailsDto
    this.formRef.current.setFieldsValue({ productDetailsDto })
    this.setState({
      mockData,
    })
  }

  // updateQtyRow = (e, row, keyName, index) => {
  //   // console.log(e, '|', row, '|', keyName, '|', index)
  //   const { productData, mockData } = this.state
  //   const selectedProd = productData.filter(x => x.id === row.prdId)
  //   // console.log(selectedProd, 'selectedProd')
  //   const { productDetailsDto } = mockData
  //   // productDetailsDto[index][keyName] = e
  //   productDetailsDto[index].qtyAdjusted = row.productQty - e
  //   productDetailsDto[index][keyName] = e
  //   this.formRef.current.setFieldsValue({ productDetailsDto })
  // }

  updateRow = (e, row, keyName, index) => {
    // console.log(e, '|', row, '|', keyName, '|', index)
    const { productData, mockData, masterProdData } = this.state
    let idVal = e
    if (keyName === 'prdId') {
      idVal = e
    } else {
      idVal = row.prdId
    }
    const selectedProd = productData.filter(x => x.product_id === idVal)
    // console.log(selectedProd, 'selectedProd')
    const { productDetailsDto } = mockData
    if (selectedProd.length) {
      productDetailsDto[index][keyName] = e
      productDetailsDto[index].productQty = selectedProd[0].closing_stock
      productDetailsDto[index].productName = selectedProd[0].item_name
      if (keyName === 'updateQty') {
        productDetailsDto[index].qtyAdjusted = e - Number(row.productQty)
      } else if (keyName === 'qtyAdjusted') {
        productDetailsDto[index].updateQty = e - Number(row.productQty)
      } else {
        productDetailsDto[index].qtyAdjusted = 0
        productDetailsDto[index].updateQty = 0
      }
      this.formRef.current.setFieldsValue({ productDetailsDto })
      const prodData = _.cloneDeep(masterProdData)
      const prodId = []
      productDetailsDto.forEach(x => prodId.push(String(x.prdId)))
      // console.log(prodId, 'prodId', prodData)
      const data = prodData.map(x => {
        if (prodId.includes(String(x.product_id))) {
          x.disabled = true
        } else {
          x.disabled = false
        }
        return x
      })

      // mockData.productDetailsDto = productDetailsDto
      this.setState({ productData: data })
    }
  }

  handleDeleteRow = index => {
    // console.log(row, index, 'row, index')
    const { mockData, deleteProdIds } = this.state

    // const deleteProdIdVal = deleteProdIds || []
    // if (record.isDeleted === false) {
    //   deleteProdIdVal.push(record.id)
    // }
    const fields = this.formRef.current.getFieldsValue()
    const { productDetailsDto } = fields
    productDetailsDto.splice(index, 1)
    mockData.productDetailsDto = productDetailsDto
    // console.log(productDetailsDto, 'productDetailsDto', mockData.productDetailsDto)
    this.formRef.current.setFieldsValue({ productDetailsDto })
    this.setState({
      // deleteProdIds: deleteProdIdVal,
      deleteProdIds: [],
    })
  }

  handleGroupChange = e => {
    let filterdCategories
    let filterProductData
    const { categoryList, productData } = this.state
    if (e === 'all') {
      filterdCategories = categoryList
      filterProductData = productData
    } else {
      filterdCategories = categoryList.filter(ele => {
        return ele.groupName === e
      })

      filterProductData = productData.filter(ele => {
        return ele.groupName === e
      })
    }

    this.setState({
      selectedGroup: e,
      filterdCategoryList: filterdCategories,
      filterProductData,
      selectedCategory: 'all',
    })
  }

  handleCategoryChange = e => {
    const { productData, selectedGroup, selectedCategory } = this.state

    const filterProductData = productData.filter(product => {
      let groupFlag = false
      let catFlag = false

      if (selectedGroup === 'all') {
        groupFlag = true
      } else {
        groupFlag = selectedGroup === product.groupName
      }

      if (e === 'all') {
        catFlag = true
      } else {
        catFlag = e === product.catName
      }

      return catFlag && groupFlag
    })

    this.setState({
      selectedCategory: e,
      filterProductData,
    })
  }

  render() {
    const { params } = this.props

    const {
      modeValue,
      productData,
      invFormData,
      columns,
      dataSource,
      mockData,
      handleQtyColumns,
      action,
      isDirty,
      chartOfAccount,
      selectedCategory,
      selectedGroup,
      groupList,
      categoryList,
      filterdCategoryList,
      filterProductData,
    } = this.state
    return (
      <>
        <Form
          className=" inventory__adjustment--form form__layout--css"
          layout="horizontal"
          fields={invFormData}
          onFinish={this.onFinish}
          ref={this.formRef}
          onFinishFailed={this.onFinishFailed}
          onValuesChange={this.formValuesChange}
        >
          <Row className="mb-3 form__header--css">
            <Col span={20} style={{ fontSize: '18px' }}>
              {params?.stockId ? (
                <span>Edit: {params?.stockId}</span>
              ) : (
                'New Inventory Adjustment'
              )}
            </Col>
            <Col span={4} className="text-end">
              <Button type="default" className="text-center me-2" htmlType="submit">
                <Link to="/inventory/inventory-adjustments">Cancel</Link>
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

          <div className="form__content--css p-0">
            <Row className="form__body-content">
              <Col span={24} className="fs-13 text-uppercase mb-3">
                <span className="bulletIcon">Basic Information</span>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="modeOfAdjustment"
                      className="form__input--label not--required--field"
                      label="Mode of adjustment"
                    >
                      <Radio value="quantity" checked={modeValue}>
                        Quantity Adjustment
                      </Radio>
                      {/* <Radio value="value">Value Adjustment</Radio> */}
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="referenceNumber"
                      className="form__input--label not--required--field"
                      label="Reference Number"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="date"
                      label="Date"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please select date!',
                        },
                      ]}
                    >
                      <DatePicker
                        onChange={this.handleStDate}
                        style={{ width: '100%' }}
                        // defaultValue={moment(estimateDate, 'YYYY/MM/DD')}
                        format="DD MMM YYYY"
                        // value={moment(estimateDate, 'YYYY/MM/DD')}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="accId"
                      label="Account"
                      className="form__input--label"
                      rules={[
                        {
                          required: true,
                          message: 'Please select account!',
                        },
                      ]}
                    >
                      <Select placeholder="">
                        {chartOfAccount.map(
                          (item, index) =>
                            item.natureofaccount === 'ASSETS' && (
                              <Option value={item.id} key={item.id}>
                                {item.actName}
                              </Option>
                            ),
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={11}>
                    <Form.Item
                      name="discription"
                      className="form__input--label not--required--field"
                      label="Description"
                    >
                      <TextArea row={4} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <hr />
              </Col>
              <Col span={24} className="fs-13 text-uppercase mb-3">
                <div className="d-flex align-items-center ">
                  <span className="bulletIcon">Products</span>
                  <div className="ms-3 ">
                    filter: Group
                    <Select
                      style={{ width: 120 }}
                      placeholder="Group"
                      // labelInValue
                      // defaultValue={{ value: record.sale_tax_rate }}
                      value={selectedGroup}
                      onChange={e => this.handleGroupChange(e)}
                    >
                      <Option key="all" value="all">
                        All
                      </Option>
                      {groupList.map(item => (
                        <Option key={item.id} value={item.groupName}>
                          {item.groupName}
                        </Option>
                      ))}
                    </Select>
                    Category
                    <Select
                      style={{ width: 120 }}
                      placeholder="Category"
                      // labelInValue
                      // defaultValue={{ value: record.sale_tax_rate }}
                      value={selectedCategory}
                      onChange={e => this.handleCategoryChange(e)}
                    >
                      <Option key="all" value="all">
                        All
                      </Option>
                      {filterdCategoryList.map(item => (
                        <Option key={item.id} value={item.catName}>
                          {item.catName}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>
              </Col>
              <Col span={24}>
                <Form.List name="productDetailsDto">
                  {(productDetailsDto, options) => {
                    return (
                      <CreateInvAdj
                        productDetailsDto={productDetailsDto}
                        add={options.add}
                        remove={options.remove}
                        productData={
                          filterProductData?.length > 0 ? filterProductData : productData
                        }
                        handleDelete={this.handleDelete}
                        itemData={mockData.productDetailsDto || []}
                        updateRow={this.updateRow}
                        updateQtyRow={this.updateQtyRow}
                        handleAddRow={this.handleAddRow}
                        handleDeleteRow={this.handleDeleteRow}
                      />
                    )
                  }}
                </Form.List>
              </Col>
              {/* {!modeValue && (
              <div className="col-md-12">
                <Table
                  pagination={false}
                  dataSource={dataSource}
                  columns={this.handleValColumns}
                  rowKey="key"
                  scroll={{ x: 691 }}
                />
                <br />
              </div>
            )} */}
              {/* <div className="col-md-9">
              <Button
                onClick={this.handleAdd}
                type="primary"
                style={{
                  marginBottom: 16,
                }}
              >
                Add a row
              </Button>
            </div> */}
            </Row>
            <div className="text-end pb-3">
              <Button type="default" className="text-center me-2" htmlType="submit">
                <Link to="/inventory/inventory-adjustments">Cancel</Link>
              </Button>
              <Button type="primary" className="text-center me-3" htmlType="submit">
                {action}
              </Button>
            </div>
          </div></Form>
        <div>
          {/* <hr /> */}
          <DisplayJournal
            trId={params.stockId}
            formName="inventoryAdjustment"
            isJournal={false}
          />
        </div>
      </>
    )
  }
}

const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})

export default connect(mapStateToProps)(WithRouter(CreateInventoryAdjustment))


