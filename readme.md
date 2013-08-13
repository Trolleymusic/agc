# agc - Another Generic Carousel

That's right. It's Another Generic Carousel! It started off as something simple and became more and more of a beast until eventually I was using it in every project that needed a carousel (which I wish there were less of...)

### Use

Easy to set up:

```
$("#carousel").agc();
```

Enable autoplay:

```
$("#carousel").agc({ autoplay : 5 });
```

Many options:

```
$("#carousel").agc({
    controls : $("#controls"),
    doNotMove : true,
    goTo : function (i) { console.log("Go to slide " + i); }
    mark : {
        current : "current-class",
        next : "next-class",
        prev : "prev-class"
    }
    next : function (event, carouselElement, elementClicked) {
        console.log(event);
    }
    prev : function (event, carouselElement, elementClicked) {
        console.log(event);
    }
    setZOrder : true
});
```

Also supports swiping on touch devices, and keyboard left & right controls.

### Options

* `autoplay` : number of seconds between auto-slide change, optional
* `carousel` : element to make the carousel, overrides the element plugin was called on, optional
* `close` : function to be called when the #close control is clicked, optional
* `controls` : collection of elements which will call the next & prev functions, optional. If you don't supply this, the plugin will look in the carousel element for any links and assign controls to anything with `[href="#next"]`, `[href="#prev"]`, `[href="#close"]` or a digit eg: `[href="#1"]`
* `doNotArrange` : flag for plugin to not change the positioning of anything, optional, `default : false`
* `doNotMove` : flag for plugin to not move the slides when next/prev is called, optional, `default : false`
* `doNotScroll` : legacy/duplicate flag of doNotMove, optional, `default : false`
* `goTo` : function to be called when carousel has to goto a specific slide, overrides the default behaviour, optional
* `mark` : object indicating that certain slides should be marked with classes to identify them, optional, `default : null`
  * `current` : string, the class applied to the current slide, optional
  * `next` : string, the class applied to the next slide, optional
  * `prev` : string, the class applied to the prev slide, optional
* `next` : function to be called when carousel goes to the next slide, overrides the default behaviour, optional
* `prev` : function to be called when carousel goes to the previous slide, overrides the default behaviour, optional
* `setZOrder` : flag to set the z-order of slides, useful if you're stacking them, not laying them out side-by-size, optional, `default : false`




### Requirements

* jQuery
* Modernizr (with `.csstransforms`, `.csstransforms3d`, `.prefixed()`, and `.touch` - [http://modernizr.com/download/#-csstransforms-csstransforms3d-touch-shiv-cssclasses-prefixed-teststyles-testprop-testallprops-prefixes-domprefixes-load](get a custom build here))