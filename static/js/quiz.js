var curIndex = 0;
var quizList = data['quiz'];
var answerList = new Array(quizList.length);



function updateProgressTracker() {
    const totalSteps = quizList.length;
    const progressTrackerIcons = document.getElementById('progressTrackerIcons');
    const progressTrackerTexts = document.getElementById('progressTrackerTexts');
    progressTrackerIcons.innerHTML = '';
    progressTrackerTexts.innerHTML = '';

    for (let step = 1; step <= totalSteps; step++) {
        const iconElement = document.createElement('div');
        iconElement.classList.add('step');
        if (step < curIndex + 1) {
            iconElement.classList.add('completed');
            iconElement.innerHTML = `<span class="icon">✔</span>`;
        } else if (step === curIndex + 1) {
            iconElement.classList.add('now');
            iconElement.innerHTML = `<span class="icon">I</span>`;
        } else {
            iconElement.innerHTML = `<span class="icon"></span>`;
        }
        progressTrackerIcons.appendChild(iconElement);
        const textElement = document.createElement('div');
        textElement.classList.add('progress_text');
        textElement.textContent = `Step ${step}`;
        progressTrackerTexts.appendChild(textElement);
    }
}
function goNext() {
    var result = validateNxtIdx(curIndex, curIndex + 1);
    curIndex = result.index;
    if (!result.success) {
        $('#errorMessage').text(result.message);
        $('#errorModal').modal('show');
    }
    // console.log('Next Index:', curIndex, 'Message:', result.message);
    return result.message

}

function goPrev() {
    var result = validateNxtIdx(curIndex, curIndex - 1);
    curIndex = result.index;
    if (!result.success) {
        $('#errorMessage').text(result.message);
        $('#errorModal').modal('show');
    }
    // console.log('Previous Index:', curIndex, 'Message:', result.message);

    return result.message
}

function validateNxtIdx(cur_step, nxt_step) {
    if (nxt_step >= quizList.length) {
        if (!answerList[curIndex]) {
            return { index: quizList.length - 1, message: "Not answered yet", success: false };
        } else {
            return { index: cur_step, message: "submit", success: true };
        }
    } else if (nxt_step < 0) {
        return { index: 0, message: "Reached start of quiz list", success: false };
    } else {
        if (!answerList[curIndex] && nxt_step > cur_step) {
            return { index: cur_step, message: "Not answered yet", success: false };
        }
        return { index: nxt_step, message: "success", success: true };
    }
}

function showResponse(idx, answerList, quiz_content) {
    var options = quiz_content['options'];
    var quizType = quiz_content['type']
    var answerOrd = answerList[idx];
    console.log(answerOrd, "answer")
    $('#quizResponse').empty();

    if (answerList[idx] !== undefined && (quizType === 1 || quizType == 2)) {
        var alertType = "alert-success";
        $("#quizResponse").append(`
            <div class="alert ${alertType}" role="alert">
                You chose: <strong>${options[answerOrd[0]]}</strong>  <!-- Emphasize the chosen answer -->
            </div>
        `);
    } else if (answerList[idx] !== undefined && quizType === 3) {
        var responseHtml = `<div class="alert alert-success" role="alert"><ul>`;
        answerOrd.forEach(function (itemIndex, index) {
            responseHtml += `<li>Order ${index + 1}: <strong>${options[itemIndex]}</strong></li>`;
        });
        responseHtml += `</ul></div>`;
        $("#quizResponse").append(responseHtml);
    } else if (answerList[idx] !== undefined && quizType == 4) {
        console.log(answerOrd,"answerOrd")
        if (answerOrd.length > 0) {
            var responseHtml = `<div class="alert alert-success" role="alert">
            Your choose:
    
            <ul>`;
            answerOrd.forEach(function (itemIndex, index) {
                responseHtml += `<li><strong>${options[itemIndex]}</strong></li>`;
            });
            responseHtml += `</ul></div>`;
            $("#quizResponse").append(responseHtml);
        }

    }
}

