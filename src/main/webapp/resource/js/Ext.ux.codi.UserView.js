Ext.namespace('Ext.ux.codi');

Ext.ux.codi.UserView = function(config) {
    Ext.apply(this, config);

    var dragdropGroup = config.ddGroup || {};

    var userRecord = Ext.data.Record.create([
        { name: 'empCode' },
        { name: 'empName' },
        { name: 'imgPath' },
        { name: 'email' },
        { name: 'contextPath' }
    ]);

    var viewTemplate = '<tpl for=".">' +
        '<dd id="{empCode}" class="gantt_drag_item">' +
        '<a href="javascript:getPopupCodiUserInfo(\'{empCode}\', \'{empName}\', \'{imgPath}\', \'{email}\', \'wih\');">' +
        '<img src="{contextPath}{imgPath}" width="40" height="40" border="0"/>' +
        '</a></dd></tpl>';

    /**
     * Call Constructor
     */
    Ext.ux.codi.UserView.superclass.constructor.call(this, {
        id: 'USERVIEW_' + config.chartId,
        store: new Ext.data.Store({
            data: config.data,
            reader: new Ext.data.JsonReader({
                id: 'empCode'
            }, userRecord)
        }),
        tpl: config.tpl || viewTemplate,
        itemSelector: config.itemSelector || 'dd.gantt_drag_item',
        listeners: {
            render: function(v) {
                v.dragZone = new Ext.dd.DragZone(v.getEl(), {
                    ddGroup: dragdropGroup,

                    //      On receipt of a mousedown event, see if it is within a draggable element.
                    //      Return a drag data object if so. The data object can contain arbitrary application
                    //      data, but it should also contain a DOM element in the ddel property to provide
                    //      a proxy to drag.
                    getDragData: function(e) {
                        var sourceEl = e.getTarget(v.itemSelector, 10);

                        if (sourceEl) {
                            d = sourceEl.cloneNode(true);
                            d.id = Ext.id();
                            return v.dragData = {
                                sourceEl: sourceEl,
                                repairXY: Ext.fly(sourceEl).getXY(),
                                ddel: d,
                                userData: v.getRecord(sourceEl).data
                            }
                        }
                    },

                    //      Provide coordinates for the proxy to slide back to on failed drag.
                    //      This is the original XY coordinates of the draggable element.
                    getRepairXY: function() {
                        return this.dragData.repairXY;
                    }
                });
            }
        }
    });
};
Ext.extend(Ext.ux.codi.UserView, Ext.DataView);