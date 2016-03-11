'use strict';
// Based on: .../lp/framework/web/D2L.LP.Web.UI/Common/Controls/IFrame/ClassInitializer.js
// TODO: someone should probably go and rewrite an implementation of /d2l/common/iframe/iframe-client.js without jquery

var id = 10;

function doResize(toggle, callback, iframe, lastHtml, lastWidth) {
	var height, body = null;
	var pollingInterval = 500;

	if (!toggle.resize) {
		return;
	}

	try {
		checkForLegacyFrameSets(iframe);
		body = iframe.contentWindow.document.body;

		// React won't touch the insides of the iframe
		body.style.overflowY = 'hidden';

		// Note that neither events or mutationobserver were correctly detecting changes in all scenarios but outerHTML was hence what we have here
		var currentHtml = body.outerHTML,
			currentWidth = iframe.getBoundingClientRect();

		if (currentHtml == lastHtml && currentWidth === lastWidth) { // eslint-disable-line eqeqeq
			setTimeout(function() { doResize(toggle, callback, iframe, currentHtml, currentWidth); }, pollingInterval);
			return;
		}

		// Set the style to 'auto' before doing anything so that the iframe will pick up shrinking
		// causes a blip in the iframes rendering area, which is why we only resize when the html or width change
		iframe.style.height = 'auto';

		height = getHeightFromSameOriginIframe(iframe);
		callback(height, null);
	} catch (e) {
		callback(null, null);

		if (body) {
			body.style.overflowY = 'auto';
		}
	}

	setTimeout(function() { doResize(toggle, callback, iframe, currentHtml, currentWidth); }, pollingInterval);
}

function getHeightFromSameOriginIframe(iframe) {
	// The correct height property to use will vary depending on doc type as well as browser hence all the shenanigans
	var body = iframe.contentWindow.document.body,
		height = Math.max(body.scrollHeight, body.offsetHeight, body.clientHeight);

	var docElement = iframe.contentWindow.document.documentElement;
	if (docElement) {
		height = Math.max(height, docElement.scrollHeight, docElement.offsetHeight, docElement.clientHeight);
	}
	if (iframe.contentWindow.innerHeight) {
		height = Math.max(height, iframe.contentWindow.innerHeight);
	}

	return height;
}

function checkForLegacyFrameSets(iframe) {
	if (iframe.contentWindow.document.getElementsByTagName('frameset').length > 0) {
		throw 'cannot determine size with legacy framesets';
	}
}

function stopResizing(toggle) {
	toggle.resize = false;
}

function crossDomain(iframe) {
	try {
		var body = iframe.contentWindow.document.body; // eslint-disable-line no-unused-vars
		return false;
	} catch (e) {
		return true;
	}
}

function requestIframeSize(iframe) {
	iframe.contentWindow.postMessage(JSON.stringify({ handler: 'd2l.iframe.client', id: id }), '*');
}

function listenForCrossDomainSizeChanges(event, callback) {
	try {
		var data = JSON.parse(event.data);

		//At times data.id is undefined, so we only currently check on the data.handler.
		//This needs to be addressed in the future if we need to communicate with multiple iframes
		if (data.handler === 'd2l.iframe.host') {
			callback(data.height, 'hidden');
		}
	} catch (e) {
		console.warn('iframe resize: not handling unexpected message posted by another window: ', event.data); // eslint-disable-line no-console
	}
}

function isIos() {
	var platform = navigator.platform;
	return /iPad|iPhone|iPod/i.test(platform);
}

function startResizing(iframe, callback) {
	if (!iframe) { throw 'no iframe provided'; }
	if (!callback) { throw 'no callback provided'; }

	// ios has problems with scrolling when tapping inside an iframe, so we won't try to size them bigger than the screen
	if (isIos()) {
		callback(null, null);
	} else if (crossDomain(iframe)) {
		// The content is on another domain. If it includes /d2l/common/iframe/iframe-client.js, it can tell us its height
		var listenWrapper = function(e) { listenForCrossDomainSizeChanges(e, callback); };
		var stopListening = function() { window.removeEventListener('message', listenWrapper, false); };
		window.addEventListener('message', listenWrapper, false);

		requestIframeSize(iframe);

		return {
			security: 'crossDomain',
			cleanup: stopListening
		};
	} else {
		var toggle = { resize: true };
		doResize(toggle, callback, iframe);

		return {
			security: 'sameDomain',
			cleanup: function() {
				stopResizing(toggle);
			}
		};
	}
}

module.exports = startResizing;
