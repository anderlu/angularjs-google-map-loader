/**
 * User: Anderlu
 * Date: 15/8/14
 * Time: 下午3:22
 */
angular.module('GoogleMapPlugin.loader', []).factory('GMapScriptLoader', [
    '$q','GMapUUID', function($q, uuid) {
        var getScriptUrl, includeScript, isGoogleMapsLoaded, scriptId;
        scriptId = void 0;
        getScriptUrl = function(options) {
            if (options.china) {
                return 'http://maps.google.cn/maps/api/js?';
            } else {
                return 'https://maps.googleapis.com/maps/api/js?';
            }
        };
        includeScript = function(options) {
            var query=[], script;
            for(var key in options){
                query.push( key + '=' + options[key]);
            }
            if (scriptId) {
                document.getElementById(scriptId).remove();
            }
            query = query.join('&');
            script = document.createElement('script');
            script.id = scriptId = "ui_gmap_map_load_" + (uuid.generate());
            script.type = 'text/javascript';
            script.src = getScriptUrl(options) + query;
            return document.body.appendChild(script);
        };
        isGoogleMapsLoaded = function() {
            return angular.isDefined(window.google) && angular.isDefined(window.google.maps);
        };
        return {
            load: function(options) {
                var deferred, randomizedFunctionName;
                deferred = $q.defer();
                if (isGoogleMapsLoaded()) {
                    deferred.resolve(window.google.maps);
                    return deferred.promise;
                }
                randomizedFunctionName = options.callback = 'onGoogleMapsReady' + Math.round(Math.random() * 1000);
                window[randomizedFunctionName] = function() {
                    window[randomizedFunctionName] = null;
                    deferred.resolve(window.google.maps);
                };
                if (window.navigator.connection && window.Connection && window.navigator.connection.type === window.Connection.NONE) {
                    document.addEventListener('online', function() {
                        if (!isGoogleMapsLoaded()) {
                            return includeScript(options);
                        }
                    });
                } else {
                    includeScript(options);
                }
                return deferred.promise;
            }
        };
    }
]).provider('GoogleMapApi', function() {
    this.options = {
        china: false,
        v: '3.17',
        libraries: '',
        language: 'en',
        sensor: 'false'
    };
    this.configure = function(options) {
        angular.extend(this.options, options);
    };
    this.$get = [
        'GMapScriptLoader', (function(_this) {
            return function(loader) {
                return loader.load(_this.options);
            };
        })(this)
    ];
    return this;
}).service('GMapUUID', function() {
    function UUID(){}UUID.generate=function(){var a=UUID._gri,b=UUID._ha;return b(a(32),8)+"-"+b(a(16),4)+"-"+b(16384|a(12),4)+"-"+b(32768|a(14),4)+"-"+b(a(48),12)};UUID._gri=function(a){return 0>a?NaN:30>=a?0|Math.random()*(1<<a):53>=a?(0|1073741824*Math.random())+1073741824*(0|Math.random()*(1<<a-30)):NaN};UUID._ha=function(a,b){for(var c=a.toString(16),d=b-c.length,e="0";0<d;d>>>=1,e+=e)d&1&&(c=e+c);return c};
    //END REPLACE
    return UUID;
});