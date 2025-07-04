# Backend Projeto Integrado
Esse repositório representa o back-end de projeto integrado, em que fazemos um letterboxd para games com integração com o instagram.<br/>
Esse repositório roda na porta **8080**.
## Tecnologias usadas
+ Prisma - ORM.
+ Prisma Client - Query builder.
+ Nest - Framework.
+ Docker - Container.
+ Zod - Garante tipagens.
+ Zod Validation Error - Garante mensagens mais claras para erros do Zod.
+ Bcrypt - senha com hash.
+ Cloudflare R2 - Salvar imagens gratuitamente.
+ Swagger - Documentação da API.
+ Nestjs Passport + Nestjs JWT - Autenticação JWT.
## Como rodar:
```
npm i # instala as dependências da aplicação
docker-compose up -d # Sobe o container do docker para o ar
npx prisma migrate dev # gera as tipagens do prisma e as migrations
npm run start:dev # Roda a API localmente.
```
## Como rodar testes e2e em modo watch:
```
npm run test:e2e:watch
```
### Observações:
> + Para realizar os testes e2e, antes você deve ter instalado as dependências da aplicação e feito npx prisma migrate dev
> + Caso queira rodar os testes somente 1 vez rode:<br>**npm run test:e2e**
## Como parar a aplicação
+ Caso queira parar de fazer o banco rodar:<br> ```docker-compose stop```
+ Caso queira deletar tudo, inclusive as informações das tabelas:<br>```docker-compose down -v```
## Como ver o banco de dados em tempo real
Considerando que você esteja rodando a api com:
```
npm run start:dev
```
Abra um novo terminal, sem desligar a api e no mesmo diretório da api, digite:
```
npx prisma studio
```
Nessa interface, você poderá ver, apagar, editar ou criar os dados na tabela a desejar.
## Observação:
Criar um .env exatamente igual ao .env.example para conseguir rodar tudo.
## Tasks
1. [x] login(email, senha) gerando token jwt em um cookie<br>
2. [x] cadastrar(email único, username único, senha) - senha deve ser encriptada, email e username nao podem ja existir.<br>
3. [x] minhas informações, retorna informação do usuário logado a partir do jwt.<br>
## Colaboradores
1. Arthur Tosi
2. Pedro Sodré Malini
3. Theo Matheo