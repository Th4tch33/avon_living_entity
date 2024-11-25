// GBDA_412_Final_Code.js

let natureCounter = 0;
let prodCounter = 0;
let progCounter = 0;

let bushAsset;
let treeAsset;

let personAsset = [];
let deerAsset = [];
let swanAsset = [];

let factoryAsset;
let smokeAsset;

let houseAsset;
let cityhallAsset;
let storefrontAsset;

let occupancyGrid = [];

let swan = [];
let deer = [];

let nature = []; 
let factory = [];
let settlement = [];

function preload() {
  swanAsset[0] = loadImage("swan_water.png");
  swanAsset[1] = loadImage("swan_air.png");
  
  deerAsset[0] = loadImage("deer_stand.png");
  deerAsset[1] = loadImage("deer_eat.png");
  deerAsset[2] = loadImage("deer_jump.png");
  
  bushAsset = loadImage("bush.png");
  treeAsset = loadImage("tree.png");
  
  factoryAsset = loadImage("factory.png");
  smokeAsset = loadImage("smoke.png");
  
  houseAsset = loadImage("house.png");
  cityhallAsset = loadImage("cityhall.png");
  storefrontAsset = loadImage("storefront.png");
  
  personAsset[0] = loadImage("person_standing.png");
  personAsset[1] = loadImage("person_running.png");
  personAsset[2] = loadImage("person_log01.png");
  personAsset[3] = loadImage("person_log02.png");
  personAsset[4] = loadImage("person_standing_water.png");
  personAsset[5] = loadImage("person_running_water.png");
  personAsset[6] = loadImage("person_log01_water.png");
  personAsset[7] = loadImage("person_log02_water.png");
  
}

//!Program
function setup(){
  createCanvas(1440, 810);
  //fullScreen();
  frameRate(60);

  for(let i = 0; i < width * height; i++){
    occupancyGrid[i] = false;
  }

  setTraversableArea();
}

function draw() {
  background(198, 156, 114);
  
  noStroke();
  fill(52, 228, 234);
  rect(0, height / 2 - height / 8, width, height / 4);
  
  //image(cleanRiverAsset, width / 2, height / 2, width, height);
  
  //regionVisualizer();
  let removelist = [];
  /*
  deer.forEach(function(element, index, array) {
    deer.display();
    deer.movementManager();
  });*/

  swan.forEach(function(element, index, array) {    
    element.display();
    element.movementManager();
  });

  deer.forEach(function(element, index, array) {    
    element.display();
    element.movementManager();
  });

  /*
  for(building nature : nature) {
    nature.display();
    
    if(!nature.state && !nature.animating) {
      removelist.push(nature);
    }
  }

  for(building factory : factory) {
    factory.display();
  }
  
  for(building settlement : settlement) {
    settlement.display();
  }

  for(building item : removelist) {
    nature.remove(item);
  }
  */
  
  scoreScreen();
}

function scoreScreen() {
  fill(255);
  textSize(15);
  text("Nature: " + natureCounter, 50, 50);
  text("Prod: " + prodCounter, 50, 100);
  text("Prog: " + progCounter, 50, 150);
}

function keyPressed () {
  if(key == 'z' || key == 'Z') {
    //spawnNature();
    spawnDeer();
    spawnSwan();
  }
  else if(key == 'x' || key == 'X') {
    //spawnFactory();
  }
  else if(key == 'c' || key == 'C') {
    //spawnSettlement();
  }
}

//!Initialization
function setTraversableArea() {
  for(let i = 0; i < width; i++) {
    for(let n = height / 2 - height / 8; n < height / 2 - height / 8 + height / 4; n++) {
      let index = n * width + i;
      
      occupancyGrid[index] = true;
    }
  }
}

function animalCheckManager(animalArray, i) {
  if (animalArray[i].animalType == 1) {    
    while(isTraversable(Math.round(animalArray[i].pos.x), Math.round(animalArray[i].pos.y))) {   
      animalArray[i].pos.x = random(width);
      animalArray[i].pos.y = random(height);
    }
  }
  else {
    while(!isTraversable(Math.round(animalArray[i].pos.x), Math.round(animalArray[i].pos.y))) {   
      animalArray[i].pos.x = random(width);
      animalArray[i].pos.y = random(height);
    }
  }
}

