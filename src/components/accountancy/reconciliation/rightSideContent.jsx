import React, { useState } from 'react'
import { Menu, Row, Col, Tabs, Modal, Input, Dropdown, Button, Select, notification } from 'antd'
import { DownOutlined, SearchOutlined } from '@ant-design/icons'
import CreatePurchasePayment from '@/components/accountancy/payment/purchasePayment/createPurPay'
import TransactionList from './transactionList'
import TransferToFrom from '../banking/transferToFrom'
import CreateOtherIncome from '../sales/otherIncome/createOtherIncome'
import CreatePayment from '../payment/createPayment'
import CreateExpenses from '../expenses/createExpenses'

const { TabPane } = Tabs

const { Option, OptGroup } = Select

const MenuOption = ({ venPay, expPay, transferTo, custPay, otherPay, transferFrom }) => {
  return (
    <Menu>
      <Menu.ItemGroup title="MONEY OUT">
        <Menu.Item key="1">
          <Button
            className="text-start"
            style={{ border: 'none', background: 'none', width: '100%' }}
            // onClick={() => expPay()}
          >
            Expenses
          </Button>
        </Menu.Item>
        <Menu.Item key="2">
          <Button
            className="text-start"
            style={{ border: 'none', background: 'none', width: '100%' }}
            // onClick={() => venPay()}
          >
            Vendor Payment
          </Button>
        </Menu.Item>
        <Menu.Item key="3">
          <Button
            className="text-start"
            style={{ border: 'none', background: 'none', width: '100%' }}
            // onClick={() => transferTo()}
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
            // onClick={() => custPay()}
          >
            Customer Payment
          </Button>
        </Menu.Item>
        <Menu.Item key="5">
          <Button
            className="text-start"
            style={{ border: 'none', background: 'none', width: '100%' }}
            // onClick={() => otherPay()}
          >
            Other Income
          </Button>
        </Menu.Item>
        <Menu.Item key="6">
          <Button
            className="text-start"
            style={{ border: 'none', background: 'none', width: '100%' }}
            // onClick={() => transferFrom()}
          >
            Transfer from Another Acc
          </Button>
        </Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  )
}

