import { PiggyBank } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export function Logo() {
  return (
    <div>
        <Link className='flex items-center gap-2' href={'/'}>
            <PiggyBank className='stroke h-11 w-11 stroke-amber-500 stroke-[1.5]'/>
            <p className='bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-mono text-transparent '>Money Management</p>
        </Link>
    </div>
  )
}

export function MobileLogo() {
  return (
    <Link className='flex items-center gap-1' href={'/'}>
            <PiggyBank className='stroke h-4 w-4 stroke-amber-500 stroke-[1]'/>
            <p className='bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-lg font-mono text-transparent '>Money Management</p>
        </Link>
  )
}

