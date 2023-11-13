import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';

const baseURL = process.env.PROD_SERVER_BASE_URL || 'http://localhost:3001';

export default withApiAuthRequired(async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        console.log('UserById', req.method);

        let { userId } = req.query;
        const regex = /\|/; // regex to check for pipe character
        userId = (userId as string).replace(regex, '_'); // clean user ID
        const { accessToken } = await getAccessToken(req, res);

        const reqHeaders: Record<string, string> = {
            Authorization: `Bearer ${accessToken}`,
        };
        const url = `${baseURL}/users/${userId}`;
        console.log('URL', url);
        console.log('body', req.body);

        if (req.method === 'GET') {
            const response = await fetch(url, {
                headers: reqHeaders,
            });
            if (response.ok) {
                const userData = await response.json();
                console.log('User fetched successfully');
                res.status(200).json(userData);
            } else if (response.status === 404) {
                // If the user is not found, return a 404 Not Found response
                console.log('User not found');
                res.status(404).json({ error: 'User not found' });
            } else {
                console.log('Failed to fetch user data');
                res.status(response.status).json({
                    error: 'Failed to fetch user data',
                });
            }
        } else if (req.method === 'PUT') {
            reqHeaders['Content-Type'] = 'application/json';
            const response = await fetch(url, {
                method: 'PUT',
                headers: reqHeaders,
                body: JSON.stringify(req.body),
            });
            if (response.ok) {
                console.log('User updated successfully');
                res.status(200).json({ message: `PUT user with ID ${userId}` });
            } else if (response.status === 404) {
                // If the user is not found, return a 404 Not Found response
                console.log('User not found');
                res.status(404).json({ error: 'User not found' });
            } else {
                console.log('Failed to update user data');
                console.log(response);
                res.status(response.status).json({
                    error: 'Failed to update user data',
                });
            }
        } else if (req.method === 'DELETE') {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: reqHeaders,
            });
            if (response.ok) {
                console.log('User deleted successfully');
                res.status(200).json({
                    message: `DELETE user with ID ${userId}`,
                });
            } else if (response.status === 404) {
                // If the user is not found, return a 404 Not Found response
                console.log('User not found');
                res.status(404).json({ error: 'User not found' });
            } else {
                console.log('Failed to delete user');
                res.status(response.status).json({
                    error: 'Failed to delete user',
                });
            }
        } else {
            res.status(405).end(); // Method Not Allowed for other HTTP methods
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});
