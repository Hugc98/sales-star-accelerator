
require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 3001;
const SESSION_DATA_PATH = process.env.SESSION_DATA_PATH || './session-data';

// Garantir que o diretório de sessão exista
if (!fs.existsSync(SESSION_DATA_PATH)) {
  fs.mkdirSync(SESSION_DATA_PATH, { recursive: true });
}

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Armazenar instâncias de cliente do WhatsApp
const whatsappClients = new Map();

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).send({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas da API
app.post('/api/whatsapp/init', (req, res) => {
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ success: false, error: 'ID do usuário é necessário' });
  }

  // Verificar se já existe um cliente para este usuário
  if (whatsappClients.has(userId)) {
    return res.status(200).json({ success: true, message: 'Cliente WhatsApp já iniciado' });
  }

  // Inicializar novo cliente
  const client = new Client({
    authStrategy: new LocalAuth({ 
      clientId: userId,
      dataPath: SESSION_DATA_PATH
    }),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  });

  // Armazenar cliente
  whatsappClients.set(userId, { 
    client, 
    status: 'initializing',
    qrCode: null,
    phoneNumber: null
  });

  // Eventos do cliente
  client.on('qr', async (qr) => {
    console.log(`QR Code gerado para o usuário ${userId}`);
    
    try {
      const qrDataURL = await qrcode.toDataURL(qr);
      const clientData = whatsappClients.get(userId);
      if (clientData) {
        clientData.qrCode = qrDataURL;
        clientData.status = 'qr_ready';
        
        // Emitir evento via Socket.IO
        io.to(userId).emit('whatsapp:qr', { qrCode: qrDataURL });
      }
    } catch (err) {
      console.error('Erro ao gerar QR Code:', err);
    }
  });

  client.on('ready', () => {
    console.log(`Cliente WhatsApp pronto para o usuário ${userId}`);
    const clientData = whatsappClients.get(userId);
    if (clientData) {
      clientData.status = 'connected';
      client.getInfo().then(info => {
        clientData.phoneNumber = info.wid.user;
        
        // Emitir evento via Socket.IO
        io.to(userId).emit('whatsapp:ready', { 
          status: 'connected',
          phoneNumber: info.wid.user,
          connectionTime: new Date().toISOString()
        });
      });
    }
  });

  client.on('authenticated', () => {
    console.log(`Cliente WhatsApp autenticado para o usuário ${userId}`);
    const clientData = whatsappClients.get(userId);
    if (clientData) {
      clientData.status = 'authenticated';
      
      // Emitir evento via Socket.IO
      io.to(userId).emit('whatsapp:authenticated');
    }
  });

  client.on('auth_failure', (msg) => {
    console.error(`Falha na autenticação do WhatsApp para o usuário ${userId}:`, msg);
    const clientData = whatsappClients.get(userId);
    if (clientData) {
      clientData.status = 'auth_failure';
      
      // Emitir evento via Socket.IO
      io.to(userId).emit('whatsapp:auth_failure', { message: msg });
    }
  });

  client.on('disconnected', (reason) => {
    console.log(`Cliente WhatsApp desconectado para o usuário ${userId}:`, reason);
    const clientData = whatsappClients.get(userId);
    if (clientData) {
      clientData.status = 'disconnected';
      clientData.qrCode = null;
      
      // Emitir evento via Socket.IO
      io.to(userId).emit('whatsapp:disconnected', { reason });
    }
  });

  client.on('message', async (message) => {
    console.log(`Nova mensagem recebida para o usuário ${userId}`);
    
    // Preparar dados da mensagem
    const contact = await message.getContact();
    const chat = await message.getChat();
    const messageData = {
      id: message.id.id,
      body: message.body,
      from: message.from,
      fromName: contact.name || contact.pushname || message.from,
      timestamp: message.timestamp,
      hasMedia: message.hasMedia,
      isGroup: chat.isGroup,
      chat: {
        id: chat.id._serialized,
        name: chat.name || (contact.name || contact.pushname || message.from)
      }
    };
    
    // Emitir evento via Socket.IO
    io.to(userId).emit('whatsapp:message', messageData);
  });

  // Iniciar cliente
  client.initialize()
    .catch(err => {
      console.error(`Erro ao inicializar cliente WhatsApp para o usuário ${userId}:`, err);
      whatsappClients.delete(userId);
    });

  res.status(200).json({ success: true, message: 'Cliente WhatsApp iniciado' });
});

