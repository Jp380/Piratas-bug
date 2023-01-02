const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world;
var canvas, angle, tower, ground, cannon;
var backgroundImg;
var cannonball;

var balls = [];

var boat
var boats = [];

var boatNormal = [];
var boatData, boatSprite;

var boatBroken = [];
var brokenboatData, brokenboatSprite;

var isGameOver = false;
var cannonexplosion


function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");

  brokenboatData = loadJSON("assets/boat/broken_boat.json");
  brokenboatSprite = loadImage("assets/boat/broken_boat.png");

  boatData = loadJSON("assets/boat/boat.json");
  boatSprite = loadImage("assets/boat/boat.png");

  cannonexplosion = loadSound("./assets/cannon_explosion.mp3");

}

function setup() {
  canvas = createCanvas(1200,600);
  engine = Engine.create();
  world = engine.world;
  angle = -PI / 4;
  ground = new Ground(0, height - 1, width * 2, 1);
  tower = new Tower(150, 350, 160, 310);
  cannon = new Cannon(180, 110, 100, 50, angle);

  var boatFrames = boatData.frames;
  
  for (var i = 0; i < boatFrames.length; i++) {
    
    var pos = boatFrames[i].position;
    var img = boatSprite.get(pos.x, pos.y, pos.w, pos.h);
    boatNormal.push(img);
  }

  /*var brokenboatFrames = brokenboatData.frames;
  
  for (var i = 0; i < brokenboatFrames.lenght; i++) {

    console.log(i);

  }
  */
}



function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  Engine.update(engine);
  ground.display();
  
  showBoats();

  cannon.display();
  tower.display();


  for(var i = 0; i < balls.length; i++ ) {

     showCannonBalls(balls[i], i);

     for(var j = 0; j < boats.length; j++) {

      if (balls[i] !== undefined && boats[j] !== undefined) {

        var collision = Matter.SAT.collides(balls[i].body, boats[j].body);
        if (collision.collided) {
          
          boats[j].remove(j);
          Matter.World.remove(world, balls[i].body);
          balls.splice(i, 1);
          i--;

        }
        }

      }
     }

    }


function showBoats() {
  
  if (boats.length > 0) {
    
    if (boats.length < 4 && boats[boats.length - 1].body.position.x < width - 300) {
      
      var positions = [-40, -60, -70, -20];
      var position = random(positions);
      boat = new Boat(width, height - 100, 170, 170, position, boatNormal);
      boats.push(boat);
      
    }
      for (var i = 0; i < boats.length; i++) {

        Matter.Body.setVelocity(boats[i].body, {x: -0.9, y: 0});
        boats[i].display();
        boats[i].animate();   
        var collision = Matter.SAT.collides(tower.body, boats[i].body);

        if (collision.collided && !boats[i].isBroken) {

          isGameOver = true;
          gameover(); 

        }  
    
      }
    }
  else {
    
    boat = new Boat(width, height - 100, 200, 200, position, boatNormal);
    boats.push(boat);
    

  }
  
}

function keyReleased() {
  
  if(keyCode === DOWN_ARROW) {

    balls[balls.length - 1].shoot();
    cannonexplosion.play();

  } 
}


function keyPressed() {

  if(keyCode === DOWN_ARROW) {

    cannonball = new CannonBall(cannon.x, cannon.y);
    cannonball.trajectory = [];
    Matter.Body.setAngle(cannonball.body, cannon.angle);
    balls.push(cannonball);

  } 
}

function showCannonBalls(ball, index) {

  ball.display();

  if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {

    Matter.World.remove(world, ball.body);
    balls.splice(index, 1);
    
  }

}

function gameover() {

  swal(
    {
      title: "Fim de jogo!",
      confirmButtonText: "Jogar novamente"
    },
    function(IsConfirm) {
      if (IsConfirm) {

        location.reload();

      }
    }
  );

}
