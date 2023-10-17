import { handleAuth, handleLogin } from '@auth0/nextjs-auth0'

export default handleAuth({
  async login(req : any, res: any) {
    try {
      console.log("Hello world")
      console.log(process.env.AUTH0_SECRET)
      await handleLogin(req, res, {
        authorizationParams: {
          audience: 'user-service-api', // or AUTH0_AUDIENCE
          // Add the `offline_access` scope to also get a Refresh Token
          scope: 'openid profile email' // or AUTH0_SCOPE
        }
      });
    } catch (error: any) {
      res.status(error.status || 400).end(error.message);
    }
  }
});