var SuiseyCustomIconLayer;

(function () {
    'use strict';

    SuiseyCustomIconLayer = function (editor, img, options) {
        var self = this;

        this.entity = null;
        this.options = options;
        this.editor = editor;
        this.img = null;

        this.element = jQuery('<div class="img-layer"></div>');
        editor.container.append(this.element);

        this.entity = jQuery('<img />');
        this.element.append(this.entity);
        this.setImage(this.editor.options.root + img);

        jQuery(window).resize(function () {
            self.setText(self.img);
        });
    };

    SuiseyCustomIconLayer.prototype = {
        entity: null,
        options: null,
        element: null,
        editor: null,
        img: null,

        setImage: function (img) {
            var x, y, w, h, widthScale, heightScale;

            this.img = img;
            this.entity.attr('src', img);

            widthScale = this.editor.scaleWidth();
            heightScale = this.editor.scaleHeight();

            x = this.options.x * widthScale;
            y = this.options.y * heightScale;
            w = this.options.w * widthScale;
            h = this.options.h * heightScale;

            x -= w / 2.0;
            y -= h / 2.0;

            this.element.css('left', x + 'px');
            this.element.css('top', y + 'px');
            this.element.css('width', w + 'px');
            this.element.css('height', h + 'px');
        },

        getResult: function () {
            var data = {
                img: this.img,
                x: this.options.x,
                y: this.options.y
            };

            return data;
        }
    };

}());
