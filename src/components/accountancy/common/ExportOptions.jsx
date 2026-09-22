import React from 'react'
import { Button, Table, Tabs, Input, Space, Menu, Dropdown, Form, DatePicker } from 'antd'
import { CSVLink, CSVDownload } from 'react-csv'
import * as FileSaver from 'file-saver'
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
// import * as XLSX from 'xlsx'
import HelperFunction from '@/services/helper'

const ExportToExcel = ({ apiData, fileName, flag, columns }) => {
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'

  // const exportToCSV = (apiData1, fileName1) => {
  //   const ws = XLSX.utils.json_to_sheet(apiData1)
  //   const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
  //   const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  //   const data = new Blob([excelBuffer], { type: fileType })
  //   FileSaver.saveAs(data, fileName1 + fileExtension)
  // }

  const exportToCSV = async (apiData1, fileName1) => {
     const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");
      const newCol = columns.map(x => {
          return {...x, header: x.title}
        });
      worksheet.columns = newCol;

    apiData1.forEach((item) => worksheet.addRow(item));

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer]);
    saveAs(blob, fileName1 + fileExtension);
  }

  return (
    <Button
      type="button"
      color="secondary"
      style={{ border: 'none', background: 'none', margin: 0 }}
      //   className="me-2 mb-2"
      onClick={e => exportToCSV(apiData, fileName)}
      disabled={flag === '' && true}
    >
      XLSX
    </Button>
  )
}


const ExportOptions = ({
  handleRecieptModal,
  csvData,
  apiData,
  columns,
  fileName,
  flag,
}) => {
  const disabled = flag === "";

  const items = [
    {
      key: "pdf",
      disabled,
      label: (
        <Button
          type="text"
          onClick={handleRecieptModal}
        >
          PDF
        </Button>
      ),
    },
    {
      key: "csv",
      disabled,
      label: (
        <CSVLink data={csvData} filename={fileName}>
          CSV
        </CSVLink>
      ),
    },
    {
      key: "excel",
      disabled,
      label: (
        <ExportToExcel
          apiData={HelperFunction.getFilterdColumn(apiData, columns)}
          fileName={fileName}
          flag={flag}
          columns={columns}
        />
      ),
    },
  ];

  return <Menu items={items} />;
};

export default ExportOptions;

