game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function () {
        // load a level
        me.levelDirector.loadLevel("level_" + game.level);

        // play the audio track
        me.audio.playTrack("dst-inertexponent");

        game.lever_list = [];

        game.data.goal_string = game.getRandomPassword();

        game.data.padding = (420 - ((game.data.goal_string.length + 4) * 35)) / 2;

        game.spawnEntities(game.level);
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function () {
        // remove the cipher from the game world
        me.game.world.removeChild(game.cipher_text);
        me.game.world.removeChild(game.exit);

        // stop the current audio track
        me.audio.stopTrack();

        var lever;
        for (lever of game.lever_list)
            me.game.world.removeChild(lever);
    },

});
game.spawnEntities = function (level_type) {
    var groundY = 700;

    var lever;


    switch (level_type) {
        case "intro":
            // Force the intro into a complete state from the start
            game.data.current_string = game.data.goal_string;
            game.signText = new game.Textbox.Container(80, 100, "You're tasked with testing the security of Crypto castle...");
            me.game.world.addChild(game.signText);

            game.sign2Text = new game.Textbox.Container(100, 100, "To pass each level you'll need to crack the cipher...");
            me.game.world.addChild(game.sign2Text);

            game.exit = me.pool.pull("ExitEntity", 913, 552, false);
            me.game.world.addChild(game.exit);
            // Draw text off screen so cleanup doesnt complain
            game.cipher_text = new game.cipher.Container(10000, 10000);
            me.game.world.addChild(game.cipher_text);
            break;
        case "caesar":
            console.log("caesar level");
            game.data.current_string = caesarCipher(game.data.goal_string, Math.ceil(Math.random() * 14));
            game.data.start_string = game.data.current_string;

            lever = me.pool.pull("InteractEntity", 670, groundY, game.getCaesarLever(-1), game.getCaesarLever(1));
            me.game.world.addChild(lever, 2);

            game.exit = me.pool.pull("ExitEntity", 1300, groundY - 70, true);
            me.game.world.addChild(game.exit, 2);
            game.signText = new game.Textbox.Container(100, 100, "Can you break a Caesar cipher? (use keys f and g)");
            me.game.world.addChild(game.signText);

            game.cipher_text = new game.cipher.Container(500 + game.data.padding, 540);
            me.game.world.addChild(game.cipher_text);
            break;

        case "vigenere":
            console.log("vigenere level");
            game.data.current_string = vigenereCipher(game.data.goal_string, game.data.key_string);
            game.data.start_string = game.data.current_string;

            for (var i = 0; i < game.data.current_string.length; i++) {
                lever = me.pool.pull("InteractEntity", 400 + 140 * i, groundY, game.getVigenereLever(i, -1), game.getVigenereLever(i, 1));
                me.game.world.addChild(lever, 2);
            }

            game.exit = me.pool.pull("ExitEntity", 1300, groundY - 70, true);
            me.game.world.addChild(game.exit, 2);
            game.lever_list.push(lever);
            game.signText = new game.Textbox.Container(100, 100, "This time there's a key - it's secret.");
            me.game.world.addChild(game.signText);

            game.cipher_text = new game.cipher.Container(425 + game.data.padding, 610);
            me.game.world.addChild(game.cipher_text);
            break;

        case "atbash":
            console.log("atbash level");
            game.data.current_string = atbashCipher(game.data.goal_string);
            game.data.start_string = game.data.current_string;

            for (var i = 0; i < game.data.current_string.length; i++) {
                lever = me.pool.pull("InteractEntity", 400 + 140 * i, groundY, game.getVigenereLever(i, -1), game.getVigenereLever(i, 1));
                me.game.world.addChild(lever, 2);
            }

            game.lever_list.push(lever);
            game.signText = new game.Textbox.Container(100, 100, "Atbash has a nice symmetric quality to it.");
            me.game.world.addChild(game.signText);

            game.cipher_text = new game.cipher.Container(500 + game.data.padding, 540);
            me.game.world.addChild(game.cipher_text);
            game.exit = me.pool.pull("ExitEntity", 1300, groundY - 70, true);
            me.game.world.addChild(game.exit, 2);
            break;

    case "rsa":
	game.data.rsa_pq_primes = [3, 4];
	game.data.rsa_pq_disp = getPrimes(4);
	var rsa_params = RSA(game.data.rsa_pq_primes[0], game.data.rsa_pq_primes[1]);
	console.log("RSA level!");

        for (var i = 0; i < 2; i++) {
            lever = me.pool.pull("InteractEntity", 400 + 140 * i, groundY, game.getRSALever(i, -1), game.getRSALever(i, 1));
            me.game.world.addChild(lever, 2);
        }
        game.lever_list.push(lever);
	game.exit = me.pool.pull("ExitEntity", 1300, groundY-70, true);
	me.game.world.addChild(game.exit, 2);
    }
};

game.getVigenereLever = function (j, n) {
    return function () {
        var result = '';
        for (var i = 0; i < game.data.current_string.length; i++) {
            if (i == j) {
                result += addToChar(game.data.current_string[i], n);
            } else {
                result += game.data.current_string[i];
            }
        }

        game.data.current_string = result;
    };
};

game.getCaesarLever = function (i) {
    return function () {
        game.data.current_string = caesarCipher(game.data.current_string, i);
    };
};

game.getRSALever = function(i, n) {
    return function () {
	game.data.rsa_pq_primes[i] += n;
	if (game.data.rsa_pq_primes[i] < 2) game.data.rsa_pq_primes[i] = 2;
	game.data.rsa_pq_disp[i] = getPrimes(game.data.rsa_pq_primes[i])[1];
	game.data.rsa_result = RSA(game.data.rsa_pq_disp[0], game.data.rsa_pq_disp[1], game.data.rsa_cipher);
	console.table(game.data);
    };
};

game.getRandomPassword = function () {
    return passwords[Math.floor(Math.random() * passwords.length)];
};

game.getNextLevel = function () {
    switch(game.level) {
    case "intro":
	game.level = "rsa";
	break;
    case "caesar":
	game.level = "atbash";
	break;
    case "atbash":
	game.level = "vigenere";
	break;
    case "vigenere":
	game.level = "vigenere";
	break;
    case "rsa":
	game.level = "rsa";
	break;
    default:
	game.level = "caesar";
    }

    return game.level;
};

game.generateRSAParams = function () {
    var difficulty = game.data.difficulty;
    var pq = getPrimes(difficulty+3);
    var message = "";
    for (var i = 0; i < defficulty + 2; i++) {
	message.push(i.toString);
    }
    var m = parseInt(message);

    return pq + RSA(pq[0], pq[1], m);
};
