export type Variable = {
  name: string
  values: string[]
}

export type Envelope = {
  smtp: {
    host: string
    port: number
    user: string
    password: string
  }
  from: string
  fromName?: string
  replyTo?: string
  subject: string
  body: string
  recipients: string[]
  variables: Variable[]
}

export type Result = {
  to: string
  success: boolean
  error?: string
}

export const applyVariables = (
  text: string,
  variables: Variable[],
  index: number,
) => {
  variables.forEach((variable) => {
    text = text.replaceAll(`%${variable.name}%`, variable.values[index])
  })

  return text
}
