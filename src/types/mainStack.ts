import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export type TRootStack = {
    Main: undefined | any;
    Welcome: undefined | any;
    SplashScreen: undefined | any;
    EnterPhoneNumber: undefined | { phone: string };
    Login: undefined | any;
    ForgotPassword: undefined;
    RegisterSelection: undefined;
    Register: undefined | { phone: string };
    Otp: undefined | { phone: string | any };
    Home: undefined;
    PicknDropLocations: undefined | any;
    ResetPassword: undefined;
    ContractAcceptance: undefined | any;
    AcceptLoadBid: undefined;
    RealTimeTracking: undefined;
    PaymentMethod: undefined | any;
    WriteReview: undefined | any;
    RatingAndReview: undefined;
    UserBillingHistory: undefined | any;
    UserChats: undefined;
    MenuScreen: undefined;
    UserAccount: undefined | any;
    TotalUsersList: undefined | any;
    OpenChatsScreen: undefined | any;

};

export type EnterPhoneNumberScreenNavigationProp = StackNavigationProp<TRootStack, 'EnterPhoneNumber'>;
export type EnterForgotPasswordNavigationProp = StackNavigationProp<TRootStack, 'ForgotPassword'>;
export type EnterResetPasswordNavigationProp = StackNavigationProp<TRootStack, 'ResetPassword'>;

export type EnterPhoneNumberScreenRouteProp = RouteProp<TRootStack, 'EnterPhoneNumber'>;