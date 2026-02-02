import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            role: string;
            office_id?: string | null;
            subscription_status?: string | null;
            trial_ends_at?: string | null;
        } & DefaultSession["user"];
    }

    interface User {
        role: string;
        office_id?: string | null;
        subscription_status?: string | null;
        trial_ends_at?: string | null;
    }
}

declare module '@auth/core/jwt' {
    interface JWT {
        role: string;
        office_id?: string | null;
        subscription_status?: string | null;
        trial_ends_at?: string | null;
    }
}
