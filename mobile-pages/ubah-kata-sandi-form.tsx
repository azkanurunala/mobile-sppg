import { Icon } from "@iconify/react";

export function UbahKataSandiForm() {
  return (
    <div className="flex flex-col h-full bg-background font-sans overflow-hidden">
      <div className="bg-card border-b border-border pt-12 pb-6 px-6">
        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center size-10 rounded-xl bg-muted active:opacity-80 transition-opacity">
            <Icon icon="solar:arrow-left-linear" className="size-6 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground font-heading">Ubah Kata Sandi</h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mb-8">
          <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <Icon icon="solar:shield-keyhole-bold" className="size-8 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-foreground font-heading">Amankan Akun Anda</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gunakan kata sandi yang kuat untuk menjaga keamanan akun Anda.
          </p>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">
              Kata Sandi Saat Ini
            </label>
            <div className="relative">
              <input
                type="password"
                className="w-full bg-input border border-border px-4 py-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                placeholder="Masukkan kata sandi lama"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Icon icon="solar:eye-linear" className="size-5" />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">
              Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                type="password"
                className="w-full bg-input border border-border px-4 py-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                placeholder="Minimal 8 karakter"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Icon icon="solar:eye-linear" className="size-5" />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground ml-1">
              Kata sandi harus terdiri dari huruf dan angka.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">
              Konfirmasi Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                type="password"
                className="w-full bg-input border border-border px-4 py-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                placeholder="Ulangi kata sandi baru"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Icon icon="solar:eye-linear" className="size-5" />
              </button>
            </div>
          </div>
          <div className="bg-secondary p-4 rounded-xl border border-accent mt-2">
            <div className="flex gap-3">
              <Icon
                icon="solar:info-circle-bold"
                className="size-5 text-secondary-foreground shrink-0"
              />
              <p className="text-xs text-secondary-foreground leading-relaxed">
                Pastikan kata sandi baru Anda tidak sama dengan kata sandi yang digunakan sebelumnya
                atau yang mudah ditebak.
              </p>
            </div>
          </div>
          <button className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-sm active:opacity-90 transition-all mt-4 flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
            <span>Perbarui Kata Sandi</span>
            <Icon icon="solar:check-read-linear" className="size-5" />
          </button>
        </div>
      </div>
      <div className="pb-8 text-center px-6">
        <p className="text-xs text-muted-foreground">Terakhir diperbarui: 3 bulan yang lalu</p>
      </div>
    </div>
  );
}
