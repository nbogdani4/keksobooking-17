'use strict';

(function () {

  var ADVERTISEMENTS_COUNT = 8;

  var cityMap = document.querySelector('.map');
  var cardForm = document.querySelector('.ad-form');
  var filterForm = cityMap.querySelector('.map__filters');
  var mainPin = cityMap.querySelector('.map__pin--main');

  //  Корректирует положение Пина по оси Х исходя от его размера и не дает метке выпасть за пределы карты
  var correctPinLocationX = function (locationX, pinWidth) {
    var correctLocation = locationX - (pinWidth / 2);
    if (locationX < (pinWidth / 2)) {
      correctLocation = 0;
    } else if (locationX > window.data.LOCATION_MAX_X - (pinWidth / 2)) {
      correctLocation = window.data.LOCATION_MAX_X - pinWidth;
    }
    return correctLocation;
  };

  //  Корректирует положение Пина по оси У, исходя от его высоты и не дает метке выпасть за пределы карты
  var correctPinLocationY = function (locationY, pinHeight) {
    var correctLocation = locationY - pinHeight;
    if (correctLocation < window.data.LOCATION_MIN_Y) {
      correctLocation = window.data.LOCATION_MIN_Y;
    }
    return correctLocation;
  };

  // Ограничивает перемещение Пина по оси Х
  var setLimitMovementMainPinX = function (coordinateX) {
    if (coordinateX < window.data.LOCATION_MIN_X) {
      coordinateX = window.data.LOCATION_MIN_X;
    }
    if (coordinateX > window.data.LOCATION_MAX_X - mainPin.offsetWidth) {
      coordinateX = window.data.LOCATION_MAX_X - mainPin.offsetWidth;
    }
    return coordinateX;
  };

  // Ограничивает перемещение Пина по оси Y
  var setLimitMovementMainPinY = function (coordinateY) {
    if (coordinateY > window.data.LOCATION_MAX_Y) {
      coordinateY = window.data.LOCATION_MAX_Y;
    }
    if (coordinateY < window.data.LOCATION_MIN_Y) {
      coordinateY = window.data.LOCATION_MIN_Y;
    }
    return coordinateY;
  };

  // Возвращает координаты метки, в зависимости от атрибута функции (середина Пина или координаты, на которые метка указывает своим острым концом)
  var mainPinReferencePoint = function (position) {
    var referencePoint;
    switch (position) {
      case 'center':
        referencePoint = Math.floor(mainPin.offsetLeft + mainPin.offsetWidth / 2) + '.' + Math.floor(mainPin.offsetTop + mainPin.offsetHeight / 2);
        break;
      case 'bottom':
        referencePoint = Math.floor(mainPin.offsetLeft + mainPin.offsetWidth / 2) + '.' + Math.floor(mainPin.offsetTop + mainPin.offsetHeight);
        break;
    }
    return referencePoint;
  };

  var isDisabledMap = true;
  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var isMove = false;

    var startCoordinates = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      isMove = true;
      var shift = {
        x: startCoordinates.x - moveEvt.clientX,
        y: startCoordinates.y - moveEvt.clientY
      };

      startCoordinates = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mainPin.style.left = setLimitMovementMainPinX(mainPin.offsetLeft - shift.x) + 'px';
      mainPin.style.top = setLimitMovementMainPinY(mainPin.offsetTop - shift.y) + 'px';

      if (isDisabledMap) {
        window.form.inputAdress.value = mainPinReferencePoint('center');
      } else {
        window.form.inputAdress.value = mainPinReferencePoint('bottom');
      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      if (isMove) {
        if (isDisabledMap) {
          isDisabledMap = false;
          window.form.inputAdress.value = mainPinReferencePoint('center');
          cityMap.classList.remove('map--faded');
          cardForm.classList.remove('ad-form--disabled');
          window.form.delAttributeDisabled(cardForm.children);
          window.form.delAttributeDisabled(filterForm.children);
          document.querySelector('.map__pins').appendChild(window.pin.getPinsFragment(ADVERTISEMENTS_COUNT));
        } else {
          window.form.inputAdress.value = mainPinReferencePoint('bottom');
        }
      }
      cityMap.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    cityMap.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  window.map = {
    cardForm: cardForm,
    filterForm: filterForm,
    mainPin: mainPin,
    correctPinLocationX: correctPinLocationX,
    correctPinLocationY: correctPinLocationY,
  };

})();