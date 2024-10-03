const express   = require ('express')
const app       = express()
const mysql     = require ('mysql2')
const port      = 8000

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


function getAll_karyawan() {
    return new Promise( (resolve, reject) => {
        let sqlSyntax = 
        `SELECT
            karyawan.*, 
            departemen.kode, departemen.nama AS nama_dept, 
            agama.nama AS nama_agama
        FROM karyawan
        LEFT JOIN departemen ON departemen.id = karyawan.departemenn_id
        LEFT JOIN agama ON agama.id = karyawan.agama_id
        ORDER BY karyawan.nama`
        db.query(sqlSyntax, function(errorSql, hasil) {
            if (errorSql) {
                reject(errorSql)
            } else {
                resolve(hasil)
            }
        })
    })
}



app.set('view engine', 'ejs') // setting penggunaan template engine untuk express
app.set('views', './view-ejs') // setting penggunaan folder untuk menyimpan file .ejs

// function render ('nama-file')
// nama file wajib berekstensi .ejs
// otomotis mengambil file .ejs yg ada di folder view-ejs

app.get('/', function(req,res) {
    res.render('beranda')
})

app.get ('/pendidikan', (req,res) => {
    let profil = {
        nama: 'Haruto',
        s1: 'Universitas Tokyo, Teknik Informatika',
        smk: 'SMA Karasuno'
    }
    res.render('page-pendidikan', profil)
})

app.get('/karyawan', async (req,res) => {
    let data = {
        karyawan: await  getAll_karyawan()
    }
    res.render('page-karyawan', data)
})

app.listen(port, () => {
    console.log('Server  nyala, buka http://localhost:' + port)
})