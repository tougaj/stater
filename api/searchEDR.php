<?php

// include_once 'common.php';
// include_once 'base.php';
// @logGetRequest(dirname(filter_input(INPUT_SERVER, "SCRIPT_FILENAME")) . "/../logs");
header("Cache-control: no-cache, must-revalidate");
// header("Cache-control: public, max-age=3600");
header("Content-type: text/json, charset=utf-8");
// header("Content-type: text/plain, charset=windows-1251");

$sTerm = iconv('UTF-8', 'windows-1251', trim(filter_input(INPUT_GET, 'term')));
// $sTerm = iconv('UTF-8', 'windows-1251', filter_input(INPUT_GET, 'term'));
// $sTerm = trim(filter_input(INPUT_GET, 'term'));
if (empty($sTerm)) die('[]');
$sTerm = preg_replace('/"/', '&quot;', $sTerm);
$sTerm = preg_replace('/\'/', '&apos;', $sTerm);
$sTerm = preg_replace('/&(?!(apos|quot))/', '&amp;', $sTerm);
$sTerm = preg_replace('/([+*()?\[\]\/\\\\])/', '\\\\$1', $sTerm);
// die($sTerm);

$fop = filter_input(INPUT_GET, 'fop', FILTER_VALIDATE_INT);
if (!isset($fop)) $fop = 0;

$findedItems = array();
$path = 'c:\\EDR\\';

include_once './register.php';
$registers = $fop === 0 ? $registerWOFOP : $registersFOP;

$index = 0;
foreach ($registers as $register) {
    $fileName = "{$path}{$register['fileName']}";
    // $fileName = 'c:\EDR\test.dat';
    // var_dump($fileName);
    if (file_exists($fileName)){
        $items = findInFile($sTerm, $fileName);
        if (count($items) !== 0)
            array_push($findedItems, array(
                'index' => $index++,
                'title' => $register['title'],
                'subtitle' => $register['subtitle'],
                'items' => $items,
            ));
    }
}
echo json_encode($findedItems);
// var_dump($findedItems);

function findInFile($sSearchString, $sFileName){
    $sSearchString = preg_replace('/\s+/i', '\s+', $sSearchString);
    // echo "finding \"$sSearchString\" in file \"$sFileName\"\n";
    $fileHandle = fopen($sFileName, 'r');
    $index = 0;
    $finded = 0;
    $result = array();
    $ITEMS_MAX_COUNT = 1000;
    $sOldItem = '';
    if ($fileHandle){
        while (($buffer = fgets($fileHandle)) !== false){
            // $buffer = iconv('windows-1251', 'UTF-8//TRANSLIT', $buffer);

            // Для регистронезависимого поиска можно использовать модификатор u, однако это увеличивает время поиска.
            // (Учитывайте, что поисковая строка при этом должна находиться в кодировке UTF-8)
            if (preg_match("/$sSearchString/i", $buffer) == 1){
                if ($buffer !== $sOldItem){
                    // var_dump($buffer);

                    // $buf = $buffer;
                    $buf = iconv('windows-1251', 'UTF-8//TRANSLIT', $buffer);
                    $xml = @simplexml_load_string($buf);
                    // Такое бывает, т. к. этот файл мы не контролируем, поэтому xml может быть битый
                    if ($xml === false){
                        $buf = htmlspecialchars($buf, ENT_QUOTES);
                        $xml = simplexml_load_string("<RECORD><RAWDATA>$buf</RAWDATA></RECORD>");
                    }
                    
                    array_push($result, $xml);

                    if ($ITEMS_MAX_COUNT <= ++$finded){
                        $xml = simplexml_load_string('<RECORD><WARNING>Реєстр містить ще певну кількість запитів, що задовольняють параметрам пошуку, але вивід результатів зупинено з міркувань збереження продуктивності. Уточніть, будь ласка, запит.</WARNING></RECORD>');
                        // $xml = simplexml_load_string('<RECORD><WARNING>Реєстр містить ще певну кількість запитів, що задовольняють параметрам пошуку, але вивід результатів зупинено з міркувань збереження продуктивності. Уточніть, будь ласка, запит.</WARNING></RECORD>');
                        array_push($result, $xml);
                        fclose($fileHandle);
                        return $result;
                    }
                    $sOldItem = $buffer;
                }
            }
            $index++;
        }
    }
    fclose($fileHandle);
    return $result;
}
?>