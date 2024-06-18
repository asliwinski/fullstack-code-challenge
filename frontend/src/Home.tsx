import { Users } from "./Users";
import { Questions } from "./Questions";

export function Home() {
  return (
    <div className="container">
      <div className="flex items-center h-screen">
        <div className="w-1/2 p-10">
          <h1 className="text-xl font-bold text-center">Users</h1>
          <Users />
        </div>
        <div className="w-1/2 p-10">
          <h1 className="text-xl font-bold text-center">Questions</h1>
          <Questions />
        </div>
      </div>
    </div>
  );
}
