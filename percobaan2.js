// 1. panggil dulu filenya
// 2. file yg dipanggil, sudah mengekspor variabelnya
// 3. panggil file.variabel

// Cara ke-1
const dp = require ('./datapribadi')
console.log(dp.nama_lengkap)
console.log(dp.alamat)

// Cara ke-2
console.log(require ('./datapribadi').nama_lengkap)