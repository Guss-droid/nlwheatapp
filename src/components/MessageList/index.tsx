import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { api } from '../../services/api';
import { io } from 'socket.io-client'

import { Message, MessageProps } from '../Message';

import { styles } from './styles';

let messageQueu: MessageProps[] = []

const socket = io(String(api.defaults.baseURL))
socket.on('new_message', (newMessage) => {
  messageQueu.push(newMessage)
})

export function MessageList() {

  const [currentMessages, setCurrentMessages] = useState<MessageProps[]>([])

  useEffect(() => {
    async function fetchMessages() {
      const messagesResponse = await api.get<MessageProps[]>('/message/last')
      setCurrentMessages(messagesResponse.data)
    }

    fetchMessages()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      if(messageQueu.length > 0) {
        setCurrentMessages(prevState => [
          messageQueu[0],
          prevState[0],
          prevState[1]
        ])
        messageQueu.shift()
      }
    }, 3000)

  }, [])

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="never"
    >
      {currentMessages.map(message => (
        <Message
          key={message.id}
          data={message}
        />
      ))}

    </ScrollView>
  );
}