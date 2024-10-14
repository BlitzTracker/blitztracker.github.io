
//enter stats here
const tankStats = [];

//WN8 stuffs
const tankAverages = {
    1: {
        kpb:1.5,
        dpb:225,
        spb:1.25,
        cpb:1.7,
        wr:57.5
    },
    2: {
        kpb:1.4,
        dpb:260,
        spb:1.5,
        cpb:1.7,
        wr:56.5
    },
    3: {
        kpb:1.1,
        dpb:370,
        spb:1.4,
        cpb:1.5,
        wr:55.5
    },
    4: {
        kpb:1,
        dpb:430,
        spb:1.1,
        cpb:1.1,
        wr:55.5
    },
    5: {
        kpb:1.1,
        dpb:600,
        spb:1.2,
        cpb:1,
        wr:54.5
    },
    6: {
        kpb:1,
        dpb:850,
        spb:1,
        cpb:1,
        wr:53
    },
    7: {
        kpb:0.9,
        dpb:1000,
        spb:1,
        cpb:0.9,
        wr:53
    },
    8: {
        kpb:0.9,
        dpb:1350,
        spb:1,
        cpb:1,
        wr:51.5
    },
    9: {
        kpb:1,
        dpb:1550,
        spb:1,
        cpb:0.7,
        wr:51
    },
    10: {
        kpb:1,
        dpb:2000,
        spb:1,
        cpb:0.5,
        wr:50
    }
};
function getWN8(t, e) {
    if (!t.all || !e){
        return console.log("Missing parameter for making wn8..."), null;
    }
    const n = t.all;
    if (n.battles < 1){
        return 0;
    }
    const a = n.damage_dealt / n.battles,
        r = n.spotted / n.battles,
        l = n.frags / n.battles,
        s = n.wins / n.battles * 100,
        o = n.dropped_capture_points / n.battles,
        c = a / e.dpb,
        i = r / e.spb,
        b = l / e.kpb,
        u = s / e.wr;
    let p = e.cpb;
    const g = o / (p || 1e-4),
        d = Math.max(0, (u - .71) / (1 - .71)),
        f = Math.max(0, (c - .22) / .78),
        m = Math.max(0, Math.min(f + .2, (b - .12) / .88));
    return 980 * f + 210 * f * m + 155 * m * Math.max(0, Math.min(f + .1, (i - .38) / .62)) + 75 * Math.max(0, Math.min(f + .1, (g - .1) / .9)) * m + 145 * Math.min(1.8, d)
}
function getWN8Style(t) {
    return t >= 2900 ? {
        color: "#642490",
        text: "Super Unicum"
    } : t >= 2450 ? {
        color: "#980287",
        text: "Unicum"
    } : t >= 2000 ? {
        color: "#3364bb",
        text: "Great"
    } : t >= 1600 ? {
        color: "#398db5",
        text: "Very Good"
    } : t >= 1200 ? {
        color: "#446928",
        text: "Good"
    } : t >= 900 ? {
        color: "#79922c",
        text: "Above Average"
    } : t >= 650 ? {
        color: "#c7c942",
        text: "Average"
    } : t >= 450 ? {
        color: "#ffb927",
        text: "Below Average"
    } : t >= 300 ? {
        color: "#ba0006",
        text: "Bad"
    } : {
        color: "#000000",
        text: "Very Bad"
    }
}

//for ez class changing
function setByClass(c, v, a){
    var els = document.getElementsByClassName(c);
    for(var i = 0; i < els.length; i++){
        els[i][a] = v;
    }
}

var playerData = {}, clanData = {}, tankData = {}, tankopedia = {}, privateData = {}, avTier = 0;

