import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ZodType } from 'zod';

// ✅ Generic response type
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
		verified: boolean;
		uniname: string;
		disname: string;
		avatar: string | null;
		banner: string | null;
		email: string;
	};
};

type Montax = {
	head: {
		name: string;
		env: 'sand' | 'demo' | 'main';
		id: string;
	};
};

// ✅ Core service dependencies — injected per request
export type Service = {
	db: PostgresJsDatabase;
	usr: Ventax;
	sys: Montax;
};

// ✅ Explicit access modes
export type Access = 'anonymous' | 'authorize' | 'authenticate';

// ✅ Extend FastifyReply with helpers for unified response
export type Respond = FastifyReply & {
	valid(on?: { message?: string; data?: any; code?: number }): XResponse;
	error(on?: { message?: string; data?: any; code?: number }): XResponse;
};

// ✅ Context (per-request execution bundle)
export type Context = {
	request: FastifyRequest;
	service: Service;
	respond: Respond;
};

// ✅ Main action signature
export type Action = (
	request: Context['request'],
	service: Context['service'],
	respond: Context['respond']
) => Promise<XResponse>;

export type Schema = {
	body?: ZodType;
	query?: ZodType;
	param?: ZodType;
};

// ✅ Route config
export type Route = {
	method: 'DELETE' | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'OPTIONS' | 'TRACE';
	access: Access;
	action: Action;
	slunid: string; // 6-character route ID (shortlink)
	schema?: Schema;
};

// ✅ Route group sets
export type Routes = {
	internal: Route[];
	external: Route[];
};
