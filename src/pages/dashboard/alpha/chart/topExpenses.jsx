import React, { useState, useEffect } from 'react'
// import { Doughnut, Pie } from 'react-chartjs-2'
// import { Line, Bar, Radar, Polar, Pie, Doughnut } from 'react-chartjs-2'

import data from './data.json'
import style from './style.module.scss'

const Chart10 = props => {
  const { saleData } = props
  const tooltip = React.createRef()
  const tooltipLabel = React.createRef()
  const tooltipValue = React.createRef()

  const [myRef, setMyRef] = useState(null)
  const [legend, setLegend] = useState(undefined)
  const [expData, setExpData] = useState({})

  useEffect(() => {
    function getRandomColor(lebel) {
      const color = lebel.map(x => `#${Math.floor(Math.random() * 16777215).toString(16)}`)
      return color
    }
    const exp = {
      labels: [],
      datasets: [
        {
          data: [],
          // backgroundColor: ["#FF6384", '#36A2EB', '#FFCE56', "rgba(75,192,192,0.4)","rgba(75,192,192,1)"],
          backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
          borderColor: '#fff',
          // borderWidth: 2,
          // hoverBorderWidth: 0,
          // borderAlign: 'inner',
        },
      ],
    }
    const label = []
    const dataset = []
    const bgColor = []
    if (props.saleData.length) {
      props.saleData.forEach(x => {
        label.push(x.expenses_act)
        dataset.push(x.TotalExpense)
        // bgColor.push(getRandomColor())
      })

      exp.labels = label
      exp.datasets[0].data = dataset
      // exp.datasets[0].backgroundColor = getRandomColor(label)
      setExpData(exp)
    } else {
      setExpData(exp)
    }
  }, [saleData])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const leg = generateLegend()
    setLegend(leg)
  })

  const setChartRef = element => {
    setMyRef(element)
  }

  const generateLegend = () => {
    if (!myRef) return null
    return myRef.chartInstance.generateLegend()
  }

  const createMarkup = () => {
    return { __html: legend }
  }

  const options = {
    animation: false,
    responsive: true,
    cutoutPercentage: 70,
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
      custom: tooltipData => {
        const tooltipEl = tooltip.current
        tooltipEl.style.opacity = 1
        if (tooltipData.opacity === 0) {
          tooltipEl.style.opacity = 0
        }
      },
      callbacks: {
        label: (tooltipItem, itemData) => {
          const dataset = itemData.datasets[0]
          const value = dataset.data[tooltipItem.index]
          tooltipValue.current.innerHTML = value
          tooltipLabel.current.innerHTML = itemData.labels[tooltipItem.index]
        },
      },
    },
    legendCallback: chart => {
      const { labels } = chart.data
      let legendMarkup = []
      const dataset = chart.data.datasets[0]
      const total = dataset.data.reduce((x, y) => x + y, 0)
      // console.log(dataset, 'dddd', dataset.data, 'legendCallback', total)

      // let datasets = ctx.chart.data.datasets;

      // if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
      //    let sum = 0;
      //    datasets.map(dataset => {
      //       sum += dataset.data[ctx.dataIndex];
      //    });
      //    let percentage = Math.round((value / sum) * 100) + '%';
      //    return percentage;

      legendMarkup.push('<div class="kit__c9__chartLegend flex-shrink-0">')
      let legends = labels.map((label, index) => {
        const color = dataset.backgroundColor[index]
        const percentage = Math.round((dataset.data[index] / total) * 100)
        return `<div class="d-flex align-items-center flex-nowrap mt-2 mb-2"><div class="tablet me-3" style="background-color: ${color}"></div>${label} (${percentage}%)</div>`
      })
      legends = legends.join('')
      legendMarkup.push(legends)
      legendMarkup.push('</div>')
      legendMarkup = legendMarkup.join('')
      return legendMarkup
    },
  }

  return (
    <div>
      {/* <div className="text-dark font-size-18 font-weight-bold mb-1">Top Expenses</div> */}
      <div className="row d-flex flex-wrap align-items-center">
        {saleData && saleData.length ? (
          <>
            <div className="col-sm-7 mt-3 mb-3 position-relative">
              {/* <Doughnut
                className="height-200 ct-hidden-points"
                ref={element => setChartRef(element)}
                data={expData}
                options={options}
                // width='100%'
                height={195}
              /> */}
              {/* <Doughnut data={doughnutData} options={doughnutOptions} width={400} height={200} /> */}
              {/* <Pie
            // className="height-200 ct-hidden-points"
            ref={element => setChartRef(element)}
            data={data}
            options={options}
            // width='100%'
            height={195}
          />  */}
              <div
                className={`${style.tooltip} text-gray-5 font-size-28 text-center`}
                ref={tooltip}
              >
                <div className="font-size-14 font-weight-bold text-dark" ref={tooltipLabel} />
                <div className="font-size-14 text-dark" ref={tooltipValue} />
              </div>
            </div>
            <div className="col-sm-5" dangerouslySetInnerHTML={createMarkup()} />{' '}
          </>
        ) : (
          <div
            className="text-center mx-auto"
            style={{ height: '208px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <strong> No data to display</strong>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chart10
