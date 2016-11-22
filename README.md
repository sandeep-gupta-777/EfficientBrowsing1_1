# EfficientBrowsing1_1

**My First Chrome Extension**

**Features:**

1. Provides browsing summery of the User[In graph/table/piechart]:

            a. Today's browsing summery
            b. Previous days browsing History (front end yet to be completed)
            
2. Can block website after certain permitted time period per day

3. Can produce alert with user defined frequencies.


**Architecture of extension:**

**Chrome.sync.storage keys**

	1. obj.Stored_BlockedArray_key : stores UserInputArray, which saves data of block website array: table(id="BLOCK_table1") 

	2. obj.Stored_ReminderArray_key : stores UserReminderArray, which saves data of block website array: table(id="BLOCK_table1")

	3. obj.History_Array_key = saves data from History_array

	4. obj.myKey = saves data from URLarray

**Important Arrays:**

**background.js:**	

	1.indexArray: This is the first array created in the extension. Stores all the tab objects related to opened tabs and also workingStatus.
	Working starus can have value:0,1,2
	Example indexArray[0] = {tabObject: new Tab, working:0}

	2.seconderyDomainArray: contains domains. Example: seconderyDomainArray = ["co","ac"];

	3.URLarray:Contains website name along with startTime,endTime,time 
	Example: URLarray[0] = {endTime:0,startTime:0,time:50.882500037550926,website:"cisco"}

	4.blockArray = contains data of block table(see in options.html id="BLOCK_table1"). Draws data of table using key = obj.Stored_BlockedArray_key //same as UserInputArray in options.js

**background_history.js**	

	1. History_array:  Every night 11.59 AM, pushInHistoryArray() runs. This method copies relevent the data from URLarray and saves it in History_array and also clears URLarray. So history array contain browing history in the format: {website:"google", time: 40}. However, it will not contain todays' data.
           

**background_reminder.js**

	1.UserReminderArray_background: Saves data of reminder table. 

**options.js**

	1.UserInputArray : save data from block website table // same as blockArray in background.js
	2.rowDataArray

**options_draw_graph.js**

	1.plotLineArray
	2.finalPlotArray
	3.History_array (This is different from History_array of background.js, however stores same data)
	4.URLarray (This is different from URLarray of background.js, however stores same data)

**options_Reminder.js**
	
	1. UserReminderArray
