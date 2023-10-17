import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";

const baseURL = process.env.SERVER_URL;

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log(req.method);
    const { user_id } = req.query;
    const { accessToken } = await getAccessToken(req, res);
    var reqHeaders: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
    };
    var url = `${baseURL}/users/${user_id}`;

    if (req.method === "GET") {
      // Handle GET request to fetch user data by ID
      // Use user_id to fetch the user data from your database
      const response = await fetch(url, {
        headers: reqHeaders,
      });
      // return res.status(200).send(response);
      const userData = await response.json();
      res.status(200).json(userData);
    } else if (req.method === "PUT") {
      // Handle PUT request to update user data by ID
      // Use user_id and request body to update user data in your database
      reqHeaders['Content-Type'] = 'application/json';
      const response = await fetch(url, {
        method: 'PUT',
        headers: reqHeaders,
        body: JSON.stringify(req.body)
      });

      res.status(200).json({ message: `PUT user with ID ${user_id}` });
    } else if (req.method === "DELETE") {
      // Handle DELETE request to delete user data by ID
      // Use user_id to delete the user data from your database
      res.status(204).end();
    } else {
      res.status(405).end(); // Method Not Allowed for other HTTP methods
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});
