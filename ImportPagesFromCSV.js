/*jslint this:true*/
/*jslint browser:true*/
/*global
    $, window
*/
$(document).ready(function () {
    "use strict";

    var pwasBtn = "#import_btn";
    var pwcancelBtn = "#cancel_btn";
    var dataUrl = $(pwasBtn).data("url"); //url to execute ../import
    var json = $(pwasBtn).data("json"); //all the data
    var resultElement = $("#result");
    var percentElement = $("#percent");
    var progressBar = $("#progressbar");
    var pwasMsg = {
        start: $(pwasBtn).data("startMsg"),
        complete: $(pwasBtn).data("completeMsg"),
        error: $(pwasBtn).data("errorMsg"),
        confirm: $(pwasBtn).data("confirmMsg"),
        batch: $(pwasBtn).data("batchMsg"),
        finished: $(pwasBtn).data("finishedMsg"),
        canceled: $(pwcancelBtn).data("canceledMsg"),
        canceling: $(pwcancelBtn).data("cancelingMsg")
    };
    var canceled = false; // true when cancel button is clicked
    var error = false; // true when error is returned in json data
    var batch = 0; // current batch number
    var numBatches = 0; // total number of batches
    var numImported = 0; // total number of processed rows

    $(pwasBtn + " span").removeClass();
    $(pwasBtn).button();

    function showReport() {
        var info = "<hr>";
        info += "<div class='info'>Total number of processed rows: " + numImported + "</div>";
        resultElement.append(info)
            .scrollTop(resultElement[0].scrollHeight - resultElement.height());
    }

    function htmldecode(text) {
        var map = {
           '&amp;': '&',
           '&#038;': "&",
           '&lt;': '<',
           '&gt;': '>',
           '&quot;': '"',
           '&#039;': "'",
           '&#8217;': "’",
           '&#8216;': "‘",
           '&#8211;': "–",
           '&#8212;': "—",
           '&#8230;': "…",
           '&#8221;': '”'
        };
        return text.replace(/\&[\w\d\#]{2,5}\;/g, function(m) {return map[m];});
    }

    function finished() {
        percentElement.html(pwasMsg.complete);
        progressBar.val(100);
        progressBar.addClass("done");
        if (!canceled) {
            $(pwcancelBtn).remove();
            resultElement.after(htmldecode(pwasMsg.finished));
        } else {
            $(pwcancelBtn).button({label: pwasMsg.canceled});
        }
    }

    $(pwcancelBtn).on("click", function (e) {
        e.preventDefault();
        canceled = true;
        $(pwcancelBtn).button({label: pwasMsg.canceling});
        $(pwcancelBtn).button("option", "disabled", true);
    });

    var processBatch = function (batch) {
        var tmp;

        resultElement.append("<div xclass='info'><span class='faded'>" + pwasMsg.batch + " " + (batch+1) + "... </span></div>")
            .scrollTop(resultElement[0].scrollHeight - resultElement.height()); // scroll to bottom;

        $.ajax({
            url: dataUrl + "?start=" + batch,
            cache: false,
            dataType: "json",
            success: function (data) { // done
                // {"counter:"Processing batch 1 out of 5 - 20% complete","numBatches":xx,"numImported":xx,"rows":xx,"error":"xxx"}
        debugger;
                if (data && data.numImported !== undefined) {
                  resultElement.children().last().replaceWith("<div class='info'><span class='faded'>" +
                      pwasMsg.batch + " " + (batch+1) + ": " + data.numImported + " row(s) processed " + data.usage + "</span></div>")
                          .scrollTop(resultElement[0].scrollHeight - resultElement.height());
                  numImported = numImported+data.numImported;
                }

                if (data && data.rows !== undefined && data.rows.length) {
                    resultElement.append("<div class='none'><span class='faded'>" + data.rows + "</span></div>")
                        .scrollTop(resultElement[0].scrollHeight - resultElement.height()); // scroll to bottom;
                }

                if (data && data.error !== undefined) {
                    resultElement.append("<div class='pwas-error'><span class='status error'>" + pwasMsg.error + " " + data.error + "</span></div>")
                        .scrollTop(resultElement[0].scrollHeight - resultElement.height());
                    error = true;
                }

                if (data && data.counter) {
                    tmp = data.counter.replace("{", "<span>").replace("}", "</span>");
                    percentElement.html(tmp);
                }

                if(data.numBatches === 0) {
                    tmp = 100;
                } else {
                    tmp = Math.round(batch / data.numBatches * 100);
                }
                progressBar.val(tmp);

                if (data && canceled === false) {
                    batch += 1;
                    if (batch < data.numBatches && !canceled) {
                        processBatch(batch);
                    } else {
                        finished();
                        showReport();
                    }
                } else {
                    finished();
                    showReport();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) { // fail
                error = true;
                resultElement.children().last().replaceWith("<div class='pwas-error'><span class='status error'>" + pwasMsg.error + " " + jqXHR.status + " (" + errorThrown + ")</span></div>")
                    .scrollTop(resultElement[0].scrollHeight - resultElement.height());
                finished();
                showReport();
                /*batch += 1;
                if (batch < numBatches) {
                    processBatch(batch);
                } else {
                    finished();
                    showReport();
                }*/
            }
        });
    };

    $(pwasBtn).on("click", function (e) {

        e.preventDefault();

        //if (window.confirm(pwasMsg.confirm) === false) {
        //    return false;
        //}

        $(pwasBtn).button("option", "disabled", true);
        $(pwasBtn).remove();

        $(pwcancelBtn).addClass("cancel_unhide");
        $(pwcancelBtn).button();

        percentElement.html("<span class='start'>" + pwasMsg.start + "</span>");

        progressBar.fadeIn();

        batch = 0;
        processBatch(batch);
        e.preventDefault();

    });

});
