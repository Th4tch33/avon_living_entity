// building.js

class building {
  buildingType;
  pos;
  size;
  asset;
  smokePos;
  smokeSpeed;
  smokeHeight;
  closeness;
  state;
  
  scaleFactor = 0;  // Scale factor for the rectangle
  easingDuration = 0.35;  // Duration of the easing animation (in seconds)
  currentTime = 0;  // Time tracker for the animation
  animating = true;  // Flag to track if the animation is running
  
  workers = [];
  
  //buildingType 0 = Nature 1 = Factory 2 = Residential
  building(let buildingType, p5.Vector pos, let size, PImage asset, p5.Vector smokePos, let smokeSpeed, let smokeHeight, let closeness, let state) {
    this.buildingType = buildingType;
    this.pos = pos;
    this.smokeSpeed = smokeSpeed;
    this.size = size;
    this.asset = asset;
    this.smokePos = smokePos;
    this.smokeHeight = smokeHeight;
    this.closeness = closeness;
    this.state = state;
  }
  
  let xBoundaryTest() {
    return pos.x < 0 || pos.x  width;
  }
  
  let yBoundaryTest() {
    return pos.y < height * 0.1 || pos.y  height;
  }
  
  function smokeManager() {    
    if(buildingType == 1) {
      smokePos.y -= smokeSpeed;
    
      if(smokePos.y < pos.y - smokeHeight) {
        smokePos.y = pos.y;
      }
      
      if(pos.y - smokePos.y < smokeHeight * 0.2) {    
        tint(255, (pos.y - smokePos.y) * 255 / 20);
      }
      else if (pos.y - smokePos.y  smokeHeight * 0.8) {
        tint(255, abs((pos.y - smokeHeight - smokePos.y) * 255 / 20));
      }
      else {
        tint(255, 255);
      }
      
      image(smokeAsset, smokePos.x - size / 2, smokePos.y - size, size, size);
      tint(255, 255);
    }
  }

  function display() {
    smokeManager();
    
    animationManager(this);
    
    let scaledSize = size * scaleFactor;
    
    image(asset, pos.x - scaledSize / 2, pos.y - scaledSize, scaledSize, scaledSize); // Centering the image by using negative size/2
    
    if(buildingType == 1 || buildingType == 2) {
      childManager(workers, buildingType);
    }
  }
  
  function childManager(person person, let buildingType) {

    if(buildingType == 1) {
      let maxPeople = 3;
    
      if(person.createCanvas() < maxPeople) {
        for(let i = person.createCanvas(); i < maxPeople; i++) {
          spawnPerson(pos.x, pos.y, person, 1);
        }
      }
      
      for(person worker : person) {
        worker.display();
        worker.movementManager(this);
      }
    }
    else {
      let maxPeople = 1;
    
      if(person.createCanvas() < maxPeople) {
        for(let i = person.createCanvas(); i < maxPeople; i++) {
          spawnPerson(pos.x, pos.y, person, 0);
        }
      }
      
      for(person resident : person) {
        resident.display();
        resident.movementManager(this);
      }
    }
  }
}
