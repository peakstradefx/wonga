"use client"
import * as React from "react"
import { cn } from "@/lib/utils"
import { Icons } from "../icons"
import { Button } from "@/components/ui/button"
import { Controller, FieldValues, useForm } from "react-hook-form"
import FormControl from "../FormControl"
import { InputCode } from "../ui/InputCode"
import useVerifyOTPCode from "@/hooks/mutations/auth/useVerifyOTPCode"
import { toast } from "sonner"
import { useSearchParams, useRouter } from "next/navigation"
import useSendPasswordResetCode from "@/hooks/mutations/auth/useSendPasswordResetCode"
import useResetPassword from "@/hooks/mutations/auth/useResetPassword"
import { AxiosError } from "axios"

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>

export function ResetPasswordForm({ className, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [isVerified, setIsVerified] = React.useState<boolean>(false)
    const [verifiedCode, setVerifiedCode] = React.useState<string>("")
    const router = useRouter()

    const searchParams = useSearchParams()
    const email = searchParams.get("email") || ""

    // Form for OTP verification
    const {
        handleSubmit: handleOtpSubmit,
        control: otpControl,
        formState: { errors: otpErrors },
    } = useForm<FieldValues>({
        mode: "onChange",
        defaultValues: {
            otp: ''
        }
    });

    // Form for new password
    const {
        handleSubmit: handlePasswordSubmit,
        control: passwordControl,
        formState: { errors: passwordErrors },
        watch
    } = useForm<FieldValues>({
        mode: "onChange",
        defaultValues: {
            newPassword: '',
            confirmPassword: ''
        }
    });

    const passwordValue = watch('newPassword', '');

    const { mutate: verifyOTPMutation, isPending } = useVerifyOTPCode()

    const { mutate: resendOTPMutation, isPending: isResetPasswordPending } = useResetPassword();

    const { mutate, isPending: isResendOTPPending } = useSendPasswordResetCode()

    const onResendOTP = (data: { email: string }) => {
        mutate(data, {
            onSuccess: () => {
                toast.success("Code resent successfully")
            },
            onError: (error) => {
                const axiosError = error as AxiosError<{ message: string }>;
                toast.error(axiosError?.response?.data?.message)
            }
        })
    }

    const onVerifyOtp = (data: FieldValues) => {
        setIsLoading(true);
        const payload = {
            email,
            code: data.otp
        }
        verifyOTPMutation(payload, {
            onSuccess: (response) => {
                setVerifiedCode(data.otp)
                setIsVerified(true)
                toast.success(response.data.message)
                setIsLoading(false)
            },
            onError: (error) => {
                const axiosError = error as AxiosError<{ message: string }>;
                setIsLoading(false)
                toast.error(axiosError.response?.data?.message || 'An error occurred')
            }
        })
    }

    const onResetPassword = (data: FieldValues) => {
        setIsLoading(true);

        if (!verifiedCode) {
            setIsLoading(false)
            toast.error('Please verify your OTP code first')
            return
        }

        const payload = {
            email,
            code: verifiedCode,
            newPassword: data.newPassword
        }

        resendOTPMutation(payload, {
            onSuccess: (response) => {
                toast.success(response.data.message)
                setVerifiedCode("")
                router.push('/auth/login');
                setIsLoading(false)
            },
            onError: (error) => {
                const axiosError = error as AxiosError<{ message: string }>;
                setIsLoading(false)
                toast.error(axiosError.response?.data?.message || 'An error occurred')
            }
        })
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            {!isVerified && (
                <form onSubmit={handleOtpSubmit(onVerifyOtp)}>
                    <div className="grid gap-4">
                        <Controller
                            name="otp"
                            control={otpControl}
                            rules={{
                                required: "Verification code is required",
                                minLength: {
                                    value: 6,
                                    message: "Please enter all 6 digits"
                                }
                            }}
                            render={({ field }) => (
                                <div className="flex flex-col items-center justify-center">
                                    <InputCode
                                        length={6}
                                        onChange={field.onChange}
                                        value={field.value}
                                    />
                                    {otpErrors.otp && (
                                        <p className="text-red-500 text-sm mt-2">
                                            {otpErrors.otp?.message?.toString()}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                        <div className="flex justify-center items-center gap-2"> Code hasn&apos;t arrived?{' '}
                            <Button
                                type="button"
                                variant="link"
                                className="p-0"
                                onClick={() => {
                                    onResendOTP({ email })
                                }}
                                disabled={isResendOTPPending}
                            >
                                Resend Code
                            </Button>
                        </div>

                        <Button disabled={isLoading || isPending}>
                            {(isLoading || isPending) ? (
                                <>
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify Code"
                            )}
                        </Button>
                    </div>
                </form>
            )
            }
            {isVerified && (
                <form onSubmit={handlePasswordSubmit(onResetPassword)}>
                    <div className="grid gap-4">
                        <Controller
                            name="newPassword"
                            control={passwordControl}
                            rules={{
                                required: "New password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters",
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                    message:
                                        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                                },
                            }}
                            render={({ field }) => (
                                <FormControl
                                    as="input"
                                    type="password"
                                    labelText="New Password"
                                    placeholder="Enter new password"
                                    error={passwordErrors.newPassword?.message as string}
                                    {...field}
                                />
                            )}
                        />

                        <Controller
                            name="confirmPassword"
                            control={passwordControl}
                            rules={{
                                required: "Please confirm your password",
                                validate: (value) =>
                                    value === passwordValue || "Passwords do not match"
                            }}
                            render={({ field }) => (
                                <FormControl
                                    as="input"
                                    type="password"
                                    labelText="Confirm Password"
                                    placeholder="Confirm your new password"
                                    error={passwordErrors.confirmPassword?.message as string}
                                    {...field}
                                />
                            )}
                        />

                        <Button disabled={isResetPasswordPending}>
                            {isResetPasswordPending ? (
                                <>
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                    Resetting Password...
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    )
}