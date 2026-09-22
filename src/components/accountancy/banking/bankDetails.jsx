import React, { Component } from 'react'

import { DownOutlined, EditOutlined } from '@ant-design/icons'
import { Menu, Dropdown, Table, Modal, Button } from 'antd'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import CreatePurchasePayment from '@/components/accountancy/payment/purchasePayment/createPurPay'
import ExportOptions from '@/components/accountancy/common/ExportOptions'
import HelperFunction from '@/services/helper'
import CreatePayment from '@/components/accountancy/payment/createPayment/index'
import OtherPrimaryReport from '@/components/accountancy/common/otherPrimaryReport'
import BankService from '@/services/banking'
import store from 'store'
import CreateOtherIncome from '@/components/accountancy/sales/otherIncome/createOtherIncome'
import CreateExpenses from '@/components/accountancy/expenses/createExpenses'
import TransferToFrom from './transferToFrom'
import './index.scss'

const MenuOption = ({ venPay, expPay, transferTo, custPay, otherPay, transferFrom }) => {
  return (
    <Menu>
      <Menu.ItemGroup title="MONEY OUT">
        <Menu.Item key="1">
          <Button
            className="text-start"
            style={{ border: 'none', background: 'none', width: '100%' }}
            onClick={() => expPay()}
          >
            Expenses
          </Button>
        </Menu.Item>
        <Menu.Item key="2">
          <Button
            className="text-start"
            style={{ border: 'none', background: 'none', width: '100%' }}
            onClick={() => venPay()}
          >
            Vendor Payment
          </Button>
        </Menu.Item>
        <Menu.Item key="3">
          <Button
            className="text-start"
            style={{ border: 'none', background: 'none', width: '100%' }}
            onClick={() => transferTo()}
          >
            Transfer to Another Acc
          </Button>
        </Menu.Item>
      </Menu.ItemGroup>

      <Menu.ItemGroup title="MONEY IN">
        <Menu.Item key="4">
          <Button
            className="text-start"
            style={{ border: 'none', background: 'none', width: '100%' }}
            onClick={() => custPay()}
          >
            Customer Payment
          </Button>
        </Menu.Item>
        <Menu.Item key="5">
          <Button
            className="text-start"
            style={{ border: 'none', background: 'none', width: '100%' }}
            onClick={() => otherPay()}
          >
            Other Income
          </Button>
        </Menu.Item>
        <Menu.Item key="6">
          <Button
            className="text-start"
            style={{ border: 'none', background: 'none', width: '100%' }}
            onClick={() => transferFrom()}
          >
            Transfer from Another Acc
          </Button>
        </Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  )
}
class BankDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isModalVisible: false,
      isTransferTo: false,
      isExpPay: false,
      isOtherPay: false,
      isCustPay: false,
      isTransferFrom: false,
      csvData: [],
      isShownReciept: false,
      transactionData: {},
      trId: '',
      isEdit: false,
      columns: [
        {
          title: '#',
          dataIndex: 'key',
          key: 'key',
          // render: (text, record, index) => index + 1,
        },
        {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
          render: (text, record) => {
            return HelperFunction.dateFormatted(record.date)
          },
          // sorter: (a, b) => a.accountType.localeCompare(b.accountType),
        },
        // {
        //   title: 'REFERENCE#',
        //   dataIndex: 'refference',
        //   key: 'refference',
        //   // sorter: (a, b) => a.accountType.localeCompare(b.accountType),
        // },
        {
          title: 'type',
          dataIndex: 'type',
          key: 'type',
          // sorter: (a, b) => a.accountType.localeCompare(b.accountType),
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          // sorter: (a, b) => a.accountType.localeCompare(b.accountType),
        },
        {
          title: 'Deposits',
          dataIndex: 'deposits',
          key: 'deposits',
          // sorter: (a, b) => a.accountType.localeCompare(b.accountType),
        },
        {
          title: 'Withdrawals',
          dataIndex: 'withdrawals',
          key: 'withdrawals',
          // sorter: (a, b) => a.accountType.localeCompare(b.accountType),
        },
        {
          title: 'Running Balance',
          dataIndex: 'runningbalance',
          key: 'runningbalance',
          // sorter: (a, b) => a.accountType.localeCompare(b.accountType),
        },
        {
          title: 'Actions',
          key: 'actions',
          className: 'actionCol',
          render: (text, record) => {
            // console.log(text, record)
            return (
              <div>
                <Button
                  onClick={() => {
                    // console.log(record, 'record')
                    if (record.type === 'Purchase Payment' || record.type === 'purchasepayment') {
                      this.showModal(record.transaction_id, true)
                    } else if (record.type === 'Sale Payment') {
                      this.custPay(record.transaction_id, true)
                    } else if (record.type === 'Expenses') {
                      this.expPay(record.transaction_id, true)
                    } else if (record.type === 'Other Income') {
                      this.otherPay(record.transaction_id, true)
                    } else if (record.type === 'transaction' && record.status === 'Credit') {
                      this.transferFrom(record.transaction_id, true)
                    } else if (record.type === 'transaction' && record.status === 'Debit') {
                      this.transferTo(record.transaction_id, true)
                    }
                  }}
                  className="p-0"
                  style={{ border: 'none', background: 'none' }}
                >
                  <span className="editIcon">
                    <EditOutlined />
                  </span>
                </Button>
              </div>
            )
          },
        },
      ],
    }
  }

  componentDidMount = () => {
    this.fetchData()
  }

  fetchData = async () => {
    const org = store.get('selectedOrg')
    const { match } = this.props
    const result = await BankService.transactionList(org.orgCode, match.params.bankId)
    // console.log(result, 'ress111')
    if (result?.transactions.length) {
      result.transactions.forEach((ele, i) => {
        ele.key = i + 1
      })
    }
    this.setState({
      transactionData: result || {},
    })
  }

  showModal = (id, value) => {
    if (!value) {
      this.setState({ isModalVisible: true })
    } else {
      this.setState({
        isModalVisible: true,
        isEdit: value,
        trId: id,
      })
    }
  }

  expPay = (id, value) => {
    if (!value) {
      this.setState({ isExpPay: true })
    } else {
      this.setState({
        isExpPay: true,
        isEdit: value,
        trId: id,
      })
    }
  }

  transferTo = (id, value) => {
    if (!value) {
      this.setState({ isTransferTo: true })
    } else {
      this.setState({
        isTransferTo: true,
        isEdit: value,
        trId: id,
      })
    }
  }

  custPay = (id, value) => {
    if (!value) {
      this.setState({ isCustPay: true })
    } else {
      this.setState({
        isCustPay: true,
        isEdit: value,
        trId: id,
      })
    }
  }

  otherPay = (id, value) => {
    if (!value) {
      this.setState({ isOtherPay: true })
    } else {
      this.setState({
        isOtherPay: true,
        isEdit: value,
        trId: id,
      })
    }
  }

  transferFrom = (id, value) => {
    if (!value) {
      this.setState({ isTransferFrom: true })
    } else {
      this.setState({
        isTransferFrom: true,
        isEdit: value,
        trId: id,
      })
    }
  }

  handleOk = () => {
    this.setState({ isModalVisible: false })
  }

  handleCancel = value => {
    this.setState(
      {
        isModalVisible: false,
        isTransferTo: false,
        isExpPay: false,
        isCustPay: false,
        isOtherPay: false,
        isTransferFrom: false,
        isEdit: false,
      },
      () => {
        if (value) {
          this.fetchData()
        }
      },
    )
  }

  render() {
    const {
      isModalVisible,
      isExpPay,
      isTransferTo,
      isCustPay,
      isOtherPay,
      isTransferFrom,
      csvData,
      isShownReciept,
      transactionData,
      columns,
      isEdit,
      trId,
    } = this.state

    const { act_name: actName, account_balance: accountBalance } =
      transactionData?.accountbalnce || {}

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }} className="mb-3">
          <div>
            <h5 style={{ margin: '0' }}>
              <strong>{actName} &nbsp;</strong>
            </h5>
            <span>Account Balance: {accountBalance}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline' }}>
            {/* <Button
              color="secondary"
              outline
              className="me-2 mb-2"
              // onClick={() => handleSendModal()}
            >
              Send
            </Button> */}
            {/* <Button
              color="secondary"
              outline
              className="me-2 mb-2"
              // onClick={() => handleRecieptModal()}
            >
              Print
            </Button> */}

            <Button color="secondary" className="me-2 mb-2">
              <Dropdown
                overlay={
                  <ExportOptions
                    handleRecieptModal={() => this.setState({ isShownReciept: !isShownReciept })}
                    csvData={csvData}
                    apiData={[]}
                  />
                }
                className="me-2 mb-2"
              >
                <a className="ant-dropdown-link">
                  Export As <DownOutlined />
                </a>
              </Dropdown>
            </Button>

            <Button color="secondary" outline className="me-2 mb-2">
              <Dropdown
                overlay={
                  <MenuOption
                    venPay={this.showModal}
                    transferTo={this.transferTo}
                    expPay={this.expPay}
                    custPay={this.custPay}
                    otherPay={this.otherPay}
                    transferFrom={this.transferFrom}
                  />
                }
                className="me-2 mb-2"
              >
                <a className="ant-dropdown-link">
                  Add Transaction <DownOutlined />
                </a>
              </Dropdown>
            </Button>
          </div>
        </div>
        <div>
          {/* <hr /> */}
          {/* <Button type="primary" onClick={this.showModal}>
            Open Modal
          </Button> */}
          <section>
            <Table
              id="table__layout--css"
              rowKey="key"
              columns={columns}
              dataSource={transactionData?.transactions}
              pagination
              showSorterTooltip={false}
            />
          </section>
          {isModalVisible && (
            <Modal
              className="purchaseOrderBanking formModal"
              title="Vendor Payment"
              visible={isModalVisible}
              maskClosable={false}
              footer={null}
              onCancel={this.handleCancel}
            >
              <div>
                <CreatePurchasePayment closeModal={this.handleCancel} isEdit={isEdit} trId={trId} />
              </div>
            </Modal>
          )}
          {isExpPay && (
            <Modal
              className="purchaseOrderBanking formModal"
              title="Expenses"
              visible={isExpPay}
              maskClosable={false}
              footer={null}
              onCancel={this.handleCancel}
            >
              <div>
                <CreateExpenses closeModal={this.handleCancel} isEdit={isEdit} trId={trId} />
              </div>
            </Modal>
          )}
          {isTransferTo && (
            <Modal
              className="transferToFrom formModal"
              title="Transfer To"
              visible={isTransferTo}
              maskClosable={false}
              footer={null}
              onCancel={this.handleCancel}
            >
              <div>
                <TransferToFrom
                  handleCancel={this.handleCancel}
                  isTransferTo
                  closeModal={this.handleCancel}
                  isEdit={isEdit}
                  trId={trId}
                />
              </div>
            </Modal>
          )}
          {isCustPay && (
            <Modal
              className="purchaseOrderBanking formModal"
              title="Customer Payment"
              visible={isCustPay}
              maskClosable={false}
              footer={null}
              onCancel={this.handleCancel}
            >
              <div>
                <CreatePayment closeModal={this.handleCancel} isEdit={isEdit} trId={trId} />
              </div>
            </Modal>
          )}
          {isOtherPay && (
            <Modal
              className="otherIncomeModal formModal"
              title="Other Income"
              visible={isOtherPay}
              maskClosable={false}
              footer={null}
              onCancel={this.handleCancel}
            >
              <div>
                <CreateOtherIncome
                  modalWidth="100%"
                  closeModal={this.handleCancel}
                  isEdit={isEdit}
                  trId={trId}
                />
              </div>
            </Modal>
          )}
          {isTransferFrom && (
            <Modal
              className="transferToFrom formModal"
              title="Transfer From"
              visible={isTransferFrom}
              maskClosable={false}
              footer={null}
              onCancel={this.handleCancel}
            >
              <div>
                <TransferToFrom
                  handleCancel={this.handleCancel}
                  isTransferFrom
                  closeModal={this.handleCancel}
                  isEdit={isEdit}
                  trId={trId}
                />
              </div>
            </Modal>
          )}

          {isShownReciept && (
            <OtherPrimaryReport
              visible={isShownReciept}
              handleRecieptModal={() => this.setState({ isShownReciept: !isShownReciept })}
              quoteData={[] || []}
              detailsInfo={{}}
              salesValue="Purchase Payment Receipt"
              flag="PurchasePaymentDetails"
            />
          )}
        </div>
      </div>
    )
  }
}

export default connect()(BankDetails)

