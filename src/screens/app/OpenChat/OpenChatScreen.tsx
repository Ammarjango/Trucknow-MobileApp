import {
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  TextInput,
  Linking,
  ToastAndroid,
  Platform,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Bubble, GiftedChat, Time} from 'react-native-gifted-chat';
import Colors from '../../../assets/colors/Colors';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {getResponsiveSize, responsiveFontSize} from '../../../utils';
import FONTS from '../../../assets/fonts/FONTS';
import {err, SvgXml} from 'react-native-svg';
import {SVG} from '../../../theme/assets';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MediumText, SmallText} from '../../../components/text';
import {UserImg} from '../../../components/userImg';
import {useDispatch, useSelector} from 'react-redux';
import {io} from 'socket.io-client';
import {ShowMessage} from '../../../utils/ShowMessage';
import {Socket_URL} from '../../../../env';

const OpenChatsScreen = () => {
  const params: any = useRoute();
  const navigation = useNavigation();
  const focus = useIsFocused();
  const socket = useRef<any>(null);
  const [messages, setMessages] = useState<any>([]);
  const [inputText, setInputText] = useState<any>('');
  const [otherUserId, setOtherUserId] = useState('');

  const [otherUserDetails, setOtherUserDetails] = useState<any>(null);
  const reduxData = useSelector((state: any) => state?.data?.loginData);
  let userData: any;

  //checking if the redux data is in string or not
  if (typeof reduxData === 'string') {
    userData = JSON.parse(reduxData);
  } else {
    userData = reduxData;
  }

  useEffect(() => {
    if (params.params?.prevPageRefer === 'old') {
      console.log('i am old');
      const totalUsers: any = [
        params.params?.prevChatData?.userA,
        params.params?.prevChatData?.userB,
      ];
      const foundId: any = totalUsers.filter(
        (item: any) => item?._id != userData?.user?._id,
      );
      if (foundId.length > 0) {
        setOtherUserDetails(foundId[0]);
        setOtherUserId(foundId);
        const formattedMessages = params?.params?.prevChatData?.chat
          .map((chat: any) => ({
            _id: chat._id,
            text: chat.message,
            createdAt: chat.createdAt,
            user: {
              _id: chat.user._id,
              name: `${chat.user.firstname} ${chat.user.lastname}`,
            },
          }))
          .reverse();
        setMessages(formattedMessages);
      }
    } else {
      console.log('i am new');
      const receiver = params.params?.receiverDetail || null;
      const foundId: any = [];
      if (receiver) {
        foundId.push(receiver);
        setOtherUserDetails(foundId[0]);
        setOtherUserId(foundId);
        setMessages([]);
      }
    }
  }, []);

  // connecting web sockets for live chats
  useEffect(() => {
    if (focus && userData) {
      //creating websocket

      socket.current = io(Socket_URL, {
        query: {userId: userData?.user?._id},
        transports: ['websocket'],
      });

      //socket connection established
      socket?.current.on('connect', () => {
        console.log('socketConnected Customer Side');
      });

      //socket disconnection
      socket.current.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });

      //socket connection error
      socket?.current.on('connect_error', err =>
        console.log('Connection error', err),
      );

      //socket connection failed
      socket?.current.on('connect_failed', err =>
        console.log('Connection failed', err),
      );

      if (otherUserDetails) {
        // Add new message to previous messages
        socket?.current.on(`newMessage/${otherUserDetails?._id}`, message => {
          console.log('newSocket newMessage: ');
          handleSetMessage(message);
        });
      }
    }
    return () => {
      if (socket?.current) {
        socket?.current?.disconnect();
      }
    };
    //setting socket name, to use in other functions
  }, [focus, otherUserDetails, userData]); //running the hook, when user focuses on this page

  useEffect(() => {
    return () => {
      if (socket?.current) {
        socket?.current?.disconnect();
      }
    };
  }, []);

  //appending message of current user
  const handleSetMessage = (message: any) => {
    const newMessage = {
      _id: message?.message?._id,
      text: message?.message?.message,
      createdAt: message?.message?.createdAt,
      user: {
        _id: message?.message?.user?._id,
        name:
          message?.message?.user?.firstname + message?.message?.user?.lastname,
      },
    };
    setMessages((previousMessages: any) =>
      GiftedChat.append(previousMessages, [newMessage]),
    );
  };

  //handling message emiting to socket
  const handleSendButton = () => {
    if (socket?.current) {
      //creating object of params, need to send in emiting new message
      const dataToSend = {
        receiver: otherUserDetails?._id,
        message: inputText,
      };

      //emitting current message
      socket?.current?.emit('privateMessage', dataToSend);

      // creating new object of current user message
      const newMessage = {
        _id: Math.round(Math.random() * 1000000).toString(),
        text: inputText,
        createdAt: new Date(Date.now()),
        user: {
          _id: userData?.user?._id,
          name: userData?.user?.firstname + userData?.user?.lastname,
        },
      };

      // Append the new message to the local state if message forwarded successfully
      setMessages((previousMessages: any) =>
        GiftedChat.append(previousMessages, [newMessage]),
      );
      setInputText('');
    } else {
      ShowMessage('error', 'Socket is not initialized');
    }
  };

  //changing the color of time in chats
  const renderTime = (props: any) => {
    return (
      <Time
        {...props}
        timeTextStyle={{
          left: {
            color: Colors.darkGreyColor,
            fontFamily: FONTS.MONTSERRAT_Regular,
          },
          right: {
            color: Colors.darkGreyColor,
            fontFamily: FONTS.MONTSERRAT_Regular,
          },
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBarContainer}>
        <View style={styles.rowItemsStyle}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('UserChat');
            }}>
            <Ionicons name="arrow-back-circle-sharp" style={styles.iconStyle} />
          </TouchableOpacity>

          <View style={styles.otherUserProfileView}>
            <UserImg
              // imageSource={otherUserDetails?.profilepic || undefined}
              imageSource={undefined}
              imageContainer={styles.otherUserProfile}
            />

            <View style={styles.otherUserNameView}>
              <MediumText
                style={{textTransform: 'capitalize'}}
                text={
                  otherUserDetails?.firstname + ' ' + otherUserDetails?.lastname
                }
              />
              <SmallText text={'Active'} />
            </View>
          </View>
        </View>
        <TouchableOpacity
          hitSlop={15}
          style={styles.callContainer}
          onPress={() => {
            Linking.openURL(`tel: +${otherUserDetails?.phoneno}`);
          }}>
          <Ionicons
            name="call-outline"
            size={18}
            color={Colors.primaryColor}
            style={styles.callIcon}
          />
        </TouchableOpacity>
      </View>

      <GiftedChat
        messages={messages}
        user={{
          _id: userData?.user?._id,
        }}
        renderAvatar={null}
        renderInputToolbar={props => (
          <Pressable style={styles.inputbtnContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                {...props}
                textAlignVertical="top"
                style={styles.inputText}
                placeholder="Message..."
                placeholderTextColor="#9D9D9D"
                value={inputText}
                onChangeText={setInputText}
                multiline={true}
              />
            </View>
            <Pressable
              style={styles.sendButtonOpacity}
              onPress={() => {
                if (inputText === '') {
                  ShowMessage('error', 'Please add some text to send !');
                  return;
                }
                handleSendButton();
              }}>
              <SvgXml xml={SVG.icons.sendMsgIcon} />
            </Pressable>
          </Pressable>
        )}
        renderBubble={(props: any) => {
          const {currentMessage} = props;
          return (
            <>
              <Bubble
                {...props}
                wrapperStyle={{
                  right: {
                    backgroundColor: Colors.lightPurpleColor,
                  },
                  left: {
                    backgroundColor: Colors.lightSilverColor,
                  },
                }}
                textStyle={{
                  right: {
                    color: Colors.darkGreyColor,
                    fontFamily: FONTS.MONTSERRAT_Regular,
                  },
                  left: {
                    color: Colors.darkGreyColor,
                    fontFamily: FONTS.MONTSERRAT_Regular,
                  },
                }}
                renderTime={renderTime}
              />
            </>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    width: '100%',
    paddingBottom: 20,
  },
  topBarContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: Colors.primaryColor,
    width: '100%',
    padding: '4%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  rowItemsStyle: {
    flexDirection: 'row',
    width: '70%',
    alignItems: 'center',
    gap: responsiveFontSize(15),
  },
  button: {
    borderRadius: 5,
  },
  callContainer: {
    width: 30,
    height: 30,
    backgroundColor: Colors.whiteColor,
    borderRadius: 30 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleTxt: {
    fontSize: responsiveFontSize(18),
  },
  iconStyle: {
    fontSize: responsiveFontSize(32),
    fontFamily: FONTS.MONTSERRAT_Regular,
    color: Colors.whiteColor,
  },
  otherUserProfileView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: responsiveFontSize(8),
  },
  otherUserProfile: {
    width: getResponsiveSize(9).width,
    height: getResponsiveSize(4.5).height,
  },
  otherUserNameView: {
    gap: -5,
  },
  callIcon: {},
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    alignSelf: 'center',
    padding: getResponsiveSize(1).height,
    paddingVertical: getResponsiveSize(2).height,
    backgroundColor: Colors.primaryColor,
  },
  inputbtnContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    alignSelf: 'center',
    // bottom: getResponsiveSize(0.5).height,
  },
  inputContainer: {
    width: '80%',
    borderColor: Colors.greyColor,
    // backgroundColor: 'red',
  },
  inputText: {
    color: Colors.blackColor,
    width: '100%',
    fontFamily: FONTS.MONTSERRAT_Regular,
    borderRadius: 5,
    backgroundColor: Colors.lightSilverColor,
    // paddingVertical: 15,
    paddingHorizontal: 10,
    height: 50,
  },
  sendButtonOpacity: {
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: responsiveFontSize(15),
    borderRadius: responsiveFontSize(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OpenChatsScreen;
