import {Code, Tag} from '@chakra-ui/react'

const ja = {
  pages: {
    index: {
      Head: {
        title: 'Lemira | シンプルかつ柔軟な一括メール送信ツール',
        description:
          '"Lemira（レミラ）は、あなたのSMTPサーバーを使って一括メールを送信するためのツールです。',
      },
      "You can send broadcast email via your own SMTP server from Lemira. Don't worry, we DO NOT store your credentials.":
        'Lemira（レミラ）は、あなたのSMTPサーバーを使って一括メールを送信するためのツールです。SMTP情報は送信時に使用するのみで一切保存していません。',
      'SMTP Credentials': '送信に使用するSMTP情報',
      Host: 'ホスト名',
      Port: 'ポート番号',
      User: 'ユーザー名',
      Password: 'パスワード',
      'Email Content': 'メールの内容',
      'Sender name': '差出人名',
      'John Smith': '山田 太郎',
      Subject: '件名',
      'Good news for you': '◯◯の件について',
      'Can embed variables with %variable%': (
        <>
          ※<Code>%変数名%</Code> で変数を埋め込むことができます。
        </>
      ),
      Body: '本文',
      "Hi %name%,\n\nI'm excited to announce that...":
        '%name% 様\n\nこんにちは。',
      Recipients: '宛先',
      'Can enter multiple entries separated by line breaks.':
        '※改行区切りで複数入力できます。',
      Variables: '埋め込み変数',
      'Variable name': '変数名',
      'Values per recipients': '宛先ごとの値',
      'Alice\nBob': 'アリス\nボブ',
      'Enter the same number of recipients separated by line breaks.':
        '※改行区切りで宛先と同じ数だけ入力してください。',
      Remove: '削除',
      Add: '追加',
      Preview: 'プレビュー',
      validation: {
        required: 'この項目は必須です。',
        email: 'メールアドレスが正しくありません。',
        integer: '整数を入力してください。',
        oneOfEmails: ({value}: {value: string}) =>
          `"${value}" は正しいメールアドレスではありません。`,
        variableName: '変数名に "%" を使うことはできません。',
        VariableNameDuplication: '変数名が重複しています。',
        valuesCount: '値の数が宛先の数と一致していません。',
      },
    },
  },
  components: {
    molecules: {
      Head: {
        siteTitle: 'Lemira | シンプルかつ柔軟な一括メール送信ツール',
      },
    },
    organisms: {
      Header: {
        'Simple broadcast mailer': 'シンプルかつ柔軟な一括メール送信ツール',
      },
      PreviewModal: {
        Preview: 'プレビュー',
        To: '宛先',
        Subject: '件名',
        Body: '本文',
        'Send ? emails': (v: number) => `${v}通のメールを送信`,
      },
      ProgressModal: {
        Sending: '送信中',
      },
      ResultModal: {
        Result: '送信結果',
        Recipient: '宛先',
        Status: '結果',
        'Error details': 'エラー詳細',
        Success: '成功',
        Failed: '失敗',
        'Copy to clipboard': 'クリップボードにコピー',
        'Copied!': 'クリップボードにコピーしました。',
        'Please note that "Success" only means that the email was accepted by the SMTP server, and does not necessarily mean that the email has delivered to the recipient. Please check the SMTP server log and so on to see if the email actually delivered.':
          (
            <>
              <Tag color="green.500" size="sm" mr="0.1em">
                成功
              </Tag>
              はあくまでSMTPサーバーにAcceptされたという意味であり、宛先にメールが到達したとは限りませんのでご注意ください。実際にメールが到達したかどうかはSMTPサーバーのログなどでご確認ください。
            </>
          ),
      },
    },
  },
}

export default ja
