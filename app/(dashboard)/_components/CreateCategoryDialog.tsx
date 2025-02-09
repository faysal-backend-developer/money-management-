/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { TransactionsType } from '@/lib/types';
import { CreateCategorySchemaType } from '@/Schema/Category.zodSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form';
import { CreateCategorySchema } from '../../../Schema/Category.zodSchema';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CircleOff, Loader2, PlusSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateCategory } from '../_actions/categories';
import { Category } from '@prisma/client';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
interface Props {
    type: TransactionsType;
    successCallback: (category: Category) => void
}

function CreateCategoryDialog({ type, successCallback }: Props) {
    const [open, setOpen] = useState(false);
    const form = useForm<CreateCategorySchemaType>({
        resolver: zodResolver(CreateCategorySchema),
        defaultValues: {
            type
        }
    })

    const queryClient = useQueryClient();

    const theme = useTheme();
    // Create Category Mutation Fn : 
    const { mutate, isPending } = useMutation({
        mutationFn: CreateCategory,
        onSuccess: async (data: Category) => {
            form.reset({
                name: "",
                type,
                icon: ""
            })

            toast.success(`Category ${data.name} is Created Success`, {
                id: "create-category"
            })

            successCallback(data)

            await queryClient.invalidateQueries({
                queryKey: ["categories"]
            })

            setOpen(prev => !prev)
        },
        onError: (error) => {
            toast.error(`Something want wrong 😡`, {
                id: "create-category"
            })
        }
    })

    const onSubmit = useCallback((value: CreateCategorySchemaType) => {
        toast.loading("Creating Category....", {
            id: "create-category"
        })
        mutate(value)
    }, [mutate])


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"ghost"} className='flex border-separate items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground'>
                    <PlusSquare className='w-4 mr-2 h-4' />
                    <span className='text-sm'>Create New Category</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create <span className={cn(
                            "m-1",
                            type === "income" ? "text-emerald-500" : "text-rose-500"
                        )}>{type}</span>
                        category
                    </DialogTitle>
                    <DialogDescription>
                        categories are used to group your transactions
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Type Category Name' {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Type your Category Name here..
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        {/* For Icon  */}

                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Icon</FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant={"outline"} className='h-[100px] w-full'>
                                                    {
                                                        form.watch("icon") ? (
                                                            <div className='flex flex-col gap-2 items-center'>
                                                                <span className='text-5xl' role='img'>{field.value}</span>
                                                                <p className='text-xs text-muted-foreground'>Click to change Icon</p>
                                                            </div>
                                                        ) : (
                                                            <div className='flex flex-col items-center gap-2'>
                                                                <CircleOff className='h-[48px] w-[48px]' />
                                                                <p className='text-xs text-muted-foreground '>Click to change Icon</p>
                                                            </div>
                                                        )
                                                    }
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className='w-full'>
                                                <Picker theme={theme.resolvedTheme} data={data} onEmojiSelect={(emoji: {
                                                    native: string
                                                }) => {
                                                    field.onChange(emoji.native)
                                                }} />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormDescription>
                                        Select Your Fav Icon
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant={"secondary"} onClick={() => {
                            form.reset({
                                icon: "",
                                name: "",
                                type
                            })
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

export default CreateCategoryDialog