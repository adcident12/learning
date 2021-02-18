<?php
    $email = $_POST["email"];
    $password = $_POST["password"];
    $comments = $_POST["comments"];
    $phone = $_POST["phone"];
    $color = $_POST["color"];
    $accept = $_POST["accept"];
    $param = array(); //กรณีไม่ต้อง required ก็ไม่ต้องดัก else
    $returnArray = array();
    $returnArray["form_valid"] = array();
    $returnArray["result"] = array();
    $checkVld = "T";
    $checkAfterCallApi = "F";
    if (!empty($email)) {
        $param['email'] = htmlentities($email);
    } else {
        $param['email'] = "";
    }
    if (!empty($password)) {
        $param['password'] = htmlentities($password);
    } else {
        $param['password'] = "";
    }
    if (!empty($comments)) {
        $param['comments'] = htmlentities($comments);
    } else {
        $param['comments'] = "";
    }
    if (!empty($phone)) {
        $param['phone'] = htmlentities($phone);
    } else {
        $param['phone'] = "";
    }
    if (!empty($color)) {
        $param['color'] = htmlentities($color);
    } else {
        $param['color'] = "";
    }
    $returnArray["form_valid"] = Regex($param);
    foreach ($returnArray as $key => $value) {
        if ($value['status'] != "T") {
            $checkVld = "F";
        }
    }
    if ($checkVld = "T") {
        //Call API
        $returnArray["result"] = "";
        if (!empty($returnArray["result"])) {
            $checkAfterCallApi = "T";
        }
    } else {

    }
    $returnArray["after_call_api"] = $checkAfterCallApi;
    echo json_encode($returnArray);
exit();

function Regex($param) {
    $returnTextShow = array();
    if (isset($param)) {
        foreach($param as $key => $value) {
            if ($key == "email") {
                $pattern = "/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/";
                $textError = "Invalid email format";
                $textCorrect = "Looks good!";
                $textEmpty = "Required field must not be blank.";
            } else if ($key == "password") {
                $pattern = "/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/";
                $textError = "Password must contain at least 8 characters including A-Z, a-z, 0-9.";
                $textCorrect = "Looks good!";
                $textEmpty = "Required field must not be blank.";
            } else if ($key == "comments") {
                $pattern = "/^[a-zA-Z0-9\s,'-]*$/";
                $textError = "Invalid comments format";
                $textCorrect = "Looks good!";
                $textEmpty = "Required field must not be blank.";
            } else if ($key == "phone") {
                $pattern = "/^([0-9]{10})+$/";
                $textError = "Invalid mobilephone format";
                $textCorrect = "Looks good!";
                $textEmpty = "Required field must not be blank.";
            } else if ($key == "color") {
                $pattern = "/^([A-Z]|[a-z]|[\\]|[ ]|[\n]|[กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุูเแโใไๅๆ็่้๊๋์]|[0-9])+$/";
                $textError = "Invalid color format";
                $textCorrect = "Looks good!";
                $textEmpty = "Required field must not be blank.";
            } else if ($key == "accept") {
                $pattern = "/^([A-Z]|[a-z]|[\\]|[ ]|[\n]|[กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุูเแโใไๅๆ็่้๊๋์]|[0-9])+$/";
                $textError = "Invalid accept format";
                $textCorrect = "Looks good!";
                $textEmpty = "Required field must not be blank.";
            }
            if (!empty($value)) {
                if (preg_match($pattern, $param[$key])) {
                    $tempTextShow = array(
                        "text" => $textCorrect,
                        "prefix" => $key,
                        "status" => "T"
                    );
                } else {
                    $tempTextShow = array(
                        "text" => $textError,
                        "prefix" => $key,
                        "status" => "F"
                    );
                }
            } else {
                    $tempTextShow = array(
                        "text" => $textEmpty,
                        "prefix" => $key,
                        "status" => "F"
                    );
            }
            array_push($returnTextShow, $tempTextShow);
        }
    }
    return $returnTextShow;
}

function RegexIsLetter($str) {
    $pattern = "/^[0-9A-Za-z (),._-]+$/";
    try {
        if (!preg_match($pattern, $str)) {
            throw new Exception("Not IsLetter exception");
        }
        return true;
    }
    catch(Exception $e) {
        return false;
    }
}
function RegexisNumber($str) {
    $pattern = "/^[0-9]+$/";
    try {
        if (!preg_match($pattern, $str)) {
            throw new Exception("Not isNumber exception");
        }
        return true;
    }
    catch(Exception $e) {
        return false;
    }
}
function RegexisEmail($str) {
    $pattern = "/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/";
    try {
        if (!preg_match($pattern, $str)) {
            throw new Exception("Not isEmail exception");
        }
        return true;
    }
    catch(Exception $e) {
        return false;
    }
}
function RegexisDateTime($str) {
    $pattern = "/^[0-9A-Za-z: _-]+$/";
    try {
        if (!preg_match($pattern, $str)) {
            throw new Exception("Not isDateTime exception");
        }
        return true;
    }
    catch(Exception $e) {
        return false;
    }
}
?>
