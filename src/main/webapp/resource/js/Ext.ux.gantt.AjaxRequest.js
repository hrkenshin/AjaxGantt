Ext.namespace('Ext.ux.gantt');
/**
 * 간트챠트 : Ajax 요청 처리 클래스
 *
 * @class Ext.ux.gantt.AjaxRequest
 * @dependency ExtJS
 * @author 이승백
 */
Ext.ux.gantt.AjaxRequest = new (function() {
    this.URLforLoadProject = '';
    this.URLforSaveProject = '';
    this.URLforDeleteProject = '';
    this.URLforLoadSubTasks = '';
    this.URLforDeleteTask = '';

    /**
     * 프로젝트 정보를 가져온다.
     *
     * @param projectId {String} Project ID
     * @param onSuccessFn {Function}
     */
    this.loadProject = function(projectId, onSuccessFn) {
        Ext.Ajax.request({
            url: this.URLforLoadProject,
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            params: {
                PID: projectId
            },
            success: function(response, options) {
                var responseObj = null;
                try {
                    responseObj = Ext.util.JSON.decode(response.responseText);
                } catch(e) {
                    if (console) console.log(e);
                }
                onSuccessFn(responseObj);
            },
            failure: function(response, options) {
                if (console) console.log(response);
            }
        });
    }

    /**
     * 프로젝트 정보를 저장한다.
     *
     * @param projectId {String} Project ID
     * @param onSuccessFn {Function}
     */
    this.saveProject = function(projectId, onSuccessFn) {
        Ext.Ajax.request({
            url: this.URLforSaveProject,
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            params: {
                PID: projectId
            },
            success: function(response, options) {
                var responseObj = null;
                try {
                    responseObj = Ext.util.JSON.decode(response.responseText);
                } catch(e) {
                    if (console) console.log(e);
                }
                onSuccessFn(responseObj);
            },
            failure: function(response, options) {
                if (console) console.log(response);
            }
        });
    }

    /**
     * 프로젝트 정보를 삭제한다.
     *
     * @param projectId {String} Project ID
     * @param onSuccessFn {Function}
     */
    this.deleteProject = function(projectId, onSuccessFn) {
        Ext.Ajax.request({
            url: this.URLforDeleteProject,
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            params: {
                PID: projectId
            },
            success: function(response, options) {
                var responseObj = null;
                try {
                    responseObj = Ext.util.JSON.decode(response.responseText);
                } catch(e) {
                    if (console) console.log(e);
                }
                onSuccessFn(responseObj);
            },
            failure: function(response, options) {
                if (console) console.log(response);
            }
        });
    }

    /**
     * 하위 태스크 정보들를 가져온다.
     *
     * @param uid {String} Task ID
     * @param onSuccessFn {Function}
     */
    this.loadSubTasks = function(uid, onSuccessFn) {
        Ext.Ajax.request({
            url: this.URLforLoadSubTasks,
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            params: {
                UID: uid
            },
            success: function(response, options) {
                var responseObj = null;
                try {
                    responseObj = Ext.util.JSON.decode(response.responseText);
                } catch(e) {
                    if (console) console.log(e);
                }
                onSuccessFn(responseObj);
            },
            failure: function(response, options) {
                if (console) console.log(response);
            }
        });
    }

    /**
     * 태스크 정보를 삭제한다.(하위 태스크포함)
     *
     * @param uid {String} Task ID
     * @param onSuccessFn {Function}
     */
    this.deleteTask = function(uid, onSuccessFn) {
        Ext.Ajax.request({
            url: this.URLforDeleteTask,
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            params: {
                UID: uid
            },
            success: function(response, options) {
                var responseObj = null;
                try {
                    responseObj = Ext.util.JSON.decode(response.responseText);
                } catch(e) {
                    if (console) console.log(e);
                }
                onSuccessFn(responseObj);
            },
            failure: function(response, options) {
                if (console) console.log(response);
            }
        });
    }
});