<h1 align="center"> Pagar.me Challenge </h1> <br>
<p align="center">
  <img src="https://i.imgur.com/EvlbdGO.png" width=780>
</p>

>Who types faster?

# Introduction

Game inspired on [TypeRacer](http://play.typeracer.com/), with different rules, quantifying the number of keystrokes/minutes.

See the demonstration of this amazing game: https://pagarme-challenge.now.sh/

Features:
* Create your room
* Duration of 5 minutes per room
* Ranking per room
* [API to obtain detailed room information](https://pagarme-server-roaslxwrch.now.sh/room/roomname/status)

# How to play

Access the URL with the pattern `/room/room-name/user/your-nickname`. If the room does not exist yet, it will be created and a new random text will be selected. You need to copy this text, aiming to obtain the greatest number of keystrokes/minute!

The duration of room is 5 minutes. After this time, it is not allowed to type more.

Share the room name with your friends, to play with them! Who is the fastest typer?

# How to run

Install the dependencies of the project:

```
> cd client
> yarn install
> cd ../server
> yarn install
```

Test

```
> cd /server
> yarn test
```

Run the project:

```
> cd /server
> yarn start
```

# Deploy

To perform the deploy, the PaaS [∆ now](https://zeit.co) was chosen.

Firstly, install now and create your account:

```
> npm install -g now
> now
```

To perform the deploy of this project, we need to perform the server deploy and then the client deploy, explained in the following sections. 

## Server

```
> cd server
> now
```

After ending the deploy, ∆ now will automatically copy the server URL to the clipboard.
We need this adress in the next step.

## Client

```
> cd client
> now secret add websocketaddress "URL DO SERVIDOR"
> now
```

Done! The pagarme-challenge deploy is completed!
