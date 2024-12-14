// GBDA_412_Final_Code.js
let shared;

let regionVisualizerScreen = false;

let totalTechPoints = 0;

let bushAsset;
let treeAsset;

let riverProgress = 0;

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

let points = [];

class point {
  pointHeight = 200;
  dead = false;
  speed = 1.5;
  ogPos = 0;

  constructor(state, pointPos) {
    this.state = state;
    this.pointPos = pointPos;
  }

  display() {   
    let alphaValue = 0;

    if(this.ogPos == 0) {
      this.ogPos = createVector(this.pointPos.x, this.pointPos.y);
    }
    
    this.pointPos.y -= this.speed;

    if(this.ogPos.y - this.pointPos.y < this.pointHeight * 0.2) {    
      alphaValue = (this.ogPos.y - this.pointPos.y) * 255 / 20;
    }
    else if (this.ogPos.y - this.pointPos.y > this.pointHeight * 0.8) {
      alphaValue = abs(this.ogPos.y - this.pointHeight - this.pointPos.y) * 255 / 20;
    }
    else {
      alphaValue = 255;
    }

    if(this.ogPos.y - this.pointPos.y > this.pointHeight) {
      this.dead = true;
    }

    textAlign(CENTER);
    textSize(20);

    if(this.state < 0) {
      fill(200, 0, 25, alphaValue);
      text(this.state, this.pointPos.x, this.pointPos.y);
    }
    else {
      fill(20, 75, 0, alphaValue);
      text("+" + this.state, this.pointPos.x, this.pointPos.y);
    }
  }
}

function preload() {
  swanAsset[0] = loadImage("assets/swan_water.png");
  swanAsset[1] = loadImage("assets/swan_air.png");
  
  deerAsset[0] = loadImage("assets/deer_stand.png");
  deerAsset[1] = loadImage("assets/deer_eat.png");
  deerAsset[2] = loadImage("assets/deer_jump.png");
  
  bushAsset = loadImage("assets/bush.png");
  treeAsset = loadImage("assets/tree.png");
  
  factoryAsset = loadImage("assets/factory.png");
  smokeAsset = loadImage("assets/smoke.png");
  
  houseAsset = loadImage("assets/house.png");
  cityhallAsset = loadImage("assets/cityhall.png");
  storefrontAsset = loadImage("assets/storefront.png");
  
  personAsset[0] = loadImage("assets/person_standing.png");
  personAsset[1] = loadImage("assets/person_running.png");
  personAsset[2] = loadImage("assets/person_log01.png");
  personAsset[3] = loadImage("assets/person_log02.png");
  personAsset[4] = loadImage("assets/person_standing_water.png");
  personAsset[5] = loadImage("assets/person_running_water.png");
  personAsset[6] = loadImage("assets/person_log01_water.png");
  personAsset[7] = loadImage("assets/person_log02_water.png");
}

//!Program
function setup() {
  createCanvas(windowWidth, windowHeight);
  //fullScreen();
  frameRate(60);
  angleMode(DEGREES);

  partyConnect("wss://deepstream-server-1.herokuapp.com", "avonLivingEntity");

  shared = partyLoadShared("globals");

  if (shared.natureTrigger === undefined) {
    shared.natureTrigger = false; // Only one participant needs to initialize it
  }

  if (shared.factoryTrigger === undefined) {
    shared.factoryTrigger = false; // Only one participant needs to initialize it
  }

  if (shared.settlementTrigger === undefined) {
    shared.settlementTrigger = false; // Only one participant needs to initialize it
  }

  if (shared.factoryLength === undefined) {
    shared.factoryLength = 0; // Only one participant needs to initialize it
  }

  for(let i = 0; i < width * height; i++){
    occupancyGrid[i] = false;
  }

  setTraversableArea();
}

