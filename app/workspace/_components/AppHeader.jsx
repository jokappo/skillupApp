"use client";
import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

function AppHeader({hideSideBare}) {
  return (
    <div className='flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-50'>
      {!hideSideBare && <SidebarTrigger/>}
      <UserButton></UserButton>
    </div>
  )
}

export default AppHeader
