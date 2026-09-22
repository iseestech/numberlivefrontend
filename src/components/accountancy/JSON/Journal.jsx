import HelperFunction from '@/services/helper'

const JournalCols = {
  mannualJournal: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Date',
      dataIndex: 'journelDate',
      key: 'journelDate',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Journal#',
      dataIndex: 'journelNo',
      key: 'journelNo',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Credit',
      dataIndex: 'creditTotal',
      key: 'creditTotal',
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: HelperFunction.renderCellAmt,
    },
    {
      title: 'Debit',
      dataIndex: 'debitTotal',
      key: 'debitTotal',
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: HelperFunction.renderCellAmt,
    },
  ],
  reverseJournal: [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Date',
      dataIndex: 'journelDate',
      key: 'journelDate',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Rev Journal#',
      dataIndex: 'revjournelNo',
      key: 'revjournelNo',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      filter: 'agTextColumnFilter',
    },
    {
      title: 'Credit',
      dataIndex: 'creditTotal',
      key: 'creditTotal',
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: HelperFunction.renderCellAmt,
    },
    {
      title: 'Debit',
      dataIndex: 'debitTotal',
      key: 'debitTotal',
      filter: 'agTextColumnFilter',
      isCustCellRender: true,
      cellRenderer: HelperFunction.renderCellAmt,
    },
  ],
}

export default JournalCols
