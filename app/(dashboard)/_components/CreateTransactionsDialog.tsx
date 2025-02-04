"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TransactionsType } from "@/lib/types"
import { cn } from "@/lib/utils"
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/Schema/Transactions.zodSchema"
import { ReactNode } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"


interface Props {
    trigger: ReactNode,
    type: TransactionsType
}


function CreateTransactionsDialog({
    trigger,
    type
}: Props) {

    const form = useForm<CreateTransactionSchemaType>({
        resolver: zodResolver(CreateTransactionSchema),
        defaultValues: {
            type,
            date: new Date()
        }
    })

    return (
        <Dialog>
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
                    <form className="space-y-4">
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
                    <div className="flex items-center justify-between gap-2">
                    <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Input type="number" defaultValue={"0"} {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Select transaction category
                                    </FormDescription>
                                </FormItem>
                            )

                            }
                        />
                    </div>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateTransactionsDialog