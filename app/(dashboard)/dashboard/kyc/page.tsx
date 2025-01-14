"use client"
import DashboardContainer from '@/components/dashboard/DashboardContainer'
import FormControl from '@/components/FormControl'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useSubmitKYC from '@/hooks/mutations/useSubmitKYC'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { toast } from 'sonner'

function KYCPage() {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const { handleSubmit, register, formState: { errors }, setValue } = useForm<FieldValues>({ mode: "onChange" });

    const router = useRouter();
    const { mutate } = useSubmitKYC();

    const onSubmit = (data: FieldValues) => {
        const formData = new FormData();
        formData.append('documentType', data.documentType);
        formData.append('idFront', data.idFrontImg[0]);
        formData.append('idBack', data.idBackImg[0]);

        setIsLoading(true);

        mutate(formData, {
            onSuccess: (response) => {
                toast.success(response.data.message);
                router.push("/dashboard");
                setIsLoading(false);
            },
            onError: (error) => {
                const axiosError = error as AxiosError<{ message: string }>;
                toast.error(axiosError?.response?.data.message);
                setIsLoading(false);
            }
        });
    };
    const documentTypeOption = [
        { id: 1, value: "internationalPassport", name: "International Passport" },
        { id: 2, value: "driversLicense", name: "Driver's License" },
        { id: 3, value: "others", name: "Others (Govt. approved)" },
    ];


    return (
        <DashboardContainer>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">KYC Verification</h2>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl font-semibold tracking-tight">Upload a valid identity document for verification.</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-[320px]' encType="multipart/form-data">
                        <FormControl
                            as="select"
                            inputStyle
                            options={documentTypeOption}
                            labelText='Select identity document'
                            placeholder="Select identity document"
                            {...register('documentType', { required: 'Document type is required' })}
                            error={typeof errors.documentType?.message === 'string' ? errors.documentType.message : undefined}
                            setValue={setValue}
                        />
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mt-4'>
                                Upload front image of ID
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                className="mt-1 block w-full border p-1 rounded-md text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 hover:file:bg-gray-200"
                                {...register("idFrontImg", {
                                    required: 'Front image of ID is required',
                                    validate: {
                                        fileType: (files) => files && files[0]?.type.startsWith('image/') || 'Only image files are allowed',
                                        fileSize: (files) => files && files[0]?.size <= 5 * 1024 * 1024 || 'File size must be less than 5MB'
                                    }
                                })}
                            />
                            {errors.idFrontImg && (
                                <p className="mt-1 text-red-600 text-xs">
                                    {typeof errors.idFrontImg.message === 'string' ? errors.idFrontImg.message : 'An error occurred'}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mt-4'>
                                Upload back image of ID
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                className="mt-1 block w-full border p-1 rounded-md text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 hover:file:bg-gray-200"
                                {...register("idBackImg", {
                                    required: 'Back image of ID is required',
                                    validate: {
                                        fileType: (files) => files && files[0]?.type.startsWith('image/') || 'Only image files are allowed',
                                        fileSize: (files) => files && files[0]?.size <= 5 * 1024 * 1024 || 'File size must be less than 5MB'
                                    }
                                })}
                            />
                            {errors.idBackImg && (
                                <p className="mt-1 text-red-600 text-xs">
                                    {typeof errors.idBackImg.message === 'string' ? errors.idBackImg.message : 'An error occurred'}
                                </p>
                            )}
                        </div>
                        <div className='mt-4 w-full'>
                            <Button className='w-full' disabled={isLoading}>
                                {isLoading && (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Submit
                            </Button>
                        </div>
                    </form>

                </CardContent>
            </Card>
        </DashboardContainer>
    )
}

export default KYCPage
