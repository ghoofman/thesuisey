var SuiseyCustom;

(function () {
    'use strict';

    /*
     * Suisey Customize Editor
     * Manages layers required to create a customized Suisey
     *
     * thesuisey.com
     *
     * Garrett Hoofman - me@ghoofman.com - 2016
    */
    SuiseyCustom = function (element, options) {
        // Initialize the variables
        this.layers = [];
        this.options = options || {};
        this.options.width = this.options.width || 600;
        this.options.height = this.options.height || 800;
        this.options.root = this.options.root || '/imgs/';

        // Find the root element for this editor
        this.element = jQuery(element);

        // Setup the dom entity where all of the layers will reside
        this.container = jQuery('<div id="suisey-custom-editor-model"></div>');
        this.element.append(this.container);
    };

    SuiseyCustom.prototype = {
        // Each layer that the Suisey control contains
        layers: [],
        // The configuration like width, size, root path, etc
        options: null,
        // The root element of the control
        element: null,
        // Where each layer's root element is located
        container: null,

        // Adds an image layer to the editor
        addImageLayer: function (name) {

            /*global SuiseyCustomImageLayer */
            var layer = new SuiseyCustomImageLayer(this, name);
            this.layers.push(layer);

            return layer;
        },

        // Adds a text layer to the editor
        addTextLayer: function (text, options) {

            /*global SuiseyCustomTextLayer */
            var layer = new SuiseyCustomTextLayer(this, text, options);
            this.layers.push(layer);

            return layer;
        },

        // Adds an icon layer to the editor
        addIconLayer: function (img, options) {
            /*global SuiseyCustomIconLayer */
            var layer = new SuiseyCustomIconLayer(this, img, options);
            this.layers.push(layer);

            return layer;
        },

        // Gets the current width scale
        // Images are created an initial size (ex: 600 x 800)
        // If the editor window is 300 x 400 then the scale width
        // will be 0.5. So if a layer is positioned at 200 x 200, it will
        // be scaled by 0.5 and positioned at 100 x 100.
        scaleWidth: function () {
            return this.element.width() / this.options.width;
        },

        // Gets the current height scale
        // To ensure proper scaling, this should be the same as scaleWidth
        // but is provided in worse case scenarios
        scaleHeight: function () {
            return this.element.height() / this.options.height;
        },

        // Returns the current json object that represents the contents
        // of this editor
        getResult: function () {
            var i = 0, data = {
                layers: []
            };

            for (i = 0; i < this.layers.length; i += 1) {
                data.layers.push(this.layers[i].getResult());
            }

            return data;
        }
    };
}());