//!Debug
function regionVisualizer() {
  stroke(0);
  strokeWeight(1);
  
  for(let i = 0; i < width; i += 10) {
    for(let n = 0; n < height; n += 10) {
      if (isTraversable(i, n)) {
        fill(0,255,0);
        rect(i, n, 10, 10);
      }
      else {
        fill(255,0,0);
        rect(i, n, 10, 10);
      }
    }
  }
}


//!Checks
function isTraversable(col, row) {
  let index = row * width + col;

  return !occupancyGrid[index]; // Returns true if bit is 0 (traversable)
}

/*
function buildingRangeCheckManager(array, index) {
  for(let i = 0; i < array.createCanvas(); i++) {
    
    while((!isTraversable(Math.round(array.get(i).pos.x), Math.round(array.get(i).pos.y)) || buildingRangeCheck(array, index)) || array.get(i).xBoundaryTest() || array.get(i).yBoundaryTest()) {     
      array.get(index).pos.x = random(width);
      array.get(index).pos.y = random(height);
    }
    
    if(array.get(index).buildingType == 1) {
      array.get(index).smokePos.x = array.get(index).pos.x;
      array.get(index).smokePos.y = array.get(index).pos.y;
    }
  }
}

let buildingRangeCheck(building array, let currentBuilding) {
  let inRange = false;

  for(let i = 0; i < array.createCanvas(); i++) {
    if(currentBuilding != i) {
      
      let dist = sqrt(pow(array.get(i).pos.x - array.get(currentBuilding).pos.x, 2) + pow(array.get(i).pos.y - array.get(currentBuilding).pos.y, 2));
      
      if(dist <= array.get(currentBuilding).closeness) {
        inRange = true;
        
        break;
      }
    }
  }
  
  return inRange;
}
  
function spawnFactory() {
  let size = 250;
  
  factory.push(
    building(
    1,
    p5.Vector(random(width), random(height)), // Position of the building
    size,                                       // Size of the building image (width and height of the rendered image).
    factoryAsset,                               // The image asset representing the building visually.
    p5.Vector(0, 0),                          // Position of the smoke effect
    random(0.5, 1),                             // Smoke Speed
    random(70, 100),                            // Smoke Height
    size * 2, true));                                  // Proximity to Identical Buildings
  
  buildingRangeCheckManager(factory, factory.createCanvas() - 1);
  
  allEntities.push(factory.get(factory.createCanvas() - 1));
}

function spawnNature() {
  let size = 55;
  
  PImage asset = bushAsset;
    
    let natureAsset = (int) random(1, 4);
    
    if(natureAsset == 2 || natureAsset == 3) {
      asset = treeAsset;
      size = 125;
    }
  
  nature.push(
    building(
      0,
      p5.Vector(random(width), random(height)), // Position of the building
      size,                                       // Size of the building image (width and height of the rendered image).
      asset,                                      // The image asset representing the building visually.
      p5.Vector(0, 0),                          // Position of the smoke effect
      random(0.5, 1),                             // Smoke Speed
      random(50, 80),                             // Smoke Height
      size / 2, true));                                      // Proximity to Identical Buildings);
  
  buildingRangeCheckManager(nature, nature.createCanvas() - 1);
  
  allEntities.push(nature.get(nature.createCanvas() - 1));
}

function spawnSettlement() {
  let size = 95;
  
  PImage asset;
  let settlementAsset = (int) random(1, 3);
  
  if(settlement.createCanvas() == 0) {
    asset = cityhallAsset;
    size = 140;
  }
  else {
    if(settlementAsset == 1) {
      asset = houseAsset;
    }
    else {
      asset = storefrontAsset;
    }
  }
  
  settlement.push(
    building(
      2,
      p5.Vector(random(width), random(height)), // Position of the building
      size,                                       // Size of the building image (width and height of the rendered image).
      asset,                                      // The image asset representing the building visually.
      p5.Vector(0, 0),                          // Position of the smoke effect
      random(0.5, 1),                             // Smoke Speed
      random(50, 80),                             // Smoke Height
      size * 1.5, true));                                      // Proximity to Identical Buildings);
  
  buildingRangeCheckManager(settlement, settlement.createCanvas() - 1);
  
  allEntities.push(settlement.get(settlement.createCanvas() - 1));
}
*/
function spawnSwan() {
  let size = 55;
  
  swan.push(
    new animal(
      createVector(random(width), random(height)), // Position of the animal (initial location in the middle of the screen)
      createVector(0, 0),         // Transformed position (starting offset position for movement calculations)
      createVector(0, 0),                  // New target location for the animal to move towards
      parseInt(random(15, 60)),                // Wait time (randomly assigned between 15 and 60) before moving again
      0,                                  // Initial wait timer (counts down to zero to control waiting state)
      1,                                  // Animation type (used for specifying animation behavior or type if needed)
      false,                              // Moving state (let to indicate if the animal is currently moving)
      parseInt(random(90, 120)),                // Speed (controls how fast the animal moves towards the target)
      parseInt(random(size * 0.8, size)),                               // Size (the size of the animal in pixels, used for display)
      500,                                // Range (defines the movement range within which the animal can roam)
      swanAsset,                            // Asset (image to represent the animal visually)
      false,
      0
    )
  );

  animalCheckManager(swan, swan.length - 1);
}

