import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import ReverseJournalList from '@/components/accountancy/accounts/reverseJournal/revJournalList'

const JournalComponent = () => {
  return (
    <div>
      <ReverseJournalList />
    </div>
  )
}

export default JournalComponent
