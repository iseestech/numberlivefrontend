import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import adminServices from '@/services/admin'
import { connect } from 'react-redux'

const mapStateToProps = ({ router, user }) => ({
  routerData: router,
  userData: user,
})

function Dashboard({ routerData, userData }) {
  const [activeUsers, setActiveUsers] = useState(0)
  useEffect(() => {
    getUsers()
  }, [])

  async function getUsers() {
    const data = await adminServices.adminUsers()
    setActiveUsers(data.length)
  }
  //  ddd
  return (
    <>
      {userData.type === 'SUPERADMIN' && (
        <div>
          <div className="cui__utils__heading">
            <strong>User Data</strong>
          </div>
          <div className="row">
            <div className="col-xl-4">
              <div className="card">
                <div
                  className="card-body overflow-hidden position-relative p-2"
                  // style={{ padding: '10px' }}
                >
                  <div className="text-uppercase">Active Users</div>
                  <div className="font-size-30 font-weight-bold text-dark mb-n2">{activeUsers}</div>
                  <div className="text-uppercase">some text</div>
                </div>
              </div>
            </div>
            <div className="col-xl-4">
              <div className="card">
                <div
                  className="card-body overflow-hidden position-relative p-2"
                  // style={{ padding: '10px' }}
                >
                  <div className="text-uppercase">Expired User</div>
                  <div className="font-size-30 font-weight-bold text-dark mb-n2">
                    {/* {getSymbolFromCurrency(orgData?.currency) || orgData?.currency || ''}
                {transaction ? transaction.payable : '0'} */}{' '}
                    66
                  </div>
                  <div className="text-uppercase">some text</div>
                </div>
              </div>
            </div>
            <div className="col-xl-4">
              <div className="card">
                <div
                  className="card-body overflow-hidden position-relative p-2"
                  // style={{ padding: '10px' }}
                >
                  <div className="text-uppercase">New users</div>

                  <div className="font-size-30 font-weight-bold text-dark mb-n2">
                    {/* {transaction ? transaction.totalorders : '-'} */}{' '}
                    {routerData?.loginType || 'npn'}
                  </div>
                  <div className="text-uppercase">In Last 30 Days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {userData.type !== 'SUPERADMIN' && (
        <div>
          <h1>Not Authorized</h1>
        </div>
      )}
    </>
  )
}

export default connect(mapStateToProps)(Dashboard)
