import TaskDataTable from "@/components/task/TaskDataTable";
import { useTask } from "@/context/task.provider";
import { useEffect, useState } from "react";

const AllTasks = () => {
  const { allTasks, fetchTasks } = useTask();
  const [updateState, setUpdateState] = useState(true);
  const [allQuery, setAllQuery] = useState({});

  useEffect(() => {
    if (updateState) {
      fetchTasks(allQuery);
      setUpdateState(false);
    }
  }, [updateState]);

  useEffect(() => {
    fetchTasks(allQuery);
    setUpdateState(false);
  }, [allQuery]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-center">All Task</h1>
      <TaskDataTable
        tasks={allTasks.data}
        setUpdateState={setUpdateState}
        setAllQuery={setAllQuery}
      />
    </div>
  );
};

export default AllTasks;
