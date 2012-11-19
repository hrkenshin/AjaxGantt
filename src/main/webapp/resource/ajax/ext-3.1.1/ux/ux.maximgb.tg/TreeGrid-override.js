Ext.override(Ext.ux.maximgb.tg.EditorGridPanel, {
    /*
     EditorGridPanel makes some assumptions about the dom structure.
     We need to override this method as the dom structure is not exactly as expected
     */
    //    startEditing : function(row, col) {
    //        this.stopEditing();
    //        if (this.colModel.isCellEditable(col, row)) {
    //            this.view.ensureVisible(row, col, true);
    //            var r = this.store.getAt(row);
    //            var field = this.colModel.getDataIndex(col);
    //            var e = {
    //                grid: this,
    //                record: r,
    //                field: field,
    //                value: r.data[field],
    //                row: row,
    //                column: col,
    //                cancel:false
    //            };
    //            if (this.fireEvent("beforeedit", e) !== false && !e.cancel) {
    //                this.editing = true;
    //                var ed = this.colModel.getCellEditor(col, row);
    //                if (!ed.rendered) {
    //                    ed.render(this.view.getEditorParent(ed));
    //                }
    //                (function() { // complex but required for focus issues in safari, ie and opera
    //                    ed.row = row;
    //                    ed.col = col;
    //                    ed.record = r;
    //                    ed.on("complete", this.onEditComplete, this, {single: true});
    //                    ed.on("specialkey", this.selModel.onEditorKey, this.selModel);
    //                    this.activeEditor = ed;
    //                    var v = this.preEditValue(r, field);
    //                    /* gd */
    //                    var dom = this.view.getCell(row, col).firstChild;
    //                    var masterColumnIndex = this.colModel.findColumnIndex(this.master_column_id);
    //                    if (col == masterColumnIndex) {
    //                        var el = Ext.get(dom);
    //                        dom = el.next();
    //                    }
    //                    ed.startEdit(dom, v);
    //                    /* end gd */
    //                }).defer(50, this);
    //            }
    //        }
    //    },
    //    onTreeGridSelectionChange : function(sm, selection) {
    //        if (!selection && !sm.getSelected) {
    //            this.getStore().setActiveNode(null);
    //            return;
    //        }
    //        var record;
    //        // Row selection model
    //        if (sm.getSelected) {
    //            record = sm.getSelected();
    //            this.getStore().setActiveNode(record);
    //        }
    //        // Cell selection model
    //        else {
    //            if (selection.cell) {
    //                record = this.getStore().getAt(selection.cell[0]);
    //                this.getStore().setActiveNode(record);
    //            }
    //        }
    //    },
    onRender: function(ct, position) {
        //        Ext.ux.maximgb.tg.EditorGridPanel.superclass.onRender.apply(this, arguments);
        Ext.ux.maximgb.tg.EditorGridPanel.superclass.onRender.call(this, ct, position);
        this.el.addClass('ux-maximgb-tg-panel');

        var store = this.store;
        if (this.enableDragDrop != false) {
            var canDrop = function(draggedRecord, overRecord) {
                if (Ext.isEmpty(overRecord)) return true;
                if (store.getNodeParent(draggedRecord) === overRecord) {
                    console.log('getNodeParent');
                    return  false;
                }
                if (overRecord === draggedRecord) {
                    console.log('draggedRecord');
                    return false;
                }
                if (overRecord.isNew) {
                    return false;
                }

                var index = store.getNodeAncestors(overRecord).indexOf(draggedRecord);

                return  index < 0;
            };

            var ddGroupId = this.id + '-dd-group';
            var dragZone = new Ext.grid.GridDragZone(this, {ddGroup: ddGroupId});
            var dropZone = new Ext.dd.DropZone(this.getView().scroller, {
                ddGroup: ddGroupId,
                notifyOver: function(dd, evt, data) {
                    var cls = this.dropNotAllowed;

                    var draggedRecord = dd.dragData.selections[0];

                    var target = evt.getTarget();
                    var rowIndex = this.getView().findRowIndex(target);

                    var overRecord = this.getStore().getAt(rowIndex);

                    if (canDrop(draggedRecord, overRecord)) {
                        cls = Ext.dd.DropZone.prototype.dropAllowed;
                    }

                    return cls;
                }.createDelegate(this),
                notifyDrop: function(dd, evt, data) {
                    var draggedRecord = dd.dragData.selections[0];

                    var target = evt.getTarget();
                    var rowIndex = this.getView().findRowIndex(target);

                    var overRecord = this.getStore().getAt(rowIndex);

                    var isCanDrop = canDrop(draggedRecord, overRecord);

                    if (isCanDrop) {
                        if (overRecord) {

                            var fn = function() {
                                var store = this.getStore();

                                var parentId = overRecord.get('@uid');
                                draggedRecord.set(store.parent_id_field_name, parentId);

                                store.applyTreeSort();

                                this.getSelectionModel().deselectRange();
                                this.getSelectionModel().selectRecords([draggedRecord], false);

                                this.getView().refresh(true);


                            }.createDelegate(this);

                            var expanded = this.store.isExpandedNode(overRecord);
                            if (!expanded) {
                                this.expandAndApply(overRecord, fn);
                            }
                            else {
                                fn();
                            }
                        }
                        else {
                            var store = this.getStore();

                            draggedRecord.set(store.parent_id_field_name, null);

                            store.applyTreeSort();

                            this.getSelectionModel().deselectRange();
                            this.getSelectionModel().selectRecords([draggedRecord], false);

                            this.getView().refresh(true);

                        }
                        return true;
                    }
                }.createDelegate(this)
            });

            this.dropZone = dropZone;
        }
    },
    expandAndApply: function(anode, fn) {
        if (!anode) {
            fn();
            return;
        }

        var store = this.getStore();

        var storeExpandNodeCallback = store.expandNodeCallback;

        store.expandNodeCallback = function(r, options, success) {
            storeExpandNodeCallback.apply(store, arguments);
            fn();
        }.createDelegate(this);
        store.expandNode(anode);
        store.setActiveNode(anode);

        store.expandNodeCallback = storeExpandNodeCallback;
    }
});