import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
        <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Akses Ditolak</h1>
        <p className="text-gray-600 mb-6">
          Anda tidak memiliki izin yang diperlukan untuk mengakses halaman ini.
        </p>
        <div className="flex flex-col space-y-2">
          <Button onClick={() => navigate("/")} variant="default">
            Kembali ke Beranda
          </Button>
          <Button onClick={() => navigate(-1)} variant="outline">
            Kembali ke Halaman Sebelumnya
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
