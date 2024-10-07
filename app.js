const express           = require ('express')
const app               = express()
const mysql             = require ('mysql2')
const moment            = require ('moment')
const model_agama       = require ('./model/m_agama')
const model_dept        = require ('./model/m_dept')
const model_karyawan    = require ('./model/m_karyawan')
const cont_beranda      = require ('./controller/c_beranda')
const cont_pendidikan   = require ('./controller/c_pendidikan')
const cont_karyawan     = require ('./controller/c_karyawan')
const port              = 8000
const {body, query, validationResult} = require('express-validator')

// sambungkan ke mysql
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jfd_belajar_database',
})

// menyambungkan atau membuka koneksi
db.connect()

app.use( express.urlencoded({extended:false}))
app.set('view engine', 'ejs') // setting penggunaan template engine untuk express
app.set('views', './view-ejs') // setting penggunaan folder untuk menyimpan file .ejs

// function render ('nama-file')
// nama file wajib berekstensi .ejs
// otomotis mengambil file .ejs yg ada di folder view-ejs

app.get('/', cont_beranda.beranda)
app.get ('/pendidikan', cont_pendidikan.hal_pendidikan)
app.get('/karyawan', cont_karyawan.hal_semua_karyawan)
app.get('/karyawan/detail/:id_karyawan', cont_karyawan.hal_detail_karyawan )
app.get('/karyawan/tambah', cont_karyawan.hal_tambah_karyawan )

let formValidasiInsert = [
    body('form_nama_lengkap').notEmpty().isString(),
    body('form_NIP').notEmpty().isNumeric(),
]
app.post('/karyawan/proses-insert-data', formValidasiInsert, cont_karyawan.proses_insert_data )
app.get('/karyawan/hapus/:id', cont_karyawan.proses_hapus)
app.get('/karyawan/edit/:id', cont_karyawan.proses_edit)
app.post('/karyawan/proses-update-data/:id', cont_karyawan.proses_update_data )

app.listen(port, () => {
    console.log('Server  nyala, buka http://localhost:' + port)
})