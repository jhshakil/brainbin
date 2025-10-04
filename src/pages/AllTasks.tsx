import TaskDataTable from "@/components/task/TaskDataTable";
import { useTask } from "@/context/task.provider";

const AllTasks = () => {
  const { allTasks } = useTask();
  return (
    <div>
      <TaskDataTable tasks={allTasks} />
    </div>
  );
};

export default AllTasks;
