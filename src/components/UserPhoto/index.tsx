import React from 'react';
import { Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import noneAvatar from '../../assets/avatar.png'

import { styles } from './styles';
import { COLORS } from '../../theme';

type PhotoProps = {
  imageUri: string | undefined;
  sizes?: 'SMALL' | 'NORMAL'
}

const SIZES = {
  SMALL: {
    containerSize: 32,
    avatarSize: 28
  },
  NORMAL: {
    containerSize: 48,
    avatarSize: 42
  }
}

const AVATAR_DEFAULT = Image.resolveAssetSource(noneAvatar).uri

export function UserPhoto({ imageUri, sizes = 'NORMAL' }: PhotoProps) {

  const { avatarSize, containerSize } = SIZES[sizes]

  return (
    <LinearGradient
      colors={[
        COLORS.PINK,
        COLORS.YELLOW
      ]}
      start={{ x: 0, y: 0.8 }}
      end={{ x: 0.9, y: 1 }}
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2
        }
      ]}
    >
      <Image
        source={{ uri: imageUri || AVATAR_DEFAULT }}
        style={[
          styles.avatar,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2
          }
        ]}
      />
    </LinearGradient>
  );
}