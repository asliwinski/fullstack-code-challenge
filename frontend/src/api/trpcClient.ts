import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../backend/api/trpc";

export const trpc = createTRPCReact<AppRouter>();
