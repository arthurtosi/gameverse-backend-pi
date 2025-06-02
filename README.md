# backend-pp-2025-1
Esse repositório representa o pp de back-end 2025/1 na CT JUNIOR utilizando Prisma e, como novidade, Nest.<br/>
Precisava treinar Nest, entao também fiz o pp.
## Tecnologias usadas
+ Prisma
+ Prisma Client
+ Nest
+ Docker
+ Zod
+ Bcrypt - senha com hash
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
1. [x] cadastrar(email único, username único, senha) - senha deve ser encriptada, email e username nao podem ja existir.<br>
1. [x] feed - deve retornar todos os posts em ordem de mais recente.<br>
1. [x] editar perfil - deve ser possivel alterar a propria foto de perfil a partir do id do perfil<br>
1. [x] editar perfil - deve ser posssível alterar a descrição de um post a partir do id do post<br>
1. [x] editar perfil - deve ser possível deletar um post a partir do id do post<br>
1. [x] editar perfil - deve ser possível ver todos os posts que um usuário realizou em oderm de mais recente<br>
1. [X] publicar - deve ser possível fazer um post com uma foto e descrição. Não pode postar sem passar o link de uma foto. A descrição é OPCIONAL para publicar um post, ou seja, você pode postar sem descrição, mas não sem link de uma foto.<br>
## Observações
OBS 1- O usuário ao ser cadastrado pode ficar com o campo de foto como null, aí ele fica com uma foto padrão do sistema no lugar. Isso já tem no front.<br>
OBS 2- Percebi durante o desenvolvimento do sistema: como o usuário tem email/username único, o usuário não precisa de ID, pois o email/username já é único.<br>
OBS 3- Não é para fazer like em post, comentário nem qualquer coisa que não está nas funcionalidades acima.<br>