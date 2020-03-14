
// Настройки слайдера
const SLIDER_ADJUSTMENT_1 = {
    id: 1,
    arrows: true,
    pagination: true,
    fadeInOut: true,
    slideInOut: false,
    autoPlaySlider: true,
    autoPlayInterval: 1800,  //ms  
};
const SLIDER_ADJUSTMENT_2 = {
    id: 2,
    arrows: true,
    pagination: true,
    fadeInOut: false,
    slideInOut: true,
    autoPlaySlider: true,
    autoPlayInterval: 3000,  //ms  
};
// ----------------тест---слайд 3+4---------------
// const SLIDER_ADJUSTMENT_3 = {
//     id: 3,
//     arrows: true,
//     pagination: true,
//     fadeInOut: false,
//     slideInOut: true,
//     autoPlaySlider: true,
//     autoPlayInterval: 3000,  //ms  
// };
// const SLIDER_ADJUSTMENT_4 = {
//     id: 4,
//     arrows: true,
//     pagination: true,
//     fadeInOut: true,
//     slideInOut: false,
//     autoPlaySlider: true,
//     autoPlayInterval: 1800,  //ms  
// };
// ----------------тест-----слайд 3+4-------------
function Slider(sliderSettings) {
    this.settings = sliderSettings;
    this.autoPlayTimer = null;
    this.sliderImages = $(`.slider${this.settings.id}`).children();
    this.currentImageIndex = 0;
    this.dots = [];
}
// --------генерируем---слайдеры------------------
const slider1 = new Slider(SLIDER_ADJUSTMENT_1);
const slider2 = new Slider(SLIDER_ADJUSTMENT_2);
// const slider3 = new Slider(SLIDER_ADJUSTMENT_3); //тест
// const slider4 = new Slider(SLIDER_ADJUSTMENT_4); //тест

callSlider(slider1);  // запуск общей функции 
callSlider(slider2);  // запуск общей функции 
// callSlider(slider3);  // запуск общей функции тест
// callSlider(slider4);  // запуск общей функции тест
// --------------------------Пагинация-вывод-кнопок-на-экран-------------------
function addPaginationOnScreen(arr, slider) {
    let ul = document.createElement('ul');
    $(ul).prop('id', `pagination${slider.settings.id}`);
    $.each(arr, (dotNumber) => {
        let li = document.createElement('li');
        $(li).addClass(`dots${slider.settings.id}`);
        $(li).attr("type", "dote");
        $(ul).append(li);
        $(li).html(dotNumber + 1);
        slider.dots.push(li);
    });
    return ul;
}
// ----------------вешаю-событие-на-дотсы-----------------------------------
function addEventOnDots(slider) {
    let ul = $(`#pagination${slider.settings.id}`);
    $(ul).on('click', function (element) {
        clearInterval(slider.autoPlayTimer);  //  останавливаю режим презентации
        if ($(element.target).attr('type')) {
            reset(slider);
            slider.currentImageIndex = $(element.target).html() - 1;
            $(element.target).addClass(`dotactive${slider.settings.id}`);
            $(slider.sliderImages[slider.currentImageIndex]).addClass('active');
        }
    });
}
// -----------------активация/деактивация--pagination-------------------------
function checkPagination(slider) {
    if (!slider.settings.pagination) {
        $(slider.dots).addClass('hide');
    }
}
// -----------------активация/деактивация--arrows--------------------------------
function createArrows(slider) {
    const i = slider.settings.id;
    const prevImage = document.createElement('div');
    $(prevImage).prop('id', `arrow${i}-left`);
    $(prevImage).addClass(`arrow${i}`);
    $(prevImage).attr("type", "arrow-prev" + `${i}`);
    const nextImage = document.createElement('div');
    $(nextImage).prop('id', `arrow${i}-right`);
    $(nextImage).addClass(`arrow${i}`);
    $(nextImage).attr("type", "arrow-next" + `${i}`);
    if (slider.settings.arrows) {
        $('.wrapper').append(prevImage);
        $('.wrapper').append(nextImage);
    }
}
// ----------------------прячу все картинки-------------------------------------
function reset(slider) {
    $(slider.sliderImages).removeClass('active');
    $(slider.dots).removeClass(`dotactive${slider.settings.id}`);
}
// ----------------------показываю предыдущую картину-----------------------------
function showPrev(slider) {
    reset(slider);
    $(slider.sliderImages[slider.currentImageIndex - 1]).addClass('active');
    $(slider.dots[slider.currentImageIndex - 1]).addClass(`dotactive${slider.settings.id}`);
    slider.currentImageIndex--;
}

