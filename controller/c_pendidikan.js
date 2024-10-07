module.exports = 
{
    hal_pendidikan: (req,res) => {
        let profil = {
            nama: 'Haruto',
            s1: 'Universitas Tokyo, Teknik Informatika',
            smk: 'SMA Karasuno'
        }
        res.render('page-pendidikan', profil)
    },

    
}