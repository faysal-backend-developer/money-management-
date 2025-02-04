"use server"

import { prisma } from "@/lib/prisma"
import { UserSettingsUpdateZodSchema } from "@/Schema/UserSettings.zodSchema"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"


export async function updateUserCurrency(currency: string) {
    const parsedBody = UserSettingsUpdateZodSchema.safeParse({
        currency
    })

    if(!parsedBody.success){
        throw new Error(parsedBody.error.issues[0].message)
    }

    const user = await currentUser();

    if(!user){
        redirect("/sign-in")
    }

    const userSettings = await prisma.userSettings.update({
        where: {
            userId: user.id
        },
        data: {
            currency
        }
    })

    return userSettings
}