/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TransactionsType } from "@/lib/types"
import { cn } from "@/lib/utils"
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/Schema/Transactions.zodSchema"
import { ReactNode, useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CategoryPicker from "./CategoryPicker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CreateTransaction } from "../_actions/transactions"
import { toast } from "sonner"
import { DateToUTCDate } from "@/lib/helpers"


interface Props {
    trigger: ReactNode,
    type: TransactionsType
}


function CreateTransactionsDialog({
    trigger,
    type
}: Props) {
    const [open, setOpen] = useState(false)
    const form = useForm<CreateTransactionSchemaType>({
        resolver: zodResolver(CreateTransactionSchema),
        defaultValues: {
            type,
            date: new Date()
        }
    })


    const handleCategoryChange = useCallback((value: string) => {
        form.setValue("category", value)
    }, [form])
    const queryClient = useQueryClient();
    const {mutate, isPending} = useMutation({
        mutationFn: CreateTransaction,
        onSuccess: () => {
            toast.success("Transaction Created Successfully 🫠", {
                id: "create-transaction"
            })
            form.reset({
                type,
                date: new Date(),
                category: undefined,
                amount: 0,
                description: ""

            })

            queryClient.invalidateQueries({
                queryKey: ["overview"]
            })

            setOpen(prev => !prev)
        }
    }) 

    const onSubmit = useCallback((value: CreateTransactionSchemaType
    ) => {
        toast.loading("Creating Transaction...", {
            id: "create-transaction"
        })
        mutate({
            ...value,
            date: DateToUTCDate(value.date)
        })
    }, [mutate])
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new <span className={
                        cn("m-1 text-xl  font-bold",
                            type == "income" ? "text-emerald-500" : "text-rose-500"
                        )
                    }>{type}</span>transaction {type === "income" ? "🔥" : "😡"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input defaultValue={""} {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Transaction Description (optional)
                                    </FormDescription>
                                </FormItem>
                            )

                            }
                        />

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input type="number" defaultValue={"0"} {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Transaction Amount (required)
                                    </FormDescription>
                                </FormItem>
                            )

                            }
                        />
                        {/* Transaction : {form.watch("category")} */}
                        <div className="flex items-center justify-between gap-2">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <CategoryPicker onChange={handleCategoryChange} type={type} />
                                        </FormControl>
                                        <FormDescription>
                                            Select transaction category
                                        </FormDescription>
                                    </FormItem>
                                )

                                }
                            />

                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Transaction Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant={"outline"} className={
                                                            cn(
                                                                "w-[200px] pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )
                                                        } >
                                                            {
                                                                field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a Date</span>
                                                                )
                                                            }
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <Calendar mode="single" selected={field.value} onSelect={(value) => {
                                                        if(!value) return ;
                                                        field.onChange(value);
                                                    }} initialFocus/>
                                                </PopoverContent>
                                            </Popover>
                                        <FormDescription>
                                            Select transaction Date
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )

                                }
                            />
                        </div>

                    </form>
                </Form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant={"secondary"} onClick={() => {
                            form.reset()
                        }} >Cancel</Button>

                    </DialogClose>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
                        {!isPending && "Create"}
                        {isPending && <Loader2 className='animate-spin' />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateTransactionsDialog