"use strict";

window.addEventListener('load',initialize);

let allPlayers;
const source = 'https://sammydhulster.github.io/DartsData/api/data.json';

let countries, players, selectedCountry;
let slcCountries, divPlayers, divFlag, sctDetails, sctOrdered;

function initialize(){
    slcCountries = document.querySelector('#slcCountry');
    divPlayers = document.querySelector('#divDarters');
    divFlag = document.querySelector('#divFlag');
    sctDetails = document.querySelector('.details');
    sctOrdered = document.querySelector('#ordered');
    allPlayers = JSON.parse(dataDart);

    slcCountries.addEventListener('change', createPlayerCards);
    fillCountries();
    createPlayerCards();
}

async function getJsonData(source) {
    fetch(source)
	.then(resp => resp.json()
	)
	.then(data =>{
		allPlayers = data;
        createPlayerCards();
    })
	.catch(error => console.log(error));
}

function fillCountries()
{
  slcCountries.innerHTML = ""; 
  countries = [];
  for (const key in allPlayers) {
    countries.push(key);
  }
    countries.forEach(country => {
        const option = document.createElement("option");
        option.value = country;
        option.text = country;
        slcCountries.appendChild(option);
      });
}

function filteredPlayers() {
    divPlayers.innerHTML = "";
    selectedCountry = slcCountries[slcCountries.selectedIndex].value;
    addFlag(selectedCountry);
    const players = allPlayers[selectedCountry].Players;
    return players;
  }

function createPlayerCards(){
    players = filteredPlayers();

    players.forEach(player => {
      divPlayers.appendChild(createCard(player));
    });

    emptyRankings();
}

function emptyRankings(){
  sctOrdered.innerHTML = `Can you Order on PDC Ranking ? Click countryflag to see solution !`;
}

function createCard(element){
  let playerFgr = document.createElement('figure');
  divPlayers.className = 'orderbox';
  const newImg = document.createElement('img');
  let nameNoSpaces = element.name.replace(/ /g, '');
  if(nameNoSpaces === 'GerwinPrice'){
    nameNoSpaces = nameNoSpaces.replace('i', 'y');
  }
  newImg.src = `img/Players/${nameNoSpaces}.png`;
  newImg.id = element.short;
  newImg.alt = element.name;
  newImg.setAttribute('title', element.name);
  newImg.addEventListener('mouseenter', showDetails);

  playerFgr.appendChild(newImg);

  const newfgC = document.createElement('figcaption');
  newfgC.textContent = element.name;
  playerFgr.appendChild(newfgC);
  return playerFgr;
}

function addFlag(country){
  divFlag.innerHTML = "";
  const newImg = document.createElement('img');
  newImg.src = `img/Flags/${country}.gif`;
  newImg.alt = country;
  newImg.addEventListener('click', showRankedPlayers);

  divFlag.appendChild(newImg);
}

function showDetails(){
  this.removeEventListener('mouseenter', showDetails);
  this.addEventListener('mouseleave', hideDetails);

  const short = this.id;
  const selectedPlayer = players.find(player => player.short == short);

  const age = calculateAge(selectedPlayer);

  const hdgName = document.createElement('h3');
  hdgName.textContent = 'Name';

  const pName = document.createElement('p');
  pName.textContent = selectedPlayer.name;

  const hdgNickName = document.createElement('h3');
  hdgNickName.textContent = 'NickName';

  const pNickName = document.createElement('p');
  pNickName.textContent = selectedPlayer.nickName;

  const hdgAge = document.createElement('h3');
  hdgAge.textContent = 'Age';

  const pAge = document.createElement('p');
  pAge.textContent =  age.toString();

  sctDetails.appendChild(hdgName);
  sctDetails.appendChild(pName);
  sctDetails.appendChild(hdgNickName);
  sctDetails.appendChild(pNickName);
  sctDetails.appendChild(hdgAge);
  sctDetails.appendChild(pAge);

  showTitles(selectedPlayer);

}

function hideDetails(){
  this.removeEventListener('mouseenter', hideDetails);
  this.addEventListener('mouseenter', showDetails);
  sctDetails.innerHTML = "";
}

function calculateAge(player){
  const birthDatesrt = player.birthdate;
  const birthDate = new Date(birthDatesrt);
  const currentDate = new Date();

  let age = currentDate.getFullYear() - birthDate.getFullYear();

  const birthMonth = birthDate.getMonth() + 1; 
  const currentMonth = currentDate.getMonth() + 1;
  
  if (currentMonth < birthMonth) {
    age--; 
  } else if (currentMonth === birthMonth) {
    const birthDay = birthDate.getDate();
    const currentDay = currentDate.getDate();
  
    if (currentDay < birthDay) {
      age--;
    }
  }
  return age;
}

function showTitles(player){

  const hdgTitles = document.createElement('h3');
  hdgTitles.textContent = 'Title(s)';

  const pTitles = document.createElement('p');
  const amountofTitles = player.titles;
  let titleContent = "";
  if(amountofTitles > 0){
    titleContent = amountofTitles.toString();
  }
  else{
    titleContent = "No titles yet!";
  }

  pTitles.textContent = titleContent;
  pTitles.classList.add('titles');
  
  sctDetails.appendChild(hdgTitles);
  sctDetails.appendChild(pTitles);
}

function showRankedPlayers(){
  sctOrdered.innerHTML = "";
  const rankedPlayersDiv = document.createElement('div');
  rankedPlayersDiv.className = 'orderbox';
  let playerRanks = [];

  players.forEach(player => {
    let ranking = player.PDCRanking;
    playerRanks.push(ranking);
  });

  playerRanks.sort((a, b) => a - b);

  let sortedListPlayers = playerRanks.map(rank => {
    return players.find(player => player.PDCRanking === rank);
  });

  sortedListPlayers.forEach(player => {
    const figure = createCard(player);
    const newPRank = document.createElement('p');
    newPRank.textContent = "PDCRanking: " + player.PDCRanking.toString();
    rankedPlayersDiv.appendChild(newPRank);
    figure.appendChild(newPRank);
    rankedPlayersDiv.appendChild(figure);
});
  sctOrdered.appendChild(rankedPlayersDiv);
}


