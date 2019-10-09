#!/bin/bash


echo "Habilitando acesso remoto"
echo "Local: localhost:3334"
echo "Remote: cueva.serveo.net:3334"

if ! ssh -R cueva.serveo.net:3334:localhost:3334 serveo.net
then
    echo "Não foi possível habilitar o acesso remoto"
    exit 1
fi

exit 1
echo "Acesso remoto finalizado"