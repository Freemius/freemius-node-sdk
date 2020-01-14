const trim = require('locutus/php/strings/trim');
const strtotime = require('locutus/php/datetime/strtotime');
const empty = require('locutus/php/var/empty');
const count = require('locutus/php/array/count');
const parse_url = require('locutus/php/url/parse_url');
const is_string = require('locutus/php/var/is_string');
const basename = require('locutus/php/filesystem/basename');
const uniqid = require('locutus/php/misc/uniqid');
const moment = require('moment');
const crypto = require("crypto");
const request = require('request');
const os = require('os');
const Freemius_Error = require('./errors/Freemius_Error');
const fs = require('fs');

//request.debug = true


//require('request-debug')(request);

const DATE_RFC2822 = "ddd, DD MMM YYYY HH:mm:ss ZZ";


const VERSION = '1.0.4';
const FORMAT = 'json';

const FS_API__VERSION = 1;
const FS_SDK__PATH = __dirname;
const FS_SDK__EXCEPTIONS_PATH = FS_SDK__PATH + '/Exceptions/';
const FS_SDK__USER_AGENT = 'fs-php-' + VERSION;


const FS_API__PROTOCOL = "https";
const FS_API__ADDRESS = FS_API__PROTOCOL + '://api.freemius.com';
const FS_API__SANDBOX_ADDRESS = FS_API__PROTOCOL + '://sandbox-api.freemius.com';

var _clock_diff = 0;require('locutus/php/misc/uniqid')


class Freemius {

    /**
    * @var int Clock diff in seconds between current server to API server.
    */
    
    /**
     * @param string pScope 'app', 'developer', 'store', 'user' or 'install'.
     * @param number pID Element's id.
     * @param string pPublic Public key.
     * @param string pSecret Element's secret key.
     * @param bool pSandbox Whether or not to run API in sandbox mode.
     */
    constructor(pScope, pID, pPublic, pSecret = false, pSandbox = false) {
        if (typeof pSecret === "boolean")
            pSecret = pPublic;

        this.id = pID;
        this.public = pPublic;
        this.secret = pSecret;
        this.scope = pScope;
        this.sandbox = pSandbox;
        this._clock_diff = 0;
    }

    IsSandbox() {
        return this.sandbox;
    }

    CanonizePath(pPath) {
        pPath = trim(pPath, '/');
        let query_pos = pPath.indexOf('?');
        let query = '';

        if (-1 !== query_pos) {
            query = pPath.substring(query_pos);
            pPath = pPath.substring(0, query_pos);
        }

        // Trim '.json' suffix.
        let format_length = ('.' + FORMAT).length;
        let start = format_length * (-1); //negative
        if (pPath.toLowerCase().substring(start) === ('.' + FORMAT))
            pPath = pPath.substring(0, pPath.length - format_length);

        let base = "";

        switch (this.scope) {
            case 'app':
                base = '/apps/' + this.id;
                break;
            case 'developer':
                base = '/developers/' + this.id;
                break;
            case 'store':
                base = '/stores/' + this.id;
                break;
            case 'user':
                base = '/users/' + this.id;
                break;
            case 'plugin':
                base = '/plugins/' + this.id;
                break;
            case 'install':
                base = '/installs/' + this.id;
                break;
            default:
                throw new Freemius_Error('Scope not implemented.');
        }

        let requestURL = '/v' + FS_API__VERSION + base +
        (!empty(pPath) ? '/' : '') + pPath +
        ((-1 === pPath.indexOf('.')) ? '.' + FORMAT : '') + query;
        this.requestURL = requestURL;
        return requestURL;
    }

    _Api(pPath, pMethod = 'GET', pParams = {}, pFileParams = {},responseCallback) {
        //console.log(pPath)
        pMethod = pMethod.toUpperCase();

        let result = null;
        try {
            let result = this.MakeRequest(pPath, pMethod, pParams, pFileParams,responseCallback);
        }
        catch (e) {
            console.log(e);
            /*if (e instanceof Freemius_Error) {
                // Map to error object.
                result = JSON.stringify(e.getResult());

            } else {
                result = JSON.stringify({
                    'error': {
                        'type': 'Unknown',
                        'message': e.getMessage() + ' (' + e.getFile() + ': ' + e.getLine() + ')',
                        'code': 'unknown',
                        'http': 402
                    }
                });

            }*/
        }

        let decoded = JSON.parse(result);

        return (null === decoded) ? result : decoded;
    }

    /**
     * @return bool True if successful connectivity to the API endpoint using ping.json endpoint.
     */
    Test(responseCallback) {
        let pong = this._Api('/v' + FS_API__VERSION + '/ping.json','GET', {}, {}, responseCallback);

    }

