import MembersTable from "@/components/members/MembersTable";
import { useAuth } from "@/context/auth.provider";

const TeamMembers = () => {
  const { allUsers } = useAuth();

  return (
    <div>
      <MembersTable users={allUsers || []} />
    </div>
  );
};

export default TeamMembers;
