import React from 'react'
import { Helmet } from 'react-helmet'
import ConfirmPassword from '@/components/cleanui/system/Auth/ConfirmPassword'

const SystemConfirmPassword = () => {
  return (
    <div>
      <Helmet title="Confirm Password" />
      <ConfirmPassword />
    </div>
  )
}

export default SystemConfirmPassword
