# API APLICATIVO DE TRANSPORTE
Este conteúdo é parte do curso Clean Code e Clean Architecture da Branas.io. Para mais informações acesse: https://branas.io
Projeto desenvolvido pelo aluno Anderson de Faria
A evolução desta API será de acordo com as aulas do curso.

### INFORMAÇÕES SOBRE O PROJETO
Este projeto consiste em uma API para utilização do serviço de um aplicativo de transporte.
Utiliza nodejs e typescript e sobe um bancho postgres local

### PRÉ-REQUISITOS PARA UTILIZAÇÃO
* docker
* npm
* node 16
* git

### COMANDOS
- ```docker-compose up ``` cria uma base de dados Postgres local
- ```nvm use default 16``` definie versão do node
- ```nodemon src/index.ts ``` sobre o servidor com as apis
- ```npx jest test --coverage``` roda todos os testes analisando a cobertura, dados salvos na pasta /coverage
