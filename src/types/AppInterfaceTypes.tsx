import {MomentInput} from 'moment';
import {Ref} from 'react';
import {TextStyle} from 'react-native';

export interface DatenTimeProps {
  isDisplay?: boolean;
  selection?: string;
}
export interface textProps {
  text: string | number | Date | any;
  numOfLines?: number;
  style?: TextStyle | any;
  isInverted?: boolean;
  ref?: Ref<any>;
  error?: TextStyle | any;
}

export interface topHeaderContainer {
  onPressArrow?: () => void;
  onPressDots?: () => void;
  containerStyle?: TextStyle | any;
  ArrowIconStyles?: TextStyle | any;
  titleStyles?: TextStyle | any;
  dotStyles?: TextStyle | any;
  titleTxt?: string;
  showArrow?: boolean;
  showTitle?: boolean;
  showDots?: boolean;
  inverted?: boolean;
  lastRowIcon?: Element;
  isGap: boolean;
}

export interface userImg {
  imageContainer?: TextStyle | any;
  imageStyle?: TextStyle | any;
  imageSource?: string | any;
  onPressImg?: () => void;
  skeletonStyle?: TextStyle | any;
}

export type ItemData = {
  id: string;
  title: string;
  isChecked: boolean;
};

export type ratingAndReviewsTYPES = {
  name: string;
  customerCompany: string;
  ratings: string;
  ratingNumber: number;
  daysCount: string;
  descTxt: string;
};
export type shipmentHistoryTYPES = {
  _id: any;
  status?: string;
  startTime: any;
  startDate: MomentInput;
  pickupLocationName: any;
  dropoffLocationName: any;
  fromAreaName: string;
  fromCountryName: string;
  toAreaName: string;
  toCountryName: string;
  pickupDate: string;
  pickupTime: string;
  dropDate: string;
  dropTime: string;
  companyName: string;
  truckName: string;
  truckCharges: string;
};
export type chatDataType = {
  id: number | string;
  chatTitle: string;
  lastChat: string;
  unreadCount: number;
  chatTime: string;
  chatCurrentScnee: number;
};

export type yesNoTitleDescMODALType = {
  isVisible: boolean;
  title?: string;
  description?: string;
  cancelTxt?: string | any;
  acceptTxt?: string | any;
  onPressCancel?: () => void;
  onPressAccept?: () => void;
  onModalCLose?: () => void;
  containerStyle?: TextStyle | any;
  contentContainerStyle?: TextStyle | any;
  titleTxtStyle?: TextStyle | any;
  contentTxtStyle?: TextStyle | any;
  cancelButtonStyle?: TextStyle | any;
  acceptButtonStyle?: TextStyle | any;
};

export type truckBreakDownsMODALType = {
  containerStyle?: TextStyle | any;
  isVisible?: boolean;
  breakDown?: boolean;
  driverName: string;
  orderNumber: number | string;
  ratingsNumber?: number;
  ratingTxt?: number | any;
  alertReason?: string;
  alertDetails?: string;
  onPressleftButton?: () => void;
  onPressRightButton?: () => void;
  onModalCLose?: () => void;
};

export type requestStatusMODALType = {
  containerStyle?: TextStyle | any;
  alertTitle?: string | any;
  alertIcon?: undefined | any;
  isSuccess: boolean;
  isVisible?: boolean;
  ratingsNumber?: number | string;
  alertDetails?: string;
  onPressleftButton?: () => void;
  onPressRightButton?: () => void;
  onModalCLose?: () => void;
};

export type locationSelectionMODALType = {
  locationIconStyle?: TextStyle | any;
  locationIcon?: undefined | any;
  buttonTxt?: string | any;
  isVisible?: boolean;
  placeHoldertxt?: string | any;
  onPressListTxt?: (data: any, details: any) => void;
  onPressButton?: () => void;
  onModalCLose?: () => void;
};

export type skeletionPlaceHolderType = {
  placeHolserStyle?: TextStyle | number | any | undefined;
  borderRadius?: TextStyle | number | any | undefined;
};