    /**
     * Find clock diff between current server to API server.
     *
     * @since 1.0.2
     * @return int Clock diff in seconds.
     */
    FindClockDiff(responseCallback) {
        let time = Date.now();
        //responseCallback({"a":"aaaa"})
        this._Api('/v' + FS_API__VERSION + '/ping.json', 'GET', {}, {}, responseCallback);
        //let pong = this._Api('/v' + FS_API__VERSION + '/ping.json', responseCallback);
        //console.log(pong);
        //return (time - strtotime(pong.timestamp));
    }

    Api(pPath, pMethod = 'GET', pParams = {}, pFileParams = {},responseCallback) {
        return this._Api(this.CanonizePath(pPath), pMethod, pParams, pFileParams, responseCallback);
    }

    /**
 * Base64 encoding that does not need to be urlencode()ed.
 * Exactly the same as base64_encode except it uses
 *   - instead of +
 *   _ instead of /
 *   No padded =
 *
 * @param string input base64UrlEncoded string
 * @return string
 */
    base64UrlDecode(input) {

        var input = input.replace("-", "+");
        input = input.replace("_", "/");
        let buff = Buffer.from(input, 'base64');

        return buff.toString('utf-8');
    }

    /**
     * Base64 encoding that does not need to be urlencode()ed.
     * Exactly the same as base64_encode except it uses
     *   - instead of +
     *   _ instead of /
     *
     * @param string input string
     * @return string base64Url encoded string
     */
    base64UrlEncode(input) {

        var input = input.replace("+", "-").replace("/", "_")

        let respTxt = Buffer.from(input).toString('base64').replace(/=/g, "");
        
        //console.log(respTxt)

        return respTxt;
    }

    GetUrl(pCanonizedPath = '') {
        return (this.sandbox ? FS_API__SANDBOX_ADDRESS : FS_API__ADDRESS) + pCanonizedPath;
    }

    /**
     * Set clock diff for all API calls.
     *
     * @since 1.0.3
     * @param pSeconds
     */
    SetClockDiff(pSeconds) {
         _clock_diff = pSeconds;
     }

    /**
     * Sign request with the following HTTP headers:
     *      Content-MD5: MD5(HTTP Request body)
     *      Date: Current date (i.e Sat, 14 Feb 2015 20:24:46 +0000)
     *      Authorization: FS {scope_entity_id}:{scope_entity_public_key}:base64encode(sha256(string_to_sign, {scope_entity_secret_key}))
     *
     * @param string pResourceUrl
     * @param string pMethod
     * @param array  opts
     * @param string pJsonEncodedParams
     * @param string pContentType
     */
    SignRequest(pResourceUrl, pMethod, opts = { "headers": {} }, pJsonEncodedParams, pContentType) {
        
        let auth = this.GenerateAuthorizationParams(
            pResourceUrl,
            pMethod,
            pJsonEncodedParams,
            pContentType
        );

        opts.headers["Date"] = auth['date'];

        // Add authorization header.
        opts.headers["Authorization"] = auth['authorization'];

        if (!empty(auth['content_md5']))
            opts.headers["Content-MD5"] = auth['content_md5'];
    }


    /**
     * @param string pResourceUrl
     * @param string pMethod
     * @param string pJsonEncodedParams
     * @param string pContentType
     *
     * @return array
     */
    GenerateAuthorizationParams(
        pResourceUrl,
        pMethod = 'GET',
        pJsonEncodedParams = '',
        pContentType = ''
    ) {
        pMethod = pMethod.toUpperCase();

        let eol = "\n";
        let content_md5 = '';
        let now = (Date.now()- this._clock_diff);       
        let date = moment(new Date(now)).format(DATE_RFC2822);

        if (['POST', 'PUT'].includes(pMethod) && !empty(pJsonEncodedParams)
        )
            content_md5 = crypto.createHash('md5').update(pJsonEncodedParams).digest("hex");
        
        //console.log("Content MD5"+content_md5);

        let string_to_sign = [
            pMethod,
            content_md5,
            pContentType,
            date,
            pResourceUrl].join(eol);
        
        //console.log("string to sign="+string_to_sign)

        // If secret and public keys are identical, it means that
        // the signature uses public key hash encoding.
        let auth_type = (this.secret !== this.public) ? 'FS' : 'FSP';

        //creating hmac object 
        let hmac = crypto.createHmac('sha256', this.secret);
        //passing the data to be hashed
        let data = hmac.update(string_to_sign);


        let auth = {
            'date': date,
            'authorization': auth_type + ' ' + this.id + ':' +
                this.public + ':' +
                this.base64UrlEncode(data.digest("hex")),
            'content_md5': ''
        };

        //console.log("Content_MD5 = "+content_md5)

        if (!empty(content_md5))
            auth.content_md5 = content_md5;
        
        //console.log(auth)

        return auth;
    }


