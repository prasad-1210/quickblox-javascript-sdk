'use strict';

/*
 * QuickBlox JavaScript SDK
 *
 * Main SDK Module
 *
 */

var config = require('./qbConfig');
var Utils = require('./qbUtils');

var isBrowser = typeof window !== 'undefined';

// Actual QuickBlox API starts here
function QuickBlox() {}

QuickBlox.prototype = {
    /**
     * Return current version of QuickBlox JavaScript SDK
     * @memberof QB
     * */
    version: config.version,

    /**
     * @memberof QB
     * @param {Number | String} appIdOrToken - Application ID (from your admin panel) or Session Token.
     * @param {String | Number} authKeyOrAppId - Authorization key or Application ID. You need to set Application ID if you use sessionToken as appIdOrToken parameter.
     * @param {String} authSecret - Authorization secret key (from your admin panel).
     * @param {Object} configMap - An Object of settings for QuickBlox SDK.
     */
    init: function(appIdOrToken, authKeyOrAppId, authSecret, configMap) {
        if (configMap && typeof configMap === 'object') {
            config.set(configMap);
        }



        var Proxy = require('./qbProxy');
        this.service = new Proxy();
    this.version = config.version;
    this.buildNumber = config.buildNumber;

    var Proxy = require('./qbProxy');
    this.service = new Proxy();

        /** include dependencies */
        var Auth = require('./modules/qbAuth'),
            Users = require('./modules/qbUsers'),
            Chat = require('./modules/qbChat'),
            Content = require('./modules/qbContent'),
            Location = require('./modules/qbLocation'),
            PushNotifications = require('./modules/qbPushNotifications'),
            Data = require('./modules/qbData'),
            conn;

        if (isBrowser) {
            /** create Strophe Connection object */
            var Connection = require('./qbStrophe');
            conn = new Connection();

            /** add WebRTC API if API is avaible */
            if( Utils.isWebRTCAvailble() ) {
                var WebRTCClient = require('./modules/webrtc/qbWebRTCClient');
                this.webrtc = new WebRTCClient(this.service, conn || null);
                this.Recorder = require('./modules/webrtc/qbRecorder');
            } else {
                this.webrtc = false;
            }
        } else {
            this.webrtc = false;
        }

        this.auth = new Auth(this.service);
        this.users = new Users(this.service);
        this.chat = new Chat(this.service, this.webrtc ? this.webrtc.signalingProcessor : null, conn || null);
        this.content = new Content(this.service);
        this.location = new Location(this.service);
        this.pushnotifications = new PushNotifications(this.service);
        this.data = new Data(this.service);

        // Initialization by outside token
        if (typeof appIdOrToken === 'string' && (!authKeyOrAppId || typeof authKeyOrAppId === 'number') && !authSecret) {

            if(typeof authKeyOrAppId === 'number'){
                config.creds.appId = authKeyOrAppId;
            }

            this.service.setSession({ token: appIdOrToken });
        } else {
            config.creds.appId = appIdOrToken;
            config.creds.authKey = authKeyOrAppId;
            config.creds.authSecret = authSecret;
        }
    },

    /**
     * Will return current session
     * @memberof QB
     * @param {getSessionCallback} callback - The getSessionCallback callback.
     * */
    getSession: function(callback) {
        /**
         * This callback will return session object.
         * @callback getSessionCallback
         * @param {Object} error - The error object
         * @param {Object} session - Contains of session object
         * */
        this.auth.getSession(callback);
    },

    /**
     * Will create new session. {@link https://quickblox.com/developers/Javascript#Authorization More info}
     * @memberof QB
     * @param {String} appIdOrToken Should be applecationID or QBtoken.
     * @param {destroySessionCallback} callback -
     * */
    createSession: function(params, callback) {
        /**
         * This callback will return session object.
         * @callback getSessionCallback
         * @param {Object} error - The error object
         * @param {Object} session - Contains of session object
         * */
        this.auth.createSession(params, callback);
    },

    /**
     * Will destroy current session.  {@link https://quickblox.com/developers/Authentication_and_Authorization#API_Session_Destroy More info}
     * @memberof QB
     * @param {destroySessionCallback} callback - The destroySessionCallback callback.
     * */
    destroySession: function(callback) {
        /**
         * This callback will return error if in will get an error or empty string if everything goes well.
         * @callback destroySessionCallback
         * @param {Object | Null} error - The error object if got en error and null if success.
         * @param {Null | String} result - String (" ") if session was removed successfully.
         * */
        this.auth.destroySession(callback);
    },

    /**
     * Login to QuickBlox application. {@link https://quickblox.com/developers/Javascript#Authorization More info}
     * @memberof QB
     * @param {Object} params - Object login of params.
     * @param {loginCallback} callback - .
     * */
    login: function(params, callback) {
        /**
         * This callback will return error if can not login and user Object if login was successful.
         * @callback loginCallback
         * @param {Object | Null} error - The error object if got en error and null if success.
         * @param {Null | Object} result - User data object if everything goes well and null on error.
         * */
        this.auth.login(params, callback);
    },

    /**
     * Remove user from current session, but doesn't destroy it.
     * @memberof QB
     * @param {logoutCallback} callback Should be applecationID or QBtoken.
     * */
    logout: function(callback) {
        /**
         * This callback will return error if can not login and user Object if login was successful.
         * @callback logoutCallback
         * @param {Object | Null} error - The error object if got en error and null if success.
         * @param {Null | String} result - String (" ") if session was removed successfully.
         * */
        this.auth.logout(callback);
    }

};

/**
 * @namespace
 */
var QB = new QuickBlox();

QB.QuickBlox = QuickBlox;

module.exports = QB;
