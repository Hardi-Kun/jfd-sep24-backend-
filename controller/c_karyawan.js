const model_agama       = require ('./../model/m_agama')
const model_dept        = require ('./../model/m_dept')
const model_karyawan    = require ('./../model/m_karyawan')
const {body, query, validationResult} = require('express-validator')

module.exports = 
{
    hal_semua_karyawan: async (req,res) => {
        let data = {
            karyawan: await  model_karyawan.getAll_karyawan(),
            notifikasi:  req.query.notif
        }
        res.render('page-karyawan', data)
    },

    hal_detail_karyawan: async (req,res) => {

        // ambil data karyawan 1 aja
        let data = {
            satuKaryawan: await model_karyawan.getOne_karyawan(req.params.id_karyawan)
        }
        res.render('page-karyawan-detail', data)
    },

    hal_tambah_karyawan: async (req,res) => {
        let data = {
            departemen: await model_dept.getAll_departemen(),
            agama: await model_agama.getAll_agama(),
        }
        res.render('page-karyawan-form-tambah', data)
    },

    proses_insert_data: async (req,res) => {

        // 1. tangkap isi data dari masing-masing form
        // req.body                 => ambil  semua inputan dri form
        // req.body.form_nama       => ambil  satuan inputan dri form
    
        const errors = validationResult(req)
        // jika lolos validasi
        if (errors.isEmpty()) {
            // in case request params meet the validation criteria
            try {
                // 2. kirim sebagai script SQL
                let insert = await model_karyawan.insert_karyawan( req )
        
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
    
    },

    proses_hapus: async (req,res)  => {
        try {
            let hapus = await model_karyawan.hapusKaryawan( req.params.id )
            if (hapus.affectedRows > 0) {
                res.redirect('/karyawan')
            }
        } catch (error) {
            throw error
        }
    },

    proses_edit: async (req,res) => {
        let data = {
            satuKaryawan: await model_karyawan.getOne_karyawan(req.params.id),
            departemen: await model_dept.getAll_departemen(),
            agama: await model_agama.getAll_agama()
        }
        res.render('page-karyawan-edit', data)
    },

    proses_update_data: async (req,res) => {
        try {
            let update = await model_karyawan.update_karyawan(req)
            if (update.affectedRows > 0 ) {
                res.redirect('/karyawan?notif=Berhasil perbarui data karyawan')
            }
        } catch (error) {
            
        }
    }
}