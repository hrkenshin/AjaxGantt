package com.ajaxgantt.protocol;

import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlElementDecl;
import javax.xml.bind.annotation.XmlRegistry;
import javax.xml.namespace.QName;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the com.ajaxgantt.protocol package. 
 * <p>An ObjectFactory allows you to programatically 
 * construct new instances of the Java representation 
 * for XML content. The Java representation of XML 
 * content can consist of schema derived interfaces 
 * and classes representing the binding of schema 
 * type definitions, element declarations and model 
 * groups.  Factory methods for each of these are 
 * provided in this class.
 * 
 */
@XmlRegistry
public class ObjectFactory {

    private final static QName _Task_QNAME = new QName("", "Task");
    private final static QName _Project_QNAME = new QName("", "Project");

    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: com.ajaxgantt.protocol
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link ProjectType.Tasks }
     * 
     */
    public ProjectType.Tasks createProjectTypeTasks() {
        return new ProjectType.Tasks();
    }

    /**
     * Create an instance of {@link ProjectType }
     * 
     */
    public ProjectType createProjectType() {
        return new ProjectType();
    }

    /**
     * Create an instance of {@link TaskType }
     * 
     */
    public TaskType createTaskType() {
        return new TaskType();
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link TaskType }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "", name = "Task")
    public JAXBElement<TaskType> createTask(TaskType value) {
        return new JAXBElement<TaskType>(_Task_QNAME, TaskType.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link ProjectType }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "", name = "Project")
    public JAXBElement<ProjectType> createProject(ProjectType value) {
        return new JAXBElement<ProjectType>(_Project_QNAME, ProjectType.class, null, value);
    }

}
