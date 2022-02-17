import React, { useState, useEffect } from 'react';
import './App.css';
import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';

import {
  Box,
  Button,
  CssBaseline,
  Divider,
  Link,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material';
import {
  ActionRequest,
  AudioActionResponse,
  ChatController,
  FileActionResponse,
  MuiChat,
} from 'chat-ui-react';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#007aff',
    },
  },
});

export function App(): React.ReactElement {
  const [chatCtl] = React.useState(
    new ChatController({
      showDateTime: true,
    }),
  );

  React.useMemo(() => {
    echo(chatCtl);
  }, [chatCtl]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box sx={{ height: '100%', backgroundColor: 'gray' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            maxWidth: '640px',
            marginLeft: 'auto',
            marginRight: 'auto',
            bgcolor: 'background.default',
          }}
        >
          <Typography sx={{ p: 1 }}>
            Welcome to{' '}
            <Link href="https://github.com/twihike/chat-ui-react">
              chat-ui-react
            </Link>{' '}
            demo site.
          </Typography>
          <Divider />
          <Box sx={{ flex: '1 1 0%', minHeight: 0 }}>
            <MuiChat chatController={chatCtl} />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

async function echo(chatCtl: ChatController): Promise<void> {
  await chatCtl.addMessage({
    type: 'text',
    content: `お名前を入力してください。`,
    self: false,
    avatar: '-',
  });
  const text = await chatCtl.setActionRequest({
    type: 'text',
    placeholder: 'Please enter something',
  });
  await chatCtl.addMessage({
    type: 'text',
    content: `${text.value}さん、こんにちは`,
    self: false,
    avatar: '-',
  });

  await chatCtl.addMessage({
    type: 'text',
    content: `理系・文系どちらですか？`,
    self: false,
    avatar: '-',
  });
  const sel = await chatCtl.setActionRequest({
    type: 'select',
    options: [
      {
        value: 'science',
        text: '理系',
      },
      {
        value: 'Humanities',
        text: '文系',
      },
      {
        value: 'other',
        text: 'Other',
      },
    ],
  });
  
  await chatCtl.addMessage({
    type: 'text',
    content: `全体の満足度は？`,
    self: false,
    avatar: '-',
  });
  const sel2 = await chatCtl.setActionRequest({
    type: 'select',
    options: [
      {
        value: 'very satisfied',
        text: '非常に満足',
      },
      {
        value: 'satisfied',
        text: 'やや満足',
      },
      {
        value: 'yes and no',
        text: 'どちらともいえない',
      },
      {
        value: 'dissatisfied',
        text: 'やや不満',
      },
      {
        value: 'very dissatisfied',
        text: '非常に不満',
      },
    ],
  });
  
    await chatCtl.addMessage({
    type: 'text',
    content: `説明はわかりやすかったですか？`,
    self: false,
    avatar: '-',
  });
  const sel3 = await chatCtl.setActionRequest({
    type: 'select',
    options: [
      {
        value: 'very easy to understand',
        text: '非常に分かりやすい',
      },
      {
        value: 'easy to understand',
        text: '分かりやすい',
      },
      {
        value: 'yes and no',
        text: 'どちらともいえない',
      },
      {
        value: 'difficult to understand',
        text: 'やや分かりづらい',
      },
      {
        value: 'very difficult to understand',
        text: '非常に分かりづらい',
      },
    ],
  });
  
  
    await chatCtl.addMessage({
    type: 'text',
    content: `インターンシップの難易度は？`,
    self: false,
    avatar: '-',
  });
  const selDifficulty = await chatCtl.setActionRequest({
    type: 'select',
    options: [
      {
        value: 'very easy',
        text: '非常に簡単',
      },
      {
        value: 'easy',
        text: '簡単',
      },
      {
        value: 'yes and no',
        text: 'どちらともいえない',
      },
      {
        value: 'difficult',
        text: '難しい',
      },
      {
        value: 'very difficult',
        text: '非常に難しい',
      },
    ],
  });


  await chatCtl.addMessage({
    type: 'text',
    content: `最も印象に残っているプログラムは?`,
    self: false,
    avatar: '-',
  });
  const mulSel = await chatCtl.setActionRequest({
    type: 'multi-select',
    options: [
      {
        value: 'toden',
        text: '東電紹介',
      },
      {
        value: 'example',
        text: '事例紹介',
      },
      {
        value: 'develop',
        text: 'アプリ開発',
      },
    ],
  });

  await chatCtl.addMessage({
    type: 'text',
    content: `完成品の画面キャプチャをアップロードしてください。`,
    self: false,
    avatar: '-',
  });
  const file = (await chatCtl.setActionRequest({
    type: 'file',
    accept: 'image/*',
    multiple: true,
  }));
  await chatCtl.addMessage({
    type: 'jsx',
    content: (
      <div>
        {file.files.map((f) => (
          <img
            key={file.files.indexOf(f)}
            src={window.URL.createObjectURL(f)}
            alt="File"
            style={{ width: '100%', height: 'auto' }}
          />
        ))}
      </div>
    ),
    self: false,
    avatar: '-',
  });
  
    await chatCtl.addMessage({
    type: 'text',
    content: `今回作成したプログラムの課題と改善点を記載したテキストファイルをアップロードして下さい。`,
    self: false,
    avatar: '-',
  });
  const file1 = (await chatCtl.setActionRequest({
    type: 'file',
    accept: 'image/*',
    multiple: true,
  }));
  await chatCtl.addMessage({
    type: 'jsx',
    content: (
      <div>
        {file1.files.map((f) => (
          <img
            key={file1.files.indexOf(f)}
            src={window.URL.createObjectURL(f)}
            alt="File"
            style={{ width: '100%', height: 'auto' }}
          />
        ))}
      </div>
    ),
    self: false,
    avatar: '-',
  });
  
  
    await chatCtl.addMessage({
    type: 'text',
    content: `最後にご意見がありましたらお聞かせください`,
    self: false,
    avatar: '-',
  });
  const text1 = await chatCtl.setActionRequest({
    type: 'text',
    placeholder: 'Please enter something',
  });


  // await chatCtl.addMessage({
  //   type: 'text',
  //   content: `Please enter your voice.`,
  //   self: false,
  //   avatar: '-',
  // });
  // const audio = (await chatCtl
  //   .setActionRequest({
  //     type: 'audio',
  //   })
  //   .catch(() => ({
  //     type: 'audio',
  //     value: 'Voice input failed.',
  //     avatar: '-',
  //   })));
  // await (audio.audio
  //   ? chatCtl.addMessage({
  //       type: 'jsx',
  //       content: (
  //         <a href={window.URL.createObjectURL(audio.audio)}>Audio downlaod</a>
  //       ),
  //       self: false,
  //       avatar: '-',
  //     })
  //   : chatCtl.addMessage({
  //       type: 'text',
  //       content: audio.value,
  //       self: false,
  //       avatar: '-',
  //     }));

  await chatCtl.addMessage({
    type: 'text',
    content: `送信ボタンを押してください`,
    self: false,
    avatar: '-',
  });
  const send = await chatCtl.setActionRequest({
    type: 'custom',
    Component: GoodInput,
  });
  

  echo(chatCtl);
}

function GoodInput({
  chatController,
  actionRequest,
}: {
  chatController: ChatController;
  actionRequest: ActionRequest;
}) {
  const chatCtl = chatController;

  const setResponse = React.useCallback((): void => {
    const res = { type: 'custom', value: '送信が完了しました。\nご協力ありがとうございました。' };
    chatCtl.setActionResponse(actionRequest, res);
  }, [actionRequest, chatCtl]);

  return (<div>
      <Button
        type="button"
        onClick={setResponse}
        variant="contained"
        color="primary"
      >
        送信
      </Button>
    </div>);
}
export default withAuthenticator(App);
