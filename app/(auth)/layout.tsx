import {Logo }from '@/components/logo/Logo'
import React from 'react'

function layout({children} : {children: React.ReactNode}) {
  return (
    <div className='relative flex flex-col items-center justify-center w-full h-screen'>
        <Logo/>
        <div className='mt-6'>
        {children}
        </div>
    </div>
  )
}

export default layout