import React, {useEffect, useState} from 'react';
import {Image, Pressable, StyleSheet} from 'react-native';
import Colors from '../assets/colors/Colors';
import {userImg} from '../types/AppInterfaceTypes';
import {getResponsiveSize, responsiveFontSize} from '../utils';
import {useSelector} from 'react-redux';
import {s3Bucket} from '../../env';
import {IMAGES} from '../theme/assets';

export const UserImg: React.FC<userImg> = ({
  imageContainer,
  imageStyle,
  imageSource = undefined,
  skeletonStyle,
  onPressImg = () => {
    {
    }
  },
}) => {
  const [imageLoad, setImageLoad] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);

  const reduxData = useSelector((state: any) => state?.data?.loginData);
  let userData: any;

  //checking if the redux data is in string or not
  if (typeof reduxData === 'string') {
    userData = JSON.parse(reduxData);
    if (!imageSource) {
      imageSource = s3Bucket + userData?.user?.s3Images[0];
    }
  } else {
    userData = reduxData;
    if (!imageSource) {
      imageSource = s3Bucket + userData?.user?.s3Images[0];
    }
  }
  useEffect(() => {
    setLoadError(false);
  }, [imageSource]);
  // console.log('imageSource: ', imageSource);

  //functionality under process for Skeleton holder
  const handleImageLoadEnd = () => {
    setImageLoad(true);
  };
  if (imageSource && !loadError) {
    return (
      <Pressable
        onPress={onPressImg}
        style={[styles.imgContainer, imageContainer]}>
        <Image
          source={{uri: imageSource}}
          onError={() => {
            setLoadError(true);
          }}
          onLoad={() => {
            setImageLoad(false);
          }}
          onLoadEnd={handleImageLoadEnd}
          resizeMode="contain"
          style={[styles.imgStyle, imageStyle]}
        />
      </Pressable>
    );
  } else {
    return (
      <Pressable
        onPress={onPressImg}
        style={[styles.imgContainer, imageContainer]}>
        <Image
          source={IMAGES.dummyImg}
          resizeMode="contain"
          style={[styles.imgStyle, imageStyle]}
        />
      </Pressable>
    );
  }

  //-----functionality under process for Skeleton holder

  // if (!imageLoad) {
  //     return (
  //         <View>
  //             <CustomSkeletonHolder
  //                 borderRadius={responsiveFontSize(50)}
  //                 placeHolserStyle={skeletonStyle}
  //             />
  //         </View>
  //     )
  // }
};

const styles = StyleSheet.create({
  imgContainer: {
    height: getResponsiveSize(8).height,
    width: getResponsiveSize(16).width,
    borderRadius: responsiveFontSize(50),
  },
  imgStyle: {
    width: '100%',
    height: '100%',
    borderRadius: responsiveFontSize(50),
    borderWidth: responsiveFontSize(2),
    borderColor: Colors.lightPrimaryColor,
  },
});
