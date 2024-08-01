import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import * as Progress from 'react-native-progress';
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import Colors from '../../../assets/colors/Colors';
import FONTS from '../../../assets/fonts/FONTS';
import CustomBackArrow from '../../../components/customerTopBar';
import {LargeText, MediumText, SmallText} from '../../../components/text';
import {UserImg} from '../../../components/userImg';
import {ratingAndReviewsTYPES} from '../../../types/AppInterfaceTypes';
import {getResponsiveSize, responsiveFontSize} from '../../../utils';
import {useDispatch} from 'react-redux';
import {getCompanyRatings} from '../../../redux/slice/dataSlice';
// @ts-ignore
import _ from 'lodash';
import moment from 'moment';

const RatingAndReview = () => {
  const navigation: any = useNavigation();
  const dispatch = useDispatch();
  const routes: any = useRoute();
  const companyId = routes?.params?.companyId;
  const driverId = routes?.params?.driverId;
  const currentDate = moment();

  const [companyDetails, setCompanyDetails] = useState<any>();
  console.log('companyDetails: ', JSON.stringify(companyDetails));

  useEffect(() => {
    getRatingNReviews();
  }, []);

  const calculateAverageRating = (ratings: any) => {
    if (ratings.length === 0) {
      return null;
    }
    const totalSum = ratings.reduce((sum: any, rating: any) => sum + rating, 0);
    const averageRating = totalSum / ratings.length;

    // Categorize ratings
    const categorizedRatings = _.groupBy(ratings, (rating: any) => {
      if (rating >= 4) {
        return 'excellent';
      } else if (rating >= 3) {
        return 'good';
      } else if (rating >= 2) {
        return 'average';
      } else if (rating >= 1) {
        return 'belowAverage';
      } else {
        return 'poor';
      }
    });

    return {averageRating, categorizedRatings};
  };

  const getRatingNReviews = async () => {
    try {
      const response: any = await dispatch(getCompanyRatings(companyId));

      if (response?.payload?.success) {
        const {averageRating, categorizedRatings}: any = calculateAverageRating(
          response?.payload?.totalReviews,
        );
        const cloneResponse = {
          ...response?.payload,
          totalRating: averageRating?.toFixed(1),
          categorizedRatings,
        };
        setCompanyDetails(cloneResponse);
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
  return (
    <View style={styles.container}>
      <View style={styles.topParentView}>
        <CustomBackArrow
          showArrow={true}
          showTitle={true}
          // showDots={true}
          isGap={true}
          onPressArrow={() => {
            navigation.goBack();
          }}
          titleTxt="Customer Reviews"
          inverted={false}
          containerStyle={styles.topContainer}
        />
        <View style={styles.starParentContainer}>
          <LargeText
            text={companyDetails?.totalRating}
            style={styles.ratingTxt}
          />
          <StarRatingDisplay
            rating={companyDetails?.totalRating}
            starStyle={styles.starStyle}
            starSize={responsiveFontSize(20)}
          />
          <MediumText
            text={companyDetails?.totalCount + ' Reviews'}
            style={styles.reviewTxt}
          />
        </View>
        {companyDetails?.categorizedRatings && (
          <View style={styles.barContainer}>
            <View style={styles.twoRowItemsContainer}>
              <MediumText text={'Excellent'} style={styles.reviewTxt} />
              <Progress.Bar
                progress={
                  companyDetails?.categorizedRatings?.excellent &&
                  companyDetails?.categorizedRatings?.excellent?.length / 100
                }
                width={200}
                color={Colors.whiteColor}
                style={styles.barStyle}
                unfilledColor={Colors.darkGreyColor}
                borderRadius={10}
              />
            </View>
            <View style={styles.twoRowItemsContainer}>
              <MediumText text={'Good'} style={styles.reviewTxt} />
              <Progress.Bar
                progress={
                  companyDetails?.categorizedRatings?.good &&
                  companyDetails?.categorizedRatings?.good?.length / 100
                }
                // progress={0.4}

                width={200}
                style={styles.barStyle}
                color={Colors.whiteColor}
                unfilledColor={Colors.darkGreyColor}
              />
            </View>
            <View style={styles.twoRowItemsContainer}>
              <MediumText text={'Average'} style={styles.reviewTxt} />
              <Progress.Bar
                progress={
                  companyDetails?.categorizedRatings?.average &&
                  companyDetails?.categorizedRatings?.average?.length / 100
                }
                // progress={0.6}

                width={200}
                color={Colors.whiteColor}
                unfilledColor={Colors.darkGreyColor}
                style={styles.barStyle}
              />
            </View>
            <View style={styles.twoRowItemsContainer}>
              <MediumText text={'Below Average'} style={styles.reviewTxt} />
              <Progress.Bar
                progress={
                  companyDetails?.categorizedRatings?.belowAverage &&
                  companyDetails?.categorizedRatings?.belowAverage?.length / 100
                }
                // progress={0.9}

                width={200}
                color={Colors.whiteColor}
                unfilledColor={Colors.darkGreyColor}
                style={styles.barStyle}
              />
            </View>
            <View style={styles.twoRowItemsContainer}>
              <MediumText text={'Poor'} style={styles.reviewTxt} />
              <Progress.Bar
                // progress={0.3}
                progress={
                  companyDetails?.categorizedRatings?.poor &&
                  companyDetails?.categorizedRatings?.poor?.length / 100
                }
                width={200}
                color={Colors.whiteColor}
                unfilledColor={Colors.darkGreyColor}
                style={styles.barStyle}
              />
            </View>
          </View>
        )}
      </View>
      <ScrollView
        style={{marginVertical: 5}}
        contentContainerStyle={{paddingVertical: 10}}>
        {companyDetails?.data?.reverse().map((item: any, index: number) => {
          return (
            <View key={index} style={styles.companyDetailsContainer}>
              <View style={styles.twoRowItemsContainer}>
                <View style={styles.imageAndContentView}>
                  <UserImg imageContainer={styles.userImgContainer} />
                  <View style={styles.twoColumnItems}>
                    <MediumText
                      text={
                        item?.customerId?.firstname +
                        ' ' +
                        item?.customerId?.lastname
                      }
                      style={styles.blackTxt}
                    />
                    <SmallText
                      text={
                        'company: ' +
                        item?.companyId?.firstname +
                        ' ' +
                        item?.companyId?.lastname
                      }
                      style={styles.mediumGreyTxt}
                    />
                  </View>
                </View>
                <View style={styles.twoColumnItems}>
                  <View style={styles.starView}>
                    <StarRatingDisplay
                      rating={item.rating}
                      starStyle={styles.starRatingDisplay}
                      starSize={responsiveFontSize(14)}
                    />
                    <SmallText
                      text={item.rating}
                      style={[
                        styles.mediumGreyTxt,
                        {
                          alignSelf: 'flex-end',
                        },
                      ]}
                    />
                  </View>

                  <SmallText
                    text={
                      currentDate.diff(
                        moment(item?.customerId?.updatedAt),
                        'days',
                      ) + ' days ago'
                    }
                    style={[
                      styles.blackTxt,
                      {
                        alignSelf: 'flex-end',
                      },
                    ]}
                  />
                </View>
              </View>
              <View style={styles.descContainer}>
                <MediumText
                  text={item.reviewMessage}
                  style={styles.desciptionTxt}
                />
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  topParentView: {
    backgroundColor: Colors.primaryColor,
    gap: responsiveFontSize(10),
    paddingBottom: responsiveFontSize(20),
    borderBottomRightRadius: responsiveFontSize(30),
    borderBottomLeftRadius: responsiveFontSize(30),
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    alignSelf: 'center',
    marginTop: getResponsiveSize(1).height,
  },
  titleTxt: {
    color: Colors.whiteColor,
  },
  starParentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingTxt: {
    alignSelf: 'center',
    color: Colors.darkBlueColor,
    fontSize: responsiveFontSize(40),
  },
  starStyle: {
    width: getResponsiveSize(4).width,
    left: responsiveFontSize(-4),
  },
  reviewTxt: {
    alignSelf: 'center',
    color: Colors.lightGreyColor,
    fontFamily: FONTS.MONTSERRAT_Regular,
  },
  twoRowItemsContainer: {
    width: '95%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'flex-start',
    textAlign: 'left',
  },
  imageAndContentView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveFontSize(5),
  },
  descContainer: {
    width: '95%',
    alignSelf: 'center',
  },
  desciptionTxt: {
    fontFamily: FONTS.MONTSERRAT_Regular,
    color: Colors.lightGreyColor,
  },
  twoColumnItems: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  barContainer: {
    paddingBottom: responsiveFontSize(5),
  },
  barStyle: {
    borderRadius: 40,
    borderWidth: 0,
  },
  companyDetailsContainer: {
    width: '95%',
    alignSelf: 'center',
    marginVertical: getResponsiveSize(1).height,
    gap: responsiveFontSize(5),
  },
  blackTxt: {
    color: Colors.blackColor,
  },
  starView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: responsiveFontSize(5),
  },
  starRatingDisplay: {
    width: getResponsiveSize(2).width,
    left: 0,
  },
  mediumGreyTxt: {
    color: Colors.lightGreyColor,
  },
  continueButton: {
    width: '95%',
    bottom: 10,
    marginVertical: getResponsiveSize(2).height,
    backgroundColor: Colors.primaryColor,
  },
  userImgContainer: {
    width: getResponsiveSize(10).width,
    height: getResponsiveSize(5).height,
  },
});
export default RatingAndReview;
