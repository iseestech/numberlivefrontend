import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  Table,
  Popconfirm,
  Button,
  Input,
  Form,
  Select,
  Divider,
  Modal,
  DatePicker,
  Row,
  Col,
} from "antd";
import ReportServices from "@/services/reports";
import HelperFunction from "@/services/helper";
import moment from "moment";
import { AgGridReact } from "ag-grid-react";
import singleLevelColumn, {
  agGetContextMenuItems,
  agGridautoGroupColumnDef,
  agGridDefaultColDef,
  agGridStatusBar,
} from "@/components/accountancy/sales/aggrid/singleLevelColumn";
import Payable from "@/components/accountancy/JSON/Payable";

const custDetails = [
  ...Payable.billsDetails,
  // {
  //   title: '#',
  //   dataIndex: 'key',
  //   key: 'key',
  //   // render: (text, record, index) => index + 1,
  // },
  // {
  //   title: 'Invoice No',
  //   name: 'invoice_no',
  //   dataIndex: 'invoice_no',
  //   responsive: ['xs', 'sm'],
  //   render: (text, record, index) => (
  //     <Link className="hrefLink" to={`/purchase/invoice/${record.invoice_no}`}>
  //       {' '}
  //       {record.invoice_no}
  //     </Link>
  //   ),
  // },
  // {
  //   title: 'Vendor Name',
  //   name: 'vendor_name',
  //   dataIndex: 'vendor_name',
  //   responsive: ['xs', 'sm'],
  // },
  // {
  //   title: 'Payment Status',
  //   dataIndex: 'payment_status',
  //   name: 'payment_status',
  //   responsive: ['xs', 'sm'],
  // },
  // {
  //   title: 'Bill Amount',
  //   dataIndex: 'bill_amount',
  //   name: 'bill_amount',
  //   responsive: ['xs', 'sm'],
  // },

  // {
  //   title: 'Balance Amount',
  //   dataIndex: 'balance_amount',
  //   name: 'balance_amount',
  //   responsive: ['xs', 'sm'],
  // },
];

const receivableSummaryCol = [
  {
    title: "#",
    dataIndex: "key",
    key: "key",
    // render: (text, record, index) => index + 1,
  },
  {
    title: "Date",
    name: "estimate_date",
    dataIndex: "estimate_date",
    responsive: ["xs", "sm"],
    isCustCellRender: true,
    cellRenderer: (params) => {
      const dt = params?.data || {};
      return HelperFunction.dateFormatted(dt.estimate_date);
    },
  },
  {
    title: "Invoice No",
    name: "invoice_no",
    dataIndex: "invoice_no",
    responsive: ["xs", "sm"],
    isCustCellRender: true,
    cellRenderer: (params) => {
      const dt = params?.data || {};
      return (
        <Link className="hrefLink" to={`/sales/invoice/${dt.invoice_no}`}>
          {" "}
          {dt.invoice_no}
        </Link>
      );
    },
    // render: (text, record, index) => (
    //   <Link className="hrefLink" to={`/sales/invoice/${record.invoice_no}`}>
    //     {' '}
    //     {record.invoice_no}
    //   </Link>
    // ),
  },
  {
    title: "Customer Name",
    name: "customername",
    dataIndex: "customername",
    responsive: ["xs", "sm"],
    cellRenderer: (params) => {
      const dt = params?.data || {};
      return (
        <Link
          className="hrefLink"
          to={`/report/Sales By Customer/${dt.customerid}`}
        >
          {" "}
          {dt.customername}
        </Link>
      );
    },
    // render: (text, record) => {
    //   return (
    //     <Link to={`/report/Sales By Customer/${record.customerid}`}>{record.customername}</Link>
    //   )
    // }
  },
  {
    title: "Payment Status",
    dataIndex: "payment_status",
    name: "payment_status",
    responsive: ["xs", "sm"],
  },
  {
    title: "Due Amount",
    dataIndex: "invoice_due_amount",
    name: "invoice_due_amount",
    responsive: ["xs", "sm"],
  },

  {
    title: "Total Without Tax",
    dataIndex: "total_amt_without_tax",
    name: "total_amt_without_tax",
    responsive: ["xs", "sm"],
  },
  {
    title: "Total",
    dataIndex: "total",
    name: "total",
    responsive: ["xs", "sm"],
  },
];

