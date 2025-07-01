'use client'
import React from 'react'
import EditCourse from '../../edit-course/[courseId]/page'
import { useParams } from 'next/navigation'

function ViewCourse() {
    const {courseId} = useParams()
  return (
    <div>
      <EditCourse viewCourse={true}/>
    </div>
  )
}

export default ViewCourse
