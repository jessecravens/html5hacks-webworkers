var r = 700;
var c = 700;

var a = new Array(r);

for (var i = 0; i < r; i++) {
    a[i] = new Array(c);

    for (var j = 0; j < c; j++) {
        a[i][j] = "[" + i + "," + j + "]";
    }
}

postMessage(a);