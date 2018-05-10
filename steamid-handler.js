bigInt = require('big-integer')

var Steamid = (function(undefined){
  "use strict"

  function SteamIDtype(given,throwError = true){
    if(typeof given != "string"){
      return false;
    }
    else if(given.includes("steampowered.com")){
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
    else if(isNaN(given)){
      return "steam64";
    }
  }

  function SteamID(given){
    return SteamIDtype(given);
  }

  return SteamID;
})();

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