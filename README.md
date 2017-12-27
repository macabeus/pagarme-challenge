<h1 align="center"> Pagarme-Challenge </h1> <br>
<p align="center">
  <img src="https://i.imgur.com/5BiORe6.png" width=780>
</p>

>Quem será que digita mais rápido?

# Introdução

TODO

# Desenvolver

TODO

# Deploy

Para efetuar o deploy, foi optado pelo serviço [∆ now](https://zeit.co).

Primeiramente, instale o now e crie a sua conta, caso já não tenha:

```
> npm install -g now
> now
```

Para efatuar o deploy do pagarme-challenge, será preciso efetuar o deploy do server e depois o deploy do client.

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
