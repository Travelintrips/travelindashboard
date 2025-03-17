import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, RefreshCw } from "lucide-react";
import { AccountMapping } from "@/types/integration";
import {
  getAccountMappings,
  updateAccountMapping,
  syncTransactions,
  getSyncSettings,
  updateSyncSettings,
} from "@/services/integrationService";

interface IntegrationSettingsProps {
  onSave?: () => void;
  onSyncSettingsChange?: (syncFrequency: string) => void;
}

const IntegrationSettings = ({
  onSave,
  onSyncSettingsChange,
}: IntegrationSettingsProps) => {
  const [activeTab, setActiveTab] = useState("account-mapping");
  const [accountMappings, setAccountMappings] = useState<AccountMapping[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [syncFrequency, setSyncFrequency] = useState(
    getSyncSettings().syncFrequency,
  );

  // Sample accounts for dropdown
  const accounts = [
    { code: "1-1000", name: "Kas" },
    { code: "1-1100", name: "Bank BCA" },
    { code: "1-1200", name: "Piutang Usaha" },
    { code: "1-2000", name: "Peralatan" },
    { code: "2-1000", name: "Hutang Usaha" },
    { code: "2-2000", name: "Hutang Bank" },
    { code: "3-1000", name: "Modal" },
    { code: "3-2000", name: "Laba Ditahan" },
    { code: "4-1000", name: "Pendapatan Jasa" },
    { code: "4-2000", name: "Pendapatan Lain-lain" },
    { code: "5-1000", name: "Beban Gaji" },
    { code: "5-2000", name: "Beban Sewa" },
    { code: "5-3000", name: "Beban Utilitas" },
  ];

  useEffect(() => {
    // Load account mappings
    const mappings = getAccountMappings();
    setAccountMappings(mappings);
  }, []);

  const handleMappingChange = (
    index: number,
    field: keyof AccountMapping,
    value: string,
  ) => {
    const updatedMappings = [...accountMappings];
    updatedMappings[index] = {
      ...updatedMappings[index],
      [field]: value,
    };
    setAccountMappings(updatedMappings);
  };

  const handleSave = () => {
    setIsSaving(true);

    // Save each mapping
    accountMappings.forEach((mapping) => {
      updateAccountMapping(mapping);
    });

    // Show success message
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      if (onSave) onSave();
    }, 1000);
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Pengaturan Integrasi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="account-mapping"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="account-mapping">Pemetaan Akun</TabsTrigger>
            <TabsTrigger value="sync-settings">
              Pengaturan Sinkronisasi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account-mapping">
            <div className="space-y-4">
              <p className="text-sm text-gray-500 mb-4">
                Konfigurasikan bagaimana transaksi penjualan dipetakan ke akun
                akuntansi.
              </p>

              {accountMappings.map((mapping, index) => (
                <div
                  key={mapping.salesType}
                  className="border p-4 rounded-md space-y-4"
                >
                  <div className="font-medium text-lg">
                    {mapping.salesType === "flight"
                      ? "Penjualan Tiket Pesawat"
                      : "Penjualan Kamar Hotel"}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`revenue-account-${index}`}>
                        Akun Pendapatan
                      </Label>
                      <Select
                        value={mapping.revenueAccountCode}
                        onValueChange={(value) =>
                          handleMappingChange(
                            index,
                            "revenueAccountCode",
                            value,
                          )
                        }
                      >
                        <SelectTrigger id={`revenue-account-${index}`}>
                          <SelectValue placeholder="Pilih akun pendapatan" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.map((account) => (
                            <SelectItem key={account.code} value={account.code}>
                              {account.code} - {account.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`receivable-account-${index}`}>
                        Akun Penerimaan
                      </Label>
                      <Select
                        value={mapping.receivableAccountCode}
                        onValueChange={(value) =>
                          handleMappingChange(
                            index,
                            "receivableAccountCode",
                            value,
                          )
                        }
                      >
                        <SelectTrigger id={`receivable-account-${index}`}>
                          <SelectValue placeholder="Pilih akun penerimaan" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.map((account) => (
                            <SelectItem key={account.code} value={account.code}>
                              {account.code} - {account.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`description-${index}`}>Deskripsi</Label>
                      <Input
                        id={`description-${index}`}
                        value={mapping.description}
                        onChange={(e) =>
                          handleMappingChange(
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="Deskripsi transaksi"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full mt-4"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
              </Button>

              {saveSuccess && (
                <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md border border-green-200">
                  Pengaturan berhasil disimpan!
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sync-settings">
            <div className="space-y-4">
              <p className="text-sm text-gray-500 mb-4">
                Konfigurasikan bagaimana dan kapan transaksi penjualan
                disinkronkan ke sistem akuntansi.
              </p>

              <div className="border p-4 rounded-md space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sync-frequency">Frekuensi Sinkronisasi</Label>
                  <Select
                    value={syncFrequency}
                    onValueChange={(value) => {
                      setSyncFrequency(value);
                      updateSyncSettings({ syncFrequency: value });
                      if (onSyncSettingsChange) {
                        onSyncSettingsChange(value);
                      }
                    }}
                  >
                    <SelectTrigger id="sync-frequency">
                      <SelectValue placeholder="Pilih frekuensi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">
                        Realtime (Setiap Transaksi)
                      </SelectItem>
                      <SelectItem value="hourly">Setiap Jam</SelectItem>
                      <SelectItem value="daily">
                        Harian (Tengah Malam)
                      </SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sync-behavior">Perilaku Sinkronisasi</Label>
                  <Select defaultValue="new-only">
                    <SelectTrigger id="sync-behavior">
                      <SelectValue placeholder="Pilih perilaku" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new-only">
                        Hanya Transaksi Baru
                      </SelectItem>
                      <SelectItem value="all">Semua Transaksi</SelectItem>
                      <SelectItem value="modified">
                        Transaksi Baru & Dimodifikasi
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <Button
                    className="w-full"
                    onClick={() => {
                      syncTransactions().then((result) => {
                        console.log("Manual sync completed:", result);
                        if (onSave) onSave();
                      });
                    }}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sinkronisasi Manual Sekarang
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full mt-4"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IntegrationSettings;