const paymentMadeCol = [
  ...Payable.paymentMade,
  // {
  //   title: '#',
  //   dataIndex: 'key',
  //   key: 'key',
  //   // render: (text, record, index) => index + 1,
  // },
  // {
  //   title: 'Date',
  //   name: 'payment_date',
  //   dataIndex: 'payment_date',
  //   responsive: ['xs', 'sm'],
  //   render: (text, record) => {
  //     return HelperFunction.dateFormatted(record.payment_date)
  //   },
  // },
  // {
  //   title: 'Vendor Name',
  //   name: 'vendor_name',
  //   dataIndex: 'vendor_name',
  //   responsive: ['xs', 'sm'],
  // },
  // {
  //   title: 'Payment No',
  //   name: 'payment_no',
  //   dataIndex: 'payment_no',
  //   responsive: ['xs', 'sm'],
  // },
  // {
  //   title: 'Payment Mode',
  //   dataIndex: 'payment_mode',
  //   name: 'payment_mode',
  //   responsive: ['xs', 'sm'],
  // },
  // {
  //   title: 'Paid Amount',
  //   dataIndex: 'amount_paid',
  //   name: 'amount_paid',
  //   responsive: ['xs', 'sm'],
  // },
];
const purchaseOrderDetailsCol = [
  ...Payable.purchaseOrderDetails,
  // {
  //   title: '#',
  //   dataIndex: 'key',
  //   key: 'key',
  //   // render: (text, record, index) => index + 1,
  // },
  // {
  //   title: 'Date',
  //   name: 'poDate',
  //   dataIndex: 'poDate',
  //   responsive: ['xs', 'sm'],
  //   render: (text, record) => {
  //     return HelperFunction.dateFormatted(record.poDate)
  //   },
  // },
  // {
  //   title: 'Vendor Name',
  //   name: 'VendorName',
  //   dataIndex: 'VendorName',
  //   responsive: ['xs', 'sm'],
  // },
  // {
  //   title: 'Purchase Order No',
  //   name: 'purchase_order_no',
  //   dataIndex: 'purchase_order_no',
  //   responsive: ['xs', 'sm'],
  //   render: (text, record, index) => (
  //     <Link className="hrefLink" to={`/purchase/order/${record.purchase_order_no}`}>
  //       {' '}
  //       {record.purchase_order_no}
  //     </Link>
  //   ),
  // },
  // {
  //   title: 'Status',
  //   name: 'accept_status',
  //   dataIndex: 'accept_status',
  //   responsive: ['xs', 'sm'],
  // },
  // {
  //   title: 'Amount',
  //   dataIndex: 'amount',
  //   name: 'amount',
  //   responsive: ['xs', 'sm'],
  // },
];

const vendorCreditCol = [
  ...Payable.vendorCreditDetails,
  // {
  //   title: '#',
  //   dataIndex: 'key',
  //   key: 'key',
  //   // render: (text, record, index) => index + 1,
  // },
  // {
  //   title: 'Date',
  //   name: 'pur_return_date',
  //   dataIndex: 'pur_return_date',
  //   responsive: ['xs', 'sm'],
  //   render: (text, record) => {
  //     return HelperFunction.dateFormatted(record.pur_return_date)
  //   },
  // },
  // {
  //   title: 'Vendor Name',
  //   name: 'vendor_name',
  //   dataIndex: 'vendor_name',
  //   responsive: ['xs', 'sm'],
  // },
  // {
  //   title: 'Purchase Return No',
  //   name: 'purchase_return_no',
  //   dataIndex: 'purchase_return_no',
  //   responsive: ['xs', 'sm'],
  // },
  // {
  //   title: 'Amount',
  //   dataIndex: 'amount',
  //   name: 'amount',
  //   responsive: ['xs', 'sm'],
  // },
];

