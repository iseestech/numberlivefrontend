import React, { lazy, Suspense, Component } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import OrganizationService from '@/services/organization'
import AdminOrganizationComp from '@/components/accountancy/organization/adminOrgList'
import UserSetting from './pages/userSetting'
import Users from './pages/users'

export default class Admin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orgList: [],
    }
  }

  componentDidMount() {
    /*  const fetchData = async () => {
      const result = await OrganizationService.organizationList(3)
      this.setState({
        orgList: result.data || [],
      })
    }
    fetchData() */
  }

  render() {
    const { orgList } = this.state
    return (
      <div>
        <AdminOrganizationComp loginType="SUPERADMIN" />
      </div>
    )
  }
}
