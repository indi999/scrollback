/* jshint jquery: true */
/* global libsb, personEl */
/* exported chatArea */

var peopleArea = {};

$(function() {
	var $people = $(".pane-people"),
		room = 'testroom', /* replace with room from URL */
		people = [];

	libsb.getOccupants(room, function(err, p) {
		if(err) throw err;
		people = people.concat(p);
		$people.reset();
	});

	// Set up infinite scroll here.
	$people.infinite({
		scrollSpace: 2000,
		fillSpace: 500,
		itemHeight: 100,
		startIndex: 0,
		getItems: function (index, before, after, recycle, callback) {
			var res = [], i;

			for(i=index-before; i<=index+after; i++) {
				if(i<0) { res.push(false); i=0; }
				if(i==index) continue;
				if(i>people.length-1) { res.push(false); break; }
				res.push(personEl.render(null, people[i], i));
			}

			callback(res);
		}
	});

	peopleArea.setBottom = function(bottom) {
		var atBottom = ($people.scrollTop() + $people.height() == $people[0].scrollHeight);

		$people.css({ bottom: bottom });
		if(atBottom) $people.scrollTop($people[0].scrollHeight);
	};

	peopleArea.setRoom = function(r) {
		room = r;
		$people.reset();
	};
});