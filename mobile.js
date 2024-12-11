function setup() {
  createCanvas(1, 1);
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
}

function draw() {
    
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

if(shared.factoryLength >= 4) {
  document.getElementById("factoryButton").textContent = "Max. 4 Factories";
}
else {
  ocument.getElementById("factoryButton").textContent = "Add +1 Factory";

}
