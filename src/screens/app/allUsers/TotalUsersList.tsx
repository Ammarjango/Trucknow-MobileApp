import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import Colors from '../../../assets/colors/Colors';
import FONTS from '../../../assets/fonts/FONTS';
import {CustomerTopBar} from '../../../components/customerTopBar';
import {MediumText, SmallText} from '../../../components/text';
import {UserImg} from '../../../components/userImg';
import {
  createPrivateChat,
  getAllOneToOneChats,
  getAllUsers,
} from '../../../redux/slice/dataSlice';
import {SVG} from '../../../theme/assets';
import {getResponsiveSize, responsiveFontSize} from '../../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ShowMessage} from '../../../utils/ShowMessage';

const TotalUsersList = () => {
  const navigation: any = useNavigation();
  const dispatch = useDispatch();
  const reduxData = useSelector((state: any) => state?.data?.loginData);
  let userData;
  if (typeof reduxData == 'string') {
    userData = JSON.parse(reduxData);
  } else {
    userData = reduxData;
  }

  const [allUsersData, setAllUsersData] = useState<any>([]);
  const [chatLoader, setChatLoader] = useState<boolean>();
  const [totalPage, setTotalPage] = useState<any>('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getAllChats();
  }, [currentPage]);

  useEffect(() => {
    const focused: any = navigation.addListener('focus', () => {
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

  //getting All chats
  const getAllChats = async () => {
    const myVariables = {
      currentPage,
      userId: userData?.user?._id,
    };
    try {
      const response: any = await dispatch(getAllUsers(myVariables));
      console.log('response?.payload?.data', JSON.stringify(response));
      if (response?.payload) {
        setAllUsersData(response?.payload?.data);
        setChatLoader(false);
      } else {
        if (response?.payload?.message) {
          ShowMessage(response?.payload?.message || '');
        } else {
          Alert.alert('Please Try Again');
        }
      }
    } catch (error) {
      console.log('Async thunk failed:', error);
    }
  };

  // //Creating private chat
  // const handlePressedChat = async (otherUserid: any) => {
  //   try {
  //     const values = {
  //       userId: userData?.user?._id,
  //       receiverId: otherUserid,
  //     };
  //     const response: any = await dispatch(createPrivateChat(values));
  //     if (response?.payload?.success) {
  //       navigation.navigate('OpenChatsScreen', {
  //         prevChatData: response?.payload,
  //         prevPageRefer: 'new',
  //       });
  //     } else {
  //       if (response?.payload?.message === 'Already exists') {
  //         getOneToOnePrevChats(response?.meta?.arg);
  //         return;
  //       }
  //       if (response?.payload?.message) {
  //         Alert.alert(response?.payload?.message);
  //         return;
  //       } else {
  //         Alert.alert('Please Try Again');
  //       }
  //     }
  //   } catch (error) {
  //     console.log('Async thunk failed:', error);
  //   }
  // };

  // //Fetching Previous chat
  // const getOneToOnePrevChats = async (item: any) => {
  //   try {
  //     let values = {
  //       userId: item?.userId,
  //       receiverId: item?.receiverId,
  //     };
  //     const response: any = await dispatch(getAllOneToOneChats(values));
  //     if (response) {
  //       navigation.navigate('OpenChatsScreen', {
  //         prevChatData: response?.payload,
  //         prevPageRefer: 'old',
  //       });
  //     } else {
  //       Alert.alert('Please Try Again');
  //     }
  //   } catch (error) {
  //     console.log('Async thunk failed:', error);
  //   }
  // };

  //Creating private chat
  const handlePressedChat = async (receiver: any) => {
    try {
      const values = {
        userId: userData?.user?._id,
        receiverId: receiver?._id,
      };
      console.log('values : ', values);
      const response: any = await dispatch(createPrivateChat(values));
      console.log('response: ', response);
      if (response?.payload?.success) {
        navigation.navigate('UserChats', {
          screen: 'OpenChatsScreen',
          initial: false,
          params: {
            prevChatData: response?.payload,
            prevPageRefer: 'new',
            receiverDetail: receiver,
          },
        });
      } else {
        if (response?.payload?.message === 'Already exists') {
          getOneToOnePrevChats(response?.meta?.arg);
          return;
        }
        if (response?.payload?.message) {
          ShowMessage('error', response?.payload?.message || '');
        } else {
          ShowMessage('error', response?.error?.message || 'Please Try Again');
        }
      }
    } catch (error) {
      console.log('Async thunk failed:', error);
    }
  };

  //Fetching Previous chat
  const getOneToOnePrevChats = async (item: any) => {
    try {
      const values = {
        userId: item?.userId,
        receiverId: item?.receiverId,
      };
      const response: any = await dispatch(getAllOneToOneChats(values));
      if (response?.payload) {
        console.log(
          'getOneToOnePrevChats response?.payload: ',
          response?.payload,
        );
        navigation.navigate('UserChats', {
          screen: 'OpenChatsScreen',
          initial: false,
          params: {
            prevChatData: response?.payload,
            prevPageRefer: 'old',
          },
        });
      } else {
        ShowMessage('error', 'Please Try Again');
      }
    } catch (error) {
      console.log('Async thunk failed:', error);
    }
  };

  //calling when user scrolls to bottom/refreshes
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

  //calling when user scrolls to bottom
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

  return (
    <View style={styles.container}>
      <CustomerTopBar
        showArrow={true}
        showTitle={true}
        // showDots={true}
        isGap
        onPressArrow={() => {
          navigation.goBack();
        }}
        titleTxt="Start New Chat"
        inverted={false}
        containerStyle={styles.topContainer}
      />
      {/* <View style={styles.twoRowItemsContainer}>
        <View style={styles.inputView}>
          <TextInput
            placeholder="Search messages"
            placeholderTextColor={Colors.darkGreyColor}
            style={styles.inputStyle}
          />
          <AntDesign name="search1" style={styles.searchIcon} />
        </View>
      </View> */}
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        nestedScrollEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => handleNextUsers(1)}
          />
        }
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            handleNextUsers();
          }
        }}
        scrollEventThrottle={400}>
        <View style={styles.pinnedContainer}>
          <MediumText
            text={'All Users'}
            style={[
              styles.darkgreyColorTxt,
              {
                marginTop: responsiveFontSize(15),
              },
            ]}
          />
          {allUsersData.map((item: any, index: number) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.chatContainer}
                onPress={() => {
                  handlePressedChat(item?.acceptedBy);
                }}>
                <UserImg imageContainer={styles.imageContainer} />
                <View style={styles.chatsTextsView}>
                  <MediumText
                    text={
                      item?.acceptedBy?.firstname +
                      ' ' +
                      item?.acceptedBy?.lastname
                    }
                    style={styles.blackColorTxt}
                  />
                </View>

                {/* <View style={styles.chatDetailsView}>
                  <View style={{alignSelf: 'flex-end'}}>
                    <SmallText
                      text={item?.chatTime}
                      style={styles.darkgreyColorTxt}
                    />
                  </View>
                  {item?.unreadCount === 0 && item?.chatCurrentScnee === 0 ? (
                    <SvgXml
                      xml={SVG.icons.chatSeenIcon}
                      style={{alignSelf: 'flex-end'}}
                    />
                  ) : (
                    <SmallText
                      text={item.unreadCount}
                      style={styles.unreadCountTxt}
                    />
                  )}
                </View> */}
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
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    gap: responsiveFontSize(5),
    marginVertical: getResponsiveSize(2.5).height,
    height: getResponsiveSize(6).height,
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightSilverColor,
    width: '100%',
    alignSelf: 'center',
    borderRadius: responsiveFontSize(6),
    paddingLeft: getResponsiveSize(4).width,
    gap: responsiveFontSize(3),
  },
  inputStyle: {
    fontFamily: FONTS.MONTSERRAT_Regular,
    color: Colors.blackColor,
    width: '90%',
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: responsiveFontSize(18),
    color: Colors.blackColor,
  },
  iconsOpacity: {
    borderRadius: responsiveFontSize(6),
    borderColor: Colors.lightPrimaryColor,
    padding: responsiveFontSize(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: Colors.lightPrimaryColor,
  },
  iconStyle: {
    fontSize: responsiveFontSize(20),
    color: Colors.whiteColor,
    alignSelf: 'center',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  pinnedContainer: {
    width: '95%',
    alignSelf: 'center',
    gap: responsiveFontSize(6),
  },
  chatContainer: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: responsiveFontSize(5),
    padding: responsiveFontSize(10),
    borderRadius: responsiveFontSize(10),
    borderWidth: 1,
  },
  chatsTextsView: {
    width: '82%',
  },
  blackColorTxt: {
    color: Colors.blackColor,
    textTransform: 'capitalize',
  },
  darkgreyColorTxt: {
    color: Colors.darkGreyColor,
  },
  chatDetailsView: {
    width: '20%',
    gap: 2,
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
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
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

export default TotalUsersList;
