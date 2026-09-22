import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Layout } from 'antd'
import classNames from 'classnames'
import store from 'store'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { find } from 'lodash'
import style from './style.module.scss'

const mapStateToProps = ({ menu, settings, user }) => ({
  menuData: menu.menuData,
  isMenuCollapsed: settings.isMenuCollapsed,
  isMobileView: settings.isMobileView,
  isMenuUnfixed: settings.isMenuUnfixed,
  isMenuShadow: settings.isMenuShadow,
  leftMenuWidth: settings.leftMenuWidth,
  menuColor: settings.menuColor,
  logo: settings.logo,
  role: user.role,
  services: user.services,
})

const MenuLeft = ({
  dispatch,
  menuData = [],
  isMenuCollapsed,
  isMobileView,
  isMenuUnfixed,
  isMenuShadow,
  leftMenuWidth,
  menuColor,
  logo,
  role,
  services,
}) => {
  const location = useLocation()
  const { pathname } = location
  // console.log(services,'services')
  const [selectedKeys, setSelectedKeys] = useState(store.get('app.menu.selectedKeys') || [])
  const [openedKeys, setOpenedKeys] = useState(store.get('app.menu.openedKeys') || [])

  useEffect(() => {
    applySelectedKeys()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, menuData])

  const applySelectedKeys = () => {
    const flattenItems = (items, key) =>
      items.reduce((flattenedItems, item) => {
        flattenedItems.push(item)
        if (Array.isArray(item[key])) {
          return flattenedItems.concat(flattenItems(item[key], key))
        }
        return flattenedItems
      }, [])
    const selectedItem = find(flattenItems(menuData, 'children'), ['url', pathname])
    setSelectedKeys(selectedItem ? [selectedItem.key] : [])
  }

  const onCollapse = (value, type) => {
    if (type === 'responsive' && isMenuCollapsed) {
      return
    }
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isMenuCollapsed',
        value: !isMenuCollapsed,
      },
    })
    setOpenedKeys([])
  }

  const onOpenChange = keys => {
    store.set('app.menu.openedKeys', keys)
    setOpenedKeys(keys)
  }

  const handleClick = e => {
    store.set('app.menu.selectedKeys', [e.key])
    setSelectedKeys([e.key])
  }

  const generateMenuItems = () => {
    const generateItem = item => {
      const { key, title, url, icon, disabled, count } = item
      if (role !== 'admin' && !services.includes(item.key)) {
        return null
      }
      // if (item.category) {
      //   return <Menu.ItemGroup key={Math.random()} title={`${item.title} - 12`} />
      // }
      if (item.category) {
        return null
      }
      if (item.url && (role === 'admin' || services.includes(item.key))) {
        return (
          <Menu.Item
            className={isMenuCollapsed && !isMobileView && 'text-center'}
            key={key}
            disabled={disabled}
          >
            {item.target && (
              <a href={url} target={item.target} rel="noopener noreferrer">
                {count && <span className="badge badge-success ms-2">{count}</span>}
                {icon && (
                  <span className={`${icon} ${style.icon} icon-collapsed-hidden nav__icon`} />
                )}
                <span className={`${style.title} ps-3`}>{title}</span>
              </a>
            )}
            {!item.target && (
              <Link to={url}>
                {count && <span className="badge badge-success ms-2">{count}</span>}
                {icon && (
                  <span className={`${icon} ${style.icon} icon-collapsed-hidden nav__icon`} />
                )}
                {!icon && <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>}

                <span className={`${style.title} ps-3`}>{title}</span>
              </Link>
            )}
          </Menu.Item>
        )
      }
      return (
        <Menu.Item key={key} disabled={disabled}>
          {/* {count && <span className="badge badge-success ms-2">{count}</span>} */}
          {icon && <span className={`${icon} ${style.icon} icon-collapsed-hidden nav__icon`} />}
          <span className={`${style.title} ps-3`}>{title}</span>
        </Menu.Item>
      )
    }

    const generateSubmenu = items =>
      items.map(menuItem => {
        if (role !== 'admin' && !services.includes(menuItem.key)) {
          return null
        }
        if (menuItem.children) {
          const subMenuTitle = (
            <span key={menuItem.key}>
              {menuItem.count && <span className="badge badge-success ms-2">{menuItem.count}</span>}
              {menuItem.icon && (
                <span className={`${menuItem.icon} ${style.icon} nav__icon`}>ee</span>
              )}
              <span className={`${style.title} ps-3`}>{menuItem.title}</span>
            </span>
          )
          return (
            <Menu.SubMenu title={subMenuTitle} key={menuItem.key}>
              {generateSubmenu(menuItem.children)}
            </Menu.SubMenu>
          )
        }
        return (role === 'admin' || services.includes(menuItem.key)) && generateItem(menuItem)
      })

    return menuData.map(menuItem => {
      if (role !== 'admin' && !services.includes(menuItem.key)) {
        return null
      }
      if (menuItem.roles && !menuItem.roles.includes(role)) {
        return null
      }
      if (menuItem.children) {
        const subMenuTitle = (
          <span key={menuItem.key}>
            {menuItem.count && <span className="badge badge-success ms-2">{menuItem.count}</span>}
            {menuItem.icon && <span className={`${menuItem.icon} ${style.icon} nav__icon`} />}
            <span className={`${style.title} ps-3`}>{menuItem.title}</span>
          </span>
        )
        return (
          <Menu.SubMenu
            className={isMenuCollapsed && !isMobileView && 'text-center'}
            title={subMenuTitle}
            key={menuItem.key}
          >
            {generateSubmenu(menuItem.children)}
          </Menu.SubMenu>
        )
      }
      return generateItem(menuItem)
    })
  }

  const menuSettings = isMobileView
    ? {
        width: leftMenuWidth,
        collapsible: false,
        collapsed: false,
        onCollapse,
      }
    : {
        width: leftMenuWidth,
        collapsible: true,
        collapsed: isMenuCollapsed,
        onCollapse,
        breakpoint: 'lg',
      }

  return (
    <Layout.Sider
      {...menuSettings}
      className={classNames(`${style.menu}`, {
        [style.white]: menuColor === 'white',
        [style.gray]: menuColor === 'gray',
        [style.dark]: menuColor === 'dark',
        [style.unfixed]: isMenuUnfixed,
        [style.shadow]: isMenuShadow,
      })}
    >
      <div
        className={style.menuOuter}
        style={{
          width: isMenuCollapsed && !isMobileView ? 80 : leftMenuWidth,
          height: isMobileView || isMenuUnfixed ? 'calc(100% - 64px)' : 'calc(100% - 110px)',
        }}
      >
        <div className={style.logoContainer}>
          <div className={style.logo}>
            <div style={{ width: '50px' }}>
              <img
                style={{ width: '100%' }}
                src="/assets/resources/images/logo.svg"
                className="me-2"
                alt="Advisor | Number"
              />
            </div>
            {/* <div className={style.name}>{logo}</div> */}
          </div>
        </div>
        <PerfectScrollbar>
          <Menu
            onClick={handleClick}
            selectedKeys={selectedKeys}
            openKeys={openedKeys}
            onOpenChange={onOpenChange}
            mode="inline"
            className={style.navigation}
            inlineIndent="10"
          >
            {generateMenuItems()}
          </Menu>
          {/* <div className={style.banner}>
            <p>More components, more style, more themes, and premium support!</p>
            <a
              href="https://themeforest.net/item/clean-ui-react-admin-template/21938700"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-success btn-rounded px-3"
            >
              Buy Bundle
            </a>
          </div> */}
        </PerfectScrollbar>
      </div>
    </Layout.Sider>
  )
}

export default connect(mapStateToProps)(MenuLeft)
