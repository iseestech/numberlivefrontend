import React from 'react'
import style from './style.module.scss'

const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <div className={style.footer}>
      <div className={style.footerInner}>
        <p className="mb-0 text-center">
          Copyright © {year} Isees Technologies |{' '}
          <a href="https://iseestech.com/" target="_blank" rel="noopener noreferrer">
            Developed by ISEES Technologies
          </a>
        </p>
      </div>
    </div>
  )
}

export default Footer
