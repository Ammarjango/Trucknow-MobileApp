import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState: any = {
  UserData: {
    refreshToken: '',
    token: '',
    user: {
      email: '',
      fullName: '',
      firstName:'',
      lastname:'',
      userName:'',
      isPayment: false,
      Phone_no: '',
      id: 0,
      isLoggedIn: false,
      playerID:''
    },
  },
};
const appData = createSlice({
  name: 'allStates',
  initialState,
  reducers: {
    userData: (state, action: PayloadAction<any>) => {
      console.log('data::',action.payload);
      
      // return { ...state, UserData: action.payload };
    },
  },
});

export const { userData } =
  appData.actions;

export default appData.reducer;
