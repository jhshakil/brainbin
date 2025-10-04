/* eslint-disable react-refresh/only-export-components */

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
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
  DropdownMenuItem,
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

import CreateTaskForm from "./form/CreateTaskForm";
import UpdateTaskForm from "./form/UpdateTaskForm";

// Dummy API placeholders
// const createTask = async (task: Task) => { /* API call */ }
// const updateTask = async (id: string, task: Partial<Task>) => { /* API call */ }
// const deleteTask = async (id: string) => { /* API call */ }

type Task = {
  id: string;
  title: string;
  status: "Pending" | "In Progress" | "Complete";
  assignTo: string;
};

const dummyTasks: Task[] = [
  {
    id: "1",
    title: "Design landing page",
    status: "In Progress",
    assignTo: "Alice",
  },
  { id: "2", title: "Fix login bug", status: "Pending", assignTo: "Bob" },
  { id: "3", title: "Deploy API", status: "Complete", assignTo: "Charlie" },
];

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: () => <div className="pl-4 text-left">Title</div>,
    cell: ({ row }) => {
      const task = row.original;
      return (
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="p-0 pl-4 text-left font-medium text-primary group-hover:underline"
              >
                {task.title}
              </Button>

              {/* Hidden until row hover */}
              <span className="text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                View
              </span>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Task Details</DialogTitle>
            </DialogHeader>
            <p>
              <strong>Title:</strong> {task.title}
            </p>
            <p>
              <strong>Status:</strong> {task.status}
            </p>
            <p>
              <strong>Assign To:</strong> {task.assignTo}
            </p>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const task = row.original;
      return (
        <Select defaultValue={task.status}>
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
  {
    accessorKey: "assignTo",
    header: "Assign To",
    cell: ({ row }) => <div>{row.original.assignTo}</div>,
  },
  {
    id: "actions",
    header: () => <div className="text-right pr-4">Actions</div>,
    cell: ({ row }) => {
      const task = row.original;
      return (
        <div className="flex justify-end pr-4">
          {" "}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              {/* Update Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Update
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Task</DialogTitle>
                  </DialogHeader>
                  <UpdateTaskForm />
                </DialogContent>
              </Dialog>

              <DropdownMenuSeparator />

              {/* Delete Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-red-600"
                    onSelect={(e) => e.preventDefault()}
                  >
                    Delete
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Delete</DialogTitle>
                  </DialogHeader>
                  <p>
                    Are you sure you want to delete{" "}
                    <strong>{task.title}</strong>?
                  </p>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button variant="destructive">Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

const TaskDataTable = () => {
  const [data] = useState<Task[]>(dummyTasks);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
