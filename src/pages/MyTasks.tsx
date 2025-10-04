import TaskDataTable from "@/components/task/TaskDataTable";
import { useAuth } from "@/context/auth.provider";
import { useTask } from "@/context/task.provider";
import { useEffect, useState } from "react";

const MyTasks = () => {
  const { myTasks, fetchMyTasks } = useTask();
  const { user } = useAuth();
  const [updateState, setUpdateState] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchMyTasks(user?.id);
    }
  }, [user]);

  useEffect(() => {
    if (user?.id && updateState) {
      fetchMyTasks(user?.id);
      setUpdateState(false);
    }
  }, [user, updateState]);

  return (
    <div>
      <TaskDataTable tasks={myTasks} setUpdateState={setUpdateState} />
    </div>
  );
};

export default MyTasks;
