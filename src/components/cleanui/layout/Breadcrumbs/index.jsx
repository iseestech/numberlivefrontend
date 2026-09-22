import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { reduce } from 'lodash'
import styles from './style.module.scss'

const mapStateToProps = ({ menu }) => ({
  menuData: menu.menuData,
})

const Breadcrumbs = props => {
  const [breadcrumbs, setBreadcrumbs] = useState([])
  const location = useLocation()
  const {
    pathname,
  } = location
  const {
    menuData = [],
  } = props
  useEffect(() => {
    setBreadcrumbs(() => getBreadcrumbs())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, menuData])

  const getPath = (data, url, parents = []) => {
    const items = reduce(
      data,
      (result, entry) => {
        if (result.length) {
          return result
        }
        if (entry.url === url) {
          return [entry].concat(parents)
        }
        if (entry.children) {
          const nested = getPath(entry.children, url, [entry].concat(parents))
          return (result || []).concat(nested.filter(e => !!e))
        }
        return result
      },
      [],
    )
    return items.length > 0 ? items : [false]
  }

  const getBreadcrumbs = () => {
    const [activeMenuItem, ...path] = getPath(menuData, pathname)
    if (!activeMenuItem) {
      const { location } = props
      const routeName = location.pathname.split('/')
      const actionName = Number(routeName[3]) ? '' : routeName[3]
      // console.log(actionName, 'sdsdsd')
      return [
        <span key="test">
          <span className={styles.arrow} />
          <span style={{ textTransform: 'capitalize' }}>
            <Link to={`/${routeName[1].replaceAll('-', ' ')}/${routeName[2]}s`}>
              {routeName[1]}
            </Link>
          </span>
          <span className={styles.arrow} />
          <strong className={styles.current} style={{ textTransform: 'capitalize' }}>
            {`${actionName || ''} ${routeName[2]}`}
          </strong>
        </span>,
      ]
    }
    if (activeMenuItem && path.length) {
      return path.reverse().map((item, index) => {
        if (index === path.length - 1) {
          return (
            <span key={item.key}>
              <span className={styles.arrow} />
              <span>{item.title}</span>
              <span className={styles.arrow} />
              <strong className={styles.current}>{activeMenuItem.title}</strong>
            </span>
          )
        }
        return (
          <span key={item.key}>
            <span className={styles.arrow} />
            <span>{item.title}</span>
          </span>
        )
      })
    }
    return (
      <span>
        <span className={styles.arrow} />
        <strong className={styles.current}>{activeMenuItem.title}</strong>
      </span>
    )
  }
  return (
    breadcrumbs &&
    (breadcrumbs.length ? (
      <div className={styles.breadcrumbs}>
        <div className={styles.path}>
          <Link to="/dashboard/alpha">Home</Link>
          {breadcrumbs}
        </div>
      </div>
    ) : null)
  )
}

export default connect(mapStateToProps)(Breadcrumbs)
