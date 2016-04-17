##Udacity projects - Public Transportation App

an application that allows users to select a departure and arrival train station, and see a list of trains, times, and durations. A default train schedule ( [CalTrain](http://www.caltrain.com/developer.html) ) will be provided that should be used when the application is offline. If a network connection exists, the application will query an endpoint that provides “real-time” status updates on trains and delay information from [My511.org ](http://511.org/developer-resources_transit-data-feed.asp).

Live Demo
-------------
https://illl48.github.io/publicTransportation 

Install
-------------
```shell
npm install
```

Run
-------------
To run the porject on http://localhost:8080/ 
```shell
npm run dev
```

Build
-------------
1. Remove ``` 'webpack/hot/dev-server', ``` in **webpack.config.js**
2. Run ``` npm run dev ```
3. Result will be in the build folder
