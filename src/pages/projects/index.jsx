import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import ProjectList from '@/components/accountancy/projects/projectList'

const ProjectComponent = () => {
  return (
    <div>
      <Helmet title="Purchase: Invoice" />
      <ProjectList />
    </div>
  )
}

export default ProjectComponent
