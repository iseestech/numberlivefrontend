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
} from 'antd'
import UserMenu from '@/components/cleanui/layout/TopBar/UserMenu';
import style from './style.module.scss'

const { TextArea } = Input
const { Option } = Select

const TopBar = () => {
  return (
    <div className={style.topbar}>
      <div className="me-4">{/* <FavPages /> */}</div>
      <div className="me-auto">
        Admin
        {/* <Search /> */}
        {/*  <Organization /> */}
      </div>
      <div className="me-4 d-none d-md-block">{/* <IssuesHistory /> */}</div>
      <div className="mb-0 me-auto d-xl-block d-none">{/* <ProjectManagement /> */}</div>
      <div className="me-4 d-none d-sm-block">{/* <LanguageSwitcher /> */}</div>
      <div className="me-4 d-none d-sm-block">{/*   <Actions /> */}</div>
      <div className=""> <UserMenu /> </div>
    </div>
  )
}

export default TopBar
