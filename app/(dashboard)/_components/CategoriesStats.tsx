"use client";
import { GetCategoriesStatsResponseType } from '@/app/api/stats/categories/route';
import SkeletonWrapper from '@/components/Skeleton/SkeletonWrapper';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DateToUTCDate, GetFormatterForCurrency } from '@/lib/helpers';
import { TransactionsType } from '@/lib/types';
import { UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react'



type Props = {
    userSettings: UserSettings,
    from: Date,
    to: Date
}

function CategoriesStats({ userSettings, from, to }: Props) {

    const statsQuery = useQuery<GetCategoriesStatsResponseType>({
        queryKey: ["overview", "stats", "categories", from, to],
        queryFn: () => fetch(`/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then(res => res.json()),

    })
    const formatter = useMemo(() => {
        return GetFormatterForCurrency(userSettings.currency)
    }, [userSettings.currency])
    return (
        <div className='flex w-full flex-wrap gap-2 md:flex-nowrap'>
            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <CategoriesStatsCard
                    formatter={formatter}
                    type="income"
                    data={statsQuery.data || []}
                />
            </SkeletonWrapper>

            <SkeletonWrapper isLoading={statsQuery.isFetching}>
                <CategoriesStatsCard
                    formatter={formatter}
                    type="expense"
                    data={statsQuery.data || []}
                />
            </SkeletonWrapper>
        </div>
    )
}

export default CategoriesStats;

function CategoriesStatsCard({
    data,
    formatter,
    type
}: {
    data: GetCategoriesStatsResponseType;
    formatter: Intl.NumberFormat;
    type: TransactionsType;
}) {

    const filterData = data.filter((el) => el.type === type);
    const total = filterData.reduce(
        (acc, el) => acc + (el._sum?.amount || 0), 0
    )
    return (
        <Card className='h-80 w-full col-span-6'>
            <CardHeader>
                <CardTitle className='grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col'>
                    {type === "income" ? "Income" : "Expense"} By Category.
                </CardTitle>
            </CardHeader>
            <div className="flex items-center justify-between gap-2">
                {filterData.length === 0 && (
                    <div className='flex h-60 w-full flex-col items-center justify-center'>
                        <h1>No Data for the selected Period</h1>
                        <p className="text-sm text-muted foreground">
                            Try Selecting a different period or try adding new {type === "income" ? "income" : "expense"}
                        </p>
                    </div>
                )}

                {
                    filterData.length > 0 && (
                        <ScrollArea className='h-60 w-full px-4'>
                            <div className="flex w-full gap-4 p-4 flex-col">
                                {
                                    filterData.map((el) => {
                                        const amount = el._sum.amount || 0;
                                        const percentage = (amount * 100) / (total || amount);
                                        return (
                                            <div key={el.category} className='flex flex-col gap-2'>
                                                <div className='flex items-center justify-between'>
                                                    <span className='flex items-center text-gray-500'>
                                                        {el.categoryIcon} {el.category}
                                                        <span className='ml-2  text-xs text-muted-foreground'>
                                                            ({percentage.toFixed(0)}%)
                                                        </span>
                                                    </span>
                                                    <span className="text-sm text-gray-400">{
                                                        formatter.format(amount)
                                                    }</span>

                                                </div>
                                                <Progress  indicator={type === "income" ? "bg-emerald-500" : "bg-rose-500"} value={percentage} />
                                            </div>

                                        )
                                    })
                                }
                            </div>
                        </ScrollArea>
                    )
                }
            </div>
        </Card>
    )
}