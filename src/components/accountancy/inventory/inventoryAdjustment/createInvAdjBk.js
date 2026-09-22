import { useState, useForm } from 'react'
import * as React from 'react'
import { Form, Input, Button, Table } from 'antd'
import { PlusOutlined, EditOutlined, MinusOutlined } from '@ant-design/icons'

const { Column } = Table

const tableCol = (props, editRow) => {
  const { add, remove } = props
  return [
    {
      label: 'ITEM DETAILS',
      title: 'ITEM DETAILS',
      name: 'productName',
      dataIndex: 'productName',
      placeholder: '',
      //   editable: true,
      render: (key, item, index) => {
        // console.log(key, item, index)
        return (
          <Form.Item name={[index, 'productName']}>
            <Input defaultValue={item.productName} />
          </Form.Item>
        )
      },
    },
    {
      label: 'QUANTITY AVAILABLE',
      title: 'QUANTITY AVAILABLE',
      name: 'qty',
      dataIndex: 'qty',
      placeholder: '',
      //   editable: true,
      render: (key, item, index) => {
        return (
          <Form.Item name={[index, 'qty']}>
            <Input defaultValue={item.qty} value={item.qty} />
          </Form.Item>
        )
      },
    },
    {
      label: 'NEW QUANTITY ON HAND',
      title: 'NEW QUANTITY ON HAND',
      name: 'newQty',
      dataIndex: 'newQty',
      placeholder: '',
      //   editable: true,
      render: (key, item) => {
        // console.log(item, 'QUANTITY ON HAN', key)
        return <>{item.newQty}</>
      },
    },
    {
      label: 'QUANTITY ADJUSTED',
      title: 'QUANTITY ADJUSTED',
      name: 'qtyAdjusted',
      dataIndex: 'qtyAdjusted',
      placeholder: '',
      editable: true,
    },
    {
      label: 'COST PRICE',
      title: 'COST PRICE',
      name: 'costPrize',
      placeholder: '',
      dataIndex: 'costPrize',
      editable: true,
    },
    {
      label: 'REASON',
      title: 'REASON',
      name: 'reason',
      placeholder: '',
      dataIndex: 'reason',
      editable: false,
    },
    {
      label: 'ACTION',
      title: 'ACTION',
      name: 'action',
      placeholder: '',
      editable: false,
      render: (key, record) => {
        return (
          <div style={{ display: 'flex' }}>
            <Button
              icon={<EditOutlined />}
              shape="circle"
              style={{ marginRight: 8 }}
              onClick={() => key(record)}
            />
            <Button
              icon={<MinusOutlined />}
              shape="circle"
              onClick={() => remove(record.productName)}
            />
          </div>
        )
      },
    },
  ]
}

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <Input /> : <Input />
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}
const users2 = [
  {
    productName: 'tets',
    qty: '1',
    newQty: '2',
    qtyAdjusted: '1',
    costPrize: '100',
    reason: 'Broken',
  },
  {
    productName: 'sam',
    qty: '',
    newQty: '',
    qtyAdjusted: '',
    costPrize: '',
    reason: '',
  },
  {
    productName: 'demo',
    qty: '',
    newQty: '',
    qtyAdjusted: '',
    costPrize: '',
    reason: '',
  },
]

const CreateInvAdj = props => {
  const { users, add, remove } = props
  const [form] = Form.useForm()
  // console.log(users, 'users')
  const [editingIndex, setEditingIndex] = useState(undefined)

  const [editingKey, setEditingKey] = useState('')

  const isEditing = record => record.key === editingKey

  const edit = (value, row, index) => {
    // console.log(value, row, index, 'Selected Row')
    // form.setFieldsValue({
    //   name: '',
    //   age: '',
    //   address: '',
    //   ...record,
    // })
    // setEditingKey(record.key)
  }

  const removeRow = item => {
    // console.log('removeRow', item)
  }

  const editRow = item => {
    // console.log('editRow', item)
  }
  const cancel = () => {
    setEditingKey('')
  }

  return (
    <>
      <Table
        // components={{
        //   body: {
        //     cell: EditableCell,
        //   },
        // }}
        dataSource={users2}
        // columns={tableCol(props, editRow)}
        pagination={false}
        // footer={() => {
        //   return (
        //     <Form.Item>
        //       <Button onClick={add}>
        //         <PlusOutlined /> Add field
        //       </Button>
        //     </Form.Item>
        //   )
        // }}
      >
        {tableCol(props, editRow).map(item => {
          return (
            <Column
              dataIndex={item.name}
              title={item.title}
              key={item.name}
              editable={item.editable}
              render={(value, row, index) => {
                return (
                  <>
                    {item.name !== 'action' ? (
                      <Form.Item name={[index, item.name]}>
                        <Input placeholder={item.placeholder} />
                      </Form.Item>
                    ) : (
                      <>{item.render(editRow, row)}</>
                    )}
                  </>
                )
              }}
            />
          )
        })}
        {/* <Column
        dataIndex='age'
        title='Age'
        render={(value, row, index) => {
          return (
            <Form.Item name={[index, 'age']}>
              {({ getFieldValue, getFieldsValue }) => {
                // console.log(getFieldsValue())
                return (
                  <React.Fragment>
                    {editingIndex === index ? (
                      <Input placeholder="age" style={{ width: '30%', marginRight: 8 }} />
                    ) : (
                      getFieldValue(['users', index, 'age'])
                    )}
                  </React.Fragment>
                )
              }}
            </Form.Item>
          )
        }}
      /> */}
        {/* <Column
        dataIndex='name'
        title='Name'
        render={(value, row, index) => {
          return (
            <Form.Item name={[index, 'name']}>
              <Input placeholder="name" style={{ width: '30%', marginRight: 8 }} />
            </Form.Item>
          )
        }}
      /> */}
        {/* <Column
        title="Action"
        render={(value, row, index) => {
          return (
            <div style={{ display: 'flex' }}>
              <Button
                icon={<EditOutlined />}
                shape="circle"
                style={{ marginRight: 8 }}
                onClick={() => edit(value, row, index)}
              />
              <Button icon={<MinusOutlined />} shape="circle" onClick={() => remove(row.name)} />
            </div>
          )
        }}
      /> */}
      </Table>
    </>
  )
}

export default CreateInvAdj
