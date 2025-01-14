"use client"
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonTableProps {
    columnsCount: number;
    rowsCount?: number;
}

const SkeletonTable: React.FC<SkeletonTableProps> = ({
    columnsCount,
    rowsCount = 5,
}) => {
    return (
        <table className="w-full text-sm sm:text-base">
            <thead className="bg-neutral-200 h-10">
                <tr>
                    {Array.from({ length: columnsCount }).map((_, colIndex) => (
                        <th
                            key={colIndex}
                            className="pl-4 text-left font-semibold whitespace-nowrap"
                        >
                            <Skeleton className="h-4 w-4/5" />
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {Array.from({ length: rowsCount }).map((_, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-neutral-300 h-10">
                        {Array.from({ length: columnsCount }).map((_, cellIndex) => (
                            <td key={cellIndex} className="pl-4 whitespace-nowrap">
                                <Skeleton className="h-4 w-4/5" />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default SkeletonTable;
