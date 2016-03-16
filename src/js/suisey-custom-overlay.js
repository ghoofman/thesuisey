var SuiseyCustomOverlay;

(function () {
    'use strict';

    SuiseyCustomOverlay = function (image, options, cb) {
        var self = this;
        this.options = options;
        this.options.overlay = this.options.overlay || [ 0, 0, 0 ];
        this.canvasEl = jQuery('<canvas></canvas>');
        this.canvas = this.canvasEl[0];
        this.ctx = this.canvas.getContext("2d");
        this.canvases = [];

        this.image = image;
        this.img = new Image();
        this.img.crossOrigin = "anonymous";
        this.img.onload = function () {
            self.start();
            if (cb) {
                cb();
            }
        };
        this.img.src = image;
    };

    SuiseyCustomOverlay.prototype = {
        setPixel: function (imageData, x, y, r, g, b, a) {
            var index = (x + y * imageData.width) * 4;
            imageData.data[index] = r;
            imageData.data[index + 1] = g;
            imageData.data[index + 2] = b;
            imageData.data[index + 3] = a;
        },

        imgSrc: function () {
            return this.canvasEl[0].toDataURL();
        },

        start: function () {
            var imgd, pix, i;

            this.canvas.width = this.cw = this.img.width;
            this.canvas.height = this.ch = this.img.height;

            this.ctx.drawImage(this.img, 0, 0);

            this.width = this.canvas.width;
            this.height = this.canvas.height;

            this.imageData = this.ctx.createImageData(this.width, this.height);

            imgd = this.ctx.getImageData(0, 0, this.width, this.height);
            pix = imgd.data;

            /*global console */
            console.log(pix[0]);
            // Loops through all of the pixels and modifies the components.
            for (i = 0; i < pix.length; i += 4) {
                pix[i] *= this.options.overlay[0] / 255.0;   // Red component
                pix[i + 1] *= this.options.overlay[1] / 255.0; // Green component
                pix[i + 2] *= this.options.overlay[2] / 255.0; // Blue component
                //pix[i+3] is the transparency.
            }
            this.ctx.putImageData(imgd, 0, 0);
        }
    };

}());
