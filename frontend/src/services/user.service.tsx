'use server';

import { cookies } from "next/headers";
import { User } from '@/types/user';

export async function getUserById(id: string): Promise<User> {
  let response = null;
  if (id) {
    const cookieStore = cookies();
    const token = cookieStore.get("custom-auth-token")?.value;
    const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
      headers: {
        'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
      },
    });

    response = await request.json();
  }
  return response;
}

export async function getUsers(page: number = 1, perPage: number = 5): Promise<{ users: User[], totalCount: number }> {
  const cookieStore = cookies();
  const token = cookieStore.get("custom-auth-token")?.value;
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users?page=${page}&per_page=${perPage}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const data = await response.json();
  return {
    users: data.users,
    totalCount: data.totalCount,
  };
}

export async function saveUser(userData: User) {
  const cookieStore = cookies();
    const token = cookieStore.get("custom-auth-token")?.value;
  const request =  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userData.id}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  const response = await request.json()
  return response;
}

export async function createUser(userData: User) {
  const cookieStore = cookies();
    const token = cookieStore.get("custom-auth-token")?.value;
    const request =  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    const response = await request.json()
    return response;
}


export async function deleteUser(id: number | undefined): Promise<User> {
  let response = null;
  if (id) {
    const cookieStore = cookies();
    const token = cookieStore.get("custom-auth-token")?.value;
    const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
      },
    });

    response = await request.json();
  }
  return response;
}