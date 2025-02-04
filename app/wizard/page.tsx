import { CurrencyComboBox } from '@/components/CurrencyComboBox/CurrencyComboBox';
import { Logo } from '@/components/logo/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

async function page() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in")
  }
  return (
    <div className='container flex max-w-2xl flex-col items-center justify-between gap-4'>
      <div>
        <h1 className='text-center text-2xl'>Welcome <span className='ml-2 font-bold '>{user?.lastName}! 👋  </span></h1>
        <h2 className='mt-4 text-center text-base  text-muted-foreground'>Let &apos;s get started by setting up your currency</h2>
        <h3 className='mt-2 text-center text-sm text-muted-foreground '>
          You can change your currency at any time from your account settings.
        </h3>
      </div>
      <Separator />
      <Card className='md:w-full'>
        <CardHeader>
          <CardTitle>
            Currency 
          </CardTitle>
          <CardDescription>
            Set Your default Currency for transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
            <CurrencyComboBox/>
        </CardContent>
      </Card>
      <Separator/>
      <Button className=' md:w-full' asChild>
        <Link href={"/"}>I &apos;m Done. Take me to the dashboard → </Link>
      </Button>
      <div>
        <Logo/>
      </div>
    </div>
  )
}

export default page