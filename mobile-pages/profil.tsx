import { Icon } from "@iconify/react";

export function Profil() {
  return (
    <div className="flex flex-col h-full bg-background font-sans overflow-hidden">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div
          eid="e3"
          className="relative pt-16 px-6 bg-gradient-to-br from-primary via-primary to-blue-700 overflow-visible pb-28"
        >
          <div eid="e4" className="flex justify-between items-center mb-8">
            <h1 eid="e5" className="text-xl font-bold text-white font-heading">
              Profil Saya
            </h1>
          </div>
          <div eid="e6" className="flex flex-col items-center gap-4">
            <div eid="e7" className="relative">
              <div
                eid="e8"
                className="size-28 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm flex items-center justify-center bg-white"
              >
                <span eid="e9" className="text-4xl font-bold font-heading text-blue-600">
                  VSP
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 size-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                <Icon icon="solar:pen-bold" className="size-5 text-primary" />
              </div>
            </div>
            <div eid="e10" className="flex flex-col items-center gap-1">
              <p eid="e11" className="text-xl font-bold text-white">
                Vindy Sari Puspa
              </p>
              <div eid="e12" className="flex items-center gap-2">
                <Icon
                  eid="e13"
                  icon="solar:phone-calling-rounded-bold"
                  className="size-4 text-white/80"
                />
                <p eid="e14" className="text-base text-white/90">
                  +62 812-3456-7890
                </p>
              </div>
              <div eid="e15" className="flex items-center gap-2">
                <Icon eid="e16" icon="solar:map-point-wave-bold" className="size-4 text-white/80" />
                <p eid="e17" className="text-sm text-white/90">
                  Kab. Maluku Tengah, Maluku
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-6 flex flex-col gap-4">
          <div className="px-6 mb-6 relative z-50 -mt-[calc(5rem+20px)]">
            <button className="w-full py-3.5 text-sm font-bold rounded-2xl border border-border active:scale-[0.98] transition-transform flex items-center justify-center gap-2 bg-transparent text-white border-2 border-white">
              <Icon icon="solar:user-id-bold" className="size-5" />
              <span>Update Data</span>
            </button>
          </div>
          <div eid="e11" className="flex flex-col gap-3" />
          <div className="flex flex-col gap-3 mt-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Keamanan
            </h3>
            <div className="flex flex-col gap-2">
              <button
                eid="e24"
                className="flex items-center gap-4 bg-card p-4 rounded-2xl shadow-sm border border-border active:shadow-md active:scale-[0.99] transition-all"
              >
                <div
                  eid="e25"
                  className="size-11 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl flex items-center justify-center shadow-md"
                >
                  <Icon eid="e26" icon="solar:shield-check-bold" className="size-5" />
                </div>
                <div eid="e27" className="flex-1 text-left">
                  <p eid="e28" className="text-sm font-bold text-foreground">
                    Login dengan Biometrik
                  </p>
                  <p eid="e29" className="text-xs text-muted-foreground">
                    Aktifkan keamanan biometrik
                  </p>
                </div>
                <Icon
                  eid="e30"
                  icon="solar:alt-arrow-right-linear"
                  className="size-5 text-muted-foreground"
                />
              </button>
              <button
                eid="e31"
                className="flex items-center gap-4 bg-card p-4 rounded-2xl shadow-sm border border-border active:shadow-md active:scale-[0.99] transition-all"
              >
                <div
                  eid="e32"
                  className="size-11 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-xl flex items-center justify-center shadow-md"
                >
                  <Icon eid="e33" icon="solar:lock-password-bold" className="size-5" />
                </div>
                <div eid="e34" className="flex-1 text-left">
                  <p eid="e35" className="text-sm font-bold text-foreground">
                    Ubah Kata Sandi
                  </p>
                  <p eid="e36" className="text-xs text-muted-foreground">
                    Perbarui kata sandi Anda
                  </p>
                </div>
                <Icon
                  eid="e37"
                  icon="solar:alt-arrow-right-linear"
                  className="size-5 text-muted-foreground"
                />
              </button>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground mb-8">SPPG BGN Versi 1.0.0</p>
            </div>
            <button className="flex items-center gap-4 bg-card p-4 rounded-2xl shadow-sm border border-border active:shadow-md active:scale-[0.99] transition-all">
              <div className="size-11 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl flex items-center justify-center shadow-md">
                <Icon icon="solar:logout-2-bold" className="size-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-destructive">Keluar</p>
                <p className="text-xs text-destructive/70">Keluar dari akun Anda</p>
              </div>
              <Icon icon="solar:alt-arrow-right-linear" className="size-5 text-destructive/70" />
            </button>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around items-center py-3 px-2 z-50">
        <button eid="e48" className="flex flex-col items-center gap-1 min-w-16">
          <Icon eid="e49" icon="solar:home-2-bold" className="size-6 text-muted-foreground" />
          <span eid="e50" className="text-[10px] font-medium text-muted-foreground">
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
          <Icon icon="solar:user-bold" className="size-6 text-primary" />
          <span className="text-[10px] font-bold text-primary">Profil</span>
        </button>
      </div>
    </div>
  );
}
