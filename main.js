const wrapper = $('.wrapper')[0];   // родитель контейнера для слайдера
const modal = $('.modal')[0];       // див модалки
const modalClose = $('.modal__close')[0];   // див кнопки закрытия модалки

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
function Slider(sliderSettings, slidesClass) {
    this.settings = sliderSettings;
    this.autoPlayTimer = null;
    this.sliderImages = $(`.${slidesClass}`)[0].children;
    this.currentImageIndex = 0;
    this.dots = [];
}
// --------генерируем---слайдеры------------------
let slider1 = new Slider(SLIDER_ADJUSTMENT_1, "slider1");
let slider2 = new Slider(SLIDER_ADJUSTMENT_2, "slider2");

// let slider3 = new Slider(SLIDER_ADJUSTMENT_3, "slider3"); //тест
// let slider4 = new Slider(SLIDER_ADJUSTMENT_4, "slider4"); //тест



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
    let ul = $(`#pagination${slider.settings.id}`)[0];
    $(ul).on('click', function (element) {
        clearInterval(slider.autoPlayTimer);  //  останавливаю режим презентации
        let target = element.target;
        if ($(modal).hasClass('modal__open')) {
            $(modal).removeClass('modal__open');
        }
        if ($(target).attr('type')) {
            reset(slider);
            slider.currentImageIndex = $(target).html() - 1;
            $(target).addClass(`dotactive${slider.settings.id}`);
            $(slider.sliderImages[slider.currentImageIndex]).addClass('active');
        }

    });
}
// -----------------активация/деактивация--pagination-------------------------
function checkPagination(slider) {
    if (!slider.settings.pagination) {
        for (let j = 0; j < slider.dots.length; j++) {
            $(slider.dots[j]).addClass('hide');
        }
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
        $(wrapper).append(prevImage);
        $(wrapper).append(nextImage);
    }
}
// ----------------------прячу все картинки-------------------------------------
function reset(slider) {
    for (let i = 0; i < slider.sliderImages.length; i++) {
        $(slider.sliderImages[i]).removeClass('active');
        $(slider.dots[i]).removeClass(`dotactive${slider.settings.id}`);
    }
}
// ----------------------показываю предыдущую картину-----------------------------
function showPrev(slider) {
    reset(slider);
    $(slider.sliderImages[slider.currentImageIndex - 1]).addClass('active');
    $(slider.dots[slider.currentImageIndex - 1]).addClass(`dotactive${slider.settings.id}`);
    slider.currentImageIndex--;
}

function prevArrowEvent(slider) {
    $(wrapper).on('click', function (element) {
        let el = element.target;
        if ($(el).attr("type") != `arrow-prev${slider.settings.id}`) {
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
    $(wrapper).on('click', function (element) {
        let el = element.target;
        if ($(el).attr("type") != `arrow-next${slider.settings.id}`) {
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
        let element = event.target;
        clearInterval(slider.autoPlayTimer);     //  останавливаю режим презентации
        if ($(element).hasClass('active')) {
            $(modal).addClass('modal__open');   // вывожу модалку
            let flag = $(element).attr('country');
            let div = document.createElement('div');
            $(div).addClass('modal__inner');
            $(div).html(`<p>${flag}</p>`);
            $(div).prop('id', `${flag}`);
            $(modal).append(div);
        }
    });
}
// ----------------прячем модалку кликнув по "неактивному" окну--------------------
$(modal).on('click', function (e) {
    if (e.target === modal) {
        $(modal).removeClass('modal__open');
    }
});
//----------------прячем-модалку-кликнув-по-"[Х]"----------------------------------
$(modalClose).on('click', function () {
    $(modal).removeClass('modal__open');
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
        for (let i = 0; i < slider.sliderImages.length; i++) {
            $(slider.sliderImages[i]).removeClass('fade');
        }
    }
}
// ------------------------активация/деактивация--SlideInOut----------------------------------
function slideInOutCancellation(slider) {
    if (slider.settings.slideInOut) {
        for (let i = 0; i < slider.sliderImages.length; i++) {
            $(slider.sliderImages[i]).addClass('slide-inout');
        }
    }
}
// -----------------------------------------------------------------------------------------------------
function callSlider(slider) {
    $(wrapper).append(addPaginationOnScreen(slider.sliderImages, slider));  // вывод пагинации на экран
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