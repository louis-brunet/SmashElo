A Discord bot implementation of a persistent Elo ranking system. Concieved for Smash Ultimate but can be used for any competition.

Developed by Louis Brunet (kzar#4097) for the Smash Yuzu FR Discord server.

The command prefix is `!`. Commands are case-insensitive.

By default, the only restricted commands are the **Dev** commands. However, all commands can be restricted to certain server roles.

In the list below, commands in *italics* are recommended to be role-restricted.

## General commands

* `help`

* `help <command>`

* `elo` 

* `elo <user> <user> ....`

* `result <user> <user> <score> <score>`

* *`list`*

* *`list <user> <user> ...`*

* *`edit <user> <elo> <matchCount> <winCount> <drawCount>`*

* *`deleteUser <user>`*

* *`resetAllElo`*

## Dev commands

* *`cmdRoles <command>`*

* *`addCmdRole`*

* *`clearCmdRoles`*

* *`reload`*
