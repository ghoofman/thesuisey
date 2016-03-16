var SuiseyCustomStroke,
    d3_geom_contourDx = [1, 0, 1, 1, -1, 0, -1, 1, 0, 0, 0, 0, -1, 0, -1, NaN],
    d3_geom_contourDy = [0, -1, 0, 0, 0, -1, 0, 0, 1, -1, 1, 1, 0, -1, 0, NaN];

(function () {
    'use strict';

    SuiseyCustomStroke = function (image, options, cb) {
        var overlay, self = this;
        this.options = options || {};

        this.canvasEl = jQuery('<canvas></canvas>');
        this.canvas = this.canvasEl[0];
        this.ctx = this.canvas.getContext("2d");
        this.canvases = [];

        this.img = new Image();
        this.img.crossOrigin = "anonymous";
        this.img.onload = function () {
            self.start();
            if (cb) {
                cb();
            }
        };
        //this.img.src = "https://dl.dropboxusercontent.com/u/139992952/multple/makeIndividual.png";

        this.strokeWeight = this.options.size || 8;
        this.options.outline = this.options.outline || [ 255, 255, 255 ];

        if (this.options.overlay) {
            /*global SuiseyCustomOverlay */
            overlay = new SuiseyCustomOverlay(image, {
                overlay: this.options.overlay
            }, function () {
                self.img.src = overlay.imgSrc();
            });
        } else {
            this.img.src = image;
        }
    };

    SuiseyCustomStroke.prototype = {
        strokeWeight: 8,
        canvases: [],

        d3_geom_contourStart: function (grid) {
            var x = 0,
                y = 0;

            // search for a starting point; begin at origin
            // and proceed along outward-expanding diagonals
            while (true) {
                if (grid(this, x, y)) {
                    return [x, y];
                }
                if (x === 0) {
                    x = y + 1;
                    y = 0;
                } else {
                    x = x - 1;
                    y = y + 1;
                }
            }
        },
        contour: function (grid, start) {
            var s = start || this.d3_geom_contourStart(grid), // starting point
                c = [], // contour polygon
                x = s[0], // current x position
                y = s[1], // current y position
                dx = 0, // next x direction
                dy = 0, // next y direction
                pdx = NaN, // previous x direction
                pdy = NaN, // previous y direction
                i = 0;

            do {
                // determine marching squares index
                i = 0;
                if (grid(this, x - 1, y - 1)) {
                    i += 1;
                }
                if (grid(this, x, y - 1)) {
                    i += 2;
                }
                if (grid(this, x - 1, y)) {
                    i += 4;
                }
                if (grid(this, x, y)) {
                    i += 8;
                }

                // determine next direction
                if (i === 6) {
                    dx = pdy === -1 ? -1 : 1;
                    dy = 0;
                } else if (i === 9) {
                    dx = 0;
                    dy = pdx === 1 ? -1 : 1;
                } else {
                    dx = d3_geom_contourDx[i];
                    dy = d3_geom_contourDy[i];
                }

                // update contour polygon
                if (dx !== pdx && dy !== pdy) {
                    c.push([x, y]);
                    pdx = dx;
                    pdy = dy;
                }

                x += dx;
                y += dy;
            } while (s[0] !== x || s[1] !== y);

            return c;
        },

        defineGeomPath: function (context, points) {
            var i;

            context.beginPath();
            context.moveTo(points[0][0], points[0][1]);
            for (i = 1; i < points.length; i += 1) {
                context.lineTo(points[i][0], points[i][1]);
            }
            context.lineTo(points[0][0], points[0][1]);
            context.closePath();
        },

        moveDiscreteElementToNewCanvas: function () {
            var hit, i, points, newCanvas, newCtx;

            // get the imageData of the main canvas
            this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.data1 = this.imageData.data;

            // test & return if the main canvas is empty
            // Note: do this b/ geom.contour will fatal-error if canvas is empty
            hit = false;
            for (i = 0; i < this.data1.length; i += 4) {
                if (this.data1[i + 3] > 0) {
                    hit = true;
                    break;
                }
            }
            if (!hit) {
                return;
            }

            // get the point-path that outlines a discrete element
            points = this.contour(this.defineNonTransparent);

            // create a new canvas and append it to page
            newCanvas = document.createElement('canvas');
            newCanvas.width = this.canvas.width;
            newCanvas.height = this.canvas.height;
            //document.body.appendChild(newCanvas);
            this.canvases.push(newCanvas);
            newCtx = newCanvas.getContext('2d');

            // attach the outline points to the new canvas (needed later)
            newCanvas.outlinePoints = points;

            // draw just that element to the new canvas
            this.defineGeomPath(newCtx, points);
            newCtx.save();
            newCtx.clip();
            newCtx.drawImage(this.canvas, 0, 0);
            newCtx.restore();

            // remove the element from the main canvas
            this.defineGeomPath(this.ctx, points);
            this.ctx.save();
            this.ctx.clip();
            this.ctx.globalCompositeOperation = "destination-out";
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.restore();

            return true;
        },

        addStickerLayer: function (context, weight) {
            var points, outline;

            this.imageData = context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.data1 = this.imageData.data;

            points = this.contour(this.defineNonTransparent);

            this.defineGeomPath(context, points);
            context.lineJoin = "round";
            context.lineCap = "round";
            outline = 'rgb(' + this.options.outline[0] + ',' + this.options.outline[1] + ',' + this.options.outline[2] + ')';
            /*global console */
            console.log(outline);
            context.strokeStyle = outline;
            context.lineWidth = weight;
            context.stroke();
        },

        addStickerEffect: function (canvas, strokeWeight) {
            var url, ctx1, imgx;
            url = canvas.toDataURL();
            ctx1 = canvas.getContext("2d");
            //var pts = canvas.outlinePoints;
            this.addStickerLayer(ctx1, strokeWeight);
            imgx = new Image();
            imgx.onload = function () {
                ctx1.drawImage(imgx, 0, 0);
            };
            imgx.src = url;
        },

        start: function () {
            var i = 0;

            // resize the main canvas to the image size
            this.canvas.width = this.cw = this.img.width;
            this.canvas.height = this.ch = this.img.height;

            // draw the image on the main canvas
            this.ctx.drawImage(this.img, 0, 0);

            // Move every discrete element from the main canvas to a separate canvas
            // The sticker effect is applied individually to each discrete element and
            // is done on a separate canvas for each discrete element
            while (this.moveDiscreteElementToNewCanvas()) {
                i += 1;
            }

            // add the sticker effect to all discrete elements (each canvas)
            for (i = 0; i < this.canvases.length; i += 1) {
                this.addStickerEffect(this.canvases[i], this.strokeWeight);
                this.ctx.drawImage(this.canvases[i], 0, 0);
            }

            // redraw the original image
            //   (necessary because the sticker effect
            //    slightly intrudes on the discrete elements)
            this.ctx.drawImage(this.img, 0, 0);

        },

        defineNonTransparent: function (self, x, y) {
            return (self.data1[(y * self.cw + x) * 4 + 3] > 0);
        },

        imgSrc: function () {
            return this.canvas.toDataURL();
        }
    };

}());
