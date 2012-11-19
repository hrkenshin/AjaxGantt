Ext.namespace('Ext.ux.gantt');

/**
 * 간트챠트 : Ext.grid.GridPanel 을 Extension 하여 간트차트의
 * 오른쪽 영역인 스케줄바를 드로잉하는 차트영역을 구현한다.
 *
 * <pre>
 * config =
 *  {
 *      id: '',         // {String} ChartGrid ID
 *      chart_id: '',   // {String} GanttGhart ID
 *      viewMode: '',   // {String} 뷰모드(D:Day, W:Week, M:Month)
 *      barMode: '',    // {String} 스케줄바모드(D:Dual plan and run)
 *      wireMode: '',   // {String} Wire 모드(_plan, _run)
 *      startDate: '',  // {Date} 프로젝트 시작일
 *      finishDate: '', // {Date} 프로젝트 종료일
 *      store: ''       // {Ext.data.Store} Task Record Store
 *  }
 * </pre>
 *
 * @class Ext.ux.gantt.ChartGrid
 * @extends Ext.grid.GridPanel
 * @dependency ExtJS
 * @param config {JSON Object}
 * @author 이승백
 */
Ext.ux.gantt.ChartGrid = function (config) {
	Ext.apply(this, config);

	this.startDate = config.startDate ? config.startDate : new Date();
	this.finishDate = config.finishDate ? config.finishDate : new Date().add(Date.MONTH, 3);
	this.viewMode = config.viewMode ? config.viewMode : 'D';
	this.barMode = config.barMode ? config.barMode : '';
	this.wireMode = config.wireMode ? config.wireMode : '';
	this.readOnly = config.readOnly;

	// ViewMode 에 따라 헤더그룹을 생성한다.
	var headerGroup;
	if (this.viewMode == 'D') {
		headerGroup = this.createHeaderGroupByDay(this.startDate, this.finishDate);
	} else if (this.viewMode == 'W') {
		headerGroup = this.createHeaderGroupByWeek(this.startDate, this.finishDate);
	} else if (this.viewMode == 'M') {
		headerGroup = this.createHeaderGroupByMonth(this.startDate, this.finishDate);
	}

	// 마우스 우클릭 ContextMenu
	var gridContextMenu = new Ext.menu.Menu({
		items    : [
			{
				id     : this.getId() + '_MN_RATE',
				iconCls: 'icon_excel',
				text   : '완료율',
				menu   : {
					xtype    : 'menu',
					items    : new Ext.form.SpinnerField({
						id       : this.getId() + '_SF_RATE',
						minValue : 0,
						maxValue : 100,
						width    : 50,
						listeners: {
							valid: function (field) {
								var task = this.getSelectionModel().getSelected();
								task.set('completeRate', field.getValue());
							}.createDelegate(this)
						}
					}),
					listeners: {
						show: function (menu) {
							var task = this.getSelectionModel().getSelected();
							var fieldRate = menu.findById(this.getId() + '_SF_RATE');
							fieldRate.setValue(task.get('completeRate'));
						}.createDelegate(this)
					}
				}
			},
			{
				id     : this.getId() + '_MN_SDATE',
				iconCls: 'calendar',
				text   : '시작일',
				menu   : new Ext.menu.DateMenu({
					handler  : function (dp, date) {
						var task = this.getSelectionModel().getSelected();
						task.set('startDate', dp.getValue());
						this.adjustChildTask(this.getStore().getNodeParent(task));
					}.createDelegate(this),
					listeners: {
						show: function (date) {
							var task = this.getSelectionModel().getSelected();
							date.picker.setValue(task.get('startDate'));
							date.picker.setMinDate(new Date());
							date.picker.setMaxDate(this.finishDate);
						}.createDelegate(this)
					}
				})
			},
			{
				id     : this.getId() + '_MN_EDATE',
				iconCls: 'calendar',
				text   : '종료일',
				menu   : new Ext.menu.DateMenu({
					handler  : function (dp, date) {
						var task = this.getSelectionModel().getSelected();
						task.set('endDate', dp.getValue());
						this.adjustChildTask(this.getStore().getNodeParent(task));
					}.createDelegate(this),
					listeners: {
						show: function (date) {
							var task = this.getSelectionModel().getSelected();
							date.picker.setValue(task.get('endDate'));
							date.picker.setMinDate(
								task.get('startDate').format('Ymd') < (new Date()).format('Ymd') ? new Date() : task.get('startDate'));
							date.picker.setMaxDate(this.finishDate);
						}.createDelegate(this)
					}
				})
			}
		],
		listeners: {
			show: function (menu) {
				// 지난 일정 수정 불가 처리
				var task = this.getSelectionModel().getSelected();
				var menuRate = menu.findById(this.getId() + '_MN_RATE');
				var menuSDate = menu.findById(this.getId() + '_MN_SDATE');
				var menuEDate = menu.findById(this.getId() + '_MN_EDATE');
				if (task.get('endDate').format('Ymd') < (new Date()).format('Ymd') || task.get('type') == 'M') {
					menuRate.disable();
					menuSDate.disable();
					menuEDate.disable();
				} else if (!task.get('@isLeaf')) {
					menuRate.enable();
					menuSDate.disable();
					menuEDate.disable();
				} else if (task.get('startDate').format('Ymd') < (new Date()).format('Ymd')) {
					menuRate.enable();
					menuSDate.disable();
					menuEDate.enable();
				} else {
					menuRate.enable();
					menuSDate.enable();
					menuEDate.enable();
				}
			}.createDelegate(this)
		}
	});

	// call constructor
	Ext.ux.gantt.ChartGrid.superclass.constructor.call(this, {
		store             : config.store,
		enableColumnMove  : false,
		enableColumnResize: false,
		enableHdMenu      : false,
		border            : false,
		viewConfig        : {
			forceFit: false,
			viewTree: false
		},
		sm                : new Ext.grid.RowSelectionModel({
			singleSelect: true
		}),
		plugins           : new Ext.ux.grid.ColumnHeaderGroup({
			rows: [headerGroup.hdGroupRows]
		}),
		colModel          : new Ext.grid.ColumnModel({
			columns : headerGroup.hdColumns,
			defaults: {
				sortable: false,
				width   : Ext.ux.gantt.Properties.BASE_COLUMN_WIDTH
			}
		}),
		listeners         : {
			rowcontextmenu: function (grid, rowIndex, event) {
				if (!this.readOnly) {
					grid.getSelectionModel().selectRow(rowIndex);
					gridContextMenu.showAt(event.getXY());
				}
			}.createDelegate(this)
		}
	});
};
Ext.extend(Ext.ux.gantt.ChartGrid, Ext.ux.maximgb.tg.EditorGridPanel, {
	/**
	 * 뷰모드(D:Day) 로 Header Group을 생성하여 반환한다.
	 *
	 * @param startDate {Date}
	 * @param finishDate {Date}
	 * @return {hdGroupRows, hdColumns, storeFields}
	 * @private
	 */
	createHeaderGroupByDay: function (startDate, finishDate) {
		var groupRows = [];
		var hdDate, idx, idxDate;
		var columns = [];
		var fields = [];
		var DAY_OF_WEEK = 7;

		var cStartDate = startDate.add(Date.DAY, -1 * startDate.format('w') - DAY_OF_WEEK * 1);
		var cEndDate = finishDate.add(Date.DAY, 6 - finishDate.format('w') + DAY_OF_WEEK * 2);
		var differentWeek = (Ext.ux.gantt.Common.differentDay(cStartDate, cEndDate) + 1) / DAY_OF_WEEK;

		for (var i = 0; i < differentWeek; i++) {
			hdDate = cStartDate.add(Date.DAY, i * DAY_OF_WEEK);
			groupRows.push({
				header : hdDate.format(Gantt.Date.dayFormat),
				colspan: DAY_OF_WEEK,
				align  : 'center'
			});

			for (var j = 0; j < DAY_OF_WEEK; j++) {
				idxDate = hdDate.add(Date.DAY, j);
				idx = idxDate.format('Y-m-d');

				columns.push({
					header   : Gantt.Date.dayNames[idxDate.format('w')],
					dataIndex: idx,
					css      : (new Date()).format('Y-m-d') == idx ? 'background-color: #faebd7;' : (j == 0 || j == 6 ? 'background-color: #eee;' : '')
				});

				fields.push({
					name: idx
				})
			}
		}

		return {
			hdGroupRows: groupRows,
			hdColumns  : columns,
			storeFields: fields
		}
	},

	/**
	 * 뷰모드(W:Week) 로 Header Group을 생성하여 반환한다.
	 *
	 * @param startDate {Date}
	 * @param finishDate {Date}
	 * @return {hdGroupRows, hdColumns, storeFields}
	 * @private
	 */
	createHeaderGroupByWeek: function (startDate, finishDate) {
		var groupRows = [];
		var hdDate, idx;
		var columns = [];
		var fields = [];
		var DAY_OF_WEEK = 7;
		var countOfWeek = 0;

		var firstDateOfMonth = startDate.add(Date.MONTH, -1).getFirstDateOfMonth();
		var lastDateOfMonth = finishDate.add(Date.MONTH, 1).getLastDateOfMonth();

		var cStartDate = firstDateOfMonth.add(Date.DAY, -1 * firstDateOfMonth.format('w'));
		if (cStartDate.getMonth() < firstDateOfMonth.getMonth()) {
			cStartDate = cStartDate.add(Date.DAY, DAY_OF_WEEK);
		}
		var cEndDate = lastDateOfMonth.add(Date.DAY, 6 - lastDateOfMonth.format('w'));
		var differentWeek = (Ext.ux.gantt.Common.differentDay(cStartDate, cEndDate) + 1) / DAY_OF_WEEK;

		for (var i = 0; i < differentWeek; i++) {
			if (hdDate != null && hdDate.format('Y-m') != cStartDate.add(Date.DAY, i * DAY_OF_WEEK).format('Y-m')) {
				groupRows.push({
					header : hdDate.format(Gantt.Date.monthFormat),
					colspan: countOfWeek,
					align  : 'center'
				});
				countOfWeek = 1;
			} else if (i == differentWeek - 1) {
				groupRows.push({
					header : hdDate.format(Gantt.Date.monthFormat),
					colspan: countOfWeek + 1,
					align  : 'center'
				});
				countOfWeek = 1;
			} else {
				countOfWeek++;
			}

			hdDate = cStartDate.add(Date.DAY, i * DAY_OF_WEEK);
			idx = hdDate.format('Y-m-d');
			columns.push({
				header   : hdDate.format('d'),
				dataIndex: idx,
				css      : (new Date()).add(Date.DAY, -1 * (new Date()).format('w')).format('Y-m-d') == idx ? 'background-color: #faebd7;' : ''
			});

			fields.push({
				name: idx
			})
		}

		return {
			hdGroupRows: groupRows,
			hdColumns  : columns,
			storeFields: fields
		}
	},

	/**
	 * 뷰모드(M:Month) 로 Header Group을 생성하여 반환한다.
	 *
	 * @param startDate {Date}
	 * @param finishDate {Date}
	 * @return {hdGroupRows, hdColumns, storeFields}
	 * @private
	 */
	createHeaderGroupByMonth: function (startDate, finishDate) {
		var groupRows = [];
		var hdDate, idx, idxDate;
		var columns = [];
		var fields = [];
		var MONTH_OF_YEAR = 12;

		var cStartYear = startDate.add(Date.MONTH, -3).getFullYear();
		var cEndYear = finishDate.add(Date.MONTH, 3).getFullYear();

		for (var i = cStartYear; i <= cEndYear; i++) {
			hdDate = new Date(i, 0, 1);
			groupRows.push({
				header : hdDate.format('Y'),
				colspan: MONTH_OF_YEAR,
				align  : 'center'
			});

			for (var j = 0; j < MONTH_OF_YEAR; j++) {
				idxDate = hdDate.add(Date.MONTH, j);
				idx = idxDate.format('Y-m');
				columns.push({
					header   : idxDate.format('m'),
					dataIndex: idx,
					css      : (new Date()).format('Y-m') == idx ? 'background-color: #faebd7;' : ''
				});

				fields.push({
					name: idx
				})
			}
		}

		return {
			hdGroupRows: groupRows,
			hdColumns  : columns,
			storeFields: fields
		}
	},

	/**
	 * 뷰모드를 일,주,월 단위로 변경한다.
	 *
	 * @param mode 뷰모드(D:일, W:주, M:월)
	 * @public
	 */
	changeViewMode: function (mode) {
		var headerGroup;

		switch (mode) {
		case 'D':
			headerGroup = this.createHeaderGroupByDay(this.startDate, this.finishDate);
			break;
		case 'W':
			headerGroup = this.createHeaderGroupByWeek(this.startDate, this.finishDate);
			break;
		case 'M':
			headerGroup = this.createHeaderGroupByMonth(this.startDate, this.finishDate);
			break;
		}

		this.viewMode = mode;

		this.getColumnModel().rows = [headerGroup.hdGroupRows];
		this.getColumnModel().setConfig(headerGroup.hdColumns);

		this.drawChart();
	},

	/**
	 * 날짜 헤더그룹을 동적으로 추가한다.
	 *
	 * @param direction {String} 추가 방향(L:Left, R:Right)
	 * @param offset {Number} 추가될 헤더컬럼 그룹의 Offset(뷰모드 D인경우 일주일추가, W인경우 한달, M인경우 일년 단위), 디폴트 1
	 * @public
	 */
	addHeaderBlock: function (direction, offset) {
		if (offset == null) offset = 1;
		switch (this.viewMode) {
		case 'D':
			if (direction == 'L') {
				this.startDate = this.startDate.add(Date.DAY, -7 * offset);
			} else {
				this.finishDate = this.finishDate.add(Date.DAY, 7 * offset);
			}
			break;
		case 'W':
			if (direction == 'L') {
				this.startDate = this.startDate.add(Date.MONTH, -1 * offset);
			} else {
				this.finishDate = this.finishDate.add(Date.MONTH, 1 * offset);
			}
			break;
		case 'M':
			if (direction == 'L') {
				this.startDate = this.startDate.add(Date.YEAR, -1 * offset);
			} else {
				this.finishDate = this.finishDate.add(Date.YEAR, 1 * offset);
			}
			break;
		}

		this.changeViewMode(this.viewMode);

		if (direction == 'L') {
			this.getGridEl().child('.x-grid3-scroller').dom.scrollLeft = 0;
		} else {
			this.getGridEl().child('.x-grid3-scroller').dom.scrollLeft = 99999;
		}
	},

	/**
	 * 설정된 Store값에 따로 스케줄바를 드로잉한다.
	 *
	 * @public
	 */
	drawChart: function () {
		this.getStore().each(function (record, index, allRecords) {
			if (this.barMode === 'D') {
				this.drawScheduleBar(record, '_plan');
				this.drawScheduleBar(record, '_run');
			} else {
				this.drawScheduleBar(record);
			}
		}, this);
	},

	/**
	 * Task Record 값으로 스케줄바를 드로잉한다.
	 *
	 * @param record {Ext.data.Record}
	 * @param barMode {String} 모드(_plan, _run)
	 * @private
	 */
	drawScheduleBar: function (record, barMode) {
		var START_DATE_COLUMN, END_DATE_COLUMN, DURATION_COLUMN, COMPLETERATE_COLUMN;
		if (barMode === '_plan') {
			START_DATE_COLUMN = 'startDate';
			END_DATE_COLUMN = 'endDate';
			DURATION_COLUMN = 'duration';
			COMPLETERATE_COLUMN = 'completeRate';
		} else if (barMode === '_run') {
			START_DATE_COLUMN = record.get('type') === 'M' ? 'startDate' : 'startDate_run';
			END_DATE_COLUMN = record.get('type') === 'M' ? 'endDate' : 'endDate_run';
			DURATION_COLUMN = record.get('type') === 'M' ? 'duration' : 'duration_run';
			COMPLETERATE_COLUMN = record.get('type') === 'M' ? 'completeRate' : 'completeRate_run';
		} else {
			START_DATE_COLUMN = 'startDate';
			END_DATE_COLUMN = 'endDate';
			DURATION_COLUMN = 'duration';
			COMPLETERATE_COLUMN = 'completeRate';
		}

		if (!record.get(START_DATE_COLUMN) || !record.get(END_DATE_COLUMN)
			|| !record.get(DURATION_COLUMN) || !record.get(COMPLETERATE_COLUMN)) {
			return;
		}

		var store = this.getStore();
		var columnModel = this.getColumnModel();
		var gridView = this.getView();

		// Task 의 시작일 위치 Cell HTML Element 얻는다.
		var cellElement = null;
		switch (this.viewMode) {
		case 'D':
			cellElement = gridView.getCell(store.indexOf(record), columnModel.findColumnIndex(record.get(START_DATE_COLUMN).format('Y-m-d')));
			break;
		case 'W':
			cellElement = gridView.getCell(store.indexOf(record),
				columnModel.findColumnIndex(record.get(START_DATE_COLUMN).add(Date.DAY, -1 * record.get(START_DATE_COLUMN).format('w')).format('Y-m-d')));
			break;
		case 'M':
			cellElement = gridView.getCell(store.indexOf(record), columnModel.findColumnIndex(record.get(START_DATE_COLUMN).format('Y-m')));
			break;
		}

		var from = record.get('@from');
		var fromArray = new Array(0);
		if (from != null && from != '') {
			fromArray = from.split(',');
		}

		// 선행 Task 정보를 수집한다.
		var previousTasksInfo = new Array();
		var fromRecord = null;
		for (var i = 0; i < fromArray.length; i++) {
			fromRecord = store.getById(fromArray[i]);
			if (fromRecord != null && store.isVisibleNode(fromRecord)) {
				// 감춰진 Task 에 대한 index difference 보정
				var indexDif = 0;
				if (store.indexOf(fromRecord) < store.indexOf(record)) {
					for (var j = store.indexOf(fromRecord); j < store.indexOf(record); j++) {
						if (store.isVisibleNode(store.getAt(j))) {
							indexDif = indexDif + 1;
						}
					}
				} else {
					for (var j = store.indexOf(fromRecord); j > store.indexOf(record); j--) {
						if (store.isVisibleNode(store.getAt(j))) {
							indexDif = indexDif - 1;

						}
					}
				}

				if (fromRecord.get(END_DATE_COLUMN)) {
					previousTasksInfo.push({
						uid     : fromRecord.get('@uid'),
						indexDif: indexDif,
						dateDif : Ext.ux.gantt.Common.differentDay(fromRecord.get(END_DATE_COLUMN), record.get(START_DATE_COLUMN))
					});
				}
			}

		}

		// 스케줄바를 드로잉한다.
		var scheduleBar = new Ext.ux.gantt.ScheduleBar({
			chartId      : this.getId(),
			viewMode     : this.viewMode,
			targetEl     : cellElement,
			taskRecord   : record,
			prevTasksInfo: previousTasksInfo,
			barMode      : barMode,
			wireMode     : this.wireMode,
			readOnly     : this.readOnly
		});

		scheduleBar.draw();
	},

	/**
	 * 태스크의 일정의 시작일 또는 종료일을 하위 태스크에 맞게 조정한다.
	 *
	 * @param parentTask
	 * @private
	 */
	adjustChildTask: function (parentTask) {
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
				if (startDate_run && endDate_run) {
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
			}
			this.adjustChildTask(store.getNodeParent(parentTask));
		}
	}
});