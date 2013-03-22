# BackgroundCanvas

Quick & dirty canvas-as-background utility. Fills the page, centered, without scrollbars.

## Constructor Params
### zoom
- Optional. Apply a scaling factor to the entire canvas.

### zIndex
- Optional. Specify a z-index to be applied.

## Properties
### container
- The div that holds the canvas, and is added to the DOM.

### canvas
- The canvas.

### context
- The canvas's context.

## Methods
### getWidth()
- returns the unscaled width of the canvas

### getHeight()
- returns the unscaled height of the canvas

### getVisibleRect()
- returns an array describing the visible area of the canvas: [left, top, width, height]