    /**
     * Makes an HTTP request. This method can be overridden by subclasses if
     * developers want to do fancier things or use something other than curl to
     * make the request.
     *
     * @param pCanonizedPath The URL to make the request to
     * @param string pMethod HTTP method
     * @param array pParams The parameters to use for the POST body
     * @param array pFileParams
     * @param null ch Initialized curl handle
     *
     * @return mixed
     * @throws Freemius_Exception
     */
    MakeRequest(pCanonizedPath, pMethod = 'GET', pParams = {}, pFileParams = {},responseCallback) {

        const options = {
            headers: {
                "User-Agent": FS_SDK__USER_AGENT,
                "Accept": "*/*"
            }

        };

        let content_type = 'application/json';
        let json_encoded_params = empty(pParams) ? '' : JSON.stringify(pParams);

        let overidden_method = pMethod;
        let post_fields = "";

        if ('POST' === pMethod || 'PUT' === pMethod) {
            //console.log(pFileParams);
            //console.log("length="+Object.keys(pFileParams).length)
            if (Object.keys(pFileParams).length === 0 && pFileParams.constructor === Object ) {                
                post_fields = json_encoded_params;
            }
            else {

                let data = empty(json_encoded_params) ? '' : { 'data': json_encoded_params };

                json_encoded_params = '';

                let boundary = ('----' + uniqid());
                post_fields = this.GenerateMultipartBody(data, pFileParams, boundary);

                content_type = `multipart/form-data; boundary=${boundary}`;

                if ('PUT' === pMethod) {
                    let query = parse_url(pCanonizedPath).query;
                    pCanonizedPath += (is_string(query) ? '&' : '?') + 'method=PUT';

                    overidden_method = pMethod;
                    pMethod = 'POST';
                }
            }

            if (0 < count(pParams)) {
                options['body'] = post_fields;
                options.headers['Content-Length'] = post_fields.length;
                
            }

        }

        
        //console.log(pCanonizedPath);

        options.headers["Content-Type"] = content_type;
        let request_url = this.GetUrl(pCanonizedPath);
        options["url"] = request_url;
        options["method"] = pMethod;
        //options["rejectUnauthorized"] = false;
        //options["secureProtocol"] = 'TLSv1_method';
       

        let resource = pCanonizedPath.split('?');

        //console.log("JSON Encode Params:" + json_encoded_params);
        this.SignRequest(resource[0], overidden_method, options, json_encoded_params, content_type);

        // disable the 'Expect: 100-continue' behaviour. This causes CURL to wait
        // for 2 seconds if the server does not support this header.
        //options.headers["Expect"] = "";

        //console.log(options);
        //console.log(options);

        

        request(options, function (error, response, body) {
            //console.log(error);
            //console.log(response);
            if (!error && response.statusCode == 200) {
                responseCallback(response.body);

            } else {
                console.log("Error:Stats Code:"+response.statusCode);
                console.log("Error:Message:"+response.body);
                //console.log(error);
                
            }
        });
    }
                                                                                          
    /**
     * @param array  pParams
     * @param array  pFileParams
     * @param string pBoundary
     *
     * @return string
     */
    GenerateMultipartBody(pParams, pFileParams, pBoundary) {
        let data = '';

        if (!empty(pParams)) {
            for (const [name, value] of Object.entries(pParams)) {

                data = ('--' + pBoundary + os.EOL) +
                    (`Content-Disposition: form-data; name="${name}"` + os.EOL) +
                    os.EOL +
                    (value + os.EOL);

            }
        }

        let content = "";
        for (const [name, file_path] of Object.entries(pFileParams)) {
            let filename = basename(file_path);

            data +=
                ('--' + pBoundary + os.EOL) +
                (`Content-Disposition: form-data; name="${name}"; filename="${filename}"` + os.EOL) +
                (`Content-Type: ${this.GetMimeContentType(file_path)}` + os.EOL);
            
            content = fs.readFileSync(file_path);
        }

       // data += ('--' + pBoundary + '--');
        
        let body = Buffer.concat([
            Buffer.from(data, "utf8"),
            Buffer.from(content, 'binary'),
            Buffer.from("\r\n--" + pBoundary + "--\r\n", "utf8"),
        ]);

        return body;

    }

    /**
     * @param string pFilename
     *
     * @return string
     *
     * @throws Exception
     */
    GetMimeContentType(pFilename) {

        let mime_types = {
            'zip': 'application/zip',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
        };

        let ext = pFilename.split('.')[1];       

        if (mime_types[ext] == "undefined")
            throw new Error('Unknown file type');

        return mime_types[ext];
    }


}

module.exports = Freemius;





