"use client";

import { GetBalanceStatsResponseType } from '@/app/api/stats/balance/route';
import SkeletonWrapper from '@/components/Skeleton/SkeletonWrapper';
import { Card } from '@/components/ui/card';
import { DateToUTCDate, GetFormatterForCurrency } from '@/lib/helpers';
import { UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import React, { ReactNode, useCallback, useMemo } from 'react'
import CountUp from 'react-countup';
type Props = {
    userSettings : UserSettings,
    from : Date,
    to: Date
}
function StatsCards({userSettings, from, to} : Props) {
    
    const statsQuery = useQuery<GetBalanceStatsResponseType>({
        queryKey: ['overview','stats',  from, to, "categories", "income", "expense"],
        queryFn: () => fetch(`/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then(res => res.json())
    })

    const formatter = useMemo(() => {
        return GetFormatterForCurrency(userSettings.currency);
    }, [userSettings.currency])


    const income = statsQuery.data?.income || 0;
    const expense = statsQuery.data?.expense || 0;

    const balance = income - expense;


  return (
    <div className='relative flex flex-wrap md:flex-nowrap w-full mx-auto gap-2'>
        <SkeletonWrapper isLoading={statsQuery.isFetching}>
            <StatCard 
            formatter = {formatter}
            title = "Income"
            value={income}
            icon = {
                <TrendingUp className='h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10'/>
            }
            />
        </SkeletonWrapper>

        <SkeletonWrapper isLoading={statsQuery.isFetching}>
            <StatCard 
            formatter = {formatter}
            title = "Expense"
            value={expense}
            icon = {
                <TrendingDown className='h-12 w-12 items-center rounded-lg p-2 text-rose-500 bg-rose-400/10'/>
            }
            />
        </SkeletonWrapper>

        <SkeletonWrapper isLoading={statsQuery.isFetching}>
            <StatCard 
            formatter = {formatter}
            title = "Balance"
            value={balance}
            icon = {
                <Wallet className='h-12 w-12 items-center rounded-lg p-2 text-purple-500 bg-purple-400/10'/>
            }
            />
        </SkeletonWrapper>
    </div>
  )
}

export default StatsCards;

function StatCard({formatter, title, value, icon}: {
    formatter: Intl.NumberFormat,
    title: string;
    value: number,
    icon: ReactNode

}) {

    const formatFn = useCallback((value: number) => {
        return formatter.format(value);
    }, [formatter])
    return (
        <Card className='flex w-full items-center gap-2 h-24 p-4'>
            {icon}
            <div className="flex flex-col items-start gap-0">
                <p className='text-muted-foreground '>{title}</p>
                <CountUp 
                preserveValue
                redraw={false}
                end={value}
                decimal='2'
                formattingFn={formatFn}
                className='text-2xl'
                />
            </div>
        </Card>
    )
}