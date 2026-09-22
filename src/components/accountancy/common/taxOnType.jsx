import React, { useState, useEffect } from 'react'
import { Select } from 'antd'
import TaxService from '@/services/settings'

const { Option } = Select

export default function TaxOnType() {
  const [page, setpage] = useState(1)
  const [quotations, getQuotations] = useState([])

  useEffect(() => {
    fetchData()
  }, [page])

  const fetchData = async () => {
    const result = await TaxService.taxList('ALL')
    // console.log(result, 'ress11178878')
    if (result && result.length) {
      getQuotations(result)
    } else {
      getQuotations([])
    }
  }

  return (
    <Select
      showSearch
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {quotations.map((item, index) => (
        <Option value={item.id} key={item.id}>
          {`${item.tax_name}(${item.rate})`}
        </Option>
      ))}
    </Select>
  )
}
