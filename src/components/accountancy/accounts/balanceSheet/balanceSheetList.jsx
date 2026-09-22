import React, { useState, useEffect } from 'react'
import { Button, Table, Tabs, Row, Col, Dropdown, Menu } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import PurchaseService from '@/services/purchase'
import { DownOutlined } from '@ant-design/icons'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import _ from 'lodash'
import ReportPdfContainer from '@/components/accountancy/common/pdf/reportsPdf'
import store from 'store'
import moment from 'moment'
import JournalService from '@/services/journal'
import tableData from './data.json'
import './index.scss'

const { TabPane } = Tabs

const tabData = {
  ASSETS: [
    {
      balance: -1644.0,
      primaryGroup: 'Current Assets',
      accountName: 'Asad Isane',
      subGroup: 'Sundry Debtors',
    },
    {
      primaryGroup: 'Current Assets',
      subGroup: 'Bank Accounts',
      accountName: 'Bank of India',
      balance: 18630.0,
    },
    {
      accountName: 'Petty Cash',
      primaryGroup: 'Current Assets',
      balance: 16270.0,
      subGroup: 'Cash-in-hand',
    },
    {
      primaryGroup: 'Current Assets',
      accountName: 'Steeve Smith',
      balance: 0.0,
      subGroup: 'Sundry Debtors',
    },
    {
      primaryGroup: 'Current Assets',
      accountName: 'Undeposited Funds',
      balance: -440.0,
      subGroup: 'Cash-in-hand',
    },
    {
      primaryGroup: 'Current Assets',
      subGroup: 'Inventory Asset',
      balance: 64826.667,
      accountName: 'Inventory Asset',
    },
  ],
  LIABILITIES: [
    {
      balance: 12860.0,
      primaryGroup: 'Current Liabilities',
      subGroup: 'Sundry Creditors',
      accountName: 'Asad i isane',
    },
    {
      primaryGroup: 'Current Liabilities',
      balance: 621.0,
      accountName: 'dem0',
      subGroup: 'Duties & Taxes',
    },
    {
      balance: -645.0,
      primaryGroup: 'Current Liabilities',
      accountName: 'Demo02',
      subGroup: 'Duties & Taxes',
    },
    {
      balance: -203.0,
      primaryGroup: 'Current Liabilities',
      accountName: 'GST',
      subGroup: 'Duties & Taxes',
    },
    {
      balance: 30324.0,
      primaryGroup: 'Current Liabilities',
      accountName: 'tesing  asad',
      subGroup: 'Sundry Creditors',
    },
    {
      balance: 23322.66,
      primaryGroup: 'Suspense',
      subGroup: 'Profit & Loss',
      accountName: 'Profit & Loss',
    },
  ],
}

// const mapStateToProps = ({ router }) => ({
//   routerData: router,
// })

const tableColumns = [
  {
    title: 'Account',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Account Code',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: 'total',
    dataIndex: 'total',
    key: 'total',
  },
  // {
  //   title: 'Actions',
  //   dataIndex: 'actions',
  //   key: 'actions',
  //   render: (text, record) => {
  //     return <Link to={`/purchase/order/${record.purchase_id}`}>click here</Link>
  //   },
  // },
]

