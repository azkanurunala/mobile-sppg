import { Icon } from "@iconify/react";

export function SPPGDetailInvestor() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background font-sans text-foreground">
      <header
        eid="e2"
        className="px-6 pt-12 pb-32 bg-gradient-to-br from-primary via-primary to-blue-600 relative"
      >
        <div eid="e3" className="flex items-center justify-between mb-8">
          <button
            eid="e5"
            className="flex items-center justify-center size-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white shadow-lg"
          >
            <Icon eid="e6" icon="solar:arrow-left-linear" className="size-6" />
          </button>
          <div
            eid="e8"
            className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full border border-white/30"
          >
            <span eid="e9" className="text-[10px] font-extrabold uppercase">
              Proses Persiapan
            </span>
          </div>
        </div>
        <div eid="e11a" className="space-y-2 mb-8">
          <h4 eid="e7" className="font-bold text-2xl text-white">
            SPPG-2024-0812
          </h4>
        </div>
        <div eid="e11" className="bg-white p-6 rounded-3xl border border-border shadow-xl">
          <div eid="e12" className="divide-y divide-border/50">
            <div eid="e13" className="grid grid-cols-2 gap-y-6 pb-6">
              <div eid="e14" className="space-y-2">
                <p
                  eid="e15"
                  className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5"
                >
                  <Icon eid="e16" icon="solar:global-linear" className="size-3.5" /> Provinsi
                </p>
                <p eid="e17" className="text-sm font-bold text-foreground">
                  Maluku Tengah
                </p>
              </div>
              <div eid="e18" className="space-y-2">
                <p
                  eid="e19"
                  className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5"
                >
                  <Icon eid="e20" icon="solar:buildings-2-linear" className="size-3.5" /> Kab/Kota
                </p>
                <p eid="e21" className="text-sm font-bold text-foreground">
                  Masohi
                </p>
              </div>
              <div eid="e22" className="space-y-2">
                <p
                  eid="e23"
                  className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5"
                >
                  <Icon eid="e24" icon="solar:map-arrow-square-linear" className="size-3.5" />{" "}
                  Kecamatan
                </p>
                <p eid="e25" className="text-sm font-bold text-foreground">
                  Amahai
                </p>
              </div>
              <div eid="e26" className="space-y-2">
                <p
                  eid="e27"
                  className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5"
                >
                  <Icon eid="e28" icon="solar:home-2-bold" className="size-3.5" /> Desa
                </p>
                <p eid="e29" className="text-sm font-bold text-foreground">
                  Makariki
                </p>
              </div>
              <div eid="e30" className="space-y-2">
                <p
                  eid="e31"
                  className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5"
                >
                  <Icon eid="e32" icon="solar:letter-opened-linear" className="size-3.5" /> Kode Pos
                </p>
                <p eid="e33" className="text-sm font-bold text-foreground">
                  97511
                </p>
              </div>
            </div>
            <div eid="e34" className="pt-6 space-y-4">
              <div
                eid="e35"
                className="flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent p-4 rounded-2xl"
              >
                <div eid="e36" className="space-y-2">
                  <p
                    eid="e37"
                    className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5"
                  >
                    <Icon eid="e38" icon="solar:point-on-map-bold" className="size-3.5" />
                    Koordinat Geografis
                  </p>
                  <div eid="e39" className="flex items-center gap-4">
                    <div eid="e40" className="flex flex-col">
                      <span eid="e41" className="text-[10px] text-muted-foreground font-bold">
                        LAT
                      </span>
                      <span eid="e42" className="text-sm font-mono font-bold text-foreground">
                        -3.321456
                      </span>
                    </div>
                    <div eid="e43" className="w-px h-8 bg-border" />
                    <div eid="e44" className="flex flex-col">
                      <span eid="e45" className="text-[10px] text-muted-foreground font-bold">
                        LONG
                      </span>
                      <span eid="e46" className="text-sm font-mono font-bold text-foreground">
                        128.987654
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  eid="e47"
                  className="size-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg"
                >
                  <Icon eid="e48" icon="solar:map-bold" className="size-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main eid="e19" className="flex-1 px-6 -mt-20 pb-6 space-y-6 relative z-10 pb-30">
        <section eid="e60" className="space-y-4 pb-8">
          <div className="flex gap-2 mb-4 p-1 bg-white border border-border shadow-xl rounded-full">
            <button className="flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all text-muted-foreground">
              Checklist
            </button>
            <button className="flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all border text-white bg-secondary-foreground border-secondary-foreground">
              Investor
            </button>
          </div>
          <div className="bg-white p-6 rounded-3xl border-border shadow-xl border-b border-l border-r pt-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon icon="solar:buildings-3-bold" className="size-5 text-primary" />
              </div>
              <h3 className="font-bold text-lg font-heading">Investor Terkait</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-border/50">
                <div className="size-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-xl shadow-md">
                  PT
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Nama Perusahaan
                  </p>
                  <h4 className="font-bold text-base text-foreground">PT. Maju Terus Jaya</h4>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between bg-muted/50 p-4 rounded-2xl group">
                  <div className="space-y-1 flex-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                      <Icon icon="solar:letter-bold" className="size-3.5" />
                      Email Kontak
                    </p>
                    <p className="text-sm font-bold text-foreground">admin@maju-jaya.co.id</p>
                  </div>
                  <button className="size-10 rounded-xl bg-white border border-border text-primary flex items-center justify-center shadow-sm">
                    <Icon icon="solar:letter-bold" className="size-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between bg-muted/50 p-4 rounded-2xl">
                  <div className="space-y-1 flex-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                      <Icon icon="solar:user-id-bold" className="size-3.5" />
                      Kode Investor
                    </p>
                    <p className="text-sm font-mono font-bold text-foreground tracking-wider">
                      INV-2024-X091
                    </p>
                  </div>
                  <button className="size-10 rounded-xl bg-white border border-border text-primary flex items-center justify-center shadow-sm">
                    <Icon icon="solar:copy-bold" className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-2xl px-6 py-4 z-50">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase text-muted-foreground">
            <span>Progress Persiapan</span>
            <span className="text-base font-extrabold text-foreground">80%</span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden bg-muted">
            <div className="h-full bg-gradient-to-r from-chart-4 to-green-400 rounded-full w-[85%] shadow-lg" />
          </div>
        </div>
        <button className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-shadow bg-primary text-white mt-5">
          <Icon icon="solar:check-circle-bold" className="size-5" />
          Validasi Data Persiapan
        </button>
      </div>
    </div>
  );
}
