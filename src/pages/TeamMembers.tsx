import MembersTable from "@/components/members/MembersTable";
import { useAuth } from "@/context/auth.provider";

const TeamMembers = () => {
  const { allUsers } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-center">All Team Member</h1>
      <MembersTable users={allUsers || []} />
    </div>
  );
};

export default TeamMembers;
