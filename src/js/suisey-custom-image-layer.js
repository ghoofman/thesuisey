var SuiseyCustomImageLayer;

(function () {
    'use strict';

    SuiseyCustomImageLayer = function (editor, name, options) {
        this.entities = [];
        this.options = options || {};
        this.overlay = this.options.overlay || null;
        this.outline = this.options.outline || null;
        this.editor = editor;

        this.element = jQuery('<div class="img-layer"></div>');
        editor.container.append(this.element);

        this.element.addClass(name);
        this.setEntity(name);

        this.setVariant(this.overlay, this.outline);
    };

    SuiseyCustomImageLayer.prototype = {
        entity: [],
        overlay: null,
        element: null,
        editor: null,

        setVariant: function (overlay, outline) {
            var stroke, self = this;
            this.overlay = overlay;
            this.outline = outline;

            if (this.outline) {
                /*global SuiseyCustomStroke */
                stroke = new SuiseyCustomStroke('/examples/img/' + this.entity.name + '.png', {
                    outline: this.outline,
                    overlay: this.overlay
                }, function () {
                    self.entity.el.attr('src', stroke.imgSrc());
                });
            } else if (this.overlay) {
                /*global SuiseyCustomOverlay */
                stroke = new SuiseyCustomOverlay('/examples/img/' + this.entity.name + '.png', {
                    overlay: this.overlay
                }, function () {
                    self.entity.el.attr('src', stroke.imgSrc());
                });
            }
        },

        setEntity: function (name) {
            var data = {
                el: jQuery('<img />'),
                name: name
            };
            this.entity = data;
            this.element.append(data.el);
        },

        draw: function (name, variant, stroke, element, cb) {
            var canvasEl, canvas, ctx, img, imgSrc;

            canvasEl = jQuery('<canvas width="600" height="800" style="width: 150px; height: 200px;"></canvas>');
            canvas = canvasEl[0];
            //jQuery('body').append(canvas);
            ctx = canvas.getContext('2d');
            img = new Image();
            img.onload = function () {
                var dArr = [ -1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, -1, 1, 1, 1],
                    s = 5,
                    i = 0,
                    x = 5,
                    y = 5;

                if (stroke) {
                    for (i = 0; i < dArr.length; i += 2) {
                        ctx.drawImage(img, x + dArr[i] * s, y + dArr[i + 1] * s);
                    }
                    ctx.globalCompositeOperation = 'source-in';
                    ctx.fillStyle = stroke;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    /*global console */
                    console.log(canvas.width, canvas.height);
                }

                ctx.globalCompositeOperation = "source-over";
                ctx.drawImage(img, x, y, canvas.width, canvas.height);

                if (cb) {
                    cb(element, canvas.toDataURL());
                }
            };

            imgSrc = name;
            if (variant) {
                imgSrc += '_' + variant;
            }

            img.src = this.editor.options.root + imgSrc + '.png';

        },

        getResult: function () {
            var data = {
                entity: this.entity.name,
                outline: this.outline,
                overlay: this.overlay
            };

            return data;
        }
    };

}());
