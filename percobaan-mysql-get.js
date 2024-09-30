const { error } = require('console')
const mysql = require ('mysql2')

// sambungkan ke mysql
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jfd_belajar_database',
})

// menyambungkan atau membuka koneksi
db.connect( (error) => {
    if (error) {
        throw error
    } else {
        console.log('berhasil tersambung ke mysql')
    }
})

// ambil data dari mysql
db.query("SELECT * FROM `karyawan`", function(error, hasil) {
    if (error) {
        console.log(error)
    } else {
        console.log(hasil)
    }
})

db.end()
