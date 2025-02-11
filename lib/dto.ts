export type Url = {
    id: number,
    longUrl: string,
    shortUrl: string,
    alias: string,
    createdAt: Date,
}

export type CreateUrlInput = {
    alias: string,
    longUrl: string,
}

export type ActionResponse = {
    success: boolean,
    message?: string,
    data?: any,
}