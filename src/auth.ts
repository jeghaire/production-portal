import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './lib/auth.config';
import { z } from 'zod';
import { User } from './lib/definitions';
 
async function getUser(email: string, password:string): Promise<User | undefined> {
   const apiUrl = `${process.env.NEXT_PUBLIC_API_AUTH_URL}?email=${encodeURIComponent(email)}&pwd=${encodeURIComponent(password)}`;
   
   try {
    const res = await fetch(apiUrl, { method: "GET" });
    const result = await res.json();
    if (result.status === "PP") {
    return {
      id: result.id,
      name: result.surname,
      email: result.username,
      password: '',
    }}
  } catch {
    return undefined;
  }

  return undefined;
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string(), password: z.string()})
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email, password);
          if (!user) return null;
          return user
        }
     
        return null;
      },
    }),
  ],
});