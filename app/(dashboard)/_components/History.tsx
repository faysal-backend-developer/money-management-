"use client";

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GetFormatterForCurrency } from '@/lib/helpers';
import { Period, TimeFrame } from '@/lib/types';
import { UserSettings } from '@prisma/client';
import React, { useMemo, useState, useEffect } from 'react';
import HistoryPeriodSelector from './HistoryPeriodSelector';
import { useQuery } from '@tanstack/react-query';
import SkeletonWrapper from '@/components/Skeleton/SkeletonWrapper';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

type Props = {
    userSettings: UserSettings;
};

function History({ userSettings }: Props) {
    // Ensure the initial state is set after mount to avoid hydration mismatch
    const [timeFrame, setTimeFrame] = useState<TimeFrame | null>(null);
    const [period, setPeriod] = useState<Period>({
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const formatter = useMemo(() => {
        return GetFormatterForCurrency(userSettings.currency);
    }, [userSettings.currency]);

    // Ensure the component mounts before setting the default timeFrame
    useEffect(() => {
        setTimeFrame("month");
    }, []);

    // Avoid running the query until timeFrame is set
    const historyDataQuery = useQuery({
        queryKey: timeFrame ? ["overview", "history", timeFrame, period] : [],
        queryFn: () => fetch(`/api/history-data?timeFrame=${timeFrame}&year=${period?.year}&month=${period?.month}`)
            .then(res => res.json()),
        enabled: !!timeFrame, // Prevents query from running when timeFrame is null
    });

    const dataAvailable = historyDataQuery.data && historyDataQuery?.data?.length > 0;

    return (
        <div className='container mx-auto'>
            <h1 className="mt-12 text-3xl font-bold">History</h1>
            <Card className='col-span-12 mt-2 w-full'>
                <CardHeader className='gap-12'>
                    <CardTitle className='grid grid-flow-row justify-between gap-2 md:grid-flow-col'>
                        {timeFrame && (
                            <HistoryPeriodSelector
                                period={period}
                                setPeriod={setPeriod}
                                timeFrame={timeFrame}
                                setTimeFrame={setTimeFrame}
                            />
                        )}

                        <div className="flex h-12 gap-2">
                            <Badge variant={"outline"} className='flex items-center gap-2 text-sm'>
                                <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
                                Income
                            </Badge>
                        </div>

                        <div className="flex h-12 gap-2">
                            <Badge variant={"outline"} className='flex items-center gap-2 text-sm'>
                                <div className="h-4 w-4 rounded-full bg-rose-500"></div>
                                Expense
                            </Badge>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <SkeletonWrapper isLoading={historyDataQuery.isFetching}>
                        {dataAvailable && (
                            <ResponsiveContainer width={"100%"} height={300}>
                                <BarChart height={300} data={historyDataQuery.data} barCategoryGap={5}>
                                    <defs>
                                        <linearGradient id="incomeBar" x1={0} x2={0} y1={0} y2={1}>
                                            <stop offset={0} stopColor='#10b981' stopOpacity={1} />
                                            <stop offset={1} stopColor='#10b981' stopOpacity={0} />
                                        </linearGradient>

                                        <linearGradient id="expenseBar" x1={0} x2={0} y1={0} y2={1}>
                                            <stop offset={0} stopColor='#ef4444' stopOpacity={1} />
                                            <stop offset={1} stopColor='#ef4444' stopOpacity={0} />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid strokeDasharray="5 5" strokeOpacity={0.2} vertical={false} />
                                    <XAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        padding={{ left: 5, right: 5 }}
                                        dataKey={(data) => {
                                            const { year, month, day } = data;
                                            const date = new Date(year, month, day || 1); // Fix: month - 1 to match JS date

                                            if (timeFrame === "year") {
                                                return date.toLocaleDateString("default", {
                                                    month: "long",
                                                });
                                            }

                                            return date.toLocaleDateString("default", {
                                                day: "2-digit"
                                            })
                                        }}
                                    />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <Bar dataKey={"income"} label="Income" fill='url(#incomeBar)' radius={4} className='cursor-pointer' />
                                    <Bar dataKey={"expense"} label="Expense" fill='url(#expenseBar)' radius={4} className='cursor-pointer' />
                                </BarChart>
                            </ResponsiveContainer>
                        )}

                        {!dataAvailable && (
                            <Card className='flex h-[300px] flex-col items-center justify-center bg-background '>
                                No data for the selected Period!
                                <p className="text-sm text-muted-foreground">
                                    Try selecting a different period or adding <span className='font-bold text-rose-500'>new Transaction</span>.
                                </p>
                            </Card>
                        )}
                    </SkeletonWrapper>
                </CardContent>
            </Card>
        </div>
    );
}

export default History;