function prevArrowEvent(slider) {
    $('.wrapper').on('click', function (element) {
        if ($(element.target).attr("type") != `arrow-prev${slider.settings.id}`) {
            return;
        } else {
            clearInterval(slider.autoPlayTimer);  //  останавливаю режим презентации
            if (slider.currentImageIndex === 0) {
                slider.currentImageIndex = slider.sliderImages.length;
            }
            showPrev(slider);
        }
    });
}

// ------------------------ показываю следующую картину----------------------------
function showNext(slider) {
    reset(slider);
    $(slider.sliderImages[slider.currentImageIndex + 1]).addClass('active');
    $(slider.dots[slider.currentImageIndex + 1]).addClass(`dotactive${slider.settings.id}`);
    slider.currentImageIndex++;
}

function nextArrowEvent(slider) {
    $('.wrapper').on('click', function (element) {
        if ($(element.target).attr("type") != `arrow-next${slider.settings.id}`) {
            return;
        } else {
            clearInterval(slider.autoPlayTimer);  //  останавливаю режим презентации
            if (slider.currentImageIndex === slider.sliderImages.length - 1) {
                slider.currentImageIndex = -1;
            }
            showNext(slider);
        }
    });
}
// ------------------ПУСК-/-откат-слайдера-в-начальное-положение---------------------
function startSlide(slider) {
    reset(slider);
    $(slider.sliderImages[0]).addClass('active');
    $(slider.dots[0]).addClass(`dotactive${slider.settings.id}`);
}
// -------------------------------Modal----------------------------------------------
function showModalImage(slider) {
    $(`.slider${slider.settings.id}`).on('click', function (event) {
        clearInterval(slider.autoPlayTimer);     //  останавливаю режим презентации
        if ($(event.target).hasClass('active')) {
            $('.modal').addClass('modal__open');   // вывожу модалку
            let flag = $(event.target).attr('country');
            let div = document.createElement('div');
            $(div).addClass('modal__inner');
            $(div).html(`<p>${flag}</p>`);
            $(div).prop('id', `${flag}`);
            $('.modal').append(div);
        }
    });
}
// ----------------прячем модалку кликнув по "неактивному" окну--------------------
$('.wrapper').on('click', function (e) {
    if ($(e.target).hasClass('modal') || ($(e.target)).hasClass('modal__close')) {
        $('.modal').removeClass('modal__open');
    }
});
// ----------------------slider----autoplay----------------------------------------
function sliderInitialization(slider, autoPlayInterval) {
    let timer = setInterval(function () {
        if (slider.settings.autoPlaySlider) {
            reset(slider);
            $(slider.sliderImages[slider.currentImageIndex + 1]).addClass('active');
            $(slider.dots[slider.currentImageIndex + 1]).addClass(`dotactive${slider.settings.id}`);
            slider.currentImageIndex++;
            if (slider.currentImageIndex === slider.sliderImages.length - 1) {
                slider.currentImageIndex = -1;
            }
        }
    }, autoPlayInterval);
    return timer;
}
// ---------------------активация/деактивация--fadeInOut----------------------------------
function fadeInOutCancellation(slider) {
    if (!slider.settings.fadeInOut) {
        $(slider.sliderImages).removeClass('fade');
    }
}
// ------------------------активация/деактивация--SlideInOut----------------------------------
function slideInOutCancellation(slider) {
    if (slider.settings.slideInOut) {
        $(slider.sliderImages).addClass('slide-inout');
    }
}
// -----------------------------------------------------------------------------------------------------
function callSlider(slider) {
    $('.wrapper').append(addPaginationOnScreen(slider.sliderImages, slider));  // вывод пагинации на экран
    checkPagination(slider);                     // проверяем необходимость наличия пагинации
    startSlide(slider);                          // пуск слайдера (откат в стартовое положение)
    createArrows(slider);                        // выводим кнопки > / <
    nextArrowEvent(slider);                      // вешаем событие на > 
    prevArrowEvent(slider);                      // вешаем событие на <
    addEventOnDots(slider);                      // вешаем событие дотсы
    showModalImage(slider);                       // выводим соответствующий флаг в модалку
    slider.autoPlayTimer =
        sliderInitialization(slider, slider.settings.autoPlayInterval);     // вешаем функцию на таймер
    fadeInOutCancellation(slider);                // проверяем необходимость отключения эфф. "fadeInOut"
    slideInOutCancellation(slider);               // проверяем необходимость отключения эфф. "slideInOut"
}