import React, { useState, useCallback, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { CurrentSprites, Sprites } from '../../../utils/types';
import { ChangeSpriteColorButton } from '../ChangeSpriteColorButton';
import { SkeletonContent } from '../../Skeleton/SkeletonContent';

import Colors from '../../../styles/colors';
import {
  Container,
  HeaderButtons,
  SpriteColorSection,
  SpriteGenderSection,
  ChangeSpriteGenderButton,
  PokemonAvatarContainer,
  GradientBackground,
  PokeImage,
} from './styles';
import { Skeleton } from '../../Skeleton';

type SpriteSectionProps = {
  data: {
    gradientColors: [
      string,
      string,
    ];
    sprites: Sprites;
    typeColor: string;
    is_unique_gender: boolean;
  }
}

type ColorType = 'normal' | 'shiny';

type Gender = 'male' | 'female';

export function SpriteSection({ data }: SpriteSectionProps) {
  const [ colorSprite, setColorSprite ] = useState<ColorType>('normal');
  const [ genderSprite, setGenderSprite ] = useState<Gender>('male');
  const [ currentSprites, setCurrentSprites ] = useState<null | CurrentSprites>(null); 

  const handleToggleColorSprite = useCallback((string: ColorType) => {
    setColorSprite(string);
  }, []);

  const handleToggleGenderSprite = useCallback((string: Gender) => {
    setGenderSprite(string);
  }, []);

  useEffect(() => {
    const {
      back_default,
      back_female,
      back_shiny,
      back_shiny_female,
      front_default,
      front_female,
      front_shiny,
      front_shiny_female,
    } = data.sprites;

    const sprites = {
      normal: {
        female: {
          front: front_female,
          back: back_female || back_default,
        },
        male: {
          front: front_default,
          back: back_default,
        }
      },
      shiny: {
        female: {
          front: front_shiny_female,
          back: back_shiny_female || back_shiny,
        },
        male: {
          front: front_shiny,
          back: back_shiny
        }
      }
    } as CurrentSprites;
    
    setCurrentSprites(sprites);

    setColorSprite('normal');
    setGenderSprite('male');
  }, [data]);

  if (!currentSprites) {
    return (
      <Skeleton paddingX={12}>
        <SkeletonContent 
          bgColor={Colors.background[3]} 
          indicatorColor={Colors.background[1]} 
          w="100%"
          h="188px"
        />
      </Skeleton>
    )
  }

  return (
    <Container>
      <HeaderButtons typeColor={data.typeColor}>
        <SpriteColorSection>
          <ChangeSpriteColorButton 
            disabled={!currentSprites.shiny.male.front}
            handleToggleSprite={() => handleToggleColorSprite('normal')}
            isSelected={colorSprite === 'normal'}
            title="Normal"
          />
          <ChangeSpriteColorButton 
            disabled={!currentSprites.shiny.male.front}
            handleToggleSprite={() => handleToggleColorSprite('shiny')}
            isSelected={colorSprite === 'shiny'}
            title="Shiny"
          />
        </SpriteColorSection>

        <SpriteGenderSection>
          <ChangeSpriteGenderButton 
            disabled={!currentSprites.normal.female.front}
            onPress={() => handleToggleGenderSprite('male')}
          >
            { genderSprite === 'male' && !data.is_unique_gender ? (
              <Ionicons  name="male" size={26} color={"#438FE6"}/>
            ) : (
              <Ionicons  name="male" size={28} color={Colors.background[1]}/>
            )}
          </ChangeSpriteGenderButton>
          <ChangeSpriteGenderButton 
            disabled={!currentSprites.normal.female.front}
            onPress={() => handleToggleGenderSprite('female')}
          >
            { genderSprite === 'female' ? (
              <Ionicons  name="female" size={26} color={"#DB736E"}/>
            ) : (
              <Ionicons  name="female" size={28} color={Colors.background[1]}/>
            )}
          </ChangeSpriteGenderButton>
        </SpriteGenderSection>
      </HeaderButtons>

      <PokemonAvatarContainer>
        <GradientBackground
          colors={[ data.typeColor, Colors.background[3]]}
        />
        <PokeImage 
          resizeMode='cover'
          source={{ uri: currentSprites[colorSprite][genderSprite].front || '' }}
        />
        <PokeImage 
          resizeMode='cover'
          source={{ uri: currentSprites[colorSprite][genderSprite].back || '' }}
        />
      </PokemonAvatarContainer>
    </Container>
  )
}