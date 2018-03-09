import './style.scss'

var currentWidth = document.getElementsByClassName('carousel')[0].offsetWidth;// the current size of one slider in the browser
var slider; // here the current slider is stored over which is led by a pointer

document.addEventListener('mousedown', function (event) {
   var target = event.target; // where was the click?

    if (target.tagName === 'IMG') {
        dragStart()
    }
    else if (target.tagName === 'LI') {
        moveToSlide(target);
    }
});

for (var currentSlider = document.getElementsByClassName('carousel'), j = 0, lj = currentSlider.length; j < lj; j++) {

    for (var i = 0; i < currentSlider[j].getElementsByTagName('img').length; i++) {
        
	// generate indicators to the sliders in the number of pictures in them
        currentSlider[j].getElementsByTagName('ul')[0].innerHTML += '<li class="indicator" id="' + i + '"><a href="#"></a></li>';
        currentSlider[j].getElementsByTagName('li')[0].classList.add('active');
    }
    currentSlider[j].getElementsByClassName('content')[0].addEventListener('mousedown', function () {
        return slider = this;
    });
}

for (var image = document.getElementsByTagName('img'), j = 0, lj = image.length; j < lj; j++) {
    image[j].setAttribute('width', currentWidth + 'px');
}

function moveToSlide(target) {
    
	// move to the slide by the indicator
    target.parentNode.parentNode.getElementsByClassName('content')[0].style.marginLeft = -(target.id * currentWidth) + 'px';
	// after moving, we remove active from all indicators and assignments to a new one    for (var x = target.parentNode.getElementsByTagName('LI'), j = 0, lj = x.length; j < lj; j++) {
        x[j].classList.remove('active');
    }
    target.classList.add('active');
}

function setIndicator() {

    // the indicator becomes active like this:
    // the current indent of the container is divided by the width of one slide
    // get the number that will match the number of the indicator
    // for example, the indent of the container 0 / the shield, then the number of the indicator 0
    // if indent is -675px / width (675) = 1 (means the slider is scrolled to one slide)
    // Indicator with index 1 assigned active class

    var index = Math.abs(parseInt(getComputedStyle(slider).marginLeft));

    for (var unsetInd = slider.parentNode.getElementsByTagName('li'), j = 0, lj = unsetInd.length; j < lj; j++) {
        unsetInd[j].classList.remove('active');
    }
    slider.parentNode.getElementsByTagName('li')[index / currentWidth].classList.add('active');
}


function dragStart() {
    console.log('start');
    var startX = event.clientX;
    var params = {
        currentMargin: null,
        maxMargin: currentWidth * slider.getElementsByTagName('img').length - currentWidth,
        imgLength: slider.getElementsByTagName('img').length
    };

    function currentMarginFn() {
        var x = getComputedStyle(slider);
        return params.currentMargin = parseInt(x.marginLeft);
    }

    event.preventDefault();

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', moveEnd);

    function mouseMove() {
        var move = startX - event.clientX;
        if (((slider.style.marginLeft = -move + params.currentMargin) < 0) && ((slider.style.marginLeft = -move + params.currentMargin) > -params.maxMargin)) {
            slider.style.marginLeft = -move + params.currentMargin + 'px';
        }
    }

    function moveEnd() {
        slider.classList.add('transition');// add the transition after the sweet is released, it is impossible earlier, there will be no correct dragging by the mouse

        var endX = event.clientX;

        document.removeEventListener('mousemove', mouseMove);

        if (endX <= startX) {
            // find out the direction of the difference in the point at which was mousedown and mouseup
            // if the start point in X is greater than the end point, for example, it will be left
            // find out how much is stretched, and how much is left
            // assign the remainder to the marginLeft property
            if (params.currentMargin !== -params.maxMargin) {
                var left = currentWidth - params.currentMargin;
                slider.style.marginLeft = -left + 'px';
            }
            else {
                slider.style.marginLeft = 0 + 'px';
            }
        }
        else if (endX > startX) {
            if (params.currentMargin !== 0) {
                var right = currentWidth + params.currentMargin;
                slider.style.marginLeft = right + 'px';
            }
            else {
                slider.style.marginLeft = -params.maxMargin + 'px';
            }
        }
        currentMarginFn(); // update margin value
        setTimeout(setIndicator, 250);// call the assignment of the new indicator should be a little later, that would have finished the transition
        document.removeEventListener('mouseup', moveEnd);
    }
    slider.classList.remove('transition'); // need to remove again for a beautiful pointer shuffle
    currentMarginFn();// update margin value
}



