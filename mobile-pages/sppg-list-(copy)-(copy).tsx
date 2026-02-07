import { Icon } from "@iconify/react";

export function SPPGListCopyCopy() {
  return (
    <>
      <div className="flex flex-col min-h-screen w-full bg-background font-sans text-foreground pb-24">
        <header className="px-6 pt-12 bg-gradient-to-br from-primary via-blue-600 to-blue-700 sticky top-0 z-40 shadow-lg space-y-6 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-12 rounded-full border-2 border-white/20 shadow-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Icon icon="solar:document-bold" className="size-6 text-white" />
                </div>
                <div className="absolute bottom-0 right-0 size-3 rounded-full bg-chart-4 border-2 border-white shadow-sm" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-heading text-white">Daftar SPPG</h2>
                <p className="text-xs font-medium text-white/80 flex items-center gap-1">
                  <Icon icon="solar:map-point-bold" className="size-3 text-white" />
                  Kab. Maluku Tengah, Maluku
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button class="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors border border-white/20">
                <Icon icon="solar:tuning-2-bold" class="size-5" />
              </button>
              <button class="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors border border-white/20">
                <Icon icon="solar:sort-bold" class="size-5" />
              </button>
            </div>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <Icon
                icon="solar:magnifer-linear"
                className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-white/60 z-10"
              />
              <input
                type="text"
                className="w-full bg-white/10 backdrop-blur-sm h-14 pl-12 pr-4 rounded-2xl border border-white/20 shadow-sm text-sm font-medium focus:ring-2 focus:ring-white/30 outline-none text-white placeholder:text-white/60"
                placeholder="Cari Kode SPPG..."
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-6 pl-6">
              <button className="whitespace-nowrap px-4 py-2 rounded-full bg-white text-primary text-xs font-bold shadow-md">
                Semua Status
              </button>
              <button className="whitespace-nowrap px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 text-xs font-bold">
                Proses Persiapan
              </button>
              <button className="whitespace-nowrap px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 text-xs font-bold">
                Validasi Data Persiapan
              </button>
              <button className="whitespace-nowrap px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 text-xs font-bold">
                Selesai
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 px-6 space-y-6">
          <section className="space-y-4 pb-4">
            <p className="text-xs font-medium text-muted-foreground mt-4 px-1">
              Menampilkan hasil pencarian berdasarkan data terbaru
            </p>
            <div
              eid="e29"
              className="bg-card p-5 rounded-3xl border border-border shadow-lg hover:shadow-xl transition-shadow space-y-4 relative overflow-hidden mt-4"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16" />
              <div eid="e30" className="flex items-start justify-between relative z-10">
                <div eid="e31" className="space-y-1">
                  <span
                    eid="e32"
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    KODE SPPG
                  </span>
                  <h4 eid="e33" className="font-bold text-lg font-heading leading-tight">
                    SPPG-2024-0812
                  </h4>
                </div>
                <div
                  eid="e34"
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 shadow-sm"
                >
                  <span eid="e35" className="text-[10px] font-extrabold uppercase tracking-tight">
                    Assign Investor
                  </span>
                </div>
              </div>
              <div eid="e36" className="grid grid-cols-2 gap-4 relative z-10">
                <div eid="e37" className="space-y-1">
                  <p
                    eid="e38"
                    className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"
                  >
                    <Icon icon="solar:buildings-2-bold" className="size-3" />
                    Investor
                  </p>
                  <p eid="e39" className="text-sm font-bold text-foreground truncate">
                    PT. Maju Terus Jaya
                  </p>
                </div>
                <div eid="e40" className="space-y-1">
                  <p
                    eid="e41"
                    className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"
                  >
                    <Icon icon="solar:map-point-bold" className="size-3" />
                    Lokasi
                  </p>
                  <p eid="e42" className="text-sm font-bold text-foreground truncate">
                    Kec. Masohi, Amahai
                  </p>
                </div>
              </div>
            </div>
            <div
              eid="e43"
              className="bg-card p-5 rounded-3xl border border-border shadow-lg hover:shadow-xl transition-shadow space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -translate-y-16 translate-x-16" />
              <div eid="e44" className="flex items-start justify-between relative z-10">
                <div eid="e45" className="space-y-1">
                  <span
                    eid="e46"
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    KODE SPPG
                  </span>
                  <h4 eid="e47" className="font-bold text-lg font-heading leading-tight">
                    SPPG-2024-0945
                  </h4>
                </div>
                <div
                  eid="e48"
                  className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full border border-purple-100 shadow-sm"
                >
                  <span eid="e49" className="text-[10px] font-extrabold uppercase tracking-tight">
                    Dokumen Pendaftaran
                  </span>
                </div>
              </div>
              <div eid="e50" className="grid grid-cols-2 gap-4 relative z-10">
                <div eid="e51" className="space-y-1">
                  <p
                    eid="e52"
                    className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"
                  >
                    <Icon icon="solar:buildings-2-bold" className="size-3" />
                    Investor
                  </p>
                  <p eid="e53" className="text-sm font-bold text-foreground truncate">
                    CV. Bahari Makmur
                  </p>
                </div>
                <div eid="e54" className="space-y-1">
                  <p
                    eid="e55"
                    className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"
                  >
                    <Icon icon="solar:map-point-bold" className="size-3" />
                    Lokasi
                  </p>
                  <p eid="e56" className="text-sm font-bold text-foreground truncate">
                    Kec. Tehoru, Tehoru
                  </p>
                </div>
              </div>
            </div>
            <div
              eid="e57"
              className="bg-card p-5 rounded-3xl border border-border shadow-lg hover:shadow-xl transition-shadow space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-y-16 translate-x-16" />
              <div eid="e58" className="flex items-start justify-between relative z-10">
                <div eid="e59" className="space-y-1">
                  <span
                    eid="e60"
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    KODE SPPG
                  </span>
                  <h4 eid="e61" className="font-bold text-lg font-heading leading-tight">
                    SPPG-2024-0721
                  </h4>
                </div>
                <div
                  eid="e62"
                  className="px-3 py-1 bg-amber-50 text-chart-1 rounded-full border border-amber-100 shadow-sm"
                >
                  <span eid="e63" className="text-[10px] font-extrabold uppercase tracking-tight">
                    Proses Persiapan
                  </span>
                </div>
              </div>
              <div eid="e64" className="grid grid-cols-2 gap-4 relative z-10">
                <div eid="e65" className="space-y-1">
                  <p
                    eid="e66"
                    className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"
                  >
                    <Icon icon="solar:buildings-2-bold" className="size-3" />
                    Investor
                  </p>
                  <p eid="e67" className="text-sm font-bold text-foreground truncate">
                    PT. Agro Maluku
                  </p>
                </div>
                <div eid="e68" className="space-y-1">
                  <p
                    eid="e69"
                    className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"
                  >
                    <Icon icon="solar:map-point-bold" className="size-3" />
                    Lokasi
                  </p>
                  <p eid="e70" className="text-sm font-bold text-foreground truncate">
                    Kec. Wahai, Saleman
                  </p>
                </div>
              </div>
              <div eid="e71" className="space-y-2 relative z-10">
                <div
                  eid="e72"
                  className="flex items-center justify-between text-[10px] font-bold uppercase text-muted-foreground"
                >
                  <span eid="e73">Persentase Persiapan</span>
                  <span eid="e74" className="text-chart-4">
                    72%
                  </span>
                </div>
                <div
                  eid="e75"
                  className="w-full h-2.5 bg-secondary rounded-full overflow-hidden shadow-inner"
                >
                  <div eid="e76" className="h-full bg-chart-4 rounded-full w-[72%] shadow-sm" />
                </div>
              </div>
              <button
                eid="e77"
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-shadow relative z-10"
              >
                Validasi Data Persiapan
              </button>
            </div>
            <div
              eid="e78"
              className="bg-card p-5 rounded-3xl border border-border shadow-lg hover:shadow-xl transition-shadow space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -translate-y-16 translate-x-16" />
              <div eid="e79" className="flex items-start justify-between relative z-10">
                <div eid="e80" className="space-y-1">
                  <span
                    eid="e81"
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    KODE SPPG
                  </span>
                  <h4 eid="e82" className="font-bold text-lg font-heading leading-tight">
                    SPPG-2024-1002
                  </h4>
                </div>
                <div
                  eid="e83"
                  className="px-3 py-1 bg-teal-50 text-teal-600 rounded-full border border-teal-100 shadow-sm"
                >
                  <span eid="e84" className="text-[10px] font-extrabold uppercase tracking-tight">
                    Validasi Data Persiapan
                  </span>
                </div>
              </div>
              <div eid="e85" className="grid grid-cols-2 gap-4 relative z-10">
                <div eid="e86" className="space-y-1">
                  <p
                    eid="e87"
                    className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"
                  >
                    <Icon icon="solar:buildings-2-bold" className="size-3" />
                    Investor
                  </p>
                  <p eid="e88" className="text-sm font-bold text-foreground truncate">
                    Yayasan Laut Biru
                  </p>
                </div>
                <div eid="e89" className="space-y-1">
                  <p
                    eid="e90"
                    className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"
                  >
                    <Icon icon="solar:map-point-bold" className="size-3" />
                    Lokasi
                  </p>
                  <p eid="e91" className="text-sm font-bold text-foreground truncate">
                    Kec. Banda, Neira
                  </p>
                </div>
              </div>
              <div eid="e92" className="space-y-2 relative z-10">
                <div
                  eid="e93"
                  className="flex items-center justify-between text-[10px] font-bold uppercase text-muted-foreground"
                >
                  <span eid="e94">Persentase Persiapan</span>
                  <span eid="e95" className="text-chart-4">
                    95%
                  </span>
                </div>
                <div
                  eid="e96"
                  className="w-full h-2.5 bg-secondary rounded-full overflow-hidden shadow-inner"
                >
                  <div eid="e97" className="h-full bg-chart-4 rounded-full w-[95%] shadow-sm" />
                </div>
              </div>
              <button
                eid="e98"
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-shadow relative z-10"
              >
                Perbarui Validasi Data
              </button>
            </div>
            <div
              eid="e99"
              className="bg-card p-5 rounded-3xl border border-border shadow-lg hover:shadow-xl transition-shadow space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -translate-y-16 translate-x-16" />
              <div eid="e100" className="flex items-start justify-between relative z-10">
                <div eid="e101" className="space-y-1">
                  <span
                    eid="e102"
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    KODE SPPG
                  </span>
                  <h4 eid="e103" className="font-bold text-lg font-heading leading-tight">
                    SPPG-2024-1345
                  </h4>
                </div>
                <div
                  eid="e104"
                  className="px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100 shadow-sm"
                >
                  <span eid="e105" className="text-[10px] font-extrabold uppercase tracking-tight">
                    Perjanjian Sewa
                  </span>
                </div>
              </div>
              <div eid="e106" className="grid grid-cols-2 gap-4 relative z-10">
                <div eid="e107" className="space-y-1">
                  <p
                    eid="e108"
                    className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"
                  >
                    <Icon icon="solar:buildings-2-bold" className="size-3" />
                    Investor
                  </p>
                  <p eid="e109" className="text-sm font-bold text-foreground truncate">
                    PT. Maritim Sejahtera
                  </p>
                </div>
                <div eid="e110" className="space-y-1">
                  <p
                    eid="e111"
                    className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"
                  >
                    <Icon icon="solar:map-point-bold" className="size-3" />
                    Lokasi
                  </p>
                  <p eid="e112" className="text-sm font-bold text-foreground truncate">
                    Kec. Kairatu, Seram Barat
                  </p>
                </div>
              </div>
            </div>
            <div
              eid="e113"
              className="bg-card p-5 rounded-3xl border border-border shadow-lg hover:shadow-xl transition-shadow space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-y-16 translate-x-16" />
              <div eid="e114" className="flex items-start justify-between relative z-10">
                <div eid="e115" className="space-y-1">
                  <span
                    eid="e116"
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    KODE SPPG
                  </span>
                  <h4 eid="e117" className="font-bold text-lg font-heading leading-tight">
                    SPPG-2024-1234
                  </h4>
                </div>
                <div
                  eid="e118"
                  className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 shadow-sm"
                >
                  <span eid="e119" className="text-[10px] font-extrabold uppercase tracking-tight">
                    Validasi Data Pendaftaran
                  </span>
                </div>
              </div>
              <div eid="e120" className="grid grid-cols-2 gap-4 relative z-10">
                <div eid="e121" className="space-y-1">
                  <p
                    eid="e122"
                    className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"
                  >
                    <Icon icon="solar:buildings-2-bold" className="size-3" />
                    Investor
                  </p>
                  <p eid="e123" className="text-sm font-bold text-foreground truncate">
                    CV. Pesisir Jaya
                  </p>
                </div>
                <div eid="e124" className="space-y-1">
                  <p
                    eid="e125"
                    className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"
                  >
                    <Icon icon="solar:map-point-bold" className="size-3" />
                    Lokasi
                  </p>
                  <p eid="e126" className="text-sm font-bold text-foreground truncate">
                    Kec. Amahai, Masohi
                  </p>
                </div>
              </div>
            </div>
            <div
              eid="e127"
              className="bg-card p-5 rounded-3xl border border-border shadow-lg hover:shadow-xl transition-shadow space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -translate-y-16 translate-x-16" />
              <div eid="e128" className="flex items-start justify-between relative z-10">
                <div eid="e129" className="space-y-1">
                  <span
                    eid="e130"
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    KODE SPPG
                  </span>
                  <h4 eid="e131" className="font-bold text-lg font-heading leading-tight">
                    SPPG-2024-1123
                  </h4>
                </div>
                <div
                  eid="e132"
                  className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full border border-orange-100 shadow-sm"
                >
                  <span eid="e133" className="text-[10px] font-extrabold uppercase tracking-tight">
                    Appraisal Biaya Sewa
                  </span>
                </div>
              </div>
              <div eid="e134" className="grid grid-cols-2 gap-4 relative z-10">
                <div eid="e135" className="space-y-1">
                  <p
                    eid="e136"
                    className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"
                  >
                    <Icon icon="solar:buildings-2-bold" className="size-3" />
                    Investor
                  </p>
                  <p eid="e137" className="text-sm font-bold text-foreground truncate">
                    PT. Samudra Nusantara
                  </p>
                </div>
                <div eid="e138" className="space-y-1">
                  <p
                    eid="e139"
                    className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"
                  >
                    <Icon icon="solar:map-point-bold" className="size-3" />
                    Lokasi
                  </p>
                  <p eid="e140" className="text-sm font-bold text-foreground truncate">
                    Kec. Seram Utara, Wahai
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      <div
        eid="e141"
        className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border/50 flex justify-around items-center py-3 px-2 z-50 shadow-2xl"
      >
        <button eid="e142" className="flex flex-col items-center gap-1 min-w-16">
          <Icon eid="e143" icon="solar:home-2-bold" className="size-6 text-muted-foreground" />
          <span eid="e144" className="text-[10px] font-medium text-muted-foreground">
            Beranda
          </span>
        </button>
        <button eid="e145" className="flex flex-col items-center gap-1 min-w-16 relative">
          <Icon eid="e146" icon="solar:document-text-bold" className="size-6 text-primary" />
          <span eid="e147" className="text-[10px] font-bold text-primary">
            SPPG
          </span>
        </button>
        <button eid="e148" className="flex flex-col items-center gap-1 min-w-16">
          <Icon eid="e149" icon="solar:user-bold" className="size-6 text-muted-foreground" />
          <span eid="e150" className="text-[10px] font-medium text-muted-foreground">
            Profil
          </span>
        </button>
      </div>
    </>
  );
}
