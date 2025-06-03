'use server';
 
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { signIn, signOut } from '../auth';
import { AuthError } from 'next-auth';
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
     if (error instanceof AuthError) {
      switch (error.type) { 
        case 'CredentialsSignin':
          return 'Invalid email or password.';
        case 'CallbackRouteError':
          return 'Account not found or not verified.';
        case 'AccessDenied':
          return 'Your account exists but needs approval.';
        default:
          return 'Login failed. Please try again.';
      }
    }
    
    if (isRedirectError(error)) {
        throw error;
    }
    
    return 'An unexpected error occurred. Please try again later.';
  }
}

export async function logOut(){ 
  await signOut({ redirectTo: '/login' });
}