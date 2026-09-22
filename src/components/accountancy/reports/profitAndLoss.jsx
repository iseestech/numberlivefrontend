import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Table, Popconfirm, Button, Input, Form, Select, Divider, Modal, DatePicker } from 'antd'

const ProfitAndLoss = () => {
  return (
    <div>
      <div className="top__section">
        <div className="page-header text-center">
          <h4>Test</h4> <h3 className="reports-headerspacing"> Profit and Loss </h3>
          <span>Basis: Accrual</span>
          <h5>
            <span>From</span>&nbsp;01 May 2021 <span>To</span>&nbsp;31 May 2021
          </h5>
          <div className="tags"> </div>
        </div>
      </div>
      <div className="main__section" style={{width:"60%", margin: '0 auto'}}>
        <div className="reports-table-wrapper fill-container table-container">
          <table className="table tb-comparison-table zi-table financial-comparison table-no-border">
            <thead>
              <tr>
                <th id="ember1303" className="sortable text-start ember-view">
                  <div className="position-relative ">
                    <div className="float-left over-flow" title="Account">
                      Account
                    </div>
                  </div>
                </th>
                <th id="ember1305" className="text-end ember-view">
                  <div className="position-relative ">
                    <div className=" over-flow" title="Total">
                      Total
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="pt-5 pb-0" style={{color: "#a3a3a3"}}>
                  Operating Income
                </td>
                <td className="pt-5">&nbsp;</td>
              </tr>
              <tr className="rep-subttl">
                <td>
                  <b>Total Operating Income</b>
                </td>
                <td className="text-end"> 0.00 </td>
              </tr>
              <tr>
                <td className="pt-5 pb-0" style={{color: "#a3a3a3"}}>
                  Cost of Goods Sold
                </td>
                <td className="pt-5">&nbsp;</td>
              </tr>
              <tr className="rep-subttl">
                <td>
                  <b>Total Cost of Goods Sold</b>
                </td>
                <td className="text-end"> 0.00 </td>
              </tr>
              <tr>
                <td className="text-end">
                  <b>Gross Profit</b>
                </td>
                <td className="rep-grandTtl"> 0.00 </td>
              </tr>
              <tr>
                <td className="pt-5 pb-0" style={{color: "#a3a3a3"}}>
                  Operating Expense
                </td>
                <td className="pt-5">&nbsp;</td>
              </tr>
              <tr className="rep-subttl">
                <td>
                  <b>Total Operating Expense</b>
                </td>
                <td className="text-end"> 0.00 </td>
              </tr>
              <tr>
                <td className="text-end">
                  <b>Operating Profit</b>
                </td>
                <td className="rep-grandTtl"> 0.00 </td>
              </tr>
              <tr>
                <td className="pt-5 pb-0" style={{color: "#a3a3a3"}}>
                  Non Operating Income
                </td>
                <td className="pt-5">&nbsp;</td>
              </tr>
              <tr className="rep-subttl">
                <td>
                  <b>Total Non Operating Income</b>
                </td>
                <td className="text-end"> 0.00 </td>
              </tr>
              <tr>
                <td className="pt-5 pb-0" style={{color: "#a3a3a3"}}>
                  Non Operating Expense
                </td>
                <td className="pt-5">&nbsp;</td>
              </tr>
              <tr className="rep-subttl">
                <td>
                  <b>Total Non Operating Expense</b>
                </td>
                <td className="text-end"> 0.00 </td>
              </tr>
              <tr>
                <td className="text-end">
                  <b>Net Profit/Loss</b>
                </td>
                <td className="rep-grandTtl"> 0.00 </td>
              </tr>
            </tbody>
          </table>
          <div className="reconciliation-summary-table p-4">
            <small>**Amount is displayed in your base currency</small>&nbsp;
            <span className="badge text-semibold badge-success d-inline">AWG</span>
          </div>
        </div>
      </div>
    </div>
  )
}
const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})

export default connect(mapStateToProps)(ProfitAndLoss)

