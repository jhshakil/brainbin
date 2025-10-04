export type TTask = {
  _id: string;
  title: string;
  details: string;
  status: TStatus;
  assignTo: string;
  dueDate: string;
};

export type TTasks = {
  data: TTask[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    totalPages: number;
  };
};

export type TTaskQueryParams = {
  search?: string;
  status?: TStatus;
  page?: number;
  per_page?: number;
};

export type TStatus = "Pending" | "In Progress" | "Complete";
