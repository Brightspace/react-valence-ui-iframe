import { render, screen } from "@testing-library/react";
import React from 'react';
import ReactIframe from '../src/react-valence-ui-iframe.js';
import ResizeCallbackMaker from '../src/ResizeCallbackMaker.js';

describe('react-valence-ui-iframe', function() {
	beforeEach(function() {
		jest.clearAllMocks();
	});

	it('should render an iframe to the screen', function() {
		render(<ReactIframe src="http://example.com"/>);
		var litIframeWrapper = screen.getByTestId('lit-iframe-wrapper');
		expect(litIframeWrapper).not.toBeNull();
	});

	it('should call progressCallback with (0,"none") on mount', function() {
		const callback = jest.fn();
        render(<ReactIframe src="https://example.com" progressCallback={callback}/>);
		expect(callback).toHaveBeenCalledWith(0, 'none');
	});

	it('should call progressCallback with (100,"none") on load', function() {
		var callback = jest.fn();
		render(<ReactIframe src="http://example.com" progressCallback={callback}/>);
		var litIframeWrapper = screen.getByTestId('lit-iframe-wrapper');
		jest.spyOn(ResizeCallbackMaker, 'startResizingCallbacks').mockImplementationOnce(() => {});
		litIframeWrapper._onFrameLoad();
		expect(callback).toHaveBeenCalledWith(100, 'none');
	});

	it('should call resizeCallbackMaker if resizeCallback is provided', function() {
		var callback = jest.fn();
		render(<ReactIframe src="http://example.com" resizeCallback={callback}/>);
		screen.getByTestId('lit-iframe-wrapper')._onResize(10, 'hidden');

		expect(callback).toHaveBeenCalled();
	});

	it('should not throw an error if the ResizeCallbackMaker startResizingCallbacks does not return a result', function() {
		jest.spyOn(ResizeCallbackMaker, 'startResizingCallbacks').mockImplementationOnce(() => {});
		var callback = jest.fn();
		render(<ReactIframe src="http://example.com" resizeCallback={callback}/>);
		var litIframeWrapper = screen.getByTestId('lit-iframe-wrapper');
		litIframeWrapper._onFrameLoad();

		expect(litIframeWrapper._iframeCleanup).toBe(null);
	});

	it('should set the "cleanup" state to the variable returned by the resizeCallbackMaker', function() {
		var callback = jest.fn();
		var cleanupStub = jest.fn();

		jest.spyOn(ResizeCallbackMaker, 'startResizingCallbacks').mockImplementationOnce(() => {return {cleanup: cleanupStub}});
		render(<ReactIframe src="http://example.com" resizeCallback={callback}/>);

		var litIframeWrapper = screen.getByTestId('lit-iframe-wrapper');
		litIframeWrapper._onFrameLoad();

		expect(litIframeWrapper._iframeCleanup).toBe(cleanupStub);
	});

	it('should call the "cleanup" state function on load if one exists before setting the new one', function() {
		var callback = jest.fn();
		var cleanupStub = jest.fn();

		jest.spyOn(ResizeCallbackMaker, 'startResizingCallbacks').mockImplementation(() => {return {cleanup: cleanupStub}});
		render(<ReactIframe src="http://example.com" progressCallback={callback}/>);

		var litIframeWrapper = screen.getByTestId('lit-iframe-wrapper');
		litIframeWrapper._onFrameLoad();
		expect(cleanupStub).not.toHaveBeenCalled();

		litIframeWrapper._onFrameLoad();
		expect(cleanupStub).toHaveBeenCalled();;
	});

	it('callbackWrapper should set the iframeOverflowY value', function() {
		var callback = jest.fn();
		var height = 10;
		var iframeOverflowY = 'hidden';

		render(<ReactIframe src="http://example.com" resizeCallback={callback}/>);
		var litIframeWrapper = screen.getByTestId('lit-iframe-wrapper');
		litIframeWrapper._onResize(height, iframeOverflowY);

		expect(litIframeWrapper._frameOverflowY).toBe(iframeOverflowY);
	});

	it('callbackWrapper should call the resizeCallback with the height and sizeKnown = true if there is a height', function() {
		var callback = jest.fn();
		var height = 10;
		var iframeOverflowY = 'hidden';

		render(<ReactIframe src="http://example.com" resizeCallback={callback}/>);
		var litIframeWrapper = screen.getByTestId('lit-iframe-wrapper');
		litIframeWrapper._onResize(height, iframeOverflowY);

		expect(callback).toHaveBeenCalledWith(height, true);
	});

	it('callbackWrapper should call the resizeCallback with null and sizeKnown = false if the height is null', function() {
		var callback = jest.fn();
		var height = null;
		var iframeOverflowY = 'hidden';

		render(<ReactIframe src="http://example.com" resizeCallback={callback}/>);
		var litIframeWrapper = screen.getByTestId('lit-iframe-wrapper');
		litIframeWrapper._onResize(height, iframeOverflowY);

		expect(callback).toHaveBeenCalledWith(height, false);
	});

	it('should render a d2l-suppress-nav element offscreen', function() {
		const {container} = render(<ReactIframe src="http://example.com"/>);
		var wrapper = container.querySelector('.vui-offscreen.d2l-suppress-nav');

		expect(wrapper).not.toBeNull();
	});
});
