class Bullet {
  constructor(x, y, vel, skuttFra) {
    this.x = x
    this.y = y
    this.vel = vel //Hvis den er over 8 så crasher det?!?!?!?!?!??!? 
    this.r = 4
    this.isEnemyBullet = skuttFra
  } 
  display() {
    fill(255)
    image(bulletImg, this.x, this.y, this.r*2, this.r*2)
  }
  update() {
    this.y += this.vel
  }
}

function collision() {
  for (let i = bullet.length-1; i >= 0; i--) {
    for (let j = enemy.length-1; j >= 0; j--) {
      if (bullet[i].y < enemy[j].pos.y + enemy[j].h && bullet[i].y > enemy[j].pos.y && bullet[i].x + bullet[i].r*2 > enemy[j].pos.x && bullet[i].x - bullet[i].r*2 < enemy[j].pos.x + enemy[j].w && !bullet[i].isEnemyBullet) { //Sjekket om spiller treffer enemy
        //Når enemy skutt skjer:
        addParticles(bullet[i].x, bullet[i].y, colors[enemy[j].hp-1], timer) //Pos for hvor skal tegnes, farge og tid den ble laget
        enemy[j].hp -= 1 //Når truffet -1 hp
        if(enemy[j].hp <= 0) {
          if(j >= 1) { //Flytter erNederst til den som er over når enemy dør og forhindrer at jeg får negativ index med if. her er j collonen med enemies
            enemy[j-1].erNederst = true
          }
          enemy.splice(j, 1)
        }
        if(bullet[i]) { //forhindrer at jeg prøver å splice samme bullet to ganger
          bullet.splice(i, 1) //Bullet fjernes uansett når den treffer noe
        }
      }
      if (bullet[i].y - 7 > player.pos.y && bullet[i].y < player.pos.y + 15 && bullet[i].x > player.pos.x && bullet[i].x < player.pos.x + player.w && bullet[i].isEnemyBullet) { //Sjekker om enemy treffer spiller
        hp--
        bullet.splice(i, 1)
      }
    }
  }
}
//Se etter hvor jeg la inn at bullet skal se etter kollsiojn når den er større enn player.pos.y
function removeBullet() { //Fjerner når bullet er offscreen. sparer minne
  for (let i = 0; i < bullet.length; i++) {
    if (bullet[i].y < - bullet[i].r*2) {
      bullet.splice(i, 1)
    }
    if (bullet[i].y > height - bullet[i].r*2) {
      bullet.splice(i ,1)
    }
  }
}