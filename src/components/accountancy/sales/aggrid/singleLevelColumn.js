const singleLevelColumn = columns => {
  return columns.map(item => {
    return {
      ...item,
      field: item.dataIndex,
      headerName: item.title,
      filter: item.filter,
      cellRenderer: item?.isCustCellRender
        ? item.cellRenderer
        : item.title === 'Actions'
        ? item.cellRenderer
        : '',
    }
  })
}

export const agGridDefaultColDef = {
  flex: 1,
  minWidth: 100,
  // allow every column to be aggregated
  enableValue: true,
  // allow every column to be grouped
  enableRowGroup: true,
  // allow every column to be pivoted
  enablePivot: true,
  sortable: true,
  filter: true,
  floatingFilter: true,
}

export const agGridautoGroupColumnDef = {
  minWidth: 200,
}

export const agGridStatusBar = {
  statusPanels: [
    { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
    { statusPanel: 'agTotalRowCountComponent', align: 'center' },
    { statusPanel: 'agFilteredRowCountComponent' },
    { statusPanel: 'agSelectedRowCountComponent' },
    { statusPanel: 'agAggregationComponent' },
  ],
}

export const agGetContextMenuItems = params => {
  return params?.defaultItems ? [...params.defaultItems, 'chartRange'] : []
}

export default singleLevelColumn
