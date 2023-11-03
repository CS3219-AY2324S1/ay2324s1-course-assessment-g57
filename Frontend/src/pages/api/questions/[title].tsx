import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';
import { cleanTitle, restoreTitle } from '@/lib/utils';

const baseURL = process.env.PROD_SERVER_BASE_URL;

export default withApiAuthRequired(async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log('QuestionsByTitle', req.method);

    let { title } = req.query;
    title = cleanTitle(title as string);
    const { accessToken } = await getAccessToken(req, res);
    const reqHeaders: Record<string, string> = {
        Authorization: `Bearer ${accessToken}`,
    };
    const url = `${baseURL}/questions/${title}`;

    if (req.method === 'PUT') {
        reqHeaders['Content-Type'] = 'application/json';
        const response = await fetch(url, {
            method: 'PUT',
            headers: reqHeaders,
            body: req.body,
        });
        if (response.ok) {
            res.status(200).json({
                message: `PUT question with title ${restoreTitle(title)}`,
            });
        } else if (response.status === 404) {
            res.status(404).json({ error: 'Question not found' });
        } else {
            res.status(response.status).json({
                error: 'Failed to update question data',
            });
        }
    } else if (req.method === 'DELETE') {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: reqHeaders,
            body: req.body,
        });
        if (response.ok) {
            res.status(204).end();
        } else {
            res.status(response.status).json({
                error: 'Failed to delete question',
            });
        }
    } else {
        res.status(405).end(); // Method Not Allowed for other HTTP methods
    }
});
