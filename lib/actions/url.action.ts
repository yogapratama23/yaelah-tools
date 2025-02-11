'use server'

import { eq } from "drizzle-orm"
import { db } from "../db"
import { urlsTable } from "../schema"
import { ActionResponse, CreateUrlInput } from "../dto";

export const checkUrlByAlias = async (alias: string): Promise<ActionResponse> => {
    const checkAlias = await db.query.urlsTable.findFirst({
        where: eq(urlsTable.alias, alias)
    });

    if (checkAlias) {
        return {
            success: true,
            message: 'Alias already created',
            data: checkAlias,
        }
    }

    return {
        success: true,
        message: 'Alias not found',
        data: null,
    }
}

export const createUrl = async (input: CreateUrlInput): Promise<ActionResponse> => {
    console.log(input)
    const checkAlias = await checkUrlByAlias(input.alias);
    if (checkAlias.data) {
        return {
            success: false,
            message: checkAlias.message,
            data: checkAlias.data,
        };
    }

    const shortUrl = process.env.NEXT_PUBLIC_BASE_URL + '/' + input.alias
    
    const [ createdUrl ] =  await db.insert(urlsTable).values({
        longUrl: input.longUrl,
        shortUrl: shortUrl,
        alias: input.alias,
    }).returning()

    return {
        success: true,
        message: 'Url created',
        data: createdUrl,
    }
}

export const deleteUrl = async (id: number): Promise<ActionResponse> => {
    await db.delete(urlsTable).where(eq(urlsTable.id, id))
    return {
        success: true,
        message: 'Url deleted',
        data: null,
    }
}