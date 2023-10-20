declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SIGNALING_SERVER:'ws://0.tcp.ap.ngrok.io:19793'
        }
    }
}

export {}