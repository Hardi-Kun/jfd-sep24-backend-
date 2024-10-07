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


function getOne_karyawan( id ) {
    return new Promise( (resolve, reject) => {
        let sqlSyntax = 
        `SELECT
            karyawan.*, 
            departemen.kode, departemen.nama AS nama_dept, 
            agama.nama AS nama_agama
        FROM karyawan
        LEFT JOIN departemen ON departemen.id = karyawan.departemenn_id
        LEFT JOIN agama ON agama.id = karyawan.agama_id
        WHERE karyawan.id = ?
        ORDER BY karyawan.nama`
        db.query(sqlSyntax, [id], function(errorSql, hasil) {
            if (errorSql) {
                reject(errorSql)
            } else {
                resolve(hasil)
            }
        })
    })
}


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
        karyawan: await  getAll_karyawan(),
        notifikasi:  req.query.notif
    }
    res.render('page-karyawan', data)
})

app.get('/karyawan/detail/:id_karyawan', async (req,res) => {

    // ambil data karyawan 1 aja
    let data = {
        satuKaryawan: await getOne_karyawan(req.params.id_karyawan)
    }
    res.render('page-karyawan-detail', data)
})


function getAll_departemen() {
    return new Promise( (resolve, reject) => {
        let sqlSyntax = 
        `SELECT * FROM departemen`
        db.query(sqlSyntax, function(errorSql, hasil) {
            if (errorSql) {
                reject(errorSql)
            } else {
                resolve(hasil)
            }
        })
    })
}

function getAll_agama() {
    return new Promise( (resolve, reject) => {
        let sqlSyntax =
        `SELECT * FROM agama`
        db.query(sqlSyntax, function(errorSql, hasil) {
            if (errorSql) {
                reject(errorSql)
            } else {
                resolve(hasil)
            }
        })
    })
}


app.get('/karyawan/tambah', async (req,res) => {
    let data = {
        departemen: await getAll_departemen(),
        agama: await getAll_agama(),
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

function insert_karyawan( req ) {
    return new Promise( (resolve, reject) => {
        let sqlSyntax = 
        `INSERT INTO karyawan
        (Nama, Gender, Alamat, NIP, departemenn_id, agama_id)
        VALUES
        (?, ?, ?, ?, ?, ?)`

        let sqlData = [
            req.body.form_nama_lengkap,
            req.body.form_gender,
            req.body.form_alamat,
            req.body.form_NIP,
            req.body.form_jabatan,
            req.body.form_agama
        ]

        db.query(sqlSyntax,sqlData, function(errorSql, hasil) {
            if (errorSql) {
                reject(errorSql)
            } else {
                resolve(hasil)
            }
        })
    })
}

function hapusKaryawan( id ) {
    return new Promise( (resolve, reject) => {
        let sqlSyntax = 
        `DELETE FROM karyawan WHERE id = ?`

        db.query(sqlSyntax, [id], function(errorSql, hasil) {
            if (errorSql) {
                reject(errorSql)
            } else {
                resolve(hasil)
            }
        })
    })
}


app.get('/karyawan/hapus/:id', async (req,res)  => {
    try {
        let hapus = await hapusKaryawan( req.params.id )
        if (hapus.affectedRows > 0) {
            res.redirect('/karyawan')
        }
    } catch (error) {
        throw error
    }
})

app.get('/karyawan/edit/:id', async (req,res) => {
    let data = {
        satuKaryawan: await getOne_karyawan(req.params.id),
        departemen: await getAll_departemen(),
        agama: await getAll_agama(),
        moment: moment,
    }
    res.render('page-karyawan-edit', data)
})

app.post('/karyawan/proses-update-data/:id', async (req,res) => {
    try {
        let update = await update_karyawan(req)
        if (update.affectedRows > 0 ) {
            res.redirect('/karyawan?notif=Berhasil perbarui data karyawan')
        }
    } catch (error) {
        
    }
})

function update_karyawan(req) {
    return new Promise( (resolve, reject) => {
        let sqlSyntax = 
        `UPDATE karyawan SET ? WHERE id = ?`

        let sqlData = {
            Nama            : req.body.form_nama_lengkap,
            Gender          : req.body.form_gender,
            Alamat          : req.body.form_alamat,
            NIP             : req.body.form_NIP,
            departemenn_id  : req.body.form_jabatan,
            agama_id        : req.body.form_agama
        }

        db.query(sqlSyntax,[sqlData, req.params.id], function(errorSql, hasil) {
            if (errorSql) {
                reject(errorSql)
            } else {
                resolve(hasil)
            }
        })
    })
}

app.listen(port, () => {
    console.log('Server  nyala, buka http://localhost:' + port)
})