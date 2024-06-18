import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getUsers } from "@queries/users";
import { Link } from "react-router-dom";

export function Users() {
  const query = useQuery({ queryKey: ["users"], queryFn: getUsers });

  return (
    <div>
      {query.isLoading && <p>Loading...</p>}
      {query.isError && <p>Error: {query.error.message}</p>}
      {query.data && (
        <div className="divide-y divide-gray-200">
          {query.data.map((user: any) => (
            <div className="p-2" key={user._id}>
              <Link to={`/users/${user._id}`}>{user.name}</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
