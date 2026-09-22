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

class SendEmail extends React.Component {
  state = { visible: false }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  handleOk = () => {
    this.setState({
      visible: false,
    })
  }

  handleCancel = () => {
    const { handleSendModal } = this.props
    handleSendModal()
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
        // console.log('OK')
      },
      onCancel() {
        // console.log('Cancel')
      },
    })
  }

  render() {
    const { headingText, visible } = this.props
    return (
      <div>
        <Modal
          title="Send Quote"
          open={visible}
          okText="Send"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          style={{ width: '700px' }}
        >
          <div className="card">
            <div className="card-body">
              <Form layout="horizontal">
                <div className="row">
                  <div className="col-md-12">
                    <Form.Item name="custName" label="From">
                      <span>test@gmail.com</span>
                    </Form.Item>
                  </div>
                  <div className="col-md-12">
                    <Form.Item name="custName" label="Reply to">
                      <span>test@gmail.com</span>
                    </Form.Item>
                  </div>
                  <div className="col-md-12">
                    <hr />
                  </div>
                  <div className="col-md-12">
                    <Form.Item name="custName" label="To:">
                      <Input placeholder="" />
                    </Form.Item>
                  </div>
                  <div className="col-md-12">
                    <Form.Item name="custName" label="Message">
                      <Input placeholder="" />
                    </Form.Item>
                  </div>
                  <div className="col-md-12">
                    <TextArea placeholder="" />
                  </div>
                  {/* <div className="col-md-12">
                    <Form.Item name="custName" label="Send me a copy">
                        <Checkbox>Checkbox</Checkbox>
                    </Form.Item>
                  </div> */}
                </div>
              </Form>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default SendEmail
