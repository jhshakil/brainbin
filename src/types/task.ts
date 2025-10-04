export type TTask = {
  _id: string;
  title: string;
  details: string;
  status: "Pending" | "In Progress" | "Complete";
  assignTo: string;
};
