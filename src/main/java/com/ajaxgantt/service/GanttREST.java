package com.ajaxgantt.service;

import javax.ws.rs.*;

/**
 * Created by IntelliJ IDEA.
 * User: Admin
 * Date: 2011. 1. 5
 * Time: 오전 11:34:37
 * To change this template use File | Settings | File Templates.
 */
@Path(value = "/Gantt")
public class GanttREST {
    @GET
    @Path("/LoadProject")
    @Produces({"application/json"})
    public String loadProject(
            @QueryParam("PID") String pid) {

        // TEST 용 임시코드
        String project = null;
        if (pid != null) {
            project = "{\n" +
                    "   '@uid': 'String',\n" +
                    "   name:'String',\n" +
                    "   subject:'String',\n" +
                    "   category:'String',\n" +
                    "   description:'String',\n" +
                    "   author:'String',\n" +
                    "   creationDate:'2001-12-17T09:30:47Z',\n" +
                    "   updatedDate:'2001-12-17T09:30:47Z',\n" +
                    "   startDate:'2011-01-01',\n" +
                    "   finishDate:'2011-03-25',\n" +
                    "   status:'String',\n" +
                    "   Tasks: {\n" +
                    "    Task: [\n" +
                    "      {\n" +
                    "            '@uid': 1,\n" +
                    "            '@seqNo': '',\n" +
                    "            '@parent':null,\n" +
                    "            '@from': '',\n" +
                    "            '@to': '2',\n" +
                    "            '@wbsLevel': 1,\n" +
                    "            '@isLeaf': true,\n" +
                    "            title:'Task 1',\n" +
                    "            type:'',\n" +
                    "            startDate:'2011-01-02',\n" +
                    "            endDate:'2011-01-04',\n" +
                    "            duration:3,\n" +
                    "            description:'String',\n" +
                    "            status:'String',\n" +
                    "            priority:0,\n" +
                    "            resources:'String',\n" +
                    "            completeRate:100\n" +
                    "        },\n" +
                    "        {\n" +
                    "            '@uid': 2,\n" +
                    "            '@seqNo': '',\n" +
                    "            '@parent':null,\n" +
                    "            '@from': '1',\n" +
                    "            '@to': '3',\n" +
                    "            '@wbsLevel': 1,\n" +
                    "            '@isLeaf': true,\n" +
                    "            title:'Task 2',\n" +
                    "            type:'String',\n" +
                    "            startDate:'2011-01-05',\n" +
                    "            endDate:'2011-01-06',\n" +
                    "            duration:2,\n" +
                    "            description:'String',\n" +
                    "            status:'String',\n" +
                    "            priority:0,\n" +
                    "            resources:'String',\n" +
                    "            completeRate:100\n" +
                    "        },\n" +
                    "        {\n" +
                    "            '@uid': 3,\n" +
                    "            '@seqNo': '',\n" +
                    "            '@parent':null,\n" +
                    "            '@from': '2',\n" +
                    "            '@to': '6',\n" +
                    "            '@wbsLevel': 1,\n" +
                    "            '@isLeaf': false,\n" +
                    "            title:'Task 3',\n" +
                    "            type:'String',\n" +
                    "            startDate:'2011-01-08',\n" +
                    "            endDate:'2011-01-12',\n" +
                    "            duration:5,\n" +
                    "            description:'String',\n" +
                    "            status:'String',\n" +
                    "            priority:0,\n" +
                    "            resources:'String',\n" +
                    "            completeRate:100\n" +
                    "        },\n" +
                    "        {\n" +
                    "              '@uid': 6,\n" +
                    "              '@seqNo': '',\n" +
                    "              '@parent':null,\n" +
                    "              '@from': '3',\n" +
                    "              '@to': '',\n" +
                    "              '@wbsLevel': 1,\n" +
                    "              '@isLeaf': false,\n" +
                    "              title:'Task 4',\n" +
                    "              type:'String',\n" +
                    "              startDate:'2011-01-15',\n" +
                    "              endDate:'2011-01-19',\n" +
                    "              duration:5,\n" +
                    "              description:'String',\n" +
                    "              status:'String',\n" +
                    "              priority:0,\n" +
                    "              resources:'String',\n" +
                    "              completeRate:100\n" +
                    "          },\n" +
                    "          {\n" +
                    "              '@uid': 7,\n" +
                    "              '@seqNo': '',\n" +
                    "              '@parent':6,\n" +
                    "              '@from': '5,10',\n" +
                    "              '@to': '8',\n" +
                    "              '@wbsLevel': 2,\n" +
                    "              '@isLeaf': true,\n" +
                    "              title:'Task 4-1',\n" +
                    "              type:'',\n" +
                    "              startDate:'2011-01-15',\n" +
                    "              endDate:'2011-01-17',\n" +
                    "              duration:3,\n" +
                    "              description:'String',\n" +
                    "              status:'String',\n" +
                    "              priority:0,\n" +
                    "              resources:'String',\n" +
                    "              completeRate:100\n" +
                    "          },\n" +
                    "          {\n" +
                    "              '@uid': 8,\n" +
                    "              '@seqNo': '',\n" +
                    "              '@parent':6,\n" +
                    "              '@from': '7',\n" +
                    "              '@to': '',\n" +
                    "              '@wbsLevel': 2,\n" +
                    "              '@isLeaf': true,\n" +
                    "              title:'Task 4-2',\n" +
                    "              type:'M',\n" +
                    "              startDate:'2011-01-19',\n" +
                    "              endDate:'2011-01-19',\n" +
                    "              duration:1,\n" +
                    "              description:'String',\n" +
                    "              status:'String',\n" +
                    "              priority:0,\n" +
                    "              resources:'String',\n" +
                    "              completeRate:100\n" +
                    "          },\n" +
                    "          {\n" +
                    "              '@uid': 9,\n" +
                    "              '@seqNo': '',\n" +
                    "              '@parent':null,\n" +
                    "              '@from': '',\n" +
                    "              '@to': '',\n" +
                    "              '@wbsLevel': 1,\n" +
                    "              '@isLeaf': false,\n" +
                    "              title:'Task 5',\n" +
                    "              type:'',\n" +
                    "              startDate:'2011-01-10',\n" +
                    "              endDate:'2011-01-12',\n" +
                    "              duration:3,\n" +
                    "              description:'String',\n" +
                    "              status:'String',\n" +
                    "              priority:0,\n" +
                    "              resources:'String',\n" +
                    "              completeRate:100\n" +
                    "          },\n" +
                    "          {\n" +
                    "              '@uid': 10,\n" +
                    "              '@seqNo': '',\n" +
                    "              '@parent':9,\n" +
                    "              '@from': '',\n" +
                    "              '@to': '7',\n" +
                    "              '@wbsLevel': 2,\n" +
                    "              '@isLeaf': true,\n" +
                    "              title:'Task 5-1',\n" +
                    "              type:'',\n" +
                    "              startDate:'2011-01-10',\n" +
                    "              endDate:'2011-01-11',\n" +
                    "              duration:2,\n" +
                    "              description:'String',\n" +
                    "              status:'String',\n" +
                    "              priority:0,\n" +
                    "              resources:'String',\n" +
                    "              completeRate:100\n" +
                    "          }\n" +
                    "    ]\n" +
                    "  }\n" +
                    "}";
        }
        return project;
    }

    @GET
    @Path("/LoadSubTasks")
    @Produces({"application/json"})
    public String loadSubTasks(
            @QueryParam("UID") String uid) {

        // TEST 용 임시코드
        String subTask = null;
        if (uid != null && uid.equals("3")) {
            subTask = "{'Task':[{'@uid': 4,'@seqNo': '','@parent':3,'@from': '','@to': '5','@wbsLevel': 1,'@isLeaf': true,title:'Task 3-1',type:'',startDate:'2011-01-08',endDate:'2011-01-10',duration:3,description:'String',status:'String',priority:0,resources:'String',completeRate:100}," +
                    "{'@uid': 5,'@seqNo': '','@parent':3,'@from': '4','@to': '7','@wbsLevel': 2,'@isLeaf': true,title:'Task 3-2',type:'M',startDate:'2011-01-12', endDate:'2011-01-12',duration:1,description:'String',status:'String',priority:0,resources:'String',completeRate:100}]}";
        }
        return subTask;
    }
}