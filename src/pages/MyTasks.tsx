/* eslint-disable react-hooks/exhaustive-deps */
import TaskDataTable from "@/components/task/TaskDataTable";
import { useAuth } from "@/context/auth.provider";
import { useTask } from "@/context/task.provider";
import { useEffect, useState } from "react";

const MyTasks = () => {
  const { myTasks, fetchMyTasks } = useTask();
  const { user } = useAuth();
  const [updateState, setUpdateState] = useState(true);
  const [allQuery, setAllQuery] = useState({});

  useEffect(() => {
    if (user?.id) {
      fetchMyTasks(user.id, allQuery);
      setUpdateState(false);
    }
  }, [user?.id, allQuery]);

  useEffect(() => {
    if (user?.id && updateState) {
      fetchMyTasks(user.id, allQuery);
      setUpdateState(false);
    }
  }, [updateState, user?.id]);

  return (
    <div>
      <TaskDataTable
        tasks={myTasks.data}
        setUpdateState={setUpdateState}
        setAllQuery={setAllQuery}
      />
    </div>
  );
};

export default MyTasks;
