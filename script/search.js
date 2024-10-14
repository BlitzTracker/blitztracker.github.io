
/*
temporary access to ruttut
?&status=ok&access_token=29147bc3f3994a8e5da39560c1b8757b29956f32&nickname=RuTTuTAimNShuT&account_id=1059341696&expires_at=1720386333
*/

var urlData = {};

//accordion
function accordion(id) {
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}

//search bar
var searchResults = document.getElementById("searchResults"),
    playerSearch = document.getElementById("playerSearch");

//use wargaming API to get player data
const apiKey = '7d564c0f44f75d81183dcdb36c88c778';
function searchPlayers(name){
    
    fetch(`https://api.wotblitz.com/wotb/account/list/?application_id=${apiKey}&search=${name}`)
        .then(response => response.json())
        .then(data => {

            searchResults.innerHTML = "";
            if(data.data){
                
                for(var i = 0; i < data.data.length; i++){

                    var item = document.createElement("span");
                    item.innerHTML = data.data[i].nickname;
                    w3.addClass(item, "w3-bar-item w3-button");
                    item.id = data.data[i].account_id;
                    item.addEventListener("click", function(){

                        //change url
                        window.location.search = "?account_id="+this.id;

                    });

                    searchResults.appendChild(item);

                }

            }

        }).catch(error => console.error('Error searching players: ', error));

}
function getPlayerData(id){

    //30 day statistics by blitz stars
    var monthStats = document.getElementById("monthStats");
    monthStats.src = "https://www.blitzstars.com/sigs/"+id;
    monthStats.style.display = "none";
    monthStats.addEventListener("load", function(){
        monthStats.style.display = "inline-block";
    });

    //remove loader
    const loaders = document.getElementsByClassName("loader");
    for(var loader = 0; loader < loaders.length; loader++){
        loaders[loader].style.display = "none";
    }

    //show content
    const contents = document.getElementsByClassName("content");
    for(var content = 0; content < contents.length; content++){
        contents[content].style.display = "block";
    }

    //player
    fetch(`https://api.wotblitz.com/wotb/account/info/?application_id=${apiKey}&account_id=${id}&extra=statistics.rating`+(urlData.access_token?"&access_token="+urlData.access_token:""))
        .then(response => response.json())
        .then(data => {

            playerData = data.data[id];
            privateData = playerData.private;
            playerSearch.value = playerData.nickname;
            setUserName(playerData.nickname);
            setPlayerStats(playerData.statistics.all);
            
        }).catch(error => console.error('Error obtaining player data: ', error));

    //clan
    fetch(`https://api.wotblitz.com/wotb/clans/accountinfo/?application_id=${apiKey}&account_id=${id}`)
        .then(response => response.json())
        .then(data => {

            if(data.data[id]){

                const clanId = data.data[id].clan_id;
                fetch(`https://api.wotblitz.com/wotb/clans/info/?application_id=${apiKey}&clan_id=${clanId}`)
                    .then(response => response.json())
                    .then(data => {

                        clanData = data.data[clanId];
                        setClanStats(data.data[clanId]);
                        
                    }).catch(error => console.error('Error obtaining clan statistics: ', error));
                
            }else{
                clearClanStats();
            }

        }).catch(error => console.error('Error obtaining player\'s clan: ', error));
    
    //tanks
    fetch(`https://api.wotblitz.com/wotb/tanks/stats/?application_id=${apiKey}&account_id=${id}`)
        .then(response => response.json())
        .then(data => {

            tankStats.splice(0, tankStats.length-1);
            avTier = 0;

            var stats = data.data[id];
            stats.forEach(stats => {

                const tank = (tankopedia[stats.tank_id]||undefined);
                if(tank && stats.all.battles){

                    tankStats.push(
                        {
                            name: tank.name,
                            battles: stats.all.battles,
                            wins: stats.all.wins,
                            damage: Math.round(stats.all.damage_dealt/stats.all.battles)||0,
                            tier: tank.tier,
                            WN8: Math.round(getWN8(stats, tankAverages[tank.tier])),
                            tank: tank,
                            stats: stats
                        },
                    );
                    avTier += tank.tier*stats.all.battles;

                }

            });

            avTier /= playerData.statistics.all.battles;
            setWN8(Math.round(getWN8(playerData.statistics, tankAverages[Math.ceil(avTier)])));

            fillTankTable();
            sortTanks(tanks.children[0].children[1]);
            
        }).catch(error => console.error('Error obtaining player\'s tanks: ', error));

}

//search with enter
document.getElementById("playerSearchForm").addEventListener("submit", function(e){

    e.preventDefault();
    if(searchResults.children.length){

        //change url
        window.location.search = "?account_id="+searchResults.children[0].id;
        
    }

});

//detect mouse over dropdown
searchResults.addEventListener("mouseover", function(){
    searchResults.mouseIsOver = true;
});
searchResults.addEventListener("mouseout", function(){
    searchResults.mouseIsOver = false;
});

//hide/show dropdown
function hideSearchBar(){
    if(!searchResults.mouseIsOver){
        searchResults.style.display = "none";
    }
}
function showSearchBar(){
    searchResults.style.display = "block";
}

//login to wargaming
function logIn(){

    fetch(`https://api.worldoftanks.com/wot/auth/login/?application_id=${apiKey}&nofollow=1&redirect_uri=https%3A%2F%2Fblitztracker.w3spaces.com%2Findex.html`)
        .then(response => response.json())
        .then(data => {

        var popup = document.getElementById("popup");
        popup.style.display = "block";
        popup.children[1].children[1].innerHTML = `<h3>Do you want to log in?</h3><a class="w3-button" href=${data.data.location}>yes</a>`;
        
    }).catch(error => console.error('Unable to log in: ', error));
    
}
function logOut(){

    fetch(`https://api.worldoftanks.com/wot/auth/logout/?application_id=${apiKey}&access_token=${urlData.access_token}`)
        .then(response => response.json())
        .then(data => {

        window.location.search = "";
        
    }).catch(error => console.error('Unable to log in: ', error));

}

//on & off line detection
function online(){
    document.getElementById("offline-warning").style.display = "none";
}
function offline(){
    document.getElementById("offline-warning").style.display = "block";
}

//find data contained in url
var data = window.location.search.match(/[^?]/g);
if(data){
    data.toString()
        .replace(/,/g, "")
        .split("&").forEach(function(value){
            urlData[value.split("=")[0]] = value.split("=")[1];
        });
}
if(urlData.access_token){
    var els = document.getElementsByClassName("logout");
    for(var i = 0; i < els.length; i++){
        els[i].style.display = "block";
    }
}else{
    var els = document.getElementsByClassName("login");
    for(var i = 0; i < els.length; i++){
        els[i].style.display = "block";
    }
}

//hide content
const contents = document.getElementsByClassName("content");
for(var content = 0; content < contents.length; content++){
    contents[content].style.display = "none";
}

//load tanks
fetch(`https://api.wotblitz.com/wotb/encyclopedia/vehicles/?application_id=${apiKey}`)
    .then(response => response.json())
    .then(data => {
    
    tankopedia = data.data;
    
    //tanks have loaded, handle searching of players
    if(urlData.account_id){

        getPlayerData(urlData.account_id);

    }else{

        //load me in XD I'm so amazing haha
        getPlayerData("1057061222");

    }
    
}).catch(error => console.error('Failed to load tankopedia: ', error));
