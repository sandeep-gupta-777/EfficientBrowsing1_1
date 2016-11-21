/**
 * Created by sandeep_gupta on 11/15/2016.
 */

var UserReminderArray_background = [];
getReminderArray();
setReminders();

function getReminderArray() {

    chrome.storage.sync.get('Stored_ReminderArray_key', function (obj) {

        UserReminderArray_background = obj.Stored_ReminderArray_key;
        alert("THIS SHOULD BE FIRST");
    });
    setTimeout(setReminders,500);

}

function setReminders() {
    alert("THIS SHOULD BE SECOND");
    UserReminderArray_background.forEach(function (item, index) {

        if(item.ReminderText == "")
        {
            return;
        }

        setTimeout(function () {
            alert("Reminder: " + item.ReminderText);

            //clear obj.Stored_ReminderArray_key[index]
            UserReminderArray_background[index].ReminderText = "";
            UserReminderArray_background[index].ReminderAction = "";
            UserReminderArray_background[index].ReminderTimer = "";
            UserReminderArray_background[index].ReminderClock = "";

            setUserReminderArray();

        },item.ReminderTimer *60000);

    });

}

chrome.storage.onChanged.addListener(function(changes, namespace) {

    for (key in changes) {
        var storageChange = changes[key];
        if(key == "Stored_ReminderArray_key")
        {
            alert("in storage on changedllllllllllllllllllllllllll");
            // alert("reminder changed");
            getReminderArray();
        }
    }
});

function setUserReminderArray() {
    var save = {};
    save["Stored_ReminderArray_key"] = UserReminderArray_background;
    chrome.storage.sync.set(save, function() {

    });
}

$(document).ready(function(){



});