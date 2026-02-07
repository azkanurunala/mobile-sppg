import { Icon } from "@iconify/react";

export function ChecklistValidasiSPPGCopyCopy() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background font-sans text-foreground pb-32">
      <header className="px-6 pt-12 pb-6 flex items-center justify-between bg-gradient-to-br from-primary via-primary/95 to-primary/80 backdrop-blur-xl sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center size-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-lg hover:bg-white/30 transition-all">
            <Icon icon="solar:arrow-left-linear" className="size-6" />
          </button>
          <div>
            <h1 className="text-lg font-bold font-heading text-white">Validasi Proses Bangun</h1>
            <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
              SPPG-2024-0945
            </p>
          </div>
        </div>
        <div className="size-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-lg">
          <Icon icon="solar:document-text-bold" className="size-5" />
        </div>
      </header>
      <main className="flex-1 px-6 py-6 space-y-6">
        <div className="bg-gradient-to-br from-blue-50 via-blue-50/95 to-blue-100/90 p-4 rounded-2xl border border-blue-200/50 shadow-sm flex gap-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl -translate-y-12 translate-x-12" />
          <div className="mt-1 relative z-10">
            <Icon icon="solar:info-circle-bold" className="size-5 text-primary" />
          </div>
          <p className="text-xs font-medium leading-relaxed text-foreground/80 relative z-10">
            Checklist ini digunakan untuk memvalidasi bahwa bukti yang telah diunggah benar,
            lengkap, dan sesuai kondisi lapangan.
          </p>
        </div>
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-border shadow-md hover:shadow-xl transition-all space-y-4 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
            <div className="flex items-center justify-between gap-3 relative z-10">
              <h4 className="font-bold text-sm text-foreground leading-snug">
                Bukti beli / sewa tersedia dan valid
              </h4>
              <div className="inline-flex px-2.5 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-primary rounded-full shadow-sm border border-blue-200/50">
                <span className="text-[10px] font-extrabold uppercase">10%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 relative z-10">
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-green-500 bg-green-50 text-green-700 font-bold text-sm shadow-md hover:shadow-lg transition-all">
                <Icon icon="solar:check-circle-bold" className="size-5" />
                YA
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border/50 bg-white text-muted-foreground font-bold text-sm shadow-sm hover:shadow-md transition-all">
                <Icon icon="solar:close-circle-bold" className="size-5" />
                TIDAK
              </button>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-border shadow-md hover:shadow-xl transition-all space-y-4 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
            <div className="flex items-center justify-between gap-3 relative z-10">
              <h4 className="font-bold text-sm text-foreground leading-snug">
                Pondasi bangunan selesai dan terdokumentasi
              </h4>
              <div className="inline-flex px-2.5 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-primary rounded-full shadow-sm border border-blue-200/50">
                <span className="text-[10px] font-extrabold uppercase">10%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 relative z-10">
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border/50 bg-white text-muted-foreground font-bold text-sm shadow-sm hover:shadow-md transition-all">
                <Icon icon="solar:check-circle-bold" className="size-5" />
                YA
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-red-500 bg-red-50 text-red-700 font-bold text-sm shadow-md hover:shadow-lg transition-all">
                <Icon icon="solar:close-circle-bold" className="size-5" />
                TIDAK
              </button>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-border shadow-md hover:shadow-xl transition-all space-y-4 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
            <div className="flex items-center justify-between gap-3 relative z-10">
              <h4 className="font-bold text-sm text-foreground leading-snug">
                Dinding bangunan selesai dan terdokumentasi
              </h4>
              <div className="inline-flex px-2.5 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-primary rounded-full shadow-sm border border-blue-200/50">
                <span className="text-[10px] font-extrabold uppercase">10%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 relative z-10">
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border/50 bg-white text-muted-foreground font-bold text-sm shadow-sm hover:shadow-md transition-all">
                <Icon icon="solar:check-circle-bold" className="size-5" />
                YA
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border/50 bg-white text-muted-foreground font-bold text-sm shadow-sm hover:shadow-md transition-all">
                <Icon icon="solar:close-circle-bold" className="size-5" />
                TIDAK
              </button>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-border shadow-md hover:shadow-xl transition-all space-y-4 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
            <div className="flex items-center justify-between gap-3 relative z-10">
              <h4 className="font-bold text-sm text-foreground leading-snug">
                Atap bangunan selesai dan terdokumentasi
              </h4>
              <div className="inline-flex px-2.5 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-primary rounded-full shadow-sm border border-blue-200/50">
                <span className="text-[10px] font-extrabold uppercase">10%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 relative z-10">
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border/50 bg-white text-muted-foreground font-bold text-sm shadow-sm hover:shadow-md transition-all">
                <Icon icon="solar:check-circle-bold" className="size-5" />
                YA
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border/50 bg-white text-muted-foreground font-bold text-sm shadow-sm hover:shadow-md transition-all">
                <Icon icon="solar:close-circle-bold" className="size-5" />
                TIDAK
              </button>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-border shadow-md hover:shadow-xl transition-all space-y-4 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
            <div className="flex items-center justify-between gap-3 relative z-10">
              <h4 className="font-bold text-sm text-foreground leading-snug">
                Lantai & plafon selesai dan terdokumentasi
              </h4>
              <div className="inline-flex px-2.5 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-primary rounded-full shadow-sm border border-blue-200/50">
                <span className="text-[10px] font-extrabold uppercase">10%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 relative z-10">
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border/50 bg-white text-muted-foreground font-bold text-sm shadow-sm hover:shadow-md transition-all">
                <Icon icon="solar:check-circle-bold" className="size-5" />
                YA
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border/50 bg-white text-muted-foreground font-bold text-sm shadow-sm hover:shadow-md transition-all">
                <Icon icon="solar:close-circle-bold" className="size-5" />
                TIDAK
              </button>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-border shadow-md hover:shadow-xl transition-all space-y-4 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
            <div className="flex items-center justify-between gap-3 relative z-10">
              <h4 className="font-bold text-sm text-foreground leading-snug">
                Finishing bangunan selesai dan terdokumentasi
              </h4>
              <div className="inline-flex px-2.5 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-primary rounded-full shadow-sm border border-blue-200/50">
                <span className="text-[10px] font-extrabold uppercase">10%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 relative z-10">
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border/50 bg-white text-muted-foreground font-bold text-sm shadow-sm hover:shadow-md transition-all">
                <Icon icon="solar:check-circle-bold" className="size-5" />
                YA
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border/50 bg-white text-muted-foreground font-bold text-sm shadow-sm hover:shadow-md transition-all">
                <Icon icon="solar:close-circle-bold" className="size-5" />
                TIDAK
              </button>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-border shadow-md hover:shadow-xl transition-all space-y-4 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
            <div className="flex items-center justify-between gap-3 relative z-10">
              <h4 className="font-bold text-sm text-foreground leading-snug">
                Bukti beli alat dapur / masak / makan tersedia
              </h4>
              <div className="inline-flex px-2.5 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-primary rounded-full shadow-sm border border-blue-200/50">
                <span className="text-[10px] font-extrabold uppercase">10%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 relative z-10">
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border/50 bg-white text-muted-foreground font-bold text-sm shadow-sm hover:shadow-md transition-all">
                <Icon icon="solar:check-circle-bold" className="size-5" />
                YA
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border/50 bg-white text-muted-foreground font-bold text-sm shadow-sm hover:shadow-md transition-all">
                <Icon icon="solar:close-circle-bold" className="size-5" />
                TIDAK
              </button>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-border shadow-md hover:shadow-xl transition-all space-y-4 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
            <div className="flex items-center justify-between gap-3 relative z-10">
              <h4 className="font-bold text-sm text-foreground leading-snug">
                Alat dapur, alat masak, dan alat makan tersedia dan lengkap
              </h4>
              <div className="inline-flex px-2.5 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-primary rounded-full shadow-sm border border-blue-200/50">
                <span className="text-[10px] font-extrabold uppercase">10%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 relative z-10">
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border/50 bg-white text-muted-foreground font-bold text-sm shadow-sm hover:shadow-md transition-all">
                <Icon icon="solar:check-circle-bold" className="size-5" />
                YA
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border/50 bg-white text-muted-foreground font-bold text-sm shadow-sm hover:shadow-md transition-all">
                <Icon icon="solar:close-circle-bold" className="size-5" />
                TIDAK
              </button>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-border shadow-md hover:shadow-xl transition-all space-y-4 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
            <div className="flex items-center justify-between gap-3 relative z-10">
              <h4 className="font-bold text-sm text-foreground leading-snug">
                Instalasi listrik, cadangan listrik, air dan gas tersedia dan berfungsi
              </h4>
              <div className="inline-flex px-2.5 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-primary rounded-full shadow-sm border border-blue-200/50">
                <span className="text-[10px] font-extrabold uppercase">10%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 relative z-10">
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border/50 bg-white text-muted-foreground font-bold text-sm shadow-sm hover:shadow-md transition-all">
                <Icon icon="solar:check-circle-bold" className="size-5" />
                YA
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border/50 bg-white text-muted-foreground font-bold text-sm shadow-sm hover:shadow-md transition-all">
                <Icon icon="solar:close-circle-bold" className="size-5" />
                TIDAK
              </button>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-border shadow-md hover:shadow-xl transition-all space-y-4 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
            <div className="flex items-center justify-between gap-3 relative z-10">
              <h4 className="font-bold text-sm text-foreground leading-snug">
                Data tenaga ahli gizi, akuntan, dan tenaga relawan tersedia
              </h4>
              <div className="inline-flex px-2.5 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-primary rounded-full shadow-sm border border-blue-200/50">
                <span className="text-[10px] font-extrabold uppercase">10%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 relative z-10">
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border/50 bg-white text-muted-foreground font-bold text-sm shadow-sm hover:shadow-md transition-all">
                <Icon icon="solar:check-circle-bold" className="size-5" />
                YA
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border/50 bg-white text-muted-foreground font-bold text-sm shadow-sm hover:shadow-md transition-all">
                <Icon icon="solar:close-circle-bold" className="size-5" />
                TIDAK
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-border/40 p-6 z-50 shadow-2xl">
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon icon="solar:chart-bold" className="size-5 text-primary" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                HASIL VALIDASI DATA PERSIAPAN
              </span>
            </div>
            <span className="text-lg font-black font-heading text-primary">0%</span>
          </div>
          <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden shadow-inner border border-blue-200/50">
            <div className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-500 w-[0%] shadow-lg" />
          </div>
          <button className="w-full py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-primary/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform hover:shadow-2xl">
            <Icon icon="solar:check-square-bold" className="size-5" />
            Simpan Validasi
          </button>
        </div>
      </footer>
    </div>
  );
}
