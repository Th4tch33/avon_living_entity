class animal {
  PVector pos;
  PVector transPos;
  PVector newLocation;
  int waitTime;
  int waitTimer;
  int animalType;
  int animationType;
  float speed;
  boolean moving;
  float size;
  float range;
  PImage[] asset;
  boolean direction;
  
  int assetTracker;
  
  float scaleFactor = 0;  // Scale factor for the rectangle
  float targetScale = 1;  // Final scale size
  float easingDuration = 0.35;  // Duration of the easing animation (in seconds)
  float currentTime = 0;  // Time tracker for the animation
  boolean animating = true;  // Flag to track if the animation is running

  //animType 0 = deer 1 = swan
  animal(PVector pos, PVector transPos, PVector newLocation, int waitTime, int waitTimer, int animalType, boolean moving, float speed, float size, float range, PImage[] asset, boolean direction, int animationType) {
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

  void newLocationFinder() {
    if (!moving && waitTimer == 0) {
        moving = true;

        // Generate a new random location
        newLocation.x = random(-range / 2, range / 2);
        newLocation.y = random(-range / 2, range / 2);
        
        if(animalType == 0) {
          // Adjust while loop to only keep generating if out of bounds or not traversable
          while (xBoundaryTest() || yBoundaryTest() || !isTraversable(Math.round(newLocation.x + pos.x), Math.round(newLocation.y + pos.y))) {  
            
            newLocation.x = random(-range / 2, range / 2);
            newLocation.y = random(-range / 2, range / 2);
          }
        }
        else {
          while (xBoundaryTest() || yBoundaryTest() || isTraversable(Math.round(newLocation.x + pos.x), Math.round(newLocation.y + pos.y))) {  
            newLocation.x = random(-range / 2, range / 2);
            newLocation.y = random(-range / 2, range / 2);
          }
        }
    } else if (!moving && waitTimer > 0) {
        waitTimer--;
        
        assetTracker = 0;
    }
  }

  boolean xBoundaryTest() {
    return pos.x + newLocation.x < 0 || pos.x + newLocation.x > width;
  }
  
  boolean yBoundaryTest() {
    return pos.y + newLocation.y < height * 0.1 || pos.y + newLocation.y > height;
  }

  void movementManager() {
    if(animalType == 0) {
      jump();  
    }
    else {
      walk();
    }
  }
  
  void walk() {
    newLocationFinder();

    if(moving == true) {  
      
      float loopIncrementx = newLocation.x / speed;
      float loopIncrementy = newLocation.y / speed;
      
      if(loopIncrementx > 0) {
        direction = false;
      }
      else {
        direction = true;
      }
      
      transPos.x += loopIncrementx;
      transPos.y += loopIncrementy;
      
      if(loopIncrementx < 0 && transPos.x + pos.x < newLocation.x + pos.x) {
        moving = false;
        waitTimer = waitTime;
        
        pos.x += newLocation.x;
        pos.y += newLocation.y;
        
        newLocation.x = 0;
        newLocation.y = 0;
        
        transPos.x = 0;
        transPos.y = 0;
        
        assetTracker = 0;
      }
      else if(loopIncrementx > 0 && transPos.x + pos.x > newLocation.x + pos.x) {
        moving = false;
        waitTimer = waitTime;
        
        pos.x += newLocation.x;
        pos.y += newLocation.y;
        
        newLocation.x = 0;
        newLocation.y = 0;
        
        transPos.x = 0;
        transPos.y = 0;
        
        assetTracker = 0;
      }
    }
  }

  void jump() {
    assetTracker = 2;
    
    float a;
    float b;
    
    newLocationFinder();

    a = 2 / abs(newLocation.x);
    b = newLocation.y / newLocation.x - a * newLocation.x;
    
    if(moving == true) {  
      
      float loopIncrement = newLocation.x / speed;
      
      if(loopIncrement > 0) {
        direction = false;
      }
      else {
        direction = true;
      }
      
      transPos.x += loopIncrement;      
      transPos.y = a * pow(transPos.x , 2) + b * transPos.x;
      
      if(loopIncrement < 0 && transPos.x + pos.x < newLocation.x + pos.x) {
        moving = false;
        waitTimer = waitTime;
        
        pos.x += newLocation.x;
        pos.y += newLocation.y;
        
        newLocation.x = 0;
        newLocation.y = 0;
        
        transPos.x = 0;
        transPos.y = 0;
      }
      else if(loopIncrement > 0 && transPos.x + pos.x > newLocation.x + pos.x) {
        moving = false;
        waitTimer = waitTime;
        
        pos.x += newLocation.x;
        pos.y += newLocation.y;
        
        newLocation.x = 0;
        newLocation.y = 0;
        
        transPos.x = 0;
        transPos.y = 0;
      }
    }
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

  void display() {
      float scaleFactor = spawnAnimation();
      float scaledSize = size * scaleFactor;
    
      // Push the current matrix onto the stack
      pushMatrix();
  
        // Move the origin to the position of the animal before scaling
        translate(transPos.x + pos.x, transPos.y + pos.y);
    
        // Flip the image horizontally if the direction is false
        if(direction == false) {
            scale(-1, 1);
        }
    
        // Draw the image centered at the origin
        image(asset[assetTracker], -scaledSize / 2, -scaledSize, scaledSize, scaledSize); // Centering the image by using negative size/2
  
      // Pop the matrix to return to the previous state
      popMatrix();
  }

  void movementVisualizer() {
    strokeWeight(4);
    stroke(0);
    
    point(pos.x + newLocation.x, pos.y + newLocation.y);
    
    float a = 2 / abs(newLocation.x);
    float b = newLocation.y / newLocation.x - a * newLocation.x;
    
    float loopIncrement = 0.1;
    
    if(newLocation.x > 0) {
      for(float i = 0; i < newLocation.x; i += loopIncrement) {
        float y = a * pow(i, 2) + b * i;
        
        strokeWeight(1);
        stroke(0, 0, 255);
        point(i + pos.x, y + pos.y);
      }
    }
    else {
      for(float i = 0; i > newLocation.x; i -= loopIncrement) {
        float y = a * pow(i, 2) + b * i;
        
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
