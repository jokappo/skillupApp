import { PricingTable } from '@clerk/nextjs'
import React from 'react'

function Billing() {
  return (
    <div className="">
      <h2 className=' font-bold text-2xl mb-5'> Select Your Plan</h2>
      <PricingTable />
    </div>
  )
}

export default Billing
