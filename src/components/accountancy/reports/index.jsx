import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Row, Col } from 'antd'

class ReportList extends Component {
  render() {
    // console.log(this.props, 'props')
    const { data } = this.props
    const {tableData=[]} = data
    console.log(tableData, 'tableData')
    return (
      <Row className="details__page--content">
        {tableData?.map((item, index) => {
          return (
            <Col span={12}>
              <div className="fs-13 text-uppercase mb-3">
                <span className="bulletIcon">{item.name}</span>
              </div>
              <ul style={{ padding: '0 20px' }}>
                {item.children.map((val, i) => {
                  return (
                    <li style={{ opacity: !val.completed && '0.5' }} className="report__link--item">
                      <Link to={`/report/${val.url ? val.url : 'report'}`}>{val.name}</Link>
                    </li>
                  )
                })}
              </ul>
            </Col>
          )
        })}
      </Row>
    )
  }
}
const mapStateToProps = ({ user, settings, dispatch }) => ({
  user,
})

export default connect(mapStateToProps)(ReportList)

