import React, { useState, useEffect } from 'react'
import { Button, Table, Tabs, Row, Col, Dropdown, Menu, Form, DatePicker } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import PurchaseService from '@/services/purchase'
import { DownOutlined } from '@ant-design/icons'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import _ from 'lodash'
import ReportPdfContainer from '@/components/accountancy/common/pdf/reportsPdf'
import ProfitAndLossReport from '@/components/accountancy/common/pdf/reportsPdf/profitAndLossPdf'

import store from 'store'
import moment from 'moment'
import JournalService from '@/services/journal'
import tableData from './data.json'
import './index.scss'

const { RangePicker } = DatePicker
const { TabPane } = Tabs
const dateFormat = 'DD MMM YYYY'

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

const BalanceSheetList = props => {
  const org = store.get('selectedOrg')
  // const { location } = props
  const location = useLocation()
  const [rowData, setRowData] = useState({ liabilities: [], assets: [], total: {} })
  const [isShownReciept, setShownReciept] = useState(false)
  const [csvData, setCsvData] = useState([])
  const [balType, setBalType] = useState(
    location?.pathname?.includes('horizontal') ? 'horizontal' : 'vertical',
  )
  const [dateValue, setDateValue] = useState([
    moment()
      .add(-1, 'year')
      .format('DD MMM YYYY'),
    moment().format('DD MMM YYYY'),
  ])

  const [selDate, setSelDate] = useState([
    moment()
      .add(-1, 'year')
      .format('DD MMM YYYY'),
    moment().format('DD MMM YYYY'),
  ])

  const [defaultData, setDefaultData] = useState([
    { name: 'datewise', value: [moment().add(-1, 'year'), moment(new Date(), dateFormat)] },
  ])

  const fetchData = async (startDate, endDate) => {
    let result = {}
    console.log(window.location.hash.includes('horizontal'), 'loggg', window.location.hash)
    if (window.location.hash.includes('horizontal')) {
      result = await JournalService.getProfitAndLoss({
        orgCode: org.orgCode,
        startDate,
        endDate,
      })
    } else {
      result = await JournalService.getVerticalProfitAndLoss({
        orgCode: org.orgCode,
        startDate,
        endDate,
      })
    }

    const objTotal = {}
    if (result?.SubTotal) {
      result.SubTotal.forEach(x => {
        objTotal[x.sub_group.trim()] = x.totals
      })
    }

    const sortedExpItems = _.sortBy(result?.EXPENSES, ({ primaryGroup }) =>
      primaryGroup.includes('Purchase Account') ? 0 : 1,
    )
    const sortedAssItems = _.sortBy(result?.INCOME, ({ primaryGroup }) =>
      primaryGroup.includes('Sale Account') ? 0 : 1,
    )

    // const assetsGroup = _.groupBy(sortedAssItems || [], (item, i) => item.primaryGroup)
    // const liabilitiesGroup = _.groupBy(sortedExpItems || [], (item, i) => item.primaryGroup)

    const assetsGroupV1 = _.groupBy(sortedAssItems || [], (item, i) => item.Type)
    const liabilitiesGroupV1 = _.groupBy(sortedExpItems || [], (item, i) => item.Type)

    // console.log(assetsGroupV1, 'assetsGroup', liabilitiesGroupV1)
    const assetsV1 = {}
    const liabilitiesV1 = {}
    Object.keys(assetsGroupV1).forEach(x => {
      assetsV1[x] = _.groupBy(assetsGroupV1[x] || [], (item, i) => item.primaryGroup)
    })

    Object.keys(liabilitiesGroupV1).forEach(x => {
      liabilitiesV1[x] = _.groupBy(liabilitiesGroupV1[x] || [], (item, i) => item.primaryGroup)
    })

    // console.log(assetsV1, 'Primary Group', liabilitiesV1)

    const assets = {}
    const liabilities = {}

    Object.keys(assetsV1).forEach(x => {
      assets[x] = {}
      Object.keys(assetsV1[x]).forEach(ele => {
        assets[x][ele] = _.groupBy(assetsV1[x][ele] || [], (item, i) => item.subGroup)
      })
    })

    Object.keys(liabilitiesV1).forEach(x => {
      liabilities[x] = {}
      Object.keys(liabilitiesV1[x]).forEach(ele => {
        liabilities[x][ele] = _.groupBy(liabilitiesV1[x][ele] || [], (item, i) => item.subGroup)
      })
    })

    // console.log(assets, 'result', liabilities)
    setRowData({
      assets,
      liabilities,
      total: {
        liabilities: result?.Total[0],
        assets: result?.Total[1],
      },
      netProfit: result?.NetProfit.NetProfit,
      grossProfit: result?.GrossProfit.GrossProfit,
      subTotal: objTotal,
    })

    setSelDate([startDate, endDate])
    // if (location.pathname.includes('horizontal')) {
    //   setBalType('horizontal')
    // }
  }

  useEffect(() => {
    fetchData(
      moment()
        .add(-1, 'year')
        .format('DD MMM YYYY'),
      moment().format('DD MMM YYYY'),
    )
  }, [])

  const renderLiabilitiesFooter = (accounts, type) => {
    const { total, netProfit } = rowData
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
        <Row className="mt-2 marginZero">
          {/* <Col span={12} className="text-start">
            <strong>Subtotal</strong>
          </Col>
          <Col span={12} className="text-end">
            <strong>{total[type]?.totalbalance.toFixed(2)}</strong>
          </Col> */}

          {type === 'liabilities' && balType !== 'horizontal' && (
            <>
              <Col
                span={20}
                className="text-start tableCSS textRightAlign borderRt"
                style={{ background: '#d7d7d7' }}
              >
                <strong>Net Profit/Loss</strong>
              </Col>
              <Col span={4} className="text-end tableCSS" style={{ background: '#d7d7d7' }}>
                <strong>{netProfit}</strong>
              </Col>
            </>
          )}
          {type === 'assets' && balType === 'horizontal' && (
            <>
              <Col span={12} className="text-start">
                <strong>Net Profit/Loss</strong>
              </Col>
              <Col span={12} className="text-end">
                <strong>{netProfit}</strong>
              </Col>
            </>
          )}
          {/* {type === 'assets' && total[type]?.totalbalance < total.liabilities?.totalbalance && (
            <>
              <Col span={12} className="text-start">
                <strong>Difference in opening balance</strong>
              </Col>
              <Col span={12} className="text-end">
                <strong> + {diffVal.toFixed(2)}</strong>
              </Col>
            </>
          )} */}

          {/* {type === 'liabilities' && total[type]?.totalbalance < total.assets?.totalbalance && (
            <>
              <Col span={12} className="text-start">
                <strong>Difference in opening balance</strong>
              </Col>
              <Col span={12} className="text-end">
                <strong> + {diffVal.toFixed(2)}</strong>
              </Col>
            </>
          )} */}
          {type === 'liabilities' && balType === 'horizontal' && (
            <>
              <Col span={24} className="text-start">
                &nbsp;
              </Col>
            </>
          )}
          {/* {type === 'assets' && total[type]?.totalbalance > total.liabilities?.totalbalance && (
            <>
              <Col span={24} className="text-start">
                &nbsp;
              </Col>
            </>
          )} */}
        </Row>
        {balType === 'horizontal' && (
          <Col span={24} className="footer-section">
            <Row>
              <Col span={24} className="leftFooter">
                <strong>Total</strong>
                <strong>{total[type]?.totalbalance.toFixed(2)}</strong>
              </Col>
            </Row>
          </Col>
        )}
      </>
    )
  }

  const renderLiabilities = (accounts, type) => {
    const { total, netProfit, grossProfit } = rowData
    console.log('accounts', accounts)
    return (
      <>
        {Object.keys(accounts).map(item => {
          return (
            <Row className="account-row">
              {Object.keys(accounts[item]).map(ele => {
                console.log('log', accounts, item, ele)

                return (
                  <>
                    <Col
                      span={24}
                      className="account-heading tableCSS ps-2"
                      // style={{ borderBottom: '1px solid #ccc' }}
                    >
                      <strong>{ele}</strong>
                    </Col>
                    <Col span={24} className="tableCSS removePadding" style={{ border: '0' }}>
                      {Object.keys(accounts[item][ele]).map(element => {
                        const len = accounts[item][ele][element].length
                        return (
                          <Row className="ps-3 removePadding innerAcc">
                            <Col span={24} className="account-heading tableCSS ps-3">
                              <strong>{element}</strong>
                            </Col>
                            {accounts[item][ele][element].map(val => {
                              return (
                                <Col span={24} className="ps-2 removePadding innerAcc" key={val}>
                                  <Row>
                                    <Col span={20} className="borderRt ps-4">
                                      {val.accountName}
                                    </Col>
                                    <Col span={4} className="text-end">
                                      <Link
                                        to={{
                                          pathname: '/report/Statement of Account',
                                          state: {
                                            startEndDate: dateValue,
                                            accId: val.acc_id,
                                          },
                                        }}
                                        style={{ textTransform: 'capitalize' }}
                                      >
                                        {val.Balance}
                                      </Link>
                                    </Col>
                                  </Row>
                                </Col>
                              )
                            })}
                            {balType === 'vertical' && (
                              <>
                                <Col
                                  span={20}
                                  className="account-heading tableCSS borderRt"
                                  style={{ background: '#d7d7d7' }}
                                >
                                  {/* {console.log(accounts?.[item]?.[ele], ele)} */}
                                  <strong> Total for {element} </strong>
                                </Col>
                                <Col
                                  span={4}
                                  className="account-heading text-end tableCSS"
                                  style={{ background: '#d7d7d7' }}
                                >
                                  {/* <strong> {accounts[item][ele][element][len - 1].totals} </strong> */}
                                  <strong> {rowData?.subTotal?.[element.trim()]} </strong>
                                </Col>
                                <Col span={24} className="account-heading tableCSS borderRt">
                                  &nbsp;
                                </Col>
                              </>
                            )}
                          </Row>
                        )
                      })}
                    </Col>
                  </>
                )
              })}
              {}
              {type === 'assets' && item === 'type 1' && (
                <>
                  <Col
                    span={20}
                    className="tableCSS text-end borderRt "
                    style={{ background: '#d7d7d7' }}
                    // style={{ border: '2px solid #000', borderRight: '0' }}
                  >
                    <strong>Gross Profit </strong>
                  </Col>{' '}
                  <Col
                    span={4}
                    className="text-end tableCSS "
                    style={{ background: '#d7d7d7' }}
                    // style={{ border: '2px solid #000', borderLeft: '0' }}
                  >
                    <strong> {grossProfit || ''}</strong>
                  </Col>
                </>
              )}
              {/* {type === 'assets' && (item === 'type 2' || Object.keys(accounts).length === 1) && (
                <>
                  <Col span={12}>Net Profit -</Col>{' '}
                  <Col span={12} className="text-end">
                    {netProfit || ''}
                  </Col>
                </>
              )} */}
            </Row>
          )
        })}
        {/* <div className="mt-5">&nbsp;</div> */}
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

  const onHandleChange = e => {
    // console.log(e)
    if (e) {
      const startDay = moment(e[0]).format('DD MMM YYYY')
      const endDay = moment(e[1]).format('DD MMM YYYY')
      setDateValue([startDay, endDay])
    }
  }

  const resetFilter = () => {
    setDefaultData([
      { name: 'datewise', value: [moment().add(-1, 'year'), moment(new Date(), dateFormat)] },
    ])
    setDateValue([
      moment()
        .add(-1, 'year')
        .format('DD MMM YYYY'),
      moment().format('DD MMM YYYY'),
    ])
    fetchData(
      moment()
        .add(-1, 'year')
        .format('DD MMM YYYY'),
      moment().format('DD MMM YYYY'),
    )
  }

  const onFinish = values => {
    // console.log(values, 'values')
    if (values.datewise) {
      const startDay = moment(values.datewise[0]).format('DD MMM YYYY')
      const endDay = moment(values.datewise[1]).format('DD MMM YYYY')
      // setDateValue(`from ${startDay} to ${endDay}`)
      fetchData(startDay, endDay)
    }
  }

  // console.log(props, 'router')
  // const routeName = match.path.split('/')[2]
  // const { accepted, sent, draft, invoiced, declined } = quotationList
  return (
    <div className="details_layout--page">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Form
            layout="horizontal"
            fields={defaultData}
            style={{ display: 'flex' }}
            // fields={defaultData}
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
          >
            <Form.Item
              style={{ marginBottom: 0 }}
              className="datewisefilter me-1"
              name="datewise"
              label="Select Date"
            >
              <RangePicker onChange={e => onHandleChange(e)} format={dateFormat} />
            </Form.Item>
            <>
              <Button type="primary" className="text-center me-1" htmlType="submit">
                <strong>Apply</strong>
              </Button>
              <Button type="default" className="text-center" onClick={resetFilter}>
                Reset
              </Button>
            </>
          </Form>
        </div>

        <div className="text-end">
          <Button color="secondary" className="me-2 mb-2">
            <Dropdown
             trigger={["click"]}
             popupRender={()=> <Menu>
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
        </div>
      </div>
      {/* <hr /> */}
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
              {location.pathname.includes('horizontal') && 'Horizontal '} Profit and Loss
            </strong>
          </h4>
          {/* <span>Basis: Accrual</span> */}
          {/* <span>as on {moment().format('DD MMM YYYY')}</span> */}
          <span>
            from {moment(selDate?.[0]).format('DD MMM YYYY')} to{' '}
            {moment(selDate?.[1]).format('DD MMM YYYY')}{' '}
          </span>
        </div>
        <div className="report__content">
          <Row
            className={
              balType === 'horizontal'
                ? 'balancesheet-section mb-3 test'
                : 'balancesheet-section mb-3 test'
            }
          >
            {balType === 'vertical' && (
              <Col span={balType === 'horizontal' ? 12 : 24} className="left-section">
                <Row className="header-section p-2" style={{ background: '#d7d7d7' }}>
                  <Col span={12} className="text-start">
                    <strong>Accounts</strong>
                  </Col>
                  <Col span={12} className="text-end" style={{ background: '#d7d7d7' }}>
                    <strong>
                      {' '}
                      {moment(selDate?.[0]).format('DD MMM YYYY')} -{' '}
                      {moment(selDate?.[1]).format('DD MMM YYYY')}{' '}
                    </strong>
                  </Col>
                </Row>
              </Col>
            )}
            <Col span={balType === 'horizontal' ? 12 : 24} className="left-section">
              {balType === 'horizontal' && (
                <Row className="header-section">
                  <Col span={24} className="rightHeader">
                    <strong>Income</strong>
                  </Col>
                </Row>
              )}
              <Row>
                <Col span={24} className="right-body-section removePadding">
                  {renderLiabilities(rowData.assets, 'assets')}
                </Col>
              </Row>
            </Col>
            {balType === 'vertical' && (
              <Col span={24} className="rightHeader bg-none removePadding">
                {renderLiabilitiesFooter(rowData.assets, 'assets')}
              </Col>
            )}
            {/* {balType === 'horizontal' && */}
            <Col span={balType === 'horizontal' ? 12 : 24} className="right-section">
              {balType === 'horizontal' && (
                <Row className="header-section">
                  <Col span={24} className="leftHeader">
                    <strong>Expenses</strong>
                  </Col>
                </Row>
              )}
              <Row>
                <Col span={24} className="left-body-section removePadding">
                  {renderLiabilities(rowData.liabilities, 'liabilities')}
                </Col>
              </Row>
            </Col>
            {/* } */}

            {balType === 'horizontal' && (
              <>
                <Col span={12} className="leftHeader bg-none">
                  {renderLiabilitiesFooter(rowData.assets, 'assets')}
                </Col>
                <Col span={12} className="rightHeader bg-none">
                  {renderLiabilitiesFooter(rowData.liabilities, 'liabilities')}
                </Col>
              </>
            )}
            {balType === 'vertical' && (
              <Col span={24} className="leftHeader bg-none removePadding">
                {renderLiabilitiesFooter(rowData.liabilities, 'liabilities')}
              </Col>
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
      <ProfitAndLossReport
        visible={isShownReciept}
        handleRecieptModal={() => setShownReciept(!isShownReciept)}
        quoteData={rowData || {}}
        salesValue={'Profit And Loss' || ''}
        flag={balType}
        dateValue={`${moment(selDate?.[0]).format('DD MMM YYYY')} -{' '}
        ${moment(selDate?.[1]).format('DD MMM YYYY')}{' '}`}
        info={{}}
      />
    </div>
  )
}

export default connect()(BalanceSheetList)

