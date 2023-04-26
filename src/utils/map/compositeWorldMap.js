const im = require('imagemagick');


im.convert(['world_normal.bmp', '-resize', '200%', 'temp1.bmp'], function (err, stdout) {

    if (err) throw err;
    im.convert(['image2.bmp', '-resize', '200%', '-compose', 'overlay', 'temp1.bmp', '-composite', 'temp2.bmp'], function (err, stdout) {
        if (err) throw err;
        im.convert(['image3.dds', '-compose', 'multiply', 'temp2.bmp', '-composite', 'output.png'], function (err, stdout) {
            if (err) throw err;

            console.log('done');
        });
    });
});

