function setup() {
    partyConnect("wss://deepstream-server-1.herokuapp.com", "avonLivingEntity");
  
    // Create a shared variable (this will be the same across devices)
    sharedData = {
        natureTrigger: party.variable("natureTrigger", false),
        factoryTrigger: party.variable("factoryTrigger", false),
        settlementTrigger: party.variable("settlementTrigger", false)
    };
        
    sharedData.natureTrigger.on("update", (value) => {
        console.log("natureTrigger updated:", value);
    });

    sharedData.factoryTrigger.on("update", (value) => {
        console.log("factoryTrigger updated:", value);
    });

    sharedData.settlementTrigger.on("update", (value) => {
        console.log("settlementTrigger updated:", value);
    });
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