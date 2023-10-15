
import { INTERNALS } from "next/dist/server/web/spec-extension/request";
import { User, Question, CreateUserForm, AddQuestionForm } from "../../../models/types";
import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from 'next'

const baseURL = process.env.SERVER_URL;

export default withApiAuthRequired(async function handler(req : NextApiRequest, res: NextApiResponse) {
    try {
        const { accessToken } = await getAccessToken(req, res);
        const { user_id } = req.query;
        const response = await fetch(`${baseURL}/users/${user_id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        // return res.status(200).send(response);
        const userData = await response.json();
        res.status(200).json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
    // res.status(200).json(user);
});

// export const GET = withApiAuthRequired(async function GET(req) {
//   const res = new NextResponse();
//   const { accessToken } = await getAccessToken(req, res);
//   return NextResponse.json({ foo: 'bar' }, res);
// });
