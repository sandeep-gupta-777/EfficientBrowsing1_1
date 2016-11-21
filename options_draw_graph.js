/**
 * Created by sandeep_gupta on 11/16/2016.
 */
//Use rowDataArray to search for the time for given website in HistoryArray and URLarray
// and plot graph using it
var plotLineArray=[];//just an intermediate array between History_array and finalplotArray
var finalPlotArray = [];//this array will contain the data for line graph
var History_array =[]; //{date, websiteName,totalTimeArray }
var dateStringArray = [];
var URLarray=  [];
var tempDateString;
/*
 * Why do we need URLarray in options.js?
 * Answer: Because HistoryArray doesnt contain todays' data
 * */

chrome.storage.sync.get('myKey', function (obj) {
    if(obj.myKey != undefined)
        URLarray = obj.myKey;
});

function findWebsiteinURLArray(str){

    for(var i=0;i<URLarray.length;++i)
    {
        if(URLarray[i].website == str)
        {
            return i;
        }
    }

    return -1;

}

function makeArrayWithDateString(){ //populates finalPlotArray

    finalPlotArray = [];//clear previous data
    for(var i=0;i< plotLineArray.length;++i)
    {

        tempDateString = new Date(plotLineArray[i].date).toDateString();//();//.toString()
        console.log(plotLineArray[i].date);

        var tempobj =   {
                            time: Math.round(plotLineArray[i].time).toString(),
                            date:tempDateString
                        };
        finalPlotArray.push(tempobj);
    }

    if(findWebsiteinURLArray!=-1)//also push today's data in finalPlotArray
    {
        var tempobj1 =   {
            time: Math.round(URLarray[findWebsiteinURLArray(rowDataArray[0])].time).toString(),
            date:new Date().toDateString()
        };
        finalPlotArray.push(tempobj1);
    }
}

var temp_k = [
    {x: "ggg", value: 20}

];
chrome.storage.sync.get('History_Array_key', function (obj) {

 //  alert("getting");
    if(obj.History_Array_key != undefined)
    {
        console.log(obj.History_Array_key);
        History_array = obj.History_Array_key;

    }
});
function print_history() {
    console.log(History_array);
}



function findInHistoryArray_draw(str) {

  //  alert(History_array.length);

    for(var i=0;i<History_array.length;++i)
    {

        if(str == History_array[i].website)
        {
            // alert("returning "+i);
            return i;
        }
    }
    return -1;
}
function draw_line_graph() {

    // if (findInHistoryArray_draw(rowDataArray[0]) != -1)//found in historyarray
    // {
        // alert(findInHistoryArray_draw(rowDataArray[0]));
        // alert(typeof rowDataArray[0]);
        var tempstr = rowDataArray[0];
    if(findInHistoryArray_draw(rowDataArray[0]) != -1)
    {
        var index = findInHistoryArray_draw(tempstr);
        var tempWebsite = History_array[index].website;
        plotLineArray = History_array[index].dateTimeArray;
    }

        //Plot following:
        //Name of graph:Usage of temp website
        //Graph: time vs data

        makeArrayWithDateString();

        var tempWebsiteName = rowDataArray[0];
        $("#myfirstchart_text").html("Showing Usage for: "+ tempWebsiteName).css({
            'font-size' : '20px',
         //   'text-align' : 'center'
        });

        $("#myfirstchart").html("");//to clear previous HTML
        new Morris.Line({
            // ID of the element in which to draw the chart.
            element: 'myfirstchart',
            // // Chart data records -- each entry in this array corresponds to a point on
            // // the chart.
            //data: plotLineArray,
            data: finalPlotArray,
            // // The name of the data record attribute that contains x-values.
            xkey: 'date',
            // // A list of names of data record attributes that contain y-values.
            ykeys: ['time'],
            // // Labels for the ykeys -- will be displayed when you hover over the
            // // chart.
            labels: ['Usage Time(Minutes)']

        });

}