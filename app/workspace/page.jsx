"use client";
import React from 'react'
import WelcomeBanner from './_components/WelcomeBanner'
import CourseList from './_components/CourseList'
import EnroleCourseList from './_components/EnroleCourseList'


function Workspace() {
  return (
    <div>
      <WelcomeBanner/>
      <EnroleCourseList/>
      <CourseList />
    </div>
  )
}

export default Workspace
