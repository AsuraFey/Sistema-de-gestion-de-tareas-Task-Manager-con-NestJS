import * as process from "process";

export default () => ({
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    // database: {
    //     connection: DATABASE_URL
    // }
})