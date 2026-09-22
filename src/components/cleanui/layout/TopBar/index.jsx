import React from 'react'
import {
  Table,
  Popconfirm,
  Button,
  Input,
  Form,
  Select,
  Divider,
  Modal,
  Space,
  DatePicker,
  Tag,
} from 'antd'
import moment from 'moment'
import store from 'store'
import FavPages from './FavPages'
import Search from './Search'
import IssuesHistory from './IssuesHistory'
import ProjectManagement from './ProjectManagement'
import LanguageSwitcher from './LanguageSwitcher'
import Actions from './Actions'
import UserMenu from './UserMenu'
import Organization from './Organization'
import style from './style.module.scss'

const { TextArea } = Input
const { Option } = Select

const TopBar = React.memo(() => {
  // console.log('TopBar')
  const organization = store.get('selectedOrg')
  // console.log('testtt', organization)
  const date = organization ? new Date(organization.currDate) : new Date()
  // const date = moment('05/22/2021')
  const dayEnd = moment(date).add(1, 'months')
  const endDate = moment(dayEnd)
  const startDate = moment()
  const diffInDays = endDate.diff(startDate, 'days')
  // const diffInDays = ''

  // if(!diffInDays) {

  // }
  // selectedOrg

  // console.log(diffInDays, 'end.diff')

  return (
    <div className={style.topbar}>
      <div className="me-4">
        <FavPages />
      </div>
      <div className="me-auto">
        {/* <Search /> */}
        <Organization />
      </div>
      {/* <div className="me-4 d-none d-md-block"> <IssuesHistory /> </div> */}
      <div className="me-4 d-none d-md-block">
        {' '}
        <Tag color="red">
          You are currently in Free Plan and Plan will expire in {diffInDays} days
        </Tag>{' '}
      </div>
      <div className="mb-0 me-auto d-xl-block d-none">{/* <ProjectManagement /> */}</div>
      <div className="me-4 d-none d-sm-block">{/* <LanguageSwitcher /> */}</div>
      <div className="me-4 d-none d-sm-block">
        <Actions />
      </div>
      <div className="">
        <UserMenu />
      </div>
    </div>
  )
})

export default TopBar
