import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {dataServer} from '../../services/axiosConfig';
import {
  autheniticateUserRequest,
  cerateUserRequest,
  confirmOtpForRegRequest,
  forgetPassRequest,
  phoneForRegRequest,
  resetPassRequest,
  responseType,
} from '../../types/axiosRequests';
import {MAPS_API, Maps_API_KEY, ProductionURl} from '../../../env';
import axios from 'axios';

// Create Async Thunks for each API call
export const CreateUser = createAsyncThunk(
  'data/createUser',
  async (values: cerateUserRequest) => {
    const response = await dataServer.post('trucknow/user', {
      firstname: values?.firstname,
      lastname: values?.lastname,
      email: values?.email,
      address: values?.address,
      phoneno: values?.phoneno,
      role: 'user',
      password: values?.confirmPassword,
    });
    return response;
  },
);

export const LoginUser = createAsyncThunk(
  'data/LoginUser',
  async (values: autheniticateUserRequest) => {
    const response = await dataServer.post('/trucknow/user/login', {
      phoneno: values?.phoneNo,
      password: values?.password,
      role: values?.role,
    });
    return response;
  },
);

export const enterPhoneForReg = createAsyncThunk(
  'data/enterPhoneForReg',
  async (values: phoneForRegRequest) => {
    const response = await dataServer.post('trucknow/user/sendotp', {
      phoneno: values.phoneno,
    });
    return response;
  },
);

export const confirmOtpForReg = createAsyncThunk(
  'data/confirmOtpForReg',
  async (values: confirmOtpForRegRequest) => {
    const route = 'trucknow/user/confirmotp';
    const payload = {
      otp: values,
    };

    const response = await dataServer.post(route, payload);
    return response;
  },
);

export const userForgetPass = createAsyncThunk(
  'data/userForgetPass',
  async (values: forgetPassRequest) => {
    const response = await dataServer.post('trucknow/user/forgetpassword', {
      phoneno: values?.phoneno,
    });
    return response;
  },
);

export const resetPass = createAsyncThunk(
  'data/ResetPass',
  async (values: resetPassRequest) => {
    const response = await dataServer.post('trucknow/user/resetpassword', {
      otp: values.otp,
      password: values.password,
    });
    return response;
  },
);

export const getTrucks: any = createAsyncThunk('data/getTrucks', async () => {
  const response = await dataServer.get('trucknow/trucks/');
  return response;
});

export const checkLocationCountry = async (
  latitude: number,
  longitude: number,
) => {
  try {
    const response = await axios.get(
      `${MAPS_API}?latlng=${latitude},${longitude}&key=${Maps_API_KEY}`,
    );

    if (response.data.results.length > 0) {
      const country = response.data.results[0].address_components.find(
        (component: any) => component.types.includes('country'),
      );

      return country.long_name;
    } else {
      return false;
    }
  } catch (error) {
    console.log('Error checking location:', error);
    return false;
  }
};

export const createRequest: any = createAsyncThunk(
  'data/createRequest',
  async (values: any) => {
    let reqData = values?.reqValues;
    const response = await dataServer.post('trucknow/request', {
      pickupLocationName: reqData?.pickupLocationName,
      pickupLocationCooridinates: reqData?.pickupLocationCoordinates,
      dropoffLocationName: reqData?.dropoffLocationName,
      dropoffLocationCoordinates: reqData?.dropoffLocationCoordinates,
      material: reqData?.material,
      instructions: reqData?.instructions,
      weight: reqData?.weight,
      quantity: reqData?.quantity,
      truckId: reqData?.truckId,
      startDate: reqData?.startDate,
      startTime: reqData?.startTime,
      price: reqData?.ridePrice,
      extimatedTime: reqData?.extimatedTime,
      estimatedDistance: reqData?.estimatedDistance,
    });
    return response;
  },
);

export const getShipments: any = createAsyncThunk(
  'data/getShipments',
  async (values: any) => {
    const response = await dataServer.get(
      values.reqStatus === 'completed'
        ? `trucknow/payment/getUserPaymentDetail?perPage=10&pageNo=1`
        : `trucknow/request?perPage=10&pageNo=1&reqStatus=${values.reqStatus}`,
    );
    return response;
  },
);

