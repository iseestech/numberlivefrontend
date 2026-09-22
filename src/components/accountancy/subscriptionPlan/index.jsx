import React, { Component } from 'react'
import { Radio, Button } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { history } from '@/main'
import { CheckOutlined } from '@ant-design/icons'
import OrganizationService from '@/services/organization'
import './index.scss'
import WithRouter from '@/WithRouter'
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activePlan: 'starter',
      planPrice: {
        starter: 20,
        standard: 30,
        premium: 40,
      },
    }
  }

  handlePlan = plan => {
    // console.log('temp', plan)
    this.setState({
      activePlan: plan,
    })
  }

  addPlan = () => {
    const { location } = this.props
    const { activePlan } = this.state
    console.log(location, 'location state')
    // location.state.subcrPlan = activePlan.toUpperCase();
    const obj = {
      ...location.state,
      subcrPlan: activePlan.toUpperCase(),
    }
    console.log(location, 'location state after adding subcrPlan')
    const fetchData = async () => {
      const result = await OrganizationService.createOrganization(obj, 'post')
      history.push('/user/organizations')
      // handleCancel()
      // console.log(result, 'result')
    }
    fetchData()
  }

  render() {
    // console.log(this.props, 'props Subscription')
    const { activePlan, planPrice } = this.state
    const price = planPrice[activePlan]
    const mostPopular = plan => {
      // console.log(plan, 'plan')
      return classnames({
        'most__active--acc': true,
        active: activePlan === plan && true,
      })
    }
    const selectedPlan = plan => {
      // console.log(plan, 'plan')
      return classnames({
        plan__item: true,
        active: activePlan === plan && true,
      })
    }

    return (
      <div className="container subscription-plan row">
        <div className="col-sm-8 subscription-plan__content">
          <a
            role="button"
            className={selectedPlan('starter')}
            onClick={() => this.handlePlan('starter')}
            onKeyDown={null}
            tabIndex="0"
          >
            <div className={mostPopular('starter')}>Most Popular</div>
            <div className="text-center">
              <Radio checked={activePlan === 'starter'}>
                <strong style={{ fontSize: '20px' }}>Starter</strong>
              </Radio>
              <div>$5.00 per month</div>
              <hr />
            </div>
            <ul>
              <li>
                <CheckOutlined style={{ color: 'green' }} />
                <span>Send 20 invoices and quotes</span>
              </li>
              <li>
                <CheckOutlined style={{ color: 'green' }} />
                <span>Enter 5 bills</span>
              </li>
              <li>
                <CheckOutlined style={{ color: 'green' }} />
                <span>Reconcile bank transactions</span>
              </li>
              <li>
                <CheckOutlined style={{ color: 'green' }} />
                <span>Hubdoc - data capture</span>
              </li>
            </ul>
          </a>
          <a
            role="button"
            className={selectedPlan('standard')}
            onClick={() => this.handlePlan('standard')}
            onKeyDown={null}
            tabIndex="0"
          >
            <div className={mostPopular('standard')}>Most Popular</div>
            <div className="text-center">
              <Radio checked={activePlan === 'standard'}>
                <strong style={{ fontSize: '20px' }}>Standard</strong>
              </Radio>
              <div>$5.00 per month</div>
              <hr />
            </div>
            <ul>
              <li>
                <CheckOutlined style={{ color: 'green' }} />
                <span>Send invoices and quotes</span>
              </li>
              <li>
                <CheckOutlined style={{ color: 'green' }} />
                <span>Enter bills</span>
              </li>
              <li>
                <CheckOutlined style={{ color: 'green' }} />
                <span>Reconcile bank transactions</span>
              </li>
              <li>
                <CheckOutlined style={{ color: 'green' }} />
                <span>Hubdoc - data capture</span>
              </li>
            </ul>
          </a>
          <a
            role="button"
            className={selectedPlan('premium')}
            onClick={() => this.handlePlan('premium')}
            onKeyDown={null}
            tabIndex="0"
          >
            <div className={mostPopular('premium')}>Most Popular</div>
            <div className="text-center">
              <Radio checked={activePlan === 'premium'}>
                <strong style={{ fontSize: '20px' }}>Premium</strong>
              </Radio>
              <div>$5.00 per month</div>
              <hr />
            </div>
            <ul>
              <li>
                <CheckOutlined style={{ color: 'green' }} />
                <span>Send invoices and quotes</span>
              </li>
              <li>
                <CheckOutlined style={{ color: 'green' }} />
                <span>Enter bills</span>
              </li>
              <li>
                <CheckOutlined style={{ color: 'green' }} />
                <span>Reconcile bank transactions</span>
              </li>
              <li>
                <CheckOutlined style={{ color: 'green' }} />
                <span>Hubdoc - data capture</span>
              </li>
              <li>
                <CheckOutlined style={{ color: 'green' }} />
                <span>Multi currency</span>
              </li>
            </ul>
          </a>
        </div>
        <div className="col-sm-4">
          <h5>Plan Summary</h5>
          <div className="payment__section">
            <div className="item__section">
              <span>{activePlan}</span>
              <span>{price}</span>
            </div>

            <hr />
            <div className="item__section">
              <span>SubTotal</span>
              <span>{price}</span>
            </div>
            <hr />
            <div className="item__section">
              <span>Monthly Total</span>
              <span>{price}</span>
            </div>
            {/* <div className="item__section">
              <input placeholder="Promo code" />
              </div> */}
            <div className="item__section payBtn">
              <Button type="primary" onClick={this.addPlan}>
                Continue to add-ons
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ router }) => ({
  routerData: router,
})

export default connect()(WithRouter(index))