const VendorReportDetails = (props) => {
  const [tableCustData, setTableCustData] = useState([]);
  const [paymnetMadeData, setPaymnetMadeData] = useState([]);
  const [tableCustInvoiceData, setTableCustInvoiceData] = useState([]);
  const [purchaseOrderData, setPurchaseOrderData] = useState([]);

  const [receivableSumData, setReceivableSumData] = useState([]);
  const [vendorCreditData, setVendorCreditData] = useState([]);
  const [gridApi, setGridApi] = useState();

  const { reportName, dateValue, reportId, handlePdfXlxCsv } = props;

  const custBalColumn = [
    ...Payable.vendorBalance,
    // {
    //   title: '#',
    //   dataIndex: 'key',
    //   key: 'key',
    //   // render: (text, record, index) => index + 1,
    // },
    // {
    //   title: 'Vendor Name',
    //   name: 'vendor_name',
    //   dataIndex: 'vendor_name',
    //   responsive: ['xs', 'sm'],
    //   render: (text, record) => {
    //     return (
    //       <Link className="hrefLink" to={`/report/Purchase By Vendor/${record.venodr_id}`}>
    //         {record.vendor_name}
    //       </Link>
    //     )
    //   },
    // },
    // {
    //   title: 'Paid Amount',
    //   name: 'paid_amt',
    //   dataIndex: 'paid_amt',
    //   responsive: ['xs', 'sm'],
    // },
    // {
    //   title: 'Total Purchase',
    //   name: 'total_purchase',
    //   dataIndex: 'total_purchase',
    //   responsive: ['xs', 'sm'],
    // },
    // {
    //   title: 'Balance',
    //   name: 'balance',
    //   dataIndex: 'balance',
    //   responsive: ['xs', 'sm'],
    // },
  ];

  const onGridReady = useCallback((params) => {
    setGridApi(params.columnApi);
  }, []);

  useEffect(() => {
    const org = localStorage.getItem("selectedOrg")
      ? JSON.parse(localStorage.getItem("selectedOrg"))
      : {};
    const obj = {
      orgCode: org.orgCode,
      startDate: moment(dateValue[0]).format("MM/DD/YYYY"),
      endDate: moment(dateValue[1]).format("MM/DD/YYYY"),
      //   custId: reportId,
    };
    // console.log('Obj', obj)
    const fetchData = async () => {
      const result = await ReportServices.billDetails(obj);
      // console.log(result, 'Sales By getCustomerBalanceDetails')
      if (result && result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1;
        });
      }
      setTableCustInvoiceData(result);
      handlePdfXlxCsv({
        apiData: result,
        columns: custDetails,
        fileName: "Bills Details",
        salesValue: "Bills Details",
        flag: "billsDetails",
      });
    };
    if (Object.keys(org).length && reportName === "Bills Details") {
      fetchData();
    }
  }, [dateValue]);

  useEffect(() => {
    const org = localStorage.getItem("selectedOrg")
      ? JSON.parse(localStorage.getItem("selectedOrg"))
      : {};
    const obj = {
      orgCode: org.orgCode,
      //   startDate: moment(dateValue[0]).format('MM/DD/YYYY'),
      //   endDate: moment(dateValue[1]).format('MM/DD/YYYY'),
    };
    // console.log('Obj', obj)
    const fetchData = async () => {
      const result = await ReportServices.getVendorBalance(obj);
      // console.log(result, 'getVendorBalance')
      if (result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1;
        });
      }
      setTableCustData(result);
      handlePdfXlxCsv({
        apiData: result,
        columns: custBalColumn,
        fileName: reportName,
        salesValue: reportName,
        flag: "vendorBalandSum",
      });
    };
    if (
      Object.keys(org).length &&
      !reportId &&
      (reportName === "Vendor Balance" ||
        reportName === "Vendor Balance Summary")
    ) {
      fetchData();
    }
  }, [dateValue]);

  useEffect(() => {
    const org = localStorage.getItem("selectedOrg")
      ? JSON.parse(localStorage.getItem("selectedOrg"))
      : {};
    const obj = {
      orgCode: org.orgCode,
      startDate: moment(dateValue[0]).format("MM/DD/YYYY"),
      endDate: moment(dateValue[1]).format("MM/DD/YYYY"),
    };
    // console.log('Obj', obj)
    const fetchData = async () => {
      const result = await ReportServices.paymentDate(obj);
      // console.log(result, 'paymentDate')
      if (result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1;
        });
      }
      setPaymnetMadeData(result);
      handlePdfXlxCsv({
        apiData: result,
        columns: paymentMadeCol,
        fileName: reportName,
        salesValue: reportName,
        flag: "paymentMade",
      });
    };
    if (Object.keys(org).length && reportName === "Payment Made") {
      fetchData();
    }
  }, [dateValue]);

  useEffect(() => {
    const org = localStorage.getItem("selectedOrg")
      ? JSON.parse(localStorage.getItem("selectedOrg"))
      : {};
    const obj = {
      orgCode: org.orgCode,
      startDate: moment(dateValue[0]).format("MM/DD/YYYY"),
      endDate: moment(dateValue[1]).format("MM/DD/YYYY"),
    };
    // console.log('Obj', obj)
    const fetchData = async () => {
      const result = await ReportServices.purchaseOrderDetails(obj);
      // console.log(result, 'purchaseOrderDetails')
      if (result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1;
        });
      }
      // console.log(result, 'reportName', reportName)
      setPurchaseOrderData(result);
      handlePdfXlxCsv({
        apiData: result,
        columns: purchaseOrderDetailsCol,
        fileName: reportName,
        salesValue: reportName,
        flag: "purchaseOrderDetails",
      });
    };
    if (Object.keys(org).length && reportName === "Purchase Order Details") {
      fetchData();
    }
  }, [dateValue]);

  //   1.
  useEffect(() => {
    const org = localStorage.getItem("selectedOrg")
      ? JSON.parse(localStorage.getItem("selectedOrg"))
      : {};
    const obj = {
      orgCode: org.orgCode,
      startDate: moment(dateValue[0]).format("MM/DD/YYYY"),
      endDate: moment(dateValue[1]).format("MM/DD/YYYY"),
    };

    // console.log('Obj', obj)
    const fetchData = async () => {
      const result = await ReportServices.receiveableSummary(obj);
      // console.log(result, 'receiveableSummary')
      if (result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1;
        });
      }
      setReceivableSumData(result);
      handlePdfXlxCsv({
        apiData: result,
        columns: custBalColumn,
        fileName: "Receivable Summary",
        salesValue: "Receivable Summary",
        flag: "recievableSummary",
      });
    };
    if (
      Object.keys(org).length &&
      !reportId &&
      reportName === "Receivable Summary"
    ) {
      fetchData();
    }
  }, [dateValue]);

  //   2.
  useEffect(() => {
    const org = localStorage.getItem("selectedOrg")
      ? JSON.parse(localStorage.getItem("selectedOrg"))
      : {};
    const obj = {
      orgCode: org.orgCode,
      startDate: moment(dateValue[0]).format("MM/DD/YYYY"),
      endDate: moment(dateValue[1]).format("MM/DD/YYYY"),
    };
    // console.log('Obj', obj)
    const fetchData = async () => {
      const result = await ReportServices.vendorCredit(obj);
      // console.log(result, 'vendorCredit')
      if (result?.length) {
        result.forEach((ele, i) => {
          ele.key = i + 1;
        });
      }
      setVendorCreditData(result);
      handlePdfXlxCsv({
        apiData: result,
        columns: vendorCreditCol,
        fileName: reportName,
        salesValue: reportName,
        flag: "vendorCreditDetails",
      });
    };
    if (Object.keys(org).length && reportName === "Vendor Credit Details") {
      fetchData();
    }
  }, [dateValue]);

  return (
    <Row className="row details__page--content mt-3">
      <Col span={24} className="col-md-12 top__section p-0">
        <div className="page-header text-center pb-5">
          {/* <h4>Test</h4>  */}
          {reportId && (
            <h3 className="reports-headerspacing">
              {" "}
              {tableCustInvoiceData[0]
                ? tableCustInvoiceData[0].customername
                : reportId}{" "}
            </h3>
          )}
          {!reportId && (
            <h3 className="reports-headerspacing"> {reportName}</h3>
          )}
          {/* <span>Basis: Accrual</span> */}
          <h5>{`from ${dateValue[0]} to ${dateValue[1]}`}</h5>
          <div className="tags"> </div>
        </div>
        <Col span={24} className="p-0">
          {!reportId &&
            (reportName === "Vendor Balance" ||
              reportName === "Vendor Balance Summary") && (
              <>
                {/* <Table
                id="table__layout--css"
                pagination
                dataSource={tableCustData}
                columns={custBalColumn}
                rowKey="id"
                // scroll={{ x: 691 }}
                summary={pageData => {
                  const balance = pageData.reduce((sum, record) => sum + record.balance, 0)
                  const paidAmt = pageData.reduce((sum, record) => sum + record.paid_amt, 0)
                  const totalPurchase = pageData.reduce(
                    (sum, record) => sum + record.total_purchase,
                    0,
                  )

                  return (
                    <>
                      <Table.Summary.Row
                        className="ant-table-footer"
                        style={{
                          fontWeight: 'bold',
                        }}
                      >
                        <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                        <Table.Summary.Cell>Total</Table.Summary.Cell>
                        <Table.Summary.Cell>{paidAmt}</Table.Summary.Cell>
                        <Table.Summary.Cell>{totalPurchase}</Table.Summary.Cell>
                        <Table.Summary.Cell>{balance}</Table.Summary.Cell>
                      </Table.Summary.Row>
                    </>
                  )
                }}
              /> */}
                <div className="ag-theme-alpine agggrid--table__container">
                  <AgGridReact
                    theme={"legacy"}
                    rowData={tableCustData}
                    columnDefs={singleLevelColumn(custBalColumn)}
                    defaultColDef={agGridDefaultColDef}
                    autoGroupColumnDef={agGridautoGroupColumnDef}
                    sideBar
                    enableRangeSelection
                    allowContextMenuWithControlKey
                    getContextMenuItems={agGetContextMenuItems}
                    onGridReady={onGridReady}
                    statusBar={agGridStatusBar}
                  />
                </div>
              </>
            )}
          {!reportId && reportName === "Bills Details" && (
            <>
              {/* <Table
              id="table__layout--css"
              pagination
              dataSource={tableCustInvoiceData}
              columns={custDetails}
              rowKey="id"
              // scroll={{ x: 691 }}
              summary={pageData => {
                const billAmt = pageData.reduce((sum, record) => sum + record.bill_amount, 0)
                const balAmt = pageData.reduce((sum, record) => sum + record.balance_amount, 0)

                return (
                  <>
                    <Table.Summary.Row
                      className="ant-table-footer"
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>Total</Table.Summary.Cell>
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>{billAmt}</Table.Summary.Cell>
                      <Table.Summary.Cell>{balAmt}</Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )
              }}
            /> */}
              <div className="ag-theme-alpine agggrid--table__container">
                <AgGridReact
                  theme={"legacy"}
                  rowData={tableCustInvoiceData}
                  columnDefs={singleLevelColumn(custDetails)}
                  defaultColDef={agGridDefaultColDef}
                  autoGroupColumnDef={agGridautoGroupColumnDef}
                  sideBar
                  enableRangeSelection
                  allowContextMenuWithControlKey
                  getContextMenuItems={agGetContextMenuItems}
                  onGridReady={onGridReady}
                  statusBar={agGridStatusBar}
                />
              </div>
            </>
          )}

          {!reportId && reportName === "Payment Made" && (
            <>
              {/* <Table
              id="table__layout--css"
              pagination
              dataSource={paymnetMadeData}
              columns={paymentMadeCol}
              rowKey="id"
              // scroll={{ x: 691 }}
              summary={pageData => {
                const paidAmt = pageData.reduce((sum, record) => sum + record.amount_paid, 0)

                return (
                  <>
                    <Table.Summary.Row
                      className="ant-table-footer"
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>Total</Table.Summary.Cell>
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>{paidAmt}</Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )
              }}
            /> */}
              <div className="ag-theme-alpine agggrid--table__container">
                <AgGridReact
                  theme={"legacy"}
                  rowData={paymnetMadeData}
                  columnDefs={singleLevelColumn(paymentMadeCol)}
                  defaultColDef={agGridDefaultColDef}
                  autoGroupColumnDef={agGridautoGroupColumnDef}
                  sideBar
                  enableRangeSelection
                  allowContextMenuWithControlKey
                  getContextMenuItems={agGetContextMenuItems}
                  onGridReady={onGridReady}
                  statusBar={agGridStatusBar}
                />
              </div>
            </>
          )}

          {!reportId && reportName === "Purchase Order Details" && (
            <>
              {/* <Table
              id="table__layout--css"
              pagination
              dataSource={purchaseOrderData}
              columns={purchaseOrderDetailsCol}
              rowKey="id"
              // scroll={{ x: 691 }}
              summary={pageData => {
                const amount = pageData.reduce((sum, record) => sum + record.Amount, 0)

                return (
                  <>
                    <Table.Summary.Row
                      className="ant-table-footer"
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>Total</Table.Summary.Cell>
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>{amount}</Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )
              }}
            /> */}
              <div className="ag-theme-alpine agggrid--table__container">
                <AgGridReact
                  theme={"legacy"}
                  rowData={purchaseOrderData}
                  columnDefs={singleLevelColumn(purchaseOrderDetailsCol)}
                  defaultColDef={agGridDefaultColDef}
                  autoGroupColumnDef={agGridautoGroupColumnDef}
                  sideBar
                  enableRangeSelection
                  allowContextMenuWithControlKey
                  getContextMenuItems={agGetContextMenuItems}
                  onGridReady={onGridReady}
                  statusBar={agGridStatusBar}
                />
              </div>
            </>
          )}

          {!reportId && reportName === "Receivable Summary" && (
            <>
              {/* <Table
              id="table__layout--css"
              pagination
              dataSource={receivableSumData}
              columns={receivableSummaryCol}
              rowKey="id"
              // scroll={{ x: 691 }}
              summary={pageData => {
                const dueAmt = pageData.reduce((sum, record) => sum + record.invoice_due_amount, 0)
                const amtWotax = pageData.reduce(
                  (sum, record) => sum + record.total_amt_without_tax,
                  0,
                )
                const total = pageData.reduce((sum, record) => sum + record.total, 0)

                return (
                  <>
                    <Table.Summary.Row
                      className="ant-table-footer"
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>Total</Table.Summary.Cell>
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>{dueAmt}</Table.Summary.Cell>
                      <Table.Summary.Cell>{amtWotax}</Table.Summary.Cell>
                      <Table.Summary.Cell>{total}</Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )
              }}
            /> */}
              <div className="ag-theme-alpine agggrid--table__container">
                <AgGridReact
                  theme={"legacy"}
                  rowData={receivableSumData}
                  columnDefs={singleLevelColumn(receivableSummaryCol)}
                  defaultColDef={agGridDefaultColDef}
                  autoGroupColumnDef={agGridautoGroupColumnDef}
                  sideBar
                  enableRangeSelection
                  allowContextMenuWithControlKey
                  getContextMenuItems={agGetContextMenuItems}
                  onGridReady={onGridReady}
                  statusBar={agGridStatusBar}
                />
              </div>
            </>
          )}

          {!reportId && reportName === "Vendor Credit Details" && (
            <>
              {/* <Table
              id="table__layout--css"
              pagination
              dataSource={vendorCreditData}
              columns={vendorCreditCol}
              rowKey="id"
              // scroll={{ x: 691 }}
              summary={pageData => {
                const total = pageData.reduce((sum, record) => sum + record.amount, 0)

                return (
                  <>
                    <Table.Summary.Row
                      className="ant-table-footer"
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>Total</Table.Summary.Cell>
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>&nbsp;</Table.Summary.Cell>
                      <Table.Summary.Cell>{total}</Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )
              }}
            /> */}
              <div className="ag-theme-alpine agggrid--table__container">
                <AgGridReact
                  theme={"legacy"}
                  rowData={vendorCreditData}
                  columnDefs={singleLevelColumn(vendorCreditCol)}
                  defaultColDef={agGridDefaultColDef}
                  autoGroupColumnDef={agGridautoGroupColumnDef}
                  sideBar
                  enableRangeSelection
                  allowContextMenuWithControlKey
                  getContextMenuItems={agGetContextMenuItems}
                  onGridReady={onGridReady}
                  statusBar={agGridStatusBar}
                />
              </div>
            </>
          )}
        </Col>
      </Col>
    </Row>
  );
};
const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
});

export default connect(mapStateToProps)(VendorReportDetails);
