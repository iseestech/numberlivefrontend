import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useLocation } from 'react-router-dom'

import { Button, Table, notification } from 'antd'
import getSymbolFromCurrency from 'currency-symbol-map'
import OrganizationSelection from '@/components/accountancy/common/modal/organizationSelection'
import DashboardService from '@/services/dashboard'
// import { getToken, onMessageListener } from '@/services/firebase/firebaseNotification'
import moment from 'moment'
import Loader from './Loader'
import SaleChart from './chart/saleData'
import IncomeVsExp from './chart/incomeVsExp'
import TopExp from './chart/topExpenses'

const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const tableColumns = [
  {
    title: '#',
    dataIndex: 'key',
    key: 'key',
    className: 'srNo',
    render: (text, record, index) => index + 1,
  },
  {
    title: 'Name',
    dataIndex: 'act_name',
    key: 'act_name',
    render: (text, record) => (
      <Link className="hrefLink" to={`/banking/list/${record.payment_act}`}>
        {record.act_name}
      </Link>
    ),
  },
  {
    title: 'Account Id',
    dataIndex: 'payment_act',
    key: 'payment_act',
    // sorter: (a, b) => a.age - b.age,
  },
  {
    title: 'Balance',
    dataIndex: 'accountbalance',
    key: 'accountbalance',
  },
]

