# charlotte.computer

I think the future of personal websites is a living page that people update daily, hourly... The website would show their current todos, their big goals, the books they've read, they're goals in life. It would be like a diary in public. A check in for their weekly workouts, their pride in their days of learning theyve clocked in. Parts private, parts public.

Mini apps range from Spotify what I'm playing right now, to a bookshelf of my favourite books and books in progress of reading. My blog where I share my thoughts. My recipes I adore making, and what I'm going to make tonight.

People can build their own web 'computers' which is an app that holds a load of their chosen mini-apps. For example I might have a 'productivity' computer that has a todo app, a calendar app, a notes app, etc. My dashboard page would show me in a bento grid todays top todos, calendar events, etc.

I can access the Todos app as a standalone app, on the web, or as a pwa on my phone.

This is a monorepo to hold:

- apps/web: The website and entry point for all users. This contains a dashboard much like icloud where you can see todays most recent todos, calendar events, etc.
- apps/todo: The todo app
- packages/aliveui: a ui library to use across all mini apps

All UI in the apps uses @aliveui and the variables in globals.css

This app is completely mobile first in its design, desktop is just a larger version of the mobile app.

The apps are to feel like mobile games. Lots of fun animations, a 3D style, and a lot of polish and FUN.