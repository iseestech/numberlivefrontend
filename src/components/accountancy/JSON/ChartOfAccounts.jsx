import React from 'react'

const ChartOfAccCols = {
  allAccounts: [
    {
      title: 'Account Code',
      dataIndex: 'actId',
      key: 'actId',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Account Name',
      dataIndex: 'actName',
      key: 'actnName',
      filter: 'agTextColumnFilter',

      cellRenderer: params => {
        const dt = params?.data

        return (
          <div>
            <strong>{dt?.actName}</strong>
            <br />
            <span>{dt?.discription}</span>
          </div>
        )
      },
    },
    {
      title: 'Group Name',
      dataIndex: 'accSubGroupname',
      key: 'accSubGroupname',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Primary Account',
      dataIndex: 'accGroupName',
      key: 'accGroupName',
      filter: 'agTextColumnFilter',
    },
  ],
  tableColumns: [
    {
      title: 'Account Code',
      dataIndex: 'actId',
      key: 'actId',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Account Name',
      dataIndex: 'actName',
      key: 'actname',
      filter: 'agTextColumnFilter',

      cellRenderer: params => {
        const dt = params?.data

        return (
          <div>
            <strong>{dt?.actName}</strong>
            <br />
            <span>{dt?.discription}</span>
          </div>
        )
      },
    },
    {
      title: 'Group Name',
      dataIndex: 'accSubGroupname',
      key: 'accSubGroupname',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Primary Account',
      dataIndex: 'accGroupName',
      key: 'accGroupName',
      filter: 'agTextColumnFilter',
    },
  ],
}

export default ChartOfAccCols
