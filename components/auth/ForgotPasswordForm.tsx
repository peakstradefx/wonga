"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "../icons"
import { Button } from "@/components/ui/button"
import { Controller, useForm } from "react-hook-form"
import FormControl from "../FormControl"
import { getErrorMessage } from "@/utils/getErrorMessage"
import useSendPasswordResetCode from "@/hooks/mutations/auth/useSendPasswordResetCode"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { AxiosError } from "axios"

interface ResetPasswordPayload {
    email: string;
}

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>

export function ForgotPasswordForm({ className, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const { handleSubmit, control, formState: { errors } } = useForm<ResetPasswordPayload>({ mode: "onChange", defaultValues: { email: "" } });

    const router = useRouter()

    const { mutate } = useSendPasswordResetCode()

    const onSubmit = (data: ResetPasswordPayload) => {
        setIsLoading(true)
        mutate(data, {
            onSuccess: (response) => {
                toast.success(response?.data?.message)
                router.push(`/auth/reset-password?email=${data.email}`)
                setIsLoading(false)
            },
            onError: (error) => {
                const axiosError = error as AxiosError<{ message: string }>;
                toast.error(axiosError?.response?.data?.message)
                setIsLoading(false)
            }
        })
    }

    return (
        <div className={cn("grid gap-4", className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                    <Controller
                        name="email"
                        control={control}
                        rules={{
                            required: "Email is required",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Please enter a valid email address",
                            }
                        }}
                        render={({ field }) => (
                            <FormControl
                                as='input'
                                labelText='Email Address'
                                placeholder='Enter your email address'
                                type='email'
                                {...field}
                                error={getErrorMessage(errors.email)}
                            />
                        )}
                    />
                    <Button disabled={isLoading}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    )
}