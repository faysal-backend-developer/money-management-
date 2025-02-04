/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
    const user = await currentUser();
    
    if(!user){
        redirect("/sign-in")
    }

    let userSetting = await prisma.userSettings.findUnique({
        where: {
            userId : user?.id
        }
    });

    if(!userSetting){
        userSetting = await prisma.userSettings.create({
            data: {
                userId: user?.id,
                currency: "USD"
            }
        })
    }

    revalidatePath("/")
    return Response.json(userSetting)
}