
# Servidor WhatsApp para Sales Star Accelerator

Este servidor Node.js implementa a integração com o WhatsApp usando a biblioteca `whatsapp-web.js`, permitindo que o CRM Sales Star Accelerator se conecte com o WhatsApp Web.

## Requisitos

- Node.js 16+ 
- NPM ou Yarn

## Configuração

1. Clone este repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Crie um arquivo `.env` baseado no `.env.example`:
   ```
   cp .env.example .env
   ```
4. Edite o arquivo `.env` com as configurações do seu ambiente

## Execução

Para iniciar o servidor:

```
npm start
```

Para desenvolvimento com reinicialização automática:

```
npm run dev
```

## Endpoints da API

- `POST /api/whatsapp/init`: Inicia um cliente WhatsApp para um usuário
- `GET /api/whatsapp/status/:userId`: Verifica o status da conexão
- `POST /api/whatsapp/send`: Envia uma mensagem via WhatsApp
- `POST /api/whatsapp/disconnect/:userId`: Desconecta um cliente WhatsApp

## WebSockets

O servidor usa Socket.IO para comunicação em tempo real com o frontend, emitindo eventos como:
- `whatsapp:qr`: Quando um QR code é gerado
- `whatsapp:ready`: Quando o cliente está conectado e pronto
- `whatsapp:authenticated`: Quando a autenticação é bem-sucedida
- `whatsapp:auth_failure`: Quando há falha na autenticação
- `whatsapp:disconnected`: Quando o cliente é desconectado
- `whatsapp:message`: Quando uma nova mensagem é recebida
