import React from 'react'
import s from '../../styles/Account.module.css'
import Table from '../svgs/Table'
import Tag from '../svgs/Tag'

export default function Tabs({ setTab, tab }) {
  return (
    <div className={s.tabs}>
      <div className={s.posttab + (!tab?` ${s.activetab}`: '')} onClick={() => setTab(0)}>
        <Table/>
        <span>POSTS</span>
      </div>
      <div className={s.tagtab + (tab?` ${s.activetab}`: '')} onClick={() => setTab(1)}>
        <Tag/>
        <span>TAGGED</span>
      </div>
    </div>
  )
}