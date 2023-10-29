import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';

const baseURL =
    process.env.ENV == 'PROD'
        ? process.env.PROD_SERVER_BASE_URL
        : process.env.DEV_QUESTION_SERVICE_URL;

export default withApiAuthRequired(async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log('Get Users', req.method);
    const { accessToken } = await getAccessToken(req, res);
    const reqHeaders: Record<string, string> = {
        Authorization: `Bearer ${accessToken}`,
    };
    const url = `${baseURL}/users`;

    if (req.method == 'POST') {
        const request = JSON.parse(req.body);
        reqHeaders['Content-Type'] = 'application/json';
        const response = await fetch(url, {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify({
                user: request.userid,
                username: request.username,
                email: request.email,
            }),
        });

        if (response.ok) {
            console.log('User created successfully');
            const user = await response.json();
            // question.title = restoreTitle(question.title);
            res.status(200).json(user);
        } else {
            console.log('Failed to create user', response.status);
            res.status(response.status).json({
                error: 'Failed to create user',
            });
        }
    } else if (req.method == 'GET') {
        const response = await fetch(url, {
            headers: reqHeaders,
        });

        if (response.ok) {
            const users = await response.json();
            users.map((user: any) => (user.userid = user.user_id));
            res.status(200).json(users);
        } else {
            console.log('Failed to fetch users', response.status);
            res.status(response.status).json({
                error: 'Failed to fetch users',
            });
        }
    }
});
