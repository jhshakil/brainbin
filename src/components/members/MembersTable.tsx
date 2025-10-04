/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import {
  type CellContext,
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { TUserData, TUserRole, TUserStatus } from "@/types/auth";
import DeleteMemberConfirmation from "./DeleteMemberConfirmation";
import { updateMemberRole, updateMemberStatus } from "@/services/AuthService";
import { useAuth } from "@/context/auth.provider";

type Props = {
  users: TUserData[];
};

const MembersTable = ({ users }: Props) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<TUserData[]>(users);

  // update status or role
  const updateUserRole = async (userId: string, value: TUserRole) => {
    setUserData((prev) =>
      prev.map((user) =>
        user._id === userId ? { ...user, role: value } : user
      )
    );

    const res = await updateMemberRole({ _id: userId, role: value });
    if (res.success) {
      toast.success(`role updated successfully`);
    }
  };
  const updateUserStatus = async (userId: string, value: TUserStatus) => {
    setUserData((prev) =>
      prev.map((user) =>
        user._id === userId ? { ...user, status: value } : user
      )
    );

    const res = await updateMemberStatus({ _id: userId, status: value });
    if (res.success) {
      toast.success(`status updated successfully`);
    }
  };

  useEffect(() => {
    if (users) setUserData(users);
  }, [users]);

  const columns: ColumnDef<TUserData>[] = [
    {
      accessorKey: "name",
      header: () => <div className="pl-4 text-left">Name</div>,
      cell: ({ row }) => {
        const member = row.original;
        return <div className="pl-4">{member.name}</div>;
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    ...(user?.role === "admin"
      ? [
          {
            accessorKey: "role",
            header: "Role",
            cell: (context: CellContext<TUserData, any>) => {
              const user = context.row.original;
              return (
                <Select
                  value={user.role}
                  onValueChange={(val: TUserRole) =>
                    updateUserRole(user._id as string, val)
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              );
            },
          },
          {
            accessorKey: "status",
            header: "Status",
            cell: (context: CellContext<TUserData, any>) => {
              const user = context.row.original;
              return (
                <Select
                  value={user.status}
                  onValueChange={(val: TUserStatus) =>
                    updateUserStatus(user._id as string, val)
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              );
            },
          },
          {
            id: "actions",
            header: () => <div className="text-right pr-4">Actions</div>,
            cell: (context: CellContext<TUserData, any>) => {
              const user = context.row.original;
              return (
                <div className="flex justify-end">
                  <DeleteMemberConfirmation
                    memberId={user._id as string}
                    memberName={user.name}
                  />
                </div>
              );
            },
          },
        ]
      : [
          {
            accessorKey: "role",
            header: "Role",
          },
        ]),
  ];

  const table = useReactTable({
    data: userData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row._id as string,
  });

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="group hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MembersTable;
