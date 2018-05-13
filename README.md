# GraalVM Carbon

GraalVM Carbon is a benchmark that measures GraalVM JavaScript engine’s (Graal.js) performance by running a suite of tests representative of certain use cases in JavaScript applications.

# How to use

`node ./run.js`

Don't forget to use appropriate amount of RAM. For example, for 12G free memory and V8 it looks like this:

`node --max-old-space-size=12228 ./run.js`

and for GraalVM it is:

`node --jvm.Xmx12G --jvm.Xms12G ./run.js`

Autodetection of VM, OS, maximum RAM etc will be added later. 

### History

Originally it was based on Octane 2.0 sources for V8. Please note that [Octane is retired](https://v8project.blogspot.com/2017/04/retiring-octane.html) and no longer maintained. Also, it was intended for in-browser tests, but Carbon is intended for server-side tests.

For legacy information, check out the [Octane homepage](https://developers.google.com/octane/), [benchmark reference](https://developers.google.com/octane/benchmark), or [FAQ](https://developers.google.com/octane/faq).
