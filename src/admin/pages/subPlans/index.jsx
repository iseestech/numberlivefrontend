import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

const mapStateToProps = ({ router, user }) => ({
  routerData: router,
  userData: user,
})

const SubPlans = ({ routerData, userData }) => {
  return (
    <>
      {userData.type === 'SUPERADMIN' && (
        <>
          <h1>SubPlans</h1>
        </>
      )}

      {userData.type !== 'SUPERADMIN' && (
        <div>
          <h1>Not Authorized</h1>
        </div>
      )}
    </>
  )
}

export default connect(mapStateToProps)(SubPlans)
