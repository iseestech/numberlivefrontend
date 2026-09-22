import React, { lazy, Suspense, forwardRef } from 'react'
import { Route, Navigate, Routes, useLocation } from 'react-router-dom'
// import { ConnectedRouter } from 'connected-react-router'
import { HashRouter } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { connect } from 'react-redux'

import Layout from './layouts/index'
import ErrorBoundary from '@/components/ErrorBoundary'

const routes = [
  // Admin
  {
    path: '/admin',
    Component: lazy(() => import('@/admin/index')),
    exact: true,
  },
  {
    path: '/admin/organizations',
    Component: lazy(() => import('@/admin/index')),
    exact: true,
  },
  {
    path: '/admin/dashboard',
    Component: lazy(() => import('@/admin/pages/dashboard/index')),
    exact: true,
  },
  {
    path: '/admin/users',
    Component: lazy(() => import('@/admin/pages/users/index')),
    exact: true,
  },
  {
    path: '/admin/subPlans',
    Component: lazy(() => import('@/admin/pages/subPlans/index')),
    exact: true,
  },
  {
    path: '/admin/notifications',
    Component: lazy(() => import('@/admin/pages/notifications/index')),
    exact: true,
  },
  {
    path: '/admin/user-setting/:userID',
    Component: lazy(() => import('@/admin/pages/userSetting')),
    exact: true,
  },

  // Organization
  {
    path: '/user/organizations',
    Component: lazy(() => import('@/pages/organization/index')),
    exact: true,
  },
  {
    path: '/user/organization/create',
    Component: lazy(() => import('@/pages/organization/createOrganization')),
    exact: true,
  },
  {
    path: '/user/organization/edit/:orgId',
    Component: lazy(() => import('@/pages/organization/createOrganization')),
    exact: true,
  },
  // Contacts - customer and Vendors
  {
    path: '/contacts/customers',
    Component: lazy(() => import('@/pages/contacts/customers')),
    exact: true,
  },
  {
    path: '/contacts/customer/create',
    Component: lazy(() => import('@/pages/contacts/customers/createCust')),
    exact: true,
  },
  {
    path: '/contacts/customer/edit/:customerId',
    Component: lazy(() => import('@/pages/contacts/customers/createCust')),
    exact: true,
  },
  // Vendor
  {
    path: '/contacts/vendors',
    Component: lazy(() => import('@/pages/contacts/vendors')),
    exact: true,
  },
  {
    path: '/contacts/vendor/create',
    Component: lazy(() => import('@/pages/contacts/vendors/createVendor')),
    exact: true,
  },
  {
    path: '/contacts/vendor/edit/:customerId',
    Component: lazy(() => import('@/pages/contacts/vendors/createVendor')),
    exact: true,
  },
  // Employee
  {
    path: '/contacts/employees',
    Component: lazy(() => import('@/pages/contacts/employee')),
    exact: true,
  },
  {
    path: '/contacts/employee/create',
    Component: lazy(() => import('@/pages/contacts/employee/createEmp')),
    exact: true,
  },
  {
    path: '/contacts/employee/edit/:empId',
    Component: lazy(() => import('@/pages/contacts/employee/createEmp')),
    exact: true,
  },
  // Sales - Quotation, Order, Invoices, Return
  {
    path: '/sales/quotations',
    Component: lazy(() => import('@/pages/sales/quotations')),
    exact: true,
  },
  {
    path: '/sales/quotation/create',
    Component: lazy(() => import('@/pages/sales/quotations/createQuote')),
    exact: true,
  },
  {
    path: '/sales/quotation/:id',
    Component: lazy(() => import('@/pages/sales/quotations/quotationDetails')),
    exact: true,
  },
  {
    path: '/sales/quotation/edit/:quoteId',
    Component: lazy(() => import('@/pages/sales/quotations/createQuote')),
    exact: true,
  },
  {
    path: '/sales/orders',
    Component: lazy(() => import('@/pages/sales/orders')),
    exact: true,
  },
  {
    path: '/sales/order/create',
    Component: lazy(() => import('@/pages/sales/orders/createOrder')),
    exact: true,
  },
  {
    path: '/sales/order/:id',
    Component: lazy(() => import('@/pages/sales/orders/orderDetails')),
    exact: true,
  },
  {
    path: '/sales/order/edit/:orderId',
    Component: lazy(() => import('@/pages/sales/orders/createOrder')),
    exact: true,
  },
  {
    path: '/sales/invoices',
    Component: lazy(() => import('@/pages/sales/invoices')),
    exact: true,
  },
  {
    path: '/sales/invoice/create',
    Component: lazy(() => import('@/pages/sales/invoices/createInvoice')),
    exact: true,
  },
  {
    path: '/sales/invoice/edit/:invoiceId',
    Component: lazy(() => import('@/pages/sales/invoices/createInvoice')),
    exact: true,
  },
  {
    path: '/sales/invoice/:id',
    Component: lazy(() => import('@/pages/sales/invoices/invoiceDetails')),
    exact: true,
  },
  // SalesReturn
  {
    path: '/sales/returns',
    Component: lazy(() => import('@/pages/sales/return')),
    exact: true,
  },
  {
    path: '/sales/return/create',
    Component: lazy(() => import('@/pages/sales/return/createSaleReturn')),
    exact: true,
  },
  {
    path: '/sales/return/edit/:RId',
    Component: lazy(() => import('@/pages/sales/return/createSaleReturn')),
    exact: true,
  },
  {
    path: '/sales/return/:id',
    Component: lazy(() => import('@/pages/sales/return/saleReturnDetails')),
    exact: true,
  },
  // Sales Report
  // {
  //   path: '/sales/reports',
  //   Component: lazy(() => import('pages/sales/reports')),
  //   exact: true,
  // },
  {
    path: '/sales/quotes/reports',
    Component: lazy(() => import('@/components/accountancy/sales/reports/salesQuoteReportList')),
    exact: true,
  },
  {
    path: '/sales/orders/reports',
    Component: lazy(() => import('@/components/accountancy/sales/reports/salesOrderReportList')),
    exact: true,
  },
  {
    path: '/sales/invoices/reports',
    Component: lazy(() => import('@/components/accountancy/sales/reports/salesInvoiceReportList')),
    exact: true,
  },
  // {
  //   path: '/sales/sales-returns',
  //   Component: lazy(() => import('pages/sales/return/createSReturn')),
  //   exact: true,
  // },
  // {
  //   path: '/sales/sales-return/create',
  //   Component: lazy(() => import('pages/sales/orders/createOrder')),
  //   exact: true,
  // },

  // Other Income
  {
    path: '/sales/other-incomes',
    Component: lazy(() => import('@/pages/sales/otherIncome')),
    exact: true,
  },
  {
    path: '/sale/other-income/create',
    Component: lazy(() => import('@/pages/sales/otherIncome/createOtherIncome')),
    exact: true,
  },
  {
    path: '/sale/other-income/edit/:incomeId',
    Component: lazy(() => import('@/pages/sales/otherIncome/createOtherIncome')),
    exact: true,
  },
  /* {
    path: '/purchase/payment/edit/:id',
    Component: lazy(() => import('pages/payment/purchasePayment/createPurchasePage')),
    exact: true,
  },
  {
    path: '/sales/payment/pay/:payId',
    Component: lazy(() => import('pages/payment/paymentDetails')),
    exact: true,
  }, */

  // Products And Services -
  {
    path: '/products-and-services/products',
    Component: lazy(() => import('@/pages/productsAndServices')),
    exact: true,
  },
  {
    path: '/products-and-services/product/create',
    title: 'Products And Services',
    Component: lazy(() => import('@/pages/productsAndServices/createProductAndService')),
    exact: true,
  },
  {
    path: '/products-and-services/product/edit/:id',
    title: 'Products And Services',
    Component: lazy(() => import('@/pages/productsAndServices/createProductAndService')),
    exact: true,
  },
  {
    path: '/products-and-services/product/:id',
    Component: lazy(() => import('@/pages/productsAndServices/productDetails')),
    exact: true,
  },
  {
    path: '/products-and-services/services',
    Component: lazy(() => import('@/pages/productsAndServices')),
    exact: true,
  },
  {
    path: '/products-and-services/service/create',
    Component: lazy(() => import('@/pages/productsAndServices/createProductAndService')),
    exact: true,
  },
  {
    path: '/products-and-services/service/costCenter',
    Component: lazy(() => import('@/components/accountancy/productsAndServices/costCenterList')),
    exact: true,
  },
  {
    path: '/products-and-services/service/costCenter/:id',
    Component: lazy(() => import('@/components/accountancy/productsAndServices/costCenterList')),
    exact: true,
  },

  // Purchase Order -
  {
    path: '/purchase/orders',
    Component: lazy(() => import('@/pages/purchase/order')),
    exact: true,
  },
  {
    path: '/purchase/old',
    Component: lazy(() => import('@/pages/purchase')),
    exact: true,
  },
  {
    path: '/purchase/order/create',
    Component: lazy(() => import('@/pages/purchase/order/createOrder')),
    exact: true,
  },
  {
    path: '/purchase/order/:id',
    Component: lazy(() => import('@/pages/purchase/order/orderDetails')),
    exact: true,
  },
  {
    path: '/purchase/order/edit/:purchaseId',
    Component: lazy(() => import('@/pages/purchase/order/createOrder')),
    exact: true,
  },
  {
    path: '/purchase/invoices',
    Component: lazy(() => import('@/pages/purchase/invoice')),
    exact: true,
  },

  {
    path: '/purchase/invoice/create',
    Component: lazy(() => import('@/pages/purchase/invoice/createInvoice')),
    exact: true,
  },
  {
    path: '/purchase/invoice/:id',
    Component: lazy(() => import('@/pages/purchase/invoice/invoiceDetails')),
    exact: true,
  },
  {
    path: '/purchase/invoice/edit/:purchaseId',
    Component: lazy(() => import('@/pages/purchase/invoice/createInvoice')),
    exact: true,
  },
  // purchase Return
  {
    path: '/purchase/returns',
    Component: lazy(() => import('@/pages/purchase/return')),
    exact: true,
  },

  {
    path: '/purchase/return/create',
    Component: lazy(() => import('@/pages/purchase/return/createPurchaseReturn')),
    exact: true,
  },
  {
    path: '/purchase/return/edit/:purchaseId',
    Component: lazy(() => import('@/pages/purchase/return/createPurchaseReturn')),
    exact: true,
  },
  {
    path: '/purchase/return/:id',
    Component: lazy(() => import('@/pages/purchase/return/purchaseReturnDetails')),
    exact: true,
  },
  // Purchase Reports
  {
    path: '/purchase/orders/reports',
    Component: lazy(() => import('@/pages/purchase/reports/purchaseOrderReport')),
    exact: true,
  },
  {
    path: '/purchase/invoices/reports',
    Component: lazy(() => import('@/pages/purchase/reports/purchaseInvoiceReport')),
    exact: true,
  },
  // Payments
  {
    path: '/sales/payments',
    Component: lazy(() => import('@/pages/payment/salePayment')),
    exact: true,
  },
  {
    path: '/purchase/payment/create',
    Component: lazy(() => import('@/pages/payment/purchasePayment/createPurchasePage')),
    exact: true,
  },
  {
    path: '/purchase/vendorPayment/edit/:id',
    Component: lazy(() => import('@/pages/payment/purchasePayment/createPurchasePage')),
    exact: true,
  },
  {
    path: '/purchase/payment/edit/:id',
    Component: lazy(() => import('@/pages/payment/purchasePayment/createPurchasePage')),
    exact: true,
  },
  {
    path: '/sales/payment/pay/:payId',
    Component: lazy(() => import('@/pages/payment/paymentDetails')),
    exact: true,
  },
  {
    path: '/purchase/payments',
    Component: lazy(() => import('@/pages/payment/purchasePayment')),
    exact: true,
  },
  {
    path: '/sales/payment/create',
    Component: lazy(() => import('@/pages/payment')),
    exact: true,
  },
  {
    path: '/sales/payment/edit/:id',
    Component: lazy(() => import('@/pages/payment')),
    exact: true,
  },
  {
    path: '/purchase/payment/pay/:id',
    Component: lazy(() => import('@/components/accountancy/payment/purchasePayment/paymentDetails')),
    exact: true,
  },
  {
    path: '/purchase/vendorPayment/pay/:id',
    Component: lazy(() => import('@/components/accountancy/payment/purchasePayment/paymentDetails')),
    exact: true,
  },

  // {
  //   path: '/purchase/purchase-returns',
  //   Component: lazy(() => import('pages/purchase/return/createPReturn')),
  //   exact: true,
  // },
  // {
  //   path: '/purchase/purchase-return/create',
  //   Component: lazy(() => import('pages/purchase/createPurchase')),
  //   exact: true,
  // },

  // Inventory

  {
    path: '/inventory/stocks',
    Component: lazy(() => import('@/pages/inventory/stocks')),
    exact: true,
  },
  {
    path: '/inventory/stock/create',
    Component: lazy(() => import('@/pages/inventory/stocks/createStock')),
    exact: true,
  },
  {
    path: '/inventory/stock/:id',
    Component: lazy(() => import('@/pages/inventory/stocks/stockDetails')),
    exact: true,
  },
  {
    path: '/inventory/stock/edit/:stockId',
    Component: lazy(() => import('@/pages/inventory/stocks/createStock')),
    exact: true,
  },
  {
    path: '/inventory/stockOnHand',
    Component: lazy(() => import('@/pages/inventory/stockOnHand')),
    exact: true,
  },

  // Physical Stocks

  {
    path: '/inventory/physicalStocks',
    Component: lazy(() => import('@/pages/inventory/physicalStocks')),
    exact: true,
  },
  {
    path: '/inventory/physicalStock/create',
    Component: lazy(() => import('@/pages/inventory/physicalStocks/createPhysicalStock')),
    exact: true,
  },
  {
    path: '/inventory/physicalStock/:id',
    Component: lazy(() => import('@/pages/inventory/physicalStocks/physicalStockDetails')),
    exact: true,
  },
  {
    path: '/inventory/physicalStock/edit/:stockId',
    Component: lazy(() => import('@/pages/inventory/physicalStocks/createPhysicalStock')),
    exact: true,
  },

  // Inventory AdjustMent

  // Inventory

  {
    path: '/inventory/inventory-adjustments',
    Component: lazy(() => import('@/pages/inventory/inventoryAdjustment')),
    exact: true,
  },
  {
    path: '/inventory/inventory-adjustment/create',
    Component: lazy(() => import('@/pages/inventory/inventoryAdjustment/createInventoryAdjustment')),
    exact: true,
  },
  {
    path: '/inventory/inventory-adjustment/:id',
    Component: lazy(() => import('@/pages/inventory/inventoryAdjustment/inventoryAdjustmentDetails')),
    exact: true,
  },
  {
    path: '/inventory/inventory-adjustment/edit/:stockId',
    Component: lazy(() => import('@/pages/inventory/inventoryAdjustment/createInventoryAdjustment')),
    exact: true,
  },

  // Expenses
  {
    path: '/exp/expenses',
    Component: lazy(() => import('@/pages/expenses')),
    exact: true,
  },
  {
    path: '/exp/expense/create',
    Component: lazy(() => import('@/pages/expenses/createExpenses')),
    exact: true,
  },
  {
    path: '/exp/expense/edit/:id',
    Component: lazy(() => import('@/pages/expenses/createExpenses')),
    exact: true,
  },
  {
    path: '/exp/expense/:id',
    Component: lazy(() => import('@/pages/expenses/expensesDetails')),
    exact: true,
  },

  // Accounts  - Balance sheet
  {
    path: '/report/accounts/balance-sheets',
    Component: lazy(() => import('@/pages/accounts/balanceSheet')),
    exact: true,
  },
  {
    path: '/report/accounts/balance-sheets/horizontal',
    Component: lazy(() => import('@/pages/accounts/balanceSheet')),
    exact: true,
  },
  {
    path: '/report/accounts/balance-sheet/create',
    Component: lazy(() => import('@/pages/accounts/balanceSheet/createBalanceSheet')),
    exact: true,
  },
  {
    path: '/report/accounts/balance-sheet/:id',
    Component: lazy(() => import('@/pages/accounts/balanceSheet/balanceSheetDetails')),
    exact: true,
  },
  // Account - Profit and Loss
  {
    path: '/report/accounts/profit-and-loss',
    Component: lazy(() => import('@/pages/accounts/profitAndLoss')),
    exact: true,
  },
  {
    path: '/report/accounts/profit-and-loss/horizontal',
    Component: lazy(() => import('@/pages/accounts/profitAndLoss')),
    exact: true,
  },
  {
    path: '/accounts/profit-and-loss/create',
    Component: lazy(() => import('@/pages/accounts/profitAndLoss/createProfitAndLoss')),
    exact: true,
  },
  {
    path: '/accounts/profit-and-loss/:id',
    Component: lazy(() => import('@/pages/accounts/profitAndLoss/profitAndLossDetails')),
    exact: true,
  },
  // Account  - statement of Account
  {
    path: '/accounts/statement-of-accounts',
    Component: lazy(() => import('@/pages/accounts/statementOfAccounts')),
    exact: true,
  },
  {
    path: '/accounts/statement-of-account/create',
    Component: lazy(() => import('@/pages/accounts/statementOfAccounts/createStateOfAccount')),
    exact: true,
  },
  {
    path: '/accounts/statement-of-account/:id',
    Component: lazy(() => import('@/pages/accounts/statementOfAccounts/stateOfAccountDetails')),
    exact: true,
  },
  // Report -
  {
    path: '/reports',
    Component: lazy(() => import('@/pages/reports/index')),
    exact: true,
  },
  {
    path: '/report/:report',
    Component: lazy(() => import('@/pages/reports/reportDetails')),
    exact: true,
  },
  {
    path: '/report/:report/:reportId',
    Component: lazy(() => import('@/pages/reports/reportDetails')),
    exact: true,
  },
  // {
  //   path: '/report/purchase/:report',
  //   Component: lazy(() => import('pages/reports/purchaseReportDetails')),
  //   exact: true,
  // },
  // {
  //   path: '/purchase/report/:report/:reportId',
  //   Component: lazy(() => import('pages/reports/purchaseReportDetails')),
  //   exact: true,
  // },

  // Accounts  - Chart Of Account
  {
    path: '/accounts/chart-of-accounts',
    Component: lazy(() => import('@/pages/accounts/chartOfAccounts')),
    exact: true,
  },
  {
    path: '/accounts/chart-of-account/create',
    Component: lazy(() => import('@/pages/accounts/chartOfAccounts/createChartOfAccount')),
    exact: true,
  },
  {
    path: '/accounts/chart-of-account/:id',
    Component: lazy(() => import('@/pages/accounts/chartOfAccounts/chartOfAccountDetails')),
    exact: true,
  },
  // Accounts  - Journal
  {
    path: '/accounts/journals',
    Component: lazy(() => import('@/pages/accounts/journal')),
    exact: true,
  },
  {
    path: '/accounts/journal/create',
    Component: lazy(() => import('@/pages/accounts/journal/createJournal')),
    exact: true,
  },
  {
    path: '/accounts/journal/edit/:id',
    Component: lazy(() => import('@/pages/accounts/journal/createJournal')),
    exact: true,
  },
  {
    path: '/accounts/journal/:id',
    Component: lazy(() => import('@/pages/accounts/journal/journalDetails')),
    exact: true,
  },
  // Reverse Journal
  {
    path: '/accounts/rev-journals',
    Component: lazy(() => import('@/pages/accounts/reverseJournal')),
    exact: true,
  },
  {
    path: '/accounts/rev-journals/create',
    Component: lazy(() => import('@/pages/accounts/reverseJournal/revJournalDetails')),
    exact: true,
  },
  // {
  //   path: '/accounts/rev-journals/edit/:id',
  //   Component: lazy(() => import('pages/accounts/reverseJournal/createRevJournal')),
  //   exact: true,
  // },
  {
    path: '/accounts/rev-journals/:id',
    Component: lazy(() => import('@/pages/accounts/reverseJournal/revJournalDetails')),
    exact: true,
  },

  // Profile

  {
    path: '/profile',
    Component: lazy(() => import('@/pages/profile')),
    exact: true,
  },

  // Profile

  {
    path: '/subscription-plan',
    Component: lazy(() => import('@/components/accountancy/subscriptionPlan')),
    exact: true,
  },

  // Dashboards
  {
    path: '/dashboard/alpha',
    Component: lazy(() => import('@/pages/dashboard/alpha')),
    exact: true,
  },
  // {
  //   path: '/dashboard/beta',
  //   Component: lazy(() => import('pages/dashboard/beta')),
  //   exact: true,
  // },
  // {
  //   path: '/dashboard/gamma',
  //   Component: lazy(() => import('pages/dashboard/gamma')),
  //   exact: true,
  // },
  // {
  //   path: '/dashboard/crypto',
  //   Component: lazy(() => import('pages/dashboard/crypto')),
  //   exact: true,
  // },

  // Projects
  // Accounts  - Journal
  {
    path: '/projects/lists',
    Component: lazy(() => import('@/pages/projects')),
    exact: true,
  },
  {
    path: '/project/create',
    Component: lazy(() => import('@/pages/projects/createProject')),
    exact: true,
  },
  {
    path: '/project/:id',
    Component: lazy(() => import('@/pages/projects/projectDetails')),
    exact: true,
  },

  // Setting - Currancies
  {
    path: '/settings/currancies',
    Component: lazy(() => import('@/pages/settings/currancies')),
    exact: true,
  },
  {
    path: '/settings/currancy/create',
    Component: lazy(() => import('@/pages/settings/currancies/createCurrancy')),
    exact: true,
  },
  {
    path: '/settings/currancy/:id',
    Component: lazy(() => import('@/pages/settings/currancies/createCurrancy')),
    exact: true,
  },

  // Setting - Taxes
  {
    path: '/settings/taxes',
    Component: lazy(() => import('@/pages/settings/taxes')),
    exact: true,
  },
  {
    path: '/settings/tax/create',
    Component: lazy(() => import('@/pages/settings/taxes/createTax')),
    exact: true,
  },
  {
    path: '/settings/tax/:id',
    Component: lazy(() => import('@/pages/settings/taxes/createTax')),
    exact: true,
  },

  // Setting - Units
  {
    path: '/settings/manageProdOption',
    Component: lazy(() => import('@/pages/settings/units')),
    exact: true,
  },
  {
    path: '/settings/unit/create',
    Component: lazy(() => import('@/pages/settings/units/createUnit')),
    exact: true,
  },
  {
    path: '/settings/unit/:id',
    Component: lazy(() => import('@/pages/settings/units/createUnit')),
    exact: true,
  },

  // Banking
  {
    path: '/banking/lists',
    Component: lazy(() => import('@/pages/banking')),
    exact: true,
  },
  {
    path: '/banking/list/add',
    Component: lazy(() => import('@/pages/banking/addBank')),
    exact: true,
  },
  {
    path: '/banking/list/edit/:id',
    Component: lazy(() => import('@/pages/banking/addBank')),
    exact: true,
  },
  // {
  //   path: '/banking/list/add',
  //   Component: lazy(() => import('@/components/accountancy/banking/addBank')),
  //   exact: true,
  // },
  {
    path: '/banking/list/:bankId',
    Component: lazy(() => import('@/pages/banking/bankDetails')),
    exact: true,
  },

  // reconciliation
  {
    path: '/banking/reconciliations',
    Component: lazy(() => import('@/pages/reconciliation')),
    exact: true,
  },
  {
    path: '/banking/reconciliation/create',
    Component: lazy(() => import('@/pages/reconciliation/createReconciliationPage')),
    exact: true,
  },

  // Ecommerce
  // {
  //   path: '/ecommerce/dashboard',
  //   Component: lazy(() => import('pages/ecommerce/dashboard')),
  //   exact: true,
  // },
  // {
  //   path: '/ecommerce/orders',
  //   Component: lazy(() => import('pages/ecommerce/orders')),
  //   exact: true,
  // },
  // {
  //   path: '/ecommerce/product-catalog',
  //   Component: lazy(() => import('pages/ecommerce/product-catalog')),
  //   exact: true,
  // },
  // {
  //   path: '/ecommerce/product-details',
  //   Component: lazy(() => import('pages/ecommerce/product-details')),
  //   exact: true,
  // },
  // {
  //   path: '/ecommerce/cart',
  //   Component: lazy(() => import('pages/ecommerce/cart')),
  //   exact: true,
  // },

  // Apps
  // {
  //   path: '/apps/messaging',
  //   Component: lazy(() => import('pages/apps/messaging')),
  //   exact: true,
  // },
  // {
  //   path: '/apps/calendar',
  //   Component: lazy(() => import('pages/apps/calendar')),
  //   exact: true,
  // },
  // {
  //   path: '/apps/mail',
  //   Component: lazy(() => import('pages/apps/mail')),
  //   exact: true,
  // },
  // {
  //   path: '/apps/profile',
  //   Component: lazy(() => import('pages/apps/profile')),
  //   exact: true,
  // },
  // {
  //   path: '/apps/gallery',
  //   Component: lazy(() => import('pages/apps/gallery')),
  //   exact: true,
  // },
  // Extra Apps
  // {
  //   path: '/apps/github-explore',
  //   Component: lazy(() => import('pages/apps/github-explore')),
  //   exact: true,
  // },
  // {
  //   path: '/apps/github-discuss',
  //   Component: lazy(() => import('pages/apps/github-discuss')),
  //   exact: true,
  // },
  // {
  //   path: '/apps/digitalocean-droplets',
  //   Component: lazy(() => import('pages/apps/digitalocean-droplets')),
  //   exact: true,
  // },
  // {
  //   path: '/apps/digitalocean-create',
  //   Component: lazy(() => import('pages/apps/digitalocean-create')),
  //   exact: true,
  // },
  // {
  //   path: '/apps/google-analytics',
  //   Component: lazy(() => import('pages/apps/google-analytics')),
  //   exact: true,
  // },
  // {
  //   path: '/apps/wordpress-post',
  //   Component: lazy(() => import('pages/apps/wordpress-post')),
  //   exact: true,
  // },
  // {
  //   path: '/apps/wordpress-posts',
  //   Component: lazy(() => import('pages/apps/wordpress-posts')),
  //   exact: true,
  // },
  // {
  //   path: '/apps/wordpress-add',
  //   Component: lazy(() => import('pages/apps/wordpress-add')),
  //   exact: true,
  // },
  // {
  //   path: '/apps/todoist-list',
  //   Component: lazy(() => import('pages/apps/todoist-list')),
  //   exact: true,
  // },
  // {
  //   path: '/apps/jira-dashboard',
  //   Component: lazy(() => import('pages/apps/jira-dashboard')),
  //   exact: true,
  // },
  // {
  //   path: '/apps/jira-agile-board',
  //   Component: lazy(() => import('pages/apps/jira-agile-board')),
  //   exact: true,
  // },
  // {
  //   path: '/apps/helpdesk-dashboard',
  //   Component: lazy(() => import('pages/apps/helpdesk-dashboard')),
  //   exact: true,
  // },
  // // Widgets
  // {
  //   path: '/widgets/general',
  //   Component: lazy(() => import('pages/widgets/general')),
  //   exact: true,
  // },
  // {
  //   path: '/widgets/lists',
  //   Component: lazy(() => import('pages/widgets/lists')),
  //   exact: true,
  // },
  // {
  //   path: '/widgets/tables',
  //   Component: lazy(() => import('pages/widgets/tables')),
  //   exact: true,
  // },
  // {
  //   path: '/widgets/charts',
  //   Component: lazy(() => import('pages/widgets/charts')),
  //   exact: true,
  // },
  // // Cards
  // {
  //   path: '/cards/basic-cards',
  //   Component: lazy(() => import('pages/cards/basic-cards')),
  //   exact: true,
  // },
  // {
  //   path: '/cards/tabbed-cards',
  //   Component: lazy(() => import('pages/cards/tabbed-cards')),
  //   exact: true,
  // },
  // // UI Kits
  // {
  //   path: '/ui-kits/bootstrap',
  //   Component: lazy(() => import('pages/ui-kits/bootstrap')),
  //   exact: true,
  // },
  // {
  //   path: '/ui-kits/antd',
  //   Component: lazy(() => import('pages/ui-kits/antd')),
  //   exact: true,
  // },
  // // Tables
  // {
  //   path: '/tables/bootstrap',
  //   Component: lazy(() => import('pages/tables/bootstrap')),
  //   exact: true,
  // },
  // {
  //   path: '/tables/antd',
  //   Component: lazy(() => import('pages/tables/antd')),
  //   exact: true,
  // },
  // // Charts
  // {
  //   path: '/charts/chartistjs',
  //   Component: lazy(() => import('pages/charts/chartistjs')),
  //   exact: true,
  // },
  // {
  //   path: '/charts/chartjs',
  //   Component: lazy(() => import('pages/charts/chartjs')),
  //   exact: true,
  // },
  // {
  //   path: '/charts/c3',
  //   Component: lazy(() => import('pages/charts/c3')),
  //   exact: true,
  // },
  // // Icons
  // {
  //   path: '/icons/feather-icons',
  //   Component: lazy(() => import('pages/icons/feather-icons')),
  //   exact: true,
  // },
  // {
  //   path: '/icons/fontawesome',
  //   Component: lazy(() => import('pages/icons/fontawesome')),
  //   exact: true,
  // },
  // {
  //   path: '/icons/linearicons-free',
  //   Component: lazy(() => import('pages/icons/linearicons-free')),
  //   exact: true,
  // },
  // {
  //   path: '/icons/icomoon-free',
  //   Component: lazy(() => import('pages/icons/icomoon-free')),
  //   exact: true,
  // },
  // // Advanced
  // {
  //   path: '/advanced/form-examples',
  //   Component: lazy(() => import('pages/advanced/form-examples')),
  //   exact: true,
  // },
  // {
  //   path: '/advanced/email-templates',
  //   Component: lazy(() => import('pages/advanced/email-templates')),
  //   exact: true,
  // },
  // {
  //   path: '/advanced/utilities',
  //   Component: lazy(() => import('pages/advanced/utilities')),
  //   exact: true,
  // },
  // {
  //   path: '/advanced/grid',
  //   Component: lazy(() => import('pages/advanced/grid')),
  //   exact: true,
  // },
  // {
  //   path: '/advanced/typography',
  //   Component: lazy(() => import('pages/advanced/typography')),
  //   exact: true,
  // },
  // {
  //   path: '/advanced/pricing-tables',
  //   Component: lazy(() => import('pages/advanced/pricing-tables')),
  //   exact: true,
  // },
  // {
  //   path: '/advanced/invoice',
  //   Component: lazy(() => import('pages/advanced/invoice')),
  //   exact: true,
  // },
  // {
  //   path: '/advanced/colors',
  //   Component: lazy(() => import('pages/advanced/colors')),
  //   exact: true,
  // },
  // Create Orgnization
  {
    path: '/auth/user/organization/create',
    Component: lazy(() => import('@/pages/auth/organization/createOrg')),
    exact: true,
  },
  // Auth Pages
  {
    path: '/auth/admin/login',
    Component: lazy(() => import('@/pages/auth/login/admin')),
    exact: true,
  },
  {
    path: '/auth/login',
    Component: lazy(() => import('@/pages/auth/login')),
    exact: true,
  },
  {
    path: '/auth/print',
    Component: lazy(() => import('@/pages/auth/print')),
    exact: true,
  },
  {
    path: '/auth/forgot-password',
    Component: lazy(() => import('@/pages/auth/forgot-password')),
    exact: true,
  },
  {
    path: '/auth/confirm-password',
    Component: lazy(() => import('@/pages/auth/confirm-password')),
    exact: true,
  },
  {
    path: '/auth/register',
    Component: lazy(() => import('@/pages/auth/register')),
    exact: true,
  },
  {
    path: '/auth/lockscreen',
    Component: lazy(() => import('@/pages/auth/lockscreen')),
    exact: true,
  },
  {
    path: '/auth/404',
    Component: lazy(() => import('@/pages/auth/404')),
    exact: true,
  },
  {
    path: '/auth/500',
    Component: lazy(() => import('@/pages/auth/500')),
    exact: true,
  },
]

