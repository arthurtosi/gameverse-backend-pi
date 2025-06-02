# backend-pp-2025-1
Esse repositório representa o back-end de projeto integrado, em que fazemos um letterboxd para games com integração com o instagram.<br/>
## Tecnologias usadas
+ Prisma.
+ Prisma Client.
+ Nest.
+ Docker.
+ Zod.
+ Bcrypt - senha com hash.
+ Cloudflare R2 - Salvar imagens gratuitamente.
## Como rodar:
```
npm i
docker-compose up -d
npx prisma migrate dev
npm run dev
```
## Como parar a aplicação
+ Caso queira parar de fazer o banco rodar: docker-compose stop
+ Caso queira deletar tudo, inclusive as informações das tabelas: docker-compose down
## Observação:
Criar um .env exatamente igual ao .env.example para conseguir rodar tudo.
## Tasks
1. [x] login(email, senha) gerando token jwt em um cookie<br>
2. [x] cadastrar(email único, username único, senha) - senha deve ser encriptada, email e username nao podem ja existir.<br>
3. [ ] a
4. [ ] b
5. [ ] c
6. [ ] d
7. [ ] e
8. [ ] f