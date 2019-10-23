#!/bin/bash


echo "Habilitando acesso remoto"
echo "Local: localhost:3334"
echo "Remote: cueva.serveo.net:3334"

LOCAL_URL=localhost:3334
REMOTE_URL=cueva.serveo.net:3334

echo $REMOTE_URL:$LOCAL_URL

if ! autossh -o TCPKeepAlive=yes -o ServerAliveInterval=30 -o ServerAliveCountMax=3 -R $REMOTE_URL:$LOCAL_URL serveo.net
then
    echo "Não foi possível habilitar o acesso remoto"
fi

exit 1
echo "Acesso remoto finalizado"