export const getAvailableBids: any = createAsyncThunk(
  'data/getAvailableBids',
  async (values: any) => {
    const response = await dataServer.get(
      `trucknow/request/bid?requestId=${values}`,
    );
    return response;
  },
);

export const cancelCurrentRequest: any = createAsyncThunk(
  'data/cancelCurrentRequest',
  async (values: any) => {
    const response = await dataServer.put(
      `trucknow/request/cancel-user?requestId=${values}`,
    );
    return response;
  },
);

export const postingAcceptedBid: any = createAsyncThunk(
  'data/postingAcceptedBid',
  async (values: any) => {
    const response = await dataServer.post('trucknow/biding/accept', {
      requestId: values?.requestId,
      bidId: values?.bidId,
      biderId: values?.biderId,
    });
    return response;
  },
);

export const getInvoice: any = createAsyncThunk(
  'data/getInvoice',
  async (values: any) => {
    const response = await dataServer.get(
      `trucknow/payment/getInvoiceDetail?bookingId=${values}`,
    );
    return response;
  },
);

export const getPaymentToken: any = createAsyncThunk(
  'data/getPaymentToken',
  async (values: any) => {
    const route = 'trucknow/payment/intent';
    const payload = {
      amount: values?.amount,
      userId: values?.userId,
      requestId: values?.requestId,
    };
    console.log('route: ', route);
    console.log('payload', payload);
    const response = await dataServer.post(route, payload);
    console.log('response: ', response);
    return response;
  },
);

export const getCompletedDetails: any = createAsyncThunk(
  'data/getCompletedDetails',
  async () => {
    const response = await dataServer.get('trucknow/trucks/');
    return response;
  },
);

export const getDeliveryDetails: any = createAsyncThunk(
  'data/getDeliveryDetails',
  async (bookingId: string = '') => {
    const response = await dataServer.get(
      `trucknow/request/getDeliveryDetails?bookingId=${bookingId}`,
    );
    return response;
  },
);

export const postReviewDetails: any = createAsyncThunk(
  'data/postReviewDetails',
  async (values: any) => {
    const route = 'trucknow/review/createCustomerReview';
    const payload = {
      bookingId: values.bookingId,
      companyId: values.companyId,
      driverId: values.driverId,
      reviewMessage: values.reviewMessage,
      rating: values.rating,
    };
    console.log('route: ', route);
    console.log('payload: ', payload);
    const response = await dataServer.post(route, payload);
    return response;
  },
);

export const getCompanyRatings: any = createAsyncThunk(
  'data/getCompanyRatings',
  async (values: any) => {
    const response = await dataServer.get(
      // `trucknow/review/getAllReviews?pageNo=1&perPage=5&driverId=${values}`,
      `trucknow/review/getAllReviews?pageNo=1&perPage=10&companyId=${values}`,
    );
    return response;
  },
);

export const getAllUsers: any = createAsyncThunk(
  'data/getAllUsers',
  async (values: any) => {
    const response = await dataServer.get(`/trucknow/request/getAllChatUsers`);
    return response;
  },
);

export const getAllUsersPreviousChat: any = createAsyncThunk(
  'data/getAllUsersPreviousChat',
  async (values: any) => {
    const response = await dataServer.get(
      `/chat/chat/getAllChats?userId=${values}&userRole=company`,
    );
    return response;
  },
);

export const createPrivateChat: any = createAsyncThunk(
  'data/createPrivateChat',
  async (values: any) => {
    const response = await dataServer.post('chat/chat/private', {
      userId: values?.userId,
      receiverId: values?.receiverId,
    });
    return response;
  },
);

export const getAllOneToOneChats: any = createAsyncThunk(
  'data/getAllOneToOneChats',
  async (values: any) => {
    const response = await dataServer.get(
      `/chat/chat/private?userId=${values?.userId}&receiverId=${values?.receiverId}`,
    );
    return response;
  },
);

