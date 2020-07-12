# reddit-top-entries

This is a Vue.js app that connects to the reddit REST API to retrieve the top entries on reddit.

You can check the visual project progress on images from day 1 to day 5 inside the folder [project progress](https://github.com/oscar9214/reddit-top-entries/tree/master/project%20progress).

The app has a sidebar in which you can navigate the top entries and select one to have more detail about the entry on the right side.

#### Check the app working right here: https://oscar9214.github.io/reddit-top-entries/
If you want to clear the app state just clear the localstorage data of this page and the app will reset to the initial state.

## Project setup
```
npm install
npm run serve
```

## Testing
There are some test cases done with **cypress** located inside the ./cypress folder

## App features
The app has the following features:
- Connection with reddit web services
- Pagination support
- Saving entries
- App state-preservation/restoration
- Indicator of unread/read post (updated status, after post it’s selected)
- Dismiss Post Button (remove the cell from list. Animations required)
- Dismiss All Button (remove all posts. Animations required)
- Support split layout (left side: all posts / right side: detail post)
- Responsive design
- To go to the full sized picture once you selected the entry just click on the image

All the documentation used for this app was taken from: http://www.reddit.com/dev/api and https://github.com/reddit-archive/reddit/wiki/OAuth2
