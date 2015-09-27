## WebRTC Gaming - TicTacToe

Time to show off the versatility of WebRTC. If you don't know it already, WebRTC is a free, open project that provides simple APIs for creating Real-Time Communications (RTC) for browsers and mobile devices. It makes streaming any content such as video, audio, or arbitrary data simple and _fast_!

## Why PubNub? Signaling.

WebRTC is not a standalone API, it needs a signaling service to coordinate communication. Metadata needs to be sent between callers before a connection can be established. 

This metadata includes things such as:

- Session control messages to open and close connections
- Error messages
- Codecs/Codec settings, bandwidth and media types
- Keys to establish a secure connection
- Network data such as host IP and port

Once signaling has taken place, video/audio/data is streamed directly between clients, using WebRTC's `PeerConnection` API. This peer-to-peer direct connection allows you to stream high-bandwidth robust data, like video. In addition, we will be using `DataChannels` to stream messages through our RTC connection.

PubNub makes this signaling incredibly simple, and then gives you the power to do so much more with your WebRTC applications.

### Browser Compatibility

WebRTC is widely adopted by popular browsers such as Chrome and Firefox, but there are many browsers on which certain features will not work. See a list of [supported browsers here](http://iswebrtcreadyyet.com/).

## Part 1: The Video Setup
Time to begin! First I will show you how to make the bare minimum WebRTC video chat. Then, in Part 2 we will be using the WebRTC `DataChannel` API to play TicTacToe. The live demo for this tutorial [can be found here](http://kevingleason.me/WebRTC-TicTacToe/rtctactoe.html)!

### A Note on Testing and Debugging

If you try to open `file://<your-webrtc-project>` in your browser, you will likely run into Cross-Origin Resource Sharing (CORS) errors since the browser will block your requests to use video and microphone features. To test your code you have a few options. You can upload your files to a web server, like [Github Pages](https://pages.github.com/) if you prefer. However, to keep development local, I recommend you setup a simple server using Python.

To so this, open your terminal and change directories into your current project and depending on your version of Python, run one of the following modules.

    cd <project-dir>

    # Python 2
    python -m SimpleHTTPServer <portNo>
    
    # Python 3
    python -m http.server <portNo>
    
For example, I run Python2.7 and the command I use is `python -m SimpleHTTPServer 8001`. Now I can go to `http://localhost:8001/index.html` to debug my app! Try making an `index.html` with anything in it and serve it on localhost before you continue.

### Step 1: The HTML5 Backbone

```html
<div id="tic-tac-box" style="float: left; width: 47%;"></div>
<div style="float: left; width: 50%;">
    <div id="video-chat" hidden="true">
		<div id="vid-box"></div>
		<button onclick="end()">End Call</button>
    </div>
    
    <form name="loginForm" id="login" action="#" onsubmit="return login(this);">
        	<input type="text" name="username" id="username" placeholder="Enter A Username"/>            
			<input type="submit" name="login_submit" value="Log In">
    </form>

	<form name="callForm" id="call" action="#" onsubmit="return makeCall(this);">
        <input type="text" name="number" id="call" placeholder="Enter User To Call!"/>
        <input type="submit" value="Call">
	</form>
</div>
```

This should leave you with a very basic HTML backbone that looks something like this:

![HTML Backbone](img/html.png)

The `tic-tac-box` div will house our game board, and `video-chat` is where we will place our WebRTC video stream. I use `style="float: left; width: 50%"` to align our video chat and game side by side.

### Step 2: The JavaScript Imports

There are three libraries that you will need to include to make WebRTC operations much easier. The first thing you should include is [jQuery](https://jquery.com/) to make modifying DOM elements a breeze. Then, you will need the PubNub JavaScript SDK to facilitate the WebRTC signaling. Finally, include the PubNub WebRTC SDK which makes placing phone calls as simple as calling the `dial(number)` function.

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script src="https://cdn.pubnub.com/pubnub.min.js"></script>
    <script src="http://kevingleason.me/SimpleRTC/js/webrtc.js"></script>

Now we are ready to write our calling functions for `login` and `makeCall`!


