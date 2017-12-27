<h1 align="center"> Pagar.me Challenge </h1> <br>
<p align="center">
  <img src="https://i.imgur.com/5BiORe6.png" width=780>
</p>

>Quem será que digita mais rápido?

# Introdução

Jogo inspirado no [TypeRacer](http://play.typeracer.com/), com o diferencial em que vence quem digitar a maior quantidade de palavras por minuto (aqui chamado de keystrokes/minuto).

Veja a demonstração desse incrível jogo aqui: https://pagarme-challenge.now.sh/

Features:
* Crie a sua sala
* Duração de 5 minutos por partida
* Ranking por sala
* [API para obter informações detalhadas das salas](https://pagarme-server-roaslxwrch.now.sh/room/roomname/status)

# Como jogar

Acesse uma URL com o padrão `/room/nome-da-sala/user/seu-nickcname`. Se a sala ainda não existir, ela será criada e um novo texto aleatório é selecionado. Você precisa copiar esse texto, buscando obter a maior quantidade de keystrokes/minuto possível!

A sala tem duração de 5 minutos. Após esse tempo, não é possível continuar a digitar mais.

Repasse o nome da sua sala para seus amigos, para competir com eles! Quem será que ficará em primeiro lugar no ranking?

# Como executar localmente

Instale as dependências do projeto:

```
> cd client
> yarn install
> cd ../server
> yarn install
```

Teste

```
> cd /server
> yarn test
```

Execute o projeto:

```
> cd /server
> yarn start
```

# Deploy

Para efetuar o deploy, foi optado pelo serviço [∆ now](https://zeit.co).

Primeiramente, instale o now e crie a sua conta, caso já não tenha:

```
> npm install -g now
> now
```

Para efatuar o deploy do projeto, será preciso efetuar o deploy do server e depois o deploy do client, explicado nas seções seguintes.

## Servidor

```
> cd server
> now
```

Após finalizar o deploy, o now automaticamente copiará a URL do server para a área de transferência.
Nós precisaremos desse endereço gerado no próximo passo.

## Cliente

```
> cd client
> now secret add websocketaddress "URL DO SERVIDOR"
> now
```

Pronto! O deploy do pagarme-challenge está concluído!
