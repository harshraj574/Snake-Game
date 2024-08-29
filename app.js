
document.addEventListener("DOMContentLoaded",()=>{

    const gameArena = document.getElementById("game-arena");
    const arenaSize = 600;
    const cellSize = 20;
    let score = 0;
    // let highScore = 0;
    let gameStarted = false;
    let food = {x: 300 , y: 200}; // {x: 15*20, y:10*20} -> cell cordinates-> pixels
    let snake = [{x:160,y:200}, {x:140,y:200}, {x:120,y:200}];

    let dx= cellSize;
    let dy = 0;

    function newFood(){
        food = {x: Math.floor(Math.random()*(20))*20,y: Math.floor(Math.random()*(20))*20};
        // food = {x: Math.floor(Math.random()*30)*20,y: Math.floor(Math.random()*30)*20};
    }

    function updateSnake(){
        const newHead = {x: snake[0].x+ dx, y: snake[0].y +dy};
        snake.unshift(newHead);

        //check collison wth food
        if(newHead.x === food.x && newHead.y === food.y){
            score += 10;
            if(score > localStorage.getItem("highScore") ){
                // highScore = score;
                localStorage.setItem("highScore", score);
            }
            document.getElementById('score-board').textContent = `Score: ${score}`;
            document.getElementById('high-score').textContent = `HighScore: ${localStorage.getItem("highScore")}`;

            newFood();
        }
        else{
            snake.pop(); // Remove tail
        }
    }

    function changeDirection(e){
        console.log(e);
        const isGoingDown  = dy === cellSize;
        const isGoingUp = dy === -cellSize;
        const isGoingLeft = dx === -cellSize;
        const isGoingRight  = dx === cellSize;  
        if(e.key === 'ArrowUp' && !isGoingDown ){
            dx = 0;
            dy = -cellSize;
        } else if(e.key === 'ArrowDown' && !isGoingUp){
            dx = 0;
            dy = cellSize;
        } else if(e.key === 'ArrowLeft' && !isGoingRight){
            dx = -cellSize;
            dy = 0;
        } else if(e.key === 'ArrowRight' && !isGoingLeft){
            dx = cellSize;
            dy = 0;
        }
    }

    function drawDiv(x,y,className){
        const divElement  = document.createElement('div');
        divElement.classList.add(className);
        divElement.style.top = `${y}px`;
        divElement.style.left = `${x}px`;
        return divElement;
    }


    function drawFoodAndSnake(){
        gameArena.innerHTML =''; //clear the entire game arena
        //wipe out eveyrthing and redraw with new positions

        snake.forEach((snakeCell)=>{
            const snakeElement  = drawDiv(snakeCell.x,snakeCell.y,'snake');
            gameArena.appendChild(snakeElement);

        })

        const foodElement  = drawDiv(food.x,food.y,'food');
        gameArena.appendChild(foodElement);
    }

    function gameOver(){ 
        if(snake[0].x > 560 || snake[0].y > (arenaSize-(snake.length*cellSize)-40)){
            clearInterval(setId); 
            // gameArena.innerHTML = '';
        }
        else if(snake[0].y < 20 || snake[0].x < 20 ){
            clearInterval(setId);     
            // gameArena.innerHTML = '';
            // initiateGame();
        }
    }

    function gameLoop(){
       
        let setId =  setInterval(()=>{
            gameOver();
            updateSnake();
            drawFoodAndSnake();
        },200);   
    }

    function runGame(){
        if(!gameStarted){
            gameStarted = true;
            document.addEventListener('keydown',changeDirection);
            gameLoop(); 
        }

    }

    function initiateGame(){
        const scoreBoard = document.createElement('div');
        scoreBoard.id = 'score-board';

        const highScoreBoard = document.createElement('div');
        highScoreBoard.id = 'high-score';

        document.body.insertBefore(highScoreBoard,gameArena);
        

        document.body.insertBefore(scoreBoard,gameArena); // insert scoreboard before gameArena div

        const startButton = document.createElement('button');
        startButton.textContent = 'Start Game';
        startButton.classList.add('start-button');

        startButton.addEventListener('click', function startGame(){
            startButton.style.display = 'none';

            runGame();

        })

        document.body.appendChild(startButton);
        // document.body.appendChild(highScoreBoard);
    }

    initiateGame();

});