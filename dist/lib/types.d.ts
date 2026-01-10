import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ZodType } from 'zod';
export type XResponse<T = unknown> = {
    success: boolean;
    message: string;
    code: number;
    data: T;
};
type Ventax = {
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
        oac: string;
        verified: boolean;
        uniname: string;
        disname: string;
        avatar: string | null;
        banner: string | null;
        email: string;
        exton: string;
    };
};
type Montax = {
    head: {
        name: string;
        env: 'sand' | 'demo' | 'main';
        id: string;
    };
};
export type Service = {
    db: PostgresJsDatabase;
    usr: Ventax;
    sys: Montax;
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
    param?: ZodType<any, any, any>;
    query?: ZodType<any, any, any>;
    body?: ZodType<any, any, any>;
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