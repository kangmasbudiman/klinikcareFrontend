"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Search,
  Filter,
  Plus,
  Loader2,
  RefreshCw,
  FileText,
  Calendar,
  Printer,
  Pencil,
  Trash2,
  Eye,
  ScrollText,
  HeartPulse,
  Thermometer,
  Forward,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import { LetterFormModal, LetterDetailModal, printLetter } from "@/components/letters";
import medicalLetterService from "@/services/medical-letter.service";
import { useClinicSettings } from "@/providers/clinic-settings-provider";

import type {
  MedicalLetter,
  MedicalLetterStats,
  LetterType,
} from "@/types/medical-letter";
import {
  LETTER_TYPE_LABELS,
  LETTER_TYPE_SHORT_LABELS,
  LETTER_TYPE_COLORS,
} from "@/types/medical-letter";

interface Filters {
  search: string;
  letter_type: LetterType | "";
  start_date: string;
  end_date: string;
  page: number;
  per_page: number;
}

export default function LettersPage() {
  // Clinic settings
  const { settings: clinicSettings } = useClinicSettings();

  // State
  const [letters, setLetters] = useState<MedicalLetter[]>([]);
  const [stats, setStats] = useState<MedicalLetterStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [filters, setFilters] = useState<Filters>({
    search: "",
    letter_type: "",
    start_date: "",
    end_date: "",
    page: 1,
    per_page: 15,
  });
  const [showFilters, setShowFilters] = useState(true);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<MedicalLetter | null>(null);
  const [editLetter, setEditLetter] = useState<MedicalLetter | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // Fetch letters
  const fetchLetters = useCallback(async () => {
    setLoading(true);
    try {
      const response = await medicalLetterService.getLetters({
        search: filters.search || undefined,
        letter_type: filters.letter_type || undefined,
        start_date: filters.start_date || undefined,
        end_date: filters.end_date || undefined,
        page: filters.page,
        per_page: filters.per_page,
      });

      setLetters(response.data);
      if (response.meta) {
        setTotalPages(response.meta.last_page);
        setTotalItems(response.meta.total);
        setCurrentPage(response.meta.current_page);
      }
    } catch (error) {
      console.error("Error fetching letters:", error);
      toast.error("Gagal memuat data surat medis");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await medicalLetterService.getLetterStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  // Initial load & on filters change
  useEffect(() => {
    fetchLetters();
    fetchStats();
  }, [fetchLetters, fetchStats]);

  // Handle filter change
  const handleFilterChange = (key: keyof Filters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Handle search form submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLetters();
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      search: "",
      letter_type: "",
      start_date: "",
      end_date: "",
      page: 1,
      per_page: 15,
    });
  };

  // Create new letter
  const handleCreate = () => {
    setEditLetter(null);
    setIsFormModalOpen(true);
  };

  // Edit letter
  const handleEdit = (letter: MedicalLetter) => {
    setEditLetter(letter);
    setIsFormModalOpen(true);
  };

  // View detail
  const handleViewDetail = (letter: MedicalLetter) => {
    setSelectedLetter(letter);
    setIsDetailModalOpen(true);
  };

  // Form success callback
  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    setEditLetter(null);
    fetchLetters();
    fetchStats();
    toast.success(editLetter ? "Surat berhasil diperbarui" : "Surat berhasil dibuat");
  };

  // Delete letter
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus surat ini? Tindakan ini tidak dapat dibatalkan."
    );
    if (!confirmed) return;

    setIsDeleting(id);
    try {
      await medicalLetterService.deleteLetter(id);
      fetchLetters();
      fetchStats();
      toast.success("Surat berhasil dihapus");
    } catch (error) {
      console.error("Error deleting letter:", error);
      toast.error("Gagal menghapus surat");
    } finally {
      setIsDeleting(null);
    }
  };

  // Stats cards config
  const statsCards = [
    {
      title: "Total Surat",
      value: stats?.total || 0,
      icon: ScrollText,
      color: "blue",
    },
    {
      title: "Bulan Ini",
      value: stats?.this_month || 0,
      icon: Calendar,
      color: "green",
    },
    {
      title: "Surat Sakit",
      value: stats?.by_type?.surat_sakit || 0,
      icon: Thermometer,
      color: "red",
    },
    {
      title: "Surat Rujukan",
      value: stats?.by_type?.surat_rujukan || 0,
      icon: Forward,
      color: "purple",
    },
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Surat-Surat Medis
          </h1>
          <p className="text-muted-foreground">
            Buat dan kelola surat-surat medis klinik
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Buat Surat Baru
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {statsCards.map((stat) => (
          <motion.div key={stat.title} variants={item}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold mt-2">
                      {loading ? "-" : stat.value}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-950`}
                  >
                    <stat.icon
                      className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Filter</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              {showFilters ? "Sembunyikan" : "Tampilkan"}
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent className="space-y-4">
            <form onSubmit={handleSearch}>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>Pencarian</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari no. surat / nama pasien"
                      value={filters.search}
                      onChange={(e) =>
                        handleFilterChange("search", e.target.value)
                      }
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tipe Surat</Label>
                  <Select
                    value={filters.letter_type}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "letter_type",
                        value === "all" ? "" : value
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Tipe</SelectItem>
                      <SelectItem value="surat_sehat">
                        {LETTER_TYPE_LABELS.surat_sehat}
                      </SelectItem>
                      <SelectItem value="surat_sakit">
                        {LETTER_TYPE_LABELS.surat_sakit}
                      </SelectItem>
                      <SelectItem value="surat_rujukan">
                        {LETTER_TYPE_LABELS.surat_rujukan}
                      </SelectItem>
                      <SelectItem value="surat_keterangan">
                        {LETTER_TYPE_LABELS.surat_keterangan}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tanggal Mulai</Label>
                  <Input
                    type="date"
                    value={filters.start_date}
                    onChange={(e) =>
                      handleFilterChange("start_date", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tanggal Akhir</Label>
                  <Input
                    type="date"
                    value={filters.end_date}
                    onChange={(e) =>
                      handleFilterChange("end_date", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button type="submit">
                  <Search className="mr-2 h-4 w-4" />
                  Terapkan Filter
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetFilters}
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Letters Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Daftar Surat</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {totalItems} surat ditemukan
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    fetchLetters();
                    fetchStats();
                  }}
                  disabled={loading}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : letters.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ScrollText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Belum ada surat medis</p>
                <p className="text-sm">
                  Klik tombol &quot;Buat Surat Baru&quot; untuk membuat surat
                </p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No. Surat</TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead>Pasien</TableHead>
                      <TableHead>Dokter</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {letters.map((letter) => (
                      <TableRow key={letter.id}>
                        <TableCell className="font-medium">
                          {letter.letter_number}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={LETTER_TYPE_COLORS[letter.letter_type]}
                          >
                            {LETTER_TYPE_SHORT_LABELS[letter.letter_type]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {letter.patient?.name || "-"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {letter.patient?.medical_record_number || "-"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{letter.doctor?.name || "-"}</TableCell>
                        <TableCell className="text-sm">
                          {letter.letter_date
                            ? format(
                                new Date(letter.letter_date),
                                "dd MMM yyyy",
                                { locale: localeId }
                              )
                            : format(
                                new Date(letter.created_at),
                                "dd MMM yyyy",
                                { locale: localeId }
                              )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleViewDetail(letter)}
                              title="Lihat Detail"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() =>
                                printLetter(letter, clinicSettings)
                              }
                              title="Cetak Surat"
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleEdit(letter)}
                              title="Edit Surat"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDelete(letter.id)}
                              disabled={isDeleting === letter.id}
                              title="Hapus Surat"
                            >
                              {isDeleting === letter.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Halaman {currentPage} dari {totalPages}
                    </p>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Form Modal (Create / Edit) */}
      <LetterFormModal
        open={isFormModalOpen}
        onOpenChange={(open) => {
          setIsFormModalOpen(open);
          if (!open) setEditLetter(null);
        }}
        letter={editLetter}
        onSuccess={handleFormSuccess}
      />

      {/* Detail Modal */}
      <LetterDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        letter={selectedLetter}
        clinicSettings={clinicSettings}
      />
    </div>
  );
}