app.get('/api/whatsapp/status/:userId', (req, res) => {
  const { userId } = req.params;
  
  const clientData = whatsappClients.get(userId);
  if (!clientData) {
    return res.status(404).json({ success: false, error: 'Cliente WhatsApp não encontrado' });
  }

  res.status(200).json({
    success: true,
    status: clientData.status,
    qrCode: clientData.qrCode,
    phoneNumber: clientData.phoneNumber,
    connectionTime: clientData.connectionTime
  });
});

app.post('/api/whatsapp/send', async (req, res) => {
  const { userId, to, message } = req.body;
  
  if (!userId || !to || !message) {
    return res.status(400).json({ success: false, error: 'Dados incompletos' });
  }

  const clientData = whatsappClients.get(userId);
  if (!clientData || clientData.status !== 'connected') {
    return res.status(400).json({ success: false, error: 'Cliente WhatsApp não conectado' });
  }

  try {
    // Normalizar número de telefone (remover caracteres não numéricos e adicionar código do país se necessário)
    let phoneNumber = to.replace(/\D/g, '');
    if (!phoneNumber.includes('@')) {
      // Se não for um ID de grupo, normalizar o número de telefone
      if (!phoneNumber.startsWith('55')) {
        phoneNumber = '55' + phoneNumber;
      }
      phoneNumber = phoneNumber + '@c.us';
    }

    console.log(`Enviando mensagem para ${phoneNumber}`);
    const result = await clientData.client.sendMessage(phoneNumber, message);
    
    res.status(200).json({
      success: true,
      messageId: result.id.id,
      timestamp: result.timestamp
    });
  } catch (error) {
    console.error(`Erro ao enviar mensagem:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/whatsapp/disconnect/:userId', (req, res) => {
  const { userId } = req.params;
  
  const clientData = whatsappClients.get(userId);
  if (!clientData) {
    return res.status(404).json({ success: false, error: 'Cliente WhatsApp não encontrado' });
  }

  // Tentar desconectar o cliente
  try {
    clientData.client.destroy();
    whatsappClients.delete(userId);
    res.status(200).json({ success: true, message: 'Cliente WhatsApp desconectado' });
  } catch (error) {
    console.error(`Erro ao desconectar cliente WhatsApp:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log(`Nova conexão WebSocket: ${socket.id}`);

  socket.on('join', (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`Socket ${socket.id} entrou na sala ${userId}`);
    }
  });

  socket.on('whatsapp:requestQR', (userId) => {
    const clientData = whatsappClients.get(userId);
    if (clientData && clientData.qrCode) {
      socket.emit('whatsapp:qr', { qrCode: clientData.qrCode });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Conexão WebSocket encerrada: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor WhatsApp rodando na porta ${PORT}`);
});

// Tratamento de encerramento gracioso
process.on('SIGINT', async () => {
  console.log('Encerrando servidor e clientes WhatsApp...');
  
  // Desconectar todos os clientes WhatsApp
  const disconnectPromises = [];
  for (const [userId, clientData] of whatsappClients.entries()) {
    try {
      console.log(`Desconectando cliente WhatsApp do usuário ${userId}...`);
      disconnectPromises.push(clientData.client.destroy());
    } catch (err) {
      console.error(`Erro ao desconectar cliente do usuário ${userId}:`, err);
    }
  }
  
  try {
    await Promise.all(disconnectPromises);
  } catch (err) {
    console.error('Erro ao desconectar clientes WhatsApp:', err);
  }
  
  process.exit(0);
});
