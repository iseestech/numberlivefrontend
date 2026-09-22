import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'
import './scss/timeline.scss'
import LogsService from '@/services/logs'
import store from 'store'
import { FormOutlined } from '@ant-design/icons'

export default function Timeline(props) {
  // console.log(props, 'history')
  const { orgCode, id, type, formName } = props
  const [rowData, setRowData] = useState([])

  useEffect(() => {
    const org = store.get('selectedOrg')

    const fetchData = async () => {
      const obj = {
        orgCode: org.orgCode,
        id: props.data.trId,
        type: props.data.type,
        formName: props.data.formName,
      }
      const result = await LogsService.displayLogs(obj)
      //   // console.log(result, 'result')
      setRowData(result || [])
    }
    fetchData()
  }, [orgCode, id, type, formName])
  return (
    <>
      <div className="history__timline">
        {/* <VerticalTimeline layout="1-column-left">
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
            date="2011 - present"
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            position="right"

            // icon={<WorkIcon />}
          >
            <h3 className="vertical-timeline-element-title">Creative Director</h3>
            <h4 className="vertical-timeline-element-subtitle">Miami, FL</h4>
            <p>
              Creative Direction, User Experience, Visual Design, Project Management, Team Leading
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="2010 - 2011"
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            position="right"

            // icon={<WorkIcon />}
          >
            <h3 className="vertical-timeline-element-title">Art Director</h3>
            <h4 className="vertical-timeline-element-subtitle">San Francisco, CA</h4>
            <p>Creative Direction, User Experience, Visual Design, SEO, Online Marketing</p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="2008 - 2010"
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            position="right"

            // icon={<WorkIcon />}
          >
            <h3 className="vertical-timeline-element-title">Web Designer</h3>
            <h4 className="vertical-timeline-element-subtitle">Los Angeles, CA</h4>
            <p>User Experience, Visual Design</p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="2006 - 2008"
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            position="right"

            // icon={<WorkIcon />}
          >
            <h3 className="vertical-timeline-element-title">Web Designer</h3>
            <h4 className="vertical-timeline-element-subtitle">San Francisco, CA</h4>
            <p>User Experience, Visual Design</p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--education"
            date="April 2013"
            iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
            // layout="1-column-left"
            position="right"

            // icon={<SchoolIcon />}
          >
            <h3 className="vertical-timeline-element-title">
              Content Marketing for Web, Mobile and Social Media
            </h3>
            <h4 className="vertical-timeline-element-subtitle">Online Course</h4>
            <p>Strategy, Social Media</p>
          </VerticalTimelineElement>
        </VerticalTimeline> */}
        <VerticalTimeline layout="1-column-left">
          {rowData.map((data, index) => (
            <VerticalTimelineElement
              className="vertical-timeline-element--work"
              contentStyle={{ border: '1px solid #ccc' }}
              contentArrowStyle={{ borderRight: '7px solid #ccc' }}
              date={moment(data.action_date).format('MM/DD/YYYY hh:mm:ss A')}
              iconStyle={{ background: '#ccc', border: '1px solid #ccc' }}
              position="right"
              icon={
                <div className="myIcon">
                  <FormOutlined />
                </div>
              }
            >
              <h5 className="vertical-timeline-element-title" style={{}}>
                {' '}
                {data.message}
              </h5>
              <h6 className="vertical-timeline-element-subtitle" style={{}}>
                {' '}
                by {data.user_email}
              </h6>
              {/* <p>
                  Creative Direction, User Experience, Visual Design, Project Management, Team
                  Leading
                </p> */}
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>
    </>
  )
}
