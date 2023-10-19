import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";

const baseURL = process.env.SERVER_URL;

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log(req.method);
    var { user_id } = req.query;
    const regex = /\|/; // regex to check for pipe character
    user_id = (user_id as string).replace(regex, "_") // clean user ID
    const { accessToken } = await getAccessToken(req, res);
    var reqHeaders: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
    };
    var url = `${baseURL}/users/${user_id}`;

    if (req.method === "GET") {
      const response = await fetch(url, {
        headers: reqHeaders,
      });
      if (response.ok) {
        const userData = await response.json();
        res.status(200).json(userData);
      } else if (response.status === 404) {
        // If the user is not found, return a 404 Not Found response
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(response.status).json({ error: 'Failed to fetch user data' });
      }
    } else if (req.method === "PUT") {
      reqHeaders['Content-Type'] = 'application/json';
      const response = await fetch(url, {
        method: 'PUT',
        headers: reqHeaders,
        body: JSON.stringify(req.body)
      });
      if (response.ok) {
        res.status(200).json({ message: `PUT user with ID ${user_id}` });
      } else if (response.status === 404) {
        // If the user is not found, return a 404 Not Found response
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(response.status).json({ error: 'Failed to update user data' });
      }
    } else if (req.method === "DELETE") {
      res.status(204).end();
    } else {
      res.status(405).end(); // Method Not Allowed for other HTTP methods
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});
