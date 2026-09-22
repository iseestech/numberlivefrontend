import React from 'react'
// import ChartistGraph from 'react-chartist'
// import ChartistTooltip from 'chartist-plugin-tooltips-updated'
// import {Bar, Radar, Polar, Pie, Doughnut } from 'react-chartjs-2'
// import data from './data.json'
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Area,
//   AreaChart,
// } from 'recharts'
import './style.module.scss'

const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const CustomTooltip = ({ active, payload, label, saleData }) => {
  // console.log(saleData, 'log', payload, label, active)
  // const dt = dataVal.trdataVal[tooltipItem[0].label]

  if (active && payload && payload.length) {
    // console.log(saleData, 'log', payload, label, active)

    const dt = payload[0].payload
    return (
      <div className="custom-tooltip" style={{ background: 'red' }}>
        <p className="label text-center text-bold">
          <strong>{`${label} ${dt.Year} `}</strong>
        </p>
        <p className="intro m-1">Opening Balance : {dt.openingvalue}</p>
        <p className="intro m-1">Incoming : {dt.InFlow}</p>

        <p className="intro m-1">Outgoing : {dt.OutFlow}</p>

        <p className="intro m-1">Ending Balance : {dt.closingvalue}</p>

        {/* <p className="desc">Anything you want can be displayed here.</p> */}
      </div>
    )
  }

  return null
}

const dataVal2 = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
]
const lineOptions = {
  interaction: {
    intersect: false,
    mode: 'index',
  },
  plugins: {
    legend: false,
  },
  // tooltips: {
  //   enabled: true,
  //   callbacks: {
  //     footer: (tooltipItem, dataVal) => {
  //       console.log(tooltipItem,dataVal);
  //       return "test /n 123 \n rtt"
  //     }
  //   }
  // },
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

const cashFlowOption = {
  interaction: {
    intersect: false,
    mode: 'index',
  },
  plugins: {
    legend: false,
  },
  tooltips: {
    backgroundColor: '#fff',
    enabled: true,
    // label: null,
    footerFontColor: '#000',
    footerFontSize: 16,
    footerSpacing: 4,
    borderColor: '#000',
    borderWidth: 2,
    titleFontColor: '#000',
    titleFontSize: 16,
    titleAlign: 'center',
    footerAlign: 'center',
    footerFontStyle: 'normal',
    callbacks: {
      // labelColor: (tooltipItem, chart) => {
      //   return {
      //     borderColor: 'rgb(255, 0, 0)',
      //     background: 'rgb(255, 0, 0)',
      //     display: 'none'
      //   }
      // },
      // displayColors: true,

      label: () => '',
      labelTextColor: (tooltipItem, chart) => {
        return '#543453'
      },

      footer: (tooltipItem, dataVal) => {
        const dt = dataVal.trdataVal[tooltipItem[0].label]
        return `Opening Balance : ${dt.openingvalue} \n\n Incoming : ${dt.InFlow} \n\n Outgoing : ${dt.OutFlow} \n\n Ending Balance : ${dt.closingvalue} \n`
      },
    },
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
//   className: 'demoClass',
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
//     offset: 50,
//   },
//   axisX: {
//     showGrid: false,
//     showLabel: true,
//     // offset: 80,
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

const Chart4v1 = ({ saleData, cashFlow }) => {
  // console.log('Chart4v1', saleData)
  const isCollapsed = localStorage.getItem('app.settings.isMenuCollapsed')
  return (
    <>
      {/* <div className="font-weight-bold text-dark font-size-18">Sales Rise</div> */}
      {/* <div>&nbsp;</div> */}
      {/* <ChartistGraph
        className="height-300 ct-hidden-points"
        data={saleData !== undefined ? saleData : {}}
        options={options}
        type="Line"
      /> */}
      {/* <Line
        data={saleData !== undefined ? saleData : {}}
        options={cashFlow ? cashFlowOption : lineOptions}
        width={400}
        // className="height-300 ct-hidden-points"
        height={isCollapsed === 'true' ? 210 : 250}
        // height={240}
      /> */}
      {/* {cashFlow ? (
        <ResponsiveContainer width="100%" height="100%">
         <LineChart
            width={500}
            height={300}
            data={saleData.data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={ele => `${month[Number(ele.month) - 1]}`} />
            <YAxis />
            <Tooltip labelFormatter={(e, t) => `${e} ${t?.[0]?.payload.Year}`} />
            <Tooltip content={<CustomTooltip saleData={saleData.data} />} />
            <Line
              activeDot={{ r: 6 }}
              type="monotone"
              dataKey="closingvalue"
              stroke="rgba(75,192,192,1)"
              strokeWidth="2"
              // fill="rgba(75,192,192,0.4)"
            />
          </LineChart> 
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={saleData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={ele => `${month[Number(ele.month) - 1]}`} />
            <YAxis />
            <Tooltip labelFormatter={(e, t) => `${e} ${t?.[0]?.payload.year}`} />
            <Line
              type="monotone"
              dataKey="Total"
              strokeWidth="2"
              stroke="rgba(75,192,192,1)"
              activeDot={{ r: 6 }}
            />
          </LineChart> 
        </ResponsiveContainer>
      )} */}
    </>
  )
}

export default Chart4v1
