const typed = new Typed('.typed', {
	strings: [
		'<i class="principal">Oscar Moreno</i>',
		'<i class="principal">a Web Developer</i>',
		'<i class="principal">Motivated!</i>',
	
	],

	// stringsElement: '#cadenas-texto', // ID del elemento que contiene cadenas de texto a mostrar.
	typeSpeed: 75, // Velocidad en mlisegundos para poner una letra,
	startDelay: 300, // Tiempo de retraso en iniciar la animacion. Aplica tambien cuando termina y vuelve a iniciar,
	backSpeed: 75, // Velocidad en milisegundos para borrrar una letra,
	// smartBackspace: true, // Eliminar solamente las palabras que sean nuevas en una cadena de texto.
	shuffle: false, // Alterar el orden en el que escribe las palabras.
	backDelay: 1500, // Tiempo de espera despues de que termina de escribir una palabra.
	loop: true, // Repetir el array de strings
	loopCount: false, // Cantidad de veces a repetir el array.  false = infinite
	showCursor: true, // Mostrar cursor palpitanto
	cursorChar: '|', // Caracter para el cursor
	contentType: 'html', // 'html' o 'null' para texto sin formato
}); 


$(document).ready(function() {
	$('.menu').click(function() {
	  $('ul').toggleClass('active');
	});
  });
  
// Slider


