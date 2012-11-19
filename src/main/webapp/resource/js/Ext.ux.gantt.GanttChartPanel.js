Ext.namespace('Ext.ux.gantt');

/**
 * 간트챠트 통합패널 : 간트챠트 통합패널로 TaskTreeGrid 와 ChartGrid 를 포함한다.
 *
 * <pre>
 * Example)
 * var ganttChartPanel = Ext.ux.gantt.GanttChartPanel({
 *      width: 1000,
 *      height: 450,
 *      treeGridWidth: 400,
 *      renderTo: Ext.getBody(),
 *      viewMode: 'D',
 *      barMode: 'D',
 *      wireMode: '_plan',
 *      projectURL: {
 *          forLoadProject: '',
 *          forSaveProject: '',
 *          forDeleteProject: '',
 *          forLoadSubTasks: '',
 *          forDeleteTask: ''
 *      },
 *      projectData:        // Optional
 *      {
 *          '@uid': 'String',
 *          name:'String',
 *          subject:'String',
 *          category:'String',
 *          description:'String',
 *          author:'String',
 *          creationDate:'2001-12-17T09:30:47Z',
 *          updatedDate:'2001-12-17T09:30:47Z',
 *          startDate:'2011-01-01',
 *          finishDate:'2011-03-25',
 *          status:'String',
 *          Tasks: {
 *              Task: [
 *                  {'@uid': 1,'@seqNo': 1,'@parent':null,'@from': '','@to': '','@wbsLevel': 1,
 *                  '@isLeaf': false,title:'Task 1',type:'',startDate:'2011-01-02',endDate:'2011-01-03',
 *                  duration:2,description:'String',status:'String',priority:0,resources:'String',completeRate:30},
 *                  {'@uid': 2,'@seqNo': 2,'@parent':1,'@from': '','@to': '','@wbsLevel': 2,
 *                  '@isLeaf': true,title:'Milestone',type:'M',startDate:'2011-01-05',endDate:'2011-01-05',
 *                  duration:1,description:'String',status:'String',priority:0,resources:'String',completeRate:0}
 *              ]
 *          }
 *      }
 * });
 * </pre>
 *
 * @class Ext.ux.gantt.GanttChartPanel
 * @extends Ext.Panel
 * @dependency ExtJS
 * @param config
 * @author 이승백
 */
