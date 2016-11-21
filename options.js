/**
 * Created by k on 11/5/2016.
 */

var UserInputArray =[];

var BLOCK_LastRowID = 2;
var Block_row_number ;

var rowDataArray = [""];


chrome.storage.sync.get('Stored_BlockedArray_key', function (obj) {
    // console.log('myKey', obj);

    if(obj.Stored_BlockedArray_key != undefined)
        UserInputArray = obj.Stored_BlockedArray_key;
});


function modify_BLOCK_Rows(suffix_id, website,time,Action,image) {

    var temp_website_id_prefix = "#BLOCK_ENTER_WEBSITE";
    var temp_Time_id_prefix = "#BLOCK_Time";
    var temp_Action_id_prefix = "#BLOCK_Action";
    // var temp_Image_id_prefix = "#BLOCK_ENTER_WEBSITE";
    // var temp_ID_id_prefix = "#BLOCK_ENTER_WEBSITE"; //dont confuse between two IDs


    $(temp_website_id_prefix + suffix_id).val(website);
    $(temp_Time_id_prefix + suffix_id).val(time);
    $(temp_Action_id_prefix + suffix_id).val(Action);

}

function print_storage_imputArray(){
    console.log();
    chrome.storage.sync.get('Stored_BlockedArray_key', function (obj) {
        // console.log('myKey', obj);

        console.log(obj.Stored_BlockedArray_key);
    });
}

function setInputArray() {
    var save = {};
    save["Stored_BlockedArray_key"] = UserInputArray;

    chrome.storage.sync.set(save, function() {
        // console.log('Settings saved');
    });
}

function removeDataFrom_UserInputArray(TempID){
    for(var i=0;i<UserInputArray.length;++i)
    {
        if(TempID == UserInputArray[i].TempID)
        {
            //remove ith element
            UserInputArray.splice(i, 1);
        }
    }
}

chrome.storage.sync.get("x", function (obj){

    if(obj.x ==undefined)
    {
        Block_row_number = 3;
        obj = {x:3};
        set_BlockRow(obj);
    }
    else{
        Block_row_number = obj.x;
    }
});

function print_storage(){

    chrome.storage.sync.get("x", function (obj){
        console.log(obj.x);
    });
}

function set_BlockRow(obj) {
    chrome.storage.sync.set(obj, function() {
        console.log(obj);
    });
}

function modify_x(temp) {
    chrome.storage.sync.get("x", function (obj){
        obj.x = temp;
        set_BlockRow(obj);
    });
}
function modify_Array() {
    chrome.storage.sync.get("UserArray", function (obj){
        obj.UserArray = UserInputArray;
        console.log(obj);
        set_BlockRow(obj);
    });
}

function createBlockRow(i) {
    // alert("createBlockRow");
    var row = $('#BLOCK_table1_firstRow').clone(true);
    row.find("#BLOCK_table1_ID").text(++BLOCK_LastRowID);
    $("#BLOCK_table1 tr:last").after(row);

    //set HTML IDs of inividual elements
    // console.log(row.find(".ENTER_WEBSITE"));
    row.find(".ENTER_WEBSITE").attr("id", "BLOCK_ENTER_WEBSITE"+ i);
    row.find(".BLOCK_Time").attr("id", "BLOCK_Time"+ i);
    row.find(".BLOCK_Action").attr("id", "BLOCK_Action"+ i);
    row.find(".ENTER_WEBSITE").val("");
    row.find(".BLOCK_Time").val("");

    // alert("increasingf Block_row_number");
    modify_x(Block_row_number);
    modify_Array();


}


var newArray = [];
var kkk = [
        {label: "facebook", value: 12.1},
        {label: "In-Store Sales", value: 30.333333},
        {label: "Mail-Order Sales", value: 20.9997}
    ];

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.

