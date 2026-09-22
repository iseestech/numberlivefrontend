import React, { useState, useEffect, use } from 'react'
import { DownOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Menu, Dropdown, notification, Button, Modal, Row, Col } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import ProductService from '@/services/products'
import { history } from '@/main'
import CreateProductModal from './createProductModal'
import tableData from './data.json'
import DisplayJournal from '../common/DisplayJournal'
import WithRouter from '@/WithRouter'
const { confirm } = Modal
const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const ProductDetails = props => {
  const location = useLocation()
  // console.log(routerData.match.path.split('/'), 'router')
  const routeName =  location?.pathname?.split('/')[2]
  // console.log(routerData.match, 'routerData.match')
  const [productData, getProduct] = useState([])
  const [visible, setVisible] = useState(false)
  const { id: prodId } = props.params

  const menu = (
    <Menu>
      {/* <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="">
          Mark as Inactive
        </a>
      </Menu.Item> */}
      <Menu.Item>
        <button
          style={{ border: 'none', background: 'none' }}
          type="button"
          onClick={() => deleteProduct(prodId)}
        >
          Delete
        </button>
      </Menu.Item>
    </Menu>
  )

  const showModal = () => {
    setVisible(!visible)
  }

  const loadData = () => {
    // console.log('loadData')
    const fetchData = async () => {
      const result = await ProductService.getProduct(prodId, 'post')
      setVisible(!visible)
      getProduct(result ? result.data : [])
    }
    fetchData()
  }

  const deleteProduct = id => {
    confirm({
      title: 'Do you Want to delete this item?',
      content: '',
      onOk() {
        const fetchData = async () => {
          const result = await ProductService.deleteActivity(id)
          // console.log(result, 'Result')
          if (result.statusCode === 409) {
            notification.warning({
              message: 'Warning',
              description: result.message,
              duration: 5,
            })
          }
          if (result.statusCode === 200) {
            notification.success({
              message: 'Success',
              description: 'Record deleted successfully!',
              duration: 5,
            })
            history.push('/products-and-services/products')
          }
        }
        fetchData()
      },
      onCancel() {
        // console.log('Cancel')
      },
    })
  }

  useEffect(() => {
    if (prodId) {
      const fetchData = async () => {
        const result = await ProductService.getProduct(prodId, 'post')
        getProduct(result ? result.data : [])
      }
      fetchData()
    }
  }, [prodId])
  // console.log(visible, 'prrrrrrrrr')
  return (
    <div className="details_layout--page">
      <Row className="mb-3 details__header--css">
        <Col span={18} style={{ fontSize: '18px' }}>
          Product Details: {prodId}
        </Col>
        <Col span={6} className="text-end">
          <Button type="default" className="text-center me-2" htmlType="submit">
            <Link to="/products-and-services/products">Back</Link>
          </Button>
          <Button type="success" className="me-2">
            <Link
              to={`/products-and-services/product/edit/${prodId}`}
              style={{ textTransform: 'capitalize' }}
            >
              <span className="editIcon">
                <EditOutlined />
              </span>
            </Link>
          </Button>
          <Button
            type="danger"
            danger
            // style={{ color: '#000' }}
            onClick={() => deleteProduct(prodId)}
          >
            <span className="editIcon">
              <DeleteOutlined />
            </span>
          </Button>
        </Col>
      </Row>
      <Row className="details__page--content">
        <Col span={24} className="fs-13 text-uppercase mb-3">
          <span className="bulletIcon">Basic Information</span>
        </Col>
        <Col span={24} className="pb-2">
          <Row>
            <Col span={4} className="product__info--label">
              Product Type
            </Col>
            <Col span={8} className="product__info--value">
              {productData.product_type}
            </Col>
          </Row>
        </Col>
        <Col span={24} className="pb-2">
          <Row>
            <Col span={4} className="product__info--label">
              Product Name
            </Col>
            <Col span={8} className="product__info--value">
              {productData.name}
            </Col>
          </Row>
        </Col>

        <Col span={24} className="pb-2">
          <Row>
            <Col span={4} className="product__info--label">
              Product Unit
            </Col>
            <Col span={8} className="product__info--value">
              {productData.unitName}
            </Col>
          </Row>
        </Col>
        <Col span={24} className="pb-2">
          <Row>
            <Col span={4} className="product__info--label">
              Product Quantity
            </Col>
            <Col span={8} className="product__info--value">
              {productData.quantity}
            </Col>
          </Row>
        </Col>
        <Col span={24} className="pb-2">
          <Row>
            <Col span={4} className="product__info--label">
              Opening Value
            </Col>
            <Col span={8} className="product__info--value">
              {productData.stockValue}
            </Col>
          </Row>
        </Col>
        <Col span={24} className="pb-2">
          <Row>
            <Col span={4} className="product__info--label">
              Description
            </Col>
            <Col span={8} className="product__info--value">
              {productData.description}
            </Col>
          </Row>
          <hr />
        </Col>
        <Col span={24} className="fs-13 text-uppercase mb-3">
          <span className="bulletIcon">Sales</span>
        </Col>

        <Col span={24} className="pb-2">
          <Row>
            <Col span={4} className="product__info--label">
              Unit Price
            </Col>
            <Col span={8} className="product__info--value">
              {productData.sale_unit_price}
            </Col>
          </Row>
        </Col>
        <Col span={24} className="pb-2">
          <Row>
            <Col span={4} className="product__info--label">
              Account
            </Col>
            <Col span={8} className="product__info--value">
              {productData.saleAccountname}
            </Col>
          </Row>
        </Col>
        <Col span={24} className="pb-2">
          <Row>
            <Col span={4} className="product__info--label">
              Tax Rate
            </Col>
            <Col span={8} className="product__info--value">
              {productData.staxsign}
            </Col>
          </Row>
        </Col>
        <Col span={24} className="pb-2">
          <Row>
            <Col span={4} className="product__info--label">
              Description
            </Col>
            <Col span={8} className="product__info--value">
              {productData.sale_desc}
            </Col>
          </Row>
          <hr />
        </Col>
        <Col span={24} className="fs-13 text-uppercase mb-3">
          <span className="bulletIcon"> Purchase</span>
        </Col>

        <Col span={24} className="pb-2">
          <Row>
            <Col span={4} className="product__info--label">
              Unit Price
            </Col>
            <Col span={8} className="product__info--value">
              {productData.purchase_unit_price}
            </Col>
          </Row>
        </Col>
        <Col span={24} className="pb-2">
          <Row>
            <Col span={4} className="product__info--label">
              Account
            </Col>
            <Col span={8} className="product__info--value">
              {productData.purchaseAccountname}
            </Col>
          </Row>
        </Col>
        <Col span={24} className="pb-2">
          <Row>
            <Col span={4} className="product__info--label">
              Tax Rate
            </Col>
            <Col span={8} className="product__info--value">
              {productData.ptaxsign}
            </Col>
          </Row>
        </Col>
        <Col span={24} className="pb-2">
          <Row>
            <Col span={4} className="product__info--label">
              Description
            </Col>
            <Col span={8} className="product__info--value">
              {productData.purchase_desc}
            </Col>
          </Row>
        </Col>
      </Row>
      <div className="row">
        {/* <div className="col-md-3">Product Type </div>
        <div className="col-md-9"> {productData.product_type}</div>
        <div className="col-md-3">Product Name </div>
        <div className="col-md-9">
          <strong style={{ fontSize: '24px' }}> {productData.name}</strong>
        </div>
        <div className="col-md-3">Description</div>
        <div className="col-md-9">{productData.description}</div>
        <div className="col-md-3">Product Unit </div>
        <div className="col-md-9"> {productData.unit}</div>
        <div className="col-md-3">Opening Quantity </div>
        <div className="col-md-9"> {productData.quantity}</div>
        <div className="col-md-3">Opening Value </div>
        <div className="col-md-9"> {productData.stockValue}</div>
        <br />
        <br />
        <div className="col-md-12">
          <strong style={{ fontSize: '18px' }}>Purchases</strong>
          <hr style={{ margin: '5px 0' }} />
        </div>
        <div className="col-md-3">Unit Price</div>
        <div className="col-md-9">{productData.purchase_unit_price}</div>
        <div className="col-md-3">Account</div>
        <div className="col-md-9">{productData.purchase_account}</div>
        <div className="col-md-3">Tax Rate</div>
        <div className="col-md-9">{productData.purchase_tax_rate}</div>
        <div className="col-md-3">Description</div>
        <div className="col-md-9">{productData.purchase_desc}</div>
        <div className="col-md-12">
          <br />
          <strong style={{ fontSize: '18px' }}>Sales</strong>
          <hr style={{ margin: '5px 0' }} />
        </div>
        <div className="col-md-3">Unit Price</div>
        <div className="col-md-9">{productData.sale_unit_price}</div>
        <div className="col-md-3">Account</div>
        <div className="col-md-9">{productData.sale_account}</div>
        <div className="col-md-3">Tax Rate</div>
        <div className="col-md-9">{productData.sale_tax_rate}</div>
        <div className="col-md-3">Description</div>
        <div className="col-md-9">{productData.sale_desc}</div> */}
      </div>
      <div>
        <DisplayJournal
          // type="purchase invoice"
          trId={prodId}
          formName="product"
          isJournal={false}
        />
      </div>
      {/* <CreateProductModal
        headingText="Edit Product"
        visible={visible}
        productId={prodId}
        loadData={loadData}
        productData={productData}
        showModal={showModal}
      /> */}
    </div>
  )
}

// export default connect()(ProductDetails)

export default connect()(WithRouter(ProductDetails));