import BodyConditionScore from '@/components/BodyCondition'
import MoreInfo from '@/components/details'
import ServiceHeader from '@/components/ServiceHeader'
import React from 'react'

const page = () => {
  return (
    <div className='bg-white'>
      <ServiceHeader/>
      <MoreInfo/>
      <BodyConditionScore/>
    </div>
  )
}

export default page
