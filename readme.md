root {
    terminal -> npm install
}

api{
    terminal -> npm install
    terminal -> json-server --watch menuData.json --port 3004
}

gulp {
    gulp
}