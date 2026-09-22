import apiClient from '@/services/axios'
import queryString from 'query-string'
import store from 'store'

const ReportServices = {
  salesByCustomer: value => {
    return apiClient
      .get(
        `/isees/api/salesinvoicelistview/salesbycustomer?orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  salesCustomerDetails: value => {
    return apiClient
      .get(
        `/isees/api/salesinvoicelistview/salecustomerdetails?customerid=${value.custId}&orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },

  salesByItems: value => {
    return apiClient
      .get(
        `/isees/api/salesinvoicelistview/salebyitems?orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  dateWiseInventory: value => {
    return apiClient
      .get(
        `/isees/api/Stock/dateWiseInventory?orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  // Purchase by vendor
  purchaseByVendor: value => {
    return apiClient
      .get(
        `/isees/api/purchaseinvoicelistview/purchasebyvendor?orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  purchaseVendorDetails: value => {
    return apiClient
      .get(
        `/isees/api/purchaseinvoicelistview/purchasevendordetails?venodr_id=${value.vendorId}&orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  pruchaseByItems: value => {
    return apiClient
      .get(
        `/isees/api/purchaseinvoicelistview/purchasebyitems?orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  // Expense Report Service
  expenseDetails: value => {
    return apiClient
      .get(
        `/isees/api/purchaseinvoicelistview/expensesdetail?orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  categoryExpense: value => {
    return apiClient
      .get(
        `/isees/api/purchaseinvoicelistview/categoryexpense?orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  // customer Balance
  getCustomerBalance: value => {
    return apiClient
      .get(`/isees/api/salesinvoicelistview/customerbalances?orgCode=${value.orgCode}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  getCustomerBalanceDetails: value => {
    return apiClient
      .get(
        `/isees/api/salesinvoicelistview/salecustomerdetails?customerid=${value.custId}&orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  // Vendor Balance
  getVendorBalance: value => {
    return apiClient
      .get(`/isees/api/purchaseinvoicelistview/vendorbalances?orgCode=${value.orgCode}`)
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  billDetails: value => {
    return apiClient
      .get(
        `/isees/api/purchaseinvoicelistview/billsdetail?orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  paymentDate: value => {
    return apiClient
      .get(
        `/isees/api/purchaseinvoicelistview/paymentmade?orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  purchaseOrderDetails: value => {
    return apiClient
      .get(
        `/isees/api/fetchFromView/datewisedata?orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  receiveableSummary: value => {
    return apiClient
      .get(
        `/isees/api/salesinvoicelistview/receiveablesummary?orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  vendorCredit: value => {
    return apiClient
      .get(
        `/isees/api/purchaseinvoicelistview/vendorcredit?orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  poByVendor: value => {
    return apiClient
      .get(
        `/isees/api/purchaseinvoicelistview/pobyvendor?orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  payableSummary: value => {
    return apiClient
      .get(
        `/isees/api/purchaseinvoicelistview/payablesummary?orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  paymentReceived: value => {
    return apiClient
      .get(
        `/isees/api/salesinvoicelistview/paymentreceived?orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  saleCreditNote: value => {
    return apiClient
      .get(
        `/isees/api/salesinvoicelistview/salesreturn?orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response.data && response.data
      })
      .catch(err => console.log(err))
  },
  // Buisness Overview
  statementOfAccount: value => {
    return apiClient
      .get(
        `/isees/api/businessoverview/statementofaccount?accId=${value.accId}&orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  statementBySubGroup: value => {
    return apiClient
      .get(
        `/isees/api/businessoverview/statementbysubgroup?acccountGrpId=${value.accId}&orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  statementByPrimaryGroup: value => {
    return apiClient
      .get(
        `/isees/api/businessoverview/statementbyprimarygroup?primaryGroup=${value.accId}&orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  statementByNatureGrp: value => {
    return apiClient
      .get(
        `/isees/api/businessoverview/statementbynature?nature=${value.accId}&orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
  statementByDate: value => {
    return apiClient
      .get(
        `/isees/api/businessoverview/datewisestatement?orgCode=${value.orgCode}&startDate=${value.startDate}&endDate=${value.endDate}`,
      )
      .then(response => {
        return response && response.data
      })
      .catch(err => console.log(err))
  },
}

export default ReportServices
