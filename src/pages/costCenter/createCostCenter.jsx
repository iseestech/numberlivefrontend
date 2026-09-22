import React, { useEffect, useRef, useState } from 'react'
import { Form, Row, Col, Button, Input } from 'antd'
import HelperFunction from '@/services/helper'
import costCenter from '@/services/costCenter'


const CreateCostCenter = ({ onCancel, updateData, actionType }) => {
  const [input, setInput] = useState(updateData?.centerName || '')
  const action = actionType

  // we use this component for both update and delete

  useEffect(() => {
    if (updateData?.centerName?.length > 0) {
      const dd = updateData?.centerName
      setInput(dd) //
    }
  }, [])

  const onFinish = async () => {
    let result
    if (updateData?.id) {
      result = await costCenter.updateCostCenter({ id: updateData?.id, centerName: input })
    } else {
      result = await costCenter.createCostCenter({ centerName: input })
    }

    if (result && result?.status === 200) {
      onCancel(false)
    }
  }

  return (
    <>
      <Form className="form__layout--css" layout="horizontal" onFinish={onFinish}>
        <div className="form__content--css pb-0" style={{ boxShadow: 'none' }}>
          <Row className="form__body-content pt-0 pb-0">
            <Col span={24}>
              <Row>
                <Col span={24}>
                  {updateData?.id && <p>Id: {updateData?.id}</p>}
                  <Form.Item name="Region" label="Center Name" initialValue={input}>
                    <Input value={input} onChange={e => setInput(e.target.value)} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="text-end">
            <hr />
            <Button type="default" className="text-center me-2" onClick={() => onCancel(false)}>
              <strong>Cancel</strong>
            </Button>
            <Button type="primary" className="text-center me-3" onClick={onFinish}>
              <strong>{action}</strong>
            </Button>
          </div>
        </div>
      </Form>
    </>
  )
}

export default CreateCostCenter
