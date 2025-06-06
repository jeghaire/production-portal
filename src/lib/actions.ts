'use server';
 
import webpush from 'web-push'

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { signIn, signOut } from '../auth';
import { AuthError } from 'next-auth';

 
webpush.setVapidDetails(
  'mailto:snaxxen@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)
 
import type { PushSubscription as WebPushSubscription } from 'web-push';

let subscription: WebPushSubscription | null = null

export async function subscribeUser(sub: WebPushSubscription) {
  subscription = sub
  // In a production environment, you would want to store the subscription in a database
  // For example: await db.subscriptions.create({ data: sub })
  return { success: true }
}
 
export async function unsubscribeUser() {
  subscription = null
  // In a production environment, you would want to remove the subscription from the database
  // For example: await db.subscriptions.delete({ where: { ... } })
  return { success: true }
}
 
export async function sendNotification(message: string) {
  if (!subscription) {
    throw new Error('No subscription available')
  }
 
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Test Notification',
        body: message,
        icon: '/icon1.png',
      })
    )
    return { success: true }
  } catch (error) {
    console.error('Error sending push notification:', error)
    return { success: false, error: 'Failed to send notification' }
  }
}
 
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