function spawnDeer() {
  let size = 80;
  
  deer.push(
    new animal(
      createVector(random(width), random(height)), // Position of the animal (initial location in the middle of the screen)
      createVector(0, 0),                       // Transformed position (starting offset position for movement calculations)
      createVector(0, 0),                  // New target location for the animal to move towards
      int(random(15, 60)),                // Wait time (randomly assigned between 15 and 60) before moving again
      0,                                  // Initial wait timer (counts down to zero to control waiting state)
      0,                                  // Animation type (used for specifying animation behavior or type if needed)
      false,                              // Moving state (let to indicate if the animal is currently moving)
      int(random(40, 70)),                // Speed (controls how fast the animal moves towards the target)
      int(random(size * 0.8, size)),                               // Size (the size of the animal in pixels, used for display)
      250,                                // Range (defines the movement range within which the animal can roam)
      deerAsset,                            // Asset (image to represent the animal visually)
      false,
      0
    ));
    
    animalCheckManager(deer, deer.length - 1);
}

/*
function spawnPerson(let x, let y, person personArray, let personType) {
  let size = 50;
  
  personArray.push(
    person(
      p5.Vector(x, y), // Position of the animal (initial location in the middle of the screen)
      p5.Vector(0, 0),                  // New target location for the animal to move towards
      int(random(15, 60)),                // Wait time (randomly assigned between 15 and 60) before moving again
      0,                                  // Initial wait timer (counts down to zero to control waiting state)
      personType,                                  // Animation type (used for specifying animation behavior or type if needed)
      false,                              // Moving state (let to indicate if the animal is currently moving)
      int(random(2, 4)),                // Speed (controls how fast the animal moves towards the target)
      int(random(size * 0.8, size)),                               // Size (the size of the animal in pixels, used for display)
      250,                                // Range (defines the movement range within which the animal can roam)
      personAsset,                            // Asset (image to represent the animal visually)
      false,
      false
    )
  );
}
*/

/*
function animationManager(Person person) {
  if();
}

function animationManager(Animal animal) {
  if();
}*/

/*
function animationManager(building building) {   
  if(building.state){
    spawnAnimation(building);
  }
  else if(!building.state) {
    deathAnimation(building);
  }
}

let spawnAnimation(building building) {
  // Calculate the easing based on time and apply backout easing
  if (building.animating) {
    building.currentTime += 1.0 / frameRate;  // Increment time based on frame rate
    
    if (building.currentTime  building.easingDuration) {
      building.currentTime = building.easingDuration;  // Cap time at the easing duration
      building.animating = false;  // Stop animating once we reach the target time
    } 

    // Calculate the backout easing value (backout(t))
    building.scaleFactor = backOut(building.currentTime / building.easingDuration);
  }

  return building.scaleFactor;
}

let deathAnimation(building building) {
  // Calculate the easing based on time and apply backout easing    
  if (building.animating) {
    
    building.currentTime -= 1.0 / frameRate;  // Increment time based on frame rate
    
    if (building.currentTime < 0) {
      building.currentTime = 0;  // Cap time at the easing duration
      building.animating = false;  // Stop animating once we reach the target time
    } 

    // Calculate the backout easing value (backout(t))
    building.scaleFactor = backOut(building.currentTime / building.easingDuration);
  }

  return building.scaleFactor;
}

// Backout easing function
let backOut(let t) {
  let s = 1.70158;  // Overshoot value (you can tweak this for more/less overshoot)
  return (--t) * t * ((s + 1) * t + s) + 1;
}

*/

