const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world;
var canvas, angle, tower, ground, cannon;

var cannonball;

var balls = [];

var boat, boats = [];

var boatNormal = [];
var boatData, boatSprite;

var boatBroken = [];
var brokenboatData, brokenboatSprite;


function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");

  brokenboatData = loadJSON("./assets/boat/broken_boat.json");
  brokenboatSprite = loadImage("./assets/boat/broken_boat.png");

  boatData = loadJSON("./assets/boat/boat.json");
  boatSprite = loadImage("./assets/boat/boat.png");


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

  for (var i = 0; i < boatFrames.lenght; i++) {

    var pos = boatFrames[i].position;
    var img = boatSprite.get(pos.x, pos.y, pos.w, pos.h);
    boatNormal.push(img);

  }

  var brokenboatFrames = brokenboatData.frames;

  for (var i = 0; i < brokenboatFrames.lenght; i++) {

    var pos = brokenboatFrames[i].position;
    var img = brokenboatSprite.get(pos.x, pos.y, pos.w, pos.h);
    boatBroken.push(img);

  }
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

  }
}

function showBoats() {

  if (boats.length > 0) {
    if (boats.length < 4 && boats[boats.length - 1].body.position.x < width - 300) {

      var positions = [-130, -100, -120, -80];
      var position = random(positions);
      boat = new Boat(width, height - 100, 200, 200, position, boatNormal);
      boats.push(boat);
    }
      for (var i = 0; i < boats.length; i++) {

        Matter.Body.setVelocity(boats[i].body, {x: -0.9, y: 0});
        boats[i].animate();
        boats[i].display();
    
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

  } 
}


function keyPressed() {

  if(keyCode === DOWN_ARROW) {

    cannonball = new CannonBall(cannon.x, cannon.y);
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
