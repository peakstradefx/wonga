"use client"
import React from 'react'
import { Button } from '../ui/button'
import { getErrorMessage } from '@/utils/getErrorMessage'
import FormControl from '../FormControl'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Icons } from '../icons'

function ContactUsForm() {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const { handleSubmit, control, formState: { errors } } = useForm<FieldValues>({
        mode: "onChange", defaultValues: {
            name: "",
            email: "",
            message: "",
        }
    });
    const onSubmit = () => {
        setIsLoading(true)
        setTimeout(() => {
            toast.success("Your message has been sent successfully!")
            setIsLoading(false)
        }, 3000)
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 p-5 lg:p-11 lg:rounded-r-2xl rounded-2xl">
            <h2 className="text-indigo-700 text-2xl md:text-4xl font-bold font-manrope leading-normal text-center mb-4">Send Us A Message</h2>
            <div className='flex flex-col gap-4'>

                <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Name is required" }}
                    render={({ field }) => (
                        <FormControl
                            as='input'
                            labelText='Name'
                            placeholder='Enter name'
                            {...field}
                            error={getErrorMessage(errors.name)}
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
                <Controller
                    name="message"
                    control={control}
                    rules={{ required: "Message is required" }}
                    render={({ field }) => (
                        <FormControl
                            as='textarea'
                            labelText='Message'
                            placeholder='Enter message'
                            {...field}
                            error={getErrorMessage(errors.message)}
                        />
                    )}
                />
            </div>
            <div className='mt-4 flex justify-center'>
                <Button type='submit' disabled={isLoading} className='min-w-[150px]'>
                    {isLoading && (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Submit
                </Button>
            </div>
        </form>
    )
}

export default ContactUsForm
