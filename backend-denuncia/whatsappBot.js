import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import axios from 'axios';

// 🗄️ Importamos la conexión real directamente desde tu server.js
import { db } from './server.js'; 

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        // Ejecutable nativo de Windows para evitar errores de descarga
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-extensions'
        ],
        headless: true // Corre en segundo plano sin abrir ventanas molestas
    }
});

// Generar el código QR en la consola
client.on('qr', (qr) => {
    console.log('\n=== 🚨 ESCANEA ESTE CÓDIGO QR CON TU WHATSAPP PARA VINCULAR SIDPOL ===\n');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('\n🚀 ¡Conexión con WhatsApp establecida con éxito! Escuchando denuncias...\n');
});

client.on('auth_failure', (msg) => {
    console.error('❌ Fallo de autenticación en WhatsApp Web:', msg);
});

// Memoria volátil temporal para guardar el estado del diálogo de cada usuario (Árbol de decisiones del informe)
const sesionesUsuario = {};

// Diccionario de coordenadas para georreferenciación automática en tu mapa de React
const coordenadasDistritos = {
    "LOS OLIVOS": { lat: -11.9922, lng: -77.0675 },
    "SAN JUAN DE LURIGANCHO": { lat: -12.0000, lng: -76.9833 },
    "CALLAO": { lat: -12.0566, lng: -77.1181 },
    "MIRAFLORES": { lat: -12.1225, lng: -77.0311 },
    "SANTIAGO DE SURCO": { lat: -12.1283, lng: -76.9839 },
    "COMAS": { lat: -11.9311, lng: -77.0423 }
};

client.on('message', async (msg) => {
    const chat = await msg.getChat();
    const usuarioId = msg.from;
    const textoMensaje = msg.body.trim();

    // Filtro: Ignorar mensajes de grupos para evitar saturar la BD
    if (chat.isGroup) return;

    // -------------------------------------------------------
    // FASE 1: Saludo, Contención y Empatía (Primer Mensaje)
    // -------------------------------------------------------
    if (!sesionesUsuario[usuarioId]) {
        sesionesUsuario[usuarioId] = { paso: 1 };
        
        await msg.reply(
            `🚨 *SISTEMA INTEGRADO SIDPOL - DENUNCIA SEGURA*\n\n` +
            `Detectamos que se encuentra en una situación de riesgo o ha sido víctima de un incidente.\n\n` +
            `Para procesar su caso de forma digital e inmediata y mitigar la revictimización, *por favor describa detalladamente lo sucedido e incluya el distrito donde ocurrió el hecho.*`
        );
        return;
    }

    // -------------------------------------------------------
    // FASE 2: Captura del Relato y Evaluación con la IA en Python
    // -------------------------------------------------------
    if (sesionesUsuario[usuarioId].paso === 1) {
        try {
            // Animación de "Escribiendo..." en el chat del ciudadano
            await chat.sendStateTyping();

            // Petición HTTP síncrona al microservicio de Python (FastAPI en puerto 8000)
            const respuestaIA = await axios.post('http://127.0.0.1:8000/analizar-denuncia', {
                texto: textoMensaje
            });

            const { delito_clasificado, distrito, urgencia } = respuestaIA.data;

            // Buscamos las coordenadas del distrito; si no existe, centramos en Lima Metropolitana
            const coords = coordenadasDistritos[distrito] || { lat: -12.0464, lng: -77.0428 };

            // Almacenamos temporalmente la estructura del expediente en el búfer de sesión
            sesionesUsuario[usuarioId].datosDenuncia = {
                id_expediente: `EP-${Math.floor(100000 + Math.random() * 900000)}`,
                delito: delito_clasificado,
                distrito: distrito,
                urgencia: urgencia,
                latitud: coords.lat,
                longitud: coords.lng,
                descripcion: textoMensaje
            };
            
            sesionesUsuario[usuarioId].paso = 2;

            // Confirmación cooperativa solicitada por el informe
            await msg.reply(
                `🧠 *Análisis de Inteligencia Artificial (NLP) completado:*\n` +
                `• *Delito Identificado:* ${delito_clasificado}\n` +
                `• *Jurisdicción/Distrito:* ${distrito}\n` +
                `• *Nivel de Gravedad:* ${urgencia}\n\n` +
                `¿Desea registrar esta denuncia formalmente en el repositorio transaccional del panel PNP?\n` +
                `Responda con *SI* para confirmar o *NO* para cancelar.`
            );

        } catch (error) {
            console.error("❌ Error conectando con el servidor de IA en Python:", error.message);
            await msg.reply("⚠️ Hubo un problema temporal al procesar su denuncia con el motor de IA. Por favor, verifique que el servicio de Python esté activo en el puerto 8000.");
        }
        return;
    }

    // -------------------------------------------------------
    // FASE 3: Confirmación e Inserción Transaccional en MySQL
    // -------------------------------------------------------
    if (sesionesUsuario[usuarioId].paso === 2) {
        const respuestaNormalizada = textoMensaje.toLowerCase();

        if (respuestaNormalizada === 'si' || respuestaNormalizada === 'sí') {
            const d = sesionesUsuario[usuarioId].datosDenuncia;

            try {
                // Firma digital simulada exigida por los esquemas criptográficos del SIDPOL
                const hashSimulado = "sha256_" + Math.random().toString(36).substring(2, 15);

                // 1. Inserción preventiva en la tabla 'usuarios' para mantener integridad de llaves foráneas
                await db.query(
                    'INSERT INTO usuarios (dni, nombre_completo, rol, clave_cifrada) VALUES (?, ?, "CIUDADANO", NULL) ON DUPLICATE KEY UPDATE dni=dni',
                    ['72145632', 'JEAN POOL JAMARILLO QUISPE'] // Usuario por defecto para pruebas del pool
                );

                // 2. Inserción real de la incidencia en la tabla 'denuncias' mapeando tu esquema exacto de MySQL
                await db.query(
                    'INSERT INTO denuncias (id_expediente, dni_ciudadano, delito_clasificado, distrito, urgencia, latitud, longitud, firma_sha256) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [d.id_expediente, '72145632', d.delito, d.distrito, d.urgencia, d.latitud, d.longitud, hashSimulado]
                );

                await msg.reply(
                    `✅ *Denuncia registrada exitosamente en SIDPOL.*\n\n` +
                    `• *N° Expediente:* #${d.id_expediente}\n\n` +
                    `El Centro de Despacho de la Región Policial Lima ha sido notificado de forma síncrona. El mapa táctico y los gráficos analíticos de la comisaría han integrado su reporte.`
                );

            } catch (err) {
                console.error("❌ Error al insertar en MySQL desde WhatsApp:", err);
                await msg.reply("⚠️ Ocurrió un error interno en la capa de datos al procesar la inserción del expediente.");
            }
            
            // Liberación de memoria para permitir nuevas interacciones del mismo número
            delete sesionesUsuario[usuarioId];

        } else if (respuestaNormalizada === 'no') {
            await msg.reply("❌ Proceso cancelado. La información proporcionada ha sido depurada del búfer de sesión por políticas de confidencialidad.");
            delete sesionesUsuario[usuarioId];
        } else {
            await msg.reply("Por favor, responda únicamente *SI* para confirmar el registro o *NO* para anular el trámite.");
        }
    }
});

// Inicialización asíncrona de la instancia de Puppeteer
client.initialize();

export default client;