let multiItemSlider = (function () {

	function _isElementVisible(element) {
	  let rect = element.getBoundingClientRect(),
		vWidth = window.innerWidth || doc.documentElement.clientWidth,
		vHeight = window.innerHeight || doc.documentElement.clientHeight,
		elemFromPoint = function (x, y) { return document.elementFromPoint(x, y) };
	  if (rect.right < 0 || rect.bottom < 0
		|| rect.left > vWidth || rect.top > vHeight)
		return false;
	  return (
		element.contains(elemFromPoint(rect.left, rect.top))
		|| element.contains(elemFromPoint(rect.right, rect.top))
		|| element.contains(elemFromPoint(rect.right, rect.bottom))
		|| element.contains(elemFromPoint(rect.left, rect.bottom))
	  );
	}

	return function (selector, config) {
	  let
		_mainElement = document.querySelector(selector),
		_sliderWrapper = _mainElement.querySelector('.slider__wrapper'),
		_sliderItems = _mainElement.querySelectorAll('.slider__item'),
		_sliderControls = _mainElement.querySelectorAll('.slider__control'),
		_sliderControlLeft = _mainElement.querySelector('.slider__control_left'),
		_sliderControlRight = _mainElement.querySelector('.slider__control_right'),
		_wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width),
		_itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width),
		_html = _mainElement.innerHTML,
		_indexIndicator = 0,
		_maxIndexIndicator = _sliderItems.length - 1,
		_indicatorItems,
		_positionLeftItem = 0,
		_transform = 0,
		_step = _itemWidth / _wrapperWidth * 100,
		_items = [],
		_interval = 0,
		_states = [
		  { active: false, minWidth: 0, count: 1 },
		  { active: false, minWidth: 576, count: 2 },
		  { active: false, minWidth: 992, count: 3 },
		  { active: false, minWidth: 1200, count: 4 },
		],
		_config = {
		  isCycling: false,
		  direction: 'right',
		  interval: 5000,
		  pause: true
		};

	  for (var key in config) {
		if (key in _config) {
		  _config[key] = config[key];
		}
	  }

	  _sliderItems.forEach(function (item, index) {
		_items.push({ item: item, position: index, transform: 0 });
	  });

	  let _setActive = function () {
		let _index = 0;
		let width = parseFloat(document.body.clientWidth);
		_states.forEach(function (item, index, arr) {
		  _states[index].active = false;
		  if (width >= _states[index].minWidth)
			_index = index;
		});
		_states[_index].active = true;
	  }

	  var _getActive = function () {
		var _index;
		_states.forEach(function (item, index, arr) {
		  if (_states[index].active) {
			_index = index;
		  }
		});
		return _index;
	  }

	  let position = {
		getItemMin: function () {
		  let indexItem = 0;
		  _items.forEach(function (item, index) {
			if (item.position < _items[indexItem].position) {
			  indexItem = index;
			}
		  });
		  return indexItem;
		},
		getItemMax: function () {
		  let indexItem = 0;
		  _items.forEach(function (item, index) {
			if (item.position > _items[indexItem].position) {
			  indexItem = index;
			}
		  });
		  return indexItem;
		},
		getMin: function () {
		  return _items[position.getItemMin()].position;
		},
		getMax: function () {
		  return _items[position.getItemMax()].position;
		}
	  }

	  let _transformItem = function (direction) {
		let nextItem, currentIndicator = _indexIndicator;
		if (!_isElementVisible(_mainElement)) {
		  return;
		}
		if (direction === 'right') {
		  _positionLeftItem++;
		  if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) > position.getMax()) {
			nextItem = position.getItemMin();
			_items[nextItem].position = position.getMax() + 1;
			_items[nextItem].transform += _items.length * 100;
			_items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
		  }
		  _transform -= _step;
		  _indexIndicator = _indexIndicator + 1;
		  if (_indexIndicator > _maxIndexIndicator) {
			_indexIndicator = 0;
		  }
		}
		if (direction === 'left') {
		  _positionLeftItem--;
		  if (_positionLeftItem < position.getMin()) {
			nextItem = position.getItemMax();
			_items[nextItem].position = position.getMin() - 1;
			_items[nextItem].transform -= _items.length * 100;
			_items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
		  }
		  _transform += _step;
		  _indexIndicator = _indexIndicator - 1;
		  if (_indexIndicator < 0) {
			_indexIndicator = _maxIndexIndicator;
		  }
		}
		_sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
		_indicatorItems[currentIndicator].classList.remove('active');
		_indicatorItems[_indexIndicator].classList.add('active');
	  }

	  let _slideTo = function (to) {
		let i = 0, direction = (to > _indexIndicator) ? 'right' : 'left';
		while (to !== _indexIndicator && i <= _maxIndexIndicator) {
		  _transformItem(direction);
		  i++;
		}
	  }

	  let _cycle = function (direction) {
		if (!_config.isCycling) {
		  return;
		}
		_interval = setInterval(function () {
		  _transformItem(direction);
		}, _config.interval);
	  }

	  let _controlClick = function (e) {
		if (e.target.classList.contains('slider__control')) {
		  e.preventDefault();
		  var direction = e.target.classList.contains('slider__control_right') ? 'right' : 'left';
		  _transformItem(direction);
		  clearInterval(_interval);
		  _cycle(_config.direction);
		}
		if (e.target.getAttribute('data-slide-to')) {
		  e.preventDefault();
		  _slideTo(parseInt(e.target.getAttribute('data-slide-to')));
		  clearInterval(_interval);
		  _cycle(_config.direction);
		}
	  };

	  let _handleVisibilityChange = function () {
		if (document.visibilityState === "hidden") {
		  clearInterval(_interval);
		} else {
		  clearInterval(_interval);
		  _cycle(_config.direction);
		}
	  }

	  let _refresh = function () {
		clearInterval(_interval);
		_mainElement.innerHTML = _html;
		_sliderWrapper = _mainElement.querySelector('.slider__wrapper');
		_sliderItems = _mainElement.querySelectorAll('.slider__item');
		_sliderControls = _mainElement.querySelectorAll('.slider__control');
		_sliderControlLeft = _mainElement.querySelector('.slider__control_left');
		_sliderControlRight = _mainElement.querySelector('.slider__control_right');
		_wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width);
		_itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width);
		_positionLeftItem = 0;
		_transform = 0;
		_indexIndicator = 0;
		_maxIndexIndicator = _sliderItems.length - 1;
		_step = _itemWidth / _wrapperWidth * 100;
		_items = [];
		_sliderItems.forEach(function (item, index) {
		  _items.push({ item: item, position: index, transform: 0 });
		});
		_addIndicators();
	  }

	  let _setUpListeners = function () {
		_mainElement.addEventListener('click', _controlClick);
		if (_config.pause && _config.isCycling) {
		  _mainElement.addEventListener('mouseenter', function () {
			clearInterval(_interval);
		  });
		  _mainElement.addEventListener('mouseleave', function () {
			clearInterval(_interval);
			_cycle(_config.direction);
		  });
		}

		document.addEventListener('visibilitychange', _handleVisibilityChange, false);
		window.addEventListener('resize', function () {
		  var
			_index = 0,
			width = parseFloat(document.body.clientWidth);
		  _states.forEach(function (item, index, arr) {
			if (width >= _states[index].minWidth)
			  _index = index;
		  });
		  if (_index !== _getActive()) {
			_setActive();
			_refresh();
		  }
		});
	  }

	  let _addIndicators = function () {
		let sliderIndicators = document.createElement('ol');
		sliderIndicators.classList.add('slider__indicators');
		for (var i = 0; i < _sliderItems.length; i++) {
		  let sliderIndicatorsItem = document.createElement('li');
		  if (i === 0) {
			sliderIndicatorsItem.classList.add('active');
		  }
		  sliderIndicatorsItem.setAttribute("data-slide-to", i);
		  sliderIndicators.appendChild(sliderIndicatorsItem);
		}
		_mainElement.appendChild(sliderIndicators);
		_indicatorItems = _mainElement.querySelectorAll('.slider__indicators > li')
	  }

	  
	  _addIndicators();
	  
	  _setUpListeners();

	  if (document.visibilityState === "visible") {
		_cycle(_config.direction);
	  }
	  _setActive();

	  return {
		right: function () {
		  _transformItem('right');
		},
		left: function () {
		  _transformItem('left');
		},
		stop: function () {
		  _config.isCycling = false;
		  clearInterval(_interval);
		},
		cycle: function () {
		  _config.isCycling = true;
		  clearInterval(_interval);
		  _cycle();
		}
	  }

	}
  }());

  let slider = multiItemSlider('.slider', {
	isCycling: true
  });