function draw() {
  background(186, 223, 168);

  shared.factoryLength = factory.length;

  noStroke();
  fill(52, 228, 234);
  rect(0, height / 2 - height / 8, width, height / 4);
  
  if(regionVisualizerScreen) {
    regionVisualizer();
  }
  
  spawnManger();

  let tempTotalTechPoints = 0;

  factory.forEach(function(factory) {
    tempTotalTechPoints += factory.techPoints;
  })

  totalTechPoints = tempTotalTechPoints;

  swan.forEach(function(Swan, index, array) {    
    Swan.display();
    Swan.movementManager();

    if(!Swan.state && !Swan.animating) {
      swan.splice(index, 1);
    }
  });

  deer.forEach(function(Deer, index, array) {    
    Deer.display();
    Deer.movementManager();

    if(!Deer.state && !Deer.animating) {
      deer.splice(index, 1);
    }
  });

  factory.forEach(function(Factory, index, array) {    
    Factory.display();

    if(!Factory.state && !Factory.animating) {
      factory.splice(index, 1);
    }
  });

  settlement.forEach(function(Settlement, index, array) {    
    Settlement.display();

    if(!Settlement.state && !Settlement.animating) {
      settlement.splice(index, 1);
    }
  });

  nature.forEach(function(Nature, index, array) {    
    Nature.display();

    if(!Nature.state && !Nature.animating) {
      nature.splice(index, 1);
    }
  });

  points.forEach(function(Point, index) {    
    Point.display();

    if(Point.dead) {
      points.splice(index, 1);
    }
  });

  riverProgressManager();
  
  scoreScreen();
}

function keyPressed () {
  if(key == 'z' || key == 'Z') {
    shared.natureTrigger = true;
  }
  else if(key == 'x' || key == 'X') {
    shared.factoryTrigger = true;
  }
  else if(key == 'c' || key == 'C') {
    shared.settlementTrigger = true;
  }
  else if(key == 'v' || key == 'V') {
    frameRate(0);
  }
  else if(key == 'b' || key == 'B') {
    frameRate(60);
  }
  else if(key == 'n' || key == 'N') {
    regionVisualizerScreen = !regionVisualizerScreen;
  }
}

function scoreScreen() {

  fill(255);
  rect(0, 0, width, 50);

  textSize(20);
  textStyle(BOLD);
  
  textAlign(LEFT);
  fill(121, 212, 77);
  text("Nature: " + nature.length, 50, 30);
  
  textAlign(CENTER);
  fill(64, 64, 64);
  text("Factories: " + factory.length, width / 3, 30);
  
  textAlign(CENTER);
  fill(31, 107, 179);
  text("Settlements: " + settlement.length, width * 0.66, 30);
  
  textAlign(RIGHT);
  fill(64, 19, 4);
  text("Material: " + totalTechPoints, width - 50, 30);

  fill(31, 107, 179);
  rect(width / 3, height - 70, map(riverProgress, 0, 100, 0, width / 3, true), 40);

  noFill();
  stroke(255);
  strokeWeight(3);
  rect(width / 3, height - 70, width / 3, 40);

  noStroke();
  fill(31, 107, 179);
  textAlign(CENTER);
  text("Progress Bar", width / 2, height - 90);
}

function riverProgressManager() {
  riverProgress = Math.min(nature.length, 40) + Math.min(factory.length * 20, 20) + Math.min(settlement.length * 4, 40);
}

function spawnManger() {
  if(shared.natureTrigger) {
    spawnNature();
    
    shared.natureTrigger = false;

    if(nature.length % 5  == 0) {
      spawnDeer();
    }

    if(nature.length % 10  == 0) {
      spawnSwan();
    }
  }

  if(shared.factoryTrigger) {
    spawnFactory();
    shared.factoryTrigger = false;
  }

  if(shared.settlementTrigger) {
    spawnSettlement();
    shared.settlementTrigger = false;
  }
}

