interface CustomUser {
  id: string;
  firstName: string;
  lastName: string;
  role: String;
  email: string;
  token: string;
}

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

interface CreateAccountPayload {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}
interface MakePaymentProps {
  amount: number;
  wallet: string;
  proof: string;
}

interface ErrorResponse {
  response?: {
    data: {
      message: string;
    };
  };
  message: string;
}