/*
Final Features:
1. River Progress score
2. Entity Interaction
3. All entities sorting system

We no longer need an entity management system because each entity should manage itself like an ecosystem.
The concept of this project is a living entity/ecosystem.

RIVER PROGRESS SCORE (RPS)

Components:
N = Nature
F = Factories
S = Settlements

RPS = 100 = N + F + S = 40 + 20 + 40

Nature requires 3 presses

  Deer are a 1:2 with N
  Swans are 1:4 with N

Factory unlocks at minimum 10 N
  Factory needs to produce 1 tech per 20 sec
  
Settlement needs 10 tech to be built
  Settlement needs 1 tech per 20 sec
*/

class animal {  
  
  assetTracker = 0;
  
  scaleFactor = 0;  // Scale factor for the rectangle
  targetScale = 1;  // Final scale size
  easingDuration = 0.35;  // Duration of the easing animation (in seconds)
  currentTime = 0;  // Time tracker for the animation
  animating = true;  // Flag to track if the animation is running

  //animType 0 = deer 1 = swan
  constructor(pos, transPos, newLocation, waitTime, waitTimer, animalType, moving, speed, size, range, asset, direction, animationType) {
    
    // pos, transPos, newLocation = vectors
    
    this.pos = pos;
    this.transPos = transPos;
    this.newLocation = newLocation;
    this.waitTime = waitTime;
    this.waitTimer = waitTimer;
    this.animalType = animalType;
    this.moving = moving;
    this.speed = speed;
    this.range = range;
    this.size = size;
    this.asset = asset;
    this.direction = direction;
    this.animationType = animationType;
  }

  newLocationFinder() {

    if (!this.moving && this.waitTimer == 0) {
      this.moving = true;

        // Generate a random location
        this.newLocation.x = random(-this.range / 2, this.range / 2);
        this.newLocation.y = random(-this.range / 2, this.range / 2);

        if(this.animalType == 0) {
          // Adjust while loop to only keep generating if out of bounds or not traversable

          while (this.xBoundaryTest() || this.yBoundaryTest() || !isTraversable(Math.round(this.newLocation.x + this.pos.x), Math.round(this.newLocation.y + this.pos.y))) {           

            this.newLocation.x = random(-this.range / 2, this.range / 2);
            this.newLocation.y = random(-this.range / 2, this.range / 2);
          }
        }
        else {
          while (this.xBoundaryTest() || this.yBoundaryTest() || isTraversable(Math.round(this.newLocation.x + this.pos.x), Math.
          round(this.newLocation.y + this.pos.y))) {  
            this.newLocation.x = random(-this.range / 2, this.range / 2);
            this.newLocation.y = random(-this.range / 2, this.range / 2);
          }
        }
    } else if (!this.moving && this.waitTimer > 0) {
      this.waitTimer--;
        
      this.assetTracker = 0;
    }
  }

  xBoundaryTest() {
    return this.pos.x + this.newLocation.x < 0 || this.pos.x + this.newLocation.x > width;
  }
  
  yBoundaryTest() {
    return this.pos.y + this.newLocation.y < height * 0.1 || this.pos.y + this.newLocation.y > height;
  }

  movementManager() {
    if(this.animalType == 0) {
      this.jump();  
    }
    else {
      this.walk();
    }
  }
  
  walk() {
    this.newLocationFinder();

    if(this.moving == true) {  
      
      let loopIncrementx = this.newLocation.x / this.speed;
      let loopIncrementy = this.newLocation.y / this.speed;
      
      if(loopIncrementx > 0) {
        this.direction = false;
      }
      else {
        this.direction = true;
      }
      
      this.transPos.x += loopIncrementx;
      this.transPos.y += loopIncrementy;
      
      if(loopIncrementx < 0 && this.transPos.x + this.pos.x < this.newLocation.x + this.pos.x) {
        this.moving = false;
        this.waitTimer = this.waitTime;
        
        this.pos.x += this.newLocation.x;
        this.pos.y += this.newLocation.y;
        
        this.newLocation.x = 0;
        this.newLocation.y = 0;
        
        this.transPos.x = 0;
        this.transPos.y = 0;
        
        this.assetTracker = 0;
      }
      else if(loopIncrementx > 0 && this.transPos.x + this.pos.x > this.newLocation.x + this.pos.x) {
        this.moving = false;
        this.waitTimer = this.waitTime;
        
        this.pos.x += this.newLocation.x;
        this.pos.y += this.newLocation.y;
        
        this.newLocation.x = 0;
        this.newLocation.y = 0;
        
        this.transPos.x = 0;
        this.transPos.y = 0;
        
        this.assetTracker = 0;
      }
    }
  }

