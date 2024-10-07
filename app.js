const express   = require ('express')
const app       = express()
const mysql     = require ('mysql2')
const port      = 8000
const moment    = require ('moment')
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

const model_agama       = require ('./model/m_agama')
const model_dept        = require ('./model/m_dept')
const model_karyawan    = require ('./model/m_karyawan')

app.use( express.urlencoded({extended:false}))
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
        karyawan: await  model_karyawan.getAll_karyawan(),
        notifikasi:  req.query.notif
    }
    res.render('page-karyawan', data)
})

app.get('/karyawan/detail/:id_karyawan', async (req,res) => {

    // ambil data karyawan 1 aja
    let data = {
        satuKaryawan: await model_karyawan.getOne_karyawan(req.params.id_karyawan)
    }
    res.render('page-karyawan-detail', data)
})





app.get('/karyawan/tambah', async (req,res) => {
    let data = {
        departemen: await model_dept.getAll_departemen(),
        agama: await model_agama.getAll_agama(),
    }
    res.render('page-karyawan-form-tambah', data)
})




let formValidasiInsert = [
    body('form_nama_lengkap').notEmpty().isString(),
    body('form_NIP').notEmpty().isNumeric(),
]

app.post('/karyawan/proses-insert-data', formValidasiInsert,  async (req,res) => {

    // 1. tangkap isi data dari masing-masing form
    // req.body                 => ambil  semua inputan dri form
    // req.body.form_nama       => ambil  satuan inputan dri form

    const errors = validationResult(req)
    // jika lolos validasi
    if (errors.isEmpty()) {
        // in case request params meet the validation criteria
        try {
            // 2. kirim sebagai script SQL
            let insert = await insert_karyawan( req )
    
            // 3. proses pengecekan terinput ke db atau gagal
            if (insert.affectedRows > 0) {
                // 3a. jika berhasil, tampilkan pesan sukses
                res.redirect('/karyawan?notif=Berhasil Insert Data')
                // console.log('berhasil input ke database')
            }
        } catch (error) {
            // 3b. jika gagal, tampilkan pesan error
            throw error
        }
    }
    // jika tidak lolos
    else {
        // res.status(422).json({errors: errors.array()})
        let errorData = {
            pesanError: errors.array()
        }
        errorData.pesanError[0].fields
        res.render('page-karyawan-form-tambah', errorData)
    }

})



app.get('/karyawan/hapus/:id', async (req,res)  => {
    try {
        let hapus = await model_karyawan.hapusKaryawan( req.params.id )
        if (hapus.affectedRows > 0) {
            res.redirect('/karyawan')
        }
    } catch (error) {
        throw error
    }
})

app.get('/karyawan/edit/:id', async (req,res) => {
    let data = {
        satuKaryawan: await model_karyawan.getOne_karyawan(req.params.id),
        departemen: await model_dept.getAll_departemen(),
        agama: await model_agama.getAll_agama(),
        moment: moment,
    }
    res.render('page-karyawan-edit', data)
})

app.post('/karyawan/proses-update-data/:id', async (req,res) => {
    try {
        let update = await model_karyawan.update_karyawan(req)
        if (update.affectedRows > 0 ) {
            res.redirect('/karyawan?notif=Berhasil perbarui data karyawan')
        }
    } catch (error) {
        
    }
})



app.listen(port, () => {
    console.log('Server  nyala, buka http://localhost:' + port)
})