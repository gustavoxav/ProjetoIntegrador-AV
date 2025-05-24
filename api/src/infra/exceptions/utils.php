<?php

function dateValidator(string $date, string $format = 'Y-m-d H:i:s'): bool
{
  $d = DateTime::createFromFormat($format, $date);
  return $d && $d->format($format) == $date;
}

function removeFirstCharacter(string $str): string
{
  $charArray = str_split($str);
  array_shift($charArray);
  return implode('', $charArray);
}
