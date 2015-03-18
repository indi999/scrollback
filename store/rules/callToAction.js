var appUtils = require("../../lib/app-utils.js");

module.exports = function(core, config, store) {
	core.on("setstate", function(changes, next) {
		var user, dismissed, room, mode, rel;

		user = changes.user || store.get("user");
		dismissed = store.get("app", "dismissedCtas") || [];

		if (changes.app && changes.app.dismissedCtas) {
			dismissed = dismissed.concat(changes.app.dismissedCtas || []);
		}

		changes.app = changes.app || {};

		if (appUtils.isGuest(user)) {
			if (dismissed.indexOf("signin") === -1) {
				changes.app.cta = "signin";
			} else {
				changes.app.cta = null;
			}
		}

		if (changes.entities) {
			rel = changes.entities[room + "_" + user];
		}

		rel = rel || store.getRelation(room, user) || {};

		if (changes.nav) {
			if (changes.nav.room) {
				room = changes.nav.room;
			}

			if (changes.nav.mode) {
				mode = changes.nav.mode;
			}
		}

		room = room || store.get("nav", "room");
		mode = mode || store.get("nav", "mode");

		if (!appUtils.isGuest(user) && (/(chat|room)/).test(mode)) {
			if (dismissed.indexOf("follow") === -1 && ((/(visitor|none)/).test(rel.role) || !rel.role)) {
				changes.app.cta = "follow";
			} else {
				changes.app.cta = null;
			}
		}

		next();
	}, 100);
};
