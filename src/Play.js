score = 0
shotCounter = 0
shotPercent = 0

class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 200
        }
        
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)

        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.setDamping(true).setDrag(0.5)

        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width / 2, width - wallA.width / 2))
        wallA.body.setImmovable(true)
        wallA.body.setCollideWorldBounds(true)
        wallA.body.setBounce(0.5)
        wallA.body.setVelocityX(700)

        let wallB = this.physics.add.sprite(0, height / 4, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width / 2, width - wallB.width / 2))
        wallB.body.setImmovable(true)

        this.walls = this.add.group([wallA, wallB])

        // one way
        this.oneWay = this.physics.add.sprite(0, height / 4 * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width / 2, width - this.oneWay.width / 2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        
        this.scoreDisplay = this.add.text(width * 4 / 5, height * 8 / 10, "Score: " + score)
        this.shotsDisplay = this.add.text(width * 4 / 5, height * 8.5 / 10, "Shots: " + shotCounter)
        this.shotPercent  = this.add.text(width * 4 / 5, height * 9 / 10, "Shot %: " + shotPercent)

        //
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100

        this.input.on('pointerdown', (pointer) => {
            shotCounter += 1
            shotPercent = (score / shotCounter) * 100
            this.shotsDisplay.text = "Shots: " + shotCounter
            this.shotPercent.text = "Shot %: " + shotPercent
            let shotDirection 
            pointer.y <= this.ball.y ? shotDirection = 1: shotDirection = -1
            this.ball.body.setVelocityX(Phaser.Math.Between(-this.SHOT_VELOCITY_X, this.SHOT_VELOCITY_X))
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection)
        })

        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            score += 1
            shotPercent = (score / shotCounter) * 100
            this.scoreDisplay.text = "Score: " + score
            this.shotsDisplay.text = "Shots: " + shotCounter
            ball.destroy()
            this.create()
        })
        this.physics.add.collider(this.ball, this.walls)
        this.physics.add.collider(this.ball, this.oneWay)
    }

    update() {
        // display score, shots taken, & successful shot percentage
        // this.scoreDisplay.text = "Score: " + score
        // this.shotsDisplay.text = "Shots: " + shotCounter
        // this.shotPercent.text = "Shot %: " + shotPercent
    }
}