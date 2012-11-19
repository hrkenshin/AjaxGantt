Ext.namespace('Ext.ux.gantt');
/**
 * 간트챠트 : 공통 유틸 Javascript 클래스
 *
 * @class Ext.ux.gantt.Common
 * @dependency ExtJS
 * @author 이승백
 */
Ext.ux.gantt.Common = new (function() {
    /**
     * Loading Mask
     */
    this.LoadMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});

    /**
     * 두값을 비교해서 더큰 값을 리턴해준다.
     * @param jsFile
     */
    this.compareIntegerValue = function(value1, value2) {
        value1 = parseInt(value1, 10);
        value2 = parseInt(value2, 10);
        if (value1 > value2) {
            return value1;
        } else if (value1 < value2) {
            return value2;
        } else {
            return value1;
        }
    }

    /**
     * JavaScript 파일을 동적 로딩한다.
     * @param jsFile javascript 파일 경로
     */
    this.includeJavaScript = function(jsFile) {
        var oHead = document.getElementsByTagName('head')[0];
        var oScript = document.createElement('script');
        oScript.type = 'text/javascript';
        oScript.charset = 'utf-8';
        oScript.src = jsFile;
        oHead.appendChild(oScript);
    }

    /**
     * 팝업윈도우를 오픈한다.
     * @param {Object} url
     * @param {Object} name
     * @param {Object} width
     * @param {Object} height
     */
    this.openWindow = function(url, name, width, height) {
        var baseOption = 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=yes,channelmode=no,fullscreen=no';
        var top = (window.screen.availHeight - height) / 2;
        var left = (window.screen.availWidth - width) / 2;
        var win = window.open(url, name, baseOption + ',width=' + width + ',height=' + height + ',top=' + top + ',left=' + left);
        win.focus();
        return win;
    }

    /**
     * 팝업윈도우를 오픈한다.
     * @param {Object} url
     * @param {Object} name
     * @param {Object} width
     * @param {Object} height
     */
    this.openWindow = function(url, name, width, height, scrollbar) {
        var baseOption = 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=' + scrollbar + ',resizable=yes,channelmode=no,fullscreen=no';
        var top = (window.screen.availHeight - height) / 2;
        var left = (window.screen.availWidth - width) / 2;
        var win = window.open(url, name, baseOption + ',width=' + width + ',height=' + height + ',top=' + top + ',left=' + left);
        win.focus();
        return win;
    }

    /**
     * ISO 8601 date 를 주어진 포맷으로 변환한다.
     * @param {Object} dateStr ISO 8601 date '2007-04-17T15:19:21.341+09:00'
     * @param {Object} format ExtJS:Date 클래스의 format 참조 디폴트 'Y-m-d H:i:s'
     * @return {String} formatedDate
     */
    this.convertDateFormat = function(dateStr, format) {
        var formatedDate = '';
        var formatStr = Ext.isEmpty(format, false) ? 'Y-m-d H:i:s' : format;

        if (!Ext.isEmpty(dateStr, false) && Date.parseDate(dateStr, 'c') != null) {
            formatedDate = Date.parseDate(dateStr, 'c').format(formatStr);
        }
        return formatedDate;
    }

    /**
     * 두 날짜의 시간차이를 일,시간,분,초로 반환한다.
     * @param fromtDate
     * @param toDate
     */
    this.differentDate = function(fromtDate, toDate) {
        var duration = (toDate.getTime() - fromtDate.getTime()) / 1000;

        var min = 60;
        var hour = min * 60;
        var day = hour * 24;

        var sd = parseInt(duration / day);
        var sh = parseInt((duration % day) / hour);
        var sm = parseInt((duration % hour) / min);
        var ss = parseInt(duration % min);

        if (sd != 0 && sh != 0 && sm != 0) {
            return sd + '일 ' + sh + '시간 ' + sm + '분 ' + ss + '초';
        } else if (sh != 0 && sm != 0) {
            return sh + '시간 ' + sm + '분 ' + ss + '초';
        } else if (sm != 0) {
            return sm + '분 ' + ss + '초';
        } else {
            return ss + '초';
        }
    }

    /**
     * 두 날짜의 시간차이를 일 단위로 반환한다.
     * @param fromDate
     * @param toDate
     */
    this.differentDay = function(fromDate, toDate) {
        if(fromDate == null || toDate == null) return 0;
        var duration = (toDate.getTime() - fromDate.getTime()) / 1000;

        var min = 60;
        var hour = min * 60;
        var day = hour * 24;

        var sd = parseInt(duration / day);

        return sd;
    }

    /**
     * 주어진 포맷의 날짜String 을 ISO 8601 date 로 변환한다.
     *
     * @param {Object} dateStr
     * @param {Object} format ExtJS:Date 클래스의 format 참조 디폴트 'Y-m-d H:i:s'
     * @return {String} ISO 8601 date '2007-04-17T15:19:21.341+09:00'
     */
    this.convertToXMLDate = function(dateStr, format) {
        var formatedDate = '';
        var formatStr = Ext.isEmpty(format, false) ? 'Y-m-d H:i:s' : format;

        if (!Ext.isEmpty(dateStr, false) && Date.parseDate(dateStr, formatStr) != null) {
            formatedDate = Date.parseDate(dateStr, formatStr).format('c');
        }
        return formatedDate;
    }

    /**
     *
     * @param value
     * @param p
     * @param record
     */
    this.dateFormat = function(value, p, record) {
        return String.format('{0}', this.convertDateFormat(value, 'Y-m-d H:i'));
    }

    /**
     * 1차원 Array 값을 Delimiter 로 구분된 String 문자열로 반환한다.
     *
     * @param arrayObj {Array}
     * @param delimiter {String} 델리미터
     * @return {String}
     */
    this.arrayToString = function(arrayObj, delimiter) {
        var values = '';
        var deli = delimiter;
        if (typeof delimiter == 'undefined') {
            deli = ',';
        }
        for (var i = 0; i < arrayObj.length; i++) {
            values += arrayObj[i];
            if (i < arrayObj.length - 1) values += deli;
        }

        return values;
    }

    /**
     * Object 를 복사한다.
     *
     * @param obj {Object}
     * @return {Object}
     */
    this.clone = function(obj) {
        if (obj == null || typeof(obj) != 'object')
            return obj;

        var temp = new obj.constructor();
        for (var key in obj)
            temp[key] = this.clone(obj[key]);

        return temp;
    }

    /**
     * Info 메시지를 Notification 한다.(팝업 & 상태바에 표시)
     *
     * @param msg {String} 메시지
     */
    this.infoNotification = function(msg) {
        new Ext.ux.Notification({
            title: 'Information',
            html: msg,
            shadow: false,
            iconCls: 'x-icon-information'
        }).show(document);

        if (Ext.getCmp(Ext.ux.gantt.Properties.STATUSBAR_ID)) {
            (function() {
                Ext.getCmp(Ext.ux.gantt.Properties.STATUSBAR_ID).setStatus({
                    text: msg,
                    iconCls: 'x-status-valid'
                });
            }).defer(3500);
        }
    }

    /**
     * Error 메시지를 Notification 한다.(팝업 & 상태바에 표시)
     *
     * @param msg {String} 메시지
     */
    this.errorNotification = function(msg) {
        if (msg == null) return;
        new Ext.ux.Notification({
            title: 'Warning',
            html: msg,
            shadow: false,
            iconCls: 'x-icon-exclamation'
        }).show(document);

        if (Ext.getCmp(Ext.ux.gantt.Properties.STATUSBAR_ID)) {
            (function() {
                Ext.getCmp(Ext.ux.gantt.Properties.STATUSBAR_ID).setStatus({
                    text: msg,
                    iconCls: 'x-status-error'
                });
            }).defer(3500);
        }
    }
});

Ext.apply(Ext.form.VTypes, {
    daterange : function(val, field) {
        var date = field.parseDate(val);

        if (!date) {
            return false;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = Ext.getCmp(field.startDateField);
            start.setMaxValue(date);
            start.validate();
            this.dateRangeMax = date;
        }
        else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = Ext.getCmp(field.endDateField);
            end.setMinValue(date);
            end.validate();
            this.dateRangeMin = date;
        }
        /*
         * Always return true since we're only using this vtype to set the
         * min/max allowed values (these are tested for after the vtype test)
         */
        return true;
    }
});