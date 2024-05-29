const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const flowSecundario = addKeyword(['22', 'siguiente']).addAnswer(['Gracias!'])

const flowInfo = addKeyword(['info', '1']).addAnswer(
    [
        '📄 Préstamo simple personal:',
        'Desde 10 mil y hasta 50 mil pesos',
        'Tasa del 36%, comisión 3% + IVA',
        'Plazo de 6 a 18 meses',
        '\n📄 Requisitos para solicitar tu préstamo:',
        'INE',
        'CURP',
        'Comprobante de domicilio',
        'Comprobante de ingresos (3 meses)',
        'Reporte Buró de Crédito',
        '\n Hacer tu registro en https://oporfin.mx',
        
        '\n \nRecuerda tener la documentación a la mano al momento de tu registro, de esta manera podrás tener una respuesta en menos tiempo!'
    ],
    null,
    null,
    [flowSecundario]
)

const flowStatus = addKeyword(['status', 'estatus', '2']) 
    .addAnswer('Claro!, por favor, ingresa tu nombre completo:', { capture: true }, async(ctx, { flowDynamic }) => {
        const nombre = ctx.body;
        await flowDynamic(`Gracias, ${nombre}! Estoy revisando nuestra base de datos, en unos minutos te doy respuesta...`);
    });


const flowDespedida = addKeyword(['gracias', 'grac', 'salir', '4']).addAnswer(
    [
        '🚀 Muchas gracias por ponerte encontacto con nosotros.',
        'Para concer mas sobre nuestros productos y de nuestra empresa',
        'visita nuestro sitio web https://oporfin.mx',
        
        
    ],
    null,
    null,
    [flowSecundario]
)

const flowSolicitar = addKeyword(['solicitar']).addAnswer(
    ['Estas a solo un paso, completa tu registro en:', 'https://oporfin.mx', '\n*salir* Para salir del chat.'],
    null,
    null,
    [flowSecundario]
)

const flowPrincipal = addKeyword(EVENTS.WELCOME)
    .addAnswer('🙌 Hola, Soy *FINA* tu asistente virtual, Bienvenid@ a *OPORFIN* ')
    .addAnswer(
        [
            '¿Dime Como puedo ayudarte hoy? (escribe la palabra clave)',
            '\n👉 *info* para conocer mas información sobre nuestros créditos',
            '👉 *status* para preguntar el status de tu trámite',
            '👉 *solicitar* para hacer el trámite de solicitud de crédito',
            '👉 *salir*  para terminar este chat',
            
        ],
        null,
        null,
        [flowInfo, flowStatus, flowDespedida, flowSolicitar]
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
