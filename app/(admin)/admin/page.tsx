"use client";
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SkeletonTable from '@/components/dashboard/SkeletonTable';
import ReusableTable from '@/components/dashboard/Table';
import { formatDateTime } from '@/utils/formatDateAndTime';
import useGetUsers from '@/hooks/queries/useGetUsers';
import { Eye, LogOut, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import Link from 'next/link';
import DeleteUserModal from '@/components/admin/DeleteUserModal';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { logo } from "@/public/assets/images";

type DataRow = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    investmentStatus: string;
};

const AdminPage = () => {
    const { data, isLoading } = useGetUsers()

    const tableData =
        (data?.data ?? []).map((item: {
            _id: string;
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber: string;
            investmentStatus: string;
            status: string;
            createdAt: string;
        }) => ({
            id: item._id,
            name: `${item.firstName} ${item.lastName}`,
            email: item.email,
            phoneNumber: item.phoneNumber,
            date: formatDateTime(item.createdAt),
        })) as DataRow[];

    const columns: ColumnDef<DataRow>[] = [
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'email', header: 'Email' },
        { accessorKey: 'phoneNumber', header: 'Phone Number' },
        { accessorKey: 'date', header: 'Date created' },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <HoverCard>
                        <HoverCardTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-40">
                            <div className="flex flex-col gap-2">
                                <Link href={`/admin/user/${user.id}`}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start"
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Details
                                    </Button>
                                </Link>
                                <DeleteUserModal userId={user.id.toString()} />
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                );
            },
        },
    ];


    return (
        <section className='p-2 lg:px-10 py-6'>
            <div className="flex justify-">
                <Link href={"/"} className="relative z-20 flex items-center text-lg font-medium">
                    <Image src={logo} width={250} height={82} alt="PeakTrade fx logo" />
                </Link>
            </div>
            <div className='flex w-full justify-between items-center my-4'>
                <h1 className='text-3xl font-semibold'>Welcome, Admin</h1>
                <button
                    className="px-4 py-2 text-red-600 font-semibold inline-flex items-center gap-2 rounded-sm hover:bg-sidebar-accent w-fit mt-4"
                    onClick={() => signOut({callbackUrl: "/auth/login"})}
                >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <SkeletonTable columnsCount={columns.length} rowsCount={5} />
                    ) : tableData.length === 0 ? (
                        <div className="py-10 text-center text-lg text-muted-foreground">
                            No User data
                        </div>
                    ) : (
                        <ReusableTable data={tableData} columns={columns} />
                    )}
                </CardContent>
            </Card>
        </section >
    );
};

export default AdminPage;
