// components/ProtectedRoute.tsx
import { useAuth } from "@/contexts/AuthContext";
import Loader from "./Loader";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { client, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return client ? <>{children}</> : null;
}
