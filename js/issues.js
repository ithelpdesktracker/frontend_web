var $table = $('#table'),
    $remove = $('#remove'),
    selections = [];

function initTable() {
    $table.bootstrapTable({
        height: getHeight(),
        columns: [
            [{
                field: 'state',
                checkbox: true,
                align: 'center',
                valign: 'middle'
            }, {
                title: 'Issue ID',
                field: 'iss_id',
                align: 'center',
                sortable: true,
            }, {
                title: 'Assigned Tech',
                field: 'tech_ucid',
                sortable: true,
                editable: true,
                align: 'center',
            }, {
                field: 'building_id',
                title: 'Building ID',
                align: 'center',
                sortable: true,
                editable: true,
            }, {
                title: 'Issue Type',
                field: 'iss_type',
                sortable: true,
                editable: true,
                align: 'center'
            },
            {
                field: 'status',
                title: 'Status',
                sortable: true,
                editable: true,
                align: 'center'
            }, {
                field: 'room_num',
                title: 'Room #',
                sortable: true,
                align: 'center',
                editable: true,
            }, {
                field: 'cust_ucid',
                title: 'Customer UCID',
                align: 'center',
                sortable: true,
                editable: true
            }, {
                field: 'iss_description',
                title: 'Issue Description',
                align: 'center',
            }]
        ]
    });
    // sometimes footer render error.
    setTimeout(function () {
        $table.bootstrapTable('load');
    }, 1000);
    $table.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table',
        function () {
            $remove.prop('disabled', !$table.bootstrapTable('getSelections').length);
            // save your data, here just save the current page
            selections = getIdSelections();
            // push or splice the selections if you want to save all data selections
        });
    $table.on('expand-row.bs.table', function (e, index, row, $detail) {
        if (index % 2 == 1) {
            $detail.html('Loading from ajax request...');
            $.get('LICENSE', function (res) {
                $detail.html(res.replace(/\n/g, '<br>'));
            });
        }
    });
    $table.on('all.bs.table', function (e, name, args) {
        console.log(name, args);
    });
    $remove.click(function () {
        var ids = getIdSelections();
        $table.bootstrapTable('remove', {
            field: 'id',
            values: ids
        });
        $remove.prop('disabled', true);
    });
    $(window).resize(function () {
        $table.bootstrapTable('resetView', {
            height: getHeight()
        });
    });
}

function getIdSelections() {
    return $.map($table.bootstrapTable('getSelections'), function (row) {
        return row.id
    });
}

function responseHandler(res) {
    $.each(res.rows, function (i, row) {
        row.state = $.inArray(row.id, selections) !== -1;
    });
    return res;
}

function detailFormatter(index, row) {
    var html = [];
    $.each(row, function (key, value) {
        html.push('<p><b>' + key + ':</b> ' + value + '</p>');
    });
    return html.join('');
}



function getHeight() {
    return $(window).height() - $('h1').outerHeight(true);
}
$(function () {
    var scripts = [
            location.search.substring(1) || '/js/bootstrap-table.js',
            '/assets/src/extensions/export/bootstrap-table-export.js',
            'http://rawgit.com/hhurz/tableExport.jquery.plugin/master/tableExport.js',
            '/assets/src/extensions/editable/bootstrap-table-editable.js',
            'http://rawgit.com/vitalets/x-editable/master/dist/bootstrap3-editable/js/bootstrap-editable.js'
        ],
        eachSeries = function (arr, iterator, callback) {
            callback = callback || function () {};
            if (!arr.length) {
                return callback();
            }
            var completed = 0;
            var iterate = function () {
                iterator(arr[completed], function (err) {
                    if (err) {
                        callback(err);
                        callback = function () {};
                    } else {
                        completed += 1;
                        if (completed >= arr.length) {
                            callback(null);
                        } else {
                            iterate();
                        }
                    }
                });
            };
            iterate();
        };
    eachSeries(scripts, getScript, initTable);
});

function getScript(url, callback) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = url;
    var done = false;
    // Attach handlers for all browsers
    script.onload = script.onreadystatechange = function () {
        if (!done && (!this.readyState ||
                this.readyState == 'loaded' || this.readyState == 'complete')) {
            done = true;
            if (callback)
                callback();
            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;
        }
    };
    head.appendChild(script);
    // We handle everything using the script element injection
    return undefined;
}