    class Freemius_Error extends Error
    {
      
        
        /**
        * Make a new API Exception with the given result.
        *
        * @param array result The result from the API server.
        */
        constructor(result){
            
            let code = 0;
            let message = 'Unknown error, please check GetResult().';
            let type = '';
            
            if (typeof (result.error) != "undefined" && result.error.constructor == Object)
            {
                if (typeof (result.error.code) != "undefined")
                    code =  result.error.code;
                if (typeof (result.error.message) != "undefined")
                    message =  result.error.message;
                if (typeof (result.error.type) != "undefined")
                    type = result.error.type;
            }

            super(message);

            this._result = result;
            this._type = type;
            this._code = code;
                     
        }

        /**
        * Return the associated result object returned by the API server.
        *
        * @return array The result from the API server
        */
        getResult()
        {
            return this._result;
        }

        getStringCode()
        {
            return this._code;
        }
        
        getType()
        {
            return this._type;
        }

        /**
        * To make debugging easier.
        *
        * @return string The string representation of the error
        */
        __toString()
        {
            let str = this.getType() + ': ';

            if (this._code != 0)
                str += this.getStringCode() + ': ';

            return str + this.message;
        }
}
    
module.exports = Freemius_Error;