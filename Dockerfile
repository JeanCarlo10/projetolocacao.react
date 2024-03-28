# Use a imagem oficial do Node.js
FROM node:14

# Defina o diretório de trabalho no contêiner
WORKDIR /usr/src/app

# Copie os arquivos do package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos do backend
COPY . .

# Exponha a porta 5000 (ou a porta que você está usando para o servidor Node.js)
EXPOSE 5000

# Comando para iniciar o servidor Node.js
CMD ["node", "app.js"]