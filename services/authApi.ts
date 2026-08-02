import { baseApi } from './baseApi';
import {
  AuthResponseData,
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  RefreshTokenInput,
  RegisterInput,
  ResetPasswordInput,
  User,
  VerifyOtpInput,
} from '@/types/auth';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /auth/register
    register: builder.mutation<User, RegisterInput>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data?: User } | User) => {
        if (!response) return response as User;
        if ('data' in response && response.data) return response.data;
        return response as User;
      },
    }),

    // POST /auth/login
    login: builder.mutation<AuthResponseData, LoginInput>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body: {
          email: body.email,
          password: body.password,
        },
      }),
      transformResponse: (response: { data?: AuthResponseData } | AuthResponseData) => {
        if (!response) return response as AuthResponseData;
        if ('data' in response && response.data) return response.data;
        return response as AuthResponseData;
      },
      invalidatesTags: ['Auth'],
    }),

    // GET /auth/me
    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      transformResponse: (response: { data?: User } | User) => {
        if (!response) return response as User;
        if ('data' in response && response.data) return response.data;
        return response as User;
      },
      providesTags: ['Auth'],
    }),

    // POST /auth/logout
    logout: builder.mutation<{ success: boolean; message?: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),

    // POST /auth/forgot-password
    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordInput>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    // POST /auth/verify-otp
    verifyOtp: builder.mutation<{ message: string }, VerifyOtpInput>({
      query: (body) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body,
      }),
    }),

    // POST /auth/reset-password
    resetPassword: builder.mutation<{ message: string }, ResetPasswordInput>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),

    // POST /auth/refresh-token
    refreshToken: builder.mutation<AuthResponseData, RefreshTokenInput | void>({
      query: (body) => ({
        url: '/auth/refresh-token',
        method: 'POST',
        body: body || {},
      }),
      transformResponse: (response: { data?: AuthResponseData } | AuthResponseData) => {
        if (!response) return response as AuthResponseData;
        if ('data' in response && response.data) return response.data;
        return response as AuthResponseData;
      },
    }),

    // PATCH /auth/change-password
    changePassword: builder.mutation<{ message: string }, ChangePasswordInput>({
      query: (body) => ({
        url: '/auth/change-password',
        method: 'PATCH',
        body,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useLogoutMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
  useChangePasswordMutation,
} = authApi;
