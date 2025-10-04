import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useState } from "react";
import { useTask } from "@/context/task.provider";
import { DeleteTask } from "@/services/TaskServices";
import { toast } from "sonner";

type Props = {
  taskId: string;
  taskTitle: string;
};

const DeleteTaskConfirmation = ({ taskId, taskTitle }: Props) => {
  const { fetchTasks } = useTask();
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    const resData = await DeleteTask(taskId);
    console.log(resData);
    if (resData?.success) {
      fetchTasks();
      setOpen(false);
      toast.success("Task deleted successfully");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="text-red-600 cursor-pointer"
          onSelect={(e) => e.preventDefault()}
        >
          Delete
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <p>
          Are you sure you want to delete <strong>{taskTitle}</strong>?
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => handleDelete()}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTaskConfirmation;
