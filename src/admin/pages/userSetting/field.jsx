export default function getMenuData() {
  return [
    {
      category: false,
      title: 'Dashboards',
      icon: 'fe fe-home',
      url: '/dashboard/alpha',
    },
    {
      category: true,
      title: 'Contacts',
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
      ],
    },
    {
      category: true,
      title: 'Sales',
    },
    {
      title: 'Sales',
      key: 'sales',
      icon: 'fe fe-tag',
      // roles: ['admin'], // set user roles with access to this route
      children: [
        {
          title: 'Quotations',
          key: 'quotations',
          url: '/sales/quotations',
        },
        {
          title: 'Orders',
          key: 'orders',
          url: '/sales/orders',
        },
        {
          title: 'Invoices',
          key: 'invoices',
          url: '/sales/invoices',
        },
        {
          title: 'Sales Return',
          key: 'salesReturn',
          url: '/sales/sales-returns',
        },
        {
          title: 'Report',
          key: 'Report',
          children: [
            {
              title: 'Date wise',
              key: 'dateWise',
              url: '/dashboard/alpha',
            },
            {
              title: 'Daily',
              key: 'daily',
              url: '/dashboard/alpha',
            },
            {
              title: 'Monthly',
              key: 'monthly',
              url: '/dashboard/alpha',
            },
            {
              title: 'Order reports',
              key: 'orderReport',
              url: '/dashboard/alpha',
            },
            {
              title: 'Utility reports',
              key: 'utilityReports',
              url: '/dashboard/alpha',
            },
          ],
        },
      ],
    },
    {
      category: true,
      title: 'Products and Services',
    },
    {
      title: 'Products and Services',
      key: 'productsAndServices',
      icon: 'fe fe-list',
      children: [
        {
          title: 'Products',
          key: 'products',
          url: '/products-and-services/products',
        },
        {
          title: 'Services',
          key: 'services',
          url: '/products-and-services/services',
        },
      ],
    },
    {
      category: true,
      title: 'Purchase',
    },
    {
      title: 'Purchase',
      key: 'purchase',
      icon: 'fe fe-shopping-cart',
      children: [
        {
          title: 'Orders',
          key: 'orders',
          url: '/purchase/orders',
        },
        {
          title: 'Invoices',
          key: 'invoices',
          url: '/purchase/invoices',
        },
        {
          title: 'Returns',
          key: 'returns',
          url: '/purchase/purchase-returns',
        },
        {
          title: 'Reports',
          key: 'reports',
          url: '/dashboard/alpha',
        },
      ],
    },
    {
      category: true,
      title: 'Inventory',
    },
    {
      title: 'Inventory',
      key: 'inventory',
      icon: 'fe fe-truck',
      children: [
        {
          title: 'Stock',
          key: 'stock',
          url: '',
        },
        {
          title: 'New Entry',
          key: 'newEntry',
          url: '',
        },
        {
          title: 'Withdrawal',
          key: 'withdrawal',
          url: '',
        },
        {
          title: 'Receiving Note',
          key: 'receivingNote',
          url: '',
        },
        {
          title: 'Delivery Note',
          key: 'deliveryNote',
          url: '',
        },
      ],
    },
    {
      category: false,
      title: 'Expenses',
      icon: 'fe fe-credit-card',
    },
    {
      category: true,
      title: 'Banking',
    },
    {
      title: 'Banking',
      key: 'banking',
      icon: 'fe fe-home',
      children: [
        {
          title: 'Accounts',
          key: 'accounts',
          url: '',
        },
        {
          title: 'Entries',
          key: 'Entries',
          url: '',
        },
        {
          title: 'Undeposited Funds',
          key: 'undepositedFunds',
          url: '',
        },
      ],
    },
    {
      category: false,
      title: 'Projects',
      icon: 'fe fe-layers',
    },
    {
      category: true,
      title: 'Accountancy',
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
          url: '',
        },
        {
          title: 'Profit and Loss',
          key: 'ProfitAndLoss',
          url: '',
        },
        {
          title: 'Balance Sheet',
          key: 'balanceSheet',
          url: '',
        },
        {
          title: 'Journal',
          key: 'Journal',
          url: '',
        },
        {
          title: 'Statement of Accounts',
          key: 'statementOfAccounts',
          url: '',
        },
      ],
    },
    {
      category: true,
      title: 'Settings',
    },
    {
      title: 'Settings',
      key: 'settings',
      icon: 'fe fe-settings',
      children: [
        {
          title: 'Company',
          key: 'company',
          url: '',
        },
        {
          title: 'Manage Users',
          key: 'manageUsers',
          url: '',
        },
        {
          title: 'Employee',
          key: 'employee',
          url: '',
        },
        {
          title: 'Taxes',
          key: 'taxes',
          url: '',
        },
        {
          title: 'Currancy',
          key: 'currancy',
          url: '',
        },
        {
          title: 'Change Plan',
          key: 'changePlan',
          url: '',
        },
        {
          title: 'Upgrade Users',
          key: 'upgradeUsers',
          url: '',
        },
      ],
    },
  ]
}
