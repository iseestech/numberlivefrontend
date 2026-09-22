import React, { useState, useEffect, useCallback } from 'react'
import { Button, Table, Input, Modal, Upload, message, Steps, Divider } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import store from 'store'
import { EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons'
import { PDFViewer } from '@react-pdf/renderer'
import ProductAndServices from '@/components/accountancy/JSON/ProductAndServices.json'
import { AgGridReact } from 'ag-grid-react'
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from '@/components/accountancy/sales/aggrid/singleLevelColumn'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import ProductService from '@/services/products'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import CreateProductModal from './createProductModal'
import MyDocument from './dempPdf'
import tableData from './data.json'
import sampleFile from './productBulkUpload.xlsx'

const mapStateToProps = ({ router }) => ({
  routerData: router,
})

const tableColumns = [
  ...ProductAndServices.productList,
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    className: 'actionCol',
    cellRenderer: params => {
      const dt = params?.data
      return (
        <Link to={`/products-and-services/product/${dt.id}`}>
          <span className="viewIcon">
            <EyeOutlined />
          </span>
        </Link>
      )
    },
  },
]

const ProAndSerList = routerData => {
  const location = useLocation();
  // console.log(routerData.match.path.split('/'), 'router')
  const [productList, getProductList] = useState([])
  const [page, setpage] = useState(1)
  const [visible, setVisible] = useState(false)
  const [isShownReciept, setShownReciept] = useState(false)
  const [baseData, setBaseData] = useState([])
  const [gridApi, setGridApi] = useState()

  const showModal = () => {
    setVisible(!visible)
  }
  useEffect(() => {
    const fetchData = async () => {
      const result = await ProductService.productList()
      // console.log(result, 'result')
      if (result && result.data.length) {
        result.data.forEach((ele, i) => {
          ele.key = i + 1
        })
        getProductList(result.data)
        setBaseData(result.data)
      }
    }

    fetchData()
  }, [page])

  const loadData = () => {
    const fetchData = async () => {
      const result = await ProductService.productList()
      // console.log(result, 'result')
      if (result && result.data.length) {
        result.data.forEach((ele, i) => {
          ele.key = i + 1
        })
        setVisible(!visible)
        getProductList(result.data)
      }
    }

    fetchData()
  }
  const onHandleChange = (e, value) => {
    // console.log(e.target.value, value)
  }

  const search = value => {
    const filterTableVal = baseData.filter(o =>
      Object.keys(o).some(k =>
        String(o[k])
          .toLowerCase()
          .includes(value.toLowerCase()),
      ),
    )
    getProductList(filterTableVal)
  }

  const onGridReady = useCallback(params => {
    setGridApi(params.columnApi)
  }, [])

 const routeName = location?.pathname?.split('/')[2]
  const [bulkUpload, setBulkUpload] = useState(false)
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false)
  const [showBulkUploadData, setShowBulkUploadData] = useState([])
  const [verifyModal, setVerifyModal] = useState(false)
  const [verifiedBulkData, setVerifiedBulkData] = useState([])
  const [errorListModal, SetErrorListModal] = useState(false)
  const [excelDuplicateModal, setExcelDuplicateModal] = useState(false)
  const [excelDuplicate, setExcelDuplicate] = useState([])
  const [ProductBulkDiff, setProductBulkDiff] = useState([])
  const orgUpload = store.get('selectedOrg') || {}
  const uploadProps = {
    name: 'file',
    action: `https://103.8.167.194:9090/isees/app/products/product/upload`,
    headers: {
      // authorization: 'authorization-text',
      orgCode: `${orgUpload.orgCode}`,
    },
    onChange: info => {
      // console.log("uploadBankStatement",info);
      if (info.file.status !== 'uploading') {
        // console.log("!uploading",info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
        setBulkUpload(false)
        setShowBulkUploadModal(true)
        fetchBulkUploadData()
      } else if (info.file.status === 'error') {
        // message.error(`${info.file.name} file upload failed.`)
        message.error(`${info.file.response}.`)
      }
    },
  }

  const fetchBulkUploadData = () => {
    fetch('https://103.8.167.194:9090/isees/app/products/getallproduct', {
      headers: {
        orgCode: `${orgUpload.orgCode}`,
      },
    })
      .then(response => response.json())
      .then(json => {
        setShowBulkUploadData(json)
      })
  }

  const fetchVerifiedBulkData = () => {
    const fff = async () => {
      const result = await ProductService.getVerifiedBulkData()
      // console.log(result, 'result')
      if (result) {
        setVerifiedBulkData(result)
      }
    }

    fff()
  }

  const finalUploadBulkData = () => {
    const fff = async () => {
      const result = await ProductService.saveProductBulkUpload()
      // console.log(result, 'result')
      if (result.statusCode === 200) {
        message.success(`data uploaded Successfully`)
        setShowBulkUploadData(false)
        setBulkConfirm(false)
        setShowBulkUploadModal(false)
        deleteBulkData()
        setVerifyModal(false)
      }
    }
    fff()
    loadData()
  }

  const getProductBulkDiff = () => {
    const getDiff = async () => {
      const result = await ProductService.getProductBulkDiff()
      if (result) {
        setProductBulkDiff(result)
        SetErrorListModal(true)
        console.log(ProductBulkDiff, 'in diff')
      }
    }
    getDiff()
  }

  const getExcelDuplicate = () => {
    const getDiff = async () => {
      const result = await ProductService.getExcelDuplicate()
      console.log(result, 'result diff')
      if (result) {
        setExcelDuplicate(result)
        setExcelDuplicateModal(true)
      }
    }
    getDiff()
  }

  const [bulkConfirm, setBulkConfirm] = useState(false)
  const deleteBulkData = () => {
    fetch('https://103.8.167.194:9090/isees/app/products/product/checkStatus', {
      method: 'PUT',
      headers: {
        orgCode: `${orgUpload.orgCode}`,
      },
    })
  }

  const bulkUploadTableCols = [
    {
      title: '#',
      key: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Product Group',
      dataIndex: 'groupName',
    },
    {
      title: 'Product Category',
      dataIndex: 'catName',
    },
    {
      title: 'Product Name',
      dataIndex: 'product_name',
    },
    {
      title: 'produc Code(SKU)',
      dataIndex: 'product_code',
    },
    {
      title: 'UOM',
      dataIndex: 'unitname',
    },
    {
      title: 'Purchase Price',
      dataIndex: 'purchaseunitprice',
    },
    {
      title: 'Sale Price',
      dataIndex: 'sale_unit_price',
    },
  ]
  const diffCols = [
    {
      title: '#',
      key: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Product Group',
      dataIndex: 'groupName',
    },
    {
      title: 'Product Category',
      dataIndex: 'catName',
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      render(text, record) {
        return {
          props: {
            style: { color: record.error === 'Duplicate Name' ? 'red' : 'black' },
          },
          children: <div>{text}</div>,
        }
      },
    },
    {
      title: 'produc Code(SKU)',
      dataIndex: 'productCode',
      render(text, record) {
        return {
          props: {
            style: { color: record.error === 'Duplicate Code (SKU)' ? 'red' : 'black' },
          },
          children: <div>{text}</div>,
        }
      },
    },
    {
      title: 'UOM',
      dataIndex: 'unitname',
    },
    {
      title: 'Error',
      dataIndex: 'error',
      render(text, record) {
        return {
          props: {
            style: { color: 'red' },
          },
          children: <div>{text}</div>,
        }
      },
    },
  ]

  const verifiedBulkDataCols = [
    {
      title: '#',
      key: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Product Group',
      dataIndex: 'groupName',
    },
    {
      title: 'Product Category',
      dataIndex: 'catName',
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
    },
    {
      title: 'produc Code(SKU)',
      dataIndex: 'productCode',
      render(text, record) {
        return {
          props: {
            style: { color: record.error === 'Duplicate Code (SKU)' ? 'red' : 'black' },
          },
          children: <div>{text}</div>,
        }
      },
    },
    {
      title: 'UOM',
      dataIndex: 'unitname',
    },
    {
      title: 'Purchase Price',
      dataIndex: 'purchaseUnit',
    },
    {
      title: 'Sale Price',
      dataIndex: 'saleUnitPrice',
    },
  ]

  const excelDuplicateCols = [
    {
      title: '#',
      key: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Error',
      dataIndex: 'errorclm',
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
    },
    {
      title: 'Reason',
      dataIndex: 'status',
    },
    {
      title: 'Count',
      dataIndex: 'errorcount',
    },
  ]

  function BulkUploadSteps({ current }) {
    return (
      <div style={{ marginBottom: '40px', marginRight: '10px' }}>
        <Steps
          current={current}
          // status="error"
          items={[
            {
              title: 'Upload',
              // description: "dkdk",
            },
            {
              title: 'Check Data',
              // description: "kkf",
            },
            {
              title: 'Final Uplaod',
              // description: "Dk",
            },
          ]}
        />
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }} className="mb-4">
        <div>
          <Input.Search allowClear placeholder="Search by..." enterButton onSearch={search} />
        </div>
        <div className="text-end">
          <Button
            color="secondary"
            size="medium"
            // outline
            className="me-2"
            onClick={() => setShownReciept(!isShownReciept)}
          >
            Print
          </Button>
          <Button type="primary" size="medium" className="text-center" htmlType="submit">
            <Link
              to="/products-and-services/product/create"
              className="text-white"
              style={{ textTransform: 'capitalize' }}
            >
              Create
            </Link>
          </Button>
          <Button
            type="primary"
            size="medium"
            className="text-center w-10 mb-1"
            style={{ marginLeft: '3px' }}
            htmlType="submit"
            onClick={() => {
              setBulkUpload(true)
              deleteBulkData()
            }}
          >
            Bulk Add
          </Button>
        </div>
      </div>
      {/* <Table
        id="table__layout--css"
        rowKey="id"
        columns={tableColumns}
        dataSource={productList}
        // pagination={{ position: 'bottomRight' }}
        pagination
        showSorterTooltip={false}
      /> */}
      <div className="ag-theme-alpine agggrid--table__container">
        <AgGridReact
        theme={"legacy"}
          rowData={productList}
          columnDefs={singleLevelColumn(tableColumns)}
          defaultColDef={agGridDefaultColDef}
          autoGroupColumnDef={agGridautoGroupColumnDef}
          sideBar
          enableRangeSelection
          allowContextMenuWithControlKey
          getContextMenuItems={agGetContextMenuItems}
          onGridReady={onGridReady}
          statusBar={agGridStatusBar}
        />
      </div>
      {/* <CreateProductModal
        headingText="Create Product And Service"
        visible={visible}
        productId=""
        loadData={loadData}
        productData={[]}
        showModal={showModal}
      /> */}
      <OtherPrimaryReport
        visible={isShownReciept}
        handleRecieptModal={() => setShownReciept(!isShownReciept)}
        quoteData={productList || []}
        salesValue="Product List"
        flag="ProductList"
        // dateValue={"dateValue"}
      />

      {bulkUpload && (
        <Modal
          title={null}
          centered
          open={bulkUpload}
          onOk={() => setBulkUpload(false)}
          onCancel={() => setBulkUpload(false)}
          footer={null}
          width="60vw"
          height="80vh"
        >
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '70%', maxWidth: '700px' }}>
              <BulkUploadSteps current={0} />
              <h3 style={{ fontWeight: 'bolder' }}>Prepare file To Upload</h3>
              <p style={{ marginTop: '20px' }}>
                Downlaod the sample file and add you items.
                <br />
                <br />
                To Upload items in Number kindly follow the following instructions
                <br />
                Upto 1,000 items can be uploaded each time.
                <br />
              </p>

              {/* <h5 style={{ marginTop: '20px', fontWeight: "bolder" }}>Downlaod The Sample File and add you Items</h5> */}
              <div style={{ marginTop: '15px', textDecoration: 'underline' }}>
                <Button style={{ border: '1px solid red' }}>
                  <a href={sampleFile} target="_blank" rel="noopener noreferrer">
                    Sample File
                  </a>
                </Button>
              </div>
              <div
                style={{
                  padding: '15px',
                  border: '1px solid black',
                  borderRadius: '6px',
                  marginTop: '20px',
                }}
              >
                <h5 style={{ fontWeight: 'bolder' }}>Tips Uploading Data</h5>
                <ul>
                  <li>Dont Change or Delete the Coloumn Headings.</li>
                  <li>
                    Duplicate <b>Product Name</b> or <b>Product Code</b> will not be accepted.
                  </li>
                  <li>Enter group Id category Id and Unit of measurement from Master form.</li>
                  <li>
                    At step 1 system will check Excel file and filter the same(duplicate name,code
                    or blank fields)
                  </li>
                  <li>
                    At step 2 stystem will compare uploaded data with existing products(duplicate
                    name and code)
                  </li>
                  <li>
                    At step 3 system will compare uploaded data with existing group,category and
                    Unit of measurement (empty or wrong data will not be accepted).
                  </li>
                </ul>
              </div>

              <h5 style={{ marginBottom: '20px', marginTop: '20px', fontWeight: 'bolder' }}>
                Upload Items
              </h5>
              <p>File to Upload(required)</p>

              <div
                style={{
                  border: '1px dotted black',
                  borderRadius: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100px',
                }}
              >
                <Upload {...uploadProps}>
                  <p>Drag and drop file or Select manually</p>
                  <Button
                    style={{ marginLeft: '32px', border: '1px solid red', marginTop: '2px' }}
                    icon={<UploadOutlined />}
                  >
                    Click to Upload
                  </Button>
                </Upload>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {showBulkUploadModal && (
        <Modal
          title={null}
          centered
          open={showBulkUploadModal}
          onOk={() => {
            setBulkConfirm(true)
          }}
          onCancel={() => {
            setBulkConfirm(true)
          }}
          footer={null}
          width="80vw"
        >
          <div style={{ marginLeft: '5%', marginRight: '5%' }}>
            <BulkUploadSteps current={1} />
            <h3>Uploaded Data</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto' }}>
              <p>
                Uploaded Count <b>{showBulkUploadData.length}</b>
              </p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  type="primary"
                  onClick={() => {
                    getExcelDuplicate()
                  }}
                  style={{ marginLeft: '4px', display: 'inline', width: '200px' }}
                >
                  Duplicate or Empty Data
                </Button>
              </div>
              <Button
                onClick={() => {
                  setVerifyModal(true)
                  fetchVerifiedBulkData()
                }}
                style={{ marginRight: '30px', maxWidth: '110px', marginLeft: 'auto' }}
                type="primary"
              >
                verify data
              </Button>
            </div>
            <Divider />
            <Table
              columns={bulkUploadTableCols}
              dataSource={showBulkUploadData}
              scroll={{ y: 600 }}
            />
          </div>
        </Modal>
      )}

      {bulkConfirm && (
        <Modal
          title={null}
          centered
          open={bulkConfirm}
          onOk={() => {
            setBulkConfirm(false)
          }}
          onCancel={() => {
            setBulkConfirm(false)
          }}
          footer={null}
          width={400}
        >
          <div>
            <p>If you close the window all uploaded data will loss</p>
            <Button
              type="primary"
              onClick={() => {
                setShowBulkUploadData(false)
                setBulkConfirm(false)
                setShowBulkUploadModal(false)
                deleteBulkData()
              }}
            >
              OK
            </Button>
            <Button
              onClick={() => {
                setBulkConfirm(false)
              }}
            >
              Cancel
            </Button>
          </div>
        </Modal>
      )}

      {verifyModal && (
        <Modal
          title={null}
          centered
          open={verifyModal}
          // onOk={() => setShowBulkUploadModal(false)}
          // onCancel={() => setShowBulkUploadModal(false)}
          onOk={() => {}}
          onCancel={() => {
            setVerifyModal(false)
          }}
          footer={null}
          width="80vw"
        >
          <div style={{ marginLeft: '5%', marginRight: '5%' }}>
            <BulkUploadSteps current={2} />
            <div style={{ display: 'flex' }}>
              <h4>Verified Data</h4>
              <Button
                type="primary"
                onClick={() => {
                  finalUploadBulkData()
                }}
                style={{ marginLeft: 'auto', marginRight: '30px' }}
                disabled={verifiedBulkData.length < 1}
              >
                Final Upload
              </Button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto' }}>
              <p>
                Uploaded Count <b>{showBulkUploadData.length}</b>
              </p>
              <div style={{ display: 'flex' }}>
                <p>
                  Error Count <b>{showBulkUploadData.length - verifiedBulkData.length}</b>
                </p>
                <Button
                  type="primary"
                  onClick={() => {
                    getProductBulkDiff()
                  }}
                  style={{ marginLeft: '4px', display: 'inline' }}
                >
                  Error List
                </Button>
              </div>
              <p>
                Verified Count <b>{verifiedBulkData.length}</b>
              </p>
            </div>
            <Divider />
            <Table
              columns={verifiedBulkDataCols}
              dataSource={verifiedBulkData}
              scroll={{ y: 600 }}
            />
          </div>
        </Modal>
      )}

      {errorListModal && (
        <Modal
          title="Error List"
          centered
          open={errorListModal}
          onOk={() => {}}
          onCancel={() => {
            SetErrorListModal(false)
          }}
          footer={null}
          width={800}
        >
          <div>
            <Table columns={diffCols} dataSource={ProductBulkDiff} scroll={{ y: 600 }} />
          </div>
        </Modal>
      )}

      {excelDuplicateModal && (
        <Modal
          title="Error List"
          centered
          open={excelDuplicateModal}
          onOk={() => {}}
          onCancel={() => {
            setExcelDuplicateModal(false)
          }}
          footer={null}
          width={800}
        >
          <div>
            <Table columns={excelDuplicateCols} dataSource={excelDuplicate} scroll={{ y: 600 }} />
          </div>
        </Modal>
      )}
    </div>
  )
}

export default connect()(ProAndSerList)

