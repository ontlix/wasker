import { ZodError } from 'zod';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
if (!process.env.ONDES_URL)
    throw new Error('ONDES_URL is not set');
const client = postgres(process.env.ONDES_URL);
export const db = drizzle(client, {
    casing: 'snake_case'
});
export const web = {
    set(req, res) {
        const header = {
            ventax: req.headers['x-ventax'],
            montax: req.headers['x-montax']
        };
        const service = {
            db,
            usr: JSON.parse(Buffer.from(header.ventax, 'base64').toString('utf-8')),
            sys: JSON.parse(Buffer.from(header.montax, 'base64').toString('utf-8'))
        };
        const respond = {
            ...res,
            error(on) {
                return {
                    success: false,
                    message: on?.message || 'error',
                    code: on?.code || 500,
                    data: on?.data || null
                };
            },
            valid(on) {
                return {
                    success: true,
                    message: on?.message || 'valid',
                    code: on?.code || 200,
                    data: on?.data || null
                };
            }
        };
        return { request: req, service, respond };
    }
};
export function register(app, routes) {
    for (const route of routes) {
        app.route({
            method: route.method,
            url: route.slunid,
            handler: async (req, res) => {
                try {
                    // -----------------------------
                    // 1. Validate Request Data
                    // -----------------------------
                    if (route.schema?.param)
                        req.params = route.schema.param.parse(req.params);
                    if (route.schema?.query)
                        req.query = route.schema.query.parse(req.query);
                    if (route.schema?.body)
                        req.body = route.schema.body.parse(req.body);
                    // -----------------------------
                    // 2. Build Context
                    // -----------------------------
                    const { request, service, respond } = web.set(req, res);
                    // -----------------------------
                    // 3. Execute Action
                    // -----------------------------
                    const result = await route.action(request, service, respond);
                    return res.code(result.code).send(result);
                }
                catch (err) {
                    // -----------------------------
                    // 4. Handle Errors Gracefully
                    // -----------------------------
                    if (err instanceof ZodError) {
                        return res.code(400).send({
                            success: false,
                            message: 'Validation failed',
                            code: 400,
                            data: err.issues.map((issue) => ({
                                path: issue.path.join('.'),
                                code: issue.code,
                                message: issue.message,
                                expected: issue.expected,
                                received: issue.received
                            }))
                        });
                    }
                    // -----------------------------
                    // 5. Fallback error (non-Zod)
                    // -----------------------------
                    return res.code(400).send({
                        success: false,
                        message: err instanceof Error ? err.message : 'Invalid request',
                        code: 400,
                        data: null
                    });
                }
            }
        });
    }
}