function restore_options() {

    function printx() {
        console.log(x);
    }
    chrome.storage.sync.get('myKey', function (obj) {
        // console.log('myKey', obj);
        x = obj.myKey;
       // console.log(x);
        var tempTime;
        for(var i=0;i<x.length-1;++i)  //x.length-1 since we want to avoid the 1st index: "nothing"
        {
            newArray.push({label:x[i+1].website,value:Math.round((x[i+1].time))});

// x IS AN ARRAY WHICH STORES TIME IN MINUTES
            if((x[i+1].time)/60 >= 1)
            {

                tempTime = "" + Math.floor((x[i + 1].time)/60) + " hours " + Math.round(((x[i + 1].time/60) % 1)*60) + " Minutes";
            }
            else{
                tempTime = (Math.round(x[i+1].time));
                if(tempTime > 1){
                    tempTime = ""+ (Math.round(x[i+1].time)) + " Minutes";
                }
                else{
                     tempTime =  "1 Minute or less ";
                }
            }

            var tempWebsite = x[i+1].website;
//            tempTime = x[i+1].time;

            $('#table_id tr:last').after('<tr><td>tempWebsite1</td><td>tempTime</td></tr>');
            $('#table_id tr:last td:first').text(tempWebsite) ;
            $('#table_id tr:last td:last').text(tempTime) ;
        }
        $('#toBeDeleted').remove();
        var oTable =  $('#table_id').DataTable({
            "order": [[ 1, "des" ]]
        });



        $("tr[role = 'row']").click(
            function () {
        //        alert("hi");
                rowDataArray = [];//clear row data array
                $(this).children().each(function () {
                    rowDataArray.push($(this).text()); //rowDataArray now contain one website and its time at 0 and 1 index

                });
                setTimeout(draw_line_graph,500);
                // Get the modal
                var modal = document.getElementById('myModal');

// Get the button that opens the modal
                var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
                var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
//                 btn.onclick = function() {
//                     modal.style.display = "block";
//                 }
                modal.style.display = "block";


// When the user clicks on <span> (x), close the modal
                span.onclick = function() {
                    modal.style.display = "none";
                };

// When the user clicks anywhere outside of the modal, close it
                window.onclick = function(event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                }
            }

        );


    });

    console.log(newArray);

    setTimeout(function () {
        Morris.Donut({
            element: 'donut-example',
            data: newArray
        },2000);

    });


}

function findInTempArray(TempID){

    for(var i = 0; i< UserInputArray.length; ++i)
    {
        if(TempID == UserInputArray[i].BlockID)
        {
            return i;
        }

    }
    return -1;
}



$(".CLASS_BLOCK_Add_Row").click(function () {

    ++Block_row_number;
    createBlockRow();
    // alert("printing :"+ Block_row_number);

    var obj1 = {storage_BLOCK_LastRowID: Block_row_number};
    set_BlockRow(obj1);
});


$(".CLASS_BLOCK_save_individual").click(function () {

    var TempID          = $(this).parent().prev().text();
    var TempBlockImage  = $(this).parent().prev().prev().children().val();
    var TempBlockAction = $(this).parent().prev().prev().prev().children().val();
    var TempBlockTime   = $(this).parent().prev().prev().prev().prev().children().val();
    var TempBlockWebsite= $(this).parent().prev().prev().prev().prev().prev().children().val();
    //console.log($(this).parent().prev().prev().prev().prev().prev().children().val());
    // alert(TempBlockWebsite);

    if(TempID == "" || TempBlockAction == "" || TempBlockWebsite == ""|| TempBlockTime == "")
    {
        alert("Please fill all the details");
        return;
    }


    var newObj = {
        BlockID: TempID,
        BlockWebsite:TempBlockWebsite,
        BlockTime : TempBlockTime,
        BlockAction: TempBlockAction
    };

    if(findInTempArray(TempID)!=-1) //found in array
    {
        // alert("hi");
        //console.log(findInTempArray(TempID));
        UserInputArray[findInTempArray(TempID)] = newObj;

    }
    else{
        UserInputArray.push(newObj);
    }
    setInputArray();

});


$(".CLASS_BLOCK_remove_individual").click(function () {


    var TempID = $(this).parent().prev().text();
    // removeDataFrom_UserInputArray(TempID);
    $(this).parent().parent().remove();
    UserInputArray.splice(findInTempArray(TempID), 1);


    --Block_row_number;
    modify_x(Block_row_number);
    setInputArray();
});

document.addEventListener('DOMContentLoaded', restore_options);
$(document).ready(function(){
  //  alert("ready");
    //create and populate BLOCK rows

    var rowCount = $('#block_table1 tr').length;
    var temp= Block_row_number;
    for(var i=0;i<temp;++i)
    {

        if(i>=0 && i<=2)
        {
            // var obj = UserInputArray[i];
            // modify_BLOCK_Rows(i,obj.BlockWebsite,obj.BlockTime,obj.BlockAction);

        }
        else {
            //1. Create new rows;
            //2.Set HTML IDs of all elememts according to row number
           createBlockRow(i);
        }

        var obj = UserInputArray[i];
        modify_BLOCK_Rows(i,obj.BlockWebsite,obj.BlockTime,obj.BlockAction);

    }


});