# SPPG Admin Dashboard

Aplikasi web admin berbasis **Next.js** untuk mengelola sistem SPPG (Sistem Pengelolaan dan Pemantauan Galeri).

## 🌍 Ekosistem SPPG

Aplikasi ini mencakup pengelolaan:

### 1. SPPG (Satuan Pelayanan Pemenuhan Gizi)
Unit pelayanan dari **Badan Gizi Nasional**.
- **Data**: Kode Unik, Status, Persentase Persiapan, Lokasi (Lat/Long).
- **Relasi**: Terhubung dengan Investor dan Wilayah.

### 2. Investor
Pihak yang bermitra dengan SPPG.
- **Tipe**: Individu, Perusahaan, dll.
- **Data**: NIK, Kontak, Mitra Terkait.

### 3. Master Data Wilayah
Integrasi data administratif Indonesia (Kemendagri).

---

## 🛠️ Tech Stack

| Teknologi | Versi | Deskripsi |
|-----------|-------|-----------|
| **Next.js** | 14.x | React framework dengan App Router |
| **Prisma** | 5.x | ORM (User, SPPG, Investor, Region) |
| **TailwindCSS** | 3.x | Styling |

---

## 📝 Database Schema

```prisma
model SPPG {
  id            String    @id // Kode Unik (e.g. 02.T.8624)
  status        String?
  investor      Investor? @relation(fields: [investorId], references: [id])
  village       Village?  @relation(fields: [villageId], references: [id])
}

model Investor {
  id    String @id // Kode Investor (e.g. INVSMDPAIB)
  name  String
  type  String // Individu / Perusahaan
  nik   String?
  sppgs SPPG[]
}
```

---

## 🚀 Quick Start

1. **Install**: `npm install`
2. **Env**: Setup `.env.local`
3. **Database**: 
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```
4. **Run**: `npm run dev`
