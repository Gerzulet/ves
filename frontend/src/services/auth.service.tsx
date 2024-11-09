'use server';

import { cookies } from "next/headers";

export async function storeCookie (token : string) {
    const cookieStore = cookies();
    cookieStore.set("custom-auth-token", token);
}