const BalanceSheetList = props => {
  const org = store.get('selectedOrg')
  const location = useLocation()
  const {  match } = props
  const [rowData, setRowData] = useState({ liabilities: [], assets: [], total: {} })
  const [isShownReciept, setShownReciept] = useState(false)
  const [csvData, setCsvData] = useState([])
  const [balType, setBalType] = useState(
    location.pathname.includes('horizontal') ? 'horizontal' : 'vertical',
  )

  useEffect(() => {
    const orgDt = store.get('selectedOrg')
    const fetchData = async () => {
      const result = await JournalService.getBalancesheet({ orgCode: orgDt.orgCode })
      const assetsGroup = _.groupBy(result?.ASSETS || [], (item, i) => item.primaryGroup)
      const liabilitiesGroup = _.groupBy(result?.LIABILITIES || [], (item, i) => item.primaryGroup)
      const assets = {}
      const liabilities = {}
      Object.keys(assetsGroup).forEach(x => {
        assets[x] = _.groupBy(assetsGroup[x] || [], (item, i) => item.subGroup)
      })

      Object.keys(liabilitiesGroup).forEach(x => {
        liabilities[x] = _.groupBy(liabilitiesGroup[x] || [], (item, i) => item.subGroup)
      })

      setRowData({
        assets,
        liabilities,
        total: {
          assets: result.Total[0],
          liabilities: result.Total[1],
        },
      })
      // const { location:locationPath } = props

      // if (locationPath?.pathname.includes('horizontal')) {
      //   setBalType('horizontal')
      // }
    }
    fetchData()
  }, [])

  const renderLiabilitiesFooter = (accounts, type) => {
    const { total } = rowData
    let diffVal = 0
    let totalVal =
      total.assets?.totalbalance > total.liabilities?.totalbalance
        ? total.assets?.totalbalance.toFixed(2)
        : total.liabilities?.totalbalance.toFixed(2)

    if (type === 'liabilities' && total[type]?.totalbalance < total.assets?.totalbalance) {
      diffVal = total.assets?.totalbalance.toFixed(2) - total[type]?.totalbalance.toFixed(2) || 0
      totalVal = total.assets?.totalbalance.toFixed(2)
    } else if (type === 'assets' && total[type]?.totalbalance < total.liabilities?.totalbalance) {
      diffVal =
        total.liabilities?.totalbalance.toFixed(2) - total[type]?.totalbalance.toFixed(2) || 0
      totalVal = total.liabilities?.totalbalance.toFixed(2)
    }
    return (
      <>
        <Row className="mt-2">
          <Col span={12} className="text-start">
            <strong>Subtotal</strong>
          </Col>
          <Col span={12} className="text-end">
            <strong>{total[type]?.totalbalance.toFixed(2)}</strong>
          </Col>
          {type === 'assets' && total[type]?.totalbalance < total.liabilities?.totalbalance && (
            <>
              <Col span={12} className="text-start">
                <strong>Difference in opening balance</strong>
              </Col>
              <Col span={12} className="text-end">
                <strong> + {diffVal.toFixed(2)}</strong>
              </Col>
            </>
          )}

          {type === 'liabilities' && total[type]?.totalbalance < total.assets?.totalbalance && (
            <>
              <Col span={12} className="text-start">
                <strong>Difference in opening balance</strong>
              </Col>
              <Col span={12} className="text-end">
                <strong> + {diffVal.toFixed(2)}</strong>
              </Col>
            </>
          )}
          {type === 'liabilities' && total[type]?.totalbalance > total.assets?.totalbalance && (
            <>
              <Col span={24} className="text-start">
                &nbsp;
              </Col>
            </>
          )}
          {type === 'assets' && total[type]?.totalbalance > total.liabilities?.totalbalance && (
            <>
              <Col span={24} className="text-start">
                &nbsp;
              </Col>
            </>
          )}
        </Row>
        <Col span={24} className="footer-section">
          <Row>
            <Col span={24} className="leftFooter">
              <strong>Total</strong>
              <strong>{totalVal}</strong>
            </Col>
          </Row>
        </Col>
      </>
    )
  }

  const renderLiabilities = (accounts, type) => {
    const { total } = rowData
    // let diffVal = 0
    // let totalVal =
    //   total.assets?.totalbalance > total.liabilities?.totalbalance
    //     ? total.assets?.totalbalance.toFixed(2)
    //     : total.liabilities?.totalbalance.toFixed(2)

    // if (type === 'liabilities' && total[type]?.totalbalance < total.assets?.totalbalance) {
    //   diffVal = total.assets?.totalbalance.toFixed(2) - total[type]?.totalbalance.toFixed(2) || 0
    //   totalVal = total.assets?.totalbalance.toFixed(2)
    // } else if (type === 'assets' && total[type]?.totalbalance < total.liabilities?.totalbalance) {
    //   diffVal =
    //     total.liabilities?.totalbalance.toFixed(2) - total[type]?.totalbalance.toFixed(2) || 0
    //   totalVal = total.liabilities?.totalbalance.toFixed(2)
    // }
    return (
      <>
        {Object.keys(accounts).map(item => {
          return (
            <Row className="account-row">
              <Col span={24} className="account-heading" style={{ borderBottom: '1px solid #ccc' }}>
                <strong>{item}</strong>
              </Col>
              <Col span={24}>
                {Object.keys(accounts[item]).map(ele => {
                  return (
                    <Row className="ps-3">
                      <Col span={24} className="account-heading">
                        <strong>{ele}</strong>
                      </Col>
                      {accounts[item][ele].map(val => {
                        return (
                          <Col span={24} className="ps-3" key={val}>
                            <Row>
                              <Col span={12}>{val.accountName}</Col>
                              <Col span={12} className="text-end">
                                {val.balance}
                              </Col>
                            </Row>
                          </Col>
                        )
                      })}
                    </Row>
                  )
                })}
              </Col>
            </Row>
          )
        })}
        <div className="mt-5">&nbsp;</div>
        {/* <>
          <Row className="mt-5">
            <Col span={12}>
              <strong>Subtotal</strong>
            </Col>
            <Col span={12} className="text-end">
              <strong>{total[type]?.totalbalance.toFixed(2)}</strong>
            </Col>
            {type === 'assets' && total[type]?.totalbalance < total.liabilities?.totalbalance && (
              <>
                <Col span={12}>
                  <strong>Difference in opening balance</strong>
                </Col>
                <Col span={12} className="text-end">
                  <strong> + {diffVal.toFixed(2)}</strong>
                </Col>
              </>
            )}
            {type === 'liabilities' && total[type]?.totalbalance < total.assets?.totalbalance && (
              <>
                <Col span={12}>
                  <strong>Difference in opening balance</strong>
                </Col>
                <Col span={12} className="text-end">
                  <strong> + {diffVal.toFixed(2)}</strong>
                </Col>
              </>
            )}
          </Row>
          <Col span={24} className="footer-section">
            <Row c>
              <Col span={24} className="leftFooter">
                <strong>Total</strong>
                <strong>{totalVal}</strong>
              </Col>
            </Row>
          </Col>
        </> */}
      </>
    )
  }

  // const routeName = match.path.split('/')[2]
  // const { accepted, sent, draft, invoiced, declined } = quotationList
  return (
    <div className="details_layout--page">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>&nbsp;</div>

        {/* <div className="text-end">
          <Button color="secondary" className="me-2 mb-2">
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item>
                    <Button
                      color="secondary"
                      style={{ border: 'none', background: 'none', margin: 0 }}
                      type="button"
                      onClick={() => setShownReciept(!isShownReciept)}
                    >
                      PDF
                    </Button>
                  </Menu.Item>
                </Menu>
              }
              className="me-2 mb-2"
            >
              <a className="ant-dropdown-link">
                Export As <DownOutlined />
              </a>
            </Dropdown>
          </Button>
        </div> */}
      </div>
      <div className="sub-header__section">
        {/* <Button type="primary" size="large" className="text-center w-10 mb-1" htmlType="submit">
          <strong>
            {' '}
            <Link
              to="/expenses/create"
              className="text-white"
            >
              Create {routeName}
            </Link>
          </strong>
        </Button> */}
        {/* <div>This Month</div>
        <div>Print</div> */}
      </div>
      <div className="report__section details__page--content mt-3">
        <div className="top__section mt-3 mb-5">
          <h6 style={{ marginBottom: '0' }}>{org?.orgName || ''}</h6>
          <h4 style={{ marginBottom: '0' }}>
            <strong>
              {location.pathname.includes('horizontal') && 'Horizontal '} Balance Sheet
            </strong>
          </h4>
          {/* <span>Basis: Accrual</span> */}
          <span>as on {moment().format('DD MMM YYYY')}</span>
        </div>
        <div className="report__content">
          <Row className="balancesheet-section mb-3">
            <Col span={balType === 'horizontal' ? 12 : 24} className="left-section">
              <Row className="header-section">
                <Col span={24} className="leftHeader">
                  <strong>Liabilities</strong>
                </Col>
              </Row>
              <Row>
                <Col span={24} className="left-body-section">
                  {renderLiabilities(rowData.liabilities, 'liabilities')}
                </Col>
              </Row>
            </Col>
            {balType === 'vertical' && (
              <Col span={24} className="leftHeader mb-5 bg-none">
                {renderLiabilitiesFooter(rowData.liabilities, 'liabilities')}
              </Col>
            )}
            <Col span={balType === 'horizontal' ? 12 : 24} className="right-section">
              <Row className="header-section">
                <Col span={24} className="rightHeader">
                  <strong>Assets</strong>
                </Col>
              </Row>
              <Row>
                <Col span={24} className="right-body-section">
                  {renderLiabilities(rowData.assets, 'assets')}
                </Col>
              </Row>
            </Col>
            {balType === 'vertical' && (
              <Col span={24} className="rightHeader bg-none">
                {renderLiabilitiesFooter(rowData.assets, 'assets')}
              </Col>
            )}
            {balType === 'horizontal' && (
              <>
                <Col span={12} className="leftHeader bg-none">
                  {renderLiabilitiesFooter(rowData.liabilities, 'liabilities')}
                </Col>

                <Col span={12} className="rightHeader bg-none">
                  {renderLiabilitiesFooter(rowData.assets, 'assets')}
                </Col>
              </>
            )}
          </Row>

          {/* <Row className="balancesheet-section mb-3">
            <Col span={24} className="header-section">
              <Row>
                <Col span={12} className="leftHeader">
                  <strong>Liabilities</strong>
                </Col>
                <Col span={12} className="rightHeader">
                  <strong>Assets</strong>
                </Col>
              </Row>
            </Col>
            <Col span={12} className="left-body-section">
              {renderLiabilities(rowData.liabilities, 'liabilities')}
            </Col>
            <Col span={12} className="right-body-section">
              {renderLiabilities(rowData.assets, 'assets')}
            </Col>
            <Col span={24} className="main-footer-section">
              <Row>
                <Col span={12} className="leftHeader">
                  {renderLiabilitiesFooter(rowData.liabilities, 'liabilities')}
                </Col>
                <Col span={12} className="rightHeader">
                  {renderLiabilitiesFooter(rowData.assets, 'assets')}
                </Col>
              </Row>
            </Col>
          </Row> */}
        </div>
      </div>
      <ReportPdfContainer
        visible={isShownReciept}
        handleRecieptModal={() => setShownReciept(!isShownReciept)}
        quoteData={rowData || {}}
        salesValue={'Balance Sheet' || ''}
        flag={'balanceSheet' || ''}
        dateValue={`as on ${moment().format('DD MMM YYYY')}`}
        info={{}}
      />
    </div>
  )
}

export default connect()(BalanceSheetList)

