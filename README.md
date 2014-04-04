# Heise.de - All Posts
This script fetches all posts following the currently viewed in a thread and adds them beneath the current post. 
When keeping the page open, the script will recheck for new posts every 30 seconds (default value).

## Installation
Click on the file ending in `.user.js` and click on the _Raw_ button to open the file directly. This should trigger your userscript plug-in to ask you to install the script.

## Issues / Requests / Questions...
To report any issues, make requests or ask questions about the script please use GitHub's issue tracker.

----

## Settings
To change the intervals of the periodic checking for new posts or disable that feature completely you have to edit the source:

```
_HEISEFORUM_UPDATE_THREAD
   type: boolean (true or false)
   when set to true, the script will check every _UPDATE_INTERVAL seconds for new posts in the thread and appends them

_HEISEFORUM_UPDATE_INTERVAL
   type: integer
   time in seconds between two checks for new posts
```
