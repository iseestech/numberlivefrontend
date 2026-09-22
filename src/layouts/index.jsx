import React, { Fragment } from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import NProgress from 'nprogress'
import { Helmet } from 'react-helmet'
import store from 'store'
// import Loader from '@/components/cleanui/layout/Loader'
import PublicLayout from './Public'
import AuthLayout from './Auth'
import MainLayout from './Main'
import AdminLayOut from './Admin'

const Layouts = {
  public: PublicLayout,
  auth: AuthLayout,
  main: MainLayout,
  admin: AdminLayOut,
}

const mapStateToProps = ({ user }) => ({ user })
let previousPath = ''

const Layout = ({ user, children }) => {
  const location = useLocation()
  const { pathname, search } = location
  const role = store.get('role');

  // Debug logging
  console.log("Current URL:", window.location.href)
  console.log("Query string:", window.location.search)
  console.log("Hash:", window.location.hash)
  console.log("Access token:", localStorage.getItem("accessToken"))

  // NProgress & ScrollTop Management
  const currentPathStr = pathname + search
  if (currentPathStr !== previousPath) {
    window.scrollTo(0, 0)
    NProgress.start()
  }
  setTimeout(() => {
    NProgress.done()
    previousPath = currentPathStr
  }, 300)

  const getPath = () => {
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      return window.location.hash.replace(/^#/, '').split('?')[0]
    }
    return pathname
  }

  const activePath = getPath()

  // Layout Rendering
  const getLayout = () => {
    if (activePath === '/') {
      return 'public'
    }
    if (/^\/auth(?=\/|$)/i.test(activePath)) {
      return 'auth'
    }
    if (/^\/admin(?=\/|$)/i.test(activePath) || (role && role.type === "SUPERADMIN")) {
      return 'admin'
    }
    return 'main'
  }

  const layoutType = getLayout()
  const Container = Layouts[layoutType]
  const isUserAuthorized = user.authorized
  const isUserLoading = user.loading
  const isAuthLayout = layoutType === 'auth'

  console.log("Route evaluated by auth guard:", {
    pathname,
    activePath,
    layoutType,
    isAuthLayout,
    isUserAuthorized,
    isUserLoading,
  })

  const BootstrappedLayout = () => {
    // show loader when user in check authorization process, not authorized yet and not on login pages
    if (isUserLoading && !isUserAuthorized && !isAuthLayout) {
      return null
    }
    // redirect to login page if current is not login page and user not authorized
    if (!isAuthLayout && !isUserAuthorized) {
      console.log("Redirecting to /auth/login because route is protected and user is not authorized.")
      return <Navigate to="/auth/login" replace />
    }
    // in other case render previously set layout
    return <Container>{children}</Container>
  }

  return (
    <Fragment>
      <Helmet titleTemplate="Adviser | %s" title="" />
      {BootstrappedLayout()}
    </Fragment>
  )
}

export default connect(mapStateToProps)(Layout)
