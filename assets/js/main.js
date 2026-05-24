/*
	TXT by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '361px',   '736px'  ],
			xsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Load Menu.
	fetch("menu.json")
		.then(r => r.json())
		.then(menu => {

			console.log("Menu loaded and built successfully.");
			const currentPage = window.location.pathname.split("/").pop();
			const path = findPath(menu, currentPage);
			const marked = path ? markActive(menu, path) : menu;

			const nav = document.getElementById("nav");
			nav.innerHTML = "";

			const ul = buildMenu(marked);
			nav.appendChild(ul);

            console.log("Menu loaded and built successfully.");

			initMenu();
		});


		function initMenu() {	
			$nav = $('#nav');


		// Dropdowns.
			$('#nav > ul').dropotron({
				mode: 'fade',
				noOpenerFade: true,
				speed: 300,
				alignment: 'center'
			});

		// Scrolly
			$('.scrolly').scrolly({
				speed: 1000,
				offset: function() { return $nav.height() - 5; }
			});

		// Nav.

			// Title Bar.
				$(
					'<div id="titleBar">' +
						'<a href="#navPanel" class="toggle"></a>' +
						'<span class="title">' + ($('#logo').html() || 'CATI') + '</span>' +
					'</div>'
				)
					.appendTo($body);

			// Panel.
	
			$(
					'<div id="navPanel">' +
						'<nav>' +
							$('#nav').navList() +
						'</nav>' +
					'</div>'
			)
					.appendTo($body)
					.panel({
						delay: 500,
						hideOnClick: true,
						hideOnSwipe: true,
						resetScroll: true,
						resetForms: true,
						side: 'left',
						target: $body,
						visibleClass: 'navPanel-visible'
					});
		}

})(jQuery);
const slides = document.querySelectorAll('.banner .slide');
let index = 0;

function findPath(items, target, path = []) {
	for (const item of items) {

		const currentPath = [...path, item];

		if (item.link === target) {
			return currentPath;
		}

		if (item.children) {
			const result = findPath(item.children, target, currentPath);
			if (result) return result;
		}
	}

	return null;
}

function markActive(items, path) {
	return items.map(item => {

		const isActive = path.includes(item);

		const newItem = {
			...item,
			active: isActive
		};

		if (item.children) {
			newItem.children = markActive(item.children, path);
		}

		return newItem;
	});
}

function buildMenu(items) {
	const ul = document.createElement("ul");

	items.forEach(item => {
		const li = document.createElement("li");

		if (item.active) {
			li.classList.add("current");
		}

		const a = document.createElement("a");
		a.textContent = item.name;
		a.href = item.link || "#";

		li.appendChild(a);

		if (item.children && item.children.length > 0) {
			li.appendChild(buildMenu(item.children));
		}

		ul.appendChild(li);
	});

	return ul;
}

function nextSlide(){
  slides[index].classList.remove('active'); // esconde a atual
  index++;
  if(index >= slides.length){
    index = 0; // volta para a primeira
  }
  slides[index].classList.add('active'); // mostra a próxima
}

// muda a cada 4 segundos
setInterval(nextSlide, 4000);