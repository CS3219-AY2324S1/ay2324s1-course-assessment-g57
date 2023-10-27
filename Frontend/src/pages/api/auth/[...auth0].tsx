import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export default handleAuth({
    async login(req: any, res: any) {
        try {
            await handleLogin(req, res, {
                authorizationParams: {
                    audience: 'user-service-api',
                    scope: 'openid profile email',
                },
            });
        } catch (error: any) {
            res.status(error.status || 400).end(error.message);
        }
    },
});
