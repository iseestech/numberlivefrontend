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
} from 'antd'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import { MenuOutlined, PlusOutlined } from '@ant-design/icons'
// import { arrayMove } from "@dnd-kit/sortable";
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import axios from 'axios'
import CreateCustomer from '@/components/accountancy/contacts/createCustomer'
import ProductService from '@/services/products'
import PhysicalStocsService from '@/services/physicalStocks'
import { history } from '@/main'
import './index.scss'

const { TextArea } = Input
const { Option } = Select

class CreateStockEntry extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      prodData: [],
    }
    // This binding is necessary to make `this` work in the callback
    this.onFinish = this.onFinish.bind(this)
    this.onFinishFailed = this.onFinishFailed.bind(this)
    this.formRef = React.createRef()
  }

  fetchProdData = () => ProductService.productList()

  componentDidMount = () => {
    const getAllData = async () => {
      const [productData] = await axios.all([this.fetchProdData()])
      // console.log(fetchTaxData, 'fetchTaxData')
      if (productData && productData.data.length) {
        productData.data.forEach((ele, i) => {
          ele.key = i + 1
        })
      }
      this.setState({ prodData: productData.data })
    }
    getAllData()
  }

  onFinish = values => {
    // console.log(values, 'Values')
    const { productName } = values
    values.difference = values.systemStock - values.physicalStock
    values.phyStockDate = new Date().toLocaleDateString()
    values.productName = productName.value
    // console.log(values, 'values')
    const fetchData = async () => {
      const result = await PhysicalStocsService.createPhysicalStock(values, 'post')
      // this.onFinish()
      history.push('/inventory/physicalStocks')
    }

    fetchData()
  }

  onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo)
  }

  handleName = e => {
    // console.log(e, 'e')
    const { prodData } = this.state

    const prod = prodData.filter(item => item.name === e.value)
    this.formRef.current.setFieldsValue({ systemStock: prod[0].purchase_qty })
    // const { dataSource, prodData } = this.state

    // let prodItem = []

    // console.log(e, record, 'from handleNAme')
    // dataSource.forEach(element => {
    //   if (element.id === record.id) {
    //     prodItem = prodData.filter(item => item.id === parseInt(e.value, 10))
    //     Object.assign(element, prodItem[0])
    //     element = e.label
    //   }
    // })
    // console.log(dataSource, 'dataSource')
    // this.setState(
    //   {
    //     dataSource,
    //   },
    //   () => this.handleChange(e, prodItem[0]),
    // )
  }

  render() {
    const { prodData } = this.state
    return (
      <>
        <Form
          layout="vertical"
          onFinish={this.onFinish}
          ref={this.formRef}
          onFinishFailed={this.onFinishFailed}
          style={{ width: '40%', margin: '0 auto', border: '1px solid #ccc', padding: '15px' }}
        >
          <div className="row">
            <div className="col-sm-12">
              <Form.Item name="productName" label="Product Name">
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Enter Name"
                  labelInValue
                  onChange={e => this.handleName(e)}
                >
                  {prodData.map((item, index) => (
                    <Option key={item.id} value={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="systemStock" label="System Stocks">
                <Input />
              </Form.Item>
              <Form.Item name="physicalStock" label="Physical Stocks">
                <Input />
              </Form.Item>
            </div>
            <div className="col-sm-12 text-center" style={{ padding: '15px;' }}>
              <Button type="default" className="text-center" htmlType="submit">
                <strong>
                  <Link to="/inventory/physicalStocks">Cancel</Link>
                </strong>
              </Button>
              <Button type="primary" className="text-center" htmlType="submit">
                <strong>Add</strong>
              </Button>
            </div>
          </div>
        </Form>
      </>
    )
  }
}

const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})

export default connect(mapStateToProps)(CreateStockEntry)

