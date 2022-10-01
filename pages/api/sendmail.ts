import type {NextApiRequest, NextApiResponse} from 'next'
import {createTransport} from 'nodemailer'

type Data = {
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const {host, port, user, pass, from, replyTo, to, subject, text} = req.body

  const transport = createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  })

  try {
    const {accepted} = await transport.sendMail({
      from,
      replyTo: replyTo ?? undefined,
      to,
      subject,
      text,
    })
    res.status(accepted ? 200 : 500).json({})
  } catch (error) {
    res.status(500).json({error: String(error)})
  }
}
