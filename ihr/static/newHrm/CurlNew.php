<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/3/28
 * Time: 20:56
 */

/**Curl类
 * 暂时没有加入COokie支持
 * Class Curl
 */
class Curl
{
    static public $errorCode = 0;
    static public $requestUrl = '';
    static public $errorInfo = [ 0 => 'success', 1 => 'url格式错误', 2 => 'r' ];
    static public $requestType = 'GET';
    static public $dataType = 'Array';
    static public $requestData = '';
    static public $requestStatus = [ ];

    /**get方式去请求数据
     * @param        $url
     * @param string $data
     * @return array|mixed|object|stdClass
     */
    static function get( $url, $data = '' )
    {
        $data = [ 'url' => $url, 'data' => $data, 'requestType' => 'GET' ];

        return self::Request( $data );
    }

    /**post方式去请求，
     * @param        $url
     * @param        $data默认数据格式为数组
     * @param string $dataType
     * @return array|mixed|object|stdClass
     */
    static function post( $url, $data, $dataType = 'Array' )
    {
        $data = [ 'url' => $url, 'data' => $data, 'requestType' => 'POST', 'dataType' => $dataType ];

        return self::Request( $data );
    }

    /**post方式去请求，数据为json字符串
     * @param $url
     * @param $data
     * @return array|mixed|object|stdClass
     */
    static function postByJsonString( $url, $data )
    {
        return self::post( $url, $data, 'Json' );
    }

    /**判断协议
     * @param $url
     * @return bool
     */
    static function isHTTPS( $url )
    {
        $ssl = substr( $url, 0, 8 ) == "https://" ? true : false;

        return $ssl;
    }

    /**把请求数据转为url字符串
     * @param $data
     * @return bool|string
     */
    static function getSendDataByString( $data )
    {
        if ( is_array( $data ) ) {
            $data = http_build_query( $data );
        } elseif ( is_string( $data ) ) {
            $data = $data;
        } else {
            $data = '';
        }
        self::$requestData = $data;

        return $data;
    }

    /**设置请求类型
     * @param $requestType
     */
    static function setRequestType( $requestType )
    {
        self::$requestType = $requestType;
    }

    /**设置错误码
     * @param $code
     */
    static function setErrorCode( $code )
    {
        self::$errorCode = $code;
    }

    /**底层去真正去请求
     * @param array $params
     * @return array|mixed|object|stdClass|void
     */
    static private function Request( array $params )
    {
        self::$requestUrl = $params[ 'url' ];
        if ( empty( $params[ 'url' ] ) || !is_string( $params[ 'url' ] ) ) {
            return self::setErrorCode( 1 );
        }
        if ( empty( $params[ 'requestType' ] ) || $params[ 'requestType' ] != 'POST' ) {
            self::setRequestType( 'GET' );
        } else {
            self::setRequestType( 'POST' );
        }
        extract( $params );
        $ch = curl_init();
        $isPost = self::$requestType == 'POST' ? 1 : 0;
        if ( !empty( $dataType ) && $dataType == 'Json' ) {
            self::$dataType = 'Json';
            $opt[ CURLOPT_HTTPHEADER ] = [
                'Content-Type: application/json; charset=utf-8',
                'Content-Length: ' . strlen( self::getSendDataByString( $data ) )
            ];
        }

        if ( substr_count( $url, '?' ) > 1 ) {
            $url = preg_replace( '/\?/', '@', $url, 1 );
            $url = str_replace( '?', '&', $url );
            $url = str_replace( '@', '?', $url );
        }
        $opt = [
            CURLOPT_URL            => $url,
            CURLOPT_POST           => $isPost,
            CURLOPT_HEADER         => 0,
            CURLOPT_POSTFIELDS     => self::getSendDataByString( $data ),
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_TIMEOUT        => 10,
            //CURLOPT_REFERER=>"http://bbs.it-home.org/ "
        ];
        if ( self::isHTTPS( $url ) ) {
            $opt[ CURLOPT_SSL_VERIFYHOST ] = false;
            $opt[ CURLOPT_SSL_VERIFYPEER ] = false;
        }
        curl_setopt_array( $ch, $opt );
        $res = curl_exec( $ch );
        if (strstr(HRM_API, 'test')) file_put_contents('./result.txt', $res, FILE_APPEND);
        //$res=json_decode($res_str,true);
        if ( empty( $res ) ) {
            self::$requestStatus = curl_getinfo( $ch );
            curl_close( $ch );

            return FAILED( '接口返回失败' );
        }
        curl_close( $ch );

        return $res;
    }

    static function postHJ( $url, $data, $dataType = 'Array' )
    {
        $data = [ 'url' => $url, 'data' => $data, 'requestType' => 'POST', 'dataType' => $dataType ];

        return self::RequestForHeader( $data );
    }