export const postPinAndUnpinChat: any = createAsyncThunk(
  'data/postPinAndUnpinChat',
  async (values: any) => {
    const response = await dataServer.put(`/chat/chat/pinUnPinChat`, {
      isPin: values?.isPin,
      userA: values?.userA,
      userB: values?.userB,
    });
    return response;
  },
);

export const postOneToOneChat: any = createAsyncThunk(
  'data/postOneToOneChat',
  async (values: any) => {
    const response = await dataServer.put(`/chat/chat/private`, {
      userId: values?.userId,
      receiverId: values?.receiverId,
      message: values?.message,
    });
    return response;
  },
);

export const getUserProfileDetails: any = createAsyncThunk(
  'data/getUserProfileDetails',
  async (values: any) => {
    const response = await dataServer.get(`/trucknow/request/getUserInfo`);
    return response;
  },
);

export const deleteUserProfileImage: any = createAsyncThunk(
  'data/deleteUserProfileImage',
  async (values: any) => {
    const response = await dataServer.delete(
      `/trucknow/upload/deleteFileS3?key=${values}`,
    );
    return response;
  },
);

export const updateUserProfileDetails: any = createAsyncThunk(
  'data/updateUserProfileDetails',
  async (values: any) => {
    const response = await dataServer.put(`/trucknow/request/updateProfile`, {
      userName: values?.userName,
      address: values?.address,
      email: values?.email,
      firstname: values?.firstname,
      lastname: values?.lastname,
    });
    return response;
  },
);

const initialState: responseType = {
  data: [],
  loginData: [],
  signupData: [],
  forgetPassData: [],
  enterPhoneData: [],
  confirmOtpData: [],
  resetPassData: [],
  notifications: null,
  status: false,
  error: null,
};

