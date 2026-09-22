import React from 'react'
import { all, put, call } from 'redux-saga/effects'
import { Button, Table, Popconfirm, Form } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import getMenuData from './field'

const UserSetting = routerData => {
  const menuData = getMenuData()
  return (
    <Form>
      <div className="row">
        <h5 className="col-md-12 mb-4">
          <strong>User Setting</strong>
        </h5>
        {menuData.map((item, index) => {
          return (
            <div className="col-md-2">
              <input type="checkbox" /> {item.title}
            </div>
          )
        })}
      </div>
    </Form>
  )
}

export default UserSetting
