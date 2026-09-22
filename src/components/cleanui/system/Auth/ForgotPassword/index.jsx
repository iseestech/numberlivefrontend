import React from 'react'
import { Input, Button, Form, notification } from 'antd'
import { Link } from 'react-router-dom'
import apiClient from '@/services/axios'
import style from '../style.module.scss'

const ForgotPassword = () => {
  const onFinish = values => {
    apiClient
      .get(`/isees/api/users/sendEmail?email=${encodeURIComponent(values.email)}`)
      .then(response => {
        if (response && (response.status === 200 || (response.data && response.data.statusCode === 200))) {
          notification.success({
            message: 'Success',
            description: (response.data && response.data.message) || 'Password reset link sent to your email',
          })
        } else {
          notification.error({
            message: 'Error',
            description: (response && response.data && response.data.message) || 'Failed to send reset email',
          })
        }
      })
      .catch(err => {
        console.log('Error sending reset email:', err)
      })
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div>
      <div className={`card ${style.container}`}>
        <div className="text-dark font-size-24 mb-4">
          <strong>Reset Password</strong>
        </div>
        <Form
          layout="vertical"
          hideRequiredMark
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="mb-4"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your e-mail address' }]}
          >
            <Input size="large" placeholder="Email Address" />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" className="text-center w-100">
            <strong>Reset my password</strong>
          </Button>
        </Form>
        <Link to="/auth/login" className="kit__utils__link font-size-16">
          <i className="fe fe-arrow-left me-1 align-middle" />
          Go to Sign in
        </Link>
      </div>
    </div>
  )
}

export default ForgotPassword
