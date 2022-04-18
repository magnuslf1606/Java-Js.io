let player, bullet = [], enemy = [], particles = []
let colors = ['#ff0000', '#ff0000b3', '#78231eb3', '#57201db3', '#000000']
var timer = 0, timer = 0, moveSpeed = 4, playerReloadSpeed = 60*0.5, enemyReloadSpeed = 60*1.5, bulletSpeed = -8, hp = 3
var playerImg, bulletImg, heart, heart2, backgroundImg, enemiesImg = []
var currentLvl = 1
const w = 500

var startScreen = document.querySelector('#startScreen')
var title = document.querySelector('#title')
var lvl = document.querySelector('#lvl')
var startBtn = document.querySelector('#startBtn')
var lvlSelectBtn = document.querySelector('#lvlSelectBtn')
var lvl1 = document.querySelector('#lvl1')
var lvl2 = document.querySelector('#lvl2')
var lvl3 = document.querySelector('#lvl3')
var lvl4 = document.querySelector('#lvl4')
var lvl5 = document.querySelector('#lvl5')
var back = document.querySelector('#back')

function preload() {
 playerImg = loadImage('Img/player.png')
 bulletImg = loadImage('Img/bullet.png')
 heart = loadImage('Img/heart.png')
 heart2 = loadImage('Img/heart2.png')
 backgroundImg = loadImage('Img/background.png')
 for (let i = 0; i < 5; i++) {
    enemiesImg[i] = loadImage('Img/enemy'+(i+1)+'.png') 
 }
}
function setup() {
  createCanvas(w, w);
  player = new Player(width/2-10, height-32)
  generateLvl(3) //Lager bakgrundsbilet til menyen i starten 
  background(51)
  noLoop() //Gamet starter pauset
  
  }
  
function draw() {
  image(backgroundImg, 0, 0, width, height)
  UI()
  displayAndUpdate()
  shoot(player.pos.x + player.w/2, player.pos.y, bulletSpeed, false, playerReloadSpeed)
  enemyShoot()
  removeBullet()
  collision()
  removeParticles(0.5) //Sekunder
  timer++
}

function shoot(x, y, bulletSpeed, isEnemyBullet, reload) { //Global skyte funksjon som funker både for player og enemy
  if (timer > 0 && timer%reload == 0) {
    bullet.push(new Bullet(x, y, bulletSpeed, isEnemyBullet))
  }
}

function UI() {
  textSize(18)
  fill('#09171e')
  stroke(0)
  text('Level: ' + currentLvl, width - 80, height - 12)
  for (let i = 1; i <= hp; i++) { //Tegner hele hjerter 
    image(heart, 20*i, height - 30, 20, 20)
  }
  if (hp <= 2 && hp >= 1) { //Tegner tomme hjerter motsatt som det over
    for (let i = 3; i >= hp; i--) {
      image(heart2, 20*i, height - 30, 20, 20)
    }
  }
  if (enemy.length <= 0) {
    startScreen.style = "display: flex; justify-content: center;"
    title.innerHTML = 'VICTORY!'
    startBtn.innerHTML = 'Replay Level'
    lvl.innerHTML = 'Level: ' + currentLvl
    lvl.style = "display: flex; justify-content: center;"
    noLoop()
  }
  if (hp == 0) {
    startScreen.style = "display: flex; justify-content: center;"
    title.innerHTML = 'Defeat!'
    startBtn.innerHTML = 'Replay Level'
    lvl.innerHTML = 'Level: ' + currentLvl
    lvl.style = "display: flex; justify-content: center;"
    noLoop()
  }
}

function generateLvl(currentLvl) {
  for (let i = 1; i <= 8; i++) {
    let setHP = currentLvl //Siden man tegner enemy i colonne 1, rad 1 først også col 2 -> col 3. hp på enemy(setHP) minsker hver gang man går ned en kollone. Så den første i raden har høyest verdi(hp) og misnker det med 1 per col
    for (let k = 1; k <= currentLvl; k++) {
      enemy.push(new Enemy(i*35 + 80, k*40-15, setHP, setHP-1))
      setHP-- //Neste col får mindre hp
    }
  }
}

