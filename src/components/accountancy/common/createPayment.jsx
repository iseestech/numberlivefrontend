/* eslint-disable */
import React from 'react'
import {
  Input,
  Slider,
  Cascader,
  Upload,
  Modal,
  message,
  Checkbox,
  Select,
  Button,
  Form,
  Radio,
} from 'antd'
import QuotationService from '@/services/sales'
// import './index.scss'
const { confirm } = Modal
const { Group } = Checkbox
const { TextArea } = Input
function info() {
  Modal.info({
    title: 'This is a notification message',
    content: (
      <div>
        <p>some messages...some messages...</p>
        <p>some messages...some messages...</p>
      </div>
    ),
    onOk() {},
  })
}

function onChange(checkedValues) {
  // console.log('checked = ', checkedValues)
}

function success() {
  Modal.success({
    title: 'This is a success message',
    content: 'some messages...some messages...',
  })
}

function error() {
  Modal.error({
    title: 'This is an error message',
    content: 'some messages...some messages...',
  })
}

function warning() {
  Modal.warning({
    title: 'This is a warning message',
    content: 'some messages...some messages...',
  })
}

const optionsWithPurchase = [{ label: 'I Purchase this product', value: 'purchase' }]
const optionsWithSale = [{ label: 'I Sell this product', value: 'sale' }]

class CreatePayment extends React.Component {
  state = { visible: this.props.visible }

  showModal = () => {
    // console.log('temp')
    this.setState({
      visible: true,
    })
  }

  handleOk = () => {
    const { approveInvoice } = this.props
    // console.log('OK')
    // approveInvoice()
    this.setState(
      {
        visible: false,
      },
      () => approveInvoice(),
    )
  }

  handleCancel = () => {
    // const { handleCreateModal } = this.props
    // handleCreateModal()
    this.setState({
      visible: false,
    })
  }

  showConfirm = () => {
    confirm({
      title: 'Do you Want to delete these items?',
      content: 'Some descriptions',
      onOk() {
        // console.log('OK')
      },
      onCancel() {
        // console.log('Cancel')
      },
    })
  }

  showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure delete this task?',
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        const { approveInvoice } = this.props
        // console.log('OK')
        approveInvoice()
      },
      onCancel() {
        // console.log('Cancel')
      },
    })
  }

  render() {
    const { visible } = this.state

    return (
      <div>
        <Button type="button" onClick={() => this.showModal()}>
          Pay
        </Button>
        <Modal
          title="Add Payment"
          visible={visible}
          okText="Proceed"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          style={{ width: '700px' }}
        >
          <div className="card">
            <div className="card-body">Payment Amount :- 1000</div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default CreatePayment
