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
import { useEffect, useState, useMemo } from "react";
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
import { updateTaskStatus } from "@/services/TaskServices";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { debounce } from "@/lib/utils";

type Props = {
  tasks: TTask[];
  setUpdateState: (value: boolean) => void;
  setAllQuery?: (query: Record<string, any>) => void;
};

const TaskDataTable = ({ tasks, setUpdateState, setAllQuery }: Props) => {
  const { allUsers, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [taskData, setTaskData] = useState<TTask[]>(tasks);

  // filters
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const updateStatus = async (taskId: string, newStatus: TStatus) => {
    setTaskData((prev) =>
      prev.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      )
    );
    const resData = await updateTaskStatus({ _id: taskId, status: newStatus });
    if (resData.success) {
      toast.success("Task status updated successfully");
      setUpdateState(true);
    }
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
        setPage(1);
      }, 500),
    []
  );

  useEffect(() => {
    if (tasks) {
      setTaskData(tasks);
    }
  }, [tasks]);

  // debounce wrapper for query updates
  const debouncedSetQuery = useMemo(
    () =>
      debounce((q: Record<string, any>) => {
        if (setAllQuery) setAllQuery(q);
      }, 500),
    [setAllQuery]
  );

  // handle filter + search change
  useEffect(() => {
    debouncedSetQuery({
      search: search || undefined,
      status: status === "all" ? undefined : status || undefined,
      page,
      per_page: limit,
    });
  }, [search, status, page]);

  const columns: ColumnDef<TTask>[] = [
    {
      accessorKey: "title",
      header: () => <div className="pl-4 text-left">Title</div>,
      cell: ({ row }) => <div className="pl-4">{row.original.title}</div>,
    },
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
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const task = row.original;
        return (
          <Select
            value={task.status}
            onValueChange={(value: TStatus) => updateStatus(task._id, value)}
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
    // Actions column only if user is admin
    ...(user?.role === "admin"
      ? [
          {
            id: "actions",
            header: () => <div className="text-right pr-4">Actions</div>,
            cell: (context: CellContext<TTask, any>) => {
              const task = context.row.original;
              return (
                <div className="flex justify-end pr-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 cursor-pointer"
                      >
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <UpdateTaskForm
                        task={task}
                        setUpdateState={setUpdateState}
                      />
                      <DropdownMenuSeparator />
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
        ]
      : []),
  ];

  const table = useReactTable({
    data: taskData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row._id,
  });

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between py-4 gap-2">
        <CreateTaskForm setUpdateState={setUpdateState} />
        <div className="flex gap-2">
          <Input
            placeholder="Search by title..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              debouncedSearch(e.target.value);
            }}
            className="w-[200px]"
          />
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Complete">Complete</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
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

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="text-sm">Page {page}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p + 1)}
          disabled={taskData.length < limit}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default TaskDataTable;
