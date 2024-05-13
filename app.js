const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot');

const fs = require('fs').promises; // Usamos la versión de promesas de fs para manejo asíncrono.

const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');

async function getPlanDetails(planName) {
    try {
        const path = `messages/${planName}.txt`; // Construye el path al archivo basado en el nombre del plan.
        const data = await fs.readFile(path, 'utf8'); // Lee el archivo con encoding utf-8.
        return data; // Retorna el contenido del archivo.
    } catch (error) {
        console.error('Error reading file:', error);
        return "Lo siento, no pude encontrar los detalles de ese plan.";
    }
}


const planFlow = addKeyword(["básico", "intermedio", "profesional"]).addAnswer(
    async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
        const planName = ctx.body.toLowerCase(); // Asume que el cuerpo del mensaje es "básico", "intermedio" o "profesional".
        return await getPlanDetails(planName); // Llama a la función y pasa el nombre del plan.
    }
);


const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([planFlow]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
}

main();