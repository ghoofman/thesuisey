var SuiseyCustomImageLayer;

(function () {
    'use strict';

    SuiseyCustomImageLayer = function (editor, name) {
        this.entities = [];
        this.variant = null;
        this.editor = editor;

        this.element = jQuery('<div class="img-layer"></div>');
        editor.container.append(this.element);

        this.element.addClass(name);
        this.addEntity(name);

        this.setVariant();
    };

    SuiseyCustomImageLayer.prototype = {
        entities: [],
        variant: null,
        element: null,
        editor: null,

        setVariant: function (variant) {
            var i = 0;
            this.variant = variant;
            for (i = 0; i < this.entities.length; i += 1) {
                if (variant && variant !== '') {
                    this.entities[i].el.attr('src', this.editor.options.root + this.entities[i].name + '_' + variant + '.png');
                } else {
                    this.entities[i].el.attr('src', this.editor.options.root + this.entities[i].name + '.png');
                }
            }
        },

        addEntity: function (name) {
            var data = {
                el: jQuery('<img />'),
                name: name
            };
            this.entities.push(data);
            this.element.append(data.el);
        },

        getResult: function () {
            var i, data = {
                entities: [],
                variant: this.variant
            };

            for (i = 0; i < this.entities.length; i += 1) {
                data.entities.push(this.entities[i].name);
            }

            return data;
        }
    };

}());
