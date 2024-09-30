// memanggil modul bawaan dari node.js  yaitu http
// untuk membuat server htttp
const http  = require('http')

http.createServer( function(request, response) {
    console.log(request.url)
    response.writeHead(200, {'Content-type': 'text/html'})

    // Halaman utama
    if(request.url == '/'){
        response.end(
            `<h1>Selamat datang di website Hardi.com</h1><hr>
            <br>
             <a href='/profil'>Menuju ke profil</a>`
        )
    }
    // halaman profil
    else if (request.url == '/profil') {
        let tahun_lahir = 1990
        let tahun_ini = 2024
        let umur = tahun_ini- tahun_lahir
        response.end(
            `<ul>
                <li>Nama Lengkap: Haruto Kirigaya</li>
                <li>Nama Panggilan: Haruto</li>
                <li>Alamat: Tokyo, Jepang</li>
                <li>Pekerjaan: Senior Programmer dan Game Developer</li>
                <li>Tanggal Lahir: 17 Agustus ${tahun_lahir}</li>
                <li>Umur: ${umur} tahun</li>
            </ul>
            <br>
            <a href='/'>Balik ke beranda</a>`
        )
    }
    // hunbungi-saya
    else if (request.url == '/hubungi') {
        let kontak = {
            WA: '0948478334',
            email: 'Haruto@gmail.com',
            linkedin: 'linkedin.com/haruto',
            ig: '@ruutooo_'
        }
        response.end(
            `<ul>
                <li>Whatsapp: ${kontak.WA}</li>
                <li>Email: ${kontak.email}</li>
                <li>Instagram: ${kontak.linkedin}</li>
                <li>Linkedin: ${kontak.ig}</li>
            </ul>`
        )
    }
    // untuk menganggapi URL yg tidak ada
    else {
        response.end(`<h1>404: Halaman tidak ditemukan</h1><hr>`)
    }
}).listen(8000, function() {
    console.log('Server  nyala, buka http://localhost:8000')
})

// tes nambah komentar
// kirim ke 2x