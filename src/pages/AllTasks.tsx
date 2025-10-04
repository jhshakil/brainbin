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
      <TaskDataTable
        tasks={allTasks.data}
        setUpdateState={setUpdateState}
        setAllQuery={setAllQuery}
      />
    </div>
  );
};

export default AllTasks;
