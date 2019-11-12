//update comments - at the moment the start game works for the first time but then the game is not successfully restarting. We need to put the snakes back to the beginning and reset the scores. 



/**
 * Jacob's Code review
 *
 * mixture of paradigms:
 *     functional and object oriented
 *
 * inconsistent comments, some functions use JSdoc others don't
 *
 * inconsistent indentation - shift, option, f
 *
 * startGame button not implemented - currently working for first implementation but doesn't restart
 *
 * complex variables can be simplified for readability:
 *     const didEatFood = this.snake[0].x === foodx && this.snake[0].y === foody;
 *
 * mixture of strict and abstract comparisons: "==" "===" - sorted.
 *
 * code in the global scope rather than wrapped inside a function
 * or method, just after Food class
 * possibly create a class for the game, that can store the players,
 * canvas, etc
 *
 * gameEndCheck function:
 *     Use if else over setting multiple variables and return one
 *     variable rather than four
 *
 * changeDirection method:
 *     Could remove variables that check the X and Y position and
 *     make them part of the if statement
 *
 * identical functions:
 * drawSnakeOnePart
 * drawSnakeTwoPart
 */

 //The start button

const startButton = document.querySelector('.startGameButton')

startButton.addEventListener ('click', event => {
    main()
    startButton.style.visibility = "hidden";
})

//The snake function

class Snake {
    constructor(player, colour, snake, directionKeys) {
        this.player = player;
        this.SNAKE_COLOUR = colour;
        this.SNAKE_BORDER_COLOUR = "darkgreen";
        this.score = 0;
        this.changingDirection = false;
        this.snake = snake;
        this.directionY = 0;
        this.directionX= 10;
        this.directionKeys = directionKeys;
        this.LEFT_KEY = this.directionKeys[0];
        this.RIGHT_KEY = this.directionKeys[1];
        this.UP_KEY = this.directionKeys[2];
        this.DOWN_KEY = this.directionKeys[3];
    }
    move(directionX, directionY) {
        // Create the new Snake's head
        const head = {
            x: this.snake[0].x + directionX,
            y: this.snake[0].y + directionY
        };
        // Add the new head to the beginning of snake body
        this.snake.unshift(head);
    }
    didEatFoodCheck(foodX, foodY, foodColour) {
        let didchange = false
        const didEatFood = this.snake[0].x === foodX && this.snake[0].y === foodY;
        if (didEatFood) {
            // Increase score
            this.score += 10;
            this.SNAKE_COLOUR = foodColour;
            didchange = true;
        } else {
            // Remove the last part of snake body
            this.snake.pop();
        }

        return didchange;
    }

    gameEndCheck() {
        for (let i = 4; i < this.snake.length; i++) {
            if (this.snake[i].x === this.snake[0].x && this.snake[i].y === this.snake[0].y) return true
        }

        const hitLeftWall = this.snake[0].x < 0;
        const hitRightWall = this.snake[0].x > gameCanvas.width - 10;
        const hitToptWall = this.snake[0].y < 0;
        const hitBottomWall = this.snake[0].y > gameCanvas.height - 10;

        return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
    }

    changeDirection(keyPressed) {
        /**
         * Prevent the snake from reversing
         * Example scenario:
         * Snake is moving to the right. User presses down and immediately left
         * and the snake immediately changes direction without taking a step down first
         */
        if (this.changingDirection) return;
        this.changingDirection = true;

        const goingUp = this.directionY === -10;
        const goingDown = this.directionY === 10;
        const goingRight = this.directionX === 10;
        const goingLeft = this.directionX === -10;

        if (keyPressed === this.LEFT_KEY && !goingRight) {
            this.directionX = -10;
            this.directionX = 0;
        }
        if (keyPressed === this.UP_KEY && !goingDown) {
            this.directionX = 0;
            this.directionY = -10;
        }
        if (keyPressed === this.RIGHT_KEY && !goingLeft) {
            this.directionX = 10;
            this.directionY = 0;
        }
        if (keyPressed === this.DOWN_KEY && !goingUp) {
            this.directionX = 0;
            this.directionY = 10;
        }
    }
}

//The food class

class Food {
    constructor() {
        this.colours = ["red", "yellow", "blue", "green", "orange", "purple", "pink", "brown"]
        this.FOOD_COLOUR = this.colours[0];
        this.FOOD_BORDER_COLOUR = "darkred";
        this.x = null;
        this.y = null;
    }
}

//information to make the game start

const GAME_SPEED = 100;
const CANVAS_BORDER_COLOUR = "black";
const CANVAS_BACKGROUND_COLOUR = "white";

const food = new Food();

// Get the canvas element
const gameCanvas = document.getElementById("gameCanvas");
// Return a two dimensional drawing context
const ctx = gameCanvas.getContext("2d");


function startGameFunction() {

    setTimeout(function onTick() {
        snakeOne.changingDirection = false;
        snakeTwo.changingDirection = false;
        clearCanvas();
        drawFood();
        advanceSnake(food.x, food.y, food.FOOD_COLOUR);
        drawSnake();

        // Call game again
        main();
    }, GAME_SPEED)
}



const snakeOne = new Snake("Player One", "rgb(28, 107, 28)", [{
            x: 150,
            y: 150
        },
        {
            x: 140,
            y: 150
        },
        {
            x: 130,
            y: 150
        },
        {
            x: 120,
            y: 150
        },
        {
            x: 110,
            y: 150
        }
    ],
    [37, 39, 38, 40])
