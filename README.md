<h1 align="center"> KeystrokesRace </h1> <br>
<p align="center">
  <img src="https://i.imgur.com/EvlbdGO.png" width=780>
</p>

>Who types faster?

# Introduction

Game inspired on [TypeRacer](http://play.typeracer.com/), with different rules, quantifying the number of keystrokes per minute.

See the demonstration of this amazing game: https://keystrokesrace.now.sh/

Features:
* Create your room (duration of 5 minutes per room)
* Ranking per room
* [API to obtain detailed room information](https://keystrokesrace-server.now.sh/room/roomname/status)

# How to play

Access the URL with the pattern `/room/room-name/user/your-nickname`. If the room does not yet exist, it will be then created and a new random text will be selected. You will need to copy this text, aiming to obtain the greatest number of keystrokes per minute!

The total duration of a room is 5 minutes. After this time expires, it is not allowed to type anymore.

Share the room name with your friends so you can play with them!

Who is the fastest typer?

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

The PaaS [∆ now](https://zeit.co) was chosen to perform the deploy of the project:

Firstly, install now and create an account:

```
> npm install -g now
> now
```

To perform the deploy of this project, you will need to perform the server deploy and then the client deploy, explained in the following sections:

## Server

```
> cd server
> now
```

After ending the deploy, ∆ now will automatically copy the server URL to the clipboard.
We need this address in the next step.

## Client

```
> cd client
> now secret add websocketaddress "URL DO SERVIDOR"
> now
```

Done! The KeystrokesRace deploy is completed!
