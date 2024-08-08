const mongoose = require('mongoose')
require('dotenv').config();

async function main () {
    try {
        mongoose.set('strictQuery', true)
        await mongoose.connect(process.env.PROD === 'true' ? process.env.PROD_CONNECTION_STRING : process.env.CONNECTION_STRING )
            .then(() => {
                console.log(`\n✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨\n\n\t🌜 MIDNIGHTICKETS 🌛\n\n⭐ Bem-vindo de volta, ${process.env.DEV_NAME}! 🌃\n🗓️  ` + new Date().toLocaleString('pt-BR') + `⏱️\n\n🏦🎲 Conexão com MongoDB estabelecida com Sucesso em Modo ${process.env.PROD === 'true' ? 'Produção 🌍🌎' : 'Desenvolvimento 🔩🛠️'}\n\n🎫🎟️🎫🎟️🎫🎟️🎫🎟️🎫🎟️🎫🎟️\n\n✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨\n`)
            })
            .catch((error) => {
                console.error('Connection error: ' + error)
            })
    } catch (error) {
        console.error('Erro conn: ' + error)
    }
}

module.exports = main