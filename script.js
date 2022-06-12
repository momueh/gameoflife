//HTML ELEMENTS

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const nextButton = document.getElementById('nextButton');
const startButton = document.getElementById('startButton');
const fasterButton = document.getElementById('fasterButton');
const slowerButton = document.getElementById('slowerButton');
const randomButton = document.getElementById('randomButton');
const clearButton = document.getElementById('clearButton');

const selectInput = document.getElementById('selectInput');
const bornInput = document.getElementById('bornInput');
const surviveInput = document.getElementById('surviveInput');

const population = document.getElementById('population');
const generation = document.getElementById('generation');

//Colors

const livingColor = '#000050';
const deadColor = 'F0F0F0';
const killColor = '#DFDAF0';
const bornColor = '#FF0040';
const buttonActiveColor = '#CCC';
const buttonInactiveColor = '#707080';

//Scale

const scale = 8; //size of cell
const cols = Math.floor(canvas.width / scale);
const rows = Math.floor(canvas.height / scale);

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = deadColor;
    this.living = false;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x * scale + 1,
      this.y * scale + 1,
      scale - 1,
      scale - 1
    );
  }
  kill() {
    if (this.living) {
      this.living = false;
      this.color = killColor;
      population.textContent--;
    }
  }
  born() {
    if (!this.living) {
      this.living = true;
      this.color = bornColor;
      population.textContent++;
    }
  }
  swap() {
    if (this.living) {
      this.kill();
    } else {
      this.born();
    }
  }
}

//Helper
function makeCellArray(m, n) {
  let array = new Array(m);
  for (let i = 0; i < m; i++) {
    array[i] = new Array(n);
    for (let j = 0; j < n; j++) {
      array[i][j] = new Cell(i, j);
    }
  }
  return array;
}

// Game Class

class Game {
  constructor(bornRule, surviveRule) {
    this.array = makeCellArray(cols, rows);

    this.bornRule = bornRule;
    this.surviveRule = surviveRule;

    this.running = false;

    this.presets = [];

    this.xcenter = Math.floor(cols / 2);
    this.ycenter = Math.floor(rows / 2);

    this.wait = 30; //in ms

    canvas.addEventListener('mousedown', this.drawPixel.bind(this));

    startButton.onclick = this.startstop.bind(this);
    fasterButton.onclick = this.faster.bind(this);
    slowerButton.onclick = this.slower.bind(this);
    nextButton.onclick = this.next.bind(this);
    clearButton.onclick = this.clear.bind(this);
    randomButton.onclick = this.randomize.bind(this);
    selectInput.onclick = this.presetSelector.bind(this);
    bornInput.oninput = this.changeBornRule.bind(this);
    surviveInput.oninput = this.changeSurviveRule.bind(this);
  }

  //input Methoden

  start() {
    this.running = true;
    startButton.value = 'Pause';
    nextButton.style.color = buttonInactiveColor;
    bornInput.disabled = true;
    surviveInput.disabled = true;

    requestAnimationFrame(this.gameloop.bind(this));
  }
  stop() {
    this.running = false;
    startButton.value = 'Start';
    nextButton.style.color = buttonActiveColor;
    bornInput.disabled = false;
    surviveInput.disabled = false;
  }
  startstop() {
    if (this.running) {
      this.stop();
    } else {
      this.start();
    }
  }
  drawPixel(e) {
    if (this.running == false) {
      let x = e.clientX - canvas.offsetLeft;
      let y = e.clientY - canvas.offsetTop;
      let i = Math.floor(x / scale);
      let j = Math.floor(y / scale);
      if (i >= 0 && i < cols && j >= 0 && j < rows) {
        let cell = this.array[i][j];
        cell.swap();
        cell.draw();
      }
    }
  }
  faster() {
    this.wait = Math.max(0, this.wait - 20);
    if (this.wait == 0) {
      fasterButton.style.color = buttonInactiveColor;
    }
  }
  slower() {
    if (this.wait == 0) {
      fasterButton.style.color = buttonActiveColor;
    }
    this.wait += 20;
  }
  clear() {
    this.stop();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.array.forEach((col) =>
      col.forEach((cell) => {
        cell.kill();
        cell.color = deadColor;
      })
    );

    population.textContent = '0';
    generation.textContent = '0';

    this.draw();
  }

  randomize() {
    this.clear();
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let cell = this.array[i][j];
        let random = Math.floor(2 * Math.random());
        if (random == 0) {
          cell.kill();
        } else {
          cell.born();
        }
      }
    }
    this.draw();
  }
  changeBornRule() {
    this.bornRule = bornInput.value.split('').map((x) => parseInt(x));
  }

  changeSurviveRule() {
    this.surviveRule = surviveInput.value
      .split('')
      .map((x) => parseInt(x));
  }

  presetSelector() {
    let index = selectInput.selectdIndex;
    let preset = this.presets[index];
    preset.draw(this);
  }

  //draw methods
  draw() {
    this.array.forEach((col) => col.forEach((cell) => cell.draw()));
  }

  //next function
  next() {
    let bornList = [];
    let killList = [];

    for (let i = 0; i < cols; i++){
        for (let j = 0; i < rows; j++){
            let cell = this.array[i][j];
            let n = this.neighborNumber([i,j]);

            if (!cell.living && this.bornRule.indexOf(n)>= 0){
                bornList.push(cell);
            }
            else if (cell.living && this.surviveRule.indexOf(n)== -1){
                killList.push(cell);
            }
            else {
                cell.color = cell.living ? livingColor : deadColor;
                cell.draw();
            }
        }
    }
        killList.forEach(cell >= {
            cell.kill();
            cell.draw();
        });

        bornList.forEach(cell >= {
            cell.born();
            cell.draw();
        });

        if (bornList.length == 0 && killList.length == 0){
            this.stop();
            return;
        }

        generation.textContent ++;
    
  }

  neighborNumber(coord){
    return 0;
  }
  livingNeighbors(coord){

  }
  neighbors(coord){
    // coord = [i,j], neighbors: [i+s, j+t], s = -1,0,1 t = -1,0,1.
    let i = coord[0];
    let j = coord[1];
    let list = [];
    let x;
    let y;

    for (let s = -1; s <= 1; s++){
        for (let t = -1; t<= 1; t++){
            if (s != 0 || t != 0) {
                x = i+s;
                y = j+t;
                list.push([x,y]);
            }
        }
    }

    return list;
  }


  //gameloop
  gameloop() {}
}

let game = new Game([3], [2, 3]);