//set statistics
function setWinRate(winRate){
    const rate = document.getElementById("win-rate");
    rate.innerHTML = '<h1 style="text-shadow: 5px 5px 2px #000000">'+winRate+'%</h1>';
    if(winRate < 50){
        rate.style.color = "white";
    }else if(winRate < 60){
        rate.style.color = "PaleGreen";
    }else if(winRate < 70){
        rate.style.color = "DeepSkyBlue";
    }else{
        rate.style.color = "MediumPurple";
    }
}
function setDamage(damage){
    document.getElementById("damage").innerHTML = `
        <div class='w3-display-right'>
            <span class='w3-opacity'>
                AVG DAMAGE
            </span><br>
            <h2>`+damage+`</h2>
        </div>`;
}
function setWN8(wn8){
    const wnEight = document.getElementById("wn8"),
        wn8Style = getWN8Style(wn8);
    wnEight.innerHTML = `
        <div class='w3-circle w3-padding w3-display-middle' style='width:137px; height:137px; background-color:`+wn8Style.color+`;'>
            WN8<br>
            <span style='font-size:3em;'>
                `+wn8+`
            </span><br>
            <span  style='font-size:0.7em;'>
            `+wn8Style.text+`
            </span>
        </div>`;
}
function setSurvival(survival){
    document.getElementById("survival").innerHTML = `
        <div class='w3-display-left'>
            <span class='w3-opacity'>
                SURVIVAL
            </span><br>
            <h2>`+survival+`%</h2>
        </div>`;
}
function setBattles(battles){
    document.getElementById("battles").innerHTML = `
        <br>
        <span class='w3-opacity'>
            BATTLES
        </span><br>
        <h2>`+battles+`</h2>`;
}
function setUserName(name){
    setByClass("username", name, "innerHTML");
}
function setClanTag(tag, id){
    setByClass("clanTag", "["+tag+"]", "innerHTML");
    setByClass("clanTag", "https://www.blitzstars.com/clan/com/"+id, "href");
}
function setPlayerStats(stats){

    setWN8(0);
    setBattles(stats.battles);
    setWinRate((((stats.wins/stats.battles)||0)*100).toFixed(2));
    setSurvival((((stats.survived_battles/stats.battles)||0)*100).toFixed(2));
    setDamage(Math.round(stats.damage_dealt/stats.battles)||0);

}
function setClanStats(stats){

    setClanTag(stats.tag, stats.clan_id);

}
function clearClanStats(){

    setClanTag("No clan", 114132);

}

//tank table
const tanks = document.getElementById("tankStats"),
    tanksHead = document.getElementById("tankStatsHead");
var reverseTankTable = false;

