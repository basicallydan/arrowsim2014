You need [browserify](http://browserify.org) to compile the code. Install it using `npm install -g browserify` then run `npm install` inside this directory. You can then compile using `browserify index.js -o bundle.js`.

Run `ruby -rwebrick -e'WEBrick::HTTPServer.new(:Port => 3000, :DocumentRoot => Dir.pwd).start'` in this directory and go to http://localhost:3000.

## What is 'Arrow Simulator 2014'

It's a game concept. An RTS of sorts, where wars are won by attrition and strategy, not by crazy micromanagement. 

The broad vision is armies and supply lines represented on a global scale on a world map by 'tactical arrows' (think dad's army opening). Battle lines are drawn with arrows impacting each other and armies are pushed back in wars of attrition rather than bulldozed by the best min-maxer. Supply lines and reinforcements are the key to long drawn out engagements.

## UX Interaction

3 core game objects - The Map, Territories and Armies (arrows).

### Map

Normal map interactions, these may be overridden if the user clicks on territories/armies.

* Click and drag to move

* Double click to zoom

* Scroll wheel scales map

### Territories

* Mouse hover over a territories for information (how will this work on mobile? maybe not have it at all)

* Click to select, shows hover over info

* Right click gives territory options (including selecting standing reinforcements, which then can be ordered into a moving army/arrow - this is how armies get started)

### Armies

* Click to select an existing army

* Click and drag an army spearhead (arrow-head) to get a ghost-representation of possible moves

* Click and drag on the stem to split army reinforcements at that point (producing a new army/arrowhead at that point), lets you choose % split between the two new armies.

* Clicking on a junction lets you reassign the %, including stopping reinforcements to one split altogether (and that stem will eventually flow entirely into its arrowhead) - (should this be a right click action?)

* Right-clicking an arrow head lets you tell it to retreat. Which will make the army 'flow' back to the last junction or territory.


## MVP features

* Display world map

* Split world map into territories

* Highlight captured territories

* Draw army arrows

* Move arrows

* Captured territories produce troops

* Capturing a territory with an army

* Battles between armies

* Splitting and combining armies

## Future Work

* Fog of war

* Multiplayer (1v1)

* Online login/lobby system

* Ads for sweet sweet revenue

## Pie in the sky crazy awesome ideas

* Air/Sea forces

* Economy

* Tech trees

* Multi-multiplayer (2v2/4v4 etc.)

* Different scale commanders (global commander, continent commanders)

* Touch-input/mobile/table versions.

# Notes on development

* We're using tiles from Cloudmade. I followed a tutorial [here](http://learnjs.io/blog/2013/11/08/leaflet-basics/) to help with Leaflet, and we'll need to use a [Cloudmade account](http://cloudmade.com/) to get our tiles, or get our own tiles.

* We're using country geoJson data from https://github.com/johan/world.geo.json