Ext.ux.gantt.GanttChartPanel = function (config) {
	Ext.apply(this, config);

	var CHART_ID = this.getId();

	/**
	 * 프로젝트 Ajax 요청 URL(로드, 저장, 삭제 등)
	 */
	this.projectURL = config.projectURL;

	/**
	 * 프로젝트정보 JSON Object
	 */
	this.projectData = config.projectData;

	/**
	 * ReadOnly
	 */
	this.readOnly = config.readOnly !== undefined ? config.readOnly : true;

	/**
	 * LeftSide : TaskTreeGrid Object
	 */
	this.taskTree = new Ext.ux.gantt.TaskTreeGrid({
		id      : 'TASKTREE_' + this.getId(),
		readOnly: this.readOnly,
		chart_id: this.getId()
	});

	/**
	 * RightSide : GanttChartGrid Object
	 */
	this.chartGrid = new Ext.ux.gantt.ChartGrid({
		id        : 'CHARTGRID_' + this.getId(),
		chart_id  : this.getId(),
		viewMode  : config.viewMode ? config.viewMode : 'D',
		barMode   : config.barMode ? config.barMode : '',
		wireMode  : config.wireMode ? config.wireMode : '',
		readOnly  : this.readOnly,
		startDate : this.projectData ? Date.parseDate(this.projectData.startDate, 'Y-m-d') : new Date(),
		finishDate: this.projectData ? Date.parseDate(this.projectData.finishDate, 'Y-m-d') : new Date().add(Date.MONTH, 2),
		store     : this.taskTree.getStore()
	});

	/**
	 * Call Constructor
	 */
	Ext.ux.gantt.GanttChartPanel.superclass.constructor.call(this, {
		title : 'Gantt Chart',
		layout: 'border',
		border: true,
		items : [
			{
				region : 'west',
				margins: '0 0 0 0',
				split  : true,
				header : false,
				border : false,
				width  : config.treeGridWidth ? config.treeGridWidth : 300,
				minSize: 100,
				maxSize: 500,
				layout : 'fit',
				items  : this.taskTree
			},
			{
				collapsible: false,
				region     : 'center',
				margins    : '0 0 0 0',
				border     : false,
				layout     : 'fit',
				items      : this.chartGrid
			}
		],
		tools : [
			{
				id     : 'zoomin',
				qtip   : Gantt.Msg.zoomIn,
				handler: function (event, toolEl, panel) {
					panel.zoomIn();
				}
			},
			{
				id     : 'zoomout',
				qtip   : Gantt.Msg.zoomOut,
				handler: function (event, toolEl, panel) {
					panel.zoomOut();
				}
			},
			{
				id     : 'plus',
				qtip   : Gantt.Msg.addTask,
				hidden : this.readOnly,
				handler: function (event, toolEl, panel) {
					panel.addRowForNewTask();
				}
			},
			{
				id     : 'minus',
				qtip   : Gantt.Msg.removeTask,
				hidden : this.readOnly,
				handler: function (event, toolEl, panel) {
					panel.deleteTask();
				}
			},
			{
				id     : 'left',
				qtip   : Gantt.Msg.addDate,
				hidden : this.readOnly,
				handler: function (event, toolEl, panel) {
					panel.addHeaderBlock('L');
				}
			},
			{
				id     : 'right',
				qtip   : Gantt.Msg.addDate,
				hidden : this.readOnly,
				handler: function (event, toolEl, panel) {
					panel.addHeaderBlock('R');

				}
			}
//            ,
//            {
//                id:'up',
//                qtip: '위로 이동',
//                handler: function(event, toolEl, panel) {
//
//                }
//            },
//            {
//                id:'down',
//                qtip: '아래로 이동',
//                handler: function(event, toolEl, panel) {
//                }
//            },
//            {
//                id:'save',
//                qtip: '프로젝트 저장',
//                handler: function(event, toolEl, panel) {
//                }
//            },
//            {
//                id:'refresh',
//                qtip: '프로젝트 리로드',
//                handler: function(event, toolEl, panel) {
//                }
//            },
//            {
//                id:'gear',
//                qtip: '설정',
//                handler: function(event, toolEl, panel) {
//                }
//            },
//            {
//                id:'print',
//                qtip: '인쇄',
//                handler: function(event, toolEl, panel) {
//                }
//            },
//            {
//                id:'help',
//                qtip: '도움말',
//                handler: function(event, toolEl, panel) {
//                }
//            }
		]
	});

	// Ajax Request 용 URL 설정
	if (this.projectURL != null) {
		if (this.projectURL.forLoadProject != null &&
			this.projectURL.forLoadProject != '') {
			Ext.ux.gantt.AjaxRequest.URLforLoadProject = this.projectURL.forLoadProject;
		}

		if (this.projectURL.forSaveProject != null &&
			this.projectURL.forSaveProject != '') {
			Ext.ux.gantt.AjaxRequest.URLforSaveProject = this.projectURL.forSaveProject;
		}

		if (this.projectURL.forDeleteProject != null &&
			this.projectURL.forDeleteProject != '') {
			Ext.ux.gantt.AjaxRequest.URLforDeleteProject = this.projectURL.forDeleteProject;
		}

		if (this.projectURL.forLoadSubTasks != null &&
			this.projectURL.forLoadSubTasks != '') {
			Ext.ux.gantt.AjaxRequest.URLforLoadSubTasks = this.projectURL.forLoadSubTasks;
		}

		if (this.projectURL.forDeleteTask != null &&
			this.projectURL.forDeleteTask != '') {
			Ext.ux.gantt.AjaxRequest.URLforDeleteTask = this.projectURL.forDeleteTask;
		}
	}

	// 0. projectData 가 주어진 경우 초기에 차트 드로잉
	if (this.projectData) this.drawProject(this.projectData);

	// Event Handles
	// 1. RowSelect 싱크
	var selectCnt = 0;
	this.taskTree.getSelectionModel().addListener('rowselect', function (selectionModel, rowIndex, record) {
		if (selectCnt < 1) {
			selectCnt++;
			this.getSelectionModel().selectRow(rowIndex);
			return false;
		} else {
			selectCnt = 0;
		}
	}, this.chartGrid);
	this.chartGrid.getSelectionModel().addListener('rowselect', function (selectionModel, rowIndex, record) {
		if (selectCnt < 1) {
			selectCnt++;
			this.getSelectionModel().selectRow(rowIndex);
			return false;
		} else {
			selectCnt = 0;
		}
	}, this.taskTree);

	// 2. 스크롤 싱크
	this.chartGrid.addListener('bodyscroll', function (scrollLeft, scrollTop) {
		this.getGridEl().child('.x-grid3-scroller').dom.scrollTop = scrollTop;
	}, this.taskTree);

	this.taskTree.getGridEl().on('mousewheel', function (e) {
		var scrollTop = this.getGridEl().child('.x-grid3-scroller').dom.scrollTop;
		this.getGridEl().child('.x-grid3-scroller').dom.scrollTop = scrollTop - e.getWheelDelta() * 50;
	}, this.chartGrid);

	// 3. Record Update Event Handle
	this.taskTree.getStore().on('update', function (store, record, operation) {
		if (record.isModified('@uid')) {
			record.id = record.get('@uid');
			store.applyTreeSort();
		}

		if (record.get('type') == 'M') {
			if (record.isModified('startDate')) {
				record.set('endDate', record.get('startDate'));
			} else if (record.isModified('endDate')) {
				record.set('startDate', record.get('endDate'));
			}
		} else {
			var diffDay = Ext.ux.gantt.Common.differentDay(record.get('startDate'), record.get('endDate'));
			if (record.isModified('startDate')) {
				if (diffDay >= 0) {
					record.set('duration', diffDay + 1);
				} else {
					record.set('endDate', record.get('startDate').add(Date.DAY, record.get('duration') - 1));
				}
			} else if (record.isModified('endDate')) {
				if (diffDay >= 0) {
					record.set('duration', diffDay + 1);
				} else {
					record.set('startDate', record.get('endDate').add(Date.DAY, 1 - record.get('duration')));
				}
			}

			var diffDay_run = Ext.ux.gantt.Common.differentDay(record.get('startDate_run'), record.get('endDate_run'));
			if (record.isModified('startDate_run')) {
				if (diffDay >= 0) {
					record.set('duration_run', diffDay_run + 1);
				} else {
					record.set('endDate_run', record.get('startDate_run').add(Date.DAY, record.get('duration_run') - 1));
				}
			} else if (record.isModified('endDate_run')) {
				if (diffDay_run >= 0) {
					record.set('duration_run', diffDay_run + 1);
				} else {
					record.set('startDate_run', record.get('endDate_run').add(Date.DAY, 1 - record.get('duration_run')));
				}
			}
		}

		this.drawChart();

		return false;
	}, this.chartGrid);

	// 4. Expand Node Event Handle
	this.taskTree.getStore().on('expandnode', function (store, record) {
		this.drawChart();
	}, this.chartGrid);
	// 5. Collapse Node Event Handle
	this.taskTree.getStore().on('collapsenode', function (store, record) {
		this.drawChart();
	}, this.chartGrid);
};
Ext.extend(Ext.ux.gantt.GanttChartPanel, Ext.Panel, {
	/**
	 * 프로젝트 정보를 로드하여 간트차트를 드로잉한다.(Ajax 요청)
	 *
	 * @param projectId {String} Project ID
	 * @public
	 */
	loadProject: function (projectId) {
		// 프로젝트 정보를 로드하여 간트차트를 드로잉한다.(Ajax 요청)
	},

	/**
	 * 프로젝트 정보를 서버에 저장한다.(Ajax 요청)
	 * @public
	 */
	saveProject: function () {
		// TODO : 프로젝트 정보를 서버에 저장한다.(Ajax 요청)
	},

	/**
	 * 프로젝트 정보를 서버에서 삭제한다.(Ajax 요청)
	 *
	 * @param projectId {String} Project ID
	 * @public
	 */
	deleteProject: function (projectId) {
		// TODO : 프로젝트 정보를 서버에서 삭제한다.(Ajax 요청)
	},

	/**
	 * 태스크를 서버에서 삭제한다.(Ajax 요청)
	 *
	 * @public
	 */
	deleteTask: function () {
		// TODO : 태스크를 서버에서 삭제한다.(Ajax 요청)
		var selectedTask = this.taskTree.getSelectionModel().getSelected();

		if (selectedTask.get('endDate').format('Ymd') >= (new Date()).format('Ymd')) {
			this.taskTree.deleteTask();
		} else {
			window.alert('지난 일정은 삭제할 수 없습니다.');
		}
	},

	/**
	 * 주어진 프로젝트 정보로 TaskTreeGrid 와 ChartGrid 에 차트를 드로잉한다.
	 *
	 * @param projectData {JSON Object} Project Data JSON Object
	 * @private
	 */
	drawProject: function (projectData) {
		this.taskTree.getStore().loadData(projectData.Tasks);
		(function () {
			this.drawChart();
		}).defer(500, this.chartGrid);
	},

	/**
	 * 새로운 태스크 입력을 위한 Row를 추가한다.
	 *
	 * @param index {Number} 추가할 위치의 인덱스
	 * @public
	 */
	addRowForNewTask: function (index) {
		if (this.projectData.finishDate < (new Date()).format('Y-m-d')) {
			var finishDate = Date.parseDate(this.projectData.finishDate, 'Y-m-d');
			var diff = Ext.ux.gantt.Common.differentDay(finishDate, new Date());
			var offset;
			if (this.viewMode == 'D') {
				offset = parseInt(diff / 7) + 1;
				this.addHeaderBlock('R', offset);
				this.projectData.finishDate = finishDate.add(Date.DAY, 7 * offset);
			} else if (this.viewMode == 'W') {
				offset = parseInt(diff / 30) + 1;
				this.addHeaderBlock('R', parseInt(diff / 30) + 1);
				this.projectData.finishDate = finishDate.add(Date.MONTH, 1 * offset);
			} else if (this.viewMode == 'M') {
				offset = parseInt(diff / 365) + 1;
				this.addHeaderBlock('R', parseInt(diff / 365) + 1);
				this.projectData.finishDate = finishDate.add(Date.YEAR, 1 * offset);
			}
		}

		this.taskTree.addRowForNewTask();
	},

	/**
	 * 날짜 헤더그룹을 동적으로 추가한다.
	 *
	 * @param direction {String} 추가 방향(L:Left, R:Right)
	 * @param offset {Number} 추가될 헤더컬럼 그룹의 Offset(뷰모드 D인경우 일주일추가, W인경우 한달, M인경우 일년 단위)
	 * @public
	 */
	addHeaderBlock: function (direction, offset) {
		this.chartGrid.addHeaderBlock(direction, offset);
	},

	/**
	 * 그리드에서 태스크를 한칸 위로 이동한다.
	 *
	 * @param index {Number} 그리드에서 Task의 index
	 * @public
	 */
	moveUpTask: function (index) {
		// TODO : 그리드에서 태스크를 한칸 위로 이동한다.
	},

	/**
	 * 그리드에서 태스크를 한칸 아래로 이동한다.
	 *
	 * @param index {Number} 그리드에서 Task의 index
	 * @public
	 */
	moveDownTask: function (index) {
		// TODO : 그리드에서 태스크를 한칸 아래로 이동한다.
	},

	/**
	 * 뷰모드를 줌인한다.
	 *
	 * @public
	 */
	zoomIn: function () {
		switch (this.chartGrid.viewMode) {
		case 'M':
			this.chartGrid.changeViewMode('W');
			break;
		case 'W':
			this.chartGrid.changeViewMode('D');
			break;
		}
	},

	/**
	 * 뷰모드를 줌아웃한다.
	 *
	 * @public
	 */
	zoomOut: function () {
		switch (this.chartGrid.viewMode) {
		case 'D':
			this.chartGrid.changeViewMode('W');
			break;
		case 'W':
			this.chartGrid.changeViewMode('M');
			break;
		}
	},

	/**
	 * 모든 트리노드를 확장한다.
	 *
	 * @public
	 */
	expandAll: function () {
		this.taskTree.expandAll();
	},

	/**
	 * 모든 트리노드를 닫는다.
	 *
	 * @public
	 */
	collapseAll: function () {
		this.taskTree.collapseAll();
	}
});