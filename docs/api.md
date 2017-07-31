# These are fuckin' API docs I guess

Straight outta the commit messages.

## status endpoint
This enpoint provides the global game status.  It returns the following information in a JSON formatted blob:

  - currentplayer => The name of the current player, as a string.
  - currentavg => The latest computed average score, as a string.
  - running => A string that says true or false, which indicates whether we are current running the interactive component of the piece.

## rate endpoint
This is what you use to rate people.  It sets and does a cookie if needed.  If accepts a rating of 1-5 under ?rating=.

## leaders endpoint
This endpoint returns anywhere from 0 to 10 player names and average scores that represent the leaders for the current playing session formatted as a JSON response.  If 0 players are returned, no players have completed scoring and no data is available from the leaders table in the database.

## admin endpoint
There are three sub query strings you may use:
  - ?running=
    - Valid values: (true, false)
      - true = sets running to true
      - false = sets running to false (default if not true)
  - ?currentplayer=<string>
    - Valid values: empty string or string
      - string = sets the current players name
      - empty string = tells the code that we're between two players
  - ?resetscoreboard=true
    - This should not be invoked by code and only by hand.  It deletes all the current leaders on the leaderboard.

