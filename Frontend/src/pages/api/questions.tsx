import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Question } from '../../models/types';
import { cleanTitle, restoreTitle } from '@/lib/utils';

const baseURL =
    process.env.ENV == 'PROD'
        ? process.env.PROD_SERVER_BASE_URL
        : process.env.DEV_QUESTION_SERVICE_URL;

export default withApiAuthRequired(async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log('Get Questions', req.method);
    const { accessToken } = await getAccessToken(req, res);
    const reqHeaders: Record<string, string> = {
        Authorization: `Bearer ${accessToken}`,
    };
    const url = `${baseURL}/questions`;

    if (req.method == 'POST') {
        const request = JSON.parse(req.body);
        reqHeaders['Content-Type'] = 'application/json';
        const response = await fetch(url, {
            method: 'POST',
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
            console.log('Question created successfully');
            const question = await response.json();
            // question.title = restoreTitle(question.title);
            res.status(200).json(question);
        } else {
            console.log('Failed to create question', response.status);
            res.status(response.status).json({
                error: 'Failed to create question',
            });
        }
    } else if (req.method == 'GET') {
        const response = await fetch(url, {
            headers: reqHeaders,
        });

        if (response.ok) {
            const questions = await response.json();
            questions.map(
                (question: Question) =>
                    (question.title = restoreTitle(question.title))
            );
            
            res.status(200).json(questions);
        } else {
            console.log('Failed to fetch questions', response.status);
            res.status(response.status).json({
                error: 'Failed to fetch questions',
            });
        }
    }
});
