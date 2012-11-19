package com.ajaxgantt.protocol;

import org.codehaus.jettison.AbstractXMLStreamReader;
import org.codehaus.jettison.AbstractXMLStreamWriter;
import org.codehaus.jettison.mapped.MappedNamespaceConvention;
import org.codehaus.jettison.mapped.MappedXMLStreamReader;
import org.codehaus.jettison.mapped.MappedXMLStreamWriter;

import javax.xml.bind.JAXB;
import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: hrkenshin
 * Date: 11. 1. 5.
 * Time: 오전 9:35
 * To change this template use File | Settings | File Templates.
 */
public class JSONTest {
    public static void main(String[] args) throws XMLStreamException, IOException {
        ObjectFactory objectFactory = new ObjectFactory();

        ProjectType projectType = new ProjectType();
        projectType.setUid("String");
        projectType.setName("String");
//        projectType.setStartDate();
//        projectType.setFinishDate();

        ProjectType.Tasks tasks = objectFactory.createProjectTypeTasks();

        List<TaskType> taskList = tasks.getTask();

        TaskType taskType = null;
        for (int i = 1; i <= 3; i++) {
            taskType = new TaskType();
            taskType.setUid(String.valueOf(i));
            taskType.setTitle("Task " + i);
            taskType.setParent(null);

            taskList.add(taskType);
        }

        projectType.setTasks(tasks);

        StringWriter sw = new StringWriter();
        JAXB.marshal(objectFactory.createProject(projectType), sw);

        System.out.println(sw.toString());

        //

        StringWriter strWriter = new StringWriter();

        // Mapped convention
        MappedNamespaceConvention con = new MappedNamespaceConvention();
        AbstractXMLStreamWriter w = new MappedXMLStreamWriter(con, strWriter);

        // BadgerFish convention
        // AbstractXMLStreamWriter w = new BadgerFishXMLStreamWriter(strWriter);

        w.writeStartDocument();
        w.writeStartElement("alice");
        w.writeCharacters("bob");
        w.writeEndElement();
        w.writeEndDocument();

        w.close();
        strWriter.close();
        System.out.println(strWriter.toString());

    }
}