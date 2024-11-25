class building {
  int buildingType;
  PVector pos;
  float size;
  PImage asset;
  PVector smokePos;
  float smokeSpeed;
  float smokeHeight;
  float closeness;
  boolean state;
  
  public float scaleFactor = 0;  // Scale factor for the rectangle
  public float easingDuration = 0.35;  // Duration of the easing animation (in seconds)
  public float currentTime = 0;  // Time tracker for the animation
  public boolean animating = true;  // Flag to track if the animation is running
  
  ArrayList<person> workers = new ArrayList<>();
  
  //buildingType 0 = Nature 1 = Factory 2 = Residential
  building(int buildingType, PVector pos, float size, PImage asset, PVector smokePos, float smokeSpeed, float smokeHeight, float closeness, boolean state) {
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
  
  boolean xBoundaryTest() {
    return pos.x < 0 || pos.x > width;
  }
  
  boolean yBoundaryTest() {
    return pos.y < height * 0.1 || pos.y > height;
  }
  
  void smokeManager() {    
    if(buildingType == 1) {
      smokePos.y -= smokeSpeed;
    
      if(smokePos.y < pos.y - smokeHeight) {
        smokePos.y = pos.y;
      }
      
      if(pos.y - smokePos.y < smokeHeight * 0.2) {    
        tint(255, (pos.y - smokePos.y) * 255 / 20);
      }
      else if (pos.y - smokePos.y > smokeHeight * 0.8) {
        tint(255, abs((pos.y - smokeHeight - smokePos.y) * 255 / 20));
      }
      else {
        tint(255, 255);
      }
      
      image(smokeAsset, smokePos.x - size / 2, smokePos.y - size, size, size);
      tint(255, 255);
    }
  }

  void display() {
    smokeManager();
    
    animationManager(this);
    
    float scaledSize = size * scaleFactor;
    
    image(asset, pos.x - scaledSize / 2, pos.y - scaledSize, scaledSize, scaledSize); // Centering the image by using negative size/2
    
    if(buildingType == 1 || buildingType == 2) {
      childManager(workers, buildingType);
    }
  }
  
  void childManager(ArrayList<person> person, int buildingType) {

    if(buildingType == 1) {
      int maxPeople = 3;
    
      if(person.size() < maxPeople) {
        for(int i = person.size(); i < maxPeople; i++) {
          spawnPerson(pos.x, pos.y, person, 1);
        }
      }
      
      for(person worker : person) {
        worker.display();
        worker.movementManager(this);
      }
    }
    else {
      int maxPeople = 1;
    
      if(person.size() < maxPeople) {
        for(int i = person.size(); i < maxPeople; i++) {
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
