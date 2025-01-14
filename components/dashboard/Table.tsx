"use client"
import React, { useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    ColumnDef,
    SortingState,
} from '@tanstack/react-table';
import { Button } from '../ui/button';

type ReusableTableProps<T> = {
    data: T[];
    columns: ColumnDef<T, unknown>[];
};

const ReusableTable = <T extends object>({ data, columns }: ReusableTableProps<T>) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    const tableInstance = useReactTable({
        data,
        columns,
        state: {
            sorting,
            pagination,
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className='w-full overflow-x-auto'>
            <table className='w-full text-sm sm:text-base'>
                <thead className='bg-neutral-200 h-10'>
                    {tableInstance.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className='pl-4 text-left font-semibold whitespace-nowrap'>
                                    {header.isPlaceholder
                                        ? null
                                        : typeof header.column.columnDef.header === 'function'
                                            ? header.column.columnDef.header(header.getContext())
                                            : header.column.columnDef.header}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {tableInstance.getRowModel().rows.map((row) => (
                        <tr key={row.id} className='border-b border-neutral-300 h-10'>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className='pl-4 whitespace-nowrap'>
                                    {typeof cell.column.columnDef.cell === 'function'
                                        ? cell.column.columnDef.cell(cell.getContext())
                                        : cell.column.columnDef.cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='flex w-full items-center justify-between mt-6'>
                <Button variant="outline" onClick={() => tableInstance.previousPage()} disabled={!tableInstance.getCanPreviousPage()}>
                    Previous
                </Button>
                <span className='text-sm'>
                    Page {tableInstance.getState().pagination.pageIndex + 1} of{' '}
                    {tableInstance.getPageCount()}
                </span>
                <Button variant="outline" onClick={() => tableInstance.nextPage()} disabled={!tableInstance.getCanNextPage()}>
                    Next
                </Button>
            </div>
        </div>
    );
};

export default ReusableTable;
