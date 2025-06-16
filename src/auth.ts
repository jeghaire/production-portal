import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './lib/auth.config';
import { z } from 'zod';
import bcrypt from 'bcrypt';
// import postgres from 'postgres';
 
// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

// Hardcoded user for testing
const user: User = {
  id: '1',
  name: 'Mavi',
  email: 'admin@heosl.com',
  password: '$2b$10$JDnne2Qd/ezPJvR3YpDrEu66ZArg1k9Felw5KO.dqEfDE2/dTAH1e', // 123456
};
 
async function getUser(email: string): Promise<User | undefined> {
  if (email === user.email) {
    return user;
  }
  return undefined;

  // try {
  //   const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
  //   return user[0];
  // } catch (error) {
  //   console.error('Failed to fetch user:', error);
  //   throw new Error('Failed to fetch user.');
  // }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
          // const debugHash = await bcrypt.hash('admin', 10);
          // console.log(debugHash);
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }
     
        return null;
      },
    }),
  ],
});