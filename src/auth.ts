import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './lib/auth.config';
import { z } from 'zod';
import { User } from './lib/definitions';
 
async function getUser(email: string, password:string): Promise<User | undefined> {
   const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/logina?publickey=${process.env.NEXT_PUBLIC_API_KEY}&username=${encodeURIComponent(email)}&pwd=${encodeURIComponent(password)}`;

   try {
    const res = await fetch(apiUrl, { method: "GET" });
    const result = await res.json();
    if (result.status === "Success" && result.code === "0") {
    return {
      id: email,
      name: email,
      email: email,
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
          console.log(user)
          if (!user) return null;
          return user
        }
     
        return null;
      },
    }),
  ],
});