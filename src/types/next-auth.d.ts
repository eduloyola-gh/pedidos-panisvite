import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
            phone?: string;
            address?: string;
        };
    }

    interface User {
        id: string;
        email: string;
        name: string;
        role: string;
        phone?: string;
        address?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: string;
        id: string;
        phone?: string;
        address?: string;
    }
}
