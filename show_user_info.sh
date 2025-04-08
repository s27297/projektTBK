#!/bin/bash
echo "Wyświetla nagłówek z informacją o środowisku kontenera"
uname -a
echo "Pokazuje nazwę bieżącego użytkownika (whoami)"
whoami
echo "Wyświetla pełne informacje o ID użytkownika (id)"
id
echo "Pokazuje zawartość katalogu domowego użytkownika"
ls -la ~
echo "Wyświetla grupy, do których należy użytkownik"
groups
echo "Wyświetla wiadomość zależną od użytkownika (inna dla każdego użytkownika)"
USER=$(whoami)
if [ $USER == "anako" ]; then
  echo "moj profil"
fi
if [ $USER == "user1" ]; then
  echo "jestem pierwshy"
fi
if [ $USER == "user2" ]; then
  echo "i am the second"
fi
if [ $USER == "root" ]; then
  echo "i am ROOT"
fi

node ./project.js