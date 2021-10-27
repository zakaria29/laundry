const express = require("express")
const app = express()
app.use(express.json())

// call model
const models = require("../models/index")
const transaksi = models.transaksi
const detail_transaksi = models.detail_transaksi

// endpoint get transaksi
app.get("/", async (request, response) => {
    let dataTransaksi = await transaksi.findAll({
        include: [
            { model: models.member, as: "member"},
            { model: models.users, as: "user"},
            { 
                model: models.detail_transaksi,
                as: "detail_transaksi",
                include: [
                    {model: models.paket, as:"paket"}
                ]
            }
        ]
    })
    return response.json(dataTransaksi)
})

// endpoint new transaksi
app.post("/", (request,response) => {
    let newTransaksi = {
        id_member: request.body.id_member,
        tgl: request.body.tgl,
        batas_waktu: request.body.batas_waktu,
        tgl_bayar: request.body.tgl_bayar,
        status: 1,
        dibayar: request.body.dibayar,
        id_user: request.body.id_user
    }

    transaksi.create(newTransaksi)
    .then(result => {
        // jika insert transaksi berhasil, lanjut
        // insert data detail transaksinya
        let newIDTransaksi = result.id_transaksi

        let detail = request.body.detail_transaksi
        for (let i = 0; i < detail.length; i++) {
            // sebelumnya
            // nilai detail[i] hanya punya key id_paket
            // dan qty saja
            detail[i].id_transaksi = newIDTransaksi
        }

        // proses insert detail_transaksi
        detail_transaksi.bulkCreate(detail)
        .then(result => {
            return response.json({
                message: `Data transaksi berhasil ditambahkan`
            })
        })
        .catch(error => {
            return response.json({
                message: error.message
            })
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})

app.put("/:id_transaksi", (request,response) => {
    // tampung data utk update ke tbl transaksi
    // tampung parameter id_transaksi
    // setelah berhasil update ke table transaksi,
    // data detail transaksi yg lama dihapus semua berdasarkan
    // id_transaksinya

    // setelah dihapus, dimasukkan lagi menggunakan bulkCreate

})

app.delete("/:id_transaksi", (request, response) => {
    // tampung parameter id_transaksi
    let parameter = {
        id_transaksi: request.params.id_transaksi
    }

    // delete detail transaksi
    detail_transaksi.destroy({where: parameter})
    .then(result => {
        // hapus data transaksi nya
        transaksi.destroy({where: parameter})
        .then(hasil => {
            return response.json({
                message: `Data berhasil dihapus`
            })
        })
        .catch(error => {
            return response.json({
                message: error.message
            })
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})
module.exports = app