const snakeTwo = new Snake("Player Two", "rgb(121, 44, 44)", [{
            x: 170,
            y: 170
        },
        {
            x: 160,
            y: 170
        },
        {
            x: 150,
            y: 170
        },
        {
            x: 140,
            y: 170
        },
        {
            x: 130,
            y: 170
        }
    ],
    [65, 68, 87, 83])


// startButton.addEventListener('click', () => {
//     console.log("Hello");
//     main();
//     // createFood()
// })

// Start game
// main();
// Create the first food location
createFood();
// Call changeDirection whenever a key is pressed
document.addEventListener("keydown", changeDirection);


const restart = () => {
    console.log(snakeOne.snake, snakeTwo.snake);
    snakeOne.snake = snakeOne.snake
    snakeTwo.snake= snakeTwo.snake
    
}


/**
 * Main function of the game
 * called repeatedly to advance the game
 */
function main() {
    // If the game ended return early to stop game
    if (didGameEnd()) {
        startButton.style.visibility = "visible";
        restart()
        main();
    }

    setTimeout(function onTick() {
        snakeOne.changingDirection = false;
        snakeTwo.changingDirection = false;
        clearCanvas();
        drawFood();
        advanceSnake(food.x, food.y, food.FOOD_COLOUR);
        drawSnake();

        // Call game again
        main();
    }, GAME_SPEED)
}

/**
 * Change the background colour of the canvas to CANVAS_BACKGROUND_COLOUR and
 * draw a border around it
 */
function clearCanvas() {
    //  Select the colour to fill the drawing
    ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
    //  Select the colour for the border of the canvas
    ctx.strokestyle = CANVAS_BORDER_COLOUR;

    // Draw a "filled" rectangle to cover the entire canvas
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    // Draw a "border" around the entire canvas
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

/**
 * Draw the food on the canvas
 */
function drawFood() {
    ctx.fillStyle = food.FOOD_COLOUR;
    ctx.strokestyle = food.FOOD_BORDER_COLOUR;
    ctx.fillRect(food.x, food.y, 10, 10);
    ctx.strokeRect(food.x, food.y, 10, 10);
}

function advanceSnake(foodX, foodY, foodColour) {

    snakeOne.move(snakeOne.directionX, snakeOne.directionY);
    snakeTwo.move(snakeTwo.directionX, snakeTwo.directionY)

    const snakeOneAte = snakeOne.didEatFoodCheck(foodX, foodY, foodColour);
    const snakeTwoAte = snakeTwo.didEatFoodCheck(foodX, foodY, foodColour);
    document.getElementById('snakeOneScore').textContent = snakeOne.score;
    document.getElementById('snakeTwoScore').textContent = snakeTwo.score;

    if (snakeOneAte || snakeTwoAte) {
        createFood()
    }
}

function didGameEnd() {

    if (snakeOne.gameEndCheck() || snakeTwo.gameEndCheck()) {
        return true
    }

    for (let i = 0; i < snakeOne.snake.length; i++) {
        for (let s = 0; s < snakeTwo.snake.length; s++) {
            if (snakeOne.snake[i].x === snakeTwo.snake[s].x && snakeOne.snake[i].y === snakeTwo.snake[s].y)
                return true
        }
    }
}

/**
 * Generates a random number that is a multiple of 10 given a minumum
 * and a maximum number
 * @param { number } min - The minimum number the random number can be
 * @param { number } max - The maximum number the random number can be
 */
function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

/**
 * Creates random set of coordinates for the snake food.
 */
function createFood() {
    food.FOOD_COLOUR = food.colours[Math.floor(Math.random() * 7)]
    // Generate a random number the food x-coordinate
    food.x = randomTen(0, gameCanvas.width - 10);
    // Generate a random number for the food y-coordinate
    food.y = randomTen(0, gameCanvas.height - 10);


    // if the new food location is where the snake currently is, generate a new food location
    snakeOne.snake.forEach(function isFoodOnSnake(part) {
        const foodIsoNsnake = part.x === food.x && part.y === food.y;
        if (foodIsoNsnake) createFood();
    });
}

/**
 * Draws the snake on the canvas
 */
function drawSnake() {
    // loop through the snake parts drawing each part on the canvas
    snakeOne.snake.forEach(drawSnakeOnePart)
    snakeTwo.snake.forEach(drawSnakeTwoPart)
}

/**
 * Draws a part of the snake on the canvas
 * @param { object } snakePart - The coordinates where the part should be drawn
 */
function drawSnakeOnePart(snakePart) {

    // Set the colour of the snake part
    ctx.fillStyle = snakeOne.SNAKE_COLOUR;

    // Set the border colour of the snake part
    ctx.strokestyle = snakeOne.SNAKE_BORDER_COLOUR;

    // Draw a "filled" rectangle to represent the snake part at the coordinates
    // the part is located
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);

    // Draw a border around the snake part
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnakeTwoPart(snakePart) {

    // Set the colour of the snake part
    ctx.fillStyle = snakeTwo.SNAKE_COLOUR;

    // Set the border colour of the snake part
    ctx.strokestyle = snakeTwo.SNAKE_BORDER_COLOUR;

    // Draw a "filled" rectangle to represent the snake part at the coordinates
    // the part is located
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);

    // Draw a border around the snake part
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    snakeOne.changeDirection(keyPressed);
    snakeTwo.changeDirection(keyPressed);
}