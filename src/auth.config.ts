import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnExpired = nextUrl.pathname.startsWith('/expired');

      if (isOnAdmin) {
        if (isLoggedIn) {
          return auth.user.role === 'admin_global';
        }
        return false;
      }

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // Validation of Trial
        const trialEndDate = auth.user.trial_ends_at ? new Date(auth.user.trial_ends_at) : null;
        const subscriptionStatus = auth.user.subscription_status;

        if (subscriptionStatus === 'TRIAL' && trialEndDate && trialEndDate < new Date()) {
          if (!isOnExpired) {
            return Response.redirect(new URL('/expired', nextUrl));
          }
          return true;
        }

        if (auth.user.role === 'admin_global') {
          return Response.redirect(new URL('/admin/dashboard', nextUrl));
        }
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as string;
      }
      if (token.office_id && session.user) {
        session.user.office_id = token.office_id as string;
      }
      if (token.subscription_status && session.user) {
        session.user.subscription_status = token.subscription_status as string;
      }
      if (token.trial_ends_at && session.user) {
        session.user.trial_ends_at = token.trial_ends_at as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.office_id = user.office_id;
        token.subscription_status = user.subscription_status;
        token.trial_ends_at = user.trial_ends_at;
      }
      return token;
    }
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