const DashboardAlpha = () => {
  useLocation()
  const [transaction, setTransaction] = useState()
  const [saleData, setsaleData] = useState({})
  const [topExpData, setTopExpData] = useState({})
  const [topExpDataLoaded, setTopExpDataLoaded] = useState(false)

  const [incomeVsExpData, setIncomeVsExpData] = useState({})
  const [incomeVsExpTotal, setIncomeVsExpTotal] = useState({})
  const [accountData, setAccountData] = useState([])
  const [accountDataLoaded, setAccountDataLoaded] = useState(false)

  const [cashFlowDetails, setCashFlowDetails] = useState({})
  const [cashFlowDate, setCashFlowDate] = useState({})

  const [cashFlowData, setCashFlowData] = useState({})

  const orgData = localStorage.getItem('selectedOrg')
    ? JSON.parse(localStorage.getItem('selectedOrg'))
    : {}

  useEffect(() => {
    const org = localStorage.getItem('selectedOrg')
      ? JSON.parse(localStorage.getItem('selectedOrg'))
      : {}

    const fetchData = async () => {
      const result = await DashboardService.dashboardData(org?.orgCode || '')
      if (result && Object.keys(result).length) {
        const data = [result.receiveable || 20, result.payable || 10]
        setTransaction(result)
      }
    }
    if (Object.keys(org).length) {
      fetchData()
    }
  }, [])

  useEffect(() => {
    const graphData = {
      labels: [],
      datasets: [
        {
          label: 'Income',
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,
          data: [],
        },
        {
          label: 'Expenses',
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,
          data: [],
        },
      ],
    }

    const org = localStorage.getItem('selectedOrg')
      ? JSON.parse(localStorage.getItem('selectedOrg'))
      : {}
    const obj = {
      orgCode: org?.orgCode || '',
      endDate: moment().format('DD-MMM-YYYY'),
      startDate: moment()
        .add(-1, 'year')
        .format('DD-MMM-YYYY'),
    }
    // console.log('Obj', obj)
    const fetchData = async () => {
      const result = await DashboardService.getIncomeVsExpenses(obj)
      // console.log(result, 'getIncomeVsExpenses')
      if (result && result?.IncomeVsExpense?.length) {
        result.IncomeVsExpense.forEach(ele => {
          graphData.labels.push(month[Number(ele.month) - 1])
          // graphData.series[0].data.push(ele.income)
          // graphData.series[1].data.push(ele.expenses)
          graphData.datasets[0].data.push(ele.income)
          graphData.datasets[0].backgroundColor.push('rgba(54, 162, 235, 0.2)')
          graphData.datasets[0].borderColor.push('rgba(54, 162, 235, 1)')

          graphData.datasets[1].data.push(ele.expenses)
          graphData.datasets[1].backgroundColor.push('rgba(255, 99, 132, 0.2)')
          graphData.datasets[1].borderColor.push('rgba(255,99,132,1)')
        })
      }
      setIncomeVsExpData(result?.IncomeVsExpense)
      setIncomeVsExpTotal(result?.Total || {})
    }
    if (Object.keys(org).length) {
      fetchData()
    }
  }, [])

  useEffect(() => {
    const org = localStorage.getItem('selectedOrg')
      ? JSON.parse(localStorage.getItem('selectedOrg'))
      : {}
    const obj = {
      orgCode: org?.orgCode || '',
    }
    // console.log('Obj', obj)
    const fetchData = async () => {
      const result = await DashboardService.getTopExpenses(obj)
      const temp = {
        series: [],
      }
      setTopExpData(result || [])
      setTopExpDataLoaded(true)
    }
    if (Object.keys(org).length) {
      fetchData()
    }
  }, [])

  useEffect(() => {
    const graphData = {
      trData: {},
      labels: [],
      datasets: [
        {
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          pointBorderWidth: 5,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          data: [],
        },
      ],
    }

    const org = JSON.parse(localStorage.getItem('selectedOrg')) || {}
    if (Object.keys(org).length) {
      const financialMonth = moment(org.lastFinYear).format('MM-DD')
      const currMonth = moment().format('MM')
      const curryear = new Date().getFullYear()

      const diff = moment().isAfter(`${curryear}-${financialMonth}`)
      let startDate = moment()
        .add(-1, 'year')
        .format('DD-MMM-YYYY')

      if (diff) {
        startDate = `${moment(org.lastFinYear).format('DD-MMM')}-${moment().format('YYYY')}`
      } else {
        startDate = `${moment(org.lastFinYear).format('DD-MMM')}-${moment()
          .add(-1, 'year')
          .format('YYYY')}`
      }
      const dt = moment('2022-10-31').isAfter(moment().format('MM')) // true
      // moment('2019-05-11').isAfter('2019-05-12'); //false
      // console.log('log ==>', org, financialMonth, dt, currMonth, diff)

      const obj = {
        orgCode: org?.orgCode || '',
        endDate: moment().format('DD-MMM-YYYY'),
        startDate,
      }
      const fetchData = async () => {
        const result = await DashboardService.cashflowdata(obj)
        if (result && result.data) {
          result.data.forEach(ele => {
            graphData.labels.push(`${month[Number(ele.month) - 1]} ${ele.Year}`)
            // graphData.series[0].data.push(ele.totalamt)
            graphData.datasets[0].data.push(ele.closingvalue)
            graphData.trData[`${month[Number(ele.month) - 1]} ${ele.Year}`] = ele
          })
          setCashFlowData(result)
          setCashFlowDetails(result.total)
          setCashFlowDate({
            startDate,
            endDate: moment().format('DD-MMM-YYYY'),
          })
        }
      }
      fetchData()
    }
  }, [])

  useEffect(() => {
    const graphData = {
      labels: [],
      datasets: [
        {
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          pointBorderWidth: 5,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          data: [],
        },
      ],
    }
    const org = JSON.parse(localStorage.getItem('selectedOrg')) || {}
    if (Object.keys(org).length) {
      const curryear = new Date().getFullYear()
      const obj = {
        orgCode: org?.orgCode || '',
        endDate: moment().format('DD-MMM-YYYY'),
        startDate: moment()
          .add(-1, 'year')
          .add(1, 'month')
          .format('DD-MMM-YYYY'),
      }
      const fetchData = async () => {
        const result = await DashboardService.yearwisesaleData(obj)
        if (result) {
          result.forEach(ele => {
            graphData.labels.push(`${month[Number(ele.month) - 1]} ${ele.year}`)
            // graphData.series[0].data.push(ele.totalamt)
            graphData.datasets[0].data.push(ele.Total)
          })
        }
        setsaleData(result)
      }
      fetchData()
    }
  }, [])

  useEffect(() => {
    // console.log('test')
    const org = localStorage.getItem('selectedOrg')
      ? JSON.parse(localStorage.getItem('selectedOrg'))
      : {}

    const fetchData = async () => {
      const result = await DashboardService.bankAccountList(org?.orgCode || '')
      // console.log(result, 'bankAccountList')
      setAccountData(result)
      setAccountDataLoaded(true)
    }
    if (Object.keys(org).length) {
      fetchData()
    }
  }, [])

  const isCollapsed = localStorage.getItem('app.settings.isMenuCollapsed')

  return (
    <div>
      <div className="cui__utils__heading">
        <strong>Total Transactions</strong>
      </div>
      <div className="row">
        <div className="col-xl-4">
          <div className="card">
            <div
              className="card-body overflow-hidden position-relative p-2"
              // style={{ padding: '10px' }}
            >
              <div className="text-uppercase">Total Unpaid Invoices</div>
              <div className="font-size-30 font-weight-bold text-dark mb-n2">
                {getSymbolFromCurrency(orgData?.currency) || orgData?.currency || ''}
                {transaction ? transaction.receiveable : '0'}
              </div>
              <div className="text-uppercase">Receiveable</div>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className="card">
            <div
              className="card-body overflow-hidden position-relative p-2"
              // style={{ padding: '10px' }}
            >
              <div className="text-uppercase">Total Unpaid Bills</div>
              <div className="font-size-30 font-weight-bold text-dark mb-n2">
                {getSymbolFromCurrency(orgData?.currency) || orgData?.currency || ''}
                {transaction ? transaction.payable : '0'}
              </div>
              <div className="text-uppercase">payable</div>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className="card">
            <div
              className="card-body overflow-hidden position-relative p-2"
              // style={{ padding: '10px' }}
            >
              <div className="text-uppercase">&nbsp;</div>

              <div className="font-size-30 font-weight-bold text-dark mb-n2">
                {transaction ? transaction.totalorders : '-'}
              </div>
              <div className="text-uppercase">Total Orders for last 30 days</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card">
            <div className="card-header p-2">
              <div className="cui__utils__heading mb-0">
                <strong>Cash Flow</strong>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-9 col-lg-9 p-0">
                <div
                  className="card-body sales-progress cashFlow p-0"
                  style={{
                    height: '390px',
                    borderRight: '1px solid #ccc',
                    margin: '10px 0 ',
                    borderRadius: '0',
                  }}
                >
                  {Object.keys(cashFlowData).length ? (
                    <SaleChart saleData={cashFlowData} cashFlow />
                  ) : (
                    <Loader />
                  )}
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 p-0 text-end">
                <div className="p-5">
                  <div className="p-2">
                    <span style={{ color: '#777' }}>Cash as on {cashFlowDate?.startDate}</span>
                    <br />
                    <span style={{ fontSize: '18px' }}>
                      {getSymbolFromCurrency(orgData?.currency) || orgData?.currency || ''}{' '}
                      {cashFlowDetails?.openingvalue}&nbsp;
                    </span>
                  </div>
                  <div className="p-2">
                    <span style={{ color: '#66a822' }}>Incoming</span>
                    <br />
                    <span style={{ fontSize: '18px' }}>
                      {' '}
                      {getSymbolFromCurrency(orgData?.currency) || orgData?.currency || ''}{' '}
                      {cashFlowDetails?.InFlow} &nbsp;
                    </span>
                  </div>
                  <div className="p-2">
                    <span style={{ color: '#e4585a' }}>Outgoing</span>
                    <br />
                    <span style={{ fontSize: '18px' }}>
                      {getSymbolFromCurrency(orgData?.currency) || orgData?.currency || ''}{' '}
                      {cashFlowDetails?.OutFlow} &nbsp;
                    </span>
                  </div>
                  <div className="p-2">
                    <span style={{ color: '#2485e8' }}>Cash as on {cashFlowDate?.endDate}</span>
                    <br />
                    <span style={{ fontSize: '18px' }}>
                      {getSymbolFromCurrency(orgData?.currency) || orgData?.currency || ''}{' '}
                      {cashFlowDetails?.EndingBalance} &nbsp;
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-6 col-lg-6">
          <div className="card">
            <div className="card-header p-2">
              <div className="cui__utils__heading mb-0">
                <strong>Sale Progress</strong>
              </div>
            </div>
            <div className="card-body sales-progress p-0" style={{ height: '341px' }}>
              {Object.keys(saleData || {}).length ? (
                <SaleChart saleData={saleData} cashFlow={false} />
              ) : (
                <Loader />
              )}
            </div>
          </div>
        </div>
        <div className="col-xl-6 col-lg-6">
          <div className="card">
            <div className="card-header p-2">
              <div className="cui__utils__heading mb-0">
                <strong>Income vs Expenses</strong>
              </div>
            </div>
            <div className="card-body p-0" style={{ height: '341px' }}>
              {Object.keys(incomeVsExpData).length ? (
                <IncomeVsExp saleData={incomeVsExpData} />
              ) : (
                <div style={{ height: '250px' }}>
                  <Loader />
                </div>
              )}
              <div
                className="card-footer p-3"
                style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0 0 0' }}
              >
                {/* <Chart4v2 /> */}
                <div>
                  <p style={{ margin: '0' }}>
                    <span
                      style={{
                        width: '25px',
                        height: '10px',
                        background: 'rgba(54, 162, 235, 0.2)',
                        border: '1px solid rgba(54, 162, 235, 1)',
                        display: 'inline-block',
                        marginRight: '5px',
                      }}
                    />
                    Income
                  </p>
                  <p style={{ margin: '0' }}>
                    <span
                      style={{
                        width: '25px',
                        height: '10px',
                        // border: '5px solid #4b7cf3',
                        background: 'rgba(255, 99, 132, 0.2)',
                        border: '1px solid rgba(255, 99, 132, 1)',

                        display: 'inline-block',
                        marginRight: '5px',
                      }}
                    />
                    Expense
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0' }}>Total Income</p>
                  <p style={{ margin: '0' }}>
                    <strong>
                      {' '}
                      {getSymbolFromCurrency(orgData?.currency) || orgData?.currency || ''}{' '}
                      {incomeVsExpTotal?.income || 0.0}
                    </strong>
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0' }}>Total Expenses</p>
                  <p style={{ margin: '0' }}>
                    <strong>
                      {getSymbolFromCurrency(orgData?.currency) || orgData?.currency || ''}{' '}
                      {incomeVsExpTotal?.expenses || 0.0}
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-6 col-lg-6">
          <div className="card" style={{ height: '100%' }}>
            <div className="card-header p-2">
              <div className="cui__utils__heading mb-0">
                <strong>Your Top Expenses</strong>
              </div>
            </div>
            <div className="card-body">
              {topExpDataLoaded ? <TopExp saleData={topExpData || []} /> : <Loader />}
            </div>
          </div>
        </div>
        <div className="col-xl-6 col-lg-6">
          <div className="card" style={{ height: '100%' }}>
            <div className="card-header p-2">
              <div className="cui__utils__heading mb-0">
                <strong>Payment Accounts</strong>
              </div>
              {/* <div className="text-muted">Block with important Recently Referrals information</div> */}
            </div>
            <div className="card-body p-0">
              {accountDataLoaded ? (
                <div className="kit__utils__table">
                  <Table
                    id="table__layout--css"
                    height=""
                    columns={tableColumns}
                    dataSource={accountData || []}
                    pagination={false}
                    rowKey="payment_act"
                  />
                </div>
              ) : (
                <Loader />
              )}
            </div>
          </div>
        </div>
      </div>
      <OrganizationSelection isModalVisible />
    </div>
  )
}

export default DashboardAlpha
