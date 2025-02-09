"use server";
import { prisma } from "@/lib/prisma";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/Schema/Transactions.zodSchema";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateTransaction(form: CreateTransactionSchemaType) {
    const parsedBody = CreateTransactionSchema.safeParse(form);
    if(!parsedBody.success){
        throw new Error("Bad Request")
    };

    const user = await currentUser();
    if(!user){
        redirect("/sign-in")
    };


    const {amount, date, category, type, description} = parsedBody.data;

    const categoryRow = await prisma.category.findFirst({
        where: {
            userId: user.id,
            name: category
        }
    });

    if(!categoryRow){
        throw new Error("Category Not Founded")
    }
    
    await prisma.$transaction([
        prisma.transactions.create({
            data: {
                userId: user.id,
                amount,
                date,
                description: description || "",
                category: categoryRow.name,
                categoryIcon : categoryRow.icon,
                type
            }
        }),

        prisma.monthHistory.upsert({
            where: {
                day_month_year_userId: {
                    userId: user.id,
                    day: date.getUTCDate(),
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear()
                }
            },
            create: {
                userId: user.id,
                day: date.getUTCDate(),
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                expense: type === "expense" ? amount : 0,
                income: type === "income" ? amount : 0
            },
            update: {
                expense : {
                    increment: type === "expense" ? amount : 0
                },
                income : {
                    increment: type === "income" ? amount : 0
                }
            }
        }),

        prisma.yearHistory.upsert({
            where: {
                month_year_userId: {
                    userId: user.id,
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear()
                }
            },
            create: {
                userId: user.id,
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                expense: type === "expense" ? amount : 0,
                income: type === "income" ? amount : 0
            },
            update: {
                expense : {
                    increment: type === "expense" ? amount : 0
                },
                income : {
                    increment: type === "income" ? amount : 0
                }
            }
        })

    ])
}