  jump() {
    this.assetTracker = 2;
    
    let a;
    let b;
    
    this.newLocationFinder();

    a = 2 / abs(this.newLocation.x);
    b = this.newLocation.y / this.newLocation.x - a * this.newLocation.x;
    
    if(this.moving == true) {  
      
      let loopIncrement = this.newLocation.x / this.speed;
      
      if(loopIncrement > 0) {
        this.direction = false;
      }
      else {
        this.direction = true;
      }
      
      this.transPos.x += loopIncrement;      
      this.transPos.y = a * pow(this.transPos.x , 2) + b * this.transPos.x;
      
      if(loopIncrement < 0 && this.transPos.x + this.pos.x < this.newLocation.x + this.pos.x) {
        this.moving = false;
        this.waitTimer = this.waitTime;
        
        this.pos.x += this.newLocation.x;
        this.pos.y += this.newLocation.y;
        
        this.newLocation.x = 0;
        this.newLocation.y = 0;
        
        this.transPos.x = 0;
        this.transPos.y = 0;
      }
      else if(loopIncrement > 0 && this.transPos.x + this.pos.x > this.newLocation.x + this.pos.x) {
        this.moving = false;
        this.waitTimer = this.waitTime;
        
        this.pos.x += this.newLocation.x;
        this.pos.y += this.newLocation.y;
        
        this.newLocation.x = 0;
        this.newLocation.y = 0;
        
        this.transPos.x = 0;
        this.transPos.y = 0;
      }
    }
  }

  spawnAnimation() {
    // Calculate the easing based on time and apply backout easing
    if (this.animating) {
      this.currentTime += 1.0 / frameRate();  // Increment time based on frame rate
      
      if (this.currentTime > this.easingDuration) {
        this.currentTime = this.easingDuration;  // Cap time at the easing duration
        this.animating = false;  // Stop animating once we reach the target time
      } 
  
      // Calculate the backout easing value (backout(t))
      this.scaleFactor = this.backOut(this.currentTime / this.easingDuration);
    }
  
    return this.scaleFactor;
  }
  
  // Backout easing function
  backOut(t) {
    let s = 1.70158;  // Overshoot value (you can tweak this for more/less overshoot)
    return (--t) * t * ((s + 1) * t + s) + 1;
  }

  display() {
      let scaleFactor = this.spawnAnimation();
      let scaledSize = this.size * scaleFactor;

      // Push the current matrix onto the stack
      push();
  
        // Move the origin to the position of the animal before scaling
        translate(this.transPos.x + this.pos.x, this.transPos.y + this.pos.y);
    
        // Flip the image horizontally if the direction is false
        if(this.direction == false) {
            scale(-1, 1);
        }

        // Draw the image centered at the origin
        image(this.asset[this.assetTracker], -scaledSize / 2, -scaledSize, scaledSize, scaledSize); // Centering 
  
      // Pop the matrix to return to the previous state
      pop();
  }

  movementVisualizer() {
    strokeWeight(4);
    stroke(0);
    
    point(pos.x + newLocation.x, pos.y + newLocation.y);
    
    let a = 2 / abs(newLocation.x);
    let b = newLocation.y / newLocation.x - a * newLocation.x;
    
    let loopIncrement = 0.1;
    
    if(newLocation.x > 0) {
      for(let i = 0; i < newLocation.x; i += loopIncrement) {
        let y = a * pow(i, 2) + b * i;
        
        strokeWeight(1);
        stroke(0, 0, 255);
        point(i + pos.x, y + pos.y);
      }
    }
    else {
      for(let i = 0; i > newLocation.x; i -= loopIncrement) {
        let y = a * pow(i, 2) + b * i;
        
        strokeWeight(1);
        stroke(0, 0, 255);
        point(i + pos.x, y + pos.y);
      }
    }
    
    strokeWeight(2);
    stroke(0);
    noFill();
    rect(transPos.x + pos.x - size / 2 , transPos.y + pos.y - size / 2 , size, size);
  }
}