import React from 'react'
import { connect } from 'react-redux'
import { Input, Button, Form } from 'antd'
import { Link } from 'react-router-dom'
import style from '../style.module.scss'

const mapStateToProps = ({ user, settings, dispatch }) => ({
  dispatch,
  user,
  authProvider: settings.authProvider,
  logo: settings.logo,
})

const Login = ({ dispatch, user, logo }) => {
  const [otpForm] = Form.useForm()
  const otpRequired = !!user.otpRequired
  const otpEmail = user.otpEmail

  // Step 1: email + password -> request an OTP
  const onGetOtp = values => {
    dispatch({
      type: 'user/LOGIN',
      payload: {
        email: values.email,
        password: values.password,
        type: 'USER',
        screenType: 'ADMIN',
      },
    })
  }

  // Step 2: OTP -> actually sign in
  const onVerifyOtp = values => {
    dispatch({
      type: 'user/VERIFY_OTP',
      payload: {
        email: otpEmail,
        otp: values.otp,
        screenType: 'ADMIN',
      },
    })
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const useAnotherEmail = () => {
    otpForm.resetFields()
    dispatch({
      type: 'user/SET_STATE',
      payload: {
        otpRequired: false,
        otpEmail: '',
      },
    })
  }

  return (
    <div>
      <div className="text-center mb-5">
        <h1 className="mb-5 px-3">
          <strong>Welcome to {logo}</strong>
        </h1>
      </div>
      <div className={`card ${style.container}`}>
        <div className="text-dark font-size-24 mb-3">
          <strong>Sign in to your account</strong>
        </div>

        {!otpRequired ? (
          <Form
            layout="vertical"
            hideRequiredMark
            onFinish={onGetOtp}
            onFinishFailed={onFinishFailed}
            className="mb-4"
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your e-mail address' }]}
            >
              <Input size="large" placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password' }]}
            >
              <Input size="large" type="password" placeholder="Password" />
            </Form.Item>

            <Button
              type="primary"
              size="large"
              className="text-center w-100"
              htmlType="submit"
              loading={user.loading}
            >
              <strong>Get OTP</strong>
            </Button>
          </Form>
        ) : (
          <Form
            form={otpForm}
            layout="vertical"
            hideRequiredMark
            onFinish={onVerifyOtp}
            onFinishFailed={onFinishFailed}
            className="mb-4"
          >
            <p className="mb-3">
              An OTP has been sent to <strong>{otpEmail}</strong>
            </p>
            <Form.Item
              name="otp"
              rules={[{ required: true, message: 'Please enter the OTP sent to your email' }]}
            >
              <Input size="large" placeholder="Enter OTP" maxLength={6} autoFocus />
            </Form.Item>

            <Button
              type="primary"
              size="large"
              className="text-center w-100"
              htmlType="submit"
              loading={user.loading}
            >
              <strong>Sign in</strong>
            </Button>
            <div className="text-center mt-3">
              <Button type="link" onClick={useAnotherEmail}>
                Use a different email
              </Button>
            </div>
          </Form>
        )}

        <Link to="/auth/forgot-password" className="kit__utils__link font-size-16">
          Forgot Password?
        </Link>
      </div>
      <div className="text-center pt-2 mb-auto">
        <span className="me-2">Don&#39;t have an account?</span>
        <Link to="/auth/register" className="kit__utils__link font-size-16">
          Sign up
        </Link>
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(Login)
