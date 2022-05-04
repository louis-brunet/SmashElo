A Discord bot implementation of a persistent Elo ranking system. Concieved for Smash Ultimate but can be used for any competition.

Developed by Louis Brunet (kzar#4097) for the Smash Yuzu FR Discord server.

The command prefix is `!`. Commands are case-insensitive.

By default, the only restricted commands are the **Dev** commands. However, all commands can be restricted to certain server roles.

In the list below, commands in *italics* are recommended to be role-restricted.

## General commands

* `help` show help for new users

<!-- * `help <command>`  -->

* `elo` get elo for user who used command

* `elo <user> <user> ....` get elo for mentioned user(s) (@user user#1234)

* `result @user1 @user2 score1 score2` add a new ranked match result

* *`list`* list data for all users

* *`list <user> <user> ...`* list data for mentioned user(s) (@user or user#1234)

* *`edit <user> <elo> <matchCount> <winCount> <drawCount>`*

* *`deleteUser <user>`* delete data for user (@user or user#1234) => reset elo

* *`resetAllElo`* delete all user data => reset all elo

## Dev commands

* `cmdRoles <command>` list roles that can use the command

* `addCmdRole cmd1 cmd2 ... @role1 @role2 ...` add roles to the list of roles who can use the command(s)

* `clearCmdRoles cmd1 cmd2 ...` remove all role restrictions for the command(s)

* `reload` reloads events & available commands


## Elo system

Each player has an Elo rating. The amount of rating points won or lost after a match depends only on the rating difference between both players (the scoreline currently has no effect). 

![Elo rating formulas](/img/elo.png)

The constant K is set to 32. Changing it will modify the average amount of elo gained per match (regardless of ratings).

The scale factor is set to 400. Changing it will modify the impact of the rating difference on the amount of points gained.

The score S_a is `1` for a win, `0` for a loss, and `0.5` for a draw.
