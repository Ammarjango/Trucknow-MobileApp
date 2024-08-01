import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../assets/colors/Colors';
import {TouchableOpacity} from 'react-native';
import FONTS from '../../../assets/fonts/FONTS';
import {CustomerTopBar} from '../../../components/customerTopBar';
import {MediumText, SmallText} from '../../../components/text';
import {getResponsiveSize, responsiveFontSize} from '../../../utils';
import {
  getAllOneToOneChats,
  getAllUsersPreviousChat,
  postPinAndUnpinChat,
} from '../../../redux/slice/dataSlice';
import {useDispatch, useSelector} from 'react-redux';
import {UserImg} from '../../../components/userImg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {LogoutPopUpMODAL} from '../../../components/MODAL';
import moment from 'moment';
import {SvgXml} from 'react-native-svg';
import {SVG} from '../../../theme/assets';
import {ShowMessage} from '../../../utils/ShowMessage';

const UserChats = () => {
  const navigation: any = useNavigation();
  const dispatch = useDispatch();
  const reduxData = useSelector((state: any) => state?.data?.loginData);
  let userData: any;

  //checking if the redux data is in string or not
  if (typeof reduxData === 'string') {
    userData = JSON.parse(reduxData);
  } else {
    userData = reduxData;
  }

  const [unpinnedChats, setUnpinnedChats] = useState<any>([]);
  const [pinnedChats, setPinnedChats] = useState<any>([]);
  const [chatLoader, setChatLoader] = useState<boolean>();
  const [totalPage, setTotalPage] = useState<any>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [logoutModal, setLogoutModal] = useState(false);
  const [pinningText, setPinningText] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [isPin, setIsPin] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const focused: any = navigation.addListener('focus', () => {
      getAllChats();
      AsyncStorage.setItem('isInsideChats', 'true');
    });
    return focused;
  }, []);

  useEffect(() => {
    const blured: any = navigation.addListener('blur', () => {
      AsyncStorage.setItem('isInsideChats', 'false');
    });
    return blured;
  }, []);

  const searchData = (data: any) => {
    const res2 = data.filter(item => {
      const user = item?.userB || null;
      const name = user?.firstname + ' ' + user?.lastname;
      const phone = user?.phoneno?.toString() || '';
      const email = user?.email || '';
      const lastMessage = item?.latestMessage?.message || '';
      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        phone.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase()) ||
        lastMessage.toLowerCase().includes(search.toLowerCase())
      );
    });
    return res2;
  };

  //getting All previous chats
  const getAllChats = async () => {
    try {
      // const myVariables = {
      //   currentPage,
      // };
      const response: any = await dispatch(
        getAllUsersPreviousChat(userData?.user?._id),
      );
      if (response?.payload) {
        console.log(
          'getAllChats response: ',
          JSON.stringify(response?.payload),
        );
        let pinnedChat = response?.payload?.data?.filter(
          (item: any) => item?.isPin !== false && item?.latestMessage,
        );
        let unPinnedChats = response?.payload?.data?.filter(
          (item: any) => item?.isPin === false && item?.latestMessage,
        );
        setPinnedChats(pinnedChat);
        setUnpinnedChats(unPinnedChats);
        setChatLoader(false);
      } else {
        if (response?.payload?.message) {
          Alert.alert(response?.payload?.message);
        } else {
          Alert.alert('Please Try Again');
        }
      }
    } catch (error) {
      console.log('Async thunk failed:', error);
    }
  };

  //pagination implementation when user reach at the buttom of page
  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToBottom = 20; // you can adjust this threshold
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  //pagination implementation when user refreshes the page
  const handleNextUsers = (referedPage?: any) => {
    if (referedPage) {
      if (referedPage != currentPage) {
        setChatLoader(true);
        setCurrentPage(1);
      }
    } else {
      if (currentPage < totalPage) {
        setCurrentPage(currentPage + 1);
        setChatLoader(true);
      }
    }
  };

  //Fetching Previous chat
  const handlePressedChat = async (otherUserid: any) => {
    try {
      let values = {
        userId: userData?.user?._id,
        receiverId: otherUserid,
      };
      const response: any = await dispatch(getAllOneToOneChats(values));
      if (response) {
        navigation.navigate('OpenChatsScreen', {
          prevChatData: response?.payload,
          prevPageRefer: 'old',
        });
      } else {
        Alert.alert('Please Try Again');
      }
    } catch (error) {
      console.log('Async thunk failed:', error);
    }
  };

  //pin or unpin selected chat
  const pinOrUnpinChat = async (isPin: boolean, otherUserid: string) => {
    try {
      const values = {
        isPin: isPin,
        userA: userData?.user?._id,
        userB: otherUserid,
      };
      const response: any = await dispatch(postPinAndUnpinChat(values));
      setLogoutModal(false);
      if (response?.payload?.success) {
        setLogoutModal(false);
        getAllChats();
      } else {
        ShowMessage('error', response?.payload?.message || '');
      }
    } catch (error) {
      setLogoutModal(false);
      console.log('Async thunk failed:', error);
    }
  };

  //checking length of chats(pin/unpin) --> under process
  const checkLength = (array: any) => {
    return array?.length;
  };

  const pinChat = search === '' ? pinnedChats : searchData(pinnedChats);
  const unPinChat = search === '' ? unpinnedChats : searchData(unpinnedChats);
  return (
    <View style={styles.container}>
      <CustomerTopBar
        showArrow={true}
        showTitle={true}
        // showDots={true}
        isGap={true}
        onPressArrow={() => {
          navigation.goBack();
        }}
        titleTxt="Chat"
        inverted={false}
        containerStyle={styles.topContainer}
      />
      {/* pin/unpin popup modal */}
      <LogoutPopUpMODAL
        title="Chat"
        description={pinningText}
        cancelTxt="Cancel"
        acceptTxt="Ok"
        isVisible={logoutModal}
        onModalCLose={() => setLogoutModal(false)}
        onPressCancel={() => setLogoutModal(false)}
        onPressAccept={() => {
          pinOrUnpinChat(isPin, receiverId);
        }}
      />
      <View style={styles.twoRowItemsContainer}>
        <View style={styles.inputView}>
          <TextInput
            onChangeText={(val: string) => setSearch(val)}
            placeholder="Search messages"
            placeholderTextColor={Colors.darkGreyColor}
            style={styles.inputStyle}
          />
          <AntDesign
            size={responsiveFontSize(18)}
            name="search1"
            style={styles.searchIcon}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('TotalUsersList');
          }}>
          <SvgXml xml={SVG.icons.chat} />
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => {
            navigation.navigate('TotalUsersList');
          }}>
          <SvgXml xml={SVG.icons.chatFilter} />
        </TouchableOpacity> */}
      </View>

      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        nestedScrollEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={false}
            // onRefresh={() => handleNextUsers(1)}  //under process, depending on pagination from backend
            onRefresh={() => getAllChats()}
          />
        }
        //---under process, depending on pagination from backend
        // onScroll={({ nativeEvent }) => {
        //     if (isCloseToBottom(nativeEvent)) {
        //         handleNextUsers();
        //     }
        // }}
        scrollEventThrottle={400}>
        <View>
          <View style={styles.pinnedContainer}>
            <MediumText
              text={`PINNED MESSAGES (${checkLength(pinChat)})`}
              style={styles.darkgreyColorTxt}
            />
            {pinChat.map((item: any, index: number) => {
              return (
                <TouchableOpacity
                  key={index}
                  delayLongPress={400}
                  onLongPress={() => {
                    setIsPin(false);
                    setReceiverId(item?.userB?._id);
                    setLogoutModal(true);
                    setPinningText('do you want to unpin it ?');
                  }}
                  style={styles.chatContainer}
                  onPress={() => {
                    handlePressedChat(item?.userB?._id);
                  }}>
                  <UserImg
                    // imageSource={item?.userB?.profilepic || undefined}
                    imageSource={undefined}
                    imageContainer={styles.imageContainer}
                  />
                  <View style={styles.chatsTextsView}>
                    <MediumText
                      text={
                        item?.userB?.firstname + ' ' + item?.userB?.lastname
                      }
                      style={styles.blackColorTxt}
                    />
                    <SmallText
                      text={item?.latestMessage?.message}
                      style={styles.darkgreyColorTxt}
                      numOfLines={1}
                    />
                  </View>

                  <View style={styles.chatDetailsView}>
                    <View style={styles.rowItems}>
                      <SimpleLineIcons name="pin" />
                      <SmallText
                        text={moment(item?.createdAt).format('LT')}
                        style={styles.darkgreyColorTxt}
                      />
                    </View>
                    {/* {item.unreadCount === 0 && item.chatCurrentScnee === 0 ? (
                      <SvgXml
                        xml={SVG.icons.chatSeenIcon}
                        style={{alignSelf: 'flex-end'}}
                      />
                    ) : (
                      <SmallText style={styles.unreadCountTxt} text={'2'} />
                    )} */}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.pinnedContainer}>
            <MediumText
              text={`ALL MESSAGES (${checkLength(unPinChat)})`}
              style={[
                styles.darkgreyColorTxt,
                {
                  marginTop: responsiveFontSize(15),
                },
              ]}
            />
            {unPinChat?.map((item: any, index: number) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    handlePressedChat(item?.userB?._id);
                  }}
                  key={index}
                  delayLongPress={400}
                  onLongPress={() => {
                    setIsPin(true);
                    setReceiverId(item?.userB?._id);
                    setLogoutModal(true);
                    setPinningText('do you want to pin it ?');
                  }}
                  style={styles.chatContainer}>
                  <UserImg
                    // imageSource={item?.userB?.profilepic || undefined}
                    imageSource={undefined}
                    imageContainer={styles.imageContainer}
                  />

                  <View style={styles.chatsTextsView}>
                    <MediumText
                      text={
                        item?.userB?.firstname + ' ' + item?.userB?.lastname
                      }
                      style={styles.blackColorTxt}
                    />
                    <SmallText
                      text={item?.latestMessage?.message}
                      style={styles.darkgreyColorTxt}
                      numOfLines={1}
                    />
                  </View>

                  <View style={styles.chatDetailsView}>
                    <View style={{alignSelf: 'flex-end'}}>
                      <SmallText
                        text={moment(item?.createdAt).format('LT')}
                        style={styles.darkgreyColorTxt}
                      />
                    </View>
                    {/* {item.unreadCount === 0 && item.chatCurrentScnee === 0 ? (
                      <SvgXml
                        xml={SVG.icons.chatSeenIcon}
                        style={{alignSelf: 'flex-end'}}
                      />
                    ) : (
                      <SmallText text={'2'} style={styles.unreadCountTxt} />
                    )} */}
                  </View>
                </TouchableOpacity>
              );
            })}
            <View style={styles.endReachedContainer}>
              {chatLoader ? (
                <ActivityIndicator
                  color={Colors.primaryColor}
                  size={getResponsiveSize(5).width}
                />
              ) : (
                currentPage === totalPage && (
                  <MediumText
                    text={'No More Chats'}
                    style={styles.endReachedTxt}
                  />
                )
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
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
  twoRowItemsContainer: {
    flexDirection: 'row',
    width: '93%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    // gap: responsiveFontSize(5),
    marginVertical: getResponsiveSize(2.5).height,
    height: getResponsiveSize(Platform.OS === 'ios' ? 4.7 : 4.8).height,
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightSilverColor,
    width: '85%',
    borderRadius: responsiveFontSize(6),
    paddingLeft: getResponsiveSize(4).width,
    gap: responsiveFontSize(3),
  },
  inputStyle: {
    fontFamily: FONTS.MONTSERRAT_Regular,
    color: Colors.blackColor,
    width: '85%',
  },
  searchIcon: {
    color: Colors.blackColor,
  },
  iconsOpacity: {
    borderRadius: responsiveFontSize(5),
    borderColor: Colors.lightPrimaryColor,
    padding: responsiveFontSize(6),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: Colors.lightPrimaryColor,
  },
  iconStyle: {
    fontSize: responsiveFontSize(19),
    color: Colors.whiteColor,
    alignSelf: 'center',
  },
  pinnedContainer: {
    width: '95%',
    alignSelf: 'center',
    gap: responsiveFontSize(6),
  },
  chatContainer: {
    width: '99%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: responsiveFontSize(5),
    padding: responsiveFontSize(9),
    borderRadius: responsiveFontSize(5),
    borderWidth: 1,
    alignSelf: 'center',
  },
  chatsTextsView: {
    width: '58%',
    gap: 2,
  },
  blackColorTxt: {
    color: Colors.blackColor,
    textTransform: 'capitalize',
  },
  darkgreyColorTxt: {
    color: Colors.darkGreyColor,
  },
  chatDetailsView: {
    width: '23%',
  },
  rowItems: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  unreadCountTxt: {
    backgroundColor: Colors.lightPrimaryColor,
    alignSelf: 'flex-end',
    paddingHorizontal: responsiveFontSize(7),
    borderRadius: responsiveFontSize(35),
  },
  imageContainer: {
    width: 52,
    height: 52,
    borderRadius: 52 / 2,
  },
  endReachedContainer: {
    backgroundColor: 'white',
    paddingBottom: getResponsiveSize(3).width,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: getResponsiveSize(1).height,
  },
  endReachedTxt: {
    color: Colors.primaryColor,
    fontSize: getResponsiveSize(5).width,
    fontFamily: FONTS.MONTSERRAT_Regular,
    alignSelf: 'center',
  },
});

export default UserChats;
