import React from "react";
import { Link } from "react-router-dom";
import { trpc } from "@api/trpcClient";

export function Users() {
  const usersQuery = trpc.getUsers.useQuery();

  return (
    <div>
      {usersQuery.isLoading && <p>Loading...</p>}
      {usersQuery.isError && <p>Error: {usersQuery.error.message}</p>}
      {usersQuery.data && (
        <div className="divide-y divide-gray-200">
          {usersQuery.data.map((user) => (
            <div className="p-2" key={user._id}>
              <Link to={`/users/${user._id}`}>{user.name}</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
