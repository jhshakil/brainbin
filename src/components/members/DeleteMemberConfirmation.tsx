import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { deleteUser, getAllUsers } from "@/services/AuthService";
import { useAuth } from "@/context/auth.provider";

type Props = {
  memberId: string;
  memberName: string;
};

const DeleteMemberConfirmation = ({ memberId, memberName }: Props) => {
  const { setAllUsers } = useAuth();
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    const resData = await deleteUser(memberId);
    if (resData?.success) {
      fetchAllUsers();
      setOpen(false);
      toast.success("Member deleted successfully");
    }
  };

  const fetchAllUsers = async () => {
    const all = await getAllUsers();
    if (all.success) {
      setAllUsers(all?.data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <p>
          Are you sure you want to delete <strong>{memberName}</strong>?
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

export default DeleteMemberConfirmation;
