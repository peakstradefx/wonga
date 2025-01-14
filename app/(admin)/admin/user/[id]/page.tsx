"use client"
import ViewDepositReceiptModal from '@/components/admin/ViewDepositReceiptModal';
import ViewKYCModal from '@/components/admin/ViewKYCModal';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import useActivateUser from '@/hooks/mutations/useActivatedUser';
import useGetUserDetails from '@/hooks/queries/useGetUserDetails';
import { formatWithCommas } from '@/utils/formatNumberWithComma';
import { ArrowLeftCircle } from 'lucide-react';
import Link from 'next/link';
import React, { use } from 'react';
import { toast } from 'sonner';

function DetailSkeleton() {
    return (
        <div className='grid grid-cols-2 gap-3 text-base md:text-lg'>
            <span className='font-semibold text-gray-600'>
                <Skeleton className="h-6 w-32" />
            </span>
            <Skeleton className="h-6 w-40" />
        </div>
    );
}

function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const unwrappedParams = use(params);
    const { id } = unwrappedParams;
    const { data, isLoading: isUserDataLoading } = useGetUserDetails(id)
    const userDetails = data?.data

    const { mutate } = useActivateUser()

    const activateUser = () => {
        setIsLoading(true);
        mutate(
            { userId: id, activate: true },
            {
                onSuccess: (data) => {
                    toast.success(data.message);
                    setIsLoading(false);
                },
                onError: (error) => {
                    if (error instanceof Error) {
                        toast.error(error.message);
                    } else {
                        toast.error('Failed to activate user');
                    }
                    setIsLoading(false);
                }
            }
        );
    };

    const deactivateUser = () => {
        setIsLoading(true);
        mutate({ userId: id, activate: false }, {
            onSuccess: (response) => {
                toast.success(response.message);
                setIsLoading(false);
            },
            onError: (error) => {
                toast.error((error as { response?: { data: { message: string } } }).response?.data.message);
                console.log(error)
                setIsLoading(false);
            }
        });
    };

    return (
        <section className="p-6 lg:p-10">
            <Link href="/admin" className='flex items-center gap-1 mb-4'><ArrowLeftCircle />Back</Link>
            <Card>
                <CardHeader>
                    <CardTitle>User Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='w-full lg:max-w-[40%] flex flex-col gap-4'>
                        {isUserDataLoading ? (
                            <>
                                <DetailSkeleton />
                                <DetailSkeleton />
                                <DetailSkeleton />
                                <DetailSkeleton />
                                <DetailSkeleton />
                                <DetailSkeleton />
                                <DetailSkeleton />
                                <DetailSkeleton />
                                <DetailSkeleton />
                            </>
                        ) : (
                            <>
                                <div className='grid grid-cols-2 gap-3 text-base md:text-lg'>
                                    <span className='font-semibold text-gray-600'>Full Name:</span>
                                    <span>{userDetails?.user.firstName}{" "}{userDetails?.user.lastName}</span>
                                </div>
                                <div className='grid grid-cols-2 gap-3 text-base md:text-lg'>
                                    <span className='font-semibold text-gray-600'>Email:</span>
                                    <span>{userDetails?.user.email}</span>
                                </div>
                                <div className='grid grid-cols-2 gap-3 text-base md:text-lg'>
                                    <span className='font-semibold text-gray-600'>Account Balance:</span>
                                    <span>{`$${formatWithCommas(userDetails?.investment.accountBalance)}`}</span>
                                </div>
                                <div className='grid grid-cols-2 gap-3 text-base md:text-lg'>
                                    <span className='font-semibold text-gray-600'>Investment Package:</span>
                                    <span>{userDetails?.investment.package}</span>
                                </div>
                                <div className='grid grid-cols-2 gap-3 text-base md:text-lg'>
                                    <span className='font-semibold text-gray-600'>Investment Amount:</span>
                                    <span>{`$${formatWithCommas(userDetails?.investment.investmentAmount)}`}</span>
                                </div>
                                <div className='grid grid-cols-2 gap-3 text-base md:text-lg'>
                                    <span className='font-semibold text-gray-600'>Profit:</span>
                                    <span>{`$${formatWithCommas(userDetails?.investment.totalProfit)}`}</span>
                                </div>
                                <div className='grid grid-cols-2 gap-3 text-base md:text-lg'>
                                    <span className='font-semibold text-gray-600'>Deposit Verification:</span>
                                    <div className='flex gap-2'>
                                        <ViewDepositReceiptModal depositDetails={userDetails?.depositDetails} name={userDetails?.user?.firstName} />
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-3 text-base md:text-lg'>
                                    <span className='font-semibold text-gray-600'>Withdrawal Verification:</span>
                                    <div className='flex gap-2'>
                                        {/* <ViewDepositReceiptModal depositDetails={userDetails?.depositDetails} /> */}
                                        <Button className='h-9 text-sm'>Verify withdrawal</Button>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-3 text-base md:text-lg'>
                                    <span className='font-semibold text-gray-600'>KYC Verification:</span>
                                    <div className='flex gap-2'>
                                        <ViewKYCModal KYCDetails={userDetails?.kyc} />
                                        {/* <Button className='h-9 text-sm'>Verify KYC</Button> */}
                                    </div>
                                </div>
                            </>
                        )}
                        <div className='flex ml-10 mt-10'>
                            {userDetails && (<>
                                {userDetails?.user.isActivatedByAdmin ? (
                                    <Button disabled={isLoading} onClick={deactivateUser} variant={'destructive'} className='ml-4'>
                                        {isLoading && (
                                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Deactivate Account
                                    </Button>
                                ) : (
                                    <Button disabled={isLoading} onClick={activateUser} className='bg-green-700 hover:bg-green-700/80'>
                                        {isLoading && (
                                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Activate Account
                                    </Button>
                                )}
                            </>)}

                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}

export default UserDetailsPage;