import Table from 'svgs/Table'
import Tag from 'svgs/Tag'
import s from '../Account.module.css'

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