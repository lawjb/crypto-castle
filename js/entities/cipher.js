/**
 * a cipher container and child items
 */

game.cipher = game.cipher || {};


game.cipher.Container = me.Container.extend({

    init: function (x, y) {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // give a name
        this.name = "cipher";

        // add our child text object at the top left corner
        this.addChild(new game.cipher.text(x, y));
    }
});


/**
 * a basic item to display text
 */
game.cipher.text = me.Renderable.extend({
    /**
     * constructor
     */
    init: function (x, y) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

        // create the font object
        this.font = new me.BitmapFont(me.loader.getBinary('PressStart2PCipher'), me.loader.getImage('PressStart2PCipher'));

        // font alignment to right, bottom
        this.font.textAlign = "left";
        this.font.textBaseline = "bottom";

        // local copy of the global start string
        this.text = "";
    },

    /**
     * update function
     */
    update: function () {
        // we don't do anything fancy here, so just
        // return true if the text has been updated
        if (this.text !== game.data.current_string) {
            this.text = game.data.current_string;
            return true;
        }
        return false;
    },

    /**
     * draw the text
     */
    draw: function (renderer) {
        // this.pos.x, this.pos.y are the relative position from the top left
        this.font.draw(renderer, game.data.start_string + " -> " + game.data.current_string, this.pos.x, this.pos.y);
    }

});

game.RSAText = game.RSAText || {};


game.RSAText.Container = me.Container.extend({

    init: function (x, y, start, value) {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // give a name
        this.name = "RSAText";

        // add our child text object at the top left corner
        this.addChild(new game.RSAText.text(x, y, start, value));
    }
});


/**
 * a basic item to display text
 */
game.RSAText.text = me.Renderable.extend({
    /**
     * constructor
     */
    init: function (x, y, start, value) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

        // create the font object
        this.font = new me.BitmapFont(me.loader.getBinary('PressStart2PCipher'), me.loader.getImage('PressStart2PCipher'));

        // font alignment to right, bottom
        this.font.textAlign = "left";
        this.font.textBaseline = "bottom";

        // local copy of the global start string
        this.text = "";
        this.state = start;
        this.value = value;
    },

    /**
     * update function
     */
    update: function () {
        // we don't do anything fancy here, so just
        // return true if the text has been updated
        if (this.text !== game.data[this.value]) {
            this.text = game.data[this.value];
            return true;
        }
        return false;
    },

    /**
     * draw the text
     */
    draw: function (renderer) {
        // this.pos.x, this.pos.y are the relative position from the top left
        this.font.draw(renderer, game.data[this.value], this.pos.x, this.pos.y);
    }

});
