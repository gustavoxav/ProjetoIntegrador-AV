<?php

function dateValidator($date, $format = 'Y-m-d H:i:s')
{
  $d = DateTime::createFromFormat($format, $date);
  return $d && $d->format($format) == $date;
}

function removeFirstCharacter($str)
{
  $charArray = str_split($str);
  array_shift($charArray);
  return implode('', $charArray);
}
