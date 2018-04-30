# bracketology

> Final project for CS290. A website that performs statistical analysis to output predictions for the Men's NCAA Basketball Tournament.
Author: Jason Akers
Date Started Final Coding: April 26, 2018
Hours Approximately Spent: 30-40
Admin account: User: yee PW: yee
OR: Jason baeson
Functionality: You can login to the website using email/username and password. Signup using all of the above.
Guests: Look at official brackets. Yellow background behind team signifies that it won.
Users: Guests + Create a bracket for any year, each team has a probability, a random number will choose the team if it falls with the team's probability range. Able to save it. Able to view your saved brackets.
Admins: Users + the ability to delete a user or make a user an admin. Also can export json file.
What's left to implement: Admin ability to create another official bracket year. Being able to see the year your custom bracket is, lastly determine your score that you would've received for that year. Score would have needed local matrices to compare the values. Project utilizes Vue, jQuery, and Node. https://docs.google.com/forms/d/14vjz-gvzRozYDsGlUPjjz2eouqoeA8S-2CMFa4CgYKM/edit#responses


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
