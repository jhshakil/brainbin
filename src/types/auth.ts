export type TUserData = {
  id: string;
  _id?: string;
  email: string;
  name: string;
  role?: TUserRole;
  status?: TUserStatus;
};

export type TUserStatus = "active" | "blocked";
export type TUserRole = "user" | "admin" | "superAdmin";
