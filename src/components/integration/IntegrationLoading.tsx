import React from "react";
import { Loader2 } from "lucide-react";

export default function IntegrationLoading() {
  return (
    <div className="flex items-center justify-center h-full w-full p-8">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <h3 className="text-lg font-medium">Loading Integration Data</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Please wait while we fetch the latest integration status...
        </p>
      </div>
    </div>
  );
}