function fillTankTable(){

    const tanksClass = "w3-border-top w3-center w3-padding",
        tankHeadData = [
            {
                name: "Name",
                type: "alphabetic"
            },
            {
                name: "WN8",
                type: "numeric",
            },
            {
                name: "Battles",
                type: "numeric",
            },
            {
                name: "Win Rate",
                type: "numeric",
            },
            {
                name: "Damage",
                type: "numeric",
            },
            {
                name: "Wins",
                type: "numeric",
            },
            {
                name: "Losses",
                type: "numeric",
            },
            {
                name: "Tier",
                type: "numeric",
            }
        ];
    
    tanks.innerHTML = "";
    tanksHead.innerHTML = "";
    
    //fill head
    var tankHead = '<tr class="w3-black" style="position:sticky; top:0px;">';
    tankHeadData.forEach(function(data, idx){
        tankHead += `<th class="w3-center w3-padding tank-`+data.type+` tank-`+idx+`" onClick = "sortTanks(this);">`+data.name+`</th>`;
    });
    tankHead += "</tr>";
    tanksHead.innerHTML += tankHead;

    //fill table
    tankStats.forEach(function(tank){

        var tr = document.createElement("tr"), td;
        tr.stats = tank.stats;
        tr.tank = tank.tank;
        tr.addEventListener("click", function(){

            const tank = this.tank;
            const stats = this.stats;
            var popup = document.getElementById("popup");
            popup.style.display = "block";
            popup.children[1].children[1].innerHTML = `
                <h1 style="display: inline-block;" class="w3-margin">
                    `+tank.name+`
                </h1>
                <img src="`+tank.images.preview+`" style="width: 200px;" class="w3-margin">
                <div class="w3-container">
                    <div class="w3-container">
                        <h3>Totals</h3>
                        <div class="w3-center">
                            <p class="w3-opacity" style="text-align: left;">
                                BATTLES `+stats.all.battles+`<br>
                                SURVIVED `+stats.all.survived_battles+`<br>
                                WINS `+stats.all.wins+`<br>
                                LOSSES `+stats.all.losses+`<br>
                                DAMAGE DEALT `+stats.all.damage_dealt+`<br>
                                DAMAGE RECEIVED `+stats.all.damage_received+`<br>
                                SPOTS `+stats.all.spotted+`<br>
                                SHOTS `+stats.all.shots+`<br>
                                HITS `+stats.all.hits+`<br>
                            </p>
                        </div>
                    </div>
                </div>
            `;
            /*

            **TOTALS**
            battles
            survived
            wins
            losses
            damage dealt
            damage received
            spots
            shots
            hits
            kills
            deaths (battles-survived)
            xp

            **PERCENTAGES**
            winrate (wins/battles)
            survival (survived/battles)
            accuracy (hits/shots)
            
            **PER BATTLE**
            damage per battle
            damage received per battle
            kills per battle
            spots per battle
            shots per battle
            hits per battle
            xp per battle

            **OTHER**
            kill death ratio
            most xp
            most kills


            */
            console.log(tank);
            console.log(stats);
           
        });

        td = document.createElement("td");
        w3.addClass(td, tanksClass);
        td.innerHTML = tank.name;
        tr.appendChild(td);

        td = document.createElement("td");
        w3.addClass(td, tanksClass);
        td.innerHTML = tank.WN8+"<br>"+getWN8Style(tank.WN8).text;
        td.style.backgroundColor = getWN8Style(tank.WN8).color;
        tr.appendChild(td);

        td = document.createElement("td");
        w3.addClass(td, tanksClass);
        td.innerHTML = tank.battles;
        tr.appendChild(td);

        td = document.createElement("td");
        w3.addClass(td, tanksClass);
        td.innerHTML = (((tank.wins/tank.battles)*100)||0).toFixed(2)+"%";
        tr.appendChild(td);

        td = document.createElement("td");
        w3.addClass(td, tanksClass);
        td.innerHTML = tank.damage;
        tr.appendChild(td);

        td = document.createElement("td");
        w3.addClass(td, tanksClass);
        td.innerHTML = tank.wins;
        tr.appendChild(td);

        td = document.createElement("td");
        w3.addClass(td, tanksClass);
        td.innerHTML = (tank.battles-tank.wins);
        tr.appendChild(td);

        td = document.createElement("td");
        w3.addClass(td, tanksClass);
        td.innerHTML = tank.tier;
        tr.appendChild(td);

        tanks.appendChild(tr);

    });

}
function sortTanks(tank){
    
    if(tank.className.match("w3-green") || tank.className.match("w3-teal")){
        reverseTankTable = !reverseTankTable;
    }

    if(tank.className.match("tank-image")){
        return;
    }

    if(tank.className.match("tank-alphabetic")){
        tankStats.sort(function(a, b){
            return reverseTankTable?([a.name, b.name].sort()[0] === a.name ? 1 : -1):([a.name, b.name].sort()[0] === a.name ? -1 : 1);
        });
    }

    if(tank.className.match("tank-numeric")){
        switch(tank.innerHTML){
            case "WN8":
                tankStats.sort(function(a, b){
                    return reverseTankTable?(a.WN8-b.WN8):(b.WN8-a.WN8);
                });
                break;
            case "Battles":
                tankStats.sort(function(a, b){
                    return reverseTankTable?(a.battles-b.battles):(b.battles-a.battles);
                });
                break;
            case "Win Rate":
                tankStats.sort(function(a, b){
                    return reverseTankTable?((a.wins/a.battles)*100)-((b.wins/b.battles)*100):((b.wins/b.battles)*100)-((a.wins/a.battles)*100);
                });
                break;
            case "Damage":
                tankStats.sort(function(a, b){
                    return reverseTankTable?(a.damage-b.damage):(b.damage-a.damage);
                });
                break;
            case "Wins":
                tankStats.sort(function(a, b){
                    return reverseTankTable?(a.wins-b.wins):(b.wins-a.wins);
                });
                break;
            case "Losses":
                tankStats.sort(function(a, b){
                    return reverseTankTable?((b.battles-b.wins)-(a.battles-a.wins)):((a.battles-a.wins)-(b.battles-b.wins));
                });
                break;
            case "Tier":
                tankStats.sort(function(a, b){
                    return reverseTankTable?(a.tier-b.tier):(b.tier-a.tier);
                });
                break;
        }
    }
    
    fillTankTable();

    //style
    const tankClass = tank.className.match(/tank-\d/);
    w3.addClass("."+tankClass, reverseTankTable?"w3-teal":"w3-green");

}
