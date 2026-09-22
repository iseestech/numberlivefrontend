import React, { useState, useEffect } from 'react'
import { Input, Button, Form, notification } from 'antd'
import { Link } from 'react-router-dom'
import PasswordValidator from 'password-validator'
import UserProfileService from '@/services/userProfile'
import style from '../style.module.scss'

const schema = new PasswordValidator()

schema
  .is()
  .min(8)
  .is()
  .max(100)
  .has()
  .symbols(1)
  .is()
  .digits(1)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf(['Passw0rd', 'Password123'])

const ConfirmPassword = () => {
  const getEmailAndTokenFromUrl = () => {
    const searchParams = new URLSearchParams(window.location.search)
    let emailVal = searchParams.get('email')
    let tokenVal = searchParams.get('token')

    if ((!emailVal || !tokenVal) && window.location.hash.includes('?')) {
      const hashQuery = window.location.hash.split('?')[1]
      if (hashQuery) {
        const hashParams = new URLSearchParams(hashQuery)
        emailVal = emailVal || hashParams.get('email')
        tokenVal = tokenVal || hashParams.get('token')
      }
    }

    if (!emailVal && window.location.href.includes('email=')) {
      emailVal = window.location.href.split('email=')[1]?.split('&')[0]?.split('#')[0]
    }
    if (!tokenVal && window.location.href.includes('token=')) {
      tokenVal = window.location.href.split('token=')[1]?.split('&')[0]?.split('#')[0]
    }

    if (emailVal) {
      emailVal = decodeURIComponent(emailVal).split('#')[0].split('&')[0]
    }
    if (tokenVal) {
      tokenVal = decodeURIComponent(tokenVal).split('#')[0].split('&')[0]
    }

    return { email: emailVal || '', token: tokenVal || '' }
  }

  const { email, token } = getEmailAndTokenFromUrl()

  const onFinish = values => {
    if (!email || !token) {
      notification.error({
        message: 'Invalid Reset Link',
        description: 'Password reset token or email is missing from the link. Please request a new password reset link.',
      })
      return
    }

    const payload = {
      email,
      token,
      newPassword: values.newPassword,
    }
    const fetchData = async () => {
      const result = await UserProfileService.createPassword(payload)
      if (result && (result.status === 200 || (result.data && result.data.statusCode === 200))) {
        notification.success({
          message: 'Success',
          description: 'Your password has been updated successfully!',
        })
        window.location.href = '#/auth/login'
      } else {
        const errorMessage = (result && result.data && result.data.message) || 'Failed to reset password. Please check your reset link.'
        notification.error({
          message: 'Error',
          description: errorMessage,
        })
      }
    }

    fetchData()
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div>
      <div className={`card ${style.container}`}>
        <div className="text-dark font-size-24 mb-4">
          <strong>Confirm Password</strong>
        </div>
        <Form
          layout="vertical"
          hideRequiredMark
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="mb-4"
        >
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Enter valid password' },
              () => ({
                validator(_, value) {
                  const values = schema.validate(value, { list: true })
                  if (!values.length) {
                    return Promise.resolve()
                  }

                  return Promise.reject(new Error(`Must be included ${values.join(', ')}`))
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password size="large" placeholder="Enter Password" />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="newPassword"
            rules={[
              { required: true, message: 'Password does not match' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }

                  return Promise.reject(new Error('The passwords that you entered do not match!'))
                },
              }),
            ]}
            dependencies={['password']}
            hasFeedback
          >
            <Input type="password" size="large" placeholder="Confirm password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" className="text-center w-100">
            <strong>Create password</strong>
          </Button>
        </Form>
        {/* <Link to="/auth/login" className="kit__utils__link font-size-16">
          <i className="fe fe-arrow-left me-1 align-middle" />
          Go to Sign in
        </Link> */}
      </div>
    </div>
  )
}

export default ConfirmPassword
