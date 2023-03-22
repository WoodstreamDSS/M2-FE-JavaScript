/*

Unified touch/mouse controller, single-touch only

Usage:

var {variable} = new TouchObj({element selector}, {callback});

ex.

var slider = new TouchObj('slider', sliderHandler); 

The TouchObj object must be given a target element id, and a local function to handle the data sent back. The function returns an object on mousedown/touchstart, mosemove/touchmove, and mouseup/touchend. The object's status reports what just happened, eithr 'start', 'move' or 'end'. Your handler will need to check the object status to determine what action to take:

sliderHandler(obj) {
    if (obj.status == 'start') {
        // do things related to start of touch interaction
    }
    if (obj.status == 'move') {
        // do things related to moving
    }
    if (obj.status == 'end') {
        // do things related to end of touch interaction
    }
}

On creation of the new TouchObj, the function will return an object with a status of either 'success' or 'fail' depending on whether or not the object was successfully created.

    { 
        status:'',          status of the element
        error:'',           what error was encountered
        xStart: 0,          x position where touch began
        yStart: 0,          y position where touch began
        xCurrent: 0,        current x location
        yCurrent: 0,        current y location
        yMove: 0,           amount of movement in the y direction
        xMove: 0,           amount of movement in the x direction
        xEnd: 0,            x position where touch ended
        yEnd: 0             y position where touch ended
    }; 

*/

WS.prototype.TouchObj = function(element, callback) {
    
    'use strict';
    
    // Definitions
    
    var startX, currentX, endX, xAmtMoved;
    var startY, currentY, endY, yAmtMoved;
    var mousePressed = false;    
    
    var obj = { 
        status:'',
        error:'',
        xStart: 0,
        yStart: 0,
        xCurrent: 0,
        yCurrent: 0,
        yMove: 0,
        xMove: 0,
        xEnd: 0,
        yEnd: 0
    };     
    
    // Error Handling
    
    if (callback === undefined) {
        obj.status = 'fail';
        obj.error = 'TouchObj.js: Error, cCallback not provided.';
        return obj;
    } else {
        this.handler = callback;
    }
      
    if (document.getElementById(element) === null) {
        obj.status = 'fail';
        obj.error = 'TouchObj.js: Error, target element does not exist.';
        return obj;
    } else {
        this.element = document.getElementById(element);
    }  
           
    // touch handling
    
    this.element.addEventListener('touchstart', function(e) {
        startX = parseInt(e.changedTouches[0].pageX);    
        startY = parseInt(e.changedTouches[0].pageY);   
        obj.status = 'start';
        obj.xStart = startX;
        obj.yStart = startY;
        obj.xMove = 0;
        obj.yMove = 0;
        this.handler(obj);
    }.bind(this));

    this.element.addEventListener('touchmove', function(e) { 
        currentX = parseInt(e.changedTouches[0].pageX);
        currentY = parseInt(e.changedTouches[0].pageY);
        xAmtMoved = currentX - startX;
        yAmtMoved = currentY - startY;
        obj.status = 'move';
        obj.xCurrent = currentX;
        obj.yCurrent = currentY;
        obj.yMove = yAmtMoved;
        obj.xMove = xAmtMoved;
        this.handler(obj);
    }.bind(this)); 

    this.element.addEventListener('touchend', function(e) {
        endX = parseInt(e.changedTouches[0].pageX);
        endY = parseInt(e.changedTouches[0].pageY);
        obj.status = 'end';
        obj.xEnd = endX;
        obj.yEnd = endY;
        this.handler(obj);
    }.bind(this));     
        
    // mouse handling
    
    this.element.addEventListener('mousedown', function(e) {
        mousePressed = true;
        startX = parseInt(e.clientX);   
        startY = parseInt(e.clientY);   
        obj.status = 'start';
        obj.xStart = startX;
        obj.yStart = startY;
        this.handler(obj);
    }.bind(this));
    
    this.element.addEventListener('mousemove', function(e) {    
        if (mousePressed === true) {
            currentX = parseInt(e.clientX);
            currentY = parseInt(e.clientY);
            xAmtMoved = currentX - startX;
            yAmtMoved = currentY - startY;
            obj.status = 'move';
            obj.xCurrent = currentX;
            obj.yCurrent = currentY;
            obj.yMove = yAmtMoved;
            obj.xMove = xAmtMoved;
            this.handler(obj);
        }
    }.bind(this));    
    
    this.element.addEventListener('mouseup', function(e) { 
        mousePressed = false;
        endX = parseInt(e.clientX);
        endY = parseInt(e.clientY);
        obj.status = 'end';
        obj.xEnd = endX;
        obj.yEnd = endY;
        this.handler(obj);
    }.bind(this));   
    
    obj.status = 'success';
    return obj;
};