//!Initialization
function setTraversableArea() {

  for(let i = 0; i < width; i++) {
    for(let n = height / 2 - height / 8; n < height / 2 - height / 8 + height / 4; n++) {
      let index = n * width + i;

      occupancyGrid[int(index)] = true;
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

function buildingRangeCheckManager(array, index) {
  for(let i = 0; i < array.length; i++) {
    while((!isTraversable(Math.round(array[i].pos.x), Math.round(array[i].pos.y)) || buildingRangeCheck(array, index)) || array[i].xBoundaryTest() || array[i].yBoundaryTest()) {     
      
      array[index].pos.x = random(array[index].size / 2, width - array[index].size / 2);
      array[index].pos.y = random(height - array[index].size / 2);
    }

    if(array[index].buildingType == 1) {
      array[index].smokePos.x = array[index].pos.x;
      array[index].smokePos.y = array[index].pos.y;
    }
  }
}

function buildingRangeCheck(array, currentBuilding) {
  let inRange = false;

  for(let i = 0; i < array.length; i++) {
    if(currentBuilding != i) {

      let dist = sqrt(pow(array[i].pos.x - array[currentBuilding].pos.x, 2) + pow(array[i].pos.y - array[currentBuilding].pos.y, 2));

      if(dist <= array[currentBuilding].closeness) {
        inRange = true;

        break;
      }
    }
  }

  return inRange;
}
  
function spawnFactory() {
  let size = 0.4;

  if(factory.length < 4) {
    factory.push(
      new building(
        1,
        createVector(random(size / 2, width - size / 2), random(height - size / 2)), // Position of the building
        size,                                        // Size of the building image (width and height of the rendered image).
        factoryAsset,                                // The image asset representing the building visually.
        createVector(0, 0),                          // Position of the smoke effect
        random(0.5, 1),                              // Smoke Speed
        random(90, 120),                             // Smoke Height
        size * 1.5, 
        true, 60 * 10, 60 * 10, 4));                            // Proximity to Identical Buildings
  
    buildingRangeCheckManager(factory, factory.length - 1);
  }
}

function spawnNature() {
  
  if(nature.length < 80) {
    let size = 0.1;
    let asset = bushAsset;
      
    let natureAsset = parseInt(random(1, 4));
    
    if(natureAsset == 2 || natureAsset == 3) {
      asset = treeAsset;
      size = 0.2;
    }
    
    nature.push(
      new building(
        0,
        createVector(random(width), random(height)), // Position of the building
        size,                                       // Size of the building image (width and height of the rendered image).
        asset,                                      // The image asset representing the building visually.
        createVector(0, 0),                          // Position of the smoke effect
        random(0.5, 1),                             // Smoke Speed
        random(50, 80),                             // Smoke Height
        size / 2, true));                                      // Proximity to Identical Buildings);
    
    buildingRangeCheckManager(nature, nature.length - 1);
  }
}

function spawnSettlement() {

  if(settlement.length < 15) {
    let usedTech = 0;

    let mostMaterialFactory = 0;

    if(totalTechPoints >= 2) {
      factory.forEach(function(Factory) {
        if(mostMaterialFactory == 0) {
          mostMaterialFactory = Factory;
        }
    
        if(Factory.techPoints > mostMaterialFactory.techPoints) {
          mostMaterialFactory = Factory;
        }
      });

      if(mostMaterialFactory.techPoints >= 2) {
        if(usedTech == 0) {
          mostMaterialFactory.techPoints -= 2;

          spawnPoint(-2, mostMaterialFactory.pos);

          usedTech += 2;
        }
        else if(usedTech == 1) {
          mostMaterialFactory.techPoints --;

          spawnPoint(-1, mostMaterialFactory.pos);

          usedTech ++;
        }
        
      }
      else if (mostMaterialFactory.techPoints == 1) {
        mostMaterialFactory.techPoints --;

        spawnPoint(-1, mostMaterialFactory.pos);

        usedTech ++;
      }
    }

    if(usedTech == 2) {
      let size;
      let asset;
      let settlementAsset = parseInt(random(1, 3));

      if(settlement.length == 0) {
        asset = cityhallAsset;
        size = 0.085;
      }
      else {
        if(settlementAsset == 1) {
          asset = houseAsset;
          size = 0.055;
        }
        else {
          asset = storefrontAsset;
          size = 0.03;
        }
      }

      settlement.push(
        new building(
          2,
          createVector(random(size / 2, width - size / 2), random(height - size / 2)), // Position of the building
          size,                                        // Size of the building image (width and height of the rendered image).
          asset,                                       // The image asset representing the building visually.
          createVector(0, 0),                          // Position of the smoke effect
          random(0.5, 1),                              // Smoke Speed
          random(50, 80),                              // Smoke Height
          size * 1.5, true, 60 * 15, 60 * 15, 1));                                      // Proximity to Identical Buildings);

      buildingRangeCheckManager(settlement, settlement.length - 1);
    }
  }
  
}

function spawnSwan() {
  let size = 0.25;
  
  swan.push(
    new animal(
      createVector(random(width), random(height)), // Position of the animal (initial location in the middle of the screen)
      createVector(0, 0),         // Transformed position (starting offset position for movement calculations)
      createVector(0, 0),                  // New target location for the animal to move towards
      parseInt(random(15, 60)),                // Wait time (randomly assigned between 15 and 60) before moving again
      0,                                  // Initial wait timer (counts down to zero to control waiting state)
      1,                                  // Animation type (used for specifying animation behavior or type if needed)
      false,                              // Moving state (let to indicate if the animal is currently moving)
      random(90, 120),                // Speed (controls how fast the animal moves towards the target)
      random(size * 0.8, size),                               // Size (the size of the animal in pixels, used for display)
      500,                                // Range (defines the movement range within which the animal can roam)
      swanAsset,                            // Asset (image to represent the animal visually)
      false,
      0, true, nature.length
    )
  );

  animalCheckManager(swan, swan.length - 1);
}

function spawnDeer() {
  let size = 0.35;
  
  deer.push(
    new animal(
      createVector(random(width), random(height)), // Position of the animal (initial location in the middle of the screen)
      createVector(0, 0),                       // Transformed position (starting offset position for movement calculations)
      createVector(0, 0),                  // New target location for the animal to move towards
      int(random(15, 60)),                // Wait time (randomly assigned between 15 and 60) before moving again
      0,                                  // Initial wait timer (counts down to zero to control waiting state)
      0,                                  // Animation type (used for specifying animation behavior or type if needed)
      false,                              // Moving state (let to indicate if the animal is currently moving)
      random(40, 70),                // Speed (controls how fast the animal moves towards the target)
      random(size * 0.8, size),                               // Size (the size of the animal in pixels, used for display)
      250,                                // Range (defines the movement range within which the animal can roam)
      deerAsset,                            // Asset (image to represent the animal visually)
      false,
      0, true, nature.length
    ));
    
    animalCheckManager(deer, deer.length - 1);
}

function spawnPerson(x, y, personArray, personType) {
  let size = 50;
  
  personArray.push(
    new person(
      createVector(x, y), // Position of the animal (initial location in the middle of the screen)
      createVector(0, 0),                  // New target location for the animal to move towards
      int(random(15, 60)),                // Wait time (randomly assigned between 15 and 60) before moving again
      0,                                  // Initial wait timer (counts down to zero to control waiting state)
      personType,                                  // Animation type (used for specifying animation behavior or type if needed)
      false,                              // Moving state (let to indicate if the animal is currently moving)
      int(random(2, 4)),                // Speed (controls how fast the animal moves towards the target)
      int(random(size * 0.8, size)),                               // Size (the size of the animal in pixels, used for display)
      250,                                // Range (defines the movement range within which the animal can roam)
      personAsset,                            // Asset (image to represent the animal visually)
      false,
      false, true, factory.length
    )
  );
}

function spawnPoint(state, pos) {
  points.push(
    new point(
      state,
      createVector(pos.x, pos.y)
  ));
}

function animationManagerPerson(person) {
  if(person.state){ 
    spawnAnimation(person);
  }
  else if(!person.state) {
    deathAnimation(person);
  }
}

function animationManagerAnimal(animal) {
  if(animal.state){ 
    spawnAnimation(animal);
  }
  else if(!animal.state) {
    deathAnimation(animal);
  }
}


function animationManagerBuilding(building) {     
  if(building.state){ 
    spawnAnimation(building);
  }
  else if(!building.state) {
    deathAnimation(building);
  }
}

function spawnAnimation(entity) {
  // Calculate the easing based on time and apply backout easing
  if (entity.animating) {
    entity.currentTime += 1.0 / frameRate();  // Increment time based on frame rate

    if (entity.currentTime > entity.easingDuration) {
      entity.currentTime = entity.easingDuration;  // Cap time at the easing duration
      entity.animating = false;  // Stop animating once we reach the target time
    } 

    // Calculate the backout easing value (backout(t))
    entity.scaleFactor = backOut(entity.currentTime / entity.easingDuration);
  }

  return entity.scaleFactor;
}

function deathAnimation(entity) {
  // Calculate the easing based on time and apply backout easing    
  
  if (entity.animating) {
    
    entity.currentTime -= 1.0 / frameRate();  // Increment time based on frame rate

    if (entity.currentTime < 0) {
      entity.currentTime = 0;  // Cap time at the easing duration
      entity.animating = false;  // Stop animating once we reach the target time
    } 

    // Calculate the backout easing value (backout(t))
    entity.scaleFactor = backOut(entity.currentTime / entity.easingDuration);
  }

  return entity.scaleFactor;
}

// Backout easing function
function backOut(t) {
  let s = 1.70158;  // Overshoot value (you can tweak this for more/less overshoot)
  return (--t) * t * ((s + 1) * t + s) + 1;
}

//building.js
class building {  
  scaleFactor = 0;  // Scale factor for the rectangle
  easingDuration = 0.35;  // Duration of the easing animation (in seconds)
  currentTime = 0;  // Time tracker for the animation
  animating = true;  // Flag to track if the animation is running

  workers = [];

  techPoints = 0;

  angle = 0;

  //buildingType 0 = Nature 1 = Factory 2 = Residential
  constructor(buildingType, pos, size, asset, smokePos, smokeSpeed, smokeHeight, closeness, state, currentLife, lifeSpan, maintenance) {
    this.buildingType = buildingType;
    this.pos = pos;
    this.smokeSpeed = smokeSpeed;
    this.size = size;
    this.asset = asset;
    this.smokePos = smokePos;
    this.smokeHeight = smokeHeight;
    this.closeness = closeness;
    this.state = state;
    this.currentLife = currentLife;
    this.lifeSpan = lifeSpan;
    this.maintenance = maintenance;
  }

  lifeManager() {
    if(this.buildingType > 0 && this.currentLife > 0) {
      this.currentLife --;
    }

    if(this.techPoints >= this.maintenance && this.currentLife <= 0) {
      this.techPoints -= this.maintenance;

      spawnPoint(-this.maintenance, this.pos);

      this.currentLife = this.lifeSpan;
    }
    else if(this.currentLife <= 0 && this.state) {
      this.state = false;
      this.scaleFactor = 1;
      this.currentTime = 0.35;
      this.animating = true; 

      this.item = true;

      spawnPoint(-this.maintenance, this.pos);

      if(this.buildingType > 0) {
        this.workers.forEach(function(Worker) {
          if(Worker.state) {

            Worker.state = false;
            
            Worker.scaleFactor = 1;
            Worker.currentTime = 0.35;
            Worker.animating = true;
          }
          
        })
      }
    }
  }

  xBoundaryTest() {
    return this.pos.x < 0 || this.pos.x > width;
  }

  yBoundaryTest() {
    return this.pos.y < height * 0.1 || this.pos.y > height;
  }

  smokeManager() {    
    if(this.buildingType == 1) {
      this.smokePos.y -= this.smokeSpeed;

      if(this.smokePos.y < this.pos.y - this.smokeHeight) {
        this.smokePos.y = this.pos.y;
      }

      if(this.pos.y - this.smokePos.y < this.smokeHeight * 0.2) {    
        tint(255, (this.pos.y - this.smokePos.y) * 255 / 20);
      }
      else if (this.pos.y - this.smokePos.y > this.smokeHeight * 0.8) {
        tint(255, abs((this.pos.y - this.smokeHeight - this.smokePos.y) * 255 / 20));
      }
      else {
        tint(255, 255);
      }

      image(smokeAsset, this.smokePos.x - this.size  * smokeAsset.width / 2, this.smokePos.y - this.size  * smokeAsset.height, this.size * smokeAsset.width, this.size * smokeAsset.height);
      tint(255, 255);
    }
  }

  display() {
    this.smokeManager();
    this.lifeManager();

    fill(0);
    textAlign(CENTER);
    textSize(15);

    animationManagerBuilding(this);

    let scaledSizeX = this.asset.width * this.size * this.scaleFactor;
    let scaledSizeY = this.asset.height * this.size * this.scaleFactor;

    image(this.asset, this.pos.x - scaledSizeX / 2, this.pos.y - scaledSizeY, scaledSizeX, scaledSizeY); // Centering the image by using negative size/2

    if(this.buildingType > 0) {
      
      // Draw the pie chart filling
      fill(255, 0, 0);
      noStroke();
      arc(this.pos.x - 50, this.pos.y + 15, 20, 20, -90, this.angle - 90, PIE);

      this.angle = map(this.currentLife, 0, this.lifeSpan, 0, 360); // Stop at 100%
      
      fill(0);
      text("Materials: " + this.techPoints, this.pos.x + 10, this.pos.y + 20);
    }

    if(this.buildingType == 1 || this.buildingType == 2) {
      this.personManager(this.workers);
    }
  }

  personManager(person) {
    if(this.buildingType == 1) {
      let maxPeople = 3;

      if(person.length < maxPeople) {
        for(let i = person.length; i < maxPeople; i++) {
          spawnPerson(this.pos.x, this.pos.y, person, 1);
        }
      }
    }
    else if(this.buildingType == 2) {
      let maxPeople = 1;

      if(person.length < maxPeople) {
        for(let i = person.length; i < maxPeople; i++) {
          spawnPerson(this.pos.x, this.pos.y, person, 0);
        }
      }
    }

    person.forEach((element, index, array) => {    
      element.display();
      element.movementManager(this);
    });
  }
}

class animal {  
  assetTracker = 0;
  scaleFactor = 0;  // Scale factor for the rectangle
  targetScale = 1;  // Final scale size
  easingDuration = 0.35;  // Duration of the easing animation (in seconds)
  currentTime = 0;  // Time tracker for the animation
  animating = true;  // Flag to track if the animation is running

  //animType 0 = deer 1 = swan
  constructor(pos, transPos, newLocation, waitTime, waitTimer, animalType, moving, speed, size, range, asset, direction, animationType, state, natureLink) {
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
    this.state = state;
    this.natureLink = natureLink;
  }

  display() {
    this.lifeManager();
    
    animationManagerAnimal(this);

      let scaledSizeX = this.asset[this.assetTracker].width * this.size * this.scaleFactor;
      let scaledSizeY = this.asset[this.assetTracker].height * this.size * this.scaleFactor;

      // Push the current matrix onto the stack
      push();
  
        // Move the origin to the position of the animal before scaling
        translate(this.transPos.x + this.pos.x, this.transPos.y + this.pos.y);
    
        // Flip the image horizontally if the direction is false
        if(this.direction == false) {
            scale(-1, 1);
        }

        // Draw the image centered at the origin
        image(this.asset[this.assetTracker], -scaledSizeX / 2, -scaledSizeY, scaledSizeX, scaledSizeY); // Centering 
  
      // Pop the matrix to return to the previous state
      pop();
  }

  lifeManager() {
    if(this.natureLink > nature.length && this.state) {
      this.state = false;
      this.scaleFactor = 1;
      this.currentTime = 0.35;
      this.animating = true; 

      this.item = true;
    }
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

//person.js
class person { 
  assetCounter = 0;

  scaleFactor = 0;  // Scale factor for the rectangle
  targetScale = 1;  // Final scale size
  easingDuration = 0.35;  // Duration of the easing animation (in seconds)
  currentTime = 0;  // Time tracker for the animation
  animating = true;  // Flag to track if the animation is running

  //animType 0 = resident 1 = worker
  constructor(pos, newLocation, waitTime, waitTimer, personType, moving, speed, size, range, asset, direction, item, state) {
    this.pos = pos;
    this.newLocation = newLocation;
    this.waitTime = waitTime;
    this.waitTimer = waitTimer;
    this.personType = personType;
    this.moving = moving;
    this.speed = speed;
    this.range = range;
    this.size = size;
    this.asset = asset;
    this.direction = direction;
    this.state = state;
  }

  display() {
    animationManagerPerson(this);

    let scaledSize = this.size * this.scaleFactor;

    if(this.moving == true) {
      if(this.assetCounter % 2 == 1 && frameCount % 4 == 0) {
        this.assetCounter --;
      }
      else if (this.assetCounter % 2 == 0 && frameCount % 4 == 0) {
        this.assetCounter ++;
      }

      if(!isTraversable(Math.round(this.pos.x), Math.round(this.pos.y)) && this.assetCounter < 4) {
        this.assetCounter += 4;
      }
      else if(isTraversable(Math.round(this.pos.x), Math.round(this.pos.y)) && this.assetCounter > 3) {
        this.assetCounter -= 4;
      }

      if(this.item && (this.assetCounter == 0 || this.assetCounter == 1 || this.assetCounter == 4 || this.assetCounter == 5)) {
        this.assetCounter += 2;
      }
      else if(!this.item && (this.assetCounter == 2 || this.assetCounter == 3 || this.assetCounter == 6 || this.assetCounter == 7)) {
        this.assetCounter -= 2;
      }
    }
    else {
      this.assetCounter = 0;

      if(!isTraversable(Math.round(this.pos.x), Math.round(this.pos.y)) && this.assetCounter <= 3) {
        this.assetCounter += 4;
      }
    }

    push();
      translate(this.pos.x, this.pos.y);

      if(this.direction == false) {
          scale(-1, 1);
      }

      image(this.asset[this.assetCounter], -scaledSize / 2, -scaledSize, scaledSize, scaledSize); // Centering the image by using negative size/2
    pop();
  }

  movementManager(building) {
    //worker behaviour
    if(this.personType == 1) {
      if(nature.length > 0 && !this.item) {
        this.collect();
      }
      else if(this.item) {
        this.produce(building);
      }
      else {
        this.walk();
      }
    }

    //citizen behavior
    if(this.personType == 0) {
      if(totalTechPoints > 0 && building.techPoints == 0 && !this.item) {
        this.retreive();
      }
      else if(this.item) {
        this.produce(building);
      }
      else {
        this.walk();
      }
    }
  }

  produce(building) {
    this.moving = true;

    let factoryX = building.pos.x;
    let factoryY = building.pos.y;

    let angle = atan2(factoryY - this.pos.y, factoryX - this.pos.x);

    let speedX = this.speed * cos(angle);
    let speedY = this.speed * sin(angle);

    if(speedX > 0) {
      this.direction = false;
    }
    else {
      this.direction = true;
    }

    this.pos.x += speedX;
    this.pos.y += speedY;

    if((speedX < 0 && this.pos.x < factoryX) || (speedX > 0 && this.pos.x > factoryX)) {
      this.moving = false;
      this.waitTimer = this.waitTime;

      this.item = false;

      this.pos.x = factoryX;
      this.pos.y = factoryY;

      building.techPoints ++;

      spawnPoint(1, this.pos);

      factoryX = 0;
      factoryY = 0;
    }
  }

  newLocationFinder() {    
    if (!this.moving && this.waitTimer == 0) {
      this.moving = true;

      // Generate a random location
      this.newLocation.x = random(-this.range / 2, this.range / 2) + this.pos.x;
      this.newLocation.y = random(-this.range / 2, this.range / 2) + this.pos.y;

      while (this.xBoundaryTest() || this.yBoundaryTest()) {  
        this.newLocation.x = random(-this.range / 2, this.range / 2) + this.pos.x;
        this.newLocation.y = random(-this.range / 2, this.range / 2) + this.pos.y;
      }   
    }
    else if (!this.moving && this.waitTimer > 0) {
      this.waitTimer--;
    }
  }

  walk() {
    this.newLocationFinder();

    if(this.moving == true) {        
      let angle = atan2(this.newLocation.y - this.pos.y, this.newLocation.x - this.pos.x);

      let speedX = this.speed * cos(angle);
      let speedY = this.speed * sin(angle);

      if(speedX > 0) {
        this.direction = false;
      }
      else {
        this.direction = true;
      }

      this.pos.x += speedX;
      this.pos.y += speedY;

      if((speedX < 0 && this.pos.x < this.newLocation.x) || (speedX > 0 && this.pos.x > this.newLocation.x)) {
        this.moving = false;
        this.waitTimer = this.waitTime;

        this.pos.x = this.newLocation.x;
        this.pos.y = this.newLocation.y;
      }
    }
  }

  collect() {    
    let closestResource = createVector(nature[0].pos.x, nature[0].pos.y);

    let activeIndex = 0;

    nature.forEach((resource, index, array) => {      
      if(dist(this.pos.x, this.pos.y, resource.pos.x, resource.pos.y) < dist(this.pos.x, this.pos.y, closestResource.x, closestResource.y) && resource.state) {
        closestResource = resource.pos;

        activeIndex = index;
      }
    });

    this.newLocation.x = closestResource.x;
    this.newLocation.y = closestResource.y;

    let angle = atan2(this.newLocation.y - this.pos.y, this.newLocation.x - this.pos.x);

    let speedX = this.speed * cos(angle);
    let speedY = this.speed * sin(angle);

    if(speedX > 0 && this.pos.x < this.newLocation.x && !this.moving) {
      this.moving = true;
    }

    if(speedX < 0 && this.pos.x > this.newLocation.x && !this.moving) {
      this.moving = true;
    }

    if(this.moving == true) {        

      if(speedX > 0) {
        this.direction = false;
      }
      else {
        this.direction = true;
      }

      this.pos.x += speedX;
      this.pos.y += speedY;

      if((speedX < 0 && this.pos.x < this.newLocation.x) || (speedX > 0 && this.pos.x > this.newLocation.x)) {
        this.moving = false;
        this.waitTimer = this.waitTime;

        this.pos.x = this.newLocation.x;
        this.pos.y = this.newLocation.y;

        this.newLocation.x = 0;
        this.newLocation.y = 0;

        nature[activeIndex].state = false;
        nature[activeIndex].scaleFactor = 1;
        nature[activeIndex].currentTime = 0.35;
        nature[activeIndex].animating = true; 

        this.item = true;
      }
    }
  }

  retreive() { 
    let closestResource = 0;
    let activeIndex = 0;

    if(closestResource == 0) {
      factory.forEach((resource, index,) => {
        if(resource.techPoints > 0) {
          closestResource = resource.pos;
        }
      })

      factory.forEach((resource, index) => {
        if(resource.techPoints > 0 && dist(this.pos.x, this.pos.y, resource.pos.x, resource.pos.y) < dist(this.pos.x, this.pos.y, closestResource.x, closestResource.y)) {
          closestResource = resource.pos;

          activeIndex = index;
        }
      });

      this.newLocation.x = closestResource.x;
      this.newLocation.y = closestResource.y;
    }

    let angle = atan2(this.newLocation.y - this.pos.y, this.newLocation.x - this.pos.x);

    let speedX = this.speed * cos(angle);
    let speedY = this.speed * sin(angle);

    if(speedX > 0 && this.pos.x < this.newLocation.x && !this.moving) {
      this.moving = true;
    }

    if(speedX < 0 && this.pos.x > this.newLocation.x && !this.moving) {
      this.moving = true;
    }

    if(this.moving == true) {        

      if(speedX > 0) {
        this.direction = false;
      }
      else {
        this.direction = true;
      }

      this.pos.x += speedX;
      this.pos.y += speedY;

      if((speedX < 0 && this.pos.x < this.newLocation.x) || (speedX > 0 && this.pos.x > this.newLocation.x)) {
        this.moving = false;
        this.waitTimer = this.waitTime;

        this.pos.x = this.newLocation.x;
        this.pos.y = this.newLocation.y;

        this.newLocation.x = 0;
        this.newLocation.y = 0;

        factory[activeIndex].techPoints --;

        spawnPoint(-1, this.pos);

        this.item = true;
      }
    }
  }

  xBoundaryTest() {
    return this.newLocation.x < 0 || this.newLocation.x > width;
  }

  yBoundaryTest() {
    return this.newLocation.y < 0 || this.newLocation.y > height;
  }
}

const natureButton = document.getElementById('natureButton');
const factoryButton = document.getElementById('factoryButton');
const settlementButton = document.getElementById('settlementButton');

natureButton.addEventListener('click', () => {
  shared.natureTrigger = true;
});

factoryButton.addEventListener('click', () => {
  shared.factoryTrigger = true;
});

settlementButton.addEventListener('click', () => {
  shared.settlementTrigger = true;
});