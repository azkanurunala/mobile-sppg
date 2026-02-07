import { Icon } from "@iconify/react";

export function UpdateDataForm() {
  return (
    <div className="flex flex-col h-full bg-background font-sans overflow-hidden">
      <div className="flex items-center gap-4 px-6 pt-12 pb-6 bg-card border-b border-border">
        <button className="flex items-center justify-center size-10 rounded-xl bg-muted active:bg-border transition-colors">
          <Icon icon="solar:arrow-left-linear" className="size-6 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground font-heading">Update Data</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 flex flex-col gap-8">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">
                Nama
              </label>
              <input
                type="text"
                className="w-full bg-input border border-border rounded-xl px-4 py-4 text-base font-semibold text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                placeholder="Masukkan nama lengkap"
                defaultValue="Azka Nurun Ala"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">
                No Telp
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-border pr-3">
                  <span className="text-base font-semibold text-foreground">+62</span>
                </div>
                <input
                  type="tel"
                  className="w-full bg-input border border-border rounded-xl pl-18 pr-4 py-4 text-base font-semibold text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  placeholder="812xxxxxxx"
                  defaultValue="81234567890"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">
                Provinsi
              </label>
              <div className="relative">
                <select className="w-full bg-input border border-border rounded-xl px-4 py-4 text-base font-semibold text-foreground appearance-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none">
                  <option value="Maluku">Maluku</option>
                  <option value="Jawa Barat">Jawa Barat</option>
                  <option value="DKI Jakarta">DKI Jakarta</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon
                    icon="solar:alt-arrow-down-linear"
                    className="size-5 text-muted-foreground"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">
                Kota/Kabupaten
              </label>
              <div className="relative">
                <select className="w-full bg-input border border-border rounded-xl px-4 py-4 text-base font-semibold text-foreground appearance-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none">
                  <option value="Kab. Maluku Tengah">Kab. Maluku Tengah</option>
                  <option value="Kota Ambon">Kota Ambon</option>
                  <option value="Kab. Maluku Tenggara">Kab. Maluku Tenggara</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon
                    icon="solar:alt-arrow-down-linear"
                    className="size-5 text-muted-foreground"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 bg-card border-t border-border">
        <button className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-sm active:opacity-80 transition-opacity flex items-center justify-center gap-2">
          <Icon icon="solar:diskette-bold" className="size-5" />
          <span>Simpan Data</span>
        </button>
      </div>
    </div>
  );
}
