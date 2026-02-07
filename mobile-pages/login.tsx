import { Icon } from "@iconify/react";

export function Login() {
  return (
    <div className="flex flex-col h-full bg-background font-sans overflow-hidden">
      <div eid="e2" class="flex-1 flex flex-col">
        <div eid="e3" class="bg-primary px-6 pt-16 pb-24 relative">
          <div eid="e4" class="flex flex-col items-center">
            <div
              eid="e5"
              class="size-20 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-6"
              className="rounded-3xl"
            >
              <div
                eid="e6"
                className="size-24 bg-white rounded-3xl flex items-center justify-center shadow-lg p-4 mb-4"
              >
                <Icon eid="e7" icon="solar:chef-hat-bold" className="size-12 text-primary" />
              </div>
            </div>
            <h1 eid="e7" class="text-2xl font-bold text-white font-heading mb-2">
              Selamat Datang
            </h1>
            <p eid="e8" class="text-white/90 text-center">
              Silakan masuk ke akun SPPG BGN Anda sebagai Korwil{" "}
            </p>
          </div>
        </div>
        <div
          eid="e9"
          class="flex-1 bg-background px-6 -mt-12 pt-8 pb-8 rounded-t-3xl relative z-10"
        >
          <div eid="e10" class="space-y-6">
            <div eid="e11" class="space-y-2">
              <label eid="e12" class="text-sm font-semibold text-foreground ml-1">
                No Handphone Anda
              </label>
              <div eid="e13" class="relative group">
                <div
                  eid="e14"
                  class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <Icon eid="e15" icon="solar:phone-bold" class="size-5" />
                </div>
                <input
                  eid="e16"
                  type="tel"
                  class="w-full bg-input border border-border rounded-xl py-4 pl-12 pr-4 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                  placeholder="Masukkan Nomor Handphone Anda"
                />
              </div>
            </div>
            <div eid="e17" class="space-y-2">
              <div eid="e18" class="flex justify-between items-center ml-1">
                <label eid="e19" class="text-sm font-semibold text-foreground">
                  Kata Sandi
                </label>
                <button eid="e20" class="text-xs font-semibold text-primary">
                  Lupa Sandi?
                </button>
              </div>
              <div eid="e21" class="relative group">
                <div
                  eid="e22"
                  class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <Icon eid="e23" icon="solar:lock-password-bold" class="size-5" />
                </div>
                <input
                  eid="e24"
                  type="password"
                  class="w-full bg-input border border-border rounded-xl py-4 pl-12 pr-12 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                  placeholder="Masukkan kata sandi"
                />
                <button
                  eid="e25"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <Icon eid="e26" icon="solar:eye-bold" class="size-5" />
                </button>
              </div>
            </div>
            <div eid="e27" class="flex items-start gap-2 px-1">
              <Icon
                eid="e28"
                icon="solar:danger-circle-bold"
                class="size-4 text-destructive shrink-0 mt-0.5"
              />
              <p eid="e29" class="text-xs text-destructive leading-relaxed">
                Kombinasi nomor handphone atau kata sandi yang Anda masukkan tidak sesuai. Silakan
                coba lagi.
              </p>
            </div>
            <div eid="e30" class="pt-2">
              <button
                eid="e31"
                class="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
              >
                <Icon eid="e32" icon="svg-spinners:ring-resize" class="size-5" />
                <span eid="e33">Masuk</span>
              </button>
            </div>
            <div eid="e34" class="flex items-center gap-4 py-4">
              <div eid="e35" class="h-px flex-1 bg-border" />
              <span
                eid="e36"
                class="text-xs text-muted-foreground font-medium uppercase tracking-wider"
              >
                Atau
              </span>
              <div eid="e37" class="h-px flex-1 bg-border" />
            </div>
            <button
              eid="e38"
              class="w-full bg-secondary text-secondary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all border border-border"
            >
              <Icon eid="e39" icon="solar:face-scan-bold" class="size-5" />
              <span eid="e40">Masuk dengan Biometrik</span>
            </button>
          </div>
          <div eid="e41" class="mt-auto pt-8 flex flex-col items-center gap-6">
            <div
              eid="e42"
              class="flex items-center gap-2 bg-chart-1/10 text-chart-1 px-4 py-3 rounded-2xl border border-chart-1/20 w-full"
            >
              <div
                eid="e43"
                class="size-8 bg-chart-1 rounded-full flex items-center justify-center shrink-0"
              >
                <Icon eid="e44" icon="solar:check-read-bold" class="size-5 text-white" />
              </div>
              <div eid="e45" class="flex-1">
                <p eid="e46" class="text-sm font-bold">
                  Verifikasi Berhasil
                </p>
                <p eid="e47" class="text-[10px] opacity-80">
                  Mengalihkan Anda ke Dashboard...
                </p>
              </div>
            </div>
            <div eid="e48" class="text-center">
              <p eid="e49" class="text-sm text-muted-foreground">
                Belum memiliki akun?{" "}
                <span eid="e50" class="text-primary font-bold">
                  Daftar Sekarang
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
