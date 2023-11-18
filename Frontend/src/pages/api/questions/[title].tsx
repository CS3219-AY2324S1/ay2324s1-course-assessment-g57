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
    console.log('url', url);

    if (req.method === 'GET') {
        const response = await fetch(url, {
            headers: reqHeaders,
        });
        if (response.ok) {
            const question = await response.json();
            question.title = restoreTitle(question.title);
            console.log('Question fetched successfully');
            res.status(200).json(question);
        } else if (response.status === 404) {
            // If the user is not found, return a 404 Not Found response
            console.log('Question not found');
            res.status(404).json({ error: 'Question not found' });
        } else {
            console.log('Failed to fetch question data');
            res.status(response.status).json({
                error: 'Failed to fetch question data',
            });
        }
    } else if (req.method === 'PUT') {
        const request = req.body;
        reqHeaders['Content-Type'] = 'application/json';
        const response = await fetch(url, {
            method: 'PUT',
            headers: reqHeaders,
            body: JSON.stringify({
                title: cleanTitle(request.title),
                categories: request.categories,
                complexity: request.complexity,
                description: request.description,
                link: request.link,
            }),
        });
        if (response.ok) {
            console.log('Question updated successfully');
            res.status(200).json({
                message: `PUT question with title ${restoreTitle(title)}`,
            });
        } else if (response.status === 404) {
            console.log('Question not found');
            res.status(404).json({ error: 'Question not found' });
        } else {
            console.log('Failed to update question data');
            res.status(response.status).json({
                error: 'Failed to update question data',
            });
        }
    } else if (req.method === 'DELETE') {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: reqHeaders,
        });
        if (response.ok) {
            console.log(`Question ${title} deleted successfully`);
            res.status(200).json({ message: 'Question deleted' });
        } else {
            res.status(response.status).json({
                error: 'Failed to delete question',
            });
        }
    } else {
        res.status(405).end(); // Method Not Allowed for other HTTP methods
    }
});
