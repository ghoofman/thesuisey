var SuiseyCustomTextLayer;

(function () {
    'use strict';

    SuiseyCustomTextLayer = function (editor, text, options) {
        var self = this;

        this.entity = null;
        this.options = options;
        this.editor = editor;
        this.color = '#fff';

        this.element = jQuery('<div class="text-layer"></div>');
        editor.container.append(this.element);
        this.entity = jQuery('<div></div>');
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
        color: null,

        setText: function (text) {
            var x, y, widthScale, heightScale;

            this.text = text;
            this.entity.text(this.text);

            widthScale = this.editor.scaleWidth();
            heightScale = this.editor.scaleHeight();

            x = this.options.x * widthScale;
            y = this.options.y * heightScale;

            this.element.css('font-size', this.options.size * widthScale);

            x -= this.element.width() / 2.0;
            y -= this.element.height() / 2.0;

            this.element.css('left', x + 'px');
            this.element.css('top', y + 'px');
        },

        setColor: function (color) {
            this.color = color;
            this.element.css('color', color);
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
