/** @type {import('next').NextConfig} */
 const nextConfig = { 
  reactStrictMode: true,
    // Can be safely removed in newer versions of Next.js
  // future: {

    // by default, if you customize webpack config, they switch back to version 4.
    // Looks like backward compatibility approach.
  //   webpack5: true,   
  // },

  webpack(config) {
    config.resolve.fallback = {

      // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped.
      ...config.resolve.fallback,  

      fs: false, // the solution
    };
    
    return config;
  },
  env: {
    AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
    AUTH0_SECRET: process.env.AUTH0_SECRET,
    SERVER_URL: process.env.SERVER_URL
  }
}

module.exports = nextConfig
