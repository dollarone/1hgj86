var PlatfomerGame = PlatformerGame || {};

//title screen
PlatformerGame.Game = function(){};

PlatformerGame.Game.prototype = {
    create: function() {

        //  A simple background for our game
        this.sky = this.game.add.sprite(0, 0, 'sky');
        this.sky.scale.setTo(20, 1);
        this.player = this.game.add.sprite(3555, 188, 'tiles');
        this.player.frame = 1; 

        this.game.physics.arcade.enable(this.player);

        this.player.body.bounce.y = 0;
        this.player.body.gravity.y = 400;
        this.player.anchor.setTo(0.5);
        this.player.body.collideWorldBounds = false;

        this.game.world.resize(4200,400);
        this.game.camera.follow(this.player);

        //  Our two animations, walking left and right.
        this.player.animations.add('left', [4, 5], 10, true);
        this.player.animations.add('right', [4, 5], 10, true);


        this.music = this.game.add.audio('music');
        this.music.loop = true;
        //this.music.play();

        //  The score
        this.platforms = this.game.add.group();


        //  Enable physics for any star that is created in this group
        this.platforms.enableBody = true;



        this.html = this.game.cache.getText('html');

        this.source_code = this.html.split('\n');


        for (var i = 0; i < this.source_code.length; i++) {
            var scoreText  = this.game.add.text(40 + i*28, 400, '', { fontSize:
             '10px', fill: '#000' }); // space out the lines a bit
            this.platforms.add(scoreText);
            scoreText.body.immovable = true;
            scoreText.text = this.source_code[i];
            scoreText.body.setSize(10, scoreText.width, 0, -scoreText.width);

            //this.scoreText.fixedToCamera = true;
            scoreText.angle = -90;
        }
    
        this.score = 0;

        //  Create some controls for the player
        this.cursors = this.game.input.keyboard.createCursorKeys();
        
        this.timer = 0;

        this.win = false;



        this.showDebug = false; 
    },

    update: function() {
        this.timer++;
        //  Collide the player with the platforms
        this.game.physics.arcade.collide(this.player, this.platforms);


        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;

        if (this.win) return;

        if (this.cursors.left.isDown)
        {
            //  Move to the left
            this.player.scale.setTo(-1, 1);
            this.player.body.velocity.x = -150;

            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown)
        {
            //  Move to the right
            this.player.scale.setTo(1, 1);
            this.player.body.velocity.x = 150;

            this.player.animations.play('right');
        }
        else
        {
            //  Stand still
            this.player.animations.stop();

            this.player.frame = 3;
        }
        
        //  Allow the player to jump if 
        //  (and only if) they are touching the ground.
        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.body.velocity.y = -300;
        }

        if (this.player.y > this.game.world.height-10) {
            this.death();
        }

        this.checkWin();

    },

    death: function() {

        this.player.x = 45;
        this.player.y = 188;
        this.player.frame = 1; 

    },

    checkWin: function() {

        if (!this.win && this.player.x > 3800
            && this.player.y > 200) {
            this.win = true;




            var win = this.game.add.text(this.player.x - 200, 
                this.player.y - 100, 
                'You win!', 
                { fontSize:
                '50px', fill: '#000' }); // Congrats, you win the game!
        }
    },
};