import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "GET") {
    res.status(405).json({
      message: "Only GET requests are supported",
    })
    return
  }

  res.status(400).json({
    message: "Missing or invalid search term",
  })
}
