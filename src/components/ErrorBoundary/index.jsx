import React from 'react'
import { Button, Result } from 'antd'

// Catches render/lifecycle errors thrown by a single page (e.g. a null
// `selectedOrg` being dereferenced) so that one broken page shows a friendly
// fallback instead of unmounting the whole app to a blank white screen.
// React only supports error boundaries as class components.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Page crashed:', error, info)
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ hasError: false, error: null })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="500"
          title="Something went wrong on this page"
          subTitle={this.state.error?.message || 'An unexpected error occurred.'}
          extra={
            <Button type="primary" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          }
        />
      )
    }
    return this.props.children
  }
}
