


// everything's wrapped so I don't pollute your namespace
var BackgroundCanvas = (function () {


	//////////////////////////////////////////////////
	// a handful of simple utility functions
	//////////////////////////////////////////////////

	function bindEventListener (target, event, handler) {
		if (target.addEventListener)
			target.addEventListener(event, handler, false);
		else if (target.attachEvent)
			target.attachEvent('on'+event, handler);
	}

	function afterLoad (func) {
		if (document.readyState == "complete")
	   		func();
	  	else
	   		bindEventListener( window, "load", func );
	}

	function getViewRect () {
		// this is most modern browsers
		if (typeof window.pageXOffset != 'undefined')
			return [window.pageXOffset, window.pageYOffset, 
					window.innerWidth, window.innerHeight];

		// this is IE8 down to IE6 (anything older can suck it)
		return [document.documentElement.scrollLeft, document.documentElement.scrollTop,
				window.innerWidth, window.innerHeight];
	};

	function getDocHeight () {
	    var B = document.body;
	    var E = document.documentElement;
	    var S = window.screen;

	    return Math.max(
			B.scrollHeight, B.offsetHeight, B.clientHeight, 
			E.scrollHeight, E.offsetHeight, E.clientHeight,
			S.height, S.availHeight
	    );
	};

	function getDocWidth () {
	    var B = document.body;
	    var E = document.documentElement;
	    var S = window.screen;

	    return Math.max(
			B.scrollWidth, B.offsetWidth, B.clientWidth, 
			E.scrollWidth, E.offsetWidth, E.clientWidth,
			S.width, S.availWidth
	    );
	};





	//////////////////////////////////////////////////
	// and now the actual BackgroundCanvas function
	//////////////////////////////////////////////////

	var BackgroundCanvas = function (zoom, zIndex) {
		zoom = typeof zoom !== 'undefined' ? zoom : 1;

		var self = this;
		self.scale = 1 / zoom;

		self.container = document.createElement("div");
		self.container.className = "background-canvas-container";
		document.body.insertBefore( self.container, document.body.firstChild );

		if (typeof zIndex !== "undefined")
			self.container.style.zIndex = zIndex;

		self.canvas = document.createElement("canvas");
		self.context = self.canvas.getContext("2d");

		self.getWidth = function () { return self.canvas.width * zoom; }
		self.getHeight = function () { return self.canvas.height * zoom; }

		bindEventListener( window, "scroll", function(){self.updateCanvasSize();} );
		bindEventListener( window, "resize", function(){self.updateCanvasSize();} );

		afterLoad( function () { self.setSize(); } );
	};



	BackgroundCanvas.prototype.getVisibleRect = function () {
		var viewRect = getViewRect(); // [ top-left x, top-left y, width, height ]
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



	var canvasContainerCSS  = "<style>"
		canvasContainerCSS += 	".background-canvas-container {";
		canvasContainerCSS += 		"overflow: hidden;";
		canvasContainerCSS += 		"position: absolute;";
		canvasContainerCSS += 		"top: 0px;";
		canvasContainerCSS += 		"bottom: 0px;";
		canvasContainerCSS += 		"height: 100%;";
		canvasContainerCSS += 		"width: 100%;";
		canvasContainerCSS += 	"}"
		canvasContainerCSS += "</style>";
	document.write( canvasContainerCSS );


	// export the important bit 
	return BackgroundCanvas;
})();










