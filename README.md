<!-- @format -->

# Fidoocia

Fidoocia is a React Native-powered iOS safety application for online dating. This application provides background checks on prospective dates by allowing its users to submit information to to be reviewed by the Fidoocia Team.

## Working Features

- Registration / Login System through Firebase
- Phone Authentication for New Users
- Submission of new date profiles and events for
- Ability to view the status of submitted dates
- Selection of Safe Havens for Dates from Maps
- Selection of Emergency Contacts from In-App Phonebook
- Selection of Multiple Verification Images from In-App Gallery
- Functionality to Edit Existing Date Profiles
- Notification Tab messages from Firestore verifications updates
- Push Notifications from Firestore verification updates

## Known Issues

- Push Notifications will not fire off to notify a user that a date is upcoming or started
- Status Screen does not always reflect up-to-date verifications
- Both the Check Out Screen and Friend ("Find A Friend") screens are unfinished
- Check Out screen does not update after a date has ended
- SMS has been temporarily shut off for demo purposes and needs to be re-implemented

## Tech

Fidoocia uses a number of technoglogies to work properly:

- React Native
- Firebase (Realtime, Firestore, and Cloud Functions)
- [Node.js] - evented I/O for the backend
- jQuery

NOTE: You may need the Blaze Plan of Firebase to utilize its cloud functions and increased storage. 

## Installation

Fidoocia requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server through Expo's Metro Server. This version will only work in iOS devices and simulators.

```sh
cd version-1
yarn install
expo start
-i
```

[//]: # "These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax"
[dill]: https://github.com/joemccann/dillinger
[git-repo-url]: https://github.com/joemccann/dillinger.git
[john gruber]: http://daringfireball.net
[df1]: http://daringfireball.net/projects/markdown/
[markdown-it]: https://github.com/markdown-it/markdown-it
[ace editor]: http://ace.ajax.org
[node.js]: http://nodejs.org
[twitter bootstrap]: http://twitter.github.com/bootstrap/
[jquery]: http://jquery.com
[@tjholowaychuk]: http://twitter.com/tjholowaychuk
[express]: http://expressjs.com
[angularjs]: http://angularjs.org
[gulp]: http://gulpjs.com
[pldb]: https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md
[plgh]: https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md
[plgd]: https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md
[plod]: https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md
[plme]: https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md
[plga]: https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md
