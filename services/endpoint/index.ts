// AUTH
export const CREATE_ACCOUNT = "/auth/create-account";

export const VERIFY_REGISTRATION = "/auth/verify/registration";
export const VERIFY_TOKENS = (id: string, code: string) =>
  `/auth/verify/tokens?id=${id}&code=${code}`;
export const RESEND_OTP = "/auth/request-new-code";

export const RESET_PASSWORD = "/auth/reset-password";

export const VERIFY_OTP = "/auth/verify-reset-code";

// ADD PAYMENT
export const PAYMENT = "/payment";

// INVESTMENT
export const INVESTMENT = "/create-investment";
export const INVESTMENT_INFORMATION = "/investment-profit";

// WITHDRAWAL
export const WITHDRAWAL = "/withdrawal";

// KYC
export const KYC = "/kyc";

// USERS
export const USERS = "/users";

// USER DETAILS
export const USER_DETAILS = (userId: string) => `/users/${userId}`;

// ACTIVATE USER'S ACCOUNT BY ADMIN
export const ACTIVATE_USER = "/activate-user";
