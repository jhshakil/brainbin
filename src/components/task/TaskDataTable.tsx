/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import CreateTaskForm from "../form/CreateTaskForm";
import UpdateTaskForm from "../form/UpdateTaskForm";
import type { TStatus, TTask } from "@/types/task";
import { useAuth } from "@/context/auth.provider";
import DeleteTaskConfirmation from "./DeleteTaskConfirmation";
import { updateTask } from "@/services/TaskServices";
import { toast } from "sonner";

type Props = {
  tasks: TTask[];
  setUpdateState: (value: boolean) => void;
  setAllQuery?: (query: Record<string, any>) => void;
};

const TaskDataTable = ({ tasks, setUpdateState, setAllQuery }: Props) => {
  const { allUsers } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [taskData, setTaskData] = useState<TTask[]>(tasks);

  const updateTaskStatus = async (taskId: string, newStatus: TStatus) => {
    setTaskData((prev) =>
      prev.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      )
    );
    const resData = await updateTask({ _id: taskId, status: newStatus });
    if (resData.success) {
      toast.success("Task status updated successfully");
    }
  };

  useEffect(() => {
    if (tasks) {
      setTaskData(tasks);
    }
  }, [tasks]);

  const columns: ColumnDef<TTask>[] = [
    // Title column
    {
      accessorKey: "title",
      header: () => <div className="pl-4 text-left">Title</div>,
      cell: ({ row }) => {
        const task = row.original;
        return <div className="pl-4">{task.title}</div>;
      },
    },

    // Details column with truncated text + View popup
    {
      accessorKey: "details",
      header: "Details",
      cell: ({ row }) => {
        const task = row.original;

        if (!task.details) return null;

        const isLong = task.details.length > 50;
        const truncated = isLong
          ? task.details.slice(0, 50) + "..."
          : task.details;

        return (
          <div className="flex items-center">
            <span>{truncated} </span>
            {isLong && (
              <span
                onClick={() => setIsOpen(true)}
                className="text-blue-500 cursor-pointer hover:underline ml-1"
              >
                see more
              </span>
            )}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{task.title}</DialogTitle>
                  <DialogDescription>{task.details}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button onClick={() => setIsOpen(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
    // Status column
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const task = row.original;
        return (
          <Select
            value={task.status}
            onValueChange={(value: TStatus) =>
              updateTaskStatus(task._id, value)
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Complete">Complete</SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },

    // Assign To column
    {
      accessorKey: "assignTo",
      header: "Assign To",
      cell: ({ row }) => {
        const assignedUser = allUsers?.find(
          (user) => user._id === row.original.assignTo
        );

        if (!assignedUser) {
          return <div className="text-muted-foreground">Unassigned</div>;
        }

        return (
          <div>
            <p className="font-medium">{assignedUser.name}</p>
            <p className="text-sm text-muted-foreground">
              {assignedUser.email}
            </p>
          </div>
        );
      },
    },

    // Actions column
    {
      id: "actions",
      header: () => <div className="text-right pr-4">Actions</div>,
      cell: ({ row }) => {
        const task = row.original;
        return (
          <div className="flex justify-end pr-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                {/* Update Dialog */}
                <UpdateTaskForm task={task} setUpdateState={setUpdateState} />

                <DropdownMenuSeparator />

                {/* Delete Dialog */}
                <DeleteTaskConfirmation
                  taskId={task._id}
                  taskTitle={task.title}
                  setUpdateState={setUpdateState}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: taskData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row._id, // use MongoDB _id
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-end py-4">
        <CreateTaskForm />
      </div>
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
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default TaskDataTable;
