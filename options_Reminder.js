/**
 * Created by sandeep_gupta on 11/11/2016.
 */

var UserReminderArray = [];

var Tempobj1 = {

    ReminderText: "Take a nap",
    ReminderAction:"Just once",
    ReminderTimer : 23,
    ReminderClock:"",
    ReminderID: 0
};


function extractIDFromString(str){

    return str.charAt(str.length -1 );
}


UserReminderArray[0] = Tempobj1;
// alert("zzzzzzzzzzzzzzz");

function print_storedArray() {

    chrome.storage.sync.get('Stored_ReminderArray_key', function (obj) {

        console.log(obj.Stored_ReminderArray_key);
    });

}



chrome.storage.sync.get('Stored_ReminderArray_key', function (obj) {

    console.log(obj);

    if(obj.Stored_ReminderArray_key ==undefined ||  obj.Stored_ReminderArray_key.length == 0)
    {
        obj = {Stored_ReminderArray_key:UserReminderArray};
        // set_BlockRow(obj);
    }
    else{
        // alert("sssssssssssss");
        console.log(UserReminderArray);
        // console.log(obj.Stored_ReminderArray_key);
        UserReminderArray = obj.Stored_ReminderArray_key;
        console.log(UserReminderArray);
    }

});


function setUserReminderArray() {
    var save = {};

    save["Stored_ReminderArray_key"] = UserReminderArray;
    // save["Stored_ReminderArray_key"] = [];
    // console.log();
    chrome.storage.sync.set(save, function() {
        // alert("STORED...");
        // console.log(save);
    });
}

function findIn_UserReminderArray(TempID){

    for(var i = 0; i< UserReminderArray.length; ++i)
    {

        // console.log(TempID +"  "+ UserReminderArray[i].ReminderID);

        // console.log("i ="+ i+"" +TempID == UserReminderArray[i].ReminderID);

        if(TempID == UserReminderArray[i].ReminderID)
        {
            console.log(i);
            // alert("returning"+ i);
            return i;
        }

    }
    // alert("returning -1");
    return -1;
}

$(".ReminderTimer").blur(function () {

    var d = new Date();
    var hours = d.getHours();
    var min = parseInt(d.getMinutes()) + parseInt($(this).val());

    if(min > 60)
    {
        min -= 60;
        hours += 1;
    }
    if(min<=9)
    {
        min = "0"+min;
    }
    if(hours<=9)
    {
        hours = "0"+hours;
    }


    // console.log(new Date($.now));
    if($(this).val()!="")
    {
         $(this).parent().next().next().children().val(hours+":"+min);

    }

});

$(".ReminderClock").blur(function () {

    // alert("blurOUT");

    var tempTime = $(this).val(); //in format hh:mm
    var tempTimeArray = tempTime.split(':');
    var tempSecond = tempTimeArray[0]*3600 + tempTimeArray[1]*60 ;//total no of seconds of the day

    //calculating total seconds passes till NOW
    var d = new Date();
    var hh = d.getHours();
    var mm = d.getMinutes();
    var ss = d.getSeconds();

    var tempSecondNow = hh*3600+ mm*60+ss;//total seconds passed since the day TILL NOW

    var tempDifference = Math.round((tempSecond - tempSecondNow)/60);
    var tempDifferenceStr = (tempDifference) + " minutes";



    var html_id_str = $(this).attr("id");
    var tempStr_suffix = html_id_str.charAt(html_id_str.length-1);

    var ReminderTimerID = "#ReminderTimer" + tempStr_suffix;

    // $(ReminderTimerID + " option:gt(0)").text(tempDifference);

    // $(ReminderTimerID).append($("<option></option>").attr("value",5).text(100));
    // $(ReminderTimerID +   'option:contains("5 Minutes")').text("TEMPEST");

    // $(ReminderTimerID + ' option[value="0"]').text( tempDifferenceStr);

    $( ReminderTimerID+'>option:eq(0)').text( tempDifferenceStr);

    //$(ReminderTimerID + ' option[value="0"]').val( tempDifference);
    // $('#ReminderTimer1').val('New Option Text');
    $( ReminderTimerID+'>option:eq(0)').attr('value', tempDifference);
   // $( ReminderTimerID+'>option:eq(0)').attr('selected', 'selected');
    $(ReminderTimerID).val(tempDifference);

});


$(".CLASS_REMINDER_Clear_individual").click(function () {

    var temp_id = $(this).attr('id');
    temp_id = extractIDFromString(temp_id);
    console.log();
        $("#ReminderText"+""+temp_id).val("");
        $("#ReminderAction"+temp_id).val("");
        $("#ReminderTimer"+temp_id).val("");
        $("#ReminderClock"+temp_id).val("");



});

$(".CLASS_REMINDER_save_individual").click(function () {

    // alert("hvk");
    var TempID          = $(this).parent().prev().children().text();
    var TempClockTime   = $(this).parent().prev().prev().children().val();
    //OR element
    var TempTime        = $(this).parent().prev().prev().prev().prev().children().val();
    var TempAction      = $(this).parent().prev().prev().prev().prev().prev().children().val();
    var TempText        = $(this).parent().prev().prev().prev().prev().prev().prev().children().val();


    //invalid input if anything is empty
    if((TempID=="" ||TempClockTime=="" )||(TempTime=="" ||TempAction=="" )||TempText=="")
    {
        alert("invalid input");
        return;
    }

    //invalid input if time is negative
    if(TempTime < 0)
    {
        alert(TempClockTime +" is already passed today");
        return;
    }


    var newObj = {

        ReminderText: TempText,
        ReminderAction:TempAction,
        ReminderTimer : TempTime,
        ReminderClock:TempClockTime,
        ReminderID: TempID
    };


    if(findIn_UserReminderArray(TempID)!=-1) //found in array
    {
        UserReminderArray[findIn_UserReminderArray(TempID)] = newObj;
    }
    else
    {
        UserReminderArray.push(newObj);
    }

    setUserReminderArray();

    alert("zxzzzzzzzzz");
});


$(document).ready(function(){

// alert("xxxxxxxxxxxxx");
// alert("hi");
    //populate the reminder rows
    // var i = 0;
    // console.log(UserReminderArray[1].ReminderText);

    for(var i=0; i<3;++i )
    {
        var temp_ReminderText_id = "#ReminderText" + i; //dont confuse between two IDs
        var temp_ReminderAction_id = "#ReminderAction" + i;
        var temp_ReminderTimer_id =  "#ReminderTimer" + i;
        var temp_ReminderClock_id=  "#ReminderClock" + i;
        var temp_ReminderID_id=  "#ReminderID" + i;

        $(temp_ReminderText_id).val(UserReminderArray[i].ReminderText);
        $(temp_ReminderAction_id).val(UserReminderArray[i].ReminderAction);
        // $(temp_ReminderTimer_id).val(UserReminderArray[i].ReminderTimer);

        $( temp_ReminderTimer_id+'>option:eq(0)').text( UserReminderArray[i].ReminderTimer + "minutes");
        $( temp_ReminderTimer_id+'>option:eq(0)').attr('value', UserReminderArray[i].ReminderTimer);
        $( temp_ReminderTimer_id+'>option:eq(0)').attr('selected', true);


        $(temp_ReminderClock_id).val(UserReminderArray[i].ReminderClock);
        $(temp_ReminderID_id).val(UserReminderArray[i].ReminderID);

    }


    // $("#ReminderButton0").parent().after( "<p>      Test</p>" );


});
//////////////////////////////////////dooooooooooooonnnnnnnneeeeeeeeeee555555555555555555