function displayAndUpdate() {
  player.display()
  player.update()
  for (let i = 0; i < enemy.length; i++) {
    if (enemy[i].hp >= 0) {
      fill(colors[enemy[i].hp-1]) //Setter farge utifra hp på enemy
    }
    enemy[i].display()
    enemy[i].update()
  }
  for (var i = 0; i < bullet.length; i++) {
    bullet[i].display()
    bullet[i].update()
  }
  for (let i = 0; i < particles.length; i++) {
    particles[i].display()
    particles[i].update()
    
  }
}

startBtn.addEventListener('click', () => { //Start knapp. resetter alt og starter på current lvl
  bullet = [], enemy = [], particles = [], timer = 0
  player = new Player(width/2-10, height-32)
  currentLvl = 1
  generateLvl(currentLvl)
  startScreen.style = 'display: none'
	loop()
})

lvlSelectBtn.addEventListener('click', () => { //Level selector
  lvl1.style = 'display: flex; justify-content: center; width: 60px; height: 60px; float: left; margin-left: 25px; border-radius: 15px;'
  lvl2.style = 'display: flex; justify-content: center; width: 60px; height: 60px; float: left; margin-left: 25px; border-radius: 15px;'
  lvl3.style = 'display: flex; justify-content: center; width: 60px; height: 60px; float: left; margin-left: 25px; border-radius: 15px;'
  lvl4.style = 'display: flex; justify-content: center; width: 60px; height: 60px; float: left; margin-left: 25px; border-radius: 15px;'
  lvl5.style = 'display: flex; justify-content: center; width: 60px; height: 60px; float: left; margin-left: 25px; border-radius: 15px;'
  back.style = 'display: flex; justify-content: center; float: right; border-radius: 15px;'
  lvlSelectBtn.style = 'display: none'
  lvl.style = 'display: none'
  startBtn.style = 'display: none'
  title.innerHTML = 'Select Level'
})

back.addEventListener('click', () => { //Tilbake knapp fra level selector
	title.innerHTML = 'Alien Invasion'
	title.style = 'display: flex; justify-content: center;'
  lvl1.style = 'display: none'
  lvl2.style = 'display: none'
  lvl3.style = 'display: none'
  lvl4.style = 'display: none'
  lvl5.style = 'display: none'
  back.style = 'display: none'
  startBtn.style = 'display: flex; justify-content: center;'
  lvlSelectBtn.style = 'display: flex; justify-content: center;'
  lvl.style = 'display: flex; justify-content: center;'
})

lvl1.addEventListener('click', () => { //Lvl x knapp. setter current lvl til x
  bullet = [], enemy = [], particles = [], timer = 0
  player = new Player(width/2-10, height-32) //Resetter posisjonen til player
  currentLvl = 1
  hp = 3
  startScreen.style = 'display: none'
  generateLvl(currentLvl) //Lager array med enemies utfra lvl, med hp, hvor mange enemies
	loop()
})

lvl2.addEventListener('click', () => {
  bullet = [], enemy = [], particles = [], timer = 0
  player = new Player(width/2-10, height-32)
  currentLvl = 2
  hp = 3
  startScreen.style = 'display: none'
  generateLvl(currentLvl)
	loop()
})

lvl3.addEventListener('click', () => {
  bullet = [], enemy = [], particles = [], timer = 0
  player = new Player(width/2-10, height-32)
  currentLvl = 3
  hp = 3
  startScreen.style = 'display: none'
  generateLvl(currentLvl)
	loop()
})

lvl4.addEventListener('click', () => {
  bullet = [], enemy = [], particles = [], timer = 0
  player = new Player(width/2-10, height-32)
  currentLvl = 4
  hp = 3
  startScreen.style = 'display: none'
  generateLvl(currentLvl)
	loop()
})

lvl5.addEventListener('click', () => {
  bullet = [], enemy = [], particles = [], timer = 0
  player = new Player(width/2-10, height-32)
  currentLvl = 5
  hp = 3
  startScreen.style = 'display: none'
  generateLvl(currentLvl)
	loop()
})


/*
  TODO:

  [x] Farger particles

  [x] Flere liv på enemy. forskjellige farger for antall liv. når mister liv bytt farge

  [x] Vis hp som hjerter eller ligende istedenfor tekst

  [x] Bullets fra enemy fjernes utenfor skjremn

  [x] Image enemy, player, bullet

  [x] Levels

  [x] Meny

  []


*/