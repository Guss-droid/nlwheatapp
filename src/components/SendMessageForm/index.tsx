import React, { useState } from 'react';
import { Alert, Keyboard, TextInput, View } from 'react-native';
import { api } from '../../services/api';
import { COLORS } from '../../theme';
import { Button } from '../Button';

import { styles } from './styles';

export function SendMessageForm() {

  const [message, setMessage] = useState('')
  const [sendMessage, setSendMessage] = useState(false)

  async function handleMessageForm() {
    const messageFormated = message.trim()

    if(messageFormated.length > 0){
      setSendMessage(true)

      await api.post('/message', {message: messageFormated})
      setMessage('');
      Keyboard.dismiss()

      setSendMessage(false)
    }else{
      Alert.alert('Escreva sua mensagem antes de enviar')
    }

  }

  return (
    <View style={styles.container}>

      <TextInput
        keyboardAppearance='dark'
        placeholder="Qual sua expectativa para o evento"
        placeholderTextColor={COLORS.GRAY_PRIMARY}
        multiline
        maxLength={140}
        onChangeText={setMessage}
        value={message}
        style={styles.input}
        editable={!sendMessage}
      />
      
      <Button
        title="ENVIAR MENSAGEM"
        backgroundColor={COLORS.PINK}
        color={COLORS.WHITE}
        isLoading={sendMessage}
        onPress={handleMessageForm}
      />


    </View>
  );
}