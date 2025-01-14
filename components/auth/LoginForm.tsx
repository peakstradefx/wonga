"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "../icons"
import { Button } from "@/components/ui/button"
import { Controller, FieldValues, useForm } from "react-hook-form"
import FormControl from "../FormControl"
import Link from "next/link"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { toast } from "sonner"
import { getSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { AxiosError } from "axios"

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>

export function LoginForm({ className, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [redirectTo, setRedirectTo] = React.useState("/dashboard");

    const { handleSubmit, control, formState: { errors } } = useForm<FieldValues>({ mode: "onChange", defaultValues: { email: "", password: "" } });

    React.useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const from = searchParams.get("from");
        if (from) {
            setRedirectTo(from);
        }
    }, []);

    const router = useRouter()

    const onSubmit = async (data: FieldValues) => {
        const email = data.email;
        const password = data.password;
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.ok) {
                toast.success("Login successful!");

                const session = await getSession();

                if (session?.user?.role === "user") {
                    router.push(redirectTo);
                } else if (session?.user?.role === "admin") {
                    router.push("/admin");
                }
            } else if (result?.error) {
                switch (result.error) {
                    case "CredentialsSignin":
                        toast.error("Invalid credentials. Please try again.");
                        break;
                    default:
                        toast.error(result.error || "An unexpected error occurred");
                }
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            toast.error(`An unexpected error occurred: ${axiosError.message}`);
        } finally {
            setIsLoading(false);
        }
    };

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
                    <Controller
                        name="password"
                        control={control}
                        rules={{
                            required: "Password is required"
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
                    <div className='text-sm'>
                        <Link href={"/auth/forgot-password"} className='font-bold hover:opacity-80 ml-1 text-primary'>
                            Forgot password?
                        </Link>
                    </div>
                    <Button disabled={isLoading}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Login
                    </Button>
                </div>
            </form>
        </div>
    )
}