    /**底层去真正去请求
     * @param array $params
     * @return array|mixed|object|stdClass|void
     */
    static private function RequestForHeader( array $params )
    {
        self::$requestUrl = $params[ 'url' ];
        if ( empty( $params[ 'url' ] ) || !is_string( $params[ 'url' ] ) ) {
            return self::setErrorCode( 1 );
        }
        if ( empty( $params[ 'requestType' ] ) || $params[ 'requestType' ] != 'POST' ) {
            self::setRequestType( 'GET' );
        } else {
            self::setRequestType( 'POST' );
        }
        extract( $params );
        $ch = curl_init();
        $isPost = self::$requestType == 'POST' ? 1 : 0;
        if ( !empty( $dataType ) && $dataType == 'Json' ) {
            self::$dataType = 'Json';
            $HJAPPKEY = 'haifeng';
            $HJAPPSECRET = 'a2f1e22a0dd54e5050181b037a7cfc06';
            $count = 1;
            $Hujiang_sign = md5( $HJAPPSECRET . $HJAPPKEY . $count );
            $opt[ CURLOPT_HTTPHEADER ] = [
                'Content-Type:application/json',
                'Hujiang-sign:' . $Hujiang_sign,
                'HJAPPSECRET:' . $HJAPPSECRET,
                'HJAPPkey:' . $HJAPPKEY,
            ];
            $opt[ CURLOPT_HTTPHEADER ] = [
                'Content-Type:application/json',
                'Hujiang-sign:' . $Hujiang_sign,
                'HJAPPSECRET:' . $HJAPPSECRET,
                'HJAPPkey:' . $HJAPPKEY,
            ];
        }
        $HJAPPKEY = 'haifeng';
        $HJAPPSECRET = 'a2f1e22a0dd54e5050181b037a7cfc06';
        $count = 1;
        $Hujiang_sign = md5( $HJAPPSECRET . $HJAPPKEY . $count );
        $opt[ CURLOPT_HTTPHEADER ] = [
            'Content-Type:application/json',
            'Hujiang-sign:' . $Hujiang_sign,
            'HJAPPSECRET:' . $HJAPPSECRET,
            'HJAPPkey:' . $HJAPPKEY,
        ];
        /*$opt[CURLOPT_HTTPHEADER]=[
            'Content-Type:application/json',
            'Hujiang-sign:'.$Hujiang_sign,
            'HJAPPSECRET:'.$HJAPPSECRET,
            'HJAPPkey:'.$HJAPPKEY,
        ];*/
        //p($opt);
        $opt = [
            CURLOPT_HTTPHEADER     => [
                'Content-Type:application/json',
                'Hujiang-sign:' . $Hujiang_sign,
                'HJAPPSECRET:' . $HJAPPSECRET,
                'HJAPPkey:' . $HJAPPKEY,
            ],
            CURLOPT_URL            => $url,
            CURLOPT_POST           => $isPost,
            CURLOPT_HEADER         => 0,
            CURLOPT_POSTFIELDS     => self::getSendDataByString( $data ),
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_TIMEOUT        => 10,
            //CURLOPT_REFERER=>"http://bbs.it-home.org/ "
        ];
        if ( self::isHTTPS( $url ) ) {
            $opt[ CURLOPT_SSL_VERIFYHOST ] = false;
            $opt[ CURLOPT_SSL_VERIFYPEER ] = false;
        }
        //p($opt);
        curl_setopt_array( $ch, $opt );
        $res = curl_exec( $ch );

        //$res=json_decode($res_str,true);
        if ( empty( $res ) ) {
            self::$requestStatus = curl_getinfo( $ch );
            curl_close( $ch );

            return FAILED( '接口返回失败' );
        }
        curl_close( $ch );

        return OK( [ 'data' => $res ] );
    }

    /**获取请求信息
     * @return array
     */
    static function getError()
    {
        $errorData = [
            'errorMsg'    => self::$errorInfo[ self::$errorCode ],
            'errorCode'   => self::$errorCode,
            'requestInfo' => [
                'requestUrl'    => self::$requestUrl,
                'requestType'   => self::$requestType,
                'dataType'      => self::$dataType,
                'requestData'   => self::$requestData,
                'requestStatus' => self::$requestStatus
            ]
        ];

        return $errorData;
    }
    static function getDDToken($url,$args=null,$type){
        if(empty($url)){
            exit("请输入URL");
        }
        $data='';
        if($type=='get'&&!empty($args)){
            if(is_array($args)){
                foreach($args as $k=>$v){
                    $data.=$k.'='.$v.'&';
                }
                $data=substr($data,0,-1);
            }elseif(is_string($args)){
                $data=$args;
            }
        }
        if($type=='post'){
            $data=$args;
        }
        $ssl = substr($url, 0, 8) == "https://" ? TRUE : FALSE;
        $ch = curl_init();
        $opt = array(
            CURLOPT_URL     => $url,
            CURLOPT_POST    => (!empty($type)&&$type=='post')?1:0 ,
            CURLOPT_HEADER  => 0,
            CURLOPT_POSTFIELDS      => $data,
            CURLOPT_RETURNTRANSFER  => 1,
            CURLOPT_TIMEOUT         => 60,
        );
        if ($ssl)
        {
            $opt[CURLOPT_SSL_VERIFYHOST] = 2;
            $opt[CURLOPT_SSL_VERIFYPEER] = FALSE;
        }
        @curl_setopt_array($ch, $opt);
        if(isset($_GET['dug'])){
            print_r(curl_exec( $ch ));exit;
        }
        //print_r(curl_exec( $ch ));exit;
        $_res=curl_exec( $ch );

        //p($_res);
        $res=json_decode($_res,true);

        curl_close($ch);
        return $res;
    }
}

