import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ZodType } from 'zod';
export type XResponse<T = unknown> = {
    success: boolean;
    message: string;
    code: number;
    data: T;
};
type Account = {
    scope: {
        agent: {
            kind: 'soletor' | 'operator' | 'member';
            oac: string;
        };
        anode: {
            kind: 'individual' | 'organization' | 'community';
            oac: string;
        };
    };
    domain: {
        verified: boolean;
        uniname: string;
        disname: string;
        avatar: string | null;
        banner: string | null;
        email: string;
    };
};
type Norsect = {
    head: {
        name: string;
        env: 'sand' | 'demo' | 'main';
        id: string;
    };
};
export type Service = {
    db: PostgresJsDatabase;
    auth: Account;
    sect: Norsect;
};
export type Access = 'anonymous' | 'authorize' | 'authenticate';
export type Respond = FastifyReply & {
    valid(on?: {
        message?: string;
        data?: any;
        code?: number;
    }): XResponse;
    error(on?: {
        message?: string;
        data?: any;
        code?: number;
    }): XResponse;
};
export type Context = {
    request: FastifyRequest;
    service: Service;
    respond: Respond;
};
export type Action = (request: Context['request'], service: Context['service'], respond: Context['respond']) => Promise<XResponse>;
export type Schema = {
    body?: ZodType;
    query?: ZodType;
    param?: ZodType;
};
export type Route = {
    method: 'DELETE' | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'OPTIONS' | 'TRACE';
    access: Access;
    action: Action;
    slunid: string;
    schema?: Schema;
};
export type Routes = {
    internal: Route[];
    external: Route[];
};
export {};
//# sourceMappingURL=types.d.ts.map