const mapStateToProps = ({ settings }) => ({
  routerAnimation: settings.routerAnimation,
})

const Router = ({ history, routerAnimation }) => {
  const location = useLocation()
  const nodeRef = React.useRef(null)
  return (
    <Layout>
      <SwitchTransition>
        <CSSTransition
          key={location.pathname}
          appear
          classNames={routerAnimation}
          timeout={routerAnimation === 'none' ? 0 : 300}
          nodeRef={nodeRef}
        >
          <div ref={nodeRef}>
            <Routes location={location}>
              <Route exact path="/" element={<Navigate to="/dashboard/alpha" />} />
              {routes.map(({ path, Component, exact }) => (
                <Route
                  path={path}
                  key={path}
                  element={
                    <div className={routerAnimation}>
                      <ErrorBoundary resetKey={path}>
                        <Suspense fallback={null}>
                          <Component />
                        </Suspense>
                      </ErrorBoundary>
                    </div>
                  }
                />
              ))}
              <Route path="*" element={<Navigate to="/auth/404" />} />
            </Routes>
          </div>
        </CSSTransition>
      </SwitchTransition>
    </Layout>
  )
}

const ConnectedRouter = connect(mapStateToProps)(Router)

export default function RouterWrapper() {
  return (
    <HashRouter>
      <ConnectedRouter />
    </HashRouter>
  )
}
