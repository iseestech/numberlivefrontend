import React from 'react'
// import ChartistGraph from 'react-chartist'
// import ChartistTooltip from 'chartist-plugin-tooltips-updated'
// import { Line, Bar, Radar, Polar, Pie, Doughnut } from 'react-chartjs-2'
// import {
//   BarChart,
//   Bar,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts'

const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const barOptions = {
  plugins: {
    legend: false,
  },
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: {
          display: false,
        },
      },
    ],
  },
}

// const options = {
//   chartPadding: {
//     right: 0,
//     left: 0,
//     top: 0,
//     bottom: 0,
//   },
//   fullWidth: true,
//   showPoint: true,
//   lineSmooth: true,
//   axisY: {
//     showGrid: true,
//     showLabel: true,
//     with: 100,
//     // offset: 40,
//   },
//   axisX: {
//     showGrid: true,
//     showLabel: true,
//     with: 100,
//     // offset: 40,
//   },
//   showArea: false,
//   plugins: [
//     ChartistTooltip({
//       anchorToPoint: false,
//       appendToBody: true,
//       seriesName: false,
//     }),
//   ],
// }

const Chart4v1 = ({ saleData }) => {
  // console.log('saleData', saleData)
  return (
    <div style={{ height: '270px' }}>
      {/* <div className="font-weight-bold text-dark font-size-18">Income Vs Expenses</div> */}
      {/* <div>&nbsp;</div> */}
      {/* <ChartistGraph
        className="height-250 ct-hidden-points"
        data={saleData !== undefined ? saleData : []}
        options={options}
        type="Bar"
      /> */}
      {/* <Bar
        data={saleData !== undefined ? saleData : []}
        options={barOptions}
        width={400}
        height={200}
      /> */}
      {/* <ResponsiveContainer width="100%" height="100%">
         <BarChart
          width={500}
          height={250}
          data={saleData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <XAxis dataKey={ele => `${month[Number(ele.month) - 1]}`} />
          <YAxis />
          <Tooltip />
          <Tooltip labelFormatter={(e, t) => `${e} ${t?.[0]?.payload.year}`} />
          <Legend />
          <Bar
            dataKey="income"
            fill="rgba(54, 162, 235, 0.6"
            strokeWidth="2"
            stroke="rgba(54, 162, 235, 1)"
          />
          <Bar
            dataKey="expenses"
            fill="rgba(255, 99, 132, 0.6)"
            strokeWidth="2"
            stroke="rgba(255,99,132,1)"
          />
        </BarChart> 
      </ResponsiveContainer> */}
    </div>
  )
}

export default Chart4v1
