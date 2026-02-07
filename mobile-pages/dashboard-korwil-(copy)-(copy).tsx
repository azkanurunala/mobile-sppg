import { Icon } from "@iconify/react";

export function DashboardKorwilCopyCopy() {
  return (
    <>
      <div className="flex flex-col min-h-screen w-full bg-background font-sans text-foreground pb-24">
        <header className="px-6 pt-12 pb-32 flex items-center justify-between bg-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 size-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 size-48 bg-white/5 rounded-full blur-2xl" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="relative">
              <div className="size-12 rounded-full border-2 border-white/30 shadow-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white font-bold text-lg">VS</span>
              </div>
              <div className="absolute bottom-0 right-0 size-3 rounded-full bg-chart-4 border-2 border-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading text-white">Vindy Sari Puspa</h2>
              <p className="text-xs font-medium text-white/70 flex items-center gap-1">
                <Icon icon="solar:map-point-wave-bold" className="size-3 text-white" />
                Kab. Maluku Tengah, Maluku
              </p>
            </div>
          </div>
        </header>
        <main className="flex-1 px-6 space-y-6 overflow-y-auto -mt-20">
          <section className="bg-white p-4 rounded-2xl shadow-lg border border-border relative overflow-hidden group">
            <div className="absolute -right-2 -top-2 size-16 bg-primary/5 rounded-full blur-xl" />
            <div className="relative z-10 flex flex-col gap-1">
              <span className="text-muted-foreground text-xs font-medium">
                Total SPPG Terdaftar
              </span>
              <div className="flex items-end justify-between">
                <h1 className="text-3xl font-extrabold font-heading text-foreground">142</h1>
                <div className="flex items-center gap-1 px-2 py-1 bg-chart-4/10 rounded-lg text-chart-4 text-xs font-bold">
                  <Icon icon="solar:graph-up-bold" className="size-3" />
                  <span>+12%</span>
                </div>
              </div>
            </div>
          </section>
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg font-heading">Status SPPG</h3>
              <button className="text-sm font-semibold text-primary flex items-center gap-1">
                Detail
                <Icon icon="solar:arrow-right-linear" className="size-4" />
              </button>
            </div>
            <div
              eid="e30"
              className="bg-gradient-to-br from-primary to-primary/90 rounded-3xl shadow-xl relative overflow-hidden px-6 pt-6 pb-4"
            >
              <div
                eid="e31"
                className="absolute -right-8 -top-8 size-40 bg-white/10 rounded-full blur-3xl"
              />
              <div eid="e32" className="relative z-10 flex flex-col gap-4">
                <div eid="e33" className="flex items-start gap-4">
                  <div
                    eid="e34"
                    className="size-16 rounded-2xl bg-white/15 text-white flex items-center justify-center flex-shrink-0 backdrop-blur-sm"
                  >
                    <Icon eid="e35" icon="solar:clipboard-check-bold" className="size-9" />
                  </div>
                  <div eid="e36" className="flex flex-col gap-1">
                    <span
                      eid="e37"
                      className="text-white/80 text-sm font-bold uppercase tracking-wider"
                    >
                      Validasi Data Persiapan
                    </span>
                    <div eid="e38" className="flex items-baseline gap-2">
                      <span eid="e39" className="text-5xl font-extrabold font-heading text-white">
                        32
                      </span>
                      <span eid="e40" className="text-xl font-bold text-white/70">
                        SPPG
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-white/90 text-xs font-semibold">
                    <span>Persentase dari Total</span>
                    <span>22.5%</span>
                  </div>
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                    <div className="h-full bg-white rounded-full w-[22.5%] shadow-lg" />
                  </div>
                </div>
              </div>
            </div>
            <section className="bg-white p-5 rounded-2xl border border-border shadow-lg space-y-4 -mt-12 pt-12">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="font-bold text-lg font-heading">Progres Persiapan</h3>
                  <p className="text-xs text-muted-foreground">Rata-rata seluruh wilayah</p>
                </div>
                <div className="size-12 rounded-full border-4 border-primary/20 flex items-center justify-center bg-primary/5">
                  <span className="text-sm font-bold text-primary">78%</span>
                </div>
              </div>
              <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-chart-5 rounded-full w-[78%]" />
              </div>
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Target: 100%</span>
                <span>Deadline: 30 Jun 2024</span>
              </div>
            </section>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-border flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="size-10 rounded-xl bg-blue-50 text-chart-5 flex items-center justify-center">
                  <Icon icon="solar:user-check-rounded-bold" className="size-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Assign Investor
                  </span>
                  <span className="text-2xl font-bold font-heading text-foreground">18</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
                    <span>Persentase</span>
                    <span>12.7%</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-chart-5 rounded-full w-[12.7%]" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-border flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="size-10 rounded-xl bg-amber-50 text-chart-1 flex items-center justify-center">
                  <Icon icon="solar:document-add-bold" className="size-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Dokumen Pendaftaran
                  </span>
                  <span className="text-2xl font-bold font-heading text-foreground">25</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
                    <span>Persentase</span>
                    <span>17.6%</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-chart-1 rounded-full w-[17.6%]" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-border flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="size-10 rounded-xl bg-purple-50 text-chart-2 flex items-center justify-center">
                  <Icon icon="solar:settings-minimalistic-bold" className="size-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Proses Persiapan
                  </span>
                  <span className="text-2xl font-bold font-heading text-foreground">41</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
                    <span>Persentase</span>
                    <span>28.9%</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-chart-2 rounded-full w-[28.9%]" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-border flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="size-10 rounded-xl bg-rose-50 text-chart-3 flex items-center justify-center">
                  <Icon icon="solar:dollar-minimalistic-bold" className="size-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Appraisal Biaya Sewa
                  </span>
                  <span className="text-2xl font-bold font-heading text-foreground">14</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
                    <span>Persentase</span>
                    <span>9.9%</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-chart-3 rounded-full w-[9.9%]" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-border flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="size-10 rounded-xl bg-teal-50 text-primary flex items-center justify-center">
                  <Icon icon="solar:shield-check-bold" className="size-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Validasi Data Pendaftaran
                  </span>
                  <span className="text-2xl font-bold font-heading text-foreground">22</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
                    <span>Persentase</span>
                    <span>15.5%</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[15.5%]" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-border flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="size-10 rounded-xl bg-lime-50 text-chart-4 flex items-center justify-center">
                  <Icon icon="solar:document-text-bold" className="size-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Perjanjian Sewa
                  </span>
                  <span className="text-2xl font-bold font-heading text-foreground">22</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
                    <span>Persentase</span>
                    <span>15.5%</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-chart-4 rounded-full w-[15.5%]" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around items-center py-3 px-2 z-50">
        <button eid="e48" className="flex flex-col items-center gap-1 min-w-16">
          <Icon eid="e49" icon="solar:home-2-bold" className="size-6 text-primary" />
          <span eid="e50" className="text-[10px] font-bold text-primary">
            Beranda
          </span>
        </button>
        <button eid="e51" className="flex flex-col items-center gap-1 min-w-16">
          <Icon
            eid="e52"
            icon="solar:document-text-bold"
            className="size-6 text-muted-foreground"
          />
          <span eid="e53" className="text-[10px] font-medium text-muted-foreground">
            SPPG
          </span>
        </button>
        <button className="flex flex-col items-center gap-1 min-w-16">
          <Icon icon="solar:user-bold" className="size-6 text-muted-foreground" />
          <span className="text-[10px] font-medium text-muted-foreground">Profil</span>
        </button>
      </div>
    </>
  );
}
