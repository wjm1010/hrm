<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $params = $_POST;
    save_sale_info($params);
}


    //销售管培生信息入库
    function save_sale_info($info)
    {
        if (strpos($_SERVER['HTTP_HOST'], 'zhaopin') !== false ) {
            $url = 'https://hrmsale.hfjy.top/api/AddResume.php';
        } else {
            $url = 'https://t-hrmsale.hfjy.top/api/AddResume.php';
        }
        $res = http_request($url,$info);
        exit($res);
    }

    //HTTP请求（支持HTTP/HTTPS，支持GET/POST）
    function http_request($url, $data = null)
    {
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
        if (!empty($data)){
            curl_setopt($curl, CURLOPT_POST, 1);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        }
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
        $output = curl_exec($curl);
        curl_close($curl);
        return $output;
    }