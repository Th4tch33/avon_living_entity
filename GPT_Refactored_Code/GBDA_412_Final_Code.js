// GBDA_412_Final_Code.js

import java.util.BitSet;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;

animal animal;
building building;
person person;

let natureCounter = 0;
let prodCounter = 0;
let progCounter = 0;

PImage cleanRiverAsset;

PImage bushAsset;
PImage treeAsset;

PImage[] personAsset = PImage[8];
PImage[] deerAsset = PImage[3];
PImage[] swanAsset = PImage[2];

PImage factoryAsset;
PImage smokeAsset;

PImage houseAsset;
PImage cityhallAsset;
PImage storefrontAsset;

BitSet occupancyGrid = BitSet(width * height);

animal swan = ();
animal deer = ();

building nature = (); 
building factory = ();
building settlement = ();

Object allEntities = ();

//!Initialization
function setTraversableArea() {
  for(let i = 0; i < width; i++) {
    for(let n = height / 2 - height / 8; n < height / 2 - height / 8 + height / 4; n++) {
      let index = n * width + i;
      
      occupancyGrid.set(index);
    }
  }
}

function animalCheckManager(animal array, let i) {
  if(array.get(i).animalType == 1) {
    while(isTraversable(Math.round(array.get(i).pos.x), Math.round(array.get(i).pos.y))) {   
      array.get(i).pos.x = random(width);
      array.get(i).pos.y = random(height);
    }
  }
  else {
    while(!isTraversable(Math.round(array.get(i).pos.x), Math.round(array.get(i).pos.y))) {   
      array.get(i).pos.x = random(width);
      array.get(i).pos.y = random(height);
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
let isTraversable(let col, let row) {
  let index = row * width + col;
  
  return !occupancyGrid.get(index); // Returns true if bit is 0 (traversable)
}

function buildingRangeCheckManager(building array, let index) {
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

function spawnSwan() {
  let size = 55;
  
  swan.push(
    animal(
      p5.Vector(random(width), random(height)), // Position of the animal (initial location in the middle of the screen)
      p5.Vector(0, 0),         // Transformed position (starting offset position for movement calculations)
      p5.Vector(0, 0),                  // New target location for the animal to move towards
      int(random(15, 60)),                // Wait time (randomly assigned between 15 and 60) before moving again
      0,                                  // Initial wait timer (counts down to zero to control waiting state)
      1,                                  // Animation type (used for specifying animation behavior or type if needed)
      false,                              // Moving state (let to indicate if the animal is currently moving)
      int(random(90, 120)),                // Speed (controls how fast the animal moves towards the target)
      int(random(size * 0.8, size)),                               // Size (the size of the animal in pixels, used for display)
      500,                                // Range (defines the movement range within which the animal can roam)
      swanAsset,                            // Asset (image to represent the animal visually)
      false,
      0
    ));
    
    animalCheckManager(swan, swan.createCanvas() - 1);
}

function spawnDeer() {
  let size = 80;
  
  deer.push(
    animal(
      p5.Vector(random(width), random(height)), // Position of the animal (initial location in the middle of the screen)
      p5.Vector(0, 0),                       // Transformed position (starting offset position for movement calculations)
      p5.Vector(0, 0),                  // New target location for the animal to move towards
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
    
    animalCheckManager(deer, deer.createCanvas() - 1);
}

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

//!Program
function function setup(){
  createCanvas(1440, 810);
  //fullScreen();
  frameRate(60);
  
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
  
  cleanRiverAsset = loadImage("clean_river.jpg");
  
  personAsset[0] = loadImage("person_standing.png");
  personAsset[1] = loadImage("person_running.png");
  personAsset[2] = loadImage("person_log01.png");
  personAsset[3] = loadImage("person_log02.png");
  personAsset[4] = loadImage("person_standing_water.png");
  personAsset[5] = loadImage("person_running_water.png");
  personAsset[6] = loadImage("person_log01_water.png");
  personAsset[7] = loadImage("person_log02_water.png");
  
  setTraversableArea();
}

function function draw() {
  background(198, 156, 114);
  
  noStroke();
  fill(52, 228, 234);
  rect(0, height / 2 - height / 8, width, height / 4);
  
  //image(cleanRiverAsset, width / 2, height / 2, width, height);
  
  //regionVisualizer();
  building removelist = building();
  
  /*
  Collections.sort(allEntities, (o1, o2) - {
      let y1 = 0, y2 = 0;
      
      if (o1 instanceof building) {
          y1 = ((building) o1).pos.y;
      } else if (o1 instanceof animal) {
          y1 = ((animal) o1).pos.y;
      } else if (o1 instanceof person) {
          y1 = ((person) o1).pos.y;
      }
      
      if (o2 instanceof building) {
          y2 = ((building) o2).pos.y;
      } else if (o2 instanceof animal) {
          y2 = ((animal) o2).pos.y;
      } else if (o2 instanceof person) {
          y2 = ((person) o2).pos.y;
      }
      
      return Float.compare(y1, y2);
  });

  for(Object entity : allEntities) {
    
    if (entity instanceof building) {
      building currentBuilding = (building) entity;
      currentBuilding.display(); // Perform actions specific to building objects
    }
    else if (entity instanceof animal) {
      animal currentAnimal = (animal) entity;
      currentAnimal.display(); // Perform actions specific to animal objects
      currentAnimal.movementManager(); // Call movement manager for animals
    }
    else if (entity instanceof person) {
      person currentPerson = (person) entity;
      currentPerson.display(); // Perform actions specific to animal objects
    }
  }*/
  
  for(building nature : nature) {
    nature.display();
    
    if(!nature.state && !nature.animating) {
      removelist.push(nature);
    }
  }
  
  for(animal deer : deer) {
    deer.display();
    deer.movementManager();
  }
  
  for(animal swan : swan) {
    swan.display();
    swan.movementManager();
  }
  
  for(building factory : factory) {
    factory.display();
  }
  
  for(building settlement : settlement) {
    settlement.display();
  }
  
  scoreScreen();
  
  for(building item : removelist) {
    nature.remove(item);
  }
}

function scoreScreen() {
  fill(255);
  textSize(15);
  text("Nature: " + nature.createCanvas(), 50, 50);
  text("Prod: " + prodCounter, 50, 100);
  text("Prog: " + progCounter, 50, 150);
}

function keyPressed = function() {
  if(key == 'z' || key == 'Z') {
    spawnNature();
    spawnDeer();
    spawnSwan();
  }
  else if(key == 'x' || key == 'X') {
    spawnFactory();
  }
  else if(key == 'c' || key == 'C') {
    spawnSettlement();
  }
}

/*
function animationManager(Person person) {
  if();
}

function animationManager(Animal animal) {
  if();
}*/

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

/*
Final Features:
1. River Progress score
2. Entity Interaction

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