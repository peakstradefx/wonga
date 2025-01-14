"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "../icons"
import { Button } from "@/components/ui/button"
import { Controller, useForm } from "react-hook-form"
import FormControl from "../FormControl"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { toast } from "sonner"
import useCreateAccount from "@/hooks/mutations/auth/useCreateAccount"
import { useRouter } from "next/navigation"
import { countries } from "@/data/countryData"

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>

export function CreateAccountForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const { register, handleSubmit, control, formState: { errors }, watch, setValue } = useForm<CreateAccountPayload>({
    mode: "onChange", defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      country: "",
      phoneNumber: "",
      password: "",
      confirmPassword: ""
    }
  });

  const router = useRouter();

  const { mutate } = useCreateAccount()

  const onSubmit = (data: CreateAccountPayload) => {
    setIsLoading(true)

    mutate(data, {
      onSuccess: (response) => {
        toast.success(response.data.message)
        router.push("/auth/login")
        setIsLoading(false)
      },
      onError: (error: ErrorResponse) => {
        setIsLoading(false)
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
        toast.error(errorMessage)
        console.log(error)
      }
    })
  }

  const passwordValue = watch('password');


  return (
    <div className={cn("grid gap-4", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <Controller
            name="firstName"
            control={control}
            rules={{ required: "First Name is required" }}
            render={({ field }) => (
              <FormControl
                as='input'
                labelText='First Name'
                placeholder='Enter first name'
                {...field}
                error={getErrorMessage(errors.firstName)}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            rules={{ required: "Last Name is required" }}
            render={({ field }) => (
              <FormControl
                as='input'
                labelText='Last Name'
                placeholder='Enter last name'
                {...field}
                error={getErrorMessage(errors.lastName)}
              />
            )}
          />
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
          <FormControl
            as="select"
            inputStyle
            options={countries}
            labelText='Country'
            placeholder="Select Country"
            error={typeof errors.country?.message === 'string' ? errors.country.message : undefined}
            {...register('country', { required: 'Country is required' })}
            setValue={setValue}
          />
          <Controller
            name="phoneNumber"
            control={control}
            rules={{
              required: "Phone Number is required",
              pattern: { value: /^[0-9]*$/, message: 'Only numbers are allowed' },
              // minLength: { value: 10, message: 'Phone Number must be 11 digits' },
              // maxLength: { value: 11, message: 'Phone Number must be 11 digits' }
            }}
            render={({ field }) => (
              <FormControl
                as='input'
                labelText='Phone Number'
                placeholder='Enter your Phone Number'
                {...field}
                error={typeof errors.phoneNumber?.message === 'string' ? errors.phoneNumber.message : undefined}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: { value: 8, message: "Password must be at least 8 characters" },
              validate: {
                hasUpperCase: (value) =>
                  /[A-Z]/.test(value) || "Password must contain at least one uppercase letter",
                hasLowerCase: (value) =>
                  /[a-z]/.test(value) || "Password must contain at least one lowercase letter",
                hasNumber: (value) =>
                  /[0-9]/.test(value) || "Password must contain at least one number",
                hasSpecialChar: (value) =>
                  /[!@#$%^&*(),.?":{}|<>]/.test(value) || "Password must contain at least one special character",
              }
            }}
            render={({ field }) => (
              <FormControl
                className='w-full'
                as='input'
                labelText='Password'
                placeholder='Enter password'
                type='password'
                {...field}
                error={getErrorMessage(errors.password)}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: "Confirm password is required",
              validate: value => value === passwordValue || "Passwords do not match"
            }}
            render={({ field }) => (
              <FormControl
                className='w-full'
                as='input'
                labelText='Confirm Password'
                placeholder='Confirm password'
                type='password'
                {...field}
                error={getErrorMessage(errors.confirmPassword)}
              />
            )}
          />
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Register
          </Button>
        </div>
      </form>
    </div>
  )
}