const dataSlice: any = createSlice({
  name: 'data',
  initialState,
  reducers: {
    saveLoginData: (state, action) => {
      state.loginData = action.payload;
    },
    resetData: state => {
      // Reset the state properties to their initial values
      state.status = initialState.status;
      state.loginData = initialState.data;
      state.error = initialState.error;
    },
    isLoader: (state, action) => {
      // set dispatch properties(true/false) in case of conditional loading
      state.status = action.payload;
    },
    resetRegisteration: state => {
      state.signupData = initialState.signupData;
      state.status = initialState.status;
      state.error = initialState.error;
    },
    notificationData: (state, action) => {
      state.notifications = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      //Register User
      .addCase(LoginUser.pending, (state: any) => {
        state.status = true;
      })
      .addCase(LoginUser.fulfilled, (state: any, action) => {
        state.status = false;
        state.loginData = action.payload;
      })
      .addCase(LoginUser.rejected, (state: any, action) => {
        state.status = false;
        state.error = action.error.message;
      })

      //Authenticate User
      .addCase(CreateUser.pending, (state: any) => {
        state.status = true;
      })
      .addCase(CreateUser.fulfilled, (state: any, action) => {
        state.status = false;
        state.signupData = action.payload;
      })
      .addCase(CreateUser.rejected, (state: any, action) => {
        state.status = false;
        state.error = action.error.message;
      })

      //Phone No. for Registeration of User
      .addCase(enterPhoneForReg.pending, (state: any) => {
        state.status = true;
      })
      .addCase(enterPhoneForReg.fulfilled, (state: any, action) => {
        state.status = false;
        state.enterPhoneData = action.payload;
      })
      .addCase(enterPhoneForReg.rejected, (state: any, action) => {
        state.status = false;
        state.error = action.error.message;
      })

      //OTP for Registeration of User
      .addCase(confirmOtpForReg.pending, (state: any) => {
        state.status = true;
      })
      .addCase(confirmOtpForReg.fulfilled, (state: any, action) => {
        state.status = false;
        state.confirmOtpData = action.payload;
      })
      .addCase(confirmOtpForReg.rejected, (state: any, action) => {
        state.status = false;
        state.error = action.error.message;
      })

      //Phone No. for Forget Pass of User
      .addCase(userForgetPass.pending, (state: any) => {
        state.status = true;
      })
      .addCase(userForgetPass.fulfilled, (state: any, action) => {
        state.status = false;
        state.forgetPassData = action.payload;
      })
      .addCase(userForgetPass.rejected, (state: any, action) => {
        state.status = false;
        state.error = action.error.message;
      })

      //Reset Password of User
      .addCase(resetPass.pending, (state: any) => {
        state.status = true;
      })
      .addCase(resetPass.fulfilled, (state: any, action) => {
        state.status = false;
        state.resetPassData = action.payload;
      })
      .addCase(resetPass.rejected, (state: any, action) => {
        state.status = false;
        state.error = action.error.message;
      })

      //get all the trucks for User
      .addCase(getTrucks.pending, (state: any) => {
        state.status = true;
      })
      .addCase(getTrucks.fulfilled, (state: any, action) => {
        state.status = false;
      })
      .addCase(getTrucks.rejected, (state: any, action) => {
        state.status = false;
        state.error = action.error.message;
      })

      //create tracking request from User
      .addCase(createRequest.pending, (state: any) => {
        state.status = true;
      })
      .addCase(createRequest.fulfilled, (state: any, action) => {
        state.status = false;
      })
      .addCase(createRequest.rejected, (state: any, action) => {
        state.status = false;
        state.error = action.error.message;
      })

      //get shipments of current user
      .addCase(getShipments.pending, (state: any) => {
        state.status = true;
      })
      .addCase(getShipments.fulfilled, (state: any, action) => {
        state.status = false;
      })
      .addCase(getShipments.rejected, (state: any, action) => {
        state.status = false;
        state.error = action.error.message;
      })

      //get available bids against current requested booking
      .addCase(getAvailableBids.pending, (state: any) => {
        state.status = true;
      })
      .addCase(getAvailableBids.fulfilled, (state: any, action) => {
        state.status = false;
      })
      .addCase(getAvailableBids.rejected, (state: any, action) => {
        state.status = false;
        state.error = action.error.message;
      })

      // against current requested booking
      .addCase(postingAcceptedBid.pending, (state: any) => {
        state.status = true;
      })
      .addCase(postingAcceptedBid.fulfilled, (state: any, action) => {
        state.status = false;
      })
      .addCase(postingAcceptedBid.rejected, (state: any, action) => {
        state.status = false;
        state.error = action.error.message;
      })

      //getting total users for chats
      .addCase(getAllUsers.pending, (state: any, action) => {
        if (action?.meta?.arg?.currentPage === 1) {
          state.status = true;
        }
      })
      .addCase(getAllUsers.fulfilled, (state: any, action) => {
        state.status = false;
      })
      .addCase(getAllUsers.rejected, (state: any, action) => {
        state.status = false;
        state.error = action.error.message;
      })

      //getting previous chats(under process for pagination)
      .addCase(getAllUsersPreviousChat.pending, (state: any, action) => {
        // if (action?.meta?.arg?.currentPage === 1) {
        state.status = true;
        // }
      })
      .addCase(getAllUsersPreviousChat.fulfilled, (state: any, action) => {
        state.status = false;
      })
      .addCase(getAllUsersPreviousChat.rejected, (state: any, action) => {
        state.status = false;
        state.error = action.error.message;
      })

      //create new chat
      .addCase(createPrivateChat.pending, (state: any, action) => {
        state.status = true;
      })
      .addCase(createPrivateChat.fulfilled, (state: any, action) => {
        state.status = false;
      })
      .addCase(createPrivateChat.rejected, (state: any, action) => {
        state.status = false;
        state.error = action.error.message;
      })

      //getting previous one to one chats
      .addCase(getAllOneToOneChats.pending, (state: any, action) => {
        state.status = true;
      })
      .addCase(getAllOneToOneChats.fulfilled, (state: any, action) => {
        state.status = false;
      })
      .addCase(getAllOneToOneChats.rejected, (state: any, action) => {
        state.status = false;
        state.error = action.error.message;
      });
  },
});

export const {
  resetData,
  resetRegisteration,
  saveLoginData,
  isLoader,
  notificationData,
} = dataSlice.actions;
export default dataSlice.reducer;
