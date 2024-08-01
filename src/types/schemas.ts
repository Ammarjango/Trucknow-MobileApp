import * as yup from 'yup';

export const keyboardType = 'visible-password'; // keyboardType for emojis revoking
export const CreateUserSchema = yup.object().shape({
  firstname: yup.string().required('First Name is required'),
  lastname: yup.string().required('Last Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  address: yup.string().required('Address Name is required'),
  phoneno: yup.string().required('Number is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  //@ts-ignore
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

export const enterPhoneForRegSchema = yup.object().shape({
  phoneno: yup
    .string()
    .min(10, 'Phone must be at least 10 numbers')
    .required('Phone is required'),
});

export const loginValidationSchema = yup.object().shape({
  phoneNo: yup.string().required('Phone is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const forgetPassSchema = yup.object().shape({
  phoneno: yup.string().required('Phone is required'),
});

export const resetPassSchema = yup.object().shape({
  otp: yup.string().required('OTP is required'),
  password: yup.string().required('password is required'),
});

export const userProfileSchema = yup.object().shape({
  firstname: yup.string().required('First Name is required'),
  lastname: yup.string().required('Last Name is required'),
  userName: yup.string().required('userName is required'),
  phone: yup.number().required('phone is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  address: yup.string().required('address is required'),
});
