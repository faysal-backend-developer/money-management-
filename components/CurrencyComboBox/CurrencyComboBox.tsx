/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"


import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { currencies, ICurrencies } from "@/lib/currencies"
import { useMutation, useQuery } from "@tanstack/react-query"
import SkeletonWrapper from "../Skeleton/SkeletonWrapper"
import { UserSettings } from "@prisma/client"
import { updateUserCurrency } from "@/app/wizard/_actions/userSettings"
import { toast } from "sonner"





export function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [selectedStatus, setSelectedStatus] = React.useState<ICurrencies | null>(
    null
  )

  const userSettings = useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn : () => fetch("/api/user-setting").then((res) => res.json())
  })


  React.useEffect(() => {
    if(!userSettings.data){
      return
    }
    const userCurrency = currencies.find((currency) => currency.value === userSettings?.data?.currency)

    if(userCurrency){
      setSelectedStatus(userCurrency)
    }
  }, [userSettings?.data]);

  const mutation = useMutation({
    mutationFn: updateUserCurrency,
    onSuccess: (data: UserSettings) => {
      toast.success(`User Currency Updated Successfully 🫠 `, {
        id: "update-Currency."
      });
      setSelectedStatus(
        currencies.find((c) => c.value === data.currency) || null
      )
    },
    onError: (e) => {
      toast.error(`Error Updating User Currency: ${e.message}`, {
        id: "update-Currency.",
      })
    }
    
  })

  const selectOption = React.useCallback((currency: ICurrencies | null) => {
    if(!currency){
      toast.error("Please Select a currency!")
      return
    }
    toast.loading("Updating Currency....", {
      id: "update-Currency."
    })

    mutation.mutate(currency.value);

  } , [mutation])

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userSettings?.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-center" disabled={mutation.isPending}>
            {selectedStatus ? selectedStatus.label : "+ Set Currency"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="center">
          <StatusList setOpen={setOpen} setSelectedStatus={selectOption} />
        </PopoverContent>
      </Popover>
      </SkeletonWrapper>
    )
  }

  return (
    <SkeletonWrapper isLoading={userSettings?.isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start" disabled={mutation.isPending}>
          {selectedStatus ? selectedStatus.label : "+ Set Currency"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList setOpen={setOpen} setSelectedStatus={selectOption} />
        </div>
      </DrawerContent>
    </Drawer>
    </SkeletonWrapper>
  )
}

function StatusList({
  setOpen,
  setSelectedStatus,
}: {
  setOpen: (open: boolean) => void
  setSelectedStatus: (status: ICurrencies | null) => void

  
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter currency..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {currencies.map((status : ICurrencies) => (
            <CommandItem
              key={status.value}
              value={status.value}
              onSelect={(value: any) => {
                setSelectedStatus(
                  currencies.find((priority) => priority?.value === value) || null
                )
                setOpen(false)
              }}
            >
              {status.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