const RightSideContent = props => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isExpPay, setIsExpPay] = useState(false)
  const [isTransferTo, setisTransferTo] = useState(false)
  const [isCustPay, setIsCustPay] = useState(false)
  const [isOtherPay, setIsOtherPay] = useState(false)
  const [isTransferFrom, setIsTransferFrom] = useState(false)
  const [dropdownValue, setDropdownValue] = useState('')

  const [isEdit, setIsEdit] = useState(false)
  const [trId, setTrId] = useState(false)
  const [activeKey, setActiveKey] = useState('findMatch')
  // const [isShown, setIsShown] = useState(false)

  const handleChange = value => {
    // console.log(`selected ${value}`)
    // setDropdownValue(value)
    openModal(value)
  }

  const handleCancel = value => {
    if (value === true) {
      notification.success({
        message: 'Success',
        description: 'Please select transaction from matched data',
        duration: 6,
      })
    }
    setIsModalVisible(false)
    setIsExpPay(false)
    setisTransferTo(false)
    setIsCustPay(false)
    setIsOtherPay(false)
    setIsTransferFrom(false)
  }

  const callback = key => {
    // console.log(key)
    handleClick('close')
  }
  const handleKey = val => {
    setActiveKey(val)
  }
  const onKeyPressHandler = () => {
    // console.log('working')
  }
  const openModal = val => {
    // let value = 'Expenses'
    // console.log(val, 'dropdownValue')
    if (!val) {
      return notification.warning({
        message: 'Warning',
        description: 'Please select form type',
        duration: 6,
      })
    }
    if (val === 'Expenses') {
      setIsExpPay(true)
    } else if (val === 'Vendor Payment') {
      setIsModalVisible(true)
    } else if (val === 'Transfer to Another Acc') {
      setisTransferTo(true)
    } else if (val === 'Customer Payment') {
      setIsCustPay(true)
    } else if (val === 'Other Income') {
      setIsOtherPay(true)
    } else if (val === 'Transfer from Another Acc') {
      setIsTransferFrom(true)
    }
    return false
  }

  const { handleClick, isDebit } = props

  return (
    <div>
      {/* <Tabs defaultActiveKey="1" onChange={callback}> */}
      {/* <TabPane tab="Match" key="1" className="ps-2"> */}
      {/* <Row className="match-rightSide-item">
        
        <Button className="active" onClick={handleClick}>
          Find and Match
        </Button>
      </Row> */}
      {/* </TabPane> */}
      {/* <TabPane tab="Create" key="2" className="ps-2"> */}
      <Row className="create-rightSide-item">
        <Col
          span={9}
          className={
            activeKey === 'createMatch' ? 'right__button rightBorder' : 'right__button leftBorder'
          }
        >
          {/* <Button className="active" onClick={handleClick}> */}
          <span
            role="button"
            tabIndex="0"
            onKeyPress={onKeyPressHandler}
            // onClick={handleClick}
            onClick={() => handleKey('findMatch')}
            className="matchBtn"
          >
            {' '}
            Match
          </span>
          {/* </Button> */}
          <span>|</span>
          {/* <Button className="active" onClick={() => openModal()}> */}
          <span
            role="button"
            tabIndex="0"
            onKeyPress={onKeyPressHandler}
            onClick={() => handleKey('createMatch')}
            // onClick={() => openModal()}
            className="createBtn"
          >
            {' '}
            Create
          </span>
          {/* </Button> */}
        </Col>
        {activeKey === 'createMatch' && (
          <Col span={15} className="ps-2">
            <Select
              defaultValue=""
              className="text-center"
              style={{ width: '100%' }}
              onChange={handleChange}
            >
              <Option value="">Select Form Type</Option>
              {isDebit ? (
                <OptGroup label="Money Out">
                  <Option value="Expenses">Expenses</Option>
                  <Option value="Vendor Payment">Vendor Payment</Option>
                  <Option value="Transfer to Another Acc"> Transfer to Another Acc</Option>
                </OptGroup>
              ) : (
                <OptGroup label="Money In">
                  <Option value="Customer Payment">Customer Payment</Option>
                  <Option value="Other Income">Other Income</Option>
                  <Option value="Transfer from Another Acc"> Transfer from Another Acc</Option>
                </OptGroup>
              )}
            </Select>
          </Col>
        )}
        {/* {activeKey === 'createMatch' && (
          <Col span={2}>
            <Button className="p-0" style={{ border: '0' }} onClick={() => openModal()}>
              <span>
                <SearchOutlined />
              </span>
            </Button>
          </Col>
        )} */}

        {activeKey === 'findMatch' && (
          <Col span={15} className="ps-2">
            <Button className="" style={{ width: '100%' }} onClick={() => handleClick()}>
              <span>
                <SearchOutlined />
              </span>{' '}
              Find and Match
            </Button>
          </Col>
        )}
        {/* <Col span={24}>
              Description <Input />
            </Col> */}
      </Row>
      {/* </TabPane> */}
      {/* </Tabs> */}

      {isModalVisible && (
        <Modal
          className="purchaseOrderBanking formModal"
          title="Vendor Payment"
          visible={isModalVisible}
          maskClosable={false}
          footer={null}
          onCancel={handleCancel}
        >
          <div>
            <CreatePurchasePayment
              closeModal={handleCancel}
              isEdit={isEdit}
              trId={trId}
              reconcile
            />
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
          onCancel={handleCancel}
        >
          <div>
            <CreateExpenses closeModal={handleCancel} isEdit={isEdit} trId={trId} reconcile />
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
          onCancel={handleCancel}
        >
          <div>
            <TransferToFrom
              handleCancel={handleCancel}
              isTransferTo
              closeModal={handleCancel}
              isEdit={isEdit}
              trId={trId}
              reconcile
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
          onCancel={handleCancel}
        >
          <div>
            <CreatePayment closeModal={handleCancel} isEdit={isEdit} trId={trId} reconcile />
          </div>
        </Modal>
      )}
      {isOtherPay && (
        <Modal
          // className="transferToFrom"
          className="formModal otherIncomeModal"
          title="Other Income"
          visible={isOtherPay}
          maskClosable={false}
          footer={null}
          onCancel={handleCancel}
        >
          <div>
            <CreateOtherIncome
              modalWidth="100%"
              closeModal={handleCancel}
              isEdit={isEdit}
              trId={trId}
              reconcile
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
          onCancel={handleCancel}
        >
          <div>
            <TransferToFrom
              handleCancel={handleCancel}
              isTransferFrom
              closeModal={handleCancel}
              isEdit={isEdit}
              trId={trId}
              reconcile
            />
          </div>
        </Modal>
      )}
    </div>
  )
}

export default RightSideContent
