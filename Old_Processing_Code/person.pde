class person {
  PVector pos;
  PVector newLocation;
  int waitTime;
  int waitTimer;
  int personType;
  float speed;
  boolean moving;
  float size;
  float range;
  PImage[] asset = new PImage[4];
  boolean direction;
  boolean item;
  
  int assetCounter = 0;
  
  float scaleFactor = 0;  // Scale factor for the rectangle
  float targetScale = 1;  // Final scale size
  float easingDuration = 0.35;  // Duration of the easing animation (in seconds)
  float currentTime = 0;  // Time tracker for the animation
  boolean animating = true;  // Flag to track if the animation is running

  //animType 0 = resident 1 = worker
  person(PVector pos, PVector newLocation, int waitTime, int waitTimer, int personType, boolean moving, float speed, float size, float range, PImage[] asset, boolean direction, boolean item) {
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
  }
  
  void display() {
    float scaleFactor = spawnAnimation();
    float scaledSize = size * scaleFactor;
  
    if(moving == true) {
      if(assetCounter % 2 == 1 && frameCount % 4 == 0) {
          assetCounter --;
      }
      else if (assetCounter % 2 == 0 && frameCount % 4 == 0) {
        assetCounter ++;
      }
      
      if(!isTraversable(Math.round(pos.x), Math.round(pos.y)) && assetCounter < 4) {
        assetCounter += 4;
      }
      else if(isTraversable(Math.round(pos.x), Math.round(pos.y)) && assetCounter > 3) {
        assetCounter -= 4;
      }
      
      if(item && (assetCounter == 0 || assetCounter == 1 || assetCounter == 4 || assetCounter == 5)) {
        assetCounter += 2;
      }
      else if(!item && (assetCounter == 2 || assetCounter == 3 || assetCounter == 6 || assetCounter == 7)) {
        assetCounter -= 2;
      }
    }
    else {
      assetCounter = 0;
      
      if(!isTraversable(Math.round(pos.x), Math.round(pos.y)) && assetCounter <= 3) {
        assetCounter += 4;
      }
    }

    pushMatrix();
      translate(pos.x, pos.y);
  
      if(direction == false) {
          scale(-1, 1);
      }
  
      image(asset[assetCounter], -scaledSize / 2, -scaledSize, scaledSize, scaledSize); // Centering the image by using negative size/2
    popMatrix();
  }
  
  void movementManager(building building) {
    if(nature.size() > 0 && !item && personType == 1) {
      collect();
    }
    else if(item && personType == 1) {
      produce(building);
    }
    else {
      walk();
    }
  }
  
  void produce(building building) {
    moving = true;
    
    float factoryX = building.pos.x;
    float factoryY = building.pos.y;
    
    float angle = atan2(factoryY - pos.y, factoryX - pos.x);
    
    float speedX = speed * cos(angle);
    float speedY = speed * sin(angle);
    
    if(speedX > 0) {
      direction = false;
    }
    else {
      direction = true;
    }
    
    pos.x += speedX;
    pos.y += speedY;
    
    if((speedX < 0 && pos.x < factoryX) || (speedX > 0 && pos.x > factoryX)) {
      moving = false;
      waitTimer = waitTime;
      
      item = false;
      
      pos.x = factoryX;
      pos.y = factoryY;
      
      factoryX = 0;
      factoryY = 0;
    }
  }
  
  void newLocationFinder() {    
    if (!moving && waitTimer == 0) {
      moving = true;
      
      // Generate a new random location
      newLocation.x = random(-range / 2, range / 2) + pos.x;
      newLocation.y = random(-range / 2, range / 2) + pos.y;
      
      while (xBoundaryTest() || yBoundaryTest()) {  
        newLocation.x = random(-range / 2, range / 2) + pos.x;
        newLocation.y = random(-range / 2, range / 2) + pos.y;
      }   
    }
    else if (!moving && waitTimer > 0) {
        waitTimer--;
    }
  }
  
  void walk() {
    newLocationFinder();

    if(moving == true) {        
      float angle = atan2(newLocation.y - pos.y, newLocation.x - pos.x);
      
      float speedX = speed * cos(angle);
      float speedY = speed * sin(angle);

      if(speedX > 0) {
        direction = false;
      }
      else {
        direction = true;
      }
      
      pos.x += speedX;
      pos.y += speedY;

      if((speedX < 0 && pos.x < newLocation.x) || (speedX > 0 && pos.x > newLocation.x)) {
        moving = false;
        waitTimer = waitTime;
        
        pos.x = newLocation.x;
        pos.y = newLocation.y;
      }
    }
  }
  
  void collect() {    
    PVector closestResource = new PVector(nature.get(0).pos.x, nature.get(0).pos.y);
  
    int index = 0;
    int activeIndex = 0;
    
    for(building resource : nature) {
      if(dist(pos.x, pos.y, resource.pos.x, resource.pos.y) < dist(pos.x, pos.y, closestResource.x, closestResource.y) && resource.state) {
        closestResource.x = resource.pos.x;
        closestResource.y = resource.pos.y;
        
        activeIndex = index;
      }
      
      index ++;
    }
    
    newLocation.x = closestResource.x;
    newLocation.y = closestResource.y;
    
    float angle = atan2(newLocation.y - pos.y, newLocation.x - pos.x);
      
    float speedX = speed * cos(angle);
    float speedY = speed * sin(angle);

    if(speedX > 0 && pos.x < newLocation.x && !moving) {
      moving = true;
    }
    
    if(speedX < 0 && pos.x > newLocation.x && !moving) {
      moving = true;
    }

    if(moving == true) {        
      
      if(speedX > 0) {
        direction = false;
      }
      else {
        direction = true;
      }
      
      pos.x += speedX;
      pos.y += speedY;
      
      if((speedX < 0 && pos.x < newLocation.x) || (speedX > 0 && pos.x > newLocation.x)) {
        moving = false;
        waitTimer = waitTime;
        
        pos.x = newLocation.x;
        pos.y = newLocation.y;
        
        newLocation.x = 0;
        newLocation.y = 0;
        
        nature.get(activeIndex).state = false;
        nature.get(activeIndex).scaleFactor = 1;
        nature.get(activeIndex).currentTime = 0.35;
        nature.get(activeIndex).animating = true; 
        
        item = true;
      }
    }
  }

  boolean xBoundaryTest() {
    return newLocation.x < 0 || newLocation.x > width;
  }
  
  boolean yBoundaryTest() {
    return newLocation.y < 0 || newLocation.y > height;
  }

  float spawnAnimation() {
    // Calculate the easing based on time and apply backout easing
    if (animating) {
      currentTime += 1.0 / frameRate;  // Increment time based on frame rate
      
      if (currentTime > easingDuration) {
        currentTime = easingDuration;  // Cap time at the easing duration
        animating = false;  // Stop animating once we reach the target time
      } 
  
      // Calculate the backout easing value (backout(t))
      scaleFactor = backOut(currentTime / easingDuration);
    }
  
    return scaleFactor;
  }
  
  // Backout easing function
  float backOut(float t) {
    float s = 1.70158;  // Overshoot value (you can tweak this for more/less overshoot)
    return (--t) * t * ((s + 1) * t + s) + 1;
  }
}
