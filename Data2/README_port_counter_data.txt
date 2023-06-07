This document explains the format of data of the output files. 

About file: nodes_link_path_202304061430 
The file name 'nodes_link_path_202304061430' represents nodes_link_path at time YYYYMMDDHHMM.
The file contains a communication path between two nodes involved in a job. A job can run on more than two nodes; we capture all possible combinations of node pairs. 
For example, if a job-id xx run nodes a,b,c, and d. It will show the communication path between every possible pair like a<->b, a<->c, a<->d, b<->c, b<->d, and c<->d. 
There will 6 entries of job-id xx for all node-pairs. 


========================================================================================================
JOBID:Nodes(separated by commas):Nodes a <-> b: Communication Path between a to b 
--------------------------------------------------------------------------------------------------------
981629.un05:hpc565,hpc567,hpc570,hpc571,hpc572,hpc580:Nodes hpc565 <-> hpc567:hpc565->IBSW_33->hpc567
981629.un05:hpc565,hpc567,hpc570,hpc571,hpc572,hpc580:Nodes hpc565 <->hpc570:hpc565->IBSW_33->hpc570
========================================================================================================
The above colon delimited file has:
->The first field is JOBID
->The second field is all nodes involved in the job
->The third field for a pair of nodes
->The fourth field is the communication path between that pair of nodes described in field three. 

*******************************************************************************************************************************************************************

About file : device_counters_202304061430 
The file name 'device_counters_202304061430' represents device_counters at time YYYYMMDDHHMM.
The file contains transmitted and received packets of a port of the device. A device here is either a Switch with multiple ports or a host with a single port.
The naming structure of the switch and host is explained at the bottom of the document. 

==================================================================
Device_name:Port_Number:Trans_packs:Recv_Packts:JOBID:Timestamp
------------------------------------------------------------------
IBSW_33:7:618161625:617381786:981629.un05:202304061430
hpc571:1:617411206:618190991:981629.un05:202304061430
==================================================================

The above colon delimited file has:
-> The first field is device name. A Device can be node or a switch.
-> The second field is the port number of device.
-> The third field is number of transmited packets
-> The fourth field is number of received packets
-> The fifth field is JOBID
-> The sixth field is timestamp YYYYMMDDHHMM

*******************************************************************************************************************************************************************

Some descriptions about the names included in the data:
->nodes are named hpc001 - hpc888. A few others nodes are also there. Like hm001 repreatents high memory node. 
->L1 switch has name IBSW_1 to IBSW_52
->L2 switch has the name IBB1_SW_L01 to IBB1_SW_L27. There are two director switches, IBB1 and IBB2, each with 27 line modules.
->L3 switch has IBB1_SW_S01 to IBB1_SW_S18. Line modules of Director switches are connected with spine modules providing L3 connectivity.


*******************************************************************************************************************************************************************
