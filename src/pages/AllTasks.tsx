import TaskDataTable from "@/components/task/TaskDataTable";
import { useTask } from "@/context/task.provider";
import { useEffect, useState } from "react";

const AllTasks = () => {
  const { allTasks, fetchTasks } = useTask();
  const [updateState, setUpdateState] = useState(true);
  const [allQuery, setAllQuery] = useState({});

  useEffect(() => {
    if (updateState) {
      fetchTasks();
      setUpdateState(false);
    }
  }, [updateState]);

  return (
    <div>
      <TaskDataTable
        tasks={allTasks}
        setUpdateState={setUpdateState}
        setAllQuery={setAllQuery}
      />
    </div>
  );
};

export default AllTasks;
