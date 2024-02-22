document.addEventListener('DOMContentLoaded', () =>  {

const starBtn = document.querySelector('button')
const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('.score-display');
const linesDisplay = document.querySelector('.lines-display');
const displaySquares = document.querySelectorAll('.previous-grid div')
let squares = Array.from(grid.querySelectorAll('div'));
const width = 10;
const height = 20;
let currentPosition = 4;
let currentIndex = 0;
let timerId 
let score = 0
let lines = 0 

/* Controles flechitas */
  function control(e){
    if(e.keyCode === 39){
        moveRight()
    }   else if (e.keyCode === 38){
        rotate()
    }   else if (e.keyCode === 37){
        moveLeft()
    }   else if (e.keyCode === 40){
        moveDown()
    }
  }

  document.addEventListener('keyup', control);


//The tetrominoes piezas
  const  lTetrominoes = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width+1, width*2, width*2+1, width*2+2],
  ]
  const  zTetrominoes = [
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1]
  ]
  const  tTetrominoes = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
  ]
  const  oTetrominoes = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
  ]
  const  iTetrominoes = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
  ]

const theTetrominoes = [lTetrominoes, zTetrominoes, tTetrominoes, oTetrominoes, iTetrominoes];


//Ramdonly 
let random = Math.floor(Math.random()*theTetrominoes.length)
let currentRotation = 0
let current = theTetrominoes[random][currentRotation]


// draw
function draw() {
    // Draw the current tetromino
    current.forEach(index => (
      squares[currentPosition + index].classList.add('block')
    ));
  
    // Draw the small tetromino for display
    smallTetrominoes[0].forEach(index => (
      squares[displayIndex + index].classList.add('display-block')
    ));
  }
  
  function undraw() {
    current.forEach(index => (
      squares[currentPosition + index].classList.remove('block')
    ));
  
    smallTetrominoes[0].forEach(index => (
      squares[displayIndex + index].classList.remove('display-block')
    ));
  }
  
  function moveDown() {
    undraw()
    currentPosition = currentPosition+= width; // Use the height constant instead of width
    draw()
    freeze()
  }
  
// move left  and prevent collisions with shapes moving left
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
    if (!isAtRightEdge) currentPosition += 1
    if (current.some(index => squares[currentPosition + index].classList.contains('block2'))){
        currentPosition -=1
    }
    draw()
  }

  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if(!isAtLeftEdge) currentPosition -=1
    if (current.some(index => squares[currentPosition + index].classList.contains('block2'))){
        currentPosition +=1
    }
    draw()
  }

// rotate
 function rotate(){
    undraw()
    currentRotation ++
    if(currentRotation === current.length){
        currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    draw()
  };
  /* detener en parte baja */
 function freeze(){
  if (current.some(index => squares[currentPosition + index + width].classList.contains('block3') 
  || squares[currentPosition + index + width].classList.contains('block2'))) {
    // make it block2
    current.forEach(index => squares[index + currentPosition].classList.add('block2'))
    random = nextRandom
    nextRandom = Math.floor(Math.random() * theTetrominoes.length)
    current = theTetrominoes[random][currentRotation]
    currentPosition = 4
    draw()
    displayShape() 
    addScore()
    gameOver()
 }}



 starBtn.addEventListener('click', () => {
  if(timerId){
    clearInterval(timerId)
    timerId= null
  } else {
    draw()
    timerId = setInterval(moveDown, 1000)
    nextRandom = Math.floor(Math.random()*theTetrominoes.length)
    displayShape()
    gameOver()
    addScore()
    document.getElementById('mensaje').innerText = mensaje();
  }
 })

  const displayWidth = 4;
  const displayIndex = 0;

  function gameOver(){
    if (current.some(index => squares[currentPosition + index].classList.contains('block2'))){
        scoreDisplay.innerHTML = 'end'
        clearInterval(timerId)
    }
  }
  /* visor pequeño de la pieza que sigue a continuacion */
  const smallTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], /* l Tetromino*/
    [0, displayWidth, displayWidth+1, displayWidth*2+1], /* z Tetromino*/
    [1, displayWidth, displayWidth+1, displayWidth+2], /* t Tetromino*/
    [0, 1, displayWidth, displayWidth+1], /* o Tretomino */
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] /* i Tetromino */
  ];

  function displayShape () {
    displaySquares.forEach(square => {
      square.classList.remove('block')
    });
    nextRandom = Math.floor(Math.random()*theTetrominoes.length)
    smallTetrominoes[nextRandom].forEach (
      index => {
        displaySquares[displayIndex + index].classList.add('block')
      })
  }
  /*Elimina lineas completas, suma puntos y cantidad de lineas completadas*/
  function addScore(){
    for (currentIndex = 0; currentIndex < 199; currentIndex += width){
      const row = [ currentIndex, currentIndex+1, currentIndex+2, currentIndex+3, currentIndex+4, 
      currentIndex+5, currentIndex+6, currentIndex+7, currentIndex+8, currentIndex+9]

      if (row.every(index => squares[index].classList.contains('block2'))) {
        score += 10;
        lines += 1;
        scoreDisplay.innerHTML = score
        linesDisplay.innerHTML = lines
        row.forEach(index => {
          squares[index].classList.remove('block2');
          squares[index].classList.remove('block');
        });
        

        const squaresRemoved = squares.splice(currentIndex, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
        document.getElementById('mensaje').innerText = mensaje();
      }
    }
  }

  const atexto = ["Lo estas haciendo genial😲"];
  const btexto = ["¡Impresionante! 🤩"];
  const ctexto = ["¡Increíble! 😎"];

  const textos = [atexto, btexto, ctexto];

  function mensaje() {
    let aleat = 0;
    if (score >= 10) {
      console.log("hola")
      aleat = Math.floor(Math.random() * textos.length);
      return textos[aleat];
    }
  return "...";
  }
  
displayShape()

});