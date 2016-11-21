/**
 * Created by sandeep_gupta on 11/18/2016.
 */

var actualTodayDate;
var lastUpdatedDate;
var nextScheduledTimeStamp = todaysEODinMilliseconds();//Milliseconds
var flag = 0; //this flag is to make sure checkFor_nextScheduledTimeStamp() runs only once

//if currentTime is > nextScheduledTimeStamp update HistoryArray
function checkFor_nextScheduledTimeStamp() {

    var temp_currentTime = new Date().getTime(); //Milliseconds
    if(temp_currentTime > nextScheduledTimeStamp)
    {
        pushInHistoryArray();
        //next time stamp will be next days' 23:59
        nextScheduledTimeStamp += 86400000;
    }
    //check for End of day every 1 hour
    setTimeout(function() {checkFor_nextScheduledTimeStamp() }, 3600000);
}

function todaysEODinMilliseconds() {

    var d = new Date();
    d.setHours(23);
    d.setMinutes(59);
    d.setSeconds(59);

    return d.getTime(); //returns today's 23:59:59

}




