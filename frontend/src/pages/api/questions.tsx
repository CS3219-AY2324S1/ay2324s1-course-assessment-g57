import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import { Question } from "../../models/types";
import { restoreTitle } from "@/lib/utils";

const baseURL = process.env.ENV == 'PROD' ? process.env.PROD_SERVER_BASE_URL : process.env.DEV_QUESTION_SERVICE_URL;

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.method);
  const { accessToken } = await getAccessToken(req, res);
  console.log(accessToken)
  var reqHeaders: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
  };
  var url = `${baseURL}/questions`;

  const response = await fetch(url, {
    headers: reqHeaders,
  });

  if (response.ok) {
    const questions = await response.json();
    questions.map((question: Question) => question.title = restoreTitle(question.title));
    res.status(200).json(questions);
  } else {
    res.status(response.status).json({ error: "Failed to fetch questions" });
  }
});