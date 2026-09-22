import React, { useState, useEffect } from 'react'
import JournalService from '@/services/journal'
import { Menu, Dropdown, Table, Alert, Popover, Row, Col, Collapse } from 'antd'
import store from 'store'
import Timeline from './TimeLine'

const { Panel } = Collapse

const columnData = [
  {
    title: '#',
    dataIndex: 'key',
    key: 'key',
    render: (text, record, index) => index + 1,
  },
  {
    title: 'Account',
    dataIndex: 'act_name',
  },
  {
    title: 'Debit',
    dataIndex: 'Debit',
  },
  {
    title: 'Credit',
    dataIndex: 'Credit',
  },
]

const DisplayJournal = props => {
  const [rowData, setRowData] = useState([])
  const { trId, type, isJournal } = props
  useEffect(() => {
    const org = store.get('selectedOrg')

    const fetchData = async () => {
      const obj = {
        orgCode: org.orgCode,
        id: props.trId,
        type: props?.type || '',
      }
      const result = await JournalService.displayJournal(obj)
      // const result2 = await LogsService.displayLogs(obj)
      // console.log(result, 'result')
      setRowData(result || [])
    }
    if (isJournal) {
      fetchData()
    }
  }, [])

  const callback = key => {
    // console.log(key)
  }
  return (
    <>
      <Row style={{ width: '100%' }} className="bottom__section mt-4">
        <Col span={24} className="details_layout--page">
          <Collapse onChange={callback}>
            {isJournal && (
              <Panel
                header={<strong>Journal</strong>}
                key="1"
                className="details__page--content p-0"
              >
                <Table
                  className="details__table--field"
                  pagination={false}
                  dataSource={rowData}
                  columns={columnData}
                  rowKey="id"
                  scroll={{ x: 691 }}
                />
              </Panel>
            )}
            <Panel header={<strong>History</strong>} key="2" className="history__section">
              <Timeline data={props} />
            </Panel>
          </Collapse>
        </Col>
      </Row>
    </>
  )
}

export default DisplayJournal
