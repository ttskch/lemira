import {Code, Tag} from '@chakra-ui/react'

const en = {
  pages: {
    index: {
      Head: {
        title: 'Lemira | Simple broadcast mailer',
        description:
          '"You can send broadcast email via your own SMTP server from Lemira.',
      },
      "You can send broadcast email via your own SMTP server from Lemira. Don't worry, we DO NOT store your credentials.":
        "You can send broadcast email via your own SMTP server from Lemira. Don't worry, we DO NOT store your credentials.",
      'SMTP Credentials': 'SMTP Credentials',
      Host: 'Host',
      Port: 'Port',
      User: 'User',
      Password: 'Password',
      'Email Content': 'Email Content',
      'Sender name': 'Sender name',
      'John Smith': 'John Smith',
      Subject: 'Subject',
      'Good news for you': 'Good news for you',
      'Can embed variables with %variable%': (
        <>
          Can embed variables with <Code>%variable%</Code>
        </>
      ),
      Body: 'Body',
      "Hi %name%,\n\nI'm excited to announce that...":
        "Hi %name%,\n\nI'm excited to announce that...",
      Recipients: 'Recipients',
      'Can enter multiple entries separated by line breaks.':
        'Can enter multiple entries separated by line breaks.',
      Variables: 'Variables',
      'Variable name': 'Variable name',
      'Values per recipients': 'Values per recipients',
      'Alice\nBob': 'Alice\nBob',
      'Enter the same number of recipients separated by line breaks.':
        'Enter the same number of recipients separated by line breaks.',
      Remove: 'Remove',
      Add: 'Add',
      Preview: 'Preview',
      validation: {
        required: 'This field is required.',
        email: "It's not a valid email.",
        integer: "It's not a integer number.",
        oneOfEmails: ({value}: {value: string}) =>
          `"${value}" is not a valid email.`,
        variableName: 'Cannot use "%" in variable name.',
        VariableNameDuplication: 'Variable names are duplicated.',
        valuesCount:
          "The number of values doesn't match the number of recipients.",
      },
    },
  },
  components: {
    molecules: {
      Head: {
        siteTitle: 'Lemira | Simple broadcast mailer',
      },
    },
    organisms: {
      Header: {
        'Simple broadcast mailer': 'Simple broadcast mailer',
      },
      PreviewModal: {
        Preview: 'Preview',
        To: 'To',
        Subject: 'Subject',
        Body: 'Body',
        'Send ? emails': (v: number) =>
          `Send ${v.toLocaleString()} email${v > 1 ? 's' : ''}`,
      },
      ProgressModal: {
        Sending: 'Sending',
      },
      ResultModal: {
        Result: 'Result',
        Recipient: 'Recipient',
        Status: 'Status',
        'Error details': 'Error details',
        Success: 'Success',
        Failed: 'Failed',
        'Copy to clipboard': 'Copy to clipboard',
        'Copied!': 'Copied!',
        'Please note that "Success" only means that the email was accepted by the SMTP server, and does not necessarily mean that the email has delivered to the recipient. Please check the SMTP server log and so on to see if the email actually delivered.':
          (
            <>
              Please note that{' '}
              <Tag color="green.500" size="sm" mr="0.1em">
                Success
              </Tag>
              only means that the email was accepted by the SMTP server, and
              does not necessarily mean that the email has delivered to the
              recipient. Please check the SMTP server log and so on to see if
              the email actually delivered.
            </>
          ),
      },
    },
  },
}

export default en
