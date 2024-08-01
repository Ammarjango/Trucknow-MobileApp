export interface responseType {
    data: any[],
    loginData: any[],
    signupData: any[],
    forgetPassData: any[],
    enterPhoneData: any[],
    confirmOtpData: any[],
    resetPassData: any[],
    notifications: any,
    status: boolean,
    error: null | string,
}

export interface cerateUserRequest {
    firstname: string,
    lastname: string,
    email: string,
    address: string,
    phoneno: string,
    password: string,
    confirmPassword: string,
}

export interface autheniticateUserRequest {
    phoneNo: string | any | undefined,
    password: string,
    role: string,
}

export interface phoneForRegRequest {
    phoneno: string,
}

export interface confirmOtpForRegRequest {
    otp: string,
}

export interface forgetPassRequest {
    phoneno: string,
}

export interface resetPassRequest {
    otp?: string,
    password?: string,
}




