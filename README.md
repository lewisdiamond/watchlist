# Watchlist

Webtask handling a movies/series watchlist

It takes 1 parameter, `text`, which is a command.

## Commands
* `add <title>` Adds a movie to the watchlist. Alias `<title` (without a command).
* `series <title>` Adds a series to the watchlist. Aliases `s`, `serie`.
* `watch <title>` Marks a movie/series as watched. Aliases `w`, `watched`.
* `unwatch <title>` Unmarks a previously watched movie/series. Alias `u`.
* `remove <title>` Removes the item from the list. Aliases `r`, `rm`.
* `get` Returns your list. Alias `g`.
* 'clear' Clears your list. Alias `c`.

## Via text
Using IFTTT, create a new applet using the SMS trigger to a webhook, enter your webtask URL with the message body ingredient as the text query parameter. Then create a webhook trigger to SMS naming the event `respond`. Take note of your API key as you need to provide it as a secret to webtask.

Now, you can text a movie/serie title to # to add to your watch list. Use the commands listed above.

## Deploying
```
yarn deploy -- --secret apikey=[omdb api key] --secret smskey=[SMS key]
```
