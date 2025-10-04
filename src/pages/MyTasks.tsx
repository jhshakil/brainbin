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
      <h1 className="text-3xl font-bold text-center">My Task</h1>
      <TaskDataTable
        tasks={myTasks.data}
        setUpdateState={setUpdateState}
        setAllQuery={setAllQuery}
      />
    </div>
  );
};

export default MyTasks;
