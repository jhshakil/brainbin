export type TTask = {
  _id: string;
  title: string;
  details: string;
  status: TStatus;
  assignTo: string;
};

export type TStatus = "Pending" | "In Progress" | "Complete";
