import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Download,
  FileText,
  Printer,
  Share2,
  Check,
  Loader2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface ExportOptionsProps {
  onExport?: (format: string) => void;
  disabled?: boolean;
}

const ExportOptions = ({
  onExport = (format) => console.log(`Exporting in ${format} format`),
  disabled = false,
}: ExportOptionsProps) => {
  const [lastExported, setLastExported] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  const handleExport = (format: string) => {
    onExport(format);
    setLastExported(format);

    // Simulate export success after the export process completes
    setTimeout(() => {
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-end gap-2 p-4 bg-white rounded-md shadow-sm">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("print")}
              disabled={disabled}
            >
              {disabled && lastExported === "print" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : exportSuccess && lastExported === "print" ? (
                <Check className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <Printer className="h-4 w-4 mr-2" />
              )}
              Cetak
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Cetak tampilan saat ini</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="default" size="sm" disabled={disabled}>
                  {disabled ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : exportSuccess ? (
                    <Check className="h-4 w-4 mr-2 text-green-100" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Ekspor
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ekspor data dalam berbagai format</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleExport("pdf")}>
            <FileText className="h-4 w-4 mr-2" />
            Laporan PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("excel")}>
            <FileText className="h-4 w-4 mr-2" />
            Spreadsheet Excel
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("csv")}>
            <FileText className="h-4 w-4 mr-2" />
            File CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("share")}
              disabled={disabled}
            >
              {disabled && lastExported === "share" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : exportSuccess && lastExported === "share" ? (
                <Check className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <Share2 className="h-4 w-4 mr-2" />
              )}
              Bagikan
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bagikan laporan ini</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ExportOptions;
