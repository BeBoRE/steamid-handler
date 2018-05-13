bigInt = require('big-integer')

var Steamid = (function(undefined){
  "use strict"
  
  var _key;

  function SteamIDtype(given){
    if(given === undefined){
      return undefined;
    }
    else if(typeof given != "string"){
      return false;
    }
    else if(given.includes("steamcommunity.com")){
      if(given.includes("/profiles/")){
        return "profileURL";
      }
      else if(given.includes("/id/")){
        return "customURL";
      }
    }
    else if(given.startsWith("[") && given.endsWith("]")){
      return "steam3";
    }
    else if(given.includes("STEAM_")){
      return "steam2";
    }
    else if(!isNaN(given) && Number.isInteger(+given)){
      return "steam64";
    }
    return false;
  }

  function parseProfileURL(given){
    var n = given.substring(given.search("/profiles/") + 10,given.length);
    if (RegExp('\\D').test(n)){
      n = n.substring(0,n.search(/\D/))
    }
    return !isNaN(n) ? n : false;
  }

  function parseSteam3(given){
    if(given.startsWith("[U:1:")){
      var n;
      if(!isNaN(n = given.substring(5,given.length - 1))){
        return bigInt("76561197960265728").add(n).toString();
      }
      else{
        return false;
      }
    }
    else{
      return false;
    }
  }

  function parseSteam2(given){
    var n,
        universe = given.charAt(6),
        accnum = given.substring(10,given.length),
        lowest = given.charAt(8);
    if(!isNaN(universe+accnum+lowest)){
      if(Number.isInteger(+(universe+accnum+lowest))){
        return bigInt(universe).shiftLeft(24).add(1048577).shiftLeft(31).add(accnum).shiftLeft(1).add(lowest).toString()
      }
    }
    return false
  }

  function SteamID(given){
    this.steam64 = given;
  }

  function SteamIDContstructor(given){
    var x;
    switch(SteamIDtype(given)){
      case undefined:
        return new SteamID(undefined)
      case false:
        return false
      case "profileURL":
        x = parseProfileURL(given);
        break;
      case "customURL":
        //this.id = parseCustomURL(given);
        break;
      case "steam2":
        x = parseSteam2(given);
        break;
      case "steam3":
        x = parseSteam3(given);
        break;
      case "steam64":
        x = given;
        break;
    }
    return new SteamID(x)
  }

  SteamIDContstructor.prototype.key = function(key){
    if (typeof key == "string"){
      _key = key;
      return this;
    }
    else {
      throw "typeof key is not \"string\""
    }
  }

  SteamIDContstructor.prototype.getKey = function(){
    return _key
  }

  SteamID.prototype = Object.create(SteamIDContstructor.prototype)

  Object.defineProperty(SteamID.prototype,'steam2',{get: function(){
    var n = this.steam64;
    var firstbit = bigInt(n).and(1);
    var bit31 = bigInt(n).shiftRight(1).and(0x7FFFFFFF);
    var universe = bigInt(n).shiftRight(56).and(0xFF);
    return "STEAM_" + universe + ":" + firstbit + ":" + bit31;
  }})

  Object.defineProperty(SteamID.prototype,'steam3',{get: function(){
    return "[U:1:" + bigInt(this.steam64).and(0xFFFFFFFF) + "]";
  }})

  return SteamIDContstructor
})();

console.log(Steamid("76561197960287930").steam2)

// npm test
if (typeof module !== "undefined" && module.hasOwnProperty("exports")) {
  module.exports = Steamid;
}

//amd check
if ( typeof define === "function" && define.amd ) {
  define( "steamid-handler", [], function() {
    return Steamid;
  });
}

