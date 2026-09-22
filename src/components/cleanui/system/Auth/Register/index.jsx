import React from 'react'
import { connect } from 'react-redux'
import { Input, Button, Form, Select } from 'antd'
import { Link } from 'react-router-dom'
import PhoneInput from 'react-phone-input-2'
import './style.scss'

const { Option } = Select
const mapStateToProps = ({ user, dispatch }) => ({ user, dispatch })

const Register = ({ dispatch, user }) => {
  const onFinish = values => {
    console.log(values, 'values')
    values.role = 'USER'
    dispatch({
      type: 'user/REGISTER',
      payload: values,
    })
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div>
      <div className="container">
        <div className="text-dark font-size-24 mb-4 text-center">
          <strong>Create your account</strong>
        </div>
        <div className="mb-4  text-center">
          <h5 className="text-center">Try Advisor FREE for 30 days!</h5>
          <p>
            <span>Unlimited users, no credit card required</span>
          </p>
        </div>
        <Form
          layout="vertical"
          hideRequiredMark
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="mb-4"
        >
          <Form.Item
            name="firstName"
            rules={[{ required: true, message: 'Please input your first name' }]}
          >
            <Input size="large" placeholder="First Name" />
          </Form.Item>
          <Form.Item
            name="lastName"
            rules={[{ required: true, message: 'Please input your last name' }]}
          >
            <Input size="large" placeholder="Last Name" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your e-mail address' }]}
          >
            <Input size="large" placeholder="Email Address" />
          </Form.Item>
          <Form.Item
            className="phone-numberCss"
            name="mobile"
            rules={[{ required: true, message: 'Please input your phone number' }]}
          >
            {/*  <Input size="large" addonBefore={prefixSelector} placeholder="Phone Number" /> */}
            <PhoneInput country="in" className="phone__number__css" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="text-center w-100"
            loading={user.loading}
          >
            <strong>Sign up</strong>
          </Button>
        </Form>
        <div>
          <span className="me-1">By signing up, you agree to the</span>
          <a href="#" onClick={e => e.preventDefault()} className="kit__utils__link">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" onClick={e => e.preventDefault()} className="kit__utils__link">
            Privacy Policy
          </a>
        </div>
      </div>
      <div className="text-center pt-2 mb-auto">
        <span className="me-2">Already have an account?</span>
        <Link to="/auth/login" className="kit__utils__link font-size-16">
          Sign in
        </Link>
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(Register)
