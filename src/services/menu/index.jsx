export default async function getMenuData() {
  return [
    {
      category: false,
      title: 'Dashboards',
      icon: 'fe fe-home',
      key: 'dashboards',
      url: '/dashboard/alpha',
    },
    // {
    //   category: false,
    //   title: 'Users',
    //   icon: 'fe fe-users',
    //   key: 'users',
    //   url: '/admin/users',
    // },
    /*  {
      title: 'Dashboards',
      key: 'dashboards',
      icon: 'fe fe-home',
      url: '/dashboard/alpha',
      // roles: ['admin'], // set user roles with access to this route
     count: 4,
      children: [
        {
          title: 'Dashboard Alpha',
          key: 'dashboard',
          url: '/dashboard/alpha',
        },
        {
          title: 'Dashboard Beta',
          key: 'dashboardBeta',
          url: '/dashboard/beta',
        },
        {
          title: 'Dashboard Gamma',
          key: 'dashboardGamma',
          url: '/dashboard/gamma',
        },
        {
          title: 'Crypto Terminal',
          key: 'dashboardCrypto',
          url: '/dashboard/crypto',
        },
      ],
    }, */
    {
      category: true,
      title: 'Contacts',
      key: 'contacts',
    },
    {
      title: 'Contacts',
      key: 'contacts',
      icon: 'fe fe-users',
      // roles: ['admin'], // set user roles with access to this route
      children: [
        {
          title: 'Customer',
          key: 'customer',
          url: '/contacts/customers',
        },
        {
          title: 'Vendor',
          key: 'vendor',
          url: '/contacts/vendors',
        },
        {
          title: 'Employee',
          key: 'employee',
          url: '/contacts/employees',
        },
      ],
    },
    {
      category: true,
      title: 'Products and Services',
      key: 'productsAndServices',
    },
    {
      title: 'Products and Services',
      key: 'productsAndServices',
      icon: 'fe fe-list',
      children: [
        {
          title: 'Products Props',
          key: 'manageCatGrpUnit',
          url: '/settings/manageProdOption',
        },
        {
          title: 'Taxes',
          key: 'taxes',
          url: '/settings/taxes',
        },
        {
          title: 'Products/Services',
          key: 'products',
          url: '/products-and-services/products',
        },
        // {
        //   title: 'Services',
        //   key: 'services',
        //   url: '/products-and-services/services'
        // },
        {
          title: 'Cost Center',
          key: 'CostCenter',
          url: '/products-and-services/service/costCenter',
        },
      ],
    },

    {
      category: true,
      title: 'Purchase',
      key: 'purchase',
    },
    {
      title: 'Purchase',
      key: 'purchase',
      icon: 'fe fe-shopping-cart',
      children: [
        {
          title: 'Purchase Orders',
          key: 'PurchaseOrders',
          url: '/purchase/orders',
        },

        {
          title: 'Purchase Invoices',
          key: 'PurchaseInvoices',
          url: '/purchase/invoices',
        },
        {
          title: 'Purchase Returns',
          key: 'PurchaseReturns',
          url: '/purchase/returns',
        },
        {
          title: 'Purchase Payments',
          key: 'purchasePayment',
          url: '/purchase/payments',
        },

        // {
        //   title: 'Purchase Reports',
        //   key: 'purchaseReports',
        //   url: '/purchase/reports',
        // },
        {
          title: 'Reports',
          key: 'purchaseReport',
          children: [
            {
              title: 'PO Report',
              key: 'PO Report',
              // url: '/purchase/orders/reports?report=datewise',
              // target: '_blank'
              children: [
                {
                  title: 'PO Date wise',
                  key: 'PODatehWise',
                  url: '/purchase/orders/reports?report=datewise',
                  // target: '_blank'
                },
                {
                  title: 'PO Month wise',
                  key: 'POMonthWise',
                  url: '/purchase/orders/reports?report=monthwise',
                  // target: '_blank'
                },
                {
                  title: 'PO Year wise',
                  key: 'POYearWise',
                  url: '/purchase/orders/reports?report=yearwise',
                  // target: '_blank'
                },
              ],
            },
            {
              title: 'PI Reports',
              key: 'InvoiceReportPurchase',
              children: [
                {
                  title: 'PI Date wise',
                  key: 'PIdateWise',
                  url: '/purchase/invoices/reports?report=datewise',
                  // target: '_blank'
                },
                {
                  title: 'PI Month wise',
                  key: 'PIMonthWise',
                  url: '/purchase/invoices/reports?report=monthwise',
                  // target: '_blank'
                },
                {
                  title: 'PI Year wise',
                  key: 'PIYearWise',
                  url: '/purchase/invoices/reports?report=yearwise',
                  // target: '_blank'
                },
              ],
            },
          ],
        },
      ],
    },
    {
      category: true,
      title: 'Sales',
      key: 'sales',
    },
    {
      title: 'Sales',
      key: 'sales',
      icon: 'fe fe-tag',
      // roles: ['admin'], // set user roles with access to this route
      children: [
        {
          title: 'Sales Quotations',
          key: 'quotations',
          url: '/sales/quotations',
        },
        {
          title: 'Sales Orders',
          key: 'SalesOrders',
          url: '/sales/orders',
        },
        {
          title: 'Sales Invoices',
          key: 'SalesInvoices',
          url: '/sales/invoices',
        },
        {
          title: 'Sales Return',
          key: 'salesReturn',
          url: '/sales/returns',
        },
        {
          title: 'Sales Payments',
          key: 'salePayment',
          url: '/sales/payments',
        },
        {
          title: 'Reports',
          key: 'SalesReport',
          children: [
            {
              title: 'SQ Report',
              key: 'SQ Report',
              // url: '/sales/reports?report=datewise',
              children: [
                {
                  title: 'SQ Date wise',
                  key: 'SQ Date wise',
                  url: '/sales/quotes/reports?report=datewise',
                },
                {
                  title: 'SQ Month wise',
                  key: 'SQ Month wise',
                  url: '/sales/quotes/reports?report=monthwise',
                  // target: '_blank'
                },
                {
                  title: 'SQ Year wise ',
                  key: 'SQYearWise',
                  url: '/sales/quotes/reports?report=yearwise',
                  // target: '_blank'
                },
              ],
              // target: '_blank'
            },
            {
              title: 'SO Report',
              key: 'SO Report',
              // url: '/sales/reports?report=datewise',
              children: [
                {
                  title: 'SO Date wise',
                  key: 'SO Date wise',
                  url: '/sales/orders/reports?report=datewise',
                },
                {
                  title: 'SO Month wise',
                  key: 'SO Month wise',
                  url: '/sales/orders/reports?report=monthwise',
                  // target: '_blank'
                },
                {
                  title: 'SO Year wise ',
                  key: 'SOYearWise',
                  url: '/sales/orders/reports?report=yearwise',
                  // target: '_blank'
                },
              ],
              // target: '_blank'
            },
            {
              title: 'SI Report',
              key: 'SI Report',
              // url: '/sales/reports?report=datewise',
              children: [
                {
                  title: 'SI Date wise',
                  key: 'SI Date wise',
                  url: '/sales/invoices/reports?report=datewise',
                },
                {
                  title: 'SI Month wise',
                  key: 'SI Month wise',
                  url: '/sales/invoices/reports?report=monthwise',
                  // target: '_blank'
                },
                {
                  title: 'SI Year wise ',
                  key: 'SIYearWise',
                  url: '/sales/invoices/reports?report=yearwise',
                  // target: '_blank'
                },
              ],
              // target: '_blank'
            },

            // {
            //   title: 'Order reports',
            //   key: 'orderReport',
            //   url : '/dashboard/alpha'
            // },
            // {
            //   title: 'Utility reports',
            //   key: 'utilityReports',
            //   url : '/dashboard/alpha'
            // },
          ],
        },
      ],
    },
    {
      category: true,
      title: 'Inventory',
      key: 'inventory',
    },
    {
      title: 'Inventory',
      key: 'inventory',
      icon: 'fe fe-truck',
      children: [
        {
          title: 'Stock',
          key: 'stock',
          url: '/inventory/stocks',
        },
        // {
        //   title: 'Physical Stocks',
        //   key: 'newEntry',
        //   url: '/inventory/physicalStocks',
        // },
        {
          title: 'Inventory Adjustment',
          key: 'inventoryAdjustment',
          url: '/inventory/inventory-adjustments',
        },
        {
          title: 'Stock On Hand(Summary)',
          key: 'stockOnHand',
          url: '/inventory/stockOnHand',
        },
        // {
        //   title: 'New Entry',
        //   key: 'newEntry',
        //   url: '/inventory/stock/create',
        // },
        // {
        //   title: 'Withdrawal',
        //   key: 'withdrawal',
        //   url: ''
        // },
        // {
        //   title: 'Receiving Note',
        //   key: 'receivingNote',
        //   url: ''
        // },
        // {
        //   title: 'Delivery Note',
        //   key: 'deliveryNote',
        //   url: ''
        // }
      ],
    },
    // {
    //   category: true,
    //   title: 'Payment',
    // },
    // {
    //   title: 'Payments',
    //   key: 'payments',
    //   icon: 'fe fe-home',
    //   children: [
    //     {
    //       title: 'Sale Payments',
    //       key: 'salePayment',
    //       url: '/payments/sales',
    //     },
    //     {
    //       title: 'Purchase Payments',
    //       key: 'purchasePayment',
    //       url: '/payments/purchase',
    //     },
    //   ],
    // },
    {
      category: false,
      title: 'Expenses & other Income',
      key: 'ExpensesAndOtherIncome',
      icon: 'fe fe-credit-card',
      children: [
        {
          category: false,
          title: 'Expenses',
          key: 'expenses',
          icon: 'fe fe-credit-card',
          url: '/exp/expenses',
        },
        {
          category: false,
          title: 'Other Income',
          key: 'otherIncome',
          icon: 'fe fe-credit-card',
          url: '/sales/other-incomes',
        },
      ],
    },
    {
      title: 'Banking',
      key: 'Banking',
      icon: 'fe fe-home',
      children: [
        {
          category: false,
          title: 'Bank Accounts',
          key: 'banking',
          icon: 'fe fe-home',
          url: '/banking/lists',
        },
        {
          category: false,
          title: 'Reconciliation',
          key: 'Reconciliation',
          icon: 'fe fe-credit-card',
          url: '/report/reconciliation',
        },
        // {
        //   category: false,
        //   title: 'Reconciliation-inP',
        //   key: 'Reconciliation-inP',
        //   icon: 'fe fe-credit-card',
        //   url: '/banking/reconciliations',
        // },
      ],
    },

    // {
    //   category: true,
    //   title: 'Banking',
    //   key: 'banking'
    // },
    // {
    //   title: 'Banking',
    //   key: 'banking',
    //   icon: 'fe fe-home',
    //   children: [
    //     {
    //       title: 'Accounts',
    //       key: 'accounts',
    //       url: ''
    //     },
    //     {
    //       title: 'Entries',
    //       key: 'Entries',
    //       url: ''
    //     },
    //     {
    //       title: 'Undeposited Funds',
    //       key: 'undepositedFunds',
    //       url: ''
    //     },
    //   ]
    // },
    // {
    //   category: false,
    //   title: 'Projects',
    //   key: 'projects',
    //   icon: 'fe fe-layers',
    //   url: '/projects/lists',
    // },
    {
      category: false,
      title: 'Reports',
      icon: 'fe fe-home',
      key: 'Reports',
      url: '/reports',
    },
    {
      category: true,
      title: 'Accountancy',
      key: 'accountancy',
      icon: 'fe fe-book',
    },
    {
      title: 'Accountancy',
      key: 'accountancy',
      icon: 'fe fe-book-open',
      children: [
        {
          title: 'Chart of Accounts',
          key: 'chartOfAccounts',
          url: '/accounts/chart-of-accounts',
        },
        {
          title: 'Profit and Loss',
          key: 'ProfitAndLoss',
          url: '/report/accounts/profit-and-loss',
        },
        {
          title: 'Balance Sheet',
          key: 'balanceSheet',
          url: '/report/accounts/balance-sheets/horizontal',
        },
        {
          title: 'Mannual Journal',
          key: 'Mannual Journal',
          url: '/accounts/journals',
        },
        {
          title: 'Reverse Journal',
          key: 'Reverse Journal',
          url: '/accounts/rev-journals',
        },
        // {
        //   title: 'Statement of Accounts',
        //   key: 'statementOfAccounts',
        //   url: '/accounts/statement-of-accounts',
        // },
      ],
    },
    {
      category: true,
      title: 'Settings',
      key: 'settings',
    },
    {
      title: 'Settings',
      key: 'settings',
      icon: 'fe fe-settings',
      children: [
        {
          title: 'Company/Organizations',
          key: 'company',
          url: '/user/organizations',
        },
        // {
        //   title: 'Manage Users',
        //   key: 'manageUsers',
        //   url: '/admin/users',
        // },
        // {
        //   title: 'Employee',
        //   key: 'employee',
        //   url: '',
        // },
        // {
        //   title: 'Taxes',
        //   key: 'taxes',
        //   url: '/settings/taxes',
        // },
        // {
        //   title: 'Currency',
        //   key: 'currancy',
        //   url: '/settings/currancies',
        // },
        // {
        //   title: 'Products Props',
        //   key: 'manageCatGrpUnit',
        //   url: '/settings/manageProdOption',
        // },
        {
          title: 'Change Plan',
          key: 'changePlan',
          url: '/subscription-plan',
        },
        // {
        //   title: 'Upgrade Users',
        //   key: 'upgradeUsers',
        //   url: '',
        // },
      ],
    },

    // {
    //   category: true,
    //   title: 'Project Component',
    // },
    // {
    //   title: 'Form Examples',
    //   key: 'formExamples',
    //   icon: 'fe fe-menu',
    //   url: '/advanced/form-examples',
    // },
    // {
    //   title: 'Nested Items',
    //   key: 'nestedItem1',
    //   icon: 'fe fe-layers',
    //   disabled: true,
    //   children: [
    //     {
    //       title: 'Nested Item 1-1',
    //       key: 'nestedItem1-1',
    //       children: [
    //         {
    //           title: 'Nested Item 1-1-1',
    //           key: 'nestedItem1-1-1',
    //         },
    //         {
    //           title: 'Nested Items 1-1-2',
    //           key: 'nestedItem1-1-2',
    //           disabled: true,
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Nested Items 1-2',
    //       key: 'nestedItem1-2',
    //     },
    //   ],
    // },
    // {
    //   title: 'Disabled Item',
    //   key: 'disabledItem',
    //   icon: 'fe fe-slash',
    //   disabled: true,
    // },
  ]
}
