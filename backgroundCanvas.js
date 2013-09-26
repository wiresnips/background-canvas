
function BackgroundCanvas (targetZoom, zIndex) {
    targetZoom = typeof targetZoom !== 'undefined' ? targetZoom : 1;

    var self = this;
    self.scale = 1 / targetZoom;

    self.container = document.createElement("div");
    self.container.className = "background-canvas-container";

    if (typeof zIndex !== "undefined")
        self.container.style.zIndex = zIndex;

    self.canvas = document.createElement("canvas");
    self.context = self.canvas.getContext("2d");

    self.getWidth = function () { return self.canvas.width / self.scale; }
    self.getHeight = function () { return self.canvas.height / self.scale; }

    bindEventListener( window, "scroll", function(){self.updateCanvasSize();} );
    bindEventListener( window, "resize", function(){self.updateCanvasSize();} );

    afterload( function(){document.body.appendChild(self.container);} );
    afterload( function(){self.setSize();} );
};



BackgroundCanvas.prototype.getVisibleRect = function () {
    var viewRect = getViewRect(); // [left, top, width, height ]
    viewRect[0] += (this.getWidth() - document.body.scrollWidth) * 0.5; // this should move the screenCoords into canvasCoords

    // apply the scaling
    viewRect[0] = Math.floor( viewRect[0] * this.scale );
    viewRect[1] = Math.floor( viewRect[1] * this.scale );
    viewRect[2] = Math.ceil( viewRect[2] * this.scale );
    viewRect[3] = Math.ceil( viewRect[3] * this.scale );

    return viewRect;
}

BackgroundCanvas.prototype.setSize = function () {
    var docWidth = getDocWidth();
    var docHeight = getDocHeight();

    // things start to break if we try to make the canvas too large, so we'll auto-scale to keep the size down
    var dimLimit = 8192;
    var maxDim = this.scale * Math.max(docHeight, docWidth);    
    if (maxDim > dimLimit)
        this.scale *= 1 - ((maxDim - dimLimit) / maxDim);

    this.canvas.width = docWidth * this.scale;
    this.canvas.height = docHeight * this.scale;

    this.canvas.style.width = docWidth + "px";
    this.canvas.style.height = docHeight + "px";

    this.canvas.style.position = "relative";
    this.canvas.style.left = "50%";
    this.canvas.style.marginLeft = "-" + (docWidth * 0.5) + "px";

    if (this.scale != 1)
        this.context.scale( this.scale, this.scale );

    this.container.appendChild(this.canvas);
}


BackgroundCanvas.prototype.updateCanvasSize = function () {
    var docWidth = getDocWidth();
    var docHeight = getDocHeight();

    // if we shrank, it's all fine and dandy.
    if (this.canvas.width >= docWidth * this.scale && this.canvas.height >= docHeight * this.scale)
        return;

    // otherwise, we need to resize ourselves to fit again
    this.setSize();
    
    // if we're able to, we should refresh ourselves
    if (this.canvas.refresh)
        this.canvas.refresh();
};


document.write(
    "<style>" +
        ".background-canvas-container {" +
            "overflow: hidden;" +
            "position: absolute;" +
            "top: 0px;" +
            "bottom: 0px;" +
            "height: 100%;" +
            "width: 100%;" +
        "}" +
    "</style>" 
);
