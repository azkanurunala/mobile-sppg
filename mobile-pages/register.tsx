import { Icon } from "@iconify/react";

export function Register() {
  return (
    <div className="flex flex-col h-full bg-background font-sans overflow-hidden">
      <div className="flex-1 flex flex-col px-6 pt-12 pb-8 overflow-y-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="size-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-6">
            <Icon icon="solar:user-plus-bold" className="size-12 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground font-heading mb-2">Daftar Akun</h1>
          <p className="text-muted-foreground text-center">
            Lengkapi data diri Anda untuk mendaftar layanan SPPG BGN
          </p>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground ml-1">Nama Lengkap</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Icon icon="solar:user-bold" className="size-5" />
              </div>
              <input
                type="text"
                className="w-full bg-input border border-border rounded-xl py-4 pl-12 pr-4 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                placeholder="Masukkan nama lengkap Anda"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground ml-1">No Telepon</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Icon icon="solar:phone-bold" className="size-5" />
              </div>
              <input
                type="tel"
                className="w-full bg-input border border-border rounded-xl py-4 pl-12 pr-4 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                placeholder="Contoh: 081234567890"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground ml-1">Provinsi</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Icon icon="solar:map-point-bold" className="size-5" />
              </div>
              <select className="w-full bg-input border border-border rounded-xl py-4 pl-12 pr-10 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm appearance-none">
                <option disabled selected>
                  Pilih Provinsi
                </option>
                <option value="jawa-barat">Jawa Barat</option>
                <option value="jawa-tengah">Jawa Tengah</option>
                <option value="jawa-timur">Jawa Timur</option>
                <option value="dki-jakarta">DKI Jakarta</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                <Icon icon="solar:alt-arrow-down-bold" className="size-5" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground ml-1">Kota/Kabupaten</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Icon icon="solar:buildings-bold" className="size-5" />
              </div>
              <select className="w-full bg-input border border-border rounded-xl py-4 pl-12 pr-10 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm appearance-none">
                <option disabled selected>
                  Pilih Kota/Kabupaten
                </option>
                <option value="bandung">Kota Bandung</option>
                <option value="bekasi">Kota Bekasi</option>
                <option value="bogor">Kota Bogor</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                <Icon icon="solar:alt-arrow-down-bold" className="size-5" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground ml-1">Kata Sandi</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Icon icon="solar:lock-password-bold" className="size-5" />
              </div>
              <input
                type="password"
                className="w-full bg-input border border-border rounded-xl py-4 pl-12 pr-12 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                placeholder="Buat kata sandi"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Icon icon="solar:eye-bold" className="size-5" />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground ml-1">Ulangi Kata Sandi</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Icon icon="solar:lock-password-bold" className="size-5" />
              </div>
              <input
                type="password"
                className="w-full bg-input border border-border rounded-xl py-4 pl-12 pr-12 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                placeholder="Ulangi kata sandi"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Icon icon="solar:eye-bold" className="size-5" />
              </button>
            </div>
          </div>
          <div className="pt-4">
            <button className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
              <span>Daftar Sekarang</span>
              <Icon icon="solar:arrow-right-linear" className="size-5" />
            </button>
          </div>
        </div>
        <div className="mt-8 mb-4 text-center">
          <p className="text-sm text-muted-foreground">
            Sudah memiliki akun? <span className="text-primary font-bold">Masuk di sini</span>
          </p>
        </div>
      </div>
    </div>
  );
}