function showQuiz(quiz_content) {
    $("#quizBody").empty();
    var type = quiz_content['type'];
    var title = quiz_content['title'];
    var options = quiz_content['options'];
    var optionsHtml = "";

    for (var i = 0; i < options.length; i++) {
        var imageHtml = options[i] ? `<img src="static/img/quiz/${options[i]}.png" alt="Quiz Image" width="100" height="100">` : "";
        if (type == 1) {

            optionsHtml += `<a href="#" class="list-group-item list-group-item-action quizOption" value="${i}">${imageHtml} ${options[i]}</a>`;
        } else if (type == 2) {
            optionsHtml += `<a href="#" class="list-group-item list-group-item-action quizOption" value=${i}>${options[i]}</a>`;
        } else if (type == 3) {
            optionsHtml += `<li class="ui-state-default" value="${i}"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>${imageHtml} ${options[i]}</li>`;
        } else if (type == 4) {
            console.log("ss", options[i])
            let isChecked = answerList[curIndex] && answerList[curIndex].includes(i.toString()) ? 'checked' : '';
            optionsHtml += `<div class="form-check">
            <input class="form-check-input quizOption" type="checkbox" value="${i}" id="defaultCheck${i}" ${isChecked}>
            <label class="form-check-label" for="defaultCheck${i}">
                ${imageHtml} ${options[i]}
            </label>
            </div>`;
        }


    }
    if (type == 1 || type == 4) {
        $("#quizBody").append(`
            <h2 id="quizTitle">${curIndex + 1}. ${title}</h2>
            <div id="quizOptions" class="list-group"> ${optionsHtml} </div>
        `);
    } else if (type == 2) {
        var imageHtml = quiz_content['q_img'] ? `<img src="static/img/quiz/${quiz_content['q_img']}.png" alt="Quiz Image">` : "";
        $("#quizBody").append(`
            <h2 id="quizTitle">${curIndex + 1}. ${title}</h2>
            ${imageHtml}
            <ul id="quizOptions">${optionsHtml}</ul>
        `);
    } else if (type === 3) {
        $("#quizBody").append(`
            <h2 id="quizTitle">${curIndex + 1}. ${title}</h2>
            <ul id="quizOptions" class="list-unstyled connectedSortable">
                ${optionsHtml}
            </ul>
        `);
    }

    if (type === 3) {
        $("#quizOptions").sortable({
            placeholder: "ui-state-highlight"
        });
        $("#quizOptions").sortable({
            placeholder: "ui-state-highlight",
            update: function (event, ui) {
                var newOrder = $(this).sortable('toArray', { attribute: 'value' });
                console.log('lorder:', newOrder);
                answerList[curIndex] = newOrder
                showResponse(curIndex, answerList, quizList[curIndex])
            }
        });
        $("#quizOptions").disableSelection();
    }
}

function initOptions() {
    if (quizList[curIndex].type === 4) {
        $('.form-check-input').on('change', function () {
            var selectedOptions = $('.form-check-input:checked').map(function () {
                return $(this).val();
            }).get();
            answerList[curIndex] = selectedOptions;
            console.log("Selected options:", answerList);
            showResponse(curIndex, answerList, quizList[curIndex]);
        });
    } else {
        $('.quizOption').on('click', function () {
            var optionVal = $(this).attr("value");
            if (quizList[curIndex].type === 3) {
            } else {
                answerList[curIndex] = [optionVal];
                console.log("Clicked option:", optionVal, curIndex, answerList);
                showResponse(curIndex, answerList, quizList[curIndex]);
            }
        });
    }
}

$(document).ready(function () {
    showQuiz(quizList[curIndex]);
    initOptions();
    updateProgressTracker(); // Initial setup
    $('#nxt').on("click", function () {
        var msg = goNext();
        updateProgressTracker();
        console.log(msg)
        if (msg == "submit") {
            $('#submitConfirmationModal').modal('show');
        } else {
            showQuiz(quizList[curIndex]);
            initOptions();
            showResponse(curIndex, answerList, quizList[curIndex]);
        }
    });

    $('#confirmSubmit').on('click', function () {
        var submissionData = {
            answers: answerList
        };
        $.ajax({
            type: "POST",
            url: "/quiz",
            contentType: "application/json",
            data: JSON.stringify(submissionData),
            success: function (response) {
                // console.log("Submission successful:", response);
                $('body').html(response);
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                alert("Error submitting data. Please try again later.");
            }
        });
        $('#submitConfirmationModal').modal('hide');
    });
    $('#prv').on("click", function () {
        var msg = goPrev();
        updateProgressTracker();
        showQuiz(quizList[curIndex]);
        initOptions();
        showResponse(curIndex, answerList, quizList[curIndex])
    });
    // $('.quizOption').on('click', function () {
    //     optionVal = $(this).attr("value")
    //     console.log("clickkkkkk", optionVal)
    // })
});
