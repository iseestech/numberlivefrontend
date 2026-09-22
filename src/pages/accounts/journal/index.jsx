import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import JournalList from '@/components/accountancy/accounts/journal/journalList'

const JournalComponent = () => {
  return (
    <div>
      <Helmet title="Purchase: Invoice" />
      <JournalList />
    </div>
  )
}

export default JournalComponent
