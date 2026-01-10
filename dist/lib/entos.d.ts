import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Context, Routes } from './types.js';
import postgres from 'postgres';
export declare const db: import("drizzle-orm/postgres-js").PostgresJsDatabase<Record<string, never>> & {
    $client: postgres.Sql<{}>;
};
export declare const web: {
    set(req: FastifyRequest, res: FastifyReply): Context;
};
export declare function register(app: FastifyInstance, routes: Routes['internal'] | Routes['external']): void;
//# sourceMappingURL=entos.d.ts.map