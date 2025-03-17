import { RouteObject } from "react-router-dom";
import IntegrationDashboard from "@/components/integration/IntegrationDashboard";

export const integrationRoutes: RouteObject[] = [
  {
    path: "/integration",
    element: <IntegrationDashboard />,
  },
];
