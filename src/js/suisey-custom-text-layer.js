var SuiseyCustomTextLayer;

(function () {
    'use strict';

    SuiseyCustomTextLayer = function (editor, text, options) {
        var self = this;

        this.entity = null;
        this.options = options;
        this.options.color = this.options.color || [ 255, 255, 255];
        this.options.outline = this.options.outline || null;
        this.editor = editor;

        this.element = jQuery('<div class="text-layer"></div>');
        editor.container.append(this.element);
        this.entity = jQuery('<img />');
        this.element.append(this.entity);
        this.setText(text);

        jQuery(window).resize(function () {
            self.setText(self.text);
        });
    };

    SuiseyCustomTextLayer.prototype = {
        entity: null,
        text: null,
        options: null,
        element: null,
        editor: null,

        setText: function (text) {
            var x, y, width, height, widthScale, heightScale, textMeasurer, textSize, canvas, context, outline, color;

            this.text = text;
            this.entity.text(this.text);

            widthScale = this.editor.scaleWidth();
            heightScale = this.editor.scaleHeight();

            x = this.options.x * widthScale;
            y = this.options.y * heightScale;

            /*global TextMeasurer */
            textMeasurer = new TextMeasurer();
            textSize = textMeasurer.measureText({
                text: text,
                fontSize: this.options.size + 'px',
                fontFamily: this.options.font || 'Arial'
            });
            /*global console */
            console.log(text, this.options.size, textSize.width, textSize.height);

            //this.element.css('font-size', this.options.size * widthScale);
            canvas = jQuery('<canvas width="' + (textSize.width + 1) + '" height="' + (textSize.height + 1) + '"></canvas>');
            context = canvas[0].getContext('2d');

            context.font = this.options.size + 'px ' + (this.options.font || 'Arial');
            context.lineWidth = this.options.size / 30.0;

            color = 'rgb(' + this.options.color[0] + ',' + this.options.color[1] + ',' + this.options.color[2] + ')';

            context.fillStyle = color;
            context.fillText(text, 0, textSize.height);
            if (this.options.outline) {
                outline = 'rgb(' + this.options.outline[0] + ',' + this.options.outline[1] + ',' + this.options.outline[2] + ')';
                context.strokeStyle = outline;
                context.strokeText(text, 0, textSize.height);
            }

            this.entity.attr('src', canvas[0].toDataURL());

            width = (textSize.width + 1) * widthScale;
            height = (textSize.height + 1) * heightScale;

            x -= width / 2.0;
            y -= height / 2.0;

            this.element.css('left', x + 'px');
            this.element.css('top', y + 'px');
            this.entity.css('width', width + 'px');
            this.entity.css('height', height + 'px');
        },

        setColor: function (color) {
            this.options.color = color;
            this.setText(this.text);
        },

        setOutline: function (color) {
            this.options.outline = color;
            this.setText(this.text);
        },

        setFont: function (font) {
            this.options.font = font;
            this.setText(this.text);
        },

        getResult: function () {
            var data = {
                text: this.text,
                color: this.color,
                x: this.options.x,
                y: this.options.y
            };

            return data;
        }
    };
}());
