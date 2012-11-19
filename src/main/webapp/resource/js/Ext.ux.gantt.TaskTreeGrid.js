Ext.namespace('Ext.ux.gantt');

/**
 * 간트챠트 : 태스크 트리 그리드.
 * Ext.ux.maximgb.tg.EditorGridPanel 를 Extenstion 하여 간트차트의 왼쪽 영역인
 * 태스크 트리 그리드를 구현한다.
 *
 * <pre>
 * config =
 *  {
 *      id: '',         // {String} TaskTreeGrid ID
 *      chart_id: '',   // {String} GanttGhart ID
 *  }
 * </pre>
 *
 * @class Ext.ux.gantt.TaskTreeGrid
 * @extends Ext.ux.maximgb.tg.EditorGridPanel
 * @dependency ExtJS
 * @param config
 * @author 이승백
 */
Ext.ux.gantt.TaskTreeGrid = function(config) {
    Ext.apply(this, config);

    // Define Task Record
    var taskRecord = Ext.data.Record.create([
        {
            name: '@uid'
        },
        {
            name: '@seqNo',
            type: 'int'
        },
        {
            name: '@parent',
            type: 'auto'
        },
        {
            name: '@from'
        },
        {
            name: '@to'
        },
        {
            name: '@wbsLevel',
            type: 'int'
        },
        {
            name: '@isLeaf',
            type: 'bool'
        },
        {
            name: 'title'
        },
        {
            name: 'type'
        },
        {
            name: 'startDate',
            type: 'date',
            dateFormat: 'Y-m-d'
        },
        {
            name: 'endDate',
            type: 'date',
            dateFormat: 'Y-m-d'
        },
        {
            name: 'duration',
            type: 'int'
        },
		{
			name: 'startDate_run',
			type: 'date',
			dateFormat: 'Y-m-d'
		},
		{
			name: 'endDate_run',
			type: 'date',
			dateFormat: 'Y-m-d'
		},
		{
			name: 'duration_run',
			type: 'int'
		},
        {
            name: 'description'
        },
        {
            name: 'status'
        },
        {
            name: 'priority',
            type: 'int'
        },
        {
            name: 'resources'
        },
        {
            name: 'completeRate',
            type: 'int'
        },
        {
            name: 'completeRate_run',
            type: 'int'
        }
    ]);

    // Define Task Store
    var store = new Ext.ux.maximgb.tg.AdjacencyListStore({
        autoLoad : false,
        leaf_field_name: "@isLeaf",
        parent_id_field_name: "@parent",
        reader: new Ext.data.JsonReader({
            id: '@uid',
            root: 'Task'
        }, taskRecord)
    });

    /**
     * Ext.ux.maximgb.tg.AbstractTreeStore 의 expandNode 함수를 override 하여
     * Ext.ux.gantt.AjaxRequest.loadSubTasks 함수를 통해 하위 Task 를 가져오도록 한다.
     */
    Ext.override(Ext.ux.maximgb.tg.AbstractTreeStore, {
        expandNode : function(rc) {
            var params;

            if (!this.isExpandedNode(rc) && this.fireEvent('beforeexpandnode', this, rc) !== false) {
                // If node is already loaded then expanding now.
                if (this.isLoadedNode(rc)) {
                    this.setNodeExpanded(rc, true);
                    this.fireEvent('expandnode', this, rc);
                }
                // If node isn't loaded yet then expanding after load.
                else {
                    if (Ext.ux.gantt.AjaxRequest.URLforLoadSubTasks != '') {
                        Ext.ux.gantt.AjaxRequest.loadSubTasks(rc.get('@uid'), function(responseObj) {
                            if (responseObj != null) {
                                store.loadData(responseObj, true);
                                store.setNodeExpanded(rc, true);
                                store.fireEvent('expandnode', this, rc);
                            }
                        });
                    }
                }
            }
        }
    });

    // Call Constructor
    Ext.ux.gantt.TaskTreeGrid.superclass.constructor.call(this, {
        store: store,
        baseCls: 'ux-tasktree',
        master_column_id : 'title',
        autoExpandColumn: 'title',
        enableHdMenu : false,
        enableDragDrop: true,
        border: false,
        clicksToEdit: 2,
        viewConfig : {
            forceFit: false,
            scrollOffset:0
        },
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        plugins: [new Ext.ux.grid.ColumnHeaderGroup({
            rows: [
                [
                    {
                        header: '',
                        colspan: 7,
                        align: 'center'
                    }
                ]
            ]
        })],
        columns: [
            {
                header: 'ID',
                dataIndex: '@uid',
                width: 40,
                sortable: true,
				editable: !config.readOnly,
                editor: new Ext.form.TextField({
                    allowBlank: true
                })
            },
            {
                id:'title',
                header: 'Task',
                dataIndex: 'title',
                width: 230,
                sortable: true,
				editable: !config.readOnly,
                editor: new Ext.form.TextField({
                    allowBlank: false
                })
            },
            {
                header: 'Start',
                width: 70,
                dataIndex: 'startDate',
                align: 'center',
                sortable: true,
                hidden: true,
                editable: false,
                renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                editor: new Ext.form.DateField({
                    format : 'Y-m-d'
                })
            },
            {
                header: 'End',
                width: 70,
                dataIndex: 'endDate',
                align: 'center',
                sortable: true,
                hidden: true,
                editable: false,
                renderer: Ext.util.Format.dateRenderer('Y-m-d'),
                editor: new Ext.form.DateField({
                    format : 'Y-m-d'
                })
            },
            {
                header: 'Duration',
                width: 50,
                dataIndex: 'duration',
                align: 'right',
                sortable: true,
                hidden: true
            },
            {
                header: 'Complete',
                width: 50,
                dataIndex: 'completeRate',
                align: 'right',
                sortable: true,
                hidden: true,
				editable: !config.readOnly,
                editor: new Ext.form.SpinnerField({
                    minValue: 0,
                    maxValue: 100
                })
            },
			{
				header: 'Start_Run',
				width: 70,
				dataIndex: 'startDate_run',
				align: 'center',
				sortable: true,
                hidden: true,
				editable: false,
				renderer: Ext.util.Format.dateRenderer('Y-m-d'),
				editor: new Ext.form.DateField({
					format : 'Y-m-d'
				})
			},
			{
				header: 'End_Run',
				width: 70,
				dataIndex: 'endDate_run',
				align: 'center',
				sortable: true,
                hidden: true,
				editable: false,
				renderer: Ext.util.Format.dateRenderer('Y-m-d'),
				editor: new Ext.form.DateField({
					format : 'Y-m-d'
				})
			},
			{
				header: 'Duration_Run',
				width: 50,
				dataIndex: 'duration_run',
				align: 'right',
				sortable: true,
				hidden: true
			},
			{
				header: 'Complete_Run',
				width: 50,
				dataIndex: 'completeRate_run',
				align: 'right',
				sortable: true,
				hidden: true,
				editable: !config.readOnly,
				editor: new Ext.form.SpinnerField({
					minValue: 0,
					maxValue: 100
				})
			},
            {
                header: 'Ancestors',
                width: 30,
                dataIndex: '@from',
                sortable: true,
                hidden: true,
				editable: !config.readOnly,
                editor: new Ext.form.TextField({
                    allowBlank: true
                })
            },
            {
                header: 'R.',
                width: 20,
                dataIndex: 'resources',
				editable: !config.readOnly,
                editor: new Ext.form.TextField({
                    allowBlank: true
                }),
                renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                    var userView = Ext.getCmp('USERVIEW_' + this.chart_id);

                    if (userView) {
                        var userStore = userView.getStore();
                        var userRecord = userStore.getById(value);
                        if (userRecord) {
                            return '<img ext:qtip="<img src=\'' + userRecord.get('contextPath') + userRecord.get('imgPath') +
                                '\'/>" src="' + userRecord.get('imgPath') + '" width="15" height="14" border="0"></img>';
                        }
                    } else {
                        return value;
                    }

//                    유엔진 CUSTOMIZED
//                    if (value) {
//                        var userData;
//                        $.ajax({
//                            async   : false,
//                            url     : contextPath + "/codi-web/contacts/getUserInfoByEmpcode",
//                            type    : "POST",
//                            data : {
//                                "endpoint" : value,
//                                "appKey" : appKey
//                            },
//                            dataType: "json",
//                            error : function() {
//                                var errMsg = _ajax_call_err + '[getLoginUserInfo]';
//                                alertMessage(errMsg);
//                            },
//                            success : function(data) {
//                                if (data.keyCodi) {
//                                    userData = {
//                                        empCode: data.keyCodi[0].EMPCODE,
//                                        empName: data.keyCodi[0].EMPNAME,
//                                        imgPath: data.keyCodi[0].IMGPATH,
//                                        email: data.keyCodi[0].EMAIL,
//                                        contextPath: contextPath
//                                    }
//                                }
//                            }
//                        });
//
//                        if (userData) {
//                            var tpl = new Ext.XTemplate(
//                                '<img ext:qtip="<div><img src=\'{contextPath}{imgPath}\'/></div><div align=\'center\'>{empName}</div>" src="{contextPath}{imgPath}" width="15" height="14" border="0"/>'
//                            );
//
//                            return tpl.applyTemplate(userData);
//                        }
//                    }
//
//                    return value;
                }.createDelegate(this)
            }
        ],
        listeners: {
            beforeedit: function(obj) {
                // 지난 일정의 경우 수정 불가
                if (obj.record.get('endDate').format('Ymd') < (new Date()).format('Ymd')) {
                    return false;
                }
                // 이미 일정이 시작한 경우 시작일 수정 불가
                else if (obj.field == 'startDate' &&
                    obj.record.get('startDate').format('Ymd') < (new Date()).format('Ymd')) {
                    return false;
                }
            }
        }
    });
};
Ext.extend(Ext.ux.gantt.TaskTreeGrid, Ext.ux.maximgb.tg.EditorGridPanel, {
    /**
     * Task의 Drag&Drop 처리를 위해 onRender 함수를 overriding 하여 구현
     *
     * @param ct
     * @param position
     * @override
     */
    onRender: function(ct, position) {
        Ext.ux.maximgb.tg.EditorGridPanel.superclass.onRender.call(this, ct, position);
        this.el.addClass('ux-maximgb-tg-panel');

        var store = this.store;
        if (this.enableDragDrop != false && !this.readOnly) {
            var canDrop = function(draggedRecord, overRecord) {
                if (Ext.isEmpty(overRecord)) return true;
                if (store.getNodeParent(draggedRecord) === overRecord) {
                    return  false;
                }
                if (overRecord === draggedRecord) {
                    return false;
                }
                if (overRecord.isNew) {
                    return false;
                }

                var index = store.getNodeAncestors(overRecord).indexOf(draggedRecord);

                return  index < 0;
            };

            var ddGroupId = this.getDDGroupId();
            var dragZone = new Ext.grid.GridDragZone(this, {ddGroup: ddGroupId});

            var dropZone = new Ext.dd.DropZone(this.getView().scroller, {
                ddGroup: ddGroupId,
                notifyOver: function(dd, evt, data) {
                    var cls = this.dropNotAllowed;

                    var target = evt.getTarget();
                    var rowIndex = this.getView().findRowIndex(target);
                    var overRecord = this.getStore().getAt(rowIndex);

                    if (overRecord) {
                        if (data.userData) { // 리소르를 드래그한 경우
                            if (overRecord.get('endDate').format('Ymd') >= (new Date()).format('Ymd')) {
                                cls = Ext.dd.DropZone.prototype.dropAllowed;
                            }
                        } else if (dd.dragData.selections) { // 노드를 드래그한 경우
                            var draggedRecord = dd.dragData.selections[0];

                            if (overRecord.get('endDate').format('Ymd') >= (new Date()).format('Ymd') &&
                                draggedRecord.get('endDate').format('Ymd') >= (new Date()).format('Ymd') &&
                                canDrop(draggedRecord, overRecord)) {
                                cls = Ext.dd.DropZone.prototype.dropAllowed;
                            }
                        }
                    }

                    return cls;
                }.createDelegate(this),
                notifyDrop: function(dd, evt, data) {
                    var target = evt.getTarget();
                    var rowIndex = this.getView().findRowIndex(target);
                    var overRecord = this.getStore().getAt(rowIndex);

                    if (overRecord) {
                        if (data.userData) { // 리소르를 드랍한 경우
                            if (overRecord.get('endDate').format('Ymd') >= (new Date()).format('Ymd')) {
                                overRecord.set('resources', data.userData.empCode);

                                return true;
                            }
                        } else if (dd.dragData.selections) { // 노드를 드랍한 경우
                            var draggedRecord = dd.dragData.selections[0];
                            var draggedParentRecord = this.getStore().getNodeParent(draggedRecord);

                            var isCanDrop = canDrop(draggedRecord, overRecord);
                            if (overRecord.get('endDate').format('Ymd') >= (new Date()).format('Ymd') &&
                                draggedRecord.get('endDate').format('Ymd') >= (new Date()).format('Ymd') &&
                                isCanDrop) {
                                if (overRecord) {
                                    this.moveTask(draggedParentRecord, draggedRecord, overRecord);
                                }
                                return true;
                            }
                        }
                    }
                }.createDelegate(this)
            });

            this.dropZone = dropZone;
        }
    },

    /**
     * 선택한 Task 를 트리그리드 상에서 대상 Task의 하위 노드로 이동한다.
     *
     * @param sourceParentRecord {Ext.data.Record} 이동할 Task의 이전 상위 레코드
     * @param sourceRecord {Ext.data.Record} 이동할 Task 레코드
     * @param targetRecord {Ext.data.Record} 이동할 위치의 대상 Task 레코드
     * @public
     */
    moveTask: function(sourceParentRecord, sourceRecord, targetRecord) {
        var store = this.getStore();

        var parentId = targetRecord.get('@uid');

        // 1. 선택 레코드의 parent 변경
        sourceRecord.set(store.parent_id_field_name, parentId);

        // 2. 선택 레코드의 level 변경
        sourceRecord.set('@wbsLevel', targetRecord.get('@wbsLevel') + 1);

        // 3. 대상 레코드의 leaf 변경
        targetRecord.set(store.leaf_field_name, false);

        // 4. 선택 레코드의 이전 부모레코드 isLeaf 변경
        if (sourceParentRecord && store.getNodeChildrenCount(sourceParentRecord) == 0) {
            sourceParentRecord.set(store.leaf_field_name, true);
        }

        // 5. 기간조절
        this.adjustChildTask(sourceParentRecord);
        this.adjustChildTask(targetRecord);

        store.applyTreeSort();

        this.getSelectionModel().deselectRange();
        this.getSelectionModel().selectRecords([sourceRecord], false);

        this.getView().refresh(false);

        Ext.getCmp('CHARTGRID_' + this.chart_id).getView().refresh(false);
        Ext.getCmp('CHARTGRID_' + this.chart_id).drawChart();
    },

    /**
     * 그리드에 새로운 태스크 입력을 위한 Row를 추가한다.
     *
     * @param index {Number} 추가할 위치의 인덱스
     * @public
     */
    addRowForNewTask: function(index) {
        var task = {
            Task: [
                {
                    '@uid': ++Ext.Component.AUTO_ID,
                    '@seqNo': '',
                    '@parent':null,
                    '@from': '',
                    '@to': '',
                    '@wbsLevel': 1,
                    '@isLeaf': true,
                    title:'',
                    type:'',
                    startDate: new Date(),
                    endDate: new Date(),
                    duration:1,
					startDate_run: new Date(),
					endDate_run: new Date(),
					duration_run:1,
                    description:'',
                    status:'',
                    priority:0,
                    resources:'',
                    completeRate:0,
                    completeRate_run:0
                }
            ]
        };

        this.getStore().loadData(task, true);

        Ext.getCmp('CHARTGRID_' + this.chart_id).getView().refresh(false);
        Ext.getCmp('CHARTGRID_' + this.chart_id).drawChart();
    },

    /**
     * 그리드에서 하위태스크를 포함하여 선택된 태스크를 삭제한다.
     *
     * @public
     */
    deleteTask: function() {
        var store = this.getStore();
        var selectedTask = this.getSelectionModel().getSelected();
        if (selectedTask != null) {
            var parentTask = store.getNodeParent(selectedTask);

            store.remove(selectedTask);

            if (parentTask) {
                if (store.getNodeChildrenCount(parentTask) == 0) {
                    parentTask.set(store.leaf_field_name, true);
                } else {
                    this.adjustChildTask(parentTask);
                }
            }

            store.applyTreeSort();

            this.getView().refresh(false);

            Ext.getCmp('CHARTGRID_' + this.chart_id).getView().refresh(false);
            Ext.getCmp('CHARTGRID_' + this.chart_id).drawChart();
        }
    },

    /**
     * 그리드에서 태스크를 한칸 위로 이동한다.
     *
     * @param index {Number} 그리드에서 Task의 index
     * @public
     */
    moveUp: function(index) {
        // TODO : 그리드에서 태스크를 한칸 위로 이동한다.
    },

    /**
     * 그리드에서 태스크를 한칸 아래로 이동한다.
     *
     * @param index {Number} 그리드에서 Task의 index
     * @public
     */
    moveDown: function(index) {
        // TODO : 그리드에서 태스크를 한칸 아래로 이동한다.
    },

    /**
     * 모든 트리노드를 확장한다.
     *
     * @public
     */
    expandAll: function() {
        this.getStore().expandAll();
    },

    /**
     * 모든 트리노드를 닫는다.
     *
     * @public
     */
    collapseAll: function() {
        this.getStore().collapseAll();
    },

    /**
     * Drag & Drop GroupID를 반환한다.(Drag & Drop 존을 그룹으로 묶을때 필요)
     * @public
     */
    getDDGroupId: function() {
        return this.getId() + '-dd-group';
    },

    /**
     * 태스크의 일정의 시작일 또는 종료일을 하위 태스크에 맞게 조정한다.
     *
     * @param parentTask
     * @private
     */
    adjustChildTask: function(parentTask) {
        var store = this.getStore();
        if (parentTask) {
            var childRecords = store.getNodeChildren(parentTask);
            if (childRecords.length > 0) {
                var startDate = childRecords[0].get('startDate');
                var endDate = childRecords[0].get('endDate');
                for (var i = 0; i < childRecords.length; i++) {
                    if (childRecords[i].get('startDate').format('Ymd') < startDate.format('Ymd')) {
                        startDate = childRecords[i].get('startDate');
                    }

                    if (childRecords[i].get('endDate').format('Ymd') > endDate.format('Ymd')) {
                        endDate = childRecords[i].get('endDate');
                    }
                }

                parentTask.set('endDate', endDate);
                parentTask.set('startDate', startDate);

				var startDate_run = childRecords[0].get('startDate_run');
				var endDate_run = childRecords[0].get('endDate_run');
				for (var i = 0; i < childRecords.length; i++) {
					if (childRecords[i].get('startDate_run').format('Ymd') < startDate_run.format('Ymd')) {
						startDate_run = childRecords[i].get('startDate_run');
					}

					if (childRecords[i].get('endDate_run').format('Ymd') > endDate_run.format('Ymd')) {
						endDate_run = childRecords[i].get('endDate_run');
					}
				}

				parentTask.set('endDate_run', endDate_run);
				parentTask.set('startDate_run', startDate_run);
            }
            this.adjustChildTask(store.getNodeParent(parentTask));
        }
    }
});