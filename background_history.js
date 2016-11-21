/**
 * Created by sandeep_gupta on 11/15/2016.
 */

var History_array =[]; //{date, websiteName,totalTimeArray }

chrome.storage.sync.get('History_Array_key', function (obj) {
    console.log(obj);
    if(obj.History_Array_key != undefined)
        History_array = obj.History_Array_key;
});

function clearURLArray() {
    var save = {};
    save["myKey"] = [];

    chrome.storage.sync.set(save, function() {
        // console.log('Settings saved');
    });
}

function setHistoryArray() {
    var save = {};
    save["History_Array_key"] = History_array;
   // save["History_Array_key"] = [];

    chrome.storage.sync.set(save, function() {
        // console.log('Settings saved');
    });
}

function findInHistoryArray(str) {
    for(var i=0;i<History_array.length;++i)
    {
        if(str == History_array[i].website)
        {
            return i;
        }
    }
    // alert("returning -1");
   return -1;
}



function pushInHistoryArray() {
            // alert("jjjj ");
    for(var i =0; i< URLarray.length;++i)
    {
        var tempTimeNOW = (new Date()).getTime();
        var tempTimeObj =
        {
            time:(URLarray[i].time),//time of website usage
            date: tempTimeNOW
        };
        // alert(findInHistoryArray(URLarray[i].website)==-1);
        if(findInHistoryArray(URLarray[i].website)==-1) //website not found in HistoryArray
        {
            // alert("hi");
            var tempObj =
            {
                website: URLarray[i].website,
                dateTimeArray : [] // an array of {date:xx, time:xx}
            };

            tempObj.dateTimeArray.push(tempTimeObj);
            History_array.push(tempObj);
        }
        else
        {
            var tempIndex = findInHistoryArray(URLarray[i].website);
            History_array[tempIndex].dateTimeArray.push(tempTimeObj);
        }
    }
    setHistoryArray();

    //YET TO BE DONE: CLEAR THE URLarray
    clearURLArray();

}



$(document).ready(function(){

    //YET TO BE DONE
    //Every One hour keep checking for next day
    //as soon as its next day, run pushInHistoryArray

});