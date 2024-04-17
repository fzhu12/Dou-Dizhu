$(document).ready(function() {
    // Handler for rule_id == 2
    $('#startTutorial2').click(function() {
        $('.caption').css({'visibility': 'visible', 'opacity': 0});
        runTutorial2(); 
        $('#learnAgain2').show(); 
        $(this).hide(); 
    });

    $('#learnAgain2').click(function() {
        $('.caption').css({'visibility': 'hidden', 'opacity': 0}); 
        $('#landlordPlayer .game-image').attr('src', '/static/img/peasant.png');
        $('#player3-cards').prepend($('#player4-cards').html()); 
        $('#player4-cards').empty(); 
        setTimeout(runTutorial2, 1000); 
    });

    function runTutorial2() {
        var delayTime = 1000;
        $(".player .caption").each(function(index) {
            $(this).delay(delayTime * index).queue(function() {
                $(this).css("visibility", "visible").animate({opacity: 1}, 500).dequeue();
            });
        });

        $(".player .caption").last().promise().done(function() {
            setTimeout(function() {
                $('#landlordPlayer .game-image').attr('src', '/static/img/landlord.png');
                $('#player3-cards').append($('#player4-cards').html()); 
                $('#player4-cards').empty(); 
            }, 1000); 
        });
    }




    // Handler for rule_id == 1
        $('#startTutorial1').click(function() {
        startTutorial1();  
    });

    $('#learnAgain1').click(function() {
        $('.card-image, .card-image3').hide(); 
        $(this).hide();
        $('#startTutorial1').show(); 

        setTimeout(function() {
            $('#startTutorial1').click(); 
        }, 1000); 
    });

    function startTutorial1() {
        $('.card-image, .card-image3').hide(); 
        $('#learnAgain1').show(); 
        $('#startTutorial1').hide(); 
        displayCardsSequentially();
    }

    function displayCardsSequentially() {
        displayCards('#player1-cards .card-image', 0);
        displayCards('#player2-cards .card-image', 500); 
        displayCards('#player3-cards .card-image', 1000); 
        displayCards('#player4-cards .card-image3', 2000); 
    }

    function displayCards(selector, delay) {
        $(selector).each(function(index) {
            $(this).delay(delay + index * 50).fadeIn(300); 
        });
    }




    // Handler for rule_id == 2
    $('#startScenario1').click(function() {
        resetGame();
        applyScenario1();
    });

    $('#startScenario2').click(function() {
        resetGame();
        applyScenario2();
    });
    function resetGame() {
        $('.player .game-image').attr('src', '/static/img/peasant.png');
        $('.player .card-stack').empty();
        $('.player .cards_count').text('0 card');
        $('#landlordPlayer .game-image').attr('src', '/static/img/landlord.png');
    }

    function applyScenario1() {
        $('#player1-cards').html(generateCards(8, 'blue'));
        $('#player1-cards').siblings('.cards_count').text('8 cards | We Lost :( ');
        $('#player2-cards').html(generateCards(5, 'purple'));
        $('#player2-cards').siblings('.cards_count').text('5 cards | We Lost :( ');
        $('#player3-cards').empty();
        $('#player3-cards').siblings('.cards_count').text('0 card | I Won!');
    }

    function applyScenario2() {
        $('#player1-cards').empty();
        $('#player1-cards').siblings('.cards_count').text('0 card | We Won!');
        $('#player2-cards').html(generateCards(7, 'purple'));
        $('#player2-cards').siblings('.cards_count').text('7 cards | We Won!');
        $('#player3-cards').html(generateCards(4, 'green'));
        $('#player3-cards').siblings('.cards_count').text('4 cards | I Lost :(');
    }

    function generateCards(count, color) {
        let cardsHtml = '';
        for (let i = 0; i < count; i++) {
            cardsHtml += `<img src="/static/img/cards/${color}_back.png" alt="${color} Card" class="img-fluid card-image">`;
        }
        return cardsHtml;
    }

});


