import HelperFunction from '@/services/helper'

const Banking = {
  bankAcc: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Account Name',
      dataIndex: 'actname',
      key: 'actname',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Account Code',
      dataIndex: 'accountid',
      key: 'accountid',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Bank Name',
      dataIndex: 'actname',
      key: 'bankName',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Nature Of Account',
      dataIndex: 'natureofaccount',
      key: 'natureofaccount',
      filter: 'agTextColumnFilter',
    },
  ],
  bankReconciliation: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'DATE',
      dataIndex: 'date',
      key: 'date',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'TYPE',
      dataIndex: 'type',
      key: 'type',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'DEPOSITS',
      dataIndex: 'deposits',
      key: 'deposits',
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: HelperFunction.renderCellAmt,
    },
    {
      title: 'WITHDRAWALS',
      dataIndex: 'withdrawals',
      key: 'withdrawals',
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: HelperFunction.renderCellAmt,
    },
    {
      title: 'BANK DATE',
      dataIndex: 'bankDate',
      key: 'bankDate',
      filter: 'agTextColumnFilter',
    },
  ],
}

export default Banking
