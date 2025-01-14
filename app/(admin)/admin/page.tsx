"use client";
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SkeletonTable from '@/components/dashboard/SkeletonTable';
import ReusableTable from '@/components/dashboard/Table';
import { formatDateTime } from '@/utils/formatDateAndTime';
import useGetUsers from '@/hooks/queries/useGetUsers';
import { Eye, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import Link from 'next/link';
import DeleteUserModal from '@/components/admin/DeleteUserModal';

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
            investmentStatus: string;
            status: string;
            createdAt: string;
        }) => ({
            id: item._id,
            name: `${item.firstName} ${item.lastName}`,
            email: item.email,
            date: formatDateTime(item.createdAt),
        })) as DataRow[];

    const columns: ColumnDef<DataRow>[] = [
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'email', header: 'Email' },
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
        <section className='p-6 lg:p-10'>
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
        </section>
    );